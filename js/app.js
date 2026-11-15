/**
 * app.js — EnvMoss
 *
 * Entry point utama. Mengatur interaksi pengguna:
 *   - File picker (Base & Target)
 *   - Drag-and-drop
 *   - Sinkronisasi file ke textarea
 *   - Pengelolaan state input (replace, clear)
 *   - Aktivasi tombol Bandingkan
 *
 * Aturan privasi (wajib):
 *   - Tidak ada fetch(), XHR, WebSocket, atau mekanisme jaringan untuk data input.
 *   - Tidak ada localStorage, sessionStorage, IndexedDB, atau cookies.
 *   - Tidak ada console.log() yang memuat isi file atau value.
 *   - Isi file hanya ada di memori selama halaman terbuka.
 */

import { compareEnvFiles } from './env-engine.js';
import {
  generateMarkdownChecklist,
  generateMergedEnv,
  copyToClipboard,
  downloadFile
} from './output-generator.js';

// ---------------------------------------------------------------------------
// State aplikasi — hanya di memori, tidak persisten
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SlotState
 * @property {string|null} fileName  - Nama file yang dipilih, null jika belum ada.
 * @property {boolean}     hasFile   - true jika teks berasal dari file (bukan hanya ketikan).
 */

/** @type {{ base: SlotState, target: SlotState, lastComparison: any|null }} */
const state = {
  base: { fileName: null, hasFile: false },
  target: { fileName: null, hasFile: false },
  lastComparison: null,
};

// ---------------------------------------------------------------------------
// Referensi elemen DOM
// ---------------------------------------------------------------------------

const dropzoneBase   = document.getElementById('dropzone-base');
const dropzoneTarget = document.getElementById('dropzone-target');

const fileInputBase   = document.getElementById('file-input-base');
const fileInputTarget = document.getElementById('file-input-target');

const fileBtnBase   = document.getElementById('file-btn-base');
const fileBtnTarget = document.getElementById('file-btn-target');

const textareaBase   = document.getElementById('textarea-base');
const textareaTarget = document.getElementById('textarea-target');

const btnCompare = document.getElementById('btn-compare');
const btnClear   = document.getElementById('btn-clear');

const resultsSection = document.getElementById('results-section');
const emptyState     = document.getElementById('empty-state');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Membaca File sebagai teks UTF-8, menghapus BOM jika ada.
 * Mengembalikan Promise<string> atau melempar Error tanpa mencetak isi file.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      let text = event.target.result;
      // Hapus UTF-8 BOM (\uFEFF) jika ada di awal
      if (text.charCodeAt(0) === 0xFEFF) {
        text = text.slice(1);
      }
      resolve(text);
    };

    reader.onerror = () => {
      // Jangan sertakan detail file di pesan error
      reject(new Error('File gagal dibaca. Pastikan file tidak terkunci atau rusak.'));
    };

    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Menentukan apakah textarea memiliki konten yang valid (bukan hanya whitespace).
 *
 * @param {HTMLTextAreaElement} textarea
 * @returns {boolean}
 */
function hasContent(textarea) {
  return textarea.value.trim().length > 0;
}

/**
 * Memperbarui state tombol Bandingkan berdasarkan konten kedua textarea.
 * Tombol aktif hanya jika keduanya memiliki konten.
 */
function updateCompareButton() {
  const ready = hasContent(textareaBase) && hasContent(textareaTarget);
  btnCompare.disabled = !ready;
  btnCompare.setAttribute('aria-disabled', String(!ready));
}

// ---------------------------------------------------------------------------
// Pengelolaan state kartu input
// ---------------------------------------------------------------------------

/**
 * Memperbarui tampilan kartu input setelah file dipilih atau textarea diisi.
 *
 * @param {'base'|'target'} slot
 * @param {string|null} fileName  - Nama file; null jika input dari textarea.
 */
function setSlotLoaded(slot, fileName) {
  const dropzone = slot === 'base' ? dropzoneBase : dropzoneTarget;
  const card     = dropzone.closest('.input-card');

  state[slot].fileName = fileName;
  state[slot].hasFile  = fileName !== null;

  // Tampilkan nama file di header kartu jika berasal dari file
  const header = card.querySelector('.input-card__header');
  let fileTag  = header.querySelector('.input-card__file-tag');

  if (fileName) {
    if (!fileTag) {
      fileTag = document.createElement('span');
      fileTag.className = 'input-card__file-tag';
      header.appendChild(fileTag);
    }
    // Hanya tampilkan nama file, bukan path
    fileTag.textContent = fileName;
    fileTag.setAttribute('title', fileName);

    // Tambahkan tombol hapus (×) di dalam file-tag
    let clearBtn = fileTag.querySelector('.input-card__clear-btn');
    if (!clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'input-card__clear-btn';
      clearBtn.setAttribute('aria-label', `Hapus file ${slot === 'base' ? 'Base' : 'Target'}`);
      clearBtn.textContent = '×';
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearSlot(slot);
      });
      fileTag.appendChild(clearBtn);
    }

    card.classList.add('input-card--has-file');
    setDropzoneLoaded(dropzone, fileName);
  } else {
    if (fileTag) fileTag.remove();
    card.classList.remove('input-card--has-file');
    setDropzoneEmpty(dropzone);
  }
}

/**
 * Mengosongkan satu slot input (file + textarea + state).
 *
 * @param {'base'|'target'} slot
 */
function clearSlot(slot) {
  const textarea  = slot === 'base' ? textareaBase   : textareaTarget;
  const fileInput = slot === 'base' ? fileInputBase  : fileInputTarget;

  // Kosongkan textarea
  textarea.value = '';

  // Reset file input agar file yang sama bisa dipilih ulang
  fileInput.value = '';

  // Update state dan tampilan
  state[slot].fileName = null;
  state[slot].hasFile  = false;
  setSlotLoaded(slot, null);

  updateCompareButton();
}

// ---------------------------------------------------------------------------
// Dropzone visual states
// ---------------------------------------------------------------------------

/**
 * Menampilkan dropzone dalam kondisi kosong/default.
 *
 * @param {HTMLElement} dropzone
 */
function setDropzoneEmpty(dropzone) {
  dropzone.classList.remove('dropzone--loaded', 'dropzone--drag-over', 'dropzone--error');
  // Kembalikan konten bawaan dropzone
  renderDropzoneContent(dropzone, 'empty');
}

/**
 * Menampilkan dropzone dalam kondisi file sudah dimuat.
 *
 * @param {HTMLElement} dropzone
 * @param {string} fileName
 */
function setDropzoneLoaded(dropzone, fileName) {
  dropzone.classList.remove('dropzone--drag-over', 'dropzone--error');
  dropzone.classList.add('dropzone--loaded');
  renderDropzoneContent(dropzone, 'loaded', fileName);
}

/**
 * Menampilkan dropzone dalam kondisi error.
 *
 * @param {HTMLElement} dropzone
 * @param {string} message  - Pesan error yang ditampilkan ke pengguna (tanpa isi file).
 */
function setDropzoneError(dropzone, message) {
  dropzone.classList.remove('dropzone--loaded', 'dropzone--drag-over');
  dropzone.classList.add('dropzone--error');
  renderDropzoneContent(dropzone, 'error', message);
}

/**
 * Me-render ulang konten dalam dropzone sesuai state.
 * Menjaga tombol file-picker dan hidden input tetap ada.
 *
 * @param {HTMLElement} dropzone
 * @param {'empty'|'loaded'|'error'} stateType
 * @param {string} [info]
 */
function renderDropzoneContent(dropzone, stateType, info) {
  const isBase = dropzone.id === 'dropzone-base';
  const slot   = isBase ? 'base' : 'target';
  const hintId = `dropzone-${slot}-hint`;

  // Simpan referensi ke file input dan tombol (tidak dihapus)
  const fileInput = dropzone.querySelector('input[type="file"]');
  const fileBtn   = dropzone.querySelector('.dropzone__file-btn');

  // Hapus semua anak kecuali file input dan file btn
  Array.from(dropzone.children).forEach((child) => {
    if (child !== fileInput && child !== fileBtn) {
      child.remove();
    }
  });

  // Buat konten baru sesuai state
  if (stateType === 'empty') {
    const icon = createUploadIcon();
    const text = document.createElement('p');
    text.className = 'dropzone__text';
    text.id = hintId;
    text.innerHTML = '<strong>Seret file ke sini</strong><br />atau pilih dari perangkat';

    dropzone.insertBefore(text, fileInput);
    dropzone.insertBefore(icon, text);

  } else if (stateType === 'loaded') {
    const icon = createCheckIcon();
    const text = document.createElement('p');
    text.className = 'dropzone__text dropzone__text--loaded';
    text.id = hintId;
    text.innerHTML = '<strong>File berhasil dibaca</strong><br />Teks telah diisi ke textarea';

    dropzone.insertBefore(text, fileInput);
    dropzone.insertBefore(icon, text);

  } else if (stateType === 'error') {
    const icon = createErrorIcon();
    const text = document.createElement('p');
    text.className = 'dropzone__text dropzone__text--error';
    text.id = hintId;
    // info adalah pesan error yang sudah disanitasi (tidak mengandung isi file)
    text.innerHTML = `<strong>Gagal membaca file</strong><br />${escapeHtml(info || 'Terjadi kesalahan.')}`;

    dropzone.insertBefore(text, fileInput);
    dropzone.insertBefore(icon, text);
  }
}

// ---------------------------------------------------------------------------
// Pembuat ikon SVG inline (lokal, tanpa CDN)
// ---------------------------------------------------------------------------

function createUploadIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'dropzone__icon');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = `
    <path d="M28 20v4a2.667 2.667 0 01-2.667 2.667H6.667A2.667 2.667 0 014 24v-4"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="21.333,10.667 16,5.333 10.667,10.667"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="16" y1="5.333" x2="16" y2="21.333"
      stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  `;
  return svg;
}

function createCheckIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'dropzone__icon dropzone__icon--success');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = `
    <circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2"/>
    <path d="M10 16.5l4 4 8-8" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"/>
  `;
  return svg;
}

function createErrorIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'dropzone__icon dropzone__icon--error');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.innerHTML = `
    <circle cx="16" cy="16" r="13" stroke="currentColor" stroke-width="2"/>
    <line x1="16" y1="10" x2="16" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="16" cy="22" r="1.25" fill="currentColor"/>
  `;
  return svg;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/**
 * Escape karakter HTML agar teks tidak diinterpretasi sebagai markup.
 * Dipakai untuk pesan error yang dirender ke innerHTML.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// Proses file yang dipilih atau di-drop
// ---------------------------------------------------------------------------

/**
 * Memproses satu File, mengisi textarea, dan memperbarui UI.
 * Tidak mencetak isi file ke console.
 *
 * @param {File}            file
 * @param {'base'|'target'} slot
 * @param {HTMLElement}     dropzone
 * @param {HTMLTextAreaElement} textarea
 */
async function processFile(file, slot, dropzone, textarea) {
  try {
    const text = await readFileAsText(file);
    // Isi textarea dengan konten file
    textarea.value = text;
    // Update state dan tampilan
    setSlotLoaded(slot, file.name);
    updateCompareButton();
  } catch (err) {
    // Pesan error yang aman — tidak mengandung isi file atau stack trace lengkap
    setDropzoneError(dropzone, err.message || 'File tidak dapat dibaca.');
    // Pastikan state slot tetap bersih
    state[slot].fileName = null;
    state[slot].hasFile  = false;
    updateCompareButton();
  }
}

// ---------------------------------------------------------------------------
// File Picker
// ---------------------------------------------------------------------------

/**
 * Menghubungkan tombol "Pilih File" ke file input tersembunyi.
 *
 * @param {HTMLButtonElement}   btn
 * @param {HTMLInputElement}    fileInput
 */
function bindFilePicker(btn, fileInput) {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // agar klik tombol tidak memicu klik dropzone
    fileInput.click();
  });
}

// ---------------------------------------------------------------------------
// Drag-and-Drop
// ---------------------------------------------------------------------------

/**
 * Mendaftarkan event drag-and-drop pada satu dropzone.
 *
 * @param {HTMLElement}         dropzone
 * @param {'base'|'target'}     slot
 * @param {HTMLTextAreaElement} textarea
 */
function bindDragAndDrop(dropzone, slot, textarea) {
  // Mencegah browser membuka file secara default
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropzone.classList.add('dropzone--drag-over');
  });

  dropzone.addEventListener('dragleave', (e) => {
    // Hanya hapus state jika pointer benar-benar keluar dari dropzone
    if (!dropzone.contains(e.relatedTarget)) {
      dropzone.classList.remove('dropzone--drag-over');
    }
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dropzone--drag-over');

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Hanya proses file pertama; multiple file tidak didukung per slot
    const file = files[0];
    processFile(file, slot, dropzone, textarea);
  });

  // Klik dropzone (di luar tombol) juga membuka file picker
  dropzone.addEventListener('click', (e) => {
    // Jangan trigger jika yang diklik adalah tombol Pilih File atau clear btn
    if (e.target.closest('.dropzone__file-btn') || e.target.closest('.input-card__clear-btn')) return;
    const fileInput = slot === 'base' ? fileInputBase : fileInputTarget;
    fileInput.click();
  });

  // Keyboard: Enter/Spasi pada dropzone membuka file picker
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const fileInput = slot === 'base' ? fileInputBase : fileInputTarget;
      fileInput.click();
    }
  });
}

// ---------------------------------------------------------------------------
// File Input change handler
// ---------------------------------------------------------------------------

/**
 * Mendaftarkan handler ketika file dipilih melalui file picker.
 *
 * @param {HTMLInputElement}    fileInput
 * @param {'base'|'target'}     slot
 * @param {HTMLElement}         dropzone
 * @param {HTMLTextAreaElement} textarea
 */
function bindFileInput(fileInput, slot, dropzone, textarea) {
  fileInput.addEventListener('change', () => {
    if (!fileInput.files || fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    processFile(file, slot, dropzone, textarea);
    // Reset value agar file yang sama bisa dipilih ulang
    fileInput.value = '';
  });
}

// ---------------------------------------------------------------------------
// Textarea: pantau perubahan untuk memperbarui tombol Bandingkan
// ---------------------------------------------------------------------------

/**
 * Mendaftarkan listener pada textarea untuk mengaktifkan tombol Bandingkan
 * saat konten berubah (paste, ketik, hapus).
 * Jika pengguna mengedit setelah file di-load, hapus asosiasi nama file
 * agar state tidak menyesatkan (sumber sekarang adalah ketikan, bukan file).
 *
 * @param {HTMLTextAreaElement} textarea
 * @param {'base'|'target'}     slot
 */
function bindTextareaInput(textarea, slot) {
  textarea.addEventListener('input', () => {
    // Jika user mengedit textarea setelah file di-load,
    // lepas asosiasi nama file (textarea adalah sumber sekarang)
    if (state[slot].hasFile) {
      state[slot].hasFile  = false;
      state[slot].fileName = null;
      // Hapus file-tag dari header kartu
      const card    = (slot === 'base' ? dropzoneBase : dropzoneTarget).closest('.input-card');
      const fileTag = card.querySelector('.input-card__file-tag');
      if (fileTag) fileTag.remove();
      card.classList.remove('input-card--has-file');
      // Kembalikan dropzone ke empty state
      const dropzone = slot === 'base' ? dropzoneBase : dropzoneTarget;
      setDropzoneEmpty(dropzone);
    }
    updateCompareButton();
  });
}

// ---------------------------------------------------------------------------
// Rendering Hasil Komparasi (Milestone 4)
// ---------------------------------------------------------------------------

/**
 * Mengosongkan tampilan hasil komparasi dan mengembalikan tampilan ke empty state.
 */
function clearResults() {
  if (resultsSection) {
    resultsSection.innerHTML = '';
    resultsSection.classList.remove('is-visible');
  }
  if (emptyState) {
    emptyState.style.display = '';
  }
}

/**
 * Menampilkan pesan feedback aksi di bawah tombol output sidebar.
 *
 * @param {string} message - Pesan feedback (tanpa secret)
 * @param {'success'|'info'|'error'} [type='info']
 */
function showSidebarFeedback(message, type = 'info') {
  const container = document.getElementById('sidebar-feedback-container');
  if (!container) return;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
        <path d="M5 8.5L7 10.5L11 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  } else if (type === 'error') {
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
        <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  } else {
    iconSvg = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 5V8M8 11H8.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  container.innerHTML = `
    <div class="sidebar-feedback sidebar-feedback--${type}" role="status">
      ${iconSvg}
      <span>${escapeHtml(message)}</span>
    </div>
  `;

  // Bersihkan pesan setelah 5 detik
  setTimeout(() => {
    if (container.innerHTML.includes(message)) {
      container.innerHTML = '';
    }
  }, 5000);
}

/**
 * Mengaitkan event handler pada tombol output di sidebar:
 *   - btn-copy-checklist: Menyalin task list Markdown key Missing via Clipboard API
 *   - btn-download-merged: Mengunduh salinan Target + key Missing via Blob API
 *
 * @param {any} result - Hasil komparasi
 */
function attachOutputHooks(result) {
  const copyBtn = document.getElementById('btn-copy-checklist');
  const downloadBtn = document.getElementById('btn-download-merged');

  if (copyBtn && !copyBtn.disabled) {
    copyBtn.addEventListener('click', async () => {
      const markdown = generateMarkdownChecklist(result.missing);
      if (!markdown) {
        showSidebarFeedback('Tidak ada key Missing untuk dibuatkan checklist.', 'info');
        return;
      }

      try {
        await copyToClipboard(markdown);
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M4 9.5L7.5 13L14 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Tersalin ke Clipboard!
        `;
        copyBtn.disabled = true;
        showSidebarFeedback('Checklist Markdown berhasil disalin ke clipboard.', 'success');

        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.disabled = false;
        }, 2000);
      } catch (err) {
        showSidebarFeedback(err.message || 'Gagal menyalin ke clipboard.', 'error');
      }
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      try {
        const targetText = textareaTarget.value;
        const mergedContent = generateMergedEnv(targetText, result.missing);
        downloadFile(mergedContent, 'envmoss-merged.env');

        if (result.missing && result.missing.length > 0) {
          showSidebarFeedback('File envmoss-merged.env diunduh. Harap lengkapi nilai variabel kosong sebelum digunakan.', 'info');
        } else {
          showSidebarFeedback('File envmoss-merged.env diunduh (identik dengan Target asli).', 'success');
        }
      } catch (err) {
        showSidebarFeedback(err.message || 'Gagal membuat file unduhan.', 'error');
      }
    });
  }
}

/**
 * Me-render seluruh komponen hasil komparasi ke DOM di dalam #results-section:
 *   - Warnings Banner (jika terdapat baris yang tidak dapat diparsing)
 *   - No-Difference Banner (jika struktur key cocok sempurna)
 *   - Papan Komparasi Dua Panel (Side-by-Side Diff Board)
 *   - Panel Ringkasan Status & Aksi Sidebar
 *
 * Catatan Privasi Wajib:
 *   - Tidak menampilkan nilai variabel mentah atau secret.
 *   - Nilai selalu ditampilkan dengan placeholder masking '[nilai disembunyikan]'.
 *
 * @param {any} result - Objek hasil dari compareEnvFiles()
 */
function renderResults(result) {
  if (!result || !resultsSection || !emptyState) return;

  // Sembunyikan empty state dan aktifkan results-section
  emptyState.style.display = 'none';
  resultsSection.classList.add('is-visible');

  const { summary, warnings, board } = result;

  let html = '';

  // 1. Parsing Warnings Banner jika ada
  if (summary.hasWarnings) {
    const allWarnings = [
      ...warnings.base.map(w => ({ ...w, side: 'Base' })),
      ...warnings.target.map(w => ({ ...w, side: 'Target' }))
    ];

    html += `
      <aside class="warnings-banner" role="alert" aria-label="Peringatan penguraian file">
        <div class="warnings-banner__header">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M10 2L1 18H19L10 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M10 8V12M10 15H10.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h3 class="warnings-banner__title">Parsing Warning (${allWarnings.length} baris tidak dapat dianalisis)</h3>
        </div>
        <p class="warnings-banner__desc">
          Baris berikut tidak sesuai format yang didukung sehingga tidak dimasukkan ke dalam hasil komparasi.
          Hasil pemeriksaan di bawah mungkin belum mencakup konfigurasi dari baris-baris ini.
        </p>
        <ul class="warnings-banner__list">
          ${allWarnings.map(w => `
            <li class="warnings-banner__item">
              <span class="warnings-banner__tag">${escapeHtml(w.side)}</span>
              <span>Baris ${w.line}:</span>
              <span>${escapeHtml(w.reason)}</span>
            </li>
          `).join('')}
        </ul>
      </aside>
    `;
  }

  // 2. No-Difference Banner jika struktur cocok sempurna
  const isPerfectMatch = summary.missingCount === 0 &&
                         summary.orphanCount === 0 &&
                         summary.mismatchCount === 0 &&
                         summary.duplicateGroupCount === 0;

  if (isPerfectMatch) {
    html += `
      <div class="no-difference-banner" role="status" aria-label="Struktur cocok sempurna">
        <svg class="no-difference-banner__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12.5L10.5 15L16 9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>
          <h3 class="no-difference-banner__title">Struktur Key Cocok Sempurna</h3>
          <p class="no-difference-banner__desc">
            Tidak ditemukan key yang Missing, Orphan, Duplicate, atau Mismatch antara Base dan Target.
            <br /><small>(Catatan: Ini menunjukkan kesesuaian struktur konfigurasi, bukan kebenaran value runtime aplikasi Anda).</small>
          </p>
        </div>
      </div>
    `;
  }

  // 3. Papan Komparasi Dua Panel & Sidebar Hasil
  html += `
    <div class="results-layout">
      <!-- Papan Komparasi Dua Panel -->
      <div class="diff-board-card">
        <div class="diff-board-card__header">
          <div class="diff-board-card__title">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <rect x="2" y="3" width="7" height="14" rx="2" stroke="currentColor" stroke-width="1.75"/>
              <rect x="11" y="3" width="7" height="14" rx="2" stroke="currentColor" stroke-width="1.75"/>
            </svg>
            Papan Komparasi Lingkungan
          </div>
          <span class="diff-board-card__subtitle">Nilai variabel disembunyikan</span>
        </div>

        <div class="diff-board-grid">
          <!-- Kolom Base -->
          <div class="diff-column diff-column--base">
            <div class="diff-column__header">
              <span>Base Environment</span>
              <span class="diff-column__count">${summary.totalUniqueBaseKeys} key</span>
            </div>
            <ul class="diff-column__list" id="diff-list-base">
  `;

  // Pemetaan baris sejajar (aligned side-by-side rows)
  const baseMap = new Map();
  board.base.forEach(item => baseMap.set(item.key, item));

  const targetMap = new Map();
  board.target.forEach(item => targetMap.set(item.key, item));

  // Kumpulkan master key list: urutan kemunculan Base, diikuti Orphan di Target
  const masterKeys = [];
  board.base.forEach(item => masterKeys.push(item.key));
  board.target.forEach(item => {
    if (!baseMap.has(item.key)) {
      masterKeys.push(item.key);
    }
  });

  let baseRowsHtml = '';
  let targetRowsHtml = '';

  for (const key of masterKeys) {
    const baseItem = baseMap.get(key);
    const targetItem = targetMap.get(key);

    // Render Sisi Base
    if (baseItem) {
      const rowClass = `diff-row diff-row--${baseItem.status.toLowerCase()}`;
      const badgeClass = `badge badge--${baseItem.status.toLowerCase()}`;
      const statusLabel = baseItem.status === 'Mismatch' ? 'Value berbeda' : baseItem.status;
      const dupPill = baseItem.isDuplicate
        ? `<span class="badge badge--duplicate" title="Muncul ${baseItem.duplicateCount} kali (baris ${baseItem.lines.join(', ')})">Duplikat (${baseItem.duplicateCount}×)</span>`
        : '';

      baseRowsHtml += `
        <li class="${rowClass}">
          <div class="diff-row__left">
            <span class="diff-row__line" title="Baris ${baseItem.line}">L${baseItem.line}</span>
            <span class="diff-row__key">${escapeHtml(key)}</span>
            <span class="diff-row__value-mask">= [nilai disembunyikan]</span>
          </div>
          <div class="diff-row__badges">
            ${dupPill}
            <span class="${badgeClass}">${statusLabel}</span>
          </div>
        </li>
      `;
    } else {
      // Slot kosong di Base karena key ini Orphan di Target
      baseRowsHtml += `
        <li class="diff-row diff-row--empty" aria-label="Tidak ada di Base">
          <span>— Tidak terdaftar di Base —</span>
        </li>
      `;
    }

    // Render Sisi Target
    if (targetItem) {
      const rowClass = `diff-row diff-row--${targetItem.status.toLowerCase()}`;
      const badgeClass = `badge badge--${targetItem.status.toLowerCase()}`;
      const statusLabel = targetItem.status === 'Mismatch' ? 'Value berbeda' : targetItem.status;
      const dupPill = targetItem.isDuplicate
        ? `<span class="badge badge--duplicate" title="Muncul ${targetItem.duplicateCount} kali (baris ${targetItem.lines.join(', ')})">Duplikat (${targetItem.duplicateCount}×)</span>`
        : '';

      targetRowsHtml += `
        <li class="${rowClass}">
          <div class="diff-row__left">
            <span class="diff-row__line" title="Baris ${targetItem.line}">L${targetItem.line}</span>
            <span class="diff-row__key">${escapeHtml(key)}</span>
            <span class="diff-row__value-mask">= [nilai disembunyikan]</span>
          </div>
          <div class="diff-row__badges">
            ${dupPill}
            <span class="${badgeClass}">${statusLabel}</span>
          </div>
        </li>
      `;
    } else {
      // Slot kosong di Target karena key ini Missing
      targetRowsHtml += `
        <li class="diff-row diff-row--empty" aria-label="Tidak ada di Target">
          <span>— Tidak ditemukan di Target —</span>
        </li>
      `;
    }
  }

  html += baseRowsHtml;
  html += `
            </ul>
          </div>

          <!-- Kolom Target -->
          <div class="diff-column diff-column--target">
            <div class="diff-column__header">
              <span>Target Environment</span>
              <span class="diff-column__count">${summary.totalUniqueTargetKeys} key</span>
            </div>
            <ul class="diff-column__list" id="diff-list-target">
              ${targetRowsHtml}
            </ul>
          </div>
        </div>
      </div>

      <!-- Sidebar Ringkasan & Aksi -->
      <aside class="results-sidebar" aria-label="Ringkasan status dan aksi hasil">
        <div class="summary-card">
          <h3 class="summary-card__title">Ringkasan Status</h3>

          <div class="summary-stat-grid">
            <!-- Missing -->
            <div class="summary-stat-box summary-stat-box--missing">
              <span class="summary-stat-box__num">${summary.missingCount}</span>
              <span class="summary-stat-box__label">Missing</span>
              <span class="summary-stat-box__desc">Key belum ada di Target</span>
            </div>

            <!-- Orphan -->
            <div class="summary-stat-box summary-stat-box--orphan">
              <span class="summary-stat-box__num">${summary.orphanCount}</span>
              <span class="summary-stat-box__label">Orphan / Extra</span>
              <span class="summary-stat-box__desc">Key tambahan di Target</span>
            </div>

            <!-- Duplicate -->
            <div class="summary-stat-box summary-stat-box--duplicate">
              <span class="summary-stat-box__num">${summary.duplicateGroupCount}</span>
              <span class="summary-stat-box__label">Duplicate</span>
              <span class="summary-stat-box__desc">Kelompok key berulang</span>
            </div>

            <!-- Mismatch -->
            <div class="summary-stat-box summary-stat-box--mismatch">
              <span class="summary-stat-box__num">${summary.mismatchCount}</span>
              <span class="summary-stat-box__label">Mismatch</span>
              <span class="summary-stat-box__desc">Key sama, nilai berbeda</span>
            </div>
          </div>

          <div class="sidebar-actions">
            <button
              type="button"
              class="btn btn--primary"
              id="btn-copy-checklist"
              ${summary.missingCount === 0 ? 'disabled aria-disabled="true"' : ''}
              title="${summary.missingCount === 0 ? 'Tidak ada key Missing untuk dibuatkan checklist' : 'Salin daftar tugas key Missing dalam format Markdown'}"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <rect x="5" y="5" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M3 13V3.5C3 3.22386 3.22386 3 3.5 3H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Salin Markdown Checklist
            </button>

            <button
              type="button"
              class="btn btn--secondary"
              id="btn-download-merged"
              title="Unduh salinan Target yang telah dilengkapi key Missing dengan nilai kosong"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                <path d="M3 13v2a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5v-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="5.5,8.5 9,12 12.5,8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="9" y1="2" x2="9" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Unduh Merged .env
            </button>
          </div>

          <div class="sidebar-feedback-container" id="sidebar-feedback-container" aria-live="polite"></div>

          <div class="sidebar-privacy">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <path d="M8 1.5L2 4V8C2 11.314 4.686 14.314 8 15C11.314 14.314 14 11.314 14 8V4L8 1.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>100% Client-Side. Pemrosesan dilakukan di memori browser — tidak ada data dikirim ke server.</span>
          </div>
        </div>
      </aside>
    </div>
  `;

  resultsSection.innerHTML = html;

  // Pasang hook output
  attachOutputHooks(result);

  // Gulir halus ke hasil agar pengguna segera melihat tabel komparasi
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------------------------------------------------------------------
// Tombol Hapus Semua
// ---------------------------------------------------------------------------

function bindClearAll() {
  btnClear.addEventListener('click', () => {
    clearSlot('base');
    clearSlot('target');
    state.lastComparison = null;
    clearResults();
    // Reset tampilan kedua dropzone
    setDropzoneEmpty(dropzoneBase);
    setDropzoneEmpty(dropzoneTarget);
    // Pastikan tombol compare nonaktif
    updateCompareButton();
  });
}

// ---------------------------------------------------------------------------
// Tombol Bandingkan
// ---------------------------------------------------------------------------

function bindCompare() {
  btnCompare.addEventListener('click', () => {
    // Guard: tombol seharusnya tidak bisa diklik saat disabled
    if (!hasContent(textareaBase) || !hasContent(textareaTarget)) return;

    // Jalankan engine komparasi lokal di browser
    state.lastComparison = compareEnvFiles(textareaBase.value, textareaTarget.value);

    // Render hasil komparasi ke papan diff dan panel ringkasan
    renderResults(state.lastComparison);
  });
}

// ---------------------------------------------------------------------------
// Inisialisasi
// ---------------------------------------------------------------------------

function init() {
  // Hubungkan tombol "Pilih File" ke file input masing-masing
  bindFilePicker(fileBtnBase,   fileInputBase);
  bindFilePicker(fileBtnTarget, fileInputTarget);

  // Drag-and-drop untuk kedua dropzone
  bindDragAndDrop(dropzoneBase,   'base',   textareaBase);
  bindDragAndDrop(dropzoneTarget, 'target', textareaTarget);

  // File picker change handler
  bindFileInput(fileInputBase,   'base',   dropzoneBase,   textareaBase);
  bindFileInput(fileInputTarget, 'target', dropzoneTarget, textareaTarget);

  // Textarea: pantau perubahan
  bindTextareaInput(textareaBase,   'base');
  bindTextareaInput(textareaTarget, 'target');

  // Tombol aksi
  bindClearAll();
  bindCompare();

  // Pastikan tombol Bandingkan dalam kondisi yang benar saat halaman dimuat
  updateCompareButton();
}

// Jalankan init setelah DOM siap
// (script dimuat dengan type="module" sehingga sudah deferred secara default)
init();
