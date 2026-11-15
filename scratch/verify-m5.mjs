/**
 * Test & Verifikasi Milestone 5 — Actionable Outputs
 * Memeriksa:
 *   1. generateMarkdownChecklist: format checklist, urutan, tanpa value
 *   2. generateMergedEnv: Target identik sebagai prefix, line ending, penanda
 *   3. copyToClipboard & downloadFile terdefinisi dan aman
 *   4. Uji skenario PRD Seksi 11
 */

import fs from 'fs';
import {
  generateMarkdownChecklist,
  generateMergedEnv,
  detectLineEnding,
  copyToClipboard,
  downloadFile
} from '../js/output-generator.js';

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  PASS: ${name}`);
    passed++;
  } else {
    console.error(`  FAIL: ${name}`);
    failed++;
  }
}

console.log('--- 1. Cek Fungsi & Ekspor di output-generator.js ---');
assert(typeof generateMarkdownChecklist === 'function', 'generateMarkdownChecklist exported');
assert(typeof generateMergedEnv === 'function', 'generateMergedEnv exported');
assert(typeof detectLineEnding === 'function', 'detectLineEnding exported');
assert(typeof copyToClipboard === 'function', 'copyToClipboard exported');
assert(typeof downloadFile === 'function', 'downloadFile exported');

console.log('\n--- 2. Uji Markdown Checklist ---');
const missingKeys1 = ['API_KEY', 'CACHE_DRIVER'];
const checklist1 = generateMarkdownChecklist(missingKeys1);
const expectedChecklist1 = `## Checklist Environment

- [ ] Tambahkan \`API_KEY\` ke Target Environment
- [ ] Tambahkan \`CACHE_DRIVER\` ke Target Environment`;

assert(checklist1 === expectedChecklist1, 'Checklist matches PRD format exactly');
assert(!checklist1.includes('='), 'Checklist contains no assignments or values');
assert(generateMarkdownChecklist([]) === '', 'Empty missingKeys yields empty checklist');

// Urutan mengikuti Base
const missingKeysObjects = [{ key: 'Z_VAR' }, { key: 'A_VAR' }];
const checklistOrdered = generateMarkdownChecklist(missingKeysObjects);
assert(
  checklistOrdered.indexOf('`Z_VAR`') < checklistOrdered.indexOf('`A_VAR`'),
  'Checklist preserves order of input (order of Base)'
);

console.log('\n--- 3. Uji Merged .env (PRD 11.2) ---');

// Skenario 3a: Contoh dari PRD Seksi 11.2
const baseEnvA = `DATABASE_URL=\nNODE_ENV=\nAPI_KEY=\nCACHE_DRIVER=`;
const targetEnvA = `DATABASE_URL=production-db\nNODE_ENV=production`;
const missingA = ['API_KEY', 'CACHE_DRIVER'];

const mergedA = generateMergedEnv(targetEnvA, missingA);

// Aturan 10: Teks Target asli harus menjadi prefix identik
assert(mergedA.startsWith(targetEnvA), 'Aturan 10: Teks Target asli adalah prefix identik pada hasil');
assert(mergedA.includes('# Ditambahkan oleh EnvMoss: key yang Missing'), 'Penanda komentar disertakan');
assert(mergedA.includes('API_KEY='), 'Missing key API_KEY ditambahkan dengan value kosong');
assert(mergedA.includes('CACHE_DRIVER='), 'Missing key CACHE_DRIVER ditambahkan dengan value kosong');

const expectedMergedA = `DATABASE_URL=production-db\nNODE_ENV=production\n\n# Ditambahkan oleh EnvMoss: key yang Missing\nAPI_KEY=\nCACHE_DRIVER=`;
assert(mergedA === expectedMergedA, 'Merged output matches PRD Section 11.2 example exactly');

// Skenario 3b: Target dengan CRLF (\r\n)
const targetCRLF = `DB_HOST=127.0.0.1\r\nDB_PORT=5432\r\n`;
assert(detectLineEnding(targetCRLF) === '\r\n', 'detectLineEnding detects CRLF correctly');
const mergedCRLF = generateMergedEnv(targetCRLF, ['NEW_KEY']);
assert(mergedCRLF.startsWith(targetCRLF), 'CRLF Target is an exact prefix');
assert(mergedCRLF.includes('\r\n# Ditambahkan oleh EnvMoss: key yang Missing\r\nNEW_KEY='), 'Merged uses CRLF matching Target');

// Skenario 3c: Tidak ada key Missing (Aturan 11)
// Jika tidak ada Missing, hasil unduhan harus sama persis dengan teks Target asli dan tidak boleh menambahkan komentar penanda
const targetNoMissing = `# Konfigurasi Production\nAPP_NAME=EnvMoss\nAPP_PORT=8080\n`;
const mergedNoMissing = generateMergedEnv(targetNoMissing, []);
assert(mergedNoMissing === targetNoMissing, 'Aturan 11: Hasil unduhan sama persis dengan Target asli jika tidak ada Missing');
assert(!mergedNoMissing.includes('Ditambahkan oleh EnvMoss'), 'Aturan 11: Tidak ada komentar penanda jika tidak ada Missing');

// Skenario 3d: Target dengan komentar, duplikat, dan spasi unik
const targetComplex = `# Header\n\nKEY1=val1\n# Komentar tengah\nKEY1=val1_dup\nEXTRA_ORPHAN=orphan_val\n`;
const mergedComplex = generateMergedEnv(targetComplex, ['MISSING_X']);
assert(mergedComplex.startsWith(targetComplex), 'Kompleks: Seluruh komentar dan duplikat Target tetap utuh');
assert(mergedComplex.includes('EXTRA_ORPHAN=orphan_val'), 'Key orphan tetap dipertahankan');
assert(mergedComplex.includes('KEY1=val1_dup'), 'Duplikat tetap dipertahankan');
assert(mergedComplex.endsWith('MISSING_X='), 'Key baru ditambahkan di paling bawah dengan value kosong');

console.log('\n--- 4. Cek Integrasi di app.js & styles.css ---');
const appJs = fs.readFileSync('c:/envmoss/js/app.js', 'utf8');
const stylesCss = fs.readFileSync('c:/envmoss/css/styles.css', 'utf8');

assert(appJs.includes('generateMarkdownChecklist'), 'app.js imports generateMarkdownChecklist');
assert(appJs.includes('generateMergedEnv'), 'app.js imports generateMergedEnv');
assert(appJs.includes('copyToClipboard'), 'app.js imports copyToClipboard');
assert(appJs.includes('downloadFile'), 'app.js imports downloadFile');
assert(appJs.includes('showSidebarFeedback'), 'app.js implements showSidebarFeedback');
assert(appJs.includes('sidebar-feedback-container'), 'sidebar-feedback-container integrated');
assert(stylesCss.includes('.sidebar-feedback'), 'CSS .sidebar-feedback exists');
assert(stylesCss.includes('.sidebar-feedback--success'), 'CSS .sidebar-feedback--success exists');
assert(stylesCss.includes('.sidebar-feedback--info'), 'CSS .sidebar-feedback--info exists');

console.log(`\n========================================`);
console.log(`Hasil Test Milestone 5: ${passed} passed, ${failed} failed`);
console.log(`========================================`);

if (failed > 0) process.exit(1);
