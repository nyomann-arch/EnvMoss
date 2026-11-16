/**
 * Verifikasi Milestone 8 — Internasionalisasi EN/ID
 * Cek:
 *   1. js/i18n.js ada, kamus en/id lengkap & parity key
 *   2. t() fallback benar; generateMarkdownChecklist/generateMergedEnv per bahasa
 *   3. Ketiga halaman memakai data-i18n + failsafe + bootstrap identik
 *   4. README.md (EN) & README.id.md (ID) saling tertaut
 *   5. Tidak ada teks Indonesia tersisa di HTML base (fallback English)
 */

import fs from 'fs';
import path from 'path';
import {
  generateMarkdownChecklist,
  generateMergedEnv
} from '../js/output-generator.js';
import { t, getLang, applyI18n } from '../js/i18n.js';

const ROOT = 'c:/envmoss';
let passed = 0;
let failed = 0;
function check(id, condition, description) {
  if (condition) {
    console.log(`  [M8-${id}] PASS: ${description}`);
    passed++;
  } else {
    console.error(`  [M8-${id}] FAIL: ${description}`);
    failed++;
  }
}

const pages = {
  landing: fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'),
  tool: fs.readFileSync(path.join(ROOT, 'app/index.html'), 'utf8'),
  guide: fs.readFileSync(path.join(ROOT, 'guide/index.html'), 'utf8')
};
const i18nSrc = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');
const siteJs = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const engineJs = fs.readFileSync(path.join(ROOT, 'js/env-engine.js'), 'utf8');
const outGenJs = fs.readFileSync(path.join(ROOT, 'js/output-generator.js'), 'utf8');
const readmeEn = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const readmeId = fs.readFileSync(path.join(ROOT, 'README.id.md'), 'utf8');

// Ekstrak kamus en & id dari source i18n.js secara tekstual
const i18nNorm = i18nSrc.replace(/\r\n/g, '\n');
function extractTable(name) {
  const marker = `  ${name}: {`;
  const start = i18nNorm.indexOf(marker);
  if (start === -1) return null;
  // en diakhiri "\n  }," ; id adalah tabel terakhir, diakhiri "\n  }\n};"
  const terminator = name === 'id' ? '\n  }\n};' : '\n  },';
  const end = i18nNorm.indexOf(terminator, start);
  return i18nNorm.slice(start, end === -1 ? undefined : end);
}
const enBlock = extractTable('en');
const idBlock = extractTable('id');
check('dict-blocks', !!enBlock && !!idBlock, 'Kamus en dan id ditemukan di i18n.js');

const keyRe = /'([^']+)':/g;
function keysOf(block) {
  const set = new Set();
  let m;
  const re = new RegExp(keyRe);
  while ((m = re.exec(block)) !== null) set.add(m[1]);
  return set;
}
const enKeys = keysOf(enBlock || '');
const idKeys = keysOf(idBlock || '');
const onlyEn = [...enKeys].filter(k => !idKeys.has(k));
const onlyId = [...idKeys].filter(k => !enKeys.has(k));
check('dict-parity', onlyEn.length === 0 && onlyId.length === 0,
  `Parity key en/id (${enKeys.size} keys; hanya-en: ${onlyEn.join(',') || '-'}; hanya-id: ${onlyId.join(',') || '-'})`);
check('dict-size', enKeys.size >= 80, `Kamus memiliki ${enKeys.size} key (>=80)`);

console.log('\n=== UJI FUNGSIONAL i18n.js (non-DOM) ===\n');
check('t-fallback-en', t('nav.aria') === 'Main navigation', 't() default English saat modul load');
check('t-missing-key', t('tidak.ada.key') === 'tidak.ada.key', 't() mengembalikan key bila tidak ditemukan');
check('applyI18n-en', applyI18n('en') === 'en' && getLang() === 'en', 'applyI18n(en) aktif tanpa DOM');
check('applyI18n-id', applyI18n('id') === 'id' && getLang() === 'id', 'applyI18n(id) aktif tanpa DOM');
check('applyI18n-invalid', applyI18n('xx') === 'en', 'applyI18n nilai invalid fallback ke en');
applyI18n('id');
check('t-id', t('nav.aria') === 'Navigasi utama', 't() Bahasa Indonesia setelah applyI18n(id)');
check('t-interp', applyI18n('en') && t('tool.warnTitle', { count: 3 }) === 'Parsing Warning (3 lines could not be analyzed)', 'Interpolasi {count} bekerja');
applyI18n('id');

console.log('\n=== UJI OUTPUT GENERATOR PER BAHASA ===\n');
const missing = ['API_KEY', 'DB_URL'];
const clEn = generateMarkdownChecklist(missing, 'en');
const clId = generateMarkdownChecklist(missing, 'id');
check('cl-en', clEn.includes('## Environment Checklist') && clEn.includes('- [ ] Add `API_KEY` to Target Environment'), 'Checklist EN');
check('cl-id', clId === '## Checklist Environment\n\n- [ ] Tambahkan `API_KEY` ke Target Environment\n- [ ] Tambahkan `DB_URL` ke Target Environment', 'Checklist ID identik format PRD');
check('cl-default-id', generateMarkdownChecklist(missing) === clId, 'Checklist default tetap ID (kompatibel v1.0.0)');
const mergedEn = generateMergedEnv('A=1\n', missing, 'en');
const mergedId = generateMergedEnv('A=1\n', missing, 'id');
check('merged-en', mergedEn.includes('# Added by EnvMoss: Missing keys') && mergedEn.startsWith('A=1\n'), 'Merged EN marker + Target prefix identik');
check('merged-id', mergedId.includes('# Ditambahkan oleh EnvMoss: key yang Missing'), 'Merged ID marker tetap');
check('merged-no-missing', generateMergedEnv('A=1\n', [], 'en') === 'A=1\n', 'Tanpa Missing hasil identik di EN');

console.log('\n=== ASSERTI STATIS — PENANDA & FAILSAFE ===\n');
for (const [name, html] of Object.entries(pages)) {
  check('i18n-markers-' + name,
    html.includes('data-i18n=') || html.includes('data-i18n-attr=') || html.includes('data-i18n-html='),
    `${name}: elemen bertanda data-i18n*`);
  check('failsafe-' + name, html.includes("removeAttribute('data-i18n-pending')") && html.includes('setTimeout'),
    `${name}: failsafe pelepasan pending ada`);
  check('pending-attr-' + name, html.includes("data-i18n-pending', 'true'"),
    `${name}: bootstrap tetap menandai pending`);
  check('html-lang-en-' + name, html.includes('<html lang="en">'),
    `${name}: fallback HTML berbahasa Inggris`);
}

console.log('\n=== ASSERTI STATIS — KONTEN YANG DITERJEMAHKAN ===\n');
const requiredToolKeys = [
  'tool.privacyText', 'tool.inputSection', 'tool.dropzoneEmpty', 'tool.pickFile',
  'tool.pasteLabel', 'tool.compare', 'tool.clearAll', 'tool.compareHint',
  'tool.emptyTitle', 'tool.emptyDesc', 'tool.stepEnterBase', 'tool.stepEnterTarget',
  'tool.stepCompare'
];
for (const k of requiredToolKeys) {
  check('tool-key-' + k, pages.tool.includes(`"${k}"`) || pages.tool.includes(`'${k}'`) || pages.tool.includes(k),
    `Tool merujuk key ${k}`);
}
check('landing-keys', ['landing.heroTitle', 'landing.heroLead', 'landing.ctaTool', 'landing.ctaGuide',
  'landing.statusTitle', 'landing.privacyTitle'].every(k => pages.landing.includes(k)),
  'Landing merujuk seluruh key utama');
check('guide-keys', ['guide.h1', 'guide.lead', 'guide.startTitle', 'guide.step1', 'guide.step2',
  'guide.step3', 'guide.step4', 'guide.privacyTitle'].every(k => pages.guide.includes(k)),
  'Guide merujuk seluruh key utama');
check('navbar-keys', Object.values(pages).every(h =>
  h.includes('nav.aria') && h.includes('nav.brandAria') && h.includes('nav.langAria') &&
  h.includes('nav.themeAria') && h.includes('nav.privacyAria')),
  'Navbar di 3 halaman memakai key terjemahan');

// Tidak boleh ada sisa teks Indonesia kasual di base HTML (fallback English)
const idResidual = [
  'Seret file ke sini', 'Pilih File', 'Bandingkan', 'Hapus Semua',
  'Hasil komparasi akan muncul', 'Baca Panduan', 'Buka Tool',
  'Masukkan Base', 'Tekan Bandingkan', 'Ringkasan Status',
  'Papan Komparasi', 'Nilai variabel disembunyikan'
];
const residualHits = idResidual.filter(s =>
  pages.landing.includes(s) || pages.tool.includes(s) || pages.guide.includes(s));
check('no-id-residual', residualHits.length === 0,
  `Tidak ada teks Indonesia tersisa di HTML base${residualHits.length ? ' — sisa: ' + residualHits.join(', ') : ''}`);

console.log('\n=== ASSERTI — JS wiring ===\n');
check('site-imports-i18n', siteJs.includes("from './i18n.js'") && siteJs.includes('initI18n') && siteJs.includes('applyI18n'),
  'site.js mengimpor & memakai i18n');
check('app-imports-i18n', appJs.includes("from './i18n.js'") && appJs.includes('onLanguageChange') && appJs.includes('refreshLocalizedUi'),
  'app.js mengimpor i18n & render ulang saat bahasa berganti');
check('engine-reasonkey', engineJs.includes('reasonKey') && engineJs.includes('engine.warn.noEquals'),
  'env-engine mengeluarkan reasonKey untuk parsing warning');
check('outgen-lang', outGenJs.includes("lang === 'en'") && outGenJs.includes('Added by EnvMoss'),
  'output-generator mendukung parameter bahasa');
check('app-passes-lang', appJs.includes('getLang()'),
  'app.js meneruskan bahasa aktif ke output generator');

console.log('\n=== ASSERTI — README ===\n');
check('readme-en-lang', readmeEn.includes('# EnvMoss') && readmeEn.includes('English') && readmeEn.includes('README.id.md'),
  'README.md berbahasa Inggris & tertaut ke README.id.md');
check('readme-id-lang', readmeId.includes('# EnvMoss') && readmeId.includes('Bahasa Indonesia') && readmeId.includes('README.md'),
  'README.id.md berbahasa Indonesia & tertaut ke README.md');
check('readme-cross-near-top', readmeEn.indexOf('README.id.md') < 3000 && readmeId.indexOf('README.md') < 3000,
  'Tautan silang bahasa berada dekat bagian atas kedua README');
check('readme-parity', ['envmoss.vercel.app', 'nyomann-arch/EnvMoss', 'MIT', 'Base Environment',
  'Target Environment', 'Markdown Checklist', 'Merged', 'privacy'].every(s =>
  readmeEn.toLowerCase().includes(s.toLowerCase()) && readmeId.toLowerCase().includes(s.toLowerCase())),
  'Kedua README memuat informasi inti yang sepadan');

console.log(`\n=== HASIL: ${passed} PASS, ${failed} FAIL ===`);
process.exit(failed > 0 ? 1 : 0);
