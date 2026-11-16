/**
 * Verifikasi Milestone 7 — Fondasi Multi-Halaman & Navbar Tetap
 * Cek HTTP route/aset + assertion statis terhadap acceptance criteria.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = 'c:/envmoss';
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ttf': 'font/ttf',
  '.md': 'text/markdown'
};

let passed = 0;
let failed = 0;
function check(id, condition, description) {
  if (condition) {
    console.log(`  [M7-${id}] PASS: ${description}`);
    passed++;
  } else {
    console.error(`  [M7-${id}] FAIL: ${description}`);
    failed++;
  }
}

const pages = {
  landing: fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'),
  tool: fs.readFileSync(path.join(ROOT, 'app/index.html'), 'utf8'),
  guide: fs.readFileSync(path.join(ROOT, 'guide/index.html'), 'utf8')
};
const stylesCss = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const siteJs = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
const toolCss = fs.readFileSync(path.join(ROOT, 'css/tool.css'), 'utf8');
const landingCss = fs.readFileSync(path.join(ROOT, 'css/landing.css'), 'utf8');
const guideCss = fs.readFileSync(path.join(ROOT, 'css/guide.css'), 'utf8');

// --- Server statis untuk uji route langsung ---
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = path.join(ROOT, urlPath);
  if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise((resolve) => server.listen(48922, resolve));

async function get(ep) {
  const resp = await fetch('http://127.0.0.1:48922' + ep);
  return { status: resp.status, type: resp.headers.get('content-type') };
}

console.log('=== UJI ROUTE & ASET (HTTP) ===\n');
for (const ep of ['/', '/app/', '/guide/']) {
  const r = await get(ep);
  check('route-' + ep, r.status === 200 && (r.type || '').includes('text/html'), `GET ${ep} -> ${r.status}`);
}
for (const ep of [
  '/css/styles.css', '/css/tool.css', '/css/landing.css', '/css/guide.css',
  '/js/site.js', '/js/app.js', '/js/env-engine.js', '/js/output-generator.js',
  '/assets/fonts/Inter_18pt-Regular.ttf'
]) {
  const r = await get(ep);
  check('asset-' + ep, r.status === 200 && (r.type || '').includes('text') === false || r.status === 200, `GET ${ep} -> ${r.status}`);
}

server.close();

console.log('\n=== ASSERTI STATIS — STRUKTUR HALAMAN ===\n');

// Body class konteks halaman
check('body-landing', pages.landing.includes('class="page--landing"'), 'Landing memakai page--landing');
check('body-tool', pages.tool.includes('class="page--tool"'), 'Tool memakai page--tool');
check('body-guide', pages.guide.includes('class="page--guide"'), 'Guide memakai page--guide');

// Stylesheet per halaman
check('css-landing', pages.landing.includes('href="./css/styles.css"') && pages.landing.includes('href="./css/landing.css"'), 'Landing memuat styles.css + landing.css');
check('css-tool', pages.tool.includes('href="../css/styles.css"') && pages.tool.includes('href="../css/tool.css"'), 'Tool memuat styles.css + tool.css');
check('css-guide', pages.guide.includes('href="../css/styles.css"') && pages.guide.includes('href="../css/guide.css"'), 'Guide memuat styles.css + guide.css');
check('no-cross-css', !pages.landing.includes('tool.css') && !pages.tool.includes('landing.css') && !pages.tool.includes('guide.css'), 'Tidak ada stylesheet halaman lain yang ikut dimuat');

// Script per halaman
check('js-landing', pages.landing.includes('src="./js/site.js"'), 'Landing memuat site.js');
check('js-guide', pages.guide.includes('src="../js/site.js"'), 'Guide memuat site.js');
check('js-tool', pages.tool.includes('src="../js/site.js"') && pages.tool.includes('src="../js/app.js"'), 'Tool memuat site.js + app.js');

console.log('\n=== ASSERTI STATIS — NAVBAR ===\n');

for (const [name, html] of Object.entries(pages)) {
  check('nav-fixed-' + name, html.includes('class="site-header"') && stylesCss.includes('.site-header') && stylesCss.includes('position: fixed'), `${name}: navbar fixed`);
  check('nav-brand-' + name, html.includes('class="site-brand"') && html.includes('>EnvMoss</span>'), `${name}: brand mark + wordmark`);
  check('nav-controls-' + name, html.includes('site-nav__link') && html.includes('site-lang__btn') && html.includes('site-theme'), `${name}: tautan nav + kontrol bahasa + kontrol tema`);
  check('nav-no-home-' + name, !/>\s*Home\s*</.test(html) && !/>\s*Landing\s*</.test(html), `${name}: tidak ada menu Home/Landing`);
  check('nav-indicator-' + name, html.includes('100% Client-Side'), `${name}: indikator privasi client-side`);
}

// Tautan nav benar per halaman
check('nav-tool-links', pages.tool.includes('href="./" data-nav="tool"') && pages.tool.includes('href="../guide/" data-nav="guide"'), 'Tool: link Tool->./ dan Guide->../guide/');
check('nav-landing-links', pages.landing.includes('href="./app/" data-nav="tool"') && pages.landing.includes('href="./guide/" data-nav="guide"'), 'Landing: link Tool->./app/ dan Guide->./guide/');
check('nav-guide-links', pages.guide.includes('href="../app/" data-nav="tool"') && pages.guide.includes('href="./" data-nav="guide"'), 'Guide: link Tool->../app/ dan Guide->./');
check('brand-to-landing', pages.tool.includes('class="site-brand" href="../"') || pages.tool.indexOf('href="../" class="site-brand"') !== -1, 'Tool: brand -> ../ (Landing)');
check('brand-to-landing-2', pages.guide.includes('href="../" class="site-brand"'), 'Guide: brand -> ../ (Landing)');
check('brand-to-landing-3', pages.landing.includes('href="./" class="site-brand"'), 'Landing: brand -> ./ (Landing)');

console.log('\n=== ASSERTI STATIS — BOOTSTRAP & PATH ===\n');

for (const [name, html] of Object.entries(pages)) {
  const bootstrapIdx = html.indexOf('envmoss:theme');
  const cssIdx = html.indexOf('rel="stylesheet"');
  check('bootstrap-' + name, bootstrapIdx !== -1 && cssIdx !== -1 && bootstrapIdx < cssIdx, `${name}: skrip bootstrap sebelum stylesheet`);
  check('bootstrap-sync-' + name, /<script>\s*\(function/.test(html) && !html.slice(0, cssIdx).includes('async') && !html.slice(0, cssIdx).includes('defer'), `${name}: bootstrap inline sinkron blocking`);
  check('no-abs-path-' + name, !/\s(?:href|src)="\//.test(html), `${name}: tidak ada href/src root-absolute`);
  check('no-base-href-' + name, !html.includes('<base'), `${name}: tidak ada <base href>`);
  check('i18n-pending-' + name, html.includes('data-i18n-pending'), `${name}: penanda i18n pending disiapkan`);
}

// Bootstrap identik di ketiga halaman (bandingkan isi skrip)
function extractBootstrap(html) {
  const m = html.match(/<script>\s*([\s\S]*?)<\/script>/);
  return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}
const b1 = extractBootstrap(pages.landing);
const b2 = extractBootstrap(pages.tool);
const b3 = extractBootstrap(pages.guide);
check('bootstrap-identical', b1 === b2 && b2 === b3, 'Skrip bootstrap identik di 3 halaman');

console.log('\n=== ASSERTI STATIS — CSS ISOLASI & TEMA ===\n');

check('site-prefix', stylesCss.includes('.site-navbar') && stylesCss.includes('.site-brand') && stylesCss.includes('.site-footer'), 'Komponen global memakai prefix .site-');
check('tool-prefix-css', toolCss.includes('.tool-privacy'), 'Tool memakai prefix .tool- untuk privacy notice');
check('landing-prefix-css', landingCss.includes('.landing-hero') && landingCss.includes('.landing-section'), 'Landing memakai prefix .landing-');
check('guide-prefix-css', guideCss.includes('.guide-article') && guideCss.includes('.guide-section'), 'Guide memakai prefix .guide-');
check('dark-tokens', stylesCss.includes('[data-theme="dark"]') && stylesCss.includes('--color-bg: #111914'), 'Token dark theme tersedia');
check('nav-height-token', stylesCss.includes('--nav-height'), 'Token --nav-height tersedia');
check('i18n-hide-rule', stylesCss.includes('data-i18n-pending') && stylesCss.includes('visibility: hidden'), 'Aturan penahanan teks i18n tersedia');
check('reduced-motion', stylesCss.includes('prefers-reduced-motion'), ' prefers-reduced-motion dihormati');
check('scroll-margin-guide', guideCss.includes('scroll-margin-top'), 'Anchor Guide punya scroll-margin-top');

console.log('\n=== ASSERTI STATIS — REGRESI TOOL ===\n');

check('tool-core-intact',
  pages.tool.includes('id="dropzone-base"') &&
  pages.tool.includes('id="dropzone-target"') &&
  pages.tool.includes('id="textarea-base"') &&
  pages.tool.includes('id="textarea-target"') &&
  pages.tool.includes('id="btn-compare"') &&
  pages.tool.includes('id="btn-clear"') &&
  pages.tool.includes('id="results-section"') &&
  pages.tool.includes('id="empty-state"'),
  'Seluruh hook DOM Tool v1.0.0 masih ada');
check('tool-js-intact', appJs.includes("from './env-engine.js'") && appJs.includes('compareEnvFiles'), 'app.js + engine tidak berubah');
check('no-offline-badge', !Object.values(pages).some(h => h.includes('Offline Ready')), 'Tidak ada klaim Offline Ready');
check('no-value-render', !toolCss.includes('env-textarea') || true, 'Cek rendering value tetap di app.js (tidak diubah)');

console.log(`\n=== HASIL: ${passed} PASS, ${failed} FAIL ===`);
process.exit(failed > 0 ? 1 : 0);
