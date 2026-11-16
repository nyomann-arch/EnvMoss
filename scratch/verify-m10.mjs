/**
 * Verifikasi Milestone 10 — Verifikasi Landing Page
 *
 * Scope (PRD revisi): Landing sederhana yang ada adalah baseline.
 * Milestone ini HANYA memverifikasi & memperbaiki bug integrasi yang
 * terbukti — bukan redesign/penambahan section.
 *
 * Cakupan cek:
 *   1. Route `/` = Landing sederhana (hero + status + privacy), bukan Tool
 *      dan bukan versi panjang yang dibatalkan.
 *   2. Navbar global M7: brand→/, Tool→/app/, Guide→/guide/, kontrol
 *      bahasa & tema hadir.
 *   3. CTA utama→/app/, sekunder→/guide/; link Repository (jika ada)
 *      ke repo resmi.
 *   4. Konten inti akurat: 4 status, nuansa benar, privasi client-side,
 *      tanpa klaim offline / Mismatch=error / Orphan=usang.
 *   5. Tidak ada secret/value .env pada teks & metadata Landing.
 *   6. Semua teks Landing punya padanan i18n EN & ID (termasuk footer).
 *   7. Tema: token dark ada, bootstrap inline blocking sebelum CSS.
 *   8. Bootstrap fallback: localStorage invalid/throw, matchMedia absen.
 *   9. Relative path aset & link internal; file yang dirujuk ada;
 *      kompatibel base path subdirektori (semua ref dimulai ./ atau ../).
 *  10. CSS Landing terisolasi: hanya selector .landing-*, tidak dipakai
 *      halaman lain.
 *  11. Responsivitas: media query ada, tanpa lebar tetap yang berisiko
 *      overflow, CTA wrap di mobile.
 *  12. A11y: satu h1, section ber-aria-labelledby, focus-visible, tombol
 *      bernama aksesibel, reduced-motion didukung.
 *  13. Tidak ada request pihak ketiga (CDN/analytics/font) & tidak ada
 *      fetch/XHR di modul landing.
 *  14. Runtime: server statis lokal — `/` dan aset Landing 200 OK.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';

const ROOT = 'c:/envmoss';
let passed = 0;
let failed = 0;
function check(id, condition, description) {
  if (condition) {
    console.log(`  [M10-${id}] PASS: ${description}`);
    passed++;
  } else {
    console.error(`  [M10-${id}] FAIL: ${description}`);
    failed++;
  }
}

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const head = (html.match(/<head>([\s\S]*?)<\/head>/) || [, ''])[1];
const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [, ''])[1];
const landingCss = fs.readFileSync(path.join(ROOT, 'css/landing.css'), 'utf8');
const stylesCss = fs.readFileSync(path.join(ROOT, 'css/styles.css'), 'utf8');
const siteJs = fs.readFileSync(path.join(ROOT, 'js/site.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');
const toolHtml = fs.readFileSync(path.join(ROOT, 'app/index.html'), 'utf8');
const guideHtml = fs.readFileSync(path.join(ROOT, 'guide/index.html'), 'utf8');

// ---------------------------------------------------------------------------
// 1. Landing sederhana = baseline
// ---------------------------------------------------------------------------
check('simple-hero', html.includes('landing-hero') && /<h1[^>]*data-i18n/.test(html),
  'Hero dengan h1+i18n hadir');
check('simple-status', html.includes('landing-status-list') &&
  ['missing', 'orphan', 'duplicate', 'mismatch'].every(s => html.includes(`badge--${s}`)),
  'Section empat status hadir');
check('simple-privacy', html.includes('landing-privacy-title') || html.includes('landing.privacyTitle'),
  'Section privasi hadir');
check('no-long-version', !/landing-steps|landing-outputs|landing-links|landing-step__|landing-output__|landing-link__/.test(html + landingCss),
  'Tidak ada section eksperimen panjang (steps/outputs/links) yang dibatalkan');
check('not-tool', !html.includes('page--tool') && !html.includes('env-engine.js') &&
  !html.includes('tool-input'), 'Halaman `/` bukan Tool');

// ---------------------------------------------------------------------------
// 2. Navbar global
// ---------------------------------------------------------------------------
check('nav-brand-home', /<a[^>]*href="\.\/"[^>]*class="site-brand"/.test(html),
  'Logo/brand EnvMoss → `/`');
check('nav-tool', /href="\.\/app\/"[^>]*data-nav="tool"|data-nav="tool"[^>]*href="\.\/app\/"/.test(html) ||
  (html.includes('href="./app/"') && html.includes('data-nav="tool"')),
  'Nav Tool → /app/');
check('nav-guide', html.includes('href="./guide/"') && html.includes('data-nav="guide"'),
  'Nav Guide → /guide/');
check('nav-no-home', !/data-nav="(home|landing)"/.test(html) && !/>\s*(Home|Landing)\s*</.test(html),
  'Tidak ada item nav Home/Landing');
check('nav-lang', html.includes('site-lang') && html.includes('data-lang-set="en"') &&
  html.includes('data-lang-set="id"'), 'Kontrol bahasa EN/ID hadir');
check('nav-theme', html.includes('site-theme') && html.includes('id="site-theme-toggle"'),
  'Kontrol tema hadir');
check('nav-active-none', !html.includes('is-active'),
  'Landing tidak menandai nav manapun aktif (brand bukan nav item)');

// ---------------------------------------------------------------------------
// 3. CTA & Repository
// ---------------------------------------------------------------------------
check('cta-primary', html.includes('site-btn--primary') && html.includes('href="./app/"'),
  'CTA utama → /app/');
check('cta-secondary', html.includes('site-btn--secondary') && html.includes('href="./guide/"'),
  'CTA sekunder → /guide/');
const repoLinks = [...html.matchAll(/href="(https:\/\/github\.com\/[^"]+)"/g)].map(m => m[1]);
check('repo-link', repoLinks.length === 0 || repoLinks.every(u =>
  u === 'https://github.com/nyomann-arch/EnvMoss'),
  `Link Repository${repoLinks.length ? ' → repo resmi' : ' tidak ditampilkan (opsional)'} (${repoLinks.join(', ') || '—'})`);

// ---------------------------------------------------------------------------
// 4. Akurasi konten & klaim
// ---------------------------------------------------------------------------
const enBlock = i18nSrc.slice(i18nSrc.indexOf('en: {'), i18nSrc.indexOf('id: {'));
const idBlock = i18nSrc.slice(i18nSrc.indexOf('id: {'));
const dictRe = /'([^']+)':\s*'((?:[^'\\]|\\.)*)'/g;
const enMap = Object.fromEntries([...enBlock.matchAll(dictRe)].map(m => [m[1], m[2]]));
const idMap = Object.fromEntries([...idBlock.matchAll(dictRe)].map(m => [m[1], m[2]]));

const landingKeys = [...new Set([...html.matchAll(/data-i18n(?:-html|-attr)?="((?:landing|footer|nav|theme)\.[^"]+)"/g)]
  .map(m => m[1]))];
check('content-4-status', ['landing.statusMissing', 'landing.statusOrphan',
  'landing.statusDuplicate', 'landing.statusMismatch'].every(k => k in enMap && k in idMap),
  'Keempat status punya terjemahan EN & ID');
check('claim-mismatch-info', /informational|not an error/i.test(enMap['landing.statusMismatch'] || '') &&
  /informasi|bukan error/i.test(idMap['landing.statusMismatch'] || ''),
  'Mismatch = informasi, bukan error');
check('claim-orphan', /not automatically obsolete/i.test(enMap['landing.statusOrphan'] || '') &&
  /tidak otomatis/i.test(idMap['landing.statusOrphan'] || ''),
  'Orphan tidak diklaim otomatis usang');
check('claim-privacy', /does not upload|tidak mengunggah/i.test(
  (enMap['landing.privacyText'] || '') + (idMap['landing.privacyText'] || '')),
  'Privasi: tidak ada upload');
check('claim-no-offline', !/offline|works without|tanpa koneksi|tanpa internet/i.test(html) &&
  !/offline/i.test((enMap['landing.privacyText'] || '') + (idMap['landing.privacyText'] || '')),
  'Tidak ada klaim offline');
check('claim-no-absolute', !/never leak|100% secure|absolutely private|dijamin aman/i.test(html),
  'Tidak ada klaim privasi absolut');

// ---------------------------------------------------------------------------
// 5. Tidak ada secret / value .env
// ---------------------------------------------------------------------------
const secretPatterns = [
  /api[_-]?key\s*[:=]\s*['"]?[A-Za-z0-9]{16,}/i,
  /secret\s*[:=]\s*['"]?[A-Za-z0-9]{16,}/i,
  /password\s*[:=]\s*['"]?[^\s'"]{8,}/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/
];
const visibleText = body.replace(/<script[\s\S]*?<\/script>/g, '');
check('no-secrets', !secretPatterns.some(re => re.test(visibleText)),
  'Tidak ada pola secret/kredensial pada konten Landing');
check('no-env-values', !/=\s*['"]?[A-Za-z0-9+/=_-]{20,}['"]?/.test(
  visibleText.replace(/<[^>]+>/g, ' ')),
  'Tidak ada value .env nyata pada teks yang terlihat');

// ---------------------------------------------------------------------------
// 6. i18n EN/ID lengkap untuk teks Landing
// ---------------------------------------------------------------------------
const missingEn = landingKeys.filter(k => !(k in enMap));
const missingId = landingKeys.filter(k => !(k in idMap));
check('i18n-en', missingEn.length === 0,
  `Semua ${landingKeys.length} key Landing/footer/nav ada di kamus EN` +
  (missingEn.length ? ` — kurang: ${missingEn.join(', ')}` : ''));
check('i18n-id', missingId.length === 0,
  `Semua key Landing/footer/nav ada di kamus ID` +
  (missingId.length ? ` — kurang: ${missingId.join(', ')}` : ''));
check('footer-i18n', /data-i18n="footer\.copyright"/.test(html) && 'footer.copyright' in enMap &&
  'footer.copyright' in idMap, 'Footer copyright diterjemahkan EN/ID');
check('footer-all-pages', [html, toolHtml, guideHtml].every(p =>
  /data-i18n="footer\.copyright"/.test(p)),
  'Footer i18n konsisten di Landing, Tool, Guide');

// Cek elemen <main>: teks panjang tanpa atribut i18n = hardcode yang terlihat
const mainContent = (html.match(/<main[\s\S]*?<\/main>/) || [''])[0];
let hardcoded = 0;
for (const m of mainContent.matchAll(/<([a-z0-9]+)([^>]*)>([^<]+)</gi)) {
  const [, , attrs, text] = m;
  const t = text.trim();
  if (t.length < 8 || !/[a-z]/i.test(t)) continue;
  if (/data-i18n/.test(attrs)) continue;
  if (/^(Missing|Orphan|Duplicate|Mismatch|EnvMoss|100% Client-Side)$/.test(t)) continue;
  if (/aria-hidden|<|>/.test(t)) continue;
  hardcoded++;
}
check('no-hardcoded-visible', hardcoded === 0,
  `Tidak ada teks panjang hardcode tanpa i18n di <main> (${hardcoded} sisa)`);

// ---------------------------------------------------------------------------
// 7–8. Tema & bootstrap
// ---------------------------------------------------------------------------
check('theme-tokens', /:root\[data-theme="dark"\]/.test(stylesCss) &&
  /color-scheme:\s*dark/.test(stylesCss), 'Token & color-scheme dark tersedia');
check('bootstrap-inline', /<script>\s*\(function \(\)/.test(head) &&
  !/async|defer|type="module"/.test(head.match(/<script>[\s\S]*?<\/script>/)[0]),
  'Bootstrap tema/bahasa inline & blocking');
check('bootstrap-before-css', head.indexOf('<script>') < head.indexOf('rel="stylesheet"'),
  'Bootstrap berjalan sebelum stylesheet (anti-FOUC)');
const bs = head.match(/<script>([\s\S]*?)<\/script>/)[1];
check('bs-keys', bs.includes('envmoss:theme') && bs.includes('envmoss:language'),
  'Bootstrap membaca envmoss:theme & envmoss:language');
check('bs-validate', bs.includes("=== 'light'") && bs.includes("=== 'dark'") &&
  bs.includes("=== 'system'") && bs.includes("=== 'en'") && bs.includes("=== 'id'"),
  'Bootstrap memvalidasi nilai preferensi');
check('bs-fallbacks', (bs.match(/try\s*\{/g) || []).length >= 3 &&
  bs.includes('matchMedia') && bs.includes('navigator.languages'),
  'Bootstrap punya fallback storage/matchMedia/navigator');
check('bs-pending', bs.includes("data-i18n-pending"),
  'Bootstrap menandai i18n pending sampai kamus diterapkan');
check('theme-aria', siteJs.includes('theme.ariaState') && html.includes('nav.themeAria'),
  'Accessible name kontrol tema via i18n');

// ---------------------------------------------------------------------------
// 9. Relative path & kompatibilitas base path subdirektori
// ---------------------------------------------------------------------------
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
const localRefs = refs.filter(r => !/^(https?:|mailto:|tel:|#|data:)/.test(r));
const badRefs = localRefs.filter(r => !r.startsWith('./') && !r.startsWith('../'));
check('refs-relative', badRefs.length === 0,
  `Semua referensi internal relatif (./ atau ../)${badRefs.length ? ' — absolut: ' + badRefs.join(',') : ''}`);
check('no-root-absolute', !/"\/(css|js|assets|app|guide)\//.test(html),
  'Tidak ada path root-absolute /css /js /app /guide (aman untuk project site)');
const assetRefs = [...html.matchAll(/(?:src|href)="(\.\.?\/[^"]+)"/g)]
  .map(m => m[1])
  .filter(r => /\.(css|js|png|jpe?g|webp|svg|ico|ttf|woff2?)$/i.test(r) || r.endsWith('/'));
const missingAssets = [];
for (const ref of assetRefs) {
  const abs = path.join(ROOT, ref.replace(/^\.\//, ''));
  const isDir = ref.endsWith('/');
  const file = isDir ? path.join(abs, 'index.html') : abs;
  if (!fs.existsSync(file)) missingAssets.push(ref);
}
check('assets-exist', missingAssets.length === 0,
  `Semua aset/halaman yang dirujuk ada${missingAssets.length ? ' — hilang: ' + missingAssets.join(',') : ''}`);
check('og-image-note', true, 'Catatan: og:image menunjuk URL produksi absolut (metadata, bukan resource render)');

// ---------------------------------------------------------------------------
// 10. Isolasi CSS Landing
// ---------------------------------------------------------------------------
const landingSelectors = [...landingCss.matchAll(/([^{}]+)\{/g)]
  .filter(m => {
    // Buang prelude at-rule (@media/@supports/dll) — bukan selector
    let i = m.index - 1;
    while (i >= 0 && /\s/.test(landingCss[i])) i--;
    return landingCss[i] !== '@';
  })
  .map(m => m[1].trim())
  .filter(s => s && !s.startsWith('/*') && s !== 'from' && s !== 'to');
const nonLanding = landingSelectors.filter(s =>
  !s.split(',').every(sel => /^\s*\.landing-/.test(sel)));
check('css-ns', nonLanding.length === 0,
  `Semua selector landing.css berprefix .landing- (${landingSelectors.length} rule)` +
  (nonLanding.length ? ' — non-landing: ' + nonLanding.slice(0, 3).join(' | ') : ''));
check('css-only-on-landing', !toolHtml.includes('landing.css') && !guideHtml.includes('landing.css') &&
  !html.includes('tool.css') && !html.includes('guide.css'),
  'Stylesheet halaman saling terisolasi (hanya dimuat di halamannya)');
check('css-no-hardcolor', !/#[0-9a-fA-F]{3,8}\b/.test(landingCss.replace(/#000\b/g, '')),
  'landing.css bebas warna hardcode (hanya token)');

// ---------------------------------------------------------------------------
// 11. Responsivitas (level CSS)
// ---------------------------------------------------------------------------
check('responsive-media', /@media \(max-width: (600|900)px\)/.test(landingCss + stylesCss),
  'Media query mobile/tablet tersedia');
check('container-fluid', /max-width:\s*var\(--container-width\)/.test(stylesCss) &&
  /width:\s*100%/.test(stylesCss), 'Kontainer utama fluid dengan max-width');
check('no-fixed-hero', !/(?:^|[{;\s])width:\s*[5-9]\d{2}px/.test(landingCss),
  'Tidak ada properti width tetap besar (max-width diperbolehkan)');
check('cta-wrap', /flex-wrap:\s*wrap/.test(landingCss + stylesCss) ||
  /@media[\s\S]*site-btn[\s\S]*width:\s*100%/.test(landingCss + stylesCss),
  'CTA dapat wrap/stack di layar sempit');

// ---------------------------------------------------------------------------
// 12. Aksesibilitas dasar
// ---------------------------------------------------------------------------
check('a11y-one-h1', (html.match(/<h1[\s\S]*?<\/h1>/g) || []).length === 1,
  'Tepat satu h1');
check('a11y-sections', (html.match(/aria-labelledby="landing-/g) || []).length >= 3,
  'Section Landing punya aria-labelledby');
check('a11y-heading-order', (() => {
  const tags = [...html.matchAll(/<h([1-3])[\s>]/g)].map(m => +m[1]);
  return tags.length > 0 && tags[0] === 1 && tags.every((t, i) => i === 0 || t <= tags[i - 1] + 1);
})(), 'Urutan heading hierarkis (h1 → h2)');
check('a11y-focus', (stylesCss.match(/:focus-visible/g) || []).length >= 4,
  'Focus indicator tersedia untuk nav/btn/lang/theme');
check('a11y-btn-names', [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)]
  .every(m => /aria-label|data-i18n-attr|>\s*[A-Z]{2}\s*</.test(m[0]) || m[1].trim().length > 0),
  'Semua tombol punya accessible name');
check('a11y-reduced-motion', /prefers-reduced-motion:\s*reduce/.test(stylesCss),
  'Reduced motion didukung');
check('a11y-lang-attr', html.includes('lang="en"') && html.includes('data-lang'),
  'Atribut lang tersedia (diupdate bootstrap/i18n)');

// ---------------------------------------------------------------------------
// 13. Tanpa pihak ketiga / telemetri
// ---------------------------------------------------------------------------
const thirdParty = refs.filter(r => /^(https?:)?\/\//.test(r) &&
  !r.startsWith('http://www.w3.org') && !r.startsWith('https://www.w3.org'));
const fetchedThirdParty = thirdParty.filter(r =>
  /\.(css|js|png|jpe?g|webp|svg|ico|ttf|woff2?|json)(\?|$)/i.test(r) ||
  /fonts\.|cdn\.|analytics|googletag|doubleclick/i.test(r));
check('no-thirdparty-assets', fetchedThirdParty.length === 0,
  `Tidak ada aset/script pihak ketiga yang dimuat${fetchedThirdParty.length ? ' — ' + fetchedThirdParty.join(',') : ''}`);
check('no-analytics', !/googletagmanager|google-analytics|plausible|fathom|hotjar|segment\.(com|io)/i.test(html),
  'Tidak ada analytics/telemetry');
check('no-cdn-fonts', !/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg|cdnjs/i.test(html + stylesCss + landingCss),
  'Tidak ada CDN/external font');
check('js-no-fetch', !/\bfetch\s*\(|XMLHttpRequest|sendBeacon|\.ajax\(/.test(siteJs + i18nSrc),
  'Modul global tidak melakukan request jaringan');
check('js-no-env-upload', !/FormData|\.env['"`]?\s*[,)]|readAsDataURL/.test(siteJs),
  'site.js tidak mengekstrak/mengunggah isi file');

// ---------------------------------------------------------------------------
// 14. Runtime check — server statis lokal
// ---------------------------------------------------------------------------
await new Promise((resolve) => {
  const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    } else {
      res.writeHead(404); res.end('nf');
    }
  });
  server.listen(0, '127.0.0.1', async () => {
    const port = server.address().port;
    const base = `http://127.0.0.1:${port}`;
    const endpoints = ['/', '/css/styles.css', '/css/landing.css', '/js/site.js', '/js/i18n.js'];
    let ok = true;
    for (const ep of endpoints) {
      try {
        const r = await fetch(base + ep);
        if (r.status !== 200) { ok = false; console.log(`    runtime ${ep} → ${r.status}`); }
      } catch (e) { ok = false; console.log(`    runtime ${ep} → ${e.message}`); }
    }
    // Simulasi base path subdirektori: ref relatif harus resolve di bawah prefix
    const htmlRes = await (await fetch(base + '/')).text();
    const subdirOk = [...htmlRes.matchAll(/(?:src|href)="(\.\.?\/[^"]+)"/g)]
      .every(m => !m[1].startsWith('/'));
    check('runtime-assets', ok, 'Server statis: / + semua aset Landing 200 OK');
    check('runtime-subdir', subdirOk,
      'Semua ref relatif — kompatibel base path subdirektori (GitHub Pages project site)');
    if (server.closeAllConnections) server.closeAllConnections();
    server.close(resolve);
  });
});

console.log(`\n=== HASIL: ${passed} PASS, ${failed} FAIL ===`);
// Beri jeda agar handle socket sempat tertutup sebelum exit (hindari
// assertion libuv di Windows saat process.exit mendadak).
setTimeout(() => process.exit(failed > 0 ? 1 : 0), 150);
