/**
 * output-generator.js — EnvMoss
 *
 * Pembuatan Actionable Outputs:
 *   1. Salin Markdown Checklist (hanya key Missing, tanpa value)
 *   2. Unduh Merged .env (Target asli 100% identik sebagai prefix + key Missing dengan nilai kosong)
 *
 * Sesuai aturan PRD 02-prd-envmoss.md Seksi 11 & 16:
 *   - Client-side murni menggunakan Clipboard API dan Blob API.
 *   - Tidak ada pengiriman data ke server mana pun.
 *   - Nilai variabel rahasia tidak pernah diekspos di Markdown checklist.
 *   - Teks Target asli tidak diubah satu karakter pun pada Merged .env.
 *
 * Internasionalisasi (Milestone 8):
 *   - generateMarkdownChecklist dan generateMergedEnv menerima parameter
 *     opsional `lang` ('en'|'id') untuk mengikuti bahasa antarmuka aktif.
 *     Tanpa argumen, output tetap memakai format Bahasa Indonesia v1.0.0.
 *   - Nama file, nama key, dan nilai tidak pernah diterjemahkan.
 */

import { t } from './i18n.js';

// ---------------------------------------------------------------------------
// 1. Helper Deteksi Line Ending
// ---------------------------------------------------------------------------

/**
 * Mendeteksi gaya line ending yang digunakan pada teks Target:
 * CRLF (\r\n), LF (\n), atau CR (\r). Default ke LF (\n).
 *
 * @param {string} text
 * @returns {'\r\n'|'\n'|'\r'}
 */
export function detectLineEnding(text) {
  if (typeof text !== 'string') return '\n';
  if (text.includes('\r\n')) return '\r\n';
  if (text.includes('\n')) return '\n';
  if (text.includes('\r')) return '\r';
  return '\n';
}

// ---------------------------------------------------------------------------
// 2. Pembuat Markdown Checklist
// ---------------------------------------------------------------------------

/**
 * Menghasilkan task list Markdown hanya dari daftar key yang berstatus Missing.
 * Format sesuai PRD 11.1:
 *
 * ## Checklist Environment
 *
 * - [ ] Tambahkan `API_KEY` ke Target Environment
 * - [ ] Tambahkan `CACHE_DRIVER` ke Target Environment
 *
 * @param {Array<string|{ key: string }>} missingKeys - Daftar key Missing (urutan Base)
 * @param {'en'|'id'} [lang] - Bahasa output; default mengikuti format ID v1.0.0
 * @returns {string} - Teks Markdown checklist, atau string kosong jika tidak ada missing.
 */
export function generateMarkdownChecklist(missingKeys, lang) {
  if (!Array.isArray(missingKeys) || missingKeys.length === 0) {
    return '';
  }

  // Ekstrak nama key unik
  const keys = missingKeys.map((item) => (typeof item === 'string' ? item : item.key));

  const isEn = lang === 'en';
  const title = isEn ? '## Environment Checklist' : '## Checklist Environment';
  const itemTemplate = isEn
    ? (key) => `- [ ] Add \`${key}\` to Target Environment`
    : (key) => `- [ ] Tambahkan \`${key}\` ke Target Environment`;

  const lines = [
    title,
    '',
    ...keys.map(itemTemplate)
  ];

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 3. Pembuat Merged .env
// ---------------------------------------------------------------------------

/**
 * Menghasilkan konten Merged .env:
 * - Menjaga seluruh teks Target asli secara utuh sebagai prefix identik.
 * - Jika ada key Missing, menambahkan komentar penanda dan blok key Missing dengan value kosong.
 * - Jika tidak ada key Missing, mengembalikan teks Target persis apa adanya tanpa penanda.
 *
 * @param {string} targetText - Teks asli Target Environment
 * @param {Array<string|{ key: string }>} missingKeys - Daftar key Missing (urutan Base)
 * @param {'en'|'id'} [lang] - Bahasa komentar penanda; default format ID v1.0.0
 * @returns {string}
 */
export function generateMergedEnv(targetText, missingKeys, lang) {
  const rawTarget = typeof targetText === 'string' ? targetText : '';

  const keys = Array.isArray(missingKeys)
    ? missingKeys.map((item) => (typeof item === 'string' ? item : item.key))
    : [];

  // Aturan 11: Jika tidak ada Missing, hasil unduhan harus sama persis dengan Target asli
  if (keys.length === 0) {
    return rawTarget;
  }

  const le = detectLineEnding(rawTarget);

  let prefix = rawTarget;
  let separator = '';

  // Pastikan ada pemisah baris yang benar antara Target asli dan blok tambahan
  if (prefix.length > 0) {
    if (prefix.endsWith(le + le)) {
      separator = '';
    } else if (prefix.endsWith(le)) {
      separator = le;
    } else {
      separator = le + le;
    }
  }

  const marker = lang === 'en'
    ? '# Added by EnvMoss: Missing keys'
    : '# Ditambahkan oleh EnvMoss: key yang Missing';
  const missingLines = keys.map((key) => `${key}=`).join(le);

  return prefix + separator + marker + le + missingLines;
}

// ---------------------------------------------------------------------------
// 4. Operasi Clipboard (Salin ke Papan Klip)
// ---------------------------------------------------------------------------

/**
 * Menyalin teks ke clipboard pengguna menggunakan Clipboard API.
 *
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  if (!text) {
    throw new Error(t('out.errNoText'));
  }

  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  // Fallback untuk browser lawas atau konteks non-secure
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (!successful) throw new Error(t('out.errExecCopy'));
    return true;
  } catch (err) {
    if (textArea.parentNode) {
      document.body.removeChild(textArea);
    }
    throw new Error(t('out.errClipboard'));
  }
}

// ---------------------------------------------------------------------------
// 5. Operasi Unduh File (Blob API)
// ---------------------------------------------------------------------------

/**
 * Mengunduh string sebagai file teks lokal melalui Blob API.
 * 100% lokal di browser pengguna tanpa transfer jaringan.
 *
 * @param {string} content - Konten file
 * @param {string} [filename='envmoss-merged.env'] - Nama file unduhan
 */
export function downloadFile(content, filename = 'envmoss-merged.env') {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  a.style.display = 'none';

  document.body.appendChild(a);
  a.click();

  // Bersihkan elemen dan Object URL dari memori
  setTimeout(() => {
    if (a.parentNode) {
      document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
  }, 100);
}
