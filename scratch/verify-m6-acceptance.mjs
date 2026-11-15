/**
 * Test & Verifikasi Milestone 6 — Audit 26 Acceptance Criteria PRD Seksi 17
 */

import fs from 'fs';
import { parseEnv, compareEnvFiles } from '../js/env-engine.js';
import { generateMarkdownChecklist, generateMergedEnv } from '../js/output-generator.js';

let passed = 0;
let failed = 0;

function check(id, condition, description) {
  if (condition) {
    console.log(`  [AC ${id}] PASS: ${description}`);
    passed++;
  } else {
    console.error(`  [AC ${id}] FAIL: ${description}`);
    failed++;
  }
}

const indexHtml = fs.readFileSync('c:/envmoss/index.html', 'utf8');
const stylesCss = fs.readFileSync('c:/envmoss/css/styles.css', 'utf8');
const appJs = fs.readFileSync('c:/envmoss/js/app.js', 'utf8');
const envEngineJs = fs.readFileSync('c:/envmoss/js/env-engine.js', 'utf8');
const outputGenJs = fs.readFileSync('c:/envmoss/js/output-generator.js', 'utf8');

console.log('=== MEMULAI AUDIT 26 ACCEPTANCE CRITERIA (PRD SEKSI 17) ===\n');

// AC 1: Pengguna dapat memasukkan Base dan Target melalui file picker
check(
  1,
  indexHtml.includes('id="file-input-base"') &&
  indexHtml.includes('id="file-input-target"') &&
  appJs.includes('bindFilePicker'),
  'File picker Base dan Target terpasang dan terhubung'
);

// AC 2: Pengguna dapat memasukkan file melalui drag-and-drop
check(
  2,
  indexHtml.includes('id="dropzone-base"') &&
  indexHtml.includes('id="dropzone-target"') &&
  appJs.includes('bindDragAndDrop') &&
  appJs.includes('dropEffect'),
  'Drag-and-drop dropzone terpasang untuk kedua slot'
);

// AC 3: Pengguna dapat melakukan copy-paste dan mengedit kedua textarea
check(
  3,
  indexHtml.includes('id="textarea-base"') &&
  indexHtml.includes('id="textarea-target"') &&
  appJs.includes('bindTextareaInput'),
  'Textarea Base dan Target tersedia, dapat diedit, dan memicu pembaruan state'
);

// AC 4: Komparasi hanya dijalankan ketika tombol Bandingkan ditekan
check(
  4,
  appJs.includes('btnCompare.addEventListener(\'click\'') &&
  !appJs.includes('textareaBase.addEventListener(\'input\', compare') &&
  !appJs.includes('textareaTarget.addEventListener(\'input\', compare'),
  'Komparasi berjalan manual hanya saat tombol Bandingkan diklik'
);

// AC 5: Baris kosong dan komentar penuh tidak dianggap sebagai key
const parsedAC5 = parseEnv('\n\n  \n# Komentar 1\n   # Komentar 2 dengan spasi\nVALID_KEY=1\n');
check(
  5,
  parsedAC5.keys.size === 1 && parsedAC5.keys.has('VALID_KEY'),
  'Baris kosong dan komentar penuh diabaikan dari daftar key'
);

// AC 6: Format KEY=value dan export KEY=value diproses
const parsedAC6 = parseEnv('SIMPLE=hello\nexport EXPORTED=world');
check(
  6,
  parsedAC6.keys.has('SIMPLE') &&
  parsedAC6.keys.has('EXPORTED') &&
  parsedAC6.keys.get('EXPORTED').effectiveValue === 'world',
  'Format KEY=value dan export KEY=value diproses dengan benar'
);

// AC 7: Key bersifat case-sensitive
const parsedAC7 = parseEnv('API_KEY=val1\napi_key=val2');
check(
  7,
  parsedAC7.keys.size === 2 &&
  parsedAC7.keys.has('API_KEY') &&
  parsedAC7.keys.has('api_key'),
  'Key bersifat case-sensitive (API_KEY != api_key)'
);

// AC 8: Key yang ada di Base tetapi tidak di Target terdeteksi sebagai Missing
const resAC8 = compareEnvFiles('BASE_ONLY=1\nCOMMON=2', 'COMMON=2');
check(
  8,
  resAC8.missing.length === 1 && resAC8.missing[0].key === 'BASE_ONLY',
  'Key Base yang tidak ada di Target terdeteksi sebagai Missing'
);

// AC 9: Key yang ada di Target tetapi tidak di Base terdeteksi sebagai Orphan
const resAC9 = compareEnvFiles('COMMON=2', 'COMMON=2\nTARGET_ONLY=3');
check(
  9,
  resAC9.orphan.length === 1 && resAC9.orphan[0].key === 'TARGET_ONLY',
  'Key Target yang tidak ada di Base terdeteksi sebagai Orphan'
);

// AC 10: Satu key yang muncul 3 kali dalam satu file menghasilkan 1 duplicate record dengan count 3 dan seluruh nomor baris
const parsedAC10 = parseEnv('DUP_KEY=a\nOTHER=x\nDUP_KEY=b\nDUP_KEY=c');
check(
  10,
  parsedAC10.duplicates.length === 1 &&
  parsedAC10.duplicates[0].key === 'DUP_KEY' &&
  parsedAC10.duplicates[0].count === 3 &&
  JSON.stringify(parsedAC10.duplicates[0].lines) === JSON.stringify([1, 3, 4]),
  'Duplicate dihitung per kelompok (count 3, baris [1, 3, 4])'
);

// AC 11: Duplicate Base dan Duplicate Target dicatat terpisah
const resAC11 = compareEnvFiles('DUP=1\nDUP=2', 'DUP=3\nDUP=4\nDUP=5');
check(
  11,
  resAC11.duplicates.base.length === 1 &&
  resAC11.duplicates.base[0].count === 2 &&
  resAC11.duplicates.target.length === 1 &&
  resAC11.duplicates.target[0].count === 3 &&
  resAC11.summary.duplicateGroupCount === 2,
  'Duplicate Base dan Target dicatat terpisah'
);

// AC 12: Perbandingan key duplicate menggunakan deklarasi terakhir
const resAC12 = compareEnvFiles('KEY=initial\nKEY=effective', 'KEY=effective');
check(
  12,
  resAC12.summary.mismatchCount === 0 &&
  resAC12.duplicates.base.length === 1,
  'Nilai efektif duplicate menggunakan deklarasi terakhir (last declaration wins)'
);

// AC 13: Key bersama dengan value efektif berbeda terdeteksi sebagai Mismatch, bukan error
const resAC13 = compareEnvFiles('DB_URL=localhost', 'DB_URL=production-db');
check(
  13,
  resAC13.summary.mismatchCount === 1 &&
  resAC13.mismatch[0].key === 'DB_URL' &&
  resAC13.summary.missingCount === 0 &&
  resAC13.summary.orphanCount === 0,
  'Value berbeda terdeteksi sebagai Mismatch informasi (bukan error)'
);

// AC 14: Value tidak ditampilkan pada hasil komparasi atau parsing warning
const parsedWarn = parseEnv('VALID=ok\nINVALID SYNTAX LINE', 'Base');
const secretLeakCheck = JSON.stringify(resAC13) + JSON.stringify(parsedWarn.warnings);
check(
  14,
  !secretLeakCheck.includes('localhost') &&
  !secretLeakCheck.includes('production-db') &&
  !secretLeakCheck.includes('INVALID SYNTAX LINE'),
  'Nilai secret tidak pernah diekspos di objek hasil komparasi atau parsing warning'
);

// AC 15: Format yang tidak didukung menghasilkan parsing warning dengan nomor baris
check(
  15,
  parsedWarn.warnings.length === 1 &&
  parsedWarn.warnings[0].line === 2 &&
  !parsedWarn.warnings[0].reason.includes('INVALID SYNTAX LINE'),
  'Baris tidak valid menghasilkan parsing warning dengan nomor baris tanpa leak isi baris'
);

// AC 16: Markdown Checklist hanya berisi key Missing, tanpa value
const checklistAC16 = generateMarkdownChecklist(resAC8.missing);
check(
  16,
  checklistAC16.includes('BASE_ONLY') &&
  !checklistAC16.includes('=') &&
  checklistAC16.includes('## Checklist Environment'),
  'Markdown Checklist hanya memuat key Missing tanpa value'
);

// AC 17: Merged .env mempertahankan teks Target asli dan menambahkan setiap key Missing satu kali dengan value kosong
const targetAC17 = '# Target header\nPORT=3000\n# Komentar\n';
const mergedAC17 = generateMergedEnv(targetAC17, ['API_KEY', 'DATABASE_URL']);
check(
  17,
  mergedAC17.startsWith(targetAC17) &&
  mergedAC17.includes('# Ditambahkan oleh EnvMoss: key yang Missing') &&
  mergedAC17.includes('API_KEY=') &&
  mergedAC17.includes('DATABASE_URL='),
  'Merged .env mempertahankan teks Target asli dan menambahkan key Missing satu kali dengan value kosong'
);

// AC 18: Jika tidak ada Missing, hasil Merged .env identik dengan teks Target asli
const mergedAC18 = generateMergedEnv(targetAC17, []);
check(
  18,
  mergedAC18 === targetAC17 &&
  !mergedAC18.includes('Ditambahkan oleh EnvMoss'),
  'Jika tidak ada Missing, hasil Merged .env identik 100% dengan Target asli'
);

// AC 19: Hapus Semua membersihkan input, hasil, dan state aplikasi
check(
  19,
  appJs.includes('clearSlot(\'base\')') &&
  appJs.includes('clearSlot(\'target\')') &&
  appJs.includes('clearResults()') &&
  appJs.includes('state.lastComparison = null'),
  'Hapus Semua mengosongkan kedua textarea, hasil render, dan state memori'
);

// AC 20: Tidak ada isi file yang dikirim melalui network request atau disimpan ke browser storage
const allCode = appJs + envEngineJs + outputGenJs;
const noComments = allCode.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
check(
  20,
  !/\bfetch\s*\(/.test(noComments) &&
  !/\bXMLHttpRequest\b/.test(noComments) &&
  !/\blocalStorage\b/.test(noComments) &&
  !/\bsessionStorage\b/.test(noComments) &&
  !/\bindexedDB\b/.test(noComments) &&
  !/\bdocument\.cookie\b/.test(noComments),
  'Nol request jaringan (fetch/XHR) dan nol browser storage (localStorage/sessionStorage/cookies)'
);

// AC 21: Aplikasi dapat dipublikasikan sebagai website statis tanpa backend
check(
  21,
  fs.existsSync('c:/envmoss/index.html') &&
  fs.existsSync('c:/envmoss/css/styles.css') &&
  fs.existsSync('c:/envmoss/js/app.js') &&
  fs.existsSync('c:/envmoss/js/env-engine.js') &&
  fs.existsSync('c:/envmoss/js/output-generator.js'),
  'Seluruh berkas web statis lengkap tanpa ketergantungan server runtime'
);

// AC 22: Navbar hanya menampilkan ikon/mark EnvMoss dan nama EnvMoss; tidak menampilkan tagline
check(
  22,
  indexHtml.includes('class="navbar__name">EnvMoss<') &&
  !indexHtml.includes('Local-First Environment Variable Detective') &&
  !indexHtml.includes('Developer Tool'),
  'Navbar minimal hanya memuat icon mark dan EnvMoss, tanpa tagline pemasaran'
);

// AC 23: Tidak ada ilustrasi tanaman besar di pojok kanan atas atau hero section dekoratif
check(
  23,
  !indexHtml.includes('hero-section') &&
  !indexHtml.includes('hero-heading') &&
  !indexHtml.includes('moss-hill') &&
  !indexHtml.includes('botanical-art'),
  'Tidak ada hero section atau ilustrasi botani besar di area header'
);

// AC 24: Hasil utama menggunakan papan komparasi Base dan Target berdampingan pada layar lebar
check(
  24,
  stylesCss.includes('.diff-board-grid') &&
  stylesCss.includes('grid-template-columns: 1fr 1fr;') &&
  stylesCss.includes('.results-sidebar'),
  'Papan komparasi sejajar dua kolom pada layar lebar dengan sidebar status ringkas'
);

// AC 25: Papan komparasi hanya menampilkan nama key dan metadata; tidak pernah menampilkan value atau baris .env asli
check(
  25,
  appJs.includes('[nilai disembunyikan]') &&
  stylesCss.includes('.diff-row__value-mask'),
  'Papan komparasi menggunakan masking [nilai disembunyikan] dan tidak pernah merender value asli'
);

// AC 26: Tidak ada badge atau klaim Offline Ready pada MVP v1.0
check(
  26,
  !indexHtml.includes('Offline Ready') &&
  !appJs.includes('Offline Ready'),
  'Tidak ada badge atau klaim Offline Ready'
);

console.log(`\n======================================================`);
console.log(`HASIL AUDIT ACCEPTANCE CRITERIA: ${passed} PASSED, ${failed} FAILED`);
console.log(`======================================================`);

if (failed > 0) process.exit(1);
