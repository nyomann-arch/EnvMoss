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

    // --- Footer global ---
    'footer.copyright': '© 2026 EnvMoss - Open Source under MIT License',

    // --- Guide ---
    'guide.title': 'Guide — EnvMoss',
    'guide.h1': 'EnvMoss Guide',
    'guide.lead': 'How to use EnvMoss to compare two environment files locally in your browser.',
    'guide.tocAria': 'Guide sections',
    'guide.tocTitle': 'On this page',
    'guide.startTitle': 'Getting started',
    'guide.startP1': 'All you need is two environment files — for example a reference file such as <code>.env.example</code> and the file you want to inspect, like <code>.env</code> or <code>.env.production</code>.',
    'guide.startP2': 'EnvMoss runs entirely in your browser. There is nothing to install, no account to create, and no file is ever uploaded.',
    'guide.startP3': 'New here? <a href="../app/">Open the Tool</a> and follow the steps below — a full comparison takes less than a minute.',
    'guide.step1': 'Open the <a href="../app/">Comparison Tool</a>.',
    'guide.step2': 'Enter the <strong>Base Environment</strong> (usually <code>.env.example</code>) and the <strong>Target Environment</strong> (the file you want to inspect) via drag-and-drop, the file picker, or copy-paste into the textarea.',
    'guide.step3': 'Press <strong>Compare</strong> to see Missing, Orphan, Duplicate, and Mismatch.',
    'guide.step4': 'Use <strong>Copy Markdown Checklist</strong> or <strong>Download Merged .env</strong> to follow up on the results.',
    'guide.secEnter': 'Entering Base and Target',
    'guide.enterP1': 'EnvMoss compares two sides: <strong>Base</strong> — the reference environment, usually your committed example file — and <strong>Target</strong> — the file you want to check.',
    'guide.enterDnd': '<strong>Drag and drop</strong> a file onto the drop zone.',
    'guide.enterPicker': '<strong>Use the file picker</strong> — press the drop zone or the Choose File button, then pick a file from your device.',
    'guide.enterPaste': '<strong>Paste the contents</strong> directly into the textarea — handy when you only have the text, not the file.',
    'guide.enterNote': 'Each side accepts one file or pasted text at a time. Editing the text replaces the loaded file, and the small button on a loaded file tag clears that side.',
    'guide.secRun': 'Running a comparison',
    'guide.runP1': 'The <strong>Compare</strong> button stays disabled until both Base and Target contain something. Once it is enabled, press it to run the comparison.',
    'guide.runP2': 'Results appear on the board below the inputs. After editing either side, press Compare again to refresh — EnvMoss does not re-run on every keystroke.',
    'guide.runP3': '<strong>Clear All</strong> empties both inputs and all results from memory. Use it when switching between projects.',
    'guide.secResults': 'Understanding the results',
    'guide.resultsIntro': 'Every key is grouped into one of four statuses — plus a Match state for identical keys:',
    'guide.resultsNote': 'Variable values are never displayed: the board shows key names and line numbers only. A <strong>Mismatch</strong> means the same key holds a different value in each file; it is informational, not an error.',
    'guide.secOutputs': 'Using the outputs',
    'guide.outputsNote': 'If the browser blocks clipboard access, the checklist text stays selected so you can copy it manually. The merged file downloads as <code>envmoss-merged.env</code> — Missing keys are appended with empty values for you to fill in.',
    'guide.outputChecklistTitle': 'Markdown Checklist',
    'guide.outputChecklistText': 'Copy a ready-to-paste task list of every Missing key to track what still needs to be added to your Target.',
    'guide.outputMergedTitle': 'Merged .env',
    'guide.outputMergedText': 'Download a copy of your Target completed with the Missing keys as empty values, ready for you to fill in.',
    'guide.secSyntax': 'Supported syntax',
    'guide.syntaxP1': 'EnvMoss understands the common dotenv format. Each assignment uses <code>KEY=value</code> on its own line.',
    'guide.syntaxKeys': 'Key names must start with a letter or underscore and may contain letters, digits, underscores, dots, and hyphens.',
    'guide.syntaxComments': 'Lines starting with <code>#</code> are comments. An inline comment is recognised only when <code>#</code> is preceded by whitespace, so values containing <code>#</code> such as URL fragments stay intact.',
    'guide.syntaxExport': 'An optional <code>export</code> prefix is accepted, as in <code>export KEY=value</code>.',
    'guide.syntaxQuotes': 'Values may be wrapped in single or double quotes; the closing quote must be followed only by whitespace or a comment.',
    'guide.syntaxBlank': 'Empty lines are ignored. Lines that match none of these rules are skipped and reported as parsing warnings — they never appear in the results as keys.',
    'guide.syntaxExampleTitle': 'Fictional example',
    'guide.syntaxWarn': 'If a file contains lines EnvMoss cannot parse, a warning panel above the results lists the affected line numbers per side. Check those lines for typos, unclosed quotes, or unsupported syntax.',
    'guide.privacyTitle': 'Privacy',
    'guide.privacyText': 'The contents of your <code>.env</code> files stay in your browser. EnvMoss does not upload them to a server and does not store them permanently.',
    'guide.privacyP2': 'To end a session, press <strong>Clear All</strong> and close the tab — nothing is kept in the browser beyond your theme and language preferences.',
    'guide.privacyLimit': 'This guarantee covers EnvMoss itself: the tool makes no network requests containing your file contents. It cannot protect you from other software on your device, so avoid pasting real production secrets when testing.',
    'guide.secTrouble': 'Troubleshooting',
    'guide.troubleReadT': 'The file could not be read',
    'guide.troubleReadD': 'The file may be locked, empty, or saved in an unsupported encoding. Try pasting its contents into the textarea instead, or re-save it as UTF-8.',
    'guide.troubleWarnT': 'Parsing warnings appear',
    'guide.troubleWarnD': 'Some lines were skipped. Review the listed line numbers — common causes are a missing <code>=</code>, invalid key names, or unclosed quotes.',
    'guide.troubleClipboardT': 'Copy to clipboard fails',
    'guide.troubleClipboardD': 'Clipboard permission may be denied or unavailable, for example in some private windows. The text remains selected — copy it manually, or use Download Merged .env instead.',
    'guide.troubleDownloadT': 'The download does not start',
    'guide.troubleDownloadD': 'Check your browser\'s download settings and allow downloads for this site. The file is generated locally, so no network is involved.',
    'guide.ctaText': 'Everything happens locally — try it with your own files.',
    'guide.ctaBtn': 'Open the Tool',

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

    // --- Footer global ---
    'footer.copyright': '© 2026 EnvMoss - Open Source di bawah Lisensi MIT',

    // --- Guide ---
    'guide.title': 'Panduan — EnvMoss',
    'guide.h1': 'Panduan EnvMoss',
    'guide.lead': 'Cara menggunakan EnvMoss untuk membandingkan dua file environment secara lokal di browser.',
    'guide.tocAria': 'Bagian panduan',
    'guide.tocTitle': 'Di halaman ini',
    'guide.startTitle': 'Memulai',
    'guide.startP1': 'Yang Anda butuhkan hanyalah dua file environment — misalnya file referensi seperti <code>.env.example</code> dan file yang ingin diperiksa, seperti <code>.env</code> atau <code>.env.production</code>.',
    'guide.startP2': 'EnvMoss berjalan sepenuhnya di browser Anda. Tidak ada yang perlu diinstal, tidak perlu akun, dan tidak ada file yang diunggah.',
    'guide.startP3': 'Baru di sini? <a href="../app/">Buka Tool</a> dan ikuti langkah di bawah — satu komparasi penuh memakan waktu kurang dari satu menit.',
    'guide.step1': 'Buka <a href="../app/">Comparison Tool</a>.',
    'guide.step2': 'Masukkan <strong>Base Environment</strong> (biasanya <code>.env.example</code>) dan <strong>Target Environment</strong> (file yang ingin diperiksa) melalui drag-and-drop, pemilih file, atau copy-paste ke textarea.',
    'guide.step3': 'Tekan <strong>Bandingkan</strong> untuk melihat Missing, Orphan, Duplicate, dan Mismatch.',
    'guide.step4': 'Gunakan <strong>Salin Markdown Checklist</strong> atau <strong>Unduh Merged .env</strong> untuk menindaklanjuti hasil.',
    'guide.secEnter': 'Memasukkan Base dan Target',
    'guide.enterP1': 'EnvMoss membandingkan dua sisi: <strong>Base</strong> — environment referensi, biasanya file contoh yang tersimpan di repositori — dan <strong>Target</strong> — file yang ingin Anda periksa.',
    'guide.enterDnd': '<strong>Seret dan lepas</strong> file ke area drop.',
    'guide.enterPicker': '<strong>Gunakan pemilih file</strong> — tekan area drop atau tombol Pilih File, lalu pilih file dari perangkat.',
    'guide.enterPaste': '<strong>Tempel isi file</strong> langsung ke textarea — praktis ketika Anda hanya punya teks, bukan filenya.',
    'guide.enterNote': 'Setiap sisi menerima satu file atau teks tempelan dalam satu waktu. Mengedit teks akan menggantikan file yang dimuat, dan tombol kecil pada label file yang dimuat mengosongkan sisi tersebut.',
    'guide.secRun': 'Menjalankan komparasi',
    'guide.runP1': 'Tombol <strong>Bandingkan</strong> tetap nonaktif sampai Base dan Target sama-sama terisi. Setelah aktif, tekan untuk menjalankan komparasi.',
    'guide.runP2': 'Hasil muncul pada papan di bawah input. Setelah mengubah salah satu sisi, tekan Bandingkan lagi untuk memperbarui — EnvMoss tidak berjalan ulang di setiap ketukan tombol.',
    'guide.runP3': '<strong>Hapus Semua</strong> mengosongkan kedua input dan seluruh hasil dari memori. Gunakan saat berpindah antar proyek.',
    'guide.secResults': 'Memahami hasil',
    'guide.resultsIntro': 'Setiap key dikelompokkan ke dalam satu dari empat status — ditambah status Match untuk key yang identik:',
    'guide.resultsNote': 'Nilai variabel tidak pernah ditampilkan: papan hanya menampilkan nama key dan nomor baris. <strong>Mismatch</strong> berarti key yang sama memiliki value berbeda di tiap file; bersifat informatif, bukan error.',
    'guide.secOutputs': 'Menggunakan output',
    'guide.outputsNote': 'Jika browser memblokir akses clipboard, teks checklist tetap terseleksi sehingga Anda bisa menyalinnya secara manual. File gabungan diunduh sebagai <code>envmoss-merged.env</code> — key Missing ditambahkan dengan value kosong untuk Anda isi.',
    'guide.outputChecklistTitle': 'Markdown Checklist',
    'guide.outputChecklistText': 'Salin daftar tugas siap tempel berisi setiap key Missing untuk melacak apa yang masih perlu ditambahkan ke Target Anda.',
    'guide.outputMergedTitle': 'Merged .env',
    'guide.outputMergedText': 'Unduh salinan Target Anda yang telah dilengkapi key Missing sebagai value kosong, siap untuk Anda isi.',
    'guide.secSyntax': 'Sintaks yang didukung',
    'guide.syntaxP1': 'EnvMoss memahami format dotenv yang umum. Setiap assignment memakai <code>KEY=value</code> pada barisnya sendiri.',
    'guide.syntaxKeys': 'Nama key harus diawali huruf atau underscore dan boleh memuat huruf, angka, underscore, titik, dan tanda hubung.',
    'guide.syntaxComments': 'Baris yang diawali <code>#</code> adalah komentar. Komentar inline dikenali hanya jika <code>#</code> didahului whitespace, sehingga value yang memuat <code>#</code> seperti fragmen URL tetap utuh.',
    'guide.syntaxExport': 'Prefiks <code>export</code> opsional diterima, seperti <code>export KEY=value</code>.',
    'guide.syntaxQuotes': 'Value boleh diapit tanda petik tunggal atau ganda; tanda petik penutup hanya boleh diikuti whitespace atau komentar.',
    'guide.syntaxBlank': 'Baris kosong diabaikan. Baris yang tidak cocok dengan aturan apa pun akan dilewati dan dilaporkan sebagai parsing warning — baris tersebut tidak pernah muncul sebagai key dalam hasil.',
    'guide.syntaxExampleTitle': 'Contoh fiktif',
    'guide.syntaxWarn': 'Jika file memuat baris yang tidak dapat diparse EnvMoss, panel peringatan di atas hasil menampilkan nomor baris yang terdampak per sisi. Periksa baris tersebut untuk kesalahan ketik, tanda petik yang tidak ditutup, atau sintaks yang tidak didukung.',
    'guide.privacyTitle': 'Privasi',
    'guide.privacyText': 'Isi file <code>.env</code> Anda tetap berada di browser. EnvMoss tidak mengunggahnya ke server dan tidak menyimpannya secara permanen.',
    'guide.privacyP2': 'Untuk mengakhiri sesi, tekan <strong>Hapus Semua</strong> lalu tutup tab — tidak ada yang tersimpan di browser selain preferensi tema dan bahasa Anda.',
    'guide.privacyLimit': 'Jaminan ini mencakup EnvMoss itu sendiri: tool tidak mengirim request jaringan berisi isi file Anda. Ia tidak dapat melindungi Anda dari perangkat lunak lain di perangkat Anda, jadi hindari menempelkan secret produksi sungguhan saat mencoba.',
    'guide.secTrouble': 'Pemecahan masalah',
    'guide.troubleReadT': 'File tidak dapat dibaca',
    'guide.troubleReadD': 'File mungkin terkunci, kosong, atau tersimpan dalam encoding yang tidak didukung. Coba tempel isi file ke textarea, atau simpan ulang sebagai UTF-8.',
    'guide.troubleWarnT': 'Muncul parsing warning',
    'guide.troubleWarnD': 'Sebagian baris dilewati. Periksa nomor baris yang tercantum — penyebab umum adalah <code>=</code> yang hilang, nama key tidak valid, atau tanda petik yang tidak ditutup.',
    'guide.troubleClipboardT': 'Penyalinan ke clipboard gagal',
    'guide.troubleClipboardD': 'Izin clipboard mungkin ditolak atau tidak tersedia, misalnya di beberapa jendela privat. Teks tetap terseleksi — salin secara manual, atau gunakan Unduh Merged .env sebagai gantinya.',
    'guide.troubleDownloadT': 'Unduhan tidak dimulai',
    'guide.troubleDownloadD': 'Periksa pengaturan unduhan browser Anda dan izinkan unduhan untuk situs ini. File dibuat secara lokal, jadi tidak melibatkan jaringan.',
    'guide.ctaText': 'Semuanya diproses secara lokal — coba dengan file Anda sendiri.',
    'guide.ctaBtn': 'Buka Tool',

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
