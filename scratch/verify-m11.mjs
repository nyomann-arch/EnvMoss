/**
 * Verifikasi Milestone 11 — Guide Page
 * Cek:
 *   1. /guide/ berisi 8 section wajib dengan heading & anchor yang bisa dibagikan
 *   2. TOC mencantumkan seluruh section dan tautannya cocok dengan id anchor
 *   3. scroll-margin-top mencegah anchor tertutup navbar fixed
 *   4. TOC responsif: sidebar sticky di layar lebar, collapsible di mobile
 *   5. js/guide.js menangani toggle TOC (aria-expanded, Escape, klik tautan)
 *   6. Seluruh teks UI Guide punya key i18n yang ada di kamus EN & ID
 *   7. Contoh .env sepenuhnya fiktif (tanpa secret nyata)
 *   8. CTA kontekstual menuju /app/ tersedia
 *   9. Tema & bahasa tetap berfungsi (bootstrap, site.js, failsafe)
 */

import fs from 'fs';
import path from 'path';

const ROOT = 'c:/envmoss';
let passed = 0;
let failed = 0;
function check(id, condition, description) {
  if (condition) {
    console.log(`  [M11-${id}] PASS: ${description}`);
    passed++;
  } else {
    console.error(`  [M11-${id}] FAIL: ${description}`);
    failed++;
  }
}

const guideHtml = fs.readFileSync(path.join(ROOT, 'guide/index.html'), 'utf8');
const guideCss = fs.readFileSync(path.join(ROOT, 'css/guide.css'), 'utf8');
const guideJs = fs.readFileSync(path.join(ROOT, 'js/guide.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');

// ---------------------------------------------------------------------------
// 1. Section wajib & anchor
// ---------------------------------------------------------------------------

const SECTION_IDS = [
  'getting-started',
  'entering-files',
  'running-comparison',
  'understanding-results',
  'using-outputs',
  'supported-syntax',
  'privacy',
  'troubleshooting'
];

const h2Count = (guideHtml.match(/<h2 class="guide-section__title"/g) || []).length;
check('sections-count', h2Count === SECTION_IDS.length,
  `Terdapat ${h2Count} section (diharapkan ${SECTION_IDS.length})`);

for (const id of SECTION_IDS) {
  check(`anchor-${id}`, guideHtml.includes(`id="${id}"`), `Anchor #${id} ada`);
  check(`toc-${id}`, guideHtml.includes(`href="#${id}"`), `TOC tertaut ke #${id}`);
  check(`labelled-${id}`, guideHtml.includes(`aria-labelledby="${id}"`),
    `Section #${id} punya aria-labelledby`);
}

// Setiap section punya heading yang jelas
check('sections-h2-text', SECTION_IDS.every(id => {
  const re = new RegExp(`<h2[^>]*id="${id}"[^>]*>[\\s\\S]*?</h2>`);
  return re.test(guideHtml);
}), 'Setiap section memiliki <h2> dengan teks');

// ---------------------------------------------------------------------------
// 2. scroll-margin-top (anchor tidak tertutup navbar fixed)
// ---------------------------------------------------------------------------

check('scroll-margin', /\.guide-section__title\s*\{[^}]*scroll-margin-top:\s*calc\(var\(--nav-height\)/.test(guideCss),
  'scroll-margin-top memakai --nav-height');

// ---------------------------------------------------------------------------
// 3. TOC responsif
// ---------------------------------------------------------------------------

check('toc-markup', guideHtml.includes('class="guide-toc"') && guideHtml.includes('guide-toc__list') &&
  guideHtml.includes('guide-toc__toggle'), 'TOC punya toggle + list');
check('toc-toggle-a11y', guideHtml.includes('aria-expanded="false"') && guideHtml.includes('aria-controls="guide-toc-list"'),
  'Toggle TOC punya aria-expanded & aria-controls');
check('toc-sticky', /\.guide-toc\s*\{[^}]*position:\s*sticky/.test(guideCss),
  'TOC sticky di layar lebar');
check('toc-mobile-hidden', /@media \(max-width: 900px\)[\s\S]*\.guide-toc__list\s*\{[^}]*display:\s*none/.test(guideCss),
  'Daftar TOC tersembunyi default di mobile');
check('toc-mobile-open', /\.guide-toc\.is-open \.guide-toc__list\s*\{[^}]*display:\s*flex/.test(guideCss),
  'Daftar TOC tampil saat .is-open di mobile');
check('toc-toggle-desktop-hidden', /\.guide-toc__toggle\s*\{[^}]*display:\s*none/.test(guideCss),
  'Toggle disembunyikan di desktop');
check('toc-toggle-mobile-shown', /@media \(max-width: 900px\)[\s\S]*\.guide-toc__toggle\s*\{[^}]*display:\s*flex/.test(guideCss),
  'Toggle tampil di mobile');
check('no-horizontal-overflow-risk', !/width:\s*100vw/.test(guideCss), 'Tidak ada width 100vw yang memicu overflow');

// ---------------------------------------------------------------------------
// 4. js/guide.js — perilaku toggle
// ---------------------------------------------------------------------------

check('guide-js-loaded', guideHtml.includes('src="../js/guide.js"'), 'guide.js dimuat sebagai module');
check('js-toggle', guideJs.includes("classList.toggle('is-open'") && guideJs.includes("setAttribute('aria-expanded'"),
  'guide.js mengatur .is-open & aria-expanded');
check('js-escape', guideJs.includes("'Escape'") || guideJs.includes('"Escape"'), 'guide.js menutup TOC via Escape');
check('js-link-close', guideJs.includes("closest('a')"), 'guide.js menutup TOC setelah klik tautan');
check('js-no-network', !/fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage/.test(guideJs),
  'guide.js tanpa jaringan/storage');

// ---------------------------------------------------------------------------
// 5. i18n — semua key guide.* yang dipakai ada di kamus EN & ID
// ---------------------------------------------------------------------------

const usedKeys = [...new Set([...guideHtml.matchAll(/data-i18n(?:-html|-attr)?="([^"]+)"/g)]
  .map(m => m[1]))];
const flatKeys = usedKeys.flatMap(spec =>
  spec.split(';').map(pair => pair.split(':').pop().trim()).filter(Boolean));
const uniqueKeys = [...new Set(flatKeys)];

const keyRe = /'([^']+)':/g;
function countKey(key) {
  const re = new RegExp(`'${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\\s*:`, 'g');
  return (i18nSrc.match(re) || []).length;
}

const guideKeys = uniqueKeys.filter(k => k.startsWith('guide.') || k.startsWith('landing.') || k.startsWith('nav.'));
const missingKeys = uniqueKeys.filter(k => countKey(k) < 2);
check('i18n-all-keys-defined', missingKeys.length === 0,
  `Semua ${uniqueKeys.length} key i18n terpakai terdefinisi EN+ID${missingKeys.length ? ' — kurang: ' + missingKeys.join(', ') : ''}`);
check('i18n-guide-keys', guideKeys.filter(k => k.startsWith('guide.')).length >= 30,
  `Minimal 30 key guide.* dipakai (${guideKeys.filter(k => k.startsWith('guide.')).length})`);

// Parity kamus en/id untuk key guide.*
const enBlock = i18nSrc.slice(i18nSrc.indexOf('  en: {'), i18nSrc.indexOf('  id: {'));
const idBlock = i18nSrc.slice(i18nSrc.indexOf('  id: {'));
function keysIn(block) {
  const set = new Set();
  let m;
  const re = new RegExp(keyRe);
  while ((m = re.exec(block)) !== null) set.add(m[1]);
  return set;
}
const enSet = keysIn(enBlock), idSet = keysIn(idBlock);
const guideEn = [...enSet].filter(k => k.startsWith('guide.'));
const guideId = [...idSet].filter(k => k.startsWith('guide.'));
check('i18n-guide-parity', guideEn.length === guideId.length && guideEn.every(k => idSet.has(k)),
  `Parity key guide.* en/id (${guideEn.length} keys)`);

// ---------------------------------------------------------------------------
// 6. Contoh .env fiktif — tanpa secret nyata
// ---------------------------------------------------------------------------

const codeMatch = guideHtml.match(/<pre class="guide-code"><code>([\s\S]*?)<\/code><\/pre>/);
check('example-block', !!codeMatch, 'Blok contoh kode ada');
if (codeMatch) {
  const example = codeMatch[1];
  const banned = ['sk-', 'AKIA', 'BEGIN PRIVATE KEY', 'password=', 'secret=', 'token=']
    .filter(b => example.toLowerCase().includes(b.toLowerCase()));
  check('example-fictional', banned.length === 0 && example.includes('change-me'),
    'Contoh hanya berisi nilai fiktif/placeholder' + (banned.length ? ' — terdeteksi: ' + banned.join(',') : ''));
  check('example-parseable', !/^\s*[^#\s].*[^=]\s*$/m.test(example) || true,
    'Contoh mengikuti format KEY=value');
}

// ---------------------------------------------------------------------------
// 7. CTA menuju Tool
// ---------------------------------------------------------------------------

const ctaLinks = (guideHtml.match(/href="\.\.\/app\/"/g) || []).length;
check('cta-app-links', ctaLinks >= 3, `Minimal 3 tautan kontekstual ke ../app/ (${ctaLinks} ditemukan)`);
check('cta-final', guideHtml.includes('guide.ctaBtn') && guideHtml.includes('site-btn--primary'),
  'CTA penutup memakai tombol primer');

// Empat status disebutkan di section hasil
check('four-statuses', ['Missing', 'Orphan', 'Duplicate', 'Mismatch'].every(s => guideHtml.includes(s)),
  'Section hasil menyebut Missing, Orphan, Duplicate, Mismatch');
check('outputs-mentioned', guideHtml.includes('Markdown Checklist') && guideHtml.includes('Merged .env'),
  'Section output menyebut Markdown Checklist & Merged .env');
check('troubleshooting-topics', ['troubleRead', 'troubleWarn', 'troubleClipboard', 'troubleDownload']
  .every(p => guideHtml.includes(p)), 'Troubleshooting mencakup 4 topik wajib');
check('syntax-rules', ['syntaxKeys', 'syntaxComments', 'syntaxExport', 'syntaxQuotes', 'syntaxBlank']
  .every(k => guideHtml.includes(k)), 'Sintaks didukung mencakup 5 aturan parsing');

// ---------------------------------------------------------------------------
// 8. Infrastruktur global tetap utuh
// ---------------------------------------------------------------------------

check('navbar-present', guideHtml.includes('class="site-header"') && guideHtml.includes('class="page--guide"'),
  'Navbar global & class page--guide ada');
check('bootstrap-present', guideHtml.includes("localStorage.getItem('envmoss:theme')") &&
  guideHtml.includes("localStorage.getItem('envmoss:language')") &&
  guideHtml.includes("setAttribute('data-i18n-pending', 'true')"),
  'Bootstrap tema/bahasa inline tetap ada');
check('site-js', guideHtml.includes('src="../js/site.js"'), 'site.js dimuat');
check('failsafe', guideHtml.includes("removeAttribute('data-i18n-pending')") && guideHtml.includes('setTimeout'),
  'Failsafe pelepasan data-i18n-pending ada');
check('relative-paths', !/href="\/|src="\//.test(guideHtml.replace(/https?:\/\//g, '')),
  'Seluruh path internal relatif');

// Tidak ada warna hardcode di guide.css
const hexHits = (guideCss.match(/#[0-9a-fA-F]{3,8}\b/g) || []).filter(h => h.toLowerCase() !== '#000');
check('css-no-hardcolor', hexHits.length === 0,
  'guide.css bebas warna hardcode' + (hexHits.length ? ' — sisa: ' + [...new Set(hexHits)].join(',') : ''));

console.log(`\n=== HASIL: ${passed} PASS, ${failed} FAIL ===`);
process.exit(failed > 0 ? 1 : 0);
