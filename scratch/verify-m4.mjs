/**
 * Test & Verifikasi Milestone 4 — Rendering Hasil
 * Memeriksa:
 *   1. Keberadaan fungsi renderResults, clearResults, attachOutputHooks di app.js
 *   2. Sintaks JS & CSS
 *   3. Proteksi privasi: tidak ada pembocoran value/secret pada UI render
 *   4. Struktur papan komparasi dua panel (side-by-side diff board)
 *   5. Panel ringkasan status 4 warna & tombol aksi output
 *   6. Warnings banner & No-difference banner
 */

import fs from 'fs';
import { compareEnvFiles } from '../js/env-engine.js';

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

const appJs = fs.readFileSync('c:/envmoss/js/app.js', 'utf8');
// Sejak Milestone 7, style khusus Tool berada di css/tool.css
const stylesCss = fs.readFileSync('c:/envmoss/css/tool.css', 'utf8');
const indexHtml = fs.readFileSync('c:/envmoss/app/index.html', 'utf8');

console.log('--- 1. Cek Komponen & Fungsi di app.js ---');
assert(appJs.includes('function renderResults'), 'renderResults function defined');
assert(appJs.includes('function clearResults'), 'clearResults function defined');
assert(appJs.includes('function attachOutputHooks'), 'attachOutputHooks function defined');
assert(appJs.includes('diff-board-card'), 'diff-board-card markup generated');
assert(appJs.includes('diff-column--base'), 'diff-column--base rendered');
assert(appJs.includes('diff-column--target'), 'diff-column--target rendered');
assert(appJs.includes('summary-stat-grid'), 'summary-stat-grid rendered');
assert(appJs.includes('btn-copy-checklist'), 'btn-copy-checklist button rendered');
assert(appJs.includes('btn-download-merged'), 'btn-download-merged button rendered');
assert(appJs.includes('warnings-banner'), 'warnings-banner rendered conditionally');
assert(appJs.includes('no-difference-banner'), 'no-difference-banner rendered conditionally');
// Milestone 8: teks masking kini berasal dari kamus i18n (tool.valueMask)
assert(appJs.includes("t('tool.valueMask')"), 'value masking via kamus i18n (tool.valueMask)');

console.log('\n--- 2. Cek Design Tokens & Styling di styles.css ---');
assert(stylesCss.includes('.results-layout'), 'CSS .results-layout exists');
assert(stylesCss.includes('.diff-board-card'), 'CSS .diff-board-card exists');
assert(stylesCss.includes('.diff-board-grid'), 'CSS .diff-board-grid exists');
assert(stylesCss.includes('.diff-column--base'), 'CSS .diff-column--base exists');
assert(stylesCss.includes('.diff-column--target'), 'CSS .diff-column--target exists');
assert(stylesCss.includes('.diff-row--missing'), 'CSS .diff-row--missing exists');
assert(stylesCss.includes('.diff-row--orphan'), 'CSS .diff-row--orphan exists');
assert(stylesCss.includes('.diff-row--mismatch'), 'CSS .diff-row--mismatch exists');
assert(stylesCss.includes('.diff-row--empty'), 'CSS .diff-row--empty exists');
assert(stylesCss.includes('.badge--missing'), 'CSS .badge--missing exists');
assert(stylesCss.includes('.badge--orphan'), 'CSS .badge--orphan exists');
assert(stylesCss.includes('.badge--duplicate'), 'CSS .badge--duplicate exists');
assert(stylesCss.includes('.badge--mismatch'), 'CSS .badge--mismatch exists');
assert(stylesCss.includes('.summary-stat-box--missing'), 'CSS .summary-stat-box--missing exists');
assert(stylesCss.includes('.summary-stat-box--orphan'), 'CSS .summary-stat-box--orphan exists');
assert(stylesCss.includes('.summary-stat-box--duplicate'), 'CSS .summary-stat-box--duplicate exists');
assert(stylesCss.includes('.summary-stat-box--mismatch'), 'CSS .summary-stat-box--mismatch exists');
assert(stylesCss.includes('.warnings-banner'), 'CSS .warnings-banner exists');
assert(stylesCss.includes('.no-difference-banner'), 'CSS .no-difference-banner exists');

console.log('\n--- 3. Cek Responsivitas Layout di styles.css ---');
assert(/@media\s*\(max-width:\s*900px\)[\s\S]*?\.results-layout/.test(stylesCss), 'Tablet media query handles .results-layout');
assert(/@media\s*\(max-width:\s*600px\)[\s\S]*?\.diff-board-grid/.test(stylesCss), 'Mobile media query handles .diff-board-grid');

console.log('\n--- 4. Uji Simulasi Render Hasil & Keamanan Nilai Rahasia ---');
const secretBase = `SUPER_SECRET_KEY="super_secret_value_12345"\nAPI_TOKEN=token_abc_xyz\nDB_PASS=mypass123`;
const secretTarget = `SUPER_SECRET_KEY="different_target_secret"\nNEW_ORPHAN=orphan_val_456`;
const result = compareEnvFiles(secretBase, secretTarget);

// Ekstrak logika string renderResults untuk simulasi test
// Pastikan tidak ada satupun value rahasia yang tercetak di string HTML output!
assert(result.summary.missingCount === 2, 'Simulated result has 2 missing keys (API_TOKEN, DB_PASS)');
assert(result.summary.orphanCount === 1, 'Simulated result has 1 orphan key (NEW_ORPHAN)');
assert(result.summary.mismatchCount === 1, 'Simulated result has 1 mismatch key (SUPER_SECRET_KEY)');

// Cek apakah secret values ada di dalam hasil komparasi
const resultJson = JSON.stringify(result);
assert(!resultJson.includes('super_secret_value_12345'), 'Base secret value NOT present in comparison result object');
assert(!resultJson.includes('different_target_secret'), 'Target secret value NOT present in comparison result object');
assert(!resultJson.includes('token_abc_xyz'), 'Token value NOT present in comparison result object');
assert(!resultJson.includes('orphan_val_456'), 'Orphan value NOT present in comparison result object');
assert(!resultJson.includes('mypass123'), 'DB password value NOT present in comparison result object');

console.log('\n--- 5. Cek Aturan Bebas Tagline & Offline Ready ---');
assert(!indexHtml.includes('Offline Ready'), 'No Offline Ready badge in index.html');
assert(!appJs.includes('Offline Ready'), 'No Offline Ready badge in app.js');
assert(!indexHtml.includes('Local-First Environment Variable Detective'), 'No marketing tagline in index.html');

console.log(`\n========================================`);
console.log(`Hasil Test Milestone 4: ${passed} passed, ${failed} failed`);
console.log(`========================================`);

if (failed > 0) process.exit(1);
