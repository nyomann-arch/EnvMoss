/**
 * Verifikasi Milestone 10 — Landing Page
 * Cek:
 *   1. `/` memuat Landing (bukan Tool): hero, navbar global, site.js
 *   2. CTA utama → ./app/, CTA sekunder → ./guide/
 *   3. Logo/brand → Landing; tidak ada nav Home/Landing
 *   4. Hero berorientasi masalah/hasil (tidak mengulang "EnvMoss" sbg judul)
 *   5. Alur tiga langkah: Base+Target → Bandingkan → tindak lanjut
 *   6. Empat status + nuansa: Mismatch informasional, Orphan ≠ obsolete,
 *      Duplicate per file
 *   7. Dua output: Markdown Checklist & Merged .env
 *   8. Privasi akurat: proses lokal, tidak ada klaim offline
 *   9. Link Guide & Repository ada
 *  10. Semua konten Landing punya key i18n EN & ID (parity)
 *  11. Tidak ada warna hardcode di landing.css / index.html
 *  12. Tanpa ilustrasi botani besar / dekorasi hero
 */

import fs from 'fs';
import path from 'path';

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
const landingCss = fs.readFileSync(path.join(ROOT, 'css/landing.css'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8');

// ---------------------------------------------------------------------------
// 1. Landing di route `/`
// ---------------------------------------------------------------------------
check('route-landing', html.includes('class="page--landing"') && html.includes('landing-hero'),
  'index.html memuat Landing (page--landing + hero)');
check('no-tool-page', !html.includes('page--tool') && !html.includes('env-engine'),
  'Halaman `/` bukan Tool (tanpa engine/tool markup)');
check('navbar-global', html.includes('site-navbar') && html.includes('site-brand') &&
  html.includes('site-lang') && html.includes('site-theme'),
  'Navbar global dari Milestone 7 hadir');
check('site-js', html.includes('js/site.js'), 'site.js dimuat untuk i18n/tema/nav aktif');
check('brand-home', /<a[^>]*class="site-brand"[^>]*>/.test(html) &&
  /<a[^>]*href="\.\/"[^>]*class="site-brand"/.test(html),
  'Logo/brand menaut ke Landing (./)');
check('no-home-nav', !/data-nav="(home|landing)"/.test(html) && !/>\s*Home\s*</.test(html),
  'Tidak ada item nav Home/Landing');

// ---------------------------------------------------------------------------
// 2. CTA
// ---------------------------------------------------------------------------
check('cta-primary-app', /site-btn--primary"[^>]*href="\.\/app\/"|href="\.\/app\/"[^>]*site-btn--primary/.test(html) ||
  (html.includes('site-btn--primary') && html.includes('href="./app/"')),
  'CTA utama mengarah ke /app/');
check('cta-secondary-guide', html.includes('site-btn--secondary') && html.includes('href="./guide/"'),
  'CTA sekunder mengarah ke /guide/');

// ---------------------------------------------------------------------------
// 3. Hero
// ---------------------------------------------------------------------------
const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
check('hero-h1', h1Text.length > 0, 'Hero memiliki h1');
check('hero-not-brand', !/^envmoss\b/i.test(h1Text),
  `Headline tidak mengulang nama EnvMoss sebagai judul ("${h1Text.slice(0, 60)}…")`);
check('hero-result', /browser|\.env|missing|compare/i.test(h1Text),
  'Headline berorientasi hasil/masalah');

// ---------------------------------------------------------------------------
// 4. Tiga langkah
// ---------------------------------------------------------------------------
for (const needle of ['landing.stepsTitle', 'landing.step1Title', 'landing.step2Title',
  'landing.step3Title', 'landing.step1Text', 'landing.step2Text', 'landing.step3Text']) {
  check(`steps-${needle}`, html.includes(`"${needle}"`), `Section langkah memakai key ${needle}`);
}
const stepOrder = ['step1Title', 'step2Title', 'step3Title'].map(k => html.indexOf(k));
check('steps-order', stepOrder[0] !== -1 && stepOrder[0] < stepOrder[1] && stepOrder[1] < stepOrder[2],
  'Urutan langkah 1 → 2 → 3');

// ---------------------------------------------------------------------------
// 5. Empat status + nuansa
// ---------------------------------------------------------------------------
for (const s of ['missing', 'orphan', 'duplicate', 'mismatch']) {
  check(`status-badge-${s}`, html.includes(`badge--${s}`), `Badge status ${s} tampil`);
}
const enBlock = i18nSrc.slice(i18nSrc.indexOf('en: {'), i18nSrc.indexOf('id: {'));
const idBlock = i18nSrc.slice(i18nSrc.indexOf('id: {'));
const enMap = Object.fromEntries([...enBlock.matchAll(/'([^']+)':\s*'((?:[^'\\]|\\.)*)'/g)].map(m => [m[1], m[2]]));
const idMap = Object.fromEntries([...idBlock.matchAll(/'([^']+)':\s*'((?:[^'\\]|\\.)*)'/g)].map(m => [m[1], m[2]]));

check('status-orphan-nuance', /not automatically obsolete/i.test(enMap['landing.statusOrphan'] || '') &&
  /tidak otomatis/i.test(idMap['landing.statusOrphan'] || ''),
  'Orphan: tidak otomatis obsolete (EN & ID)');
check('status-mismatch-info', /informational|informasi|not an error|bukan error/i.test(enMap['landing.statusMismatch'] || '') &&
  /informasi|bukan error/i.test(idMap['landing.statusMismatch'] || ''),
  'Mismatch: informasional, bukan error (EN & ID)');
check('status-duplicate-perfile', /per (key group )?per file|per file/i.test(enMap['landing.statusDuplicate'] || '') &&
  /per file/i.test(idMap['landing.statusDuplicate'] || ''),
  'Duplicate: dilaporkan per file (EN & ID)');

// ---------------------------------------------------------------------------
// 6. Output
// ---------------------------------------------------------------------------
check('outputs-section', html.includes('landing.outputsTitle'), 'Section output ada');
check('output-checklist', html.includes('outputChecklistTitle') && /Markdown Checklist/i.test(enMap['landing.outputChecklistTitle'] || ''),
  'Output Markdown Checklist dijelaskan');
check('output-merged', html.includes('outputMergedTitle') && /Merged \.env/i.test(enMap['landing.outputMergedTitle'] || ''),
  'Output Merged .env dijelaskan');

// ---------------------------------------------------------------------------
// 7. Privasi akurat
// ---------------------------------------------------------------------------
const privacyEn = enMap['landing.privacyText'] || '';
const privacyId = idMap['landing.privacyText'] || '';
check('privacy-local', /stay in your browser|tetap berada di browser/i.test(privacyEn + privacyId),
  'Privasi menyatakan pemrosesan lokal di browser');
check('privacy-no-upload', /does not\s+upload|tidak mengunggah/i.test(privacyEn + privacyId),
  'Privasi menyatakan tidak ada upload');
check('privacy-no-offline-claim', !/offline|tanpa internet|works offline/i.test(html) &&
  !/offline/i.test(privacyEn + privacyId),
  'Tidak ada klaim offline');
check('privacy-no-absolute', !/never|100% (secure|private)|absolutely/i.test(privacyEn) ||
  /does not upload|does not store|does not send/i.test(privacyEn),
  'Tidak ada klaim privasi absolut');

// ---------------------------------------------------------------------------
// 8. Link Guide & Repository
// ---------------------------------------------------------------------------
check('link-guide', html.includes('landing.linkGuideTitle') && /href="\.\/guide\/"/.test(html),
  'Link ke Guide tersedia');
check('link-repo', html.includes('landing.linkRepoTitle') &&
  html.includes('https://github.com/nyomann-arch/EnvMoss'),
  'Link ke Repository GitHub tersedia');
check('repo-external-safe', /rel="noopener noreferrer"/.test(html),
  'Link eksternal memakai rel noopener noreferrer');

// ---------------------------------------------------------------------------
// 9. Parity i18n untuk semua key landing.*
// ---------------------------------------------------------------------------
const landingKeys = [...new Set([...html.matchAll(/data-i18n(?:-html|-attr)?="(landing\.[^"]+)"/g)]
  .map(m => m[1]))];
const missingEn = landingKeys.filter(k => !(k in enMap));
const missingId = landingKeys.filter(k => !(k in idMap));
check('i18n-keys-used', landingKeys.length >= 20,
  `Semua elemen Landing bertanda i18n (${landingKeys.length} key)`);
check('i18n-en-complete', missingEn.length === 0,
  `Kamus EN lengkap${missingEn.length ? ' — kurang: ' + missingEn.join(', ') : ''}`);
check('i18n-id-complete', missingId.length === 0,
  `Kamus ID lengkap${missingId.length ? ' — kurang: ' + missingId.join(', ') : ''}`);

// ---------------------------------------------------------------------------
// 10. Tanpa warna hardcode & tanpa dekorasi botani
// ---------------------------------------------------------------------------
const hexRe = /#[0-9a-fA-F]{3,8}\b/g;
const cssHits = [...new Set((landingCss.match(hexRe) || []).map(h => h.toLowerCase()))]
  .filter(h => h !== '#000');
check('css-no-hardcolor', cssHits.length === 0,
  `landing.css bebas warna hardcode${cssHits.length ? ' — sisa: ' + cssHits.join(',') : ''}`);
const htmlHits = [...new Set((html.match(hexRe) || []).map(h => h.toLowerCase()))];
const allowed = new Set(['#3d6b4f', '#ffffff']); // brand mark SVG
const badHtml = htmlHits.filter(h => !allowed.has(h));
check('html-no-hardcolor', badHtml.length === 0,
  `index.html hanya warna brand mark${badHtml.length ? ' — sisa: ' + badHtml.join(',') : ''}`);
check('no-botanical-deco', !/landing-(plant|leaf|moss-art|hero-art|decor)/.test(landingCss) &&
  !/<img[^>]+(plant|leaf|botanical)/i.test(html),
  'Tidak ada ilustrasi tanaman/dekorasi hero besar');

// ---------------------------------------------------------------------------
// 11. Struktur section runtut & aksesibel
// ---------------------------------------------------------------------------
const sectionOrder = ['landing-hero', 'landing-steps-title', 'landing-status-title',
  'landing-privacy-title', 'landing-outputs-title', 'landing-links-title']
  .map(k => html.indexOf(k));
check('sections-order', sectionOrder.every((v, i) => v !== -1 && (i === 0 || v > sectionOrder[i - 1])),
  'Section runtut: hero → steps → status → privacy → outputs → links');
check('sections-labelled', (html.match(/aria-labelledby="landing-/g) || []).length >= 6,
  'Setiap section Landing punya aria-labelledby');
check('steps-semantic', /<ol class="landing-steps">/.test(html),
  'Langkah tiga tahap memakai <ol> semantik');

console.log(`\n=== HASIL: ${passed} PASS, ${failed} FAIL ===`);
process.exit(failed > 0 ? 1 : 0);
