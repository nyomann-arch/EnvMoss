/**
 * Verifikasi Milestone 9 — Dark Mode & Preferensi Tema
 * Cek:
 *   1. Token dark lengkap & ekuivalen dengan token light (styles.css)
 *   2. Kontras WCAG: teks >= 4.5, aksen/non-teks >= 3.0 pada kedua tema
 *   3. Bootstrap tema inline, blocking, identik di 3 halaman, sebelum CSS
 *   4. Kontrol tema Light/Dark/System di navbar ketiga halaman
 *   5. site.js: envmoss:theme (light|dark|system), matchMedia fallback,
 *      watchSystemTheme, try/catch storage, tanpa key storage lain
 *   6. Tidak ada warna hardcode di tool/landing/guide.css & HTML
 *      (kecuali brand mark SVG & color-mix #000 yang disengaja)
 *   7. Label tema i18n tersedia EN & ID
 */

import fs from 'fs';
import path from 'path';

const ROOT = 'c:/envmoss';
let passed = 0;
let failed = 0;
function check(id, condition, description) {
  if (condition) {
    console.log(`  [M9-${id}] PASS: ${description}`);
    passed++;
  } else {
    console.error(`  [M9-${id}] FAIL: ${description}`);
    failed++;
  }
}

const styles = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const siteJs = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');
const cssFiles = {
  tool: fs.readFileSync(path.join(ROOT, 'css/tool.css'), 'utf8'),
  landing: fs.readFileSync(path.join(ROOT, 'css/landing.css'), 'utf8'),
  guide: fs.readFileSync(path.join(ROOT, 'css/guide.css'), 'utf8')
};
const pages = {
  landing: fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'),
  tool: fs.readFileSync(path.join(ROOT, 'app/index.html'), 'utf8'),
  guide: fs.readFileSync(path.join(ROOT, 'guide/index.html'), 'utf8')
};

// ---------------------------------------------------------------------------
// 1. Ekstraksi token :root dan [data-theme="dark"]
// ---------------------------------------------------------------------------

function extractBlock(src, marker) {
  const start = src.indexOf(marker);
  if (start === -1) return null;
  const open = src.indexOf('{', start);
  const end = src.indexOf('\n}', open);
  return src.slice(open + 1, end === -1 ? undefined : end);
}

const lightBlock = extractBlock(styles, ':root {');
const darkBlock = extractBlock(styles, ':root[data-theme="dark"]');
check('blocks', !!lightBlock && !!darkBlock, 'Blok token :root dan [data-theme="dark"] ditemukan');

function tokensOf(block) {
  const map = {};
  const re = /--([\w-]+):\s*(#[0-9a-fA-F]{6})/g;
  let m;
  while ((m = re.exec(block || '')) !== null) map[m[1]] = m[2];
  return map;
}
const lightTok = tokensOf(lightBlock);
const darkTok = tokensOf(darkBlock);

const colorKeys = Object.keys(lightTok);
const missingDark = colorKeys.filter(k => !(k in darkTok));
const extraDark = Object.keys(darkTok).filter(k => !(k in lightTok));
check('token-parity', missingDark.length === 0 && extraDark.length === 0,
  `Semua ${colorKeys.length} token warna light punya padanan dark` +
  (missingDark.length ? ` — kurang: ${missingDark}` : '') +
  (extraDark.length ? ` — ekstra: ${extraDark}` : ''));
check('color-scheme', /:root\s*\{[^}]*color-scheme:\s*light/.test(styles) &&
  /\[data-theme="dark"\][^{]*\{[^}]*color-scheme:\s*dark/.test(styles),
  'color-scheme light & dark diset per tema');

// ---------------------------------------------------------------------------
// 2. Kontras WCAG
// ---------------------------------------------------------------------------

function lin(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function luminance(hex) {
  return 0.2126 * lin(parseInt(hex.slice(1, 3), 16)) +
         0.7152 * lin(parseInt(hex.slice(3, 5), 16)) +
         0.0722 * lin(parseInt(hex.slice(5, 7), 16));
}
function contrast(a, b) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
const STATUSES = ['missing', 'orphan', 'duplicate', 'mismatch'];

for (const [themeName, tok] of [['light', lightTok], ['dark', darkTok]]) {
  const textPairs = [
    ['text-primary/bg', 'color-text-primary', 'color-bg', 4.5],
    ['text-primary/surface', 'color-text-primary', 'color-surface', 4.5],
    ['text-secondary/bg', 'color-text-secondary', 'color-bg', 4.5],
    ['text-secondary/surface', 'color-text-secondary', 'color-surface', 4.5],
    ['on-primary/primary', 'color-on-primary', 'color-primary', 4.5]
  ];
  for (const s of STATUSES) {
    textPairs.push(
      [`${s}-text/${s}-bg`, `status-${s}-text`, `status-${s}-bg`, 4.5],
      [`${s}-text/surface`, `status-${s}-text`, 'color-surface', 4.5]
    );
  }
  const nonTextPairs = [
    ['primary/bg (link & focus)', 'color-primary', 'color-bg', 3.0],
    ['primary/surface', 'color-primary', 'color-surface', 3.0],
    ['primary-light/surface', 'color-primary-light', 'color-surface', 3.0]
  ];
  for (const s of STATUSES) {
    nonTextPairs.push(
      [`${s}/${s}-bg (border/aksen)`, `status-${s}`, `status-${s}-bg`, 3.0],
      [`${s}/surface`, `status-${s}`, 'color-surface', 3.0]
    );
  }

  for (const [label, aKey, bKey, min] of [...textPairs, ...nonTextPairs]) {
    const a = tok[aKey], b = tok[bKey];
    if (!a || !b) {
      check(`contrast-${themeName}-${label}`, false, `Token hilang: ${aKey}/${bKey}`);
      continue;
    }
    const ratio = contrast(a, b);
    check(`contrast-${themeName}-${label}`, ratio >= min,
      `${themeName}: ${label} = ${ratio.toFixed(2)}:1 (min ${min})`);
  }
}

// ---------------------------------------------------------------------------
// 3. Bootstrap tema — inline, blocking, sebelum stylesheet, identik
// ---------------------------------------------------------------------------

function headScript(html) {
  const m = html.match(/<head>([\s\S]*?)<\/head>/);
  return m ? m[1] : '';
}
function bootstrapOf(html) {
  const m = headScript(html).match(/<script>([\s\S]*?)<\/script>/);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}
const bootstraps = Object.values(pages).map(bootstrapOf);
check('bootstrap-identik', bootstraps.every(b => b === bootstraps[0]) && bootstraps[0].length > 100,
  'Skrip bootstrap <head> identik di ketiga halaman');

const bs = bootstraps[0] || '';
check('bs-theme-key', bs.includes("localStorage.getItem('envmoss:theme')"),
  'Bootstrap membaca envmoss:theme');
check('bs-theme-validate', bs.includes("=== 'light'") && bs.includes("=== 'dark'") && bs.includes("=== 'system'"),
  'Bootstrap memvalidasi light/dark/system');
check('bs-matchmedia', bs.includes('prefers-color-scheme: dark') && bs.includes('matchMedia'),
  'Bootstrap fallback ke prefers-color-scheme');
check('bs-trycatch', (bs.match(/try\s*\{/g) || []).length >= 2,
  'Bootstrap membungkus storage & matchMedia dengan try/catch');
check('bs-sets-theme', bs.includes("setAttribute('data-theme'") && bs.includes("setAttribute('data-theme-pref'"),
  'Bootstrap menetapkan data-theme & data-theme-pref');
check('bs-blocking', !/async|defer|type="module"/.test(
  headScript(pages.landing).match(/<script>[\s\S]*?<\/script>/)[0]),
  'Skrip bootstrap tidak async/defer/module');

for (const [name, html] of Object.entries(pages)) {
  const head = headScript(html);
  const scriptIdx = head.indexOf('<script>');
  const cssIdx = head.indexOf('rel="stylesheet"');
  check(`order-${name}`, scriptIdx !== -1 && cssIdx !== -1 && scriptIdx < cssIdx,
    `${name}: bootstrap berjalan sebelum stylesheet`);
}

// ---------------------------------------------------------------------------
// 4. Kontrol tema di navbar ketiga halaman
// ---------------------------------------------------------------------------

for (const [name, html] of Object.entries(pages)) {
  check(`toggle-${name}`, html.includes('id="site-theme-toggle"') && html.includes('class="site-theme"'),
    `${name}: kontrol tema ada di navbar`);
  check(`icons-${name}`, ['site-theme__icon--sun', 'site-theme__icon--moon', 'site-theme__icon--system']
    .every(c => html.includes(c)), `${name}: ikon sun/moon/system tersedia`);
  check(`state-${name}`, html.includes('data-state="system"'),
    `${name}: state awal data-state`);
}
check('theme-css-icons', /\.site-theme\[data-state="light"\][^{]*\{[^}]*display:\s*block/.test(styles) &&
  /\.site-theme\[data-state="dark"\]/.test(styles) && /\.site-theme\[data-state="system"\]/.test(styles),
  'CSS menampilkan ikon sesuai data-state');

// ---------------------------------------------------------------------------
// 5. site.js — logika tema
// ---------------------------------------------------------------------------

check('js-theme-order', siteJs.includes("['light', 'dark', 'system']") || siteJs.includes('THEME_ORDER'),
  'site.js mendefinisikan urutan light/dark/system');
check('js-theme-key', siteJs.includes("'envmoss:theme'") || siteJs.includes('envmoss:theme'),
  'site.js memakai key envmoss:theme');
check('js-theme-validate', siteJs.includes("'light'") && siteJs.includes("'dark'") && siteJs.includes("'system'"),
  'site.js memvalidasi nilai tema');
check('js-matchmedia', siteJs.includes('prefers-color-scheme: dark') && siteJs.includes('matchMedia'),
  'site.js fallback prefers-color-scheme');
check('js-system-watch', siteJs.includes("addEventListener('change'") && siteJs.includes('watchSystemTheme'),
  'site.js mengikuti perubahan OS saat mode System');
check('js-storage-guard', siteJs.includes('try {') && siteJs.includes('catch'),
  'site.js membungkus akses storage dengan try/catch');
check('js-theme-aria', siteJs.includes('aria-label') && siteJs.includes('theme.ariaState'),
  'site.js memperbarui accessible name kontrol tema');

// Hanya dua key preferensi UI yang boleh ditulis ke storage
const storageWrites = [...siteJs.matchAll(/storageSet\('([^']+)'/g)].map(m => m[1]);
const allWrites = [...siteJs.matchAll(/localStorage\.setItem\('([^']+)'/g)].map(m => m[1]);
const writes = [...new Set([...storageWrites, ...allWrites])];
check('js-storage-keys', writes.length > 0 && writes.every(k =>
  k === 'envmoss:language' || k === 'envmoss:theme'),
  `Hanya envmoss:language & envmoss:theme yang ditulis (${writes.join(', ') || 'tidak ada'})`);
const appJs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
check('app-no-storage', !/\b(?:localStorage|sessionStorage|indexedDB)\s*\.\s*\w+|document\.cookie/i.test(appJs),
  'app.js tidak memakai storage/cookie (hanya penyebutan di komentar)');

// ---------------------------------------------------------------------------
// 6. Tidak ada warna hardcode di CSS halaman & HTML
// ---------------------------------------------------------------------------

const hexRe = /#[0-9a-fA-F]{3,8}\b/g;
for (const [name, css] of Object.entries(cssFiles)) {
  const hits = css.match(hexRe) || [];
  const bad = hits.filter(h => h.toLowerCase() !== '#000');
  check(`css-nocolor-${name}`, bad.length === 0,
    `${name}.css bebas warna hardcode${bad.length ? ' — sisa: ' + [...new Set(bad)].join(',') : ''}` +
    (hits.length ? ` (${hits.length}x #000 dalam color-mix diizinkan)` : ''));
}
for (const [name, html] of Object.entries(pages)) {
  const hits = [...new Set((html.match(hexRe) || []).map(h => h.toLowerCase()))];
  const allowed = new Set(['#3d6b4f', '#ffffff']); // brand mark SVG — identitas tetap
  const bad = hits.filter(h => !allowed.has(h));
  check(`html-nocolor-${name}`, bad.length === 0,
    `${name}: hanya warna brand mark yang hardcode${bad.length ? ' — sisa: ' + bad.join(',') : ''}`);
}

// ---------------------------------------------------------------------------
// 7. Label tema i18n EN & ID
// ---------------------------------------------------------------------------

for (const key of ['theme.light', 'theme.dark', 'theme.system', 'theme.ariaState']) {
  const occurrences = (i18nSrc.match(new RegExp(`'${key.replace('.', '\\.')}'`, 'g')) || []).length;
  check(`i18n-${key}`, occurrences >= 2, `Key ${key} ada di kamus EN & ID (${occurrences} definisi)`);
}

// ---------------------------------------------------------------------------
// 8. Fokus & transisi tetap jalan di kedua tema (spot check)
// ---------------------------------------------------------------------------

check('focus-token', (styles.match(/:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--color-primary\)/g) || []).length >= 3,
  'Focus indicator memakai --color-primary (adaptif tema)');
check('no-theme-flash-var', styles.includes('[data-theme="dark"]'),
  'Selector dark theme aktif via atribut data-theme');

console.log(`\n=== HASIL: ${passed} PASS, ${failed} FAIL ===`);
process.exit(failed > 0 ? 1 : 0);
