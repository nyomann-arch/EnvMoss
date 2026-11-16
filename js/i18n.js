/**
 * i18n.js — EnvMoss
 *
 * Kamus terjemahan lokal English (en) dan Bahasa Indonesia (id) beserta
 * mekanisme penerapannya ke DOM.
 *
 * Aturan (wajib):
 *   - Tanpa API terjemahan, tanpa request jaringan, tanpa dependensi eksternal.
 *   - Nama teknis (Base, Target, Missing, Orphan, Duplicate, Mismatch, key
 *     environment variable) tidak pernah diterjemahkan.
 *   - Nilai variabel dan isi file .env bukan bagian dari kamus ini.
 *   - Preferensi bahasa hanya disimpan sebagai kode 'en'|'id' pada key
 *     envmoss:language oleh site.js — modul ini tidak menulis storage.
 *
 * Cara penandaan di HTML:
 *   - data-i18n="key"        → textContent
 *   - data-i18n-html="key"   → innerHTML (nilai kamus boleh memuat markup)
 *   - data-i18n-attr="a:k;b:k2" → setAttribute untuk pasangan atribut:key
 *
 * Selama bootstrap, <html data-i18n-pending="true"> menyembunyikan elemen
 * bertanda agar teks fallback tidak terlihat sebelum kamus diterapkan.
 * initI18n() selalu melepas penanda tersebut — bahkan saat gagal — dengan
 * fallback English agar halaman tidak tersembunyi selamanya.
 */

// ---------------------------------------------------------------------------
// Kamus terjemahan
// ---------------------------------------------------------------------------

const STRINGS = {
  en: {
    // --- Navbar global ---
    'nav.aria': 'Main navigation',
    'nav.brandAria': 'EnvMoss — go to home page',
    'nav.langAria': 'Select interface language',
    'nav.themeAria': 'Change display theme',
    'nav.privacyAria': 'All processing happens in your browser',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'theme.ariaState': 'Current theme: {state}. Activate to change theme.',

    // --- Landing ---
    'landing.title': 'EnvMoss — Compare .env Files Locally & Privately',
    'landing.heroTitle': 'Compare your <code>.env</code> files without leaving your browser',
    'landing.heroLead': 'EnvMoss helps you find missing keys, duplicate keys, and value differences between two environment files — processed entirely locally on your device.',
    'landing.ctaTool': 'Open Tool',
    'landing.ctaGuide': 'Read the Guide',
    'landing.stepsTitle': 'How it works',
    'landing.step1Title': 'Enter Base and Target',
    'landing.step1Text': 'Paste, drop, or pick two <code>.env</code> files — a reference (Base) and the one you want to inspect (Target).',
    'landing.step2Title': 'Compare',
    'landing.step2Text': 'EnvMoss diffs the key structure entirely in your browser and groups findings into four statuses.',
    'landing.step3Title': 'Act on the results',
    'landing.step3Text': 'Copy a Markdown checklist of missing keys or download a merged <code>.env</code> to fill the gaps.',
    'landing.statusTitle': 'What EnvMoss finds',
    'landing.statusMissing': 'Key exists in Base but not yet in Target — a gap to fill.',
    'landing.statusOrphan': 'Extra key that exists only in Target — review it, but it is not automatically obsolete.',
    'landing.statusDuplicate': 'Same key declared more than once within a single file — reported per key group per file.',
    'landing.statusMismatch': 'Same key, different value across files — informational, not an error.',
    'landing.privacyTitle': 'Privacy by design',
    'landing.privacyText': 'Your <code>.env</code> files stay in your browser. EnvMoss does not upload them to a server, does not store them, and does not send them to third-party services.',
    'landing.outputsTitle': 'Actionable outputs',
    'landing.outputChecklistTitle': 'Markdown Checklist',
    'landing.outputChecklistText': 'Copy a ready-to-paste task list of every Missing key to track what still needs to be added to your Target.',
    'landing.outputMergedTitle': 'Merged .env',
    'landing.outputMergedText': 'Download a copy of your Target completed with the Missing keys as empty values, ready for you to fill in.',
    'landing.linksTitle': 'Learn more',
    'landing.linkGuideTitle': 'Read the Guide',
    'landing.linkGuideText': 'Step-by-step usage, supported syntax, and troubleshooting.',
    'landing.linkRepoTitle': 'Source on GitHub',
    'landing.linkRepoText': 'Inspect the code, report issues, or contribute.',

    // --- Guide ---
    'guide.title': 'Guide — EnvMoss',
    'guide.h1': 'EnvMoss Guide',
    'guide.lead': 'How to use EnvMoss to compare two environment files locally in your browser.',
    'guide.startTitle': 'Getting started',
    'guide.step1': 'Open the <a href="../app/">Comparison Tool</a>.',
    'guide.step2': 'Enter the <strong>Base Environment</strong> (usually <code>.env.example</code>) and the <strong>Target Environment</strong> (the file you want to inspect) via drag-and-drop, the file picker, or copy-paste into the textarea.',
    'guide.step3': 'Press <strong>Compare</strong> to see Missing, Orphan, Duplicate, and Mismatch.',
    'guide.step4': 'Use <strong>Copy Markdown Checklist</strong> or <strong>Download Merged .env</strong> to follow up on the results.',
    'guide.privacyTitle': 'Privacy',
    'guide.privacyText': 'The contents of your <code>.env</code> files stay in your browser. EnvMoss does not upload them to a server and does not store them permanently.',

    // --- Tool: elemen statis ---
    'tool.title': 'EnvMoss — Privacy-First Local .env File Comparison & Merge Tool (Zero-Backend)',
    'tool.privacyAria': 'Privacy information',
    'tool.privacyText': 'Your <code>.env</code> file stays in your browser. EnvMoss does not upload it to a server.',
    'tool.inputSection': 'Enter environment files',
    'tool.hintBase': 'e.g.: .env.example',
    'tool.hintTarget': 'e.g.: .env, .env.production',
    'tool.dropzoneBaseAria': 'Base Environment file drop area. Press Enter or Space to open the file picker.',
    'tool.dropzoneTargetAria': 'Target Environment file drop area. Press Enter or Space to open the file picker.',
    'tool.dropzoneEmpty': '<strong>Drag file here</strong><br />or choose from your device',
    'tool.fileInputBase': 'Choose Base Environment file',
    'tool.fileInputTarget': 'Choose Target Environment file',
    'tool.pickFile': 'Choose File',
    'tool.pasteLabel': 'Or paste the file contents here:',
    'tool.placeholderBase': '# Paste the contents of .env.example here\nAPP_NAME=\nAPI_KEY=\nDATABASE_URL=',
    'tool.placeholderTarget': '# Paste the contents of .env.local or .env.production here\nAPP_NAME=envmoss\nDATABASE_URL=localhost',
    'tool.textareaBase': 'Base Environment content',
    'tool.textareaTarget': 'Target Environment content',
    'tool.actions': 'Primary actions',
    'tool.compare': 'Compare',
    'tool.clearAll': 'Clear All',
    'tool.clearAllAria': 'Clear all inputs and results',
    'tool.compareHint': 'The button activates once both Base and Target inputs are filled.',
    'tool.results': 'Comparison results',
    'tool.emptyAria': 'No comparison results yet',
    'tool.emptyTitle': 'Comparison results will appear here',
    'tool.emptyDesc': 'Enter Base and Target Environment, then press <strong>Compare</strong> to see key structure differences.',
    'tool.stepsAria': 'Usage steps',
    'tool.stepEnterBase': 'Enter Base',
    'tool.stepEnterTarget': 'Enter Target',
    'tool.stepCompare': 'Press Compare',

    // --- Tool: string dinamis (app.js) ---
    'tool.errReadFile': 'The file could not be read. Make sure the file is not locked or corrupted.',
    'tool.errFileUnreadable': 'The file could not be read.',
    'tool.clearFile': 'Remove {slot} file',
    'tool.dropzoneLoaded': '<strong>File read successfully</strong><br />Text has been filled into the textarea',
    'tool.dropzoneErrorTitle': 'Failed to read file',
    'tool.errGeneric': 'An error occurred.',
    'tool.fbNoMissing': 'There are no Missing keys to turn into a checklist.',
    'tool.copied': 'Copied to Clipboard!',
    'tool.fbCopied': 'Markdown checklist copied to clipboard.',
    'tool.errCopy': 'Failed to copy to clipboard.',
    'tool.fbDownloadedFill': 'envmoss-merged.env downloaded. Please fill in the empty variable values before use.',
    'tool.fbDownloadedSame': 'envmoss-merged.env downloaded (identical to the original Target).',
    'tool.errDownload': 'Failed to create the download file.',

    // --- Tool: hasil komparasi ---
    'tool.warnAria': 'File parsing warnings',
    'tool.warnTitle': 'Parsing Warning ({count} lines could not be analyzed)',
    'tool.warnDesc': 'The following lines do not match a supported format and were excluded from the comparison results. The check below may not cover configuration from these lines.',
    'tool.warnLine': 'Line {line}:',
    'tool.lineLabel': 'Line {line}',
    'tool.perfectAria': 'Perfect key structure match',
    'tool.perfectTitle': 'Key Structure Matches Perfectly',
    'tool.perfectDesc': 'No Missing, Orphan, Duplicate, or Mismatch keys were found between Base and Target.<br /><small>(Note: this indicates a match in configuration structure, not the correctness of your app\'s runtime values.)</small>',
    'tool.boardTitle': 'Environment Comparison Board',
    'tool.boardSubtitle': 'Variable values hidden',
    'tool.keysCount': '{count} keys',
    'tool.statusMismatchLabel': 'Different value',
    'tool.dupTitle': 'Appears {count} times (lines {lines})',
    'tool.dupBadge': 'Duplicate ({count}×)',
    'tool.valueMask': '= [value hidden]',
    'tool.rowEmptyBaseAria': 'Not in Base',
    'tool.rowEmptyBaseText': '— Not registered in Base —',
    'tool.rowEmptyTargetAria': 'Not in Target',
    'tool.rowEmptyTargetText': '— Not found in Target —',
    'tool.sidebarAria': 'Result status summary and actions',
    'tool.summaryTitle': 'Status Summary',
    'tool.statMissingDesc': 'Key not yet in Target',
    'tool.statOrphanDesc': 'Extra key in Target',
    'tool.statDuplicateDesc': 'Groups of repeated keys',
    'tool.statMismatchDesc': 'Same key, different value',
    'tool.copyTitleEnabled': 'Copy the list of Missing keys in Markdown format',
    'tool.copyTitleDisabled': 'No Missing keys to turn into a checklist',
    'tool.copyBtn': 'Copy Markdown Checklist',
    'tool.downloadTitle': 'Download a copy of Target completed with Missing keys as empty values',
    'tool.downloadBtn': 'Download Merged .env',
    'tool.privacyNote': '100% Client-Side. Processing happens in browser memory — no data is sent to a server.',

    // --- Parsing warning engine (reasonKey) ---
    'engine.warn.noEquals': "Unrecognized assignment format: no '=' separator found",
    'engine.warn.invalidKey': 'Invalid key name: must start with a letter/underscore and contain only alphanumeric characters, underscore, dot, or hyphen',
    'engine.warn.unclosedDouble': 'Opening double quote is not closed',
    'engine.warn.unclosedSingle': 'Opening single quote is not closed',
    'engine.warn.trailingAfterQuote': 'Invalid trailing text after the closing quote',

    // --- output-generator.js ---
    'out.errNoText': 'There is no text to copy.',
    'out.errExecCopy': 'Manual copy via execCommand failed.',
    'out.errClipboard': 'Clipboard API is not supported or permission was denied by the browser.'
  },

  id: {
    // --- Navbar global ---
    'nav.aria': 'Navigasi utama',
    'nav.brandAria': 'EnvMoss — ke halaman utama',
    'nav.langAria': 'Pilih bahasa antarmuka',
    'nav.themeAria': 'Ubah tema tampilan',
    'nav.privacyAria': 'Semua pemrosesan dilakukan di browser Anda',
    'theme.light': 'Terang',
    'theme.dark': 'Gelap',
    'theme.system': 'Sistem',
    'theme.ariaState': 'Tema saat ini: {state}. Aktifkan untuk mengganti tema.',

    // --- Landing ---
    'landing.title': 'EnvMoss — Bandingkan File .env Secara Lokal & Privat',
    'landing.heroTitle': 'Bandingkan file <code>.env</code> Anda tanpa meninggalkan browser',
    'landing.heroLead': 'EnvMoss membantu menemukan key yang hilang, key duplikat, dan perbedaan value antara dua file environment — sepenuhnya diproses secara lokal di perangkat Anda.',
    'landing.ctaTool': 'Buka Tool',
    'landing.ctaGuide': 'Baca Panduan',
    'landing.stepsTitle': 'Cara kerjanya',
    'landing.step1Title': 'Masukkan Base dan Target',
    'landing.step1Text': 'Tempel, seret, atau pilih dua file <code>.env</code> — referensi (Base) dan file yang ingin diperiksa (Target).',
    'landing.step2Title': 'Bandingkan',
    'landing.step2Text': 'EnvMoss membandingkan struktur key sepenuhnya di browser Anda dan mengelompokkan temuan ke dalam empat status.',
    'landing.step3Title': 'Tindak lanjuti hasilnya',
    'landing.step3Text': 'Salin checklist Markdown berisi key yang hilang atau unduh <code>.env</code> gabungan untuk mengisi kekurangannya.',
    'landing.statusTitle': 'Apa yang ditemukan EnvMoss',
    'landing.statusMissing': 'Key ada di Base tetapi belum ada di Target — celah yang perlu diisi.',
    'landing.statusOrphan': 'Key tambahan yang hanya ada di Target — periksa, tetapi tidak otomatis dianggap usang.',
    'landing.statusDuplicate': 'Key yang sama dideklarasikan lebih dari sekali dalam satu file — dilaporkan per grup key per file.',
    'landing.statusMismatch': 'Key sama, value berbeda antar file — bersifat informatif, bukan error.',
    'landing.privacyTitle': 'Privasi by design',
    'landing.privacyText': 'File <code>.env</code> Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server, tidak menyimpannya, dan tidak mengirimkannya ke layanan pihak ketiga.',
    'landing.outputsTitle': 'Output yang bisa ditindaklanjuti',
    'landing.outputChecklistTitle': 'Markdown Checklist',
    'landing.outputChecklistText': 'Salin daftar tugas siap tempel berisi setiap key Missing untuk melacak apa yang masih perlu ditambahkan ke Target Anda.',
    'landing.outputMergedTitle': 'Merged .env',
    'landing.outputMergedText': 'Unduh salinan Target Anda yang telah dilengkapi key Missing sebagai value kosong, siap untuk Anda isi.',
    'landing.linksTitle': 'Pelajari lebih lanjut',
    'landing.linkGuideTitle': 'Baca Panduan',
    'landing.linkGuideText': 'Panduan penggunaan langkah demi langkah, sintaks yang didukung, dan pemecahan masalah.',
    'landing.linkRepoTitle': 'Kode Sumber di GitHub',
    'landing.linkRepoText': 'Periksa kode, laporkan masalah, atau berkontribusi.',

    // --- Guide ---
    'guide.title': 'Panduan — EnvMoss',
    'guide.h1': 'Panduan EnvMoss',
    'guide.lead': 'Cara menggunakan EnvMoss untuk membandingkan dua file environment secara lokal di browser.',
    'guide.startTitle': 'Mulai di sini',
    'guide.step1': 'Buka <a href="../app/">Comparison Tool</a>.',
    'guide.step2': 'Masukkan <strong>Base Environment</strong> (biasanya <code>.env.example</code>) dan <strong>Target Environment</strong> (file yang ingin diperiksa) melalui drag-and-drop, pemilih file, atau copy-paste ke textarea.',
    'guide.step3': 'Tekan <strong>Bandingkan</strong> untuk melihat Missing, Orphan, Duplicate, dan Mismatch.',
    'guide.step4': 'Gunakan <strong>Salin Markdown Checklist</strong> atau <strong>Unduh Merged .env</strong> untuk menindaklanjuti hasil.',
    'guide.privacyTitle': 'Privasi',
    'guide.privacyText': 'Isi file <code>.env</code> Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server dan tidak menyimpannya secara permanen.',

    // --- Tool: elemen statis ---
    'tool.title': 'EnvMoss — Alat Perbandingan & Penggabungan File .env Lokal & Privat (Tanpa Backend)',
    'tool.privacyAria': 'Informasi privasi',
    'tool.privacyText': 'File <code>.env</code> Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server.',
    'tool.inputSection': 'Masukkan file environment',
    'tool.hintBase': 'contoh: .env.example',
    'tool.hintTarget': 'contoh: .env, .env.production',
    'tool.dropzoneBaseAria': 'Area drop file Base Environment. Tekan Enter atau Spasi untuk membuka pemilih file.',
    'tool.dropzoneTargetAria': 'Area drop file Target Environment. Tekan Enter atau Spasi untuk membuka pemilih file.',
    'tool.dropzoneEmpty': '<strong>Seret file ke sini</strong><br />atau pilih dari perangkat',
    'tool.fileInputBase': 'Pilih file Base Environment',
    'tool.fileInputTarget': 'Pilih file Target Environment',
    'tool.pickFile': 'Pilih File',
    'tool.pasteLabel': 'Atau tempel isi file di sini:',
    'tool.placeholderBase': '# Tempel isi .env.example di sini\nAPP_NAME=\nAPI_KEY=\nDATABASE_URL=',
    'tool.placeholderTarget': '# Tempel isi .env.local atau .env.production di sini\nAPP_NAME=envmoss\nDATABASE_URL=localhost',
    'tool.textareaBase': 'Konten Base Environment',
    'tool.textareaTarget': 'Konten Target Environment',
    'tool.actions': 'Aksi utama',
    'tool.compare': 'Bandingkan',
    'tool.clearAll': 'Hapus Semua',
    'tool.clearAllAria': 'Hapus semua input dan hasil',
    'tool.compareHint': 'Tombol aktif setelah kedua input Base dan Target terisi.',
    'tool.results': 'Hasil komparasi',
    'tool.emptyAria': 'Belum ada hasil komparasi',
    'tool.emptyTitle': 'Hasil komparasi akan muncul di sini',
    'tool.emptyDesc': 'Masukkan Base dan Target Environment, lalu tekan <strong>Bandingkan</strong> untuk melihat perbedaan struktur key.',
    'tool.stepsAria': 'Langkah penggunaan',
    'tool.stepEnterBase': 'Masukkan Base',
    'tool.stepEnterTarget': 'Masukkan Target',
    'tool.stepCompare': 'Tekan Bandingkan',

    // --- Tool: string dinamis (app.js) ---
    'tool.errReadFile': 'File gagal dibaca. Pastikan file tidak terkunci atau rusak.',
    'tool.errFileUnreadable': 'File tidak dapat dibaca.',
    'tool.clearFile': 'Hapus file {slot}',
    'tool.dropzoneLoaded': '<strong>File berhasil dibaca</strong><br />Teks telah diisi ke textarea',
    'tool.dropzoneErrorTitle': 'Gagal membaca file',
    'tool.errGeneric': 'Terjadi kesalahan.',
    'tool.fbNoMissing': 'Tidak ada key Missing untuk dibuatkan checklist.',
    'tool.copied': 'Tersalin ke Clipboard!',
    'tool.fbCopied': 'Checklist Markdown berhasil disalin ke clipboard.',
    'tool.errCopy': 'Gagal menyalin ke clipboard.',
    'tool.fbDownloadedFill': 'File envmoss-merged.env diunduh. Harap lengkapi nilai variabel kosong sebelum digunakan.',
    'tool.fbDownloadedSame': 'File envmoss-merged.env diunduh (identik dengan Target asli).',
    'tool.errDownload': 'Gagal membuat file unduhan.',

    // --- Tool: hasil komparasi ---
    'tool.warnAria': 'Peringatan penguraian file',
    'tool.warnTitle': 'Parsing Warning ({count} baris tidak dapat dianalisis)',
    'tool.warnDesc': 'Baris berikut tidak sesuai format yang didukung sehingga tidak dimasukkan ke dalam hasil komparasi. Hasil pemeriksaan di bawah mungkin belum mencakup konfigurasi dari baris-baris ini.',
    'tool.warnLine': 'Baris {line}:',
    'tool.lineLabel': 'Baris {line}',
    'tool.perfectAria': 'Struktur cocok sempurna',
    'tool.perfectTitle': 'Struktur Key Cocok Sempurna',
    'tool.perfectDesc': 'Tidak ditemukan key yang Missing, Orphan, Duplicate, atau Mismatch antara Base dan Target.<br /><small>(Catatan: Ini menunjukkan kesesuaian struktur konfigurasi, bukan kebenaran value runtime aplikasi Anda).</small>',
    'tool.boardTitle': 'Papan Komparasi Lingkungan',
    'tool.boardSubtitle': 'Nilai variabel disembunyikan',
    'tool.keysCount': '{count} key',
    'tool.statusMismatchLabel': 'Value berbeda',
    'tool.dupTitle': 'Muncul {count} kali (baris {lines})',
    'tool.dupBadge': 'Duplikat ({count}×)',
    'tool.valueMask': '= [nilai disembunyikan]',
    'tool.rowEmptyBaseAria': 'Tidak ada di Base',
    'tool.rowEmptyBaseText': '— Tidak terdaftar di Base —',
    'tool.rowEmptyTargetAria': 'Tidak ada di Target',
    'tool.rowEmptyTargetText': '— Tidak ditemukan di Target —',
    'tool.sidebarAria': 'Ringkasan status dan aksi hasil',
    'tool.summaryTitle': 'Ringkasan Status',
    'tool.statMissingDesc': 'Key belum ada di Target',
    'tool.statOrphanDesc': 'Key tambahan di Target',
    'tool.statDuplicateDesc': 'Kelompok key berulang',
    'tool.statMismatchDesc': 'Key sama, nilai berbeda',
    'tool.copyTitleEnabled': 'Salin daftar tugas key Missing dalam format Markdown',
    'tool.copyTitleDisabled': 'Tidak ada key Missing untuk dibuatkan checklist',
    'tool.copyBtn': 'Salin Markdown Checklist',
    'tool.downloadTitle': 'Unduh salinan Target yang telah dilengkapi key Missing dengan nilai kosong',
    'tool.downloadBtn': 'Unduh Merged .env',
    'tool.privacyNote': '100% Client-Side. Pemrosesan dilakukan di memori browser — tidak ada data dikirim ke server.',

    // --- Parsing warning engine (reasonKey) ---
    'engine.warn.noEquals': "Format assignment tidak dikenali: tidak ditemukan pemisah '='",
    'engine.warn.invalidKey': 'Nama key tidak valid: harus diawali huruf/underscore dan hanya memuat karakter alfanumerik, underscore, titik, atau tanda hubung',
    'engine.warn.unclosedDouble': 'Tanda petik ganda pembuka tidak ditutup',
    'engine.warn.unclosedSingle': 'Tanda petik tunggal pembuka tidak ditutup',
    'engine.warn.trailingAfterQuote': 'Terdapat teks tambahan yang tidak valid setelah tanda petik penutup',

    // --- output-generator.js ---
    'out.errNoText': 'Tidak ada teks untuk disalin.',
    'out.errExecCopy': 'Salin manual via execCommand gagal.',
    'out.errClipboard': 'Clipboard API tidak didukung atau izin ditolak browser.'
  }
};

// ---------------------------------------------------------------------------
// State bahasa aktif — hanya 'en' atau 'id'
// ---------------------------------------------------------------------------

let currentLang = 'en';
const subscribers = [];

/**
 * Mengembalikan kode bahasa aktif ('en' | 'id').
 *
 * @returns {'en'|'id'}
 */
export function getLang() {
  return currentLang === 'id' ? 'id' : 'en';
}

/**
 * Menerjemahkan key kamus dengan interpolasi {param} opsional.
 * Fallback: bahasa aktif → English → key itu sendiri.
 * Aman dipanggil di lingkungan non-DOM (Node) untuk kebutuhan pengujian.
 *
 * @param {string} key
 * @param {Object<string, string|number>} [vars]
 * @returns {string}
 */
export function t(key, vars) {
  const enTable = STRINGS.en || {};
  const table = STRINGS[currentLang] || enTable;
  let text = table[key];
  if (text === undefined) {
    text = enTable[key];
  }
  if (text === undefined) {
    return key;
  }
  if (vars) {
    Object.keys(vars).forEach(function (name) {
      text = text.split('{' + name + '}').join(String(vars[name]));
    });
  }
  return text;
}

// ---------------------------------------------------------------------------
// Penerapan kamus ke DOM
// ---------------------------------------------------------------------------

function applyMarkedElements() {
  var i;
  var el;
  var key;

  // textContent
  var textNodes = document.querySelectorAll('[data-i18n]');
  for (i = 0; i < textNodes.length; i += 1) {
    el = textNodes[i];
    key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  }

  // innerHTML (nilai kamus memuat markup tepercaya dari kamus lokal)
  var htmlNodes = document.querySelectorAll('[data-i18n-html]');
  for (i = 0; i < htmlNodes.length; i += 1) {
    el = htmlNodes[i];
    key = el.getAttribute('data-i18n-html');
    if (key) {
      el.innerHTML = t(key);
    }
  }

  // Atribut: format "namaAtribut:key;namaAtribut2:key2"
  var attrNodes = document.querySelectorAll('[data-i18n-attr]');
  for (i = 0; i < attrNodes.length; i += 1) {
    el = attrNodes[i];
    var spec = el.getAttribute('data-i18n-attr') || '';
    var pairs = spec.split(';');
    for (var j = 0; j < pairs.length; j += 1) {
      var pair = pairs[j].split(':');
      if (pair.length === 2 && pair[0] && pair[1]) {
        el.setAttribute(pair[0].trim(), t(pair[1].trim()));
      }
    }
  }
}

function notifySubscribers(lang) {
  for (var i = 0; i < subscribers.length; i += 1) {
    try {
      subscribers[i](lang);
    } catch (e) {
      /* listener gagal tidak boleh menggagalkan penerapan bahasa */
    }
  }
}

/**
 * Menerapkan bahasa ke seluruh DOM dan memberi tahu subscriber
 * (mis. app.js untuk render ulang konten dinamis).
 *
 * @param {'en'|'id'} lang
 * @returns {'en'|'id'} bahasa yang benar-benar diterapkan
 */
export function applyI18n(lang) {
  var next = lang === 'id' ? 'id' : 'en';
  currentLang = next;

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', next);
    document.documentElement.setAttribute('data-lang', next);
    applyMarkedElements();
  }

  notifySubscribers(next);
  return next;
}

/**
 * Mendaftarkan listener yang dipanggil setiap bahasa diterapkan.
 * Mengembalikan fungsi unsubscribe.
 *
 * @param {function('en'|'id'):void} cb
 * @returns {function():void}
 */
export function onLanguageChange(cb) {
  subscribers.push(cb);
  return function unsubscribe() {
    var index = subscribers.indexOf(cb);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

/**
 * Inisialisasi i18n sekali per halaman.
 * Bahasa awal diambil dari atribut data-lang yang diset skrip bootstrap
 * blocking di <head>; fallback English. Penanda data-i18n-pending selalu
 * dilepas — termasuk saat penerapan gagal — agar konten tidak tersembunyi.
 */
export function initI18n() {
  var lang = 'en';
  try {
    var attr = document.documentElement.getAttribute('data-lang');
    if (attr === 'en' || attr === 'id') {
      lang = attr;
    }
  } catch (e) { /* atribut tidak tersedia — fallback en */ }

  try {
    applyI18n(lang);
  } catch (e) {
    // Penerapan kamus gagal: fallback English dan tetap lepaskan penanda.
    try {
      applyI18n('en');
    } catch (e2) { /* abaikan — penanda tetap dilepas di bawah */ }
  } finally {
    try {
      document.documentElement.removeAttribute('data-i18n-pending');
    } catch (e) { /* abaikan */ }
  }
}
