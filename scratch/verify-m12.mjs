/**
 * Verifikasi Milestone 12 — Integrasi, QA, Dokumentasi, dan Rilis Web Berikutnya
 *
 * Cakupan cek (pemetaan ke PRD M12):
 *   A. Route & runtime: /, /app/, /guide/ 200 OK via server statis; refresh =
 *      GET ulang; tidak ada 404 pada aset yang dirujuk; varian tanpa trailing
 *      slash dicatat sebagai catatan (bukan syarat rute resmi).
 *   B. Bootstrap head: skrip inline/blocking identik di 3 halaman, sebelum
 *      stylesheet, memvalidasi envmoss:theme & envmoss:language, fallback aman
 *      (localStorage throw, matchMedia absen), menandai data-i18n-pending.
 *   C. Relative path & base path subdirektori: semua src/href/CSS url()/ES
 *      module import relatif dan resolve ke file yang ada; tanpa <base>.
 *   D. i18n: seluruh key data-i18n* di ketiga HTML + key t('...') di semua JS
 *      ada di kamus EN & ID; himpunan key EN dan ID identik.
 *   E. Privasi & storage: hanya envmoss:theme & envmoss:language yang ditulis;
 *      semua akses storage try/catch; tidak ada fetch/XHR/WebSocket/telemetry;
 *      tidak ada isi .env yang disimpan; tidak ada dependency/CDN.
 *   F. Isolasi CSS: tiap halaman hanya memuat styles.css + css halamannya;
 *      landing.css & guide.css fully namespaced; tool.css hanya di /app/.
 *   G. Perilaku tema/bahasa: siklus light→dark→system, lang attribute diupdate,
 *      pending flag dilepas di finally (fallback EN), app.js re-render dinamis.
 *   H. README: EN/ID saling tertaut dekat atas, memuat Landing/Tool/Guide,
 *      cara menjalankan lokal, privasi, batasan parser, lisensi.
 *   I. Higiene repo: tidak ada file .env/secret ter-commit; LICENSE ada.
 *   J. Regresi engine v1.0.0: env-engine & output-generator mengekspor API yang
 *      dibutuhkan app.js; tool page memuat app.js + engine.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { execSync } from 'child_process';

const ROOT = 'c:/envmoss';
let passed = 0;
let failed = 0;
function check(id, condition, description) {
  if (condition) {
    console.log(`  [M12-${id}] PASS: ${description}`);
    passed++;
  } else {
    console.error(`  [M12-${id}] FAIL: ${description}`);
    failed++;
  }
}
function note(msg) {
  console.log(`  [M12-note] ${msg}`);
}

const pages = {
  landing: { file: 'index.html', dir: '.' },
  tool: { file: 'app/index.html', dir: 'app' },
  guide: { file: 'guide/index.html', dir: 'guide' }
};
const html = {};
const heads = {};
for (const [name, p] of Object.entries(pages)) {
  html[name] = fs.readFileSync(path.join(ROOT, p.file), 'utf8');
  heads[name] = (html[name].match(/<head>([\s\S]*?)<\/head>/) || [, ''])[1];
}
const cssFiles = {
  styles: fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8'),
  tool: fs.readFileSync(path.join(ROOT, 'css/tool.css'), 'utf8'),
  landing: fs.readFileSync(path.join(ROOT, 'css/landing.css'), 'utf8'),
  guide: fs.readFileSync(path.join(ROOT, 'css/guide.css'), 'utf8')
};
const jsFiles = {};
for (const f of fs.readdirSync(path.join(ROOT, 'js'))) {
  jsFiles['js/' + f] = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8');
}
const allJs = Object.values(jsFiles).join('\n');
const readmeEn = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const readmeId = fs.readFileSync(path.join(ROOT, 'README.id.md'), 'utf8');

// ===========================================================================
// A. Route & runtime — server statis lokal
// ===========================================================================
await new Promise((resolve) => {
  const MIME = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css',
    '.js': 'text/javascript', '.ttf': 'font/ttf',
    '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml',
    '.txt': 'text/plain'
  };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    } else {
      res.writeHead(404); res.end('nf');
    }
  });
  server.listen(0, '127.0.0.1', async () => {
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;

    // A1. Route resmi 200 (direct URL + refresh = GET yang sama)
    const routes = ['/', '/app/', '/guide/'];
    let routesOk = true;
    for (const r of routes) {
      try {
        const resp = await fetch(base + r);
        const ct = resp.headers.get('content-type') || '';
        if (resp.status !== 200 || !ct.includes('text/html')) {
          routesOk = false;
          note(`route ${r} → ${resp.status} (${ct})`);
        }
        // refresh = GET kedua harus identik statusnya
        const resp2 = await fetch(base + r);
        if (resp2.status !== 200) routesOk = false;
      } catch (e) { routesOk = false; note(`route ${r} error: ${e.message}`); }
    }
    check('routes-200', routesOk, 'Route /, /app/, /guide/ return 200 text/html (direct + refresh)');

    // A2. Navigasi antarhalaman: semua tautan nav internal resolve 200
    let navOk = true;
    const navHrefs = new Set();
    for (const name of Object.keys(pages)) {
      for (const m of html[name].matchAll(/<a[^>]+href="(\.\.?\/[^"]*)"/g)) {
        navHrefs.add(m[1]);
      }
    }
    for (const href of navHrefs) {
      // resolve relatif terhadap root (semua halaman memakai ./ atau ../ yang
      // resolve ke path root yang sama karena kedalaman seragam)
      const abs = path.posix.normalize('/' + href.replace(/^\.?\//, ''));
      const target = abs.endsWith('/') ? abs + 'index.html' : abs;
      const resp = await fetch(base + target);
      if (resp.status !== 200) {
        navOk = false;
        note(`nav target ${href} → ${abs} status ${resp.status}`);
      }
    }
    check('nav-targets-200', navOk,
      `Semua ${navHrefs.size} tautan internal antarhalaman resolve ke resource 200`);

    // A3. Semua aset yang dirujuk halaman (css/js/font/dll.) → 200
    const assetSet = new Set();
    for (const name of Object.keys(pages)) {
      const dir = pages[name].dir;
      for (const m of html[name].matchAll(/(?:src|href)="(\.\.?\/[^"]+\.(?:css|js|ttf|png|svg|ico|webp|jpe?g))"/g)) {
        const abs = path.posix.normalize('/' + path.posix.join(dir, m[1]).replace(/\\/g, '/'));
        assetSet.add(abs);
      }
    }
    let assetsOk = true;
    for (const a of assetSet) {
      const resp = await fetch(base + a);
      if (resp.status !== 200) { assetsOk = false; note(`asset ${a} → ${resp.status}`); }
    }
    check('assets-200', assetsOk,
      `Semua ${assetSet.size} aset (css/js/font) dimuat 200 OK dari ketiga halaman`);

    // A4. Catatan: varian tanpa trailing slash (bukan rute resmi)
    const noSlash = {};
    for (const r of ['/app', '/guide']) {
      try { noSlash[r] = (await fetch(base + r)).status; }
      catch (e) { noSlash[r] = 'ERR'; }
    }
    note(`varian tanpa trailing slash: /app→${noSlash['/app']}, /guide→${noSlash['/guide']} ` +
      `(host statis produksi umumnya redirect ke bentuk bertanda /; semua tautan internal memakai trailing slash)`);

    // A5. Aset tidak ada → 404 (sanity server)
    const nf = await fetch(base + '/tidak-ada.css');
    check('missing-404', nf.status === 404, 'Resource tidak ada menghasilkan 404 (bukan fallback HTML)');

    if (server.closeAllConnections) server.closeAllConnections();
    server.close(resolve);
  });
});

// ===========================================================================
// B. Bootstrap head — inline, blocking, identik, anti-FOUC
// ===========================================================================
const bsBlocks = {};
for (const name of Object.keys(pages)) {
  const m = heads[name].match(/<script>([\s\S]*?)<\/script>/);
  bsBlocks[name] = m ? m[1] : '';
}
const bsNorm = s => s.replace(/\r\n/g, '\n');
check('bootstrap-identical',
  bsNorm(bsBlocks.landing) === bsNorm(bsBlocks.tool) &&
  bsNorm(bsBlocks.tool) === bsNorm(bsBlocks.guide) && bsBlocks.landing.length > 200,
  'Skrip bootstrap preferensi identik di ketiga halaman (modulo line-ending)');
const bs = bsBlocks.landing;
check('bootstrap-inline-blocking',
  /<script>\s*\(function \(\)/.test(heads.landing) &&
  !/async|defer|type="module"|src=/.test(heads.landing.match(/<script>[\s\S]*?<\/script>/)[0]),
  'Bootstrap inline <script> tanpa async/defer/module/src (blocking)');
check('bootstrap-before-css',
  Object.values(heads).every(h => h.indexOf('<script>') !== -1 &&
    h.indexOf('<script>') < h.indexOf('rel="stylesheet"')),
  'Bootstrap muncul sebelum stylesheet pertama di semua halaman (anti-FOUC)');
check('bootstrap-sets-attrs',
  bs.includes("setAttribute('data-theme'") && bs.includes("setAttribute('data-theme-pref'") &&
  bs.includes("setAttribute('lang'") && bs.includes("setAttribute('data-lang'") &&
  bs.includes("setAttribute('data-i18n-pending'"),
  'Bootstrap menetapkan data-theme, data-theme-pref, lang, data-lang, data-i18n-pending');
check('bootstrap-validates',
  ["'light'", "'dark'", "'system'", "'en'", "'id'"].every(v => bs.includes(v)),
  'Bootstrap memvalidasi nilai light/dark/system/en/id (nilai invalid → fallback)');
check('bootstrap-fallbacks',
  (bs.match(/try\s*\{/g) || []).length >= 3 &&
  bs.includes('matchMedia') && bs.includes('navigator.languages'),
  'Bootstrap punya try/catch storage, fallback matchMedia & navigator.languages');
check('bootstrap-no-network',
  !/fetch\s*\(|XMLHttpRequest|import\s/.test(bs),
  'Bootstrap tidak melakukan request jaringan atau import');
check('no-base-tag',
  Object.values(html).every(h => !/<base[\s>]/i.test(h)),
  'Tidak ada <base> tag (aman untuk base path subdirektori)');

// ===========================================================================
// C. Relative path & resolusi aset/module
// ===========================================================================
function checkPagePaths(name) {
  const dir = pages[name].dir;
  const refs = [...html[name].matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
  const local = refs.filter(r => !/^(https?:|mailto:|tel:|#|data:)/.test(r));
  const bad = local.filter(r => !r.startsWith('./') && !r.startsWith('../'));
  check(`paths-relative-${name}`, bad.length === 0,
    `Semua referensi internal ${name} relatif${bad.length ? ' — non-relatif: ' + bad.join(',') : ''}`);

  const missing = [];
  for (const r of local) {
    if (r.startsWith('#')) continue;
    const abs = path.join(ROOT, dir, r);
    const isDir = r.endsWith('/');
    const file = isDir ? path.join(abs, 'index.html') : abs;
    if (!fs.existsSync(file)) missing.push(r);
  }
  check(`paths-exist-${name}`, missing.length === 0,
    `Semua path internal ${name} resolve ke file yang ada` +
    (missing.length ? ' — hilang: ' + missing.join(',') : ''));

  // Anchor internal (#id) harus punya target id di halaman yang sama
  const ids = new Set([...html[name].matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  const anchors = [...html[name].matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
  const deadAnchors = anchors.filter(a => !ids.has(a));
  check(`anchors-${name}`, deadAnchors.length === 0,
    `Semua anchor #internal ${name} punya target${deadAnchors.length ? ' — mati: ' + deadAnchors.join(',') : ''}`);
}
for (const name of Object.keys(pages)) checkPagePaths(name);

// CSS url(...) resolve relatif terhadap css/
const cssUrlMissing = [];
for (const [name, src] of Object.entries(cssFiles)) {
  for (const m of src.matchAll(/url\(['"]?(\.\.?\/[^'")]+)['"]?\)/g)) {
    const abs = path.join(ROOT, 'css', m[1]);
    if (!fs.existsSync(abs)) cssUrlMissing.push(`${name}: ${m[1]}`);
  }
}
check('css-urls-exist', cssUrlMissing.length === 0,
  `Semua url() di CSS resolve ke file yang ada` +
  (cssUrlMissing.length ? ' — hilang: ' + cssUrlMissing.join(',') : ''));

// ES module imports resolve ke file yang ada
const importMissing = [];
for (const [file, src] of Object.entries(jsFiles)) {
  for (const m of src.matchAll(/(?:import|export)[^'"]*?from\s+['"](\.\.?\/[^'"]+)['"]/g)) {
    const abs = path.join(ROOT, path.dirname(file), m[1]);
    if (!fs.existsSync(abs)) importMissing.push(`${file} → ${m[1]}`);
  }
}
check('js-imports-exist', importMissing.length === 0,
  `Semua ES module import resolve` +
  (importMissing.length ? ' — hilang: ' + importMissing.join(',') : ''));

// ===========================================================================
// D. i18n — kelengkapan kamus EN/ID untuk semua key yang dipakai
// ===========================================================================
const i18nSrc = jsFiles['js/i18n.js'];
const enBlock = i18nSrc.slice(i18nSrc.indexOf('en: {'), i18nSrc.indexOf('id: {'));
const idBlock = i18nSrc.slice(i18nSrc.indexOf('id: {'), i18nSrc.indexOf('};', i18nSrc.indexOf('id: {')));
const keyRe = /'([a-zA-Z0-9_.]+)':\s*'/g;
const enKeys = new Set([...enBlock.matchAll(keyRe)].map(m => m[1]));
const idKeys = new Set([...idBlock.matchAll(keyRe)].map(m => m[1]));

const usedKeys = new Set();
for (const name of Object.keys(pages)) {
  for (const m of html[name].matchAll(/data-i18n="([^"]+)"/g)) usedKeys.add(m[1]);
  for (const m of html[name].matchAll(/data-i18n-html="([^"]+)"/g)) usedKeys.add(m[1]);
  for (const m of html[name].matchAll(/data-i18n-attr="([^"]+)"/g)) {
    for (const pair of m[1].split(';')) {
      const k = pair.split(':').pop().trim();
      if (k) usedKeys.add(k);
    }
  }
}
for (const [file, src] of Object.entries(jsFiles)) {
  for (const m of src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.]+)'/g)) usedKeys.add(m[1]);
  for (const m of src.matchAll(/\bt\(\s*"([a-zA-Z0-9_.]+)"/g)) usedKeys.add(m[1]);
}
// Key dinamis yang dibangun via konkatenasi (mis. t('theme.' + pref))
// muncul sebagai prefiks tidak lengkap — bukan key kamus yang kurang.
for (const k of [...usedKeys]) {
  if (k.endsWith('.')) usedKeys.delete(k);
}
const missingEn = [...usedKeys].filter(k => !enKeys.has(k));
const missingId = [...usedKeys].filter(k => !idKeys.has(k));
check('i18n-used-en', missingEn.length === 0,
  `Semua ${usedKeys.size} key terpakai ada di kamus EN` +
  (missingEn.length ? ' — kurang: ' + missingEn.join(',') : ''));
check('i18n-used-id', missingId.length === 0,
  `Semua key terpakai ada di kamus ID` +
  (missingId.length ? ' — kurang: ' + missingId.join(',') : ''));
const onlyEn = [...enKeys].filter(k => !idKeys.has(k));
const onlyId = [...idKeys].filter(k => !enKeys.has(k));
check('i18n-parity', onlyEn.length === 0 && onlyId.length === 0,
  `Himpunan key EN (${enKeys.size}) dan ID (${idKeys.size}) identik` +
  (onlyEn.length ? ' — hanya EN: ' + onlyEn.slice(0, 5).join(',') : '') +
  (onlyId.length ? ' — hanya ID: ' + onlyId.slice(0, 5).join(',') : ''));

// ===========================================================================
// E. Privasi, storage, network, dependency
// ===========================================================================
const storageWrites = [...allJs.matchAll(/(?:localStorage|sessionStorage)\.setItem\(\s*['"]([^'"]+)['"]/g)]
  .map(m => m[1]);
// storageGet di site.js dipanggil dengan variabel key — audit manual key literal
const storageKeysLiteral = [...allJs.matchAll(/storageGet\(\s*'([^']+)'\s*\)|storageSet\(\s*'([^']+)'/g)]
  .map(m => m[1] || m[2]);
const allowedKeys = new Set(['envmoss:theme', 'envmoss:language']);
const badKeys = [...new Set([...storageWrites, ...storageKeysLiteral])].filter(k => !allowedKeys.has(k));
check('storage-keys', badKeys.length === 0 && storageWrites.length === 0,
  `Hanya envmoss:theme & envmoss:language yang disentuh storage` +
  (badKeys.length ? ' — key lain: ' + badKeys.join(',') : ' — setItem hanya via storageSet()') );
check('bootstrap-storage-keys',
  [...bs.matchAll(/localStorage\.(?:get|set|remove)Item\(\s*'([^']+)'/g)].map(m => m[1])
    .every(k => allowedKeys.has(k)) &&
  (bs.match(/localStorage\.(?:get|set|remove)Item/g) || []).length === 2,
  'Bootstrap hanya membaca envmoss:theme & envmoss:language (tidak menulis)');
check('storage-trycatch',
  jsFiles['js/site.js'].includes('function storageGet') &&
  /function storageGet[\s\S]*?try\s*\{[\s\S]*?\}\s*catch/.test(jsFiles['js/site.js']) &&
  /function storageSet[\s\S]*?try\s*\{[\s\S]*?\}\s*catch/.test(jsFiles['js/site.js']),
  'storageGet/storageSet dibungkus try/catch (storage diblokir → tetap jalan)');
check('no-network-js',
  !/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|\.ajax\s*\(/.test(allJs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')),
  'Tidak ada fetch/XHR/WebSocket/sendBeacon di seluruh JS');
const jsNoComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
check('no-content-storage',
  !/localStorage|sessionStorage|indexedDB|document\.cookie/.test(
    jsNoComments(jsFiles['js/app.js'] + jsFiles['js/env-engine.js'] +
      jsFiles['js/output-generator.js'] + jsFiles['js/guide.js'])),
  'app.js/engine/output/guide tidak menulis storage (isi .env tidak pernah disimpan)');
const thirdParty = [];
for (const [name, h] of Object.entries(html)) {
  for (const m of h.matchAll(/(?:src|href)="(https?:\/\/[^"]+)"/g)) {
    if (!/envmoss\.vercel\.app|github\.com\/nyomann-arch\/EnvMoss|w3\.org|schema\.org/.test(m[1])) {
      thirdParty.push(`${name}: ${m[1]}`);
    }
  }
}
check('no-thirdparty', thirdParty.length === 0,
  `Tidak ada resource pihak ketiga di HTML` +
  (thirdParty.length ? ' — ' + thirdParty.join(',') : ' (hanya canonical/og & repo resmi)'));
check('no-analytics',
  !/googletagmanager|google-analytics|plausible|fathom|hotjar|segment\.|mixpanel|amplitude/i.test(allJs + Object.values(html).join('\n')),
  'Tidak ada analytics/telemetry/CDN/external font');
check('no-package-deps',
  !fs.existsSync(path.join(ROOT, 'package.json')) && !fs.existsSync(path.join(ROOT, 'node_modules')),
  'Tidak ada package.json/node_modules — situs statis tanpa dependency runtime');
// git check dilakukan via execGit() di bagian I

// ===========================================================================
// F. Isolasi CSS & pemakaian stylesheet per halaman
// ===========================================================================
const pageCssExpect = { landing: ['styles.css', 'landing.css'], tool: ['styles.css', 'tool.css'], guide: ['styles.css', 'guide.css'] };
let cssLoadOk = true;
for (const name of Object.keys(pages)) {
  const loaded = [...html[name].matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m => path.basename(m[1]));
  const expected = pageCssExpect[name];
  if (loaded.length !== expected.length || !expected.every(e => loaded.includes(e))) {
    cssLoadOk = false;
    note(`${name} memuat: ${loaded.join(', ')}`);
  }
}
check('css-per-page', cssLoadOk,
  'Tiap halaman hanya memuat styles.css + stylesheet halamannya sendiri');

function selectorsOf(src) {
  return [...src.matchAll(/([^{}@]+)\{/g)]
    .filter(m => {
      // Buang prelude at-rule (@media/@supports/dll) — bukan selector
      let i = m.index - 1;
      while (i >= 0 && /\s/.test(src[i])) i--;
      return src[i] !== '@';
    })
    .map(m => m[1].trim())
    .filter(s => s && !s.startsWith('/*') && s !== 'from' && s !== 'to');
}
const landingSels = selectorsOf(cssFiles.landing);
const guideSels = selectorsOf(cssFiles.guide);
const badLanding = landingSels.filter(s => !s.split(',').every(x => /^\s*\.landing-/.test(x)));
const badGuide = guideSels.filter(s => !s.split(',').every(x => /^\s*\.guide-/.test(x)));
check('css-ns-landing', badLanding.length === 0,
  `landing.css fully namespaced .landing-* (${landingSels.length} rule)`);
check('css-ns-guide', badGuide.length === 0,
  `guide.css fully namespaced .guide-* (${guideSels.length} rule)`);
check('css-tool-contained',
  !html.landing.includes('tool.css') && !html.guide.includes('tool.css') &&
  !html.landing.includes('guide.css') && !html.tool.includes('guide.css') &&
  !html.tool.includes('landing.css') && !html.guide.includes('landing.css'),
  'tool.css/guide.css/landing.css tidak saling memuat di halaman lain');
// Pastikan selector generik tool.css tidak menimpa komponen site-*
const toolSels = selectorsOf(cssFiles.tool);
const siteCollisions = toolSels.filter(s => /(^|[\s,>+~])\.(site-|landing-|guide-)/.test(s));
check('css-tool-no-site-collision', siteCollisions.length === 0,
  'tool.css tidak menarget komponen .site-*/.landing-*/.guide-*' +
  (siteCollisions.length ? ' — ' + siteCollisions.slice(0, 3).join(' | ') : ''));

// ===========================================================================
// G. Perilaku tema/bahasa (level statis modul)
// ===========================================================================
const siteJs = jsFiles['js/site.js'];
check('theme-cycle',
  siteJs.includes("['light', 'dark', 'system']") && siteJs.includes('THEME_ORDER'),
  'Kontrol tema mensikluskan light → dark → system');
check('theme-system-watch',
  siteJs.includes('prefers-color-scheme: dark') && siteJs.includes('addEventListener') &&
  siteJs.includes("=== 'system'"),
  'Mode System mengikuti prefers-color-scheme OS secara live');
const setKeys = [...siteJs.matchAll(/storageSet\(\s*'([^']+)'/g)].map(m => m[1]);
check('theme-storage-key',
  setKeys.length > 0 && setKeys.every(k => allowedKeys.has(k)),
  `storageSet hanya menulis key preferensi yang diizinkan (${setKeys.join(', ')})`);
check('lang-attr-update',
  jsFiles['js/i18n.js'].includes("setAttribute('lang'") &&
  jsFiles['js/i18n.js'].includes("setAttribute('data-lang'"),
  'applyI18n memperbarui atribut lang & data-lang pada <html>');
check('pending-release-finally',
  /finally\s*\{[\s\S]*?removeAttribute\('data-i18n-pending'\)/.test(jsFiles['js/i18n.js']),
  'Penanda data-i18n-pending dilepas di finally — konten tidak tersembunyi saat gagal');
check('pending-css-scoped',
  /html\[data-i18n-pending="true"\]\s*\[data-i18n/.test(cssFiles.styles),
  'Aturan anti-FOUC bahasa hanya menyembunyikan elemen bertanda data-i18n*');
check('app-rerender-lang',
  jsFiles['js/app.js'].includes('onLanguageChange(refreshLocalizedUi)'),
  'app.js mendaftar ulang render UI dinamis saat bahasa berganti');
check('body-page-classes',
  html.landing.includes('page--landing') && html.tool.includes('page--tool') && html.guide.includes('page--guide'),
  'Kelas konteks halaman page--landing/tool/guide terpasang');

// ===========================================================================
// H. README EN/ID
// ===========================================================================
const readmeHeadEn = readmeEn.slice(0, 1200);
const readmeHeadId = readmeId.slice(0, 1200);
check('readme-en-file', readmeEn.length > 3000 && /EnvMoss/.test(readmeEn), 'README.md (English) ada & lengkap');
check('readme-id-file', readmeId.length > 3000 && /EnvMoss/.test(readmeId), 'README.id.md (Bahasa Indonesia) ada & lengkap');
check('readme-cross-links',
  /README\.id\.md/.test(readmeHeadEn) && /README\.md/.test(readmeHeadId),
  'Kedua README saling tertaut di dekat bagian atas');
check('readme-routes',
  /\/app\//.test(readmeEn) && /\/guide\//.test(readmeEn) && /\/app\//.test(readmeId) && /\/guide\//.test(readmeId),
  'README menjelaskan perbedaan Landing (/), Tool (/app/), Guide (/guide/)');
check('readme-local-run',
  /http\.server|localhost|serve|run locally|menjalankan lokal/i.test(readmeEn) &&
  /http\.server|localhost|serve|menjalankan lokal/i.test(readmeId),
  'README menjelaskan cara menjalankan lokal');
check('readme-privacy',
  /client.side|browser|privac/i.test(readmeEn) && /klien|browser|privasi/i.test(readmeId),
  'README menjelaskan privasi client-side');
check('readme-parser-limits',
  /pars|syntax|dotenv|limit/i.test(readmeEn) && /pars|sintaks|dotenv|batas/i.test(readmeId),
  'README menjelaskan keterbatasan parser/sintaks');
check('readme-license',
  /MIT/.test(readmeEn) && /MIT/.test(readmeId) && fs.existsSync(path.join(ROOT, 'LICENSE')),
  'README menyebut lisensi MIT dan LICENSE ada');

// ===========================================================================
// I. Higiene repo — tidak ada secret ter-commit
// ===========================================================================
const envFiles = execGit('ls-files').split('\n')
  .map(s => s.trim()).filter(s => /(^|\/)\.env|secret|credential|\.pem$|\.key$/i.test(s));
check('no-secret-files', envFiles.length === 0,
  `Tidak ada file .env/secret/key ter-commit di repo` +
  (envFiles.length ? ' — ' + envFiles.join(',') : ''));

// ===========================================================================
// J. Regresi engine v1.0.0 — API yang dipakai app.js masih utuh
// ===========================================================================
const engineSrc = jsFiles['js/env-engine.js'];
const outSrc = jsFiles['js/output-generator.js'];
check('engine-exports',
  ['stripBOM', 'isValidKeyName', 'parseEnv', 'compareEnvFiles'].every(fn =>
    new RegExp(`export function ${fn}\\b`).test(engineSrc)),
  'env-engine.js mengekspor stripBOM/isValidKeyName/parseEnv/compareEnvFiles');
check('output-exports',
  ['detectLineEnding', 'generateMarkdownChecklist', 'generateMergedEnv', 'downloadFile'].every(fn =>
    new RegExp(`export (?:function|const) ${fn}\\b`).test(outSrc)),
  'output-generator.js mengekspor 4 fungsi output');
check('tool-wiring',
  html.tool.includes('../js/app.js') && html.tool.includes('../js/env-engine.js') === false &&
  jsFiles['js/app.js'].includes("from './env-engine.js'") &&
  jsFiles['js/app.js'].includes("from './output-generator.js'"),
  'app/index.html memuat app.js; app.js mengimpor engine & output generator');
check('tool-core-elements',
  /id="[^"]*base/i.test(html.tool) && /id="[^"]*target/i.test(html.tool) &&
  html.tool.includes('data-i18n="tool.compare"') && html.tool.includes('data-i18n="tool.clearAll"'),
  'Elemen inti Tool (input Base/Target, Bandingkan, Hapus Semua) hadir');

function execGit(args) {
  try {
    return execSync(`git ${args}`, { cwd: ROOT, encoding: 'utf8' });
  } catch (e) {
    return '';
  }
}

console.log(`\n=== HASIL M12: ${passed} PASS, ${failed} FAIL ===`);
setTimeout(() => process.exit(failed > 0 ? 1 : 0), 150);
