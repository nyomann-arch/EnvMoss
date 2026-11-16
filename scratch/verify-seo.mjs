import fs from 'fs';

// Sejak Milestone 7, SEO meta tersebar per halaman:
//   index.html     -> Landing (/)
//   app/index.html -> Comparison Tool (/app/)
//   guide/index.html -> Guide (/guide/)
const landing = fs.readFileSync('c:/envmoss/index.html', 'utf8');
const tool = fs.readFileSync('c:/envmoss/app/index.html', 'utf8');
const guide = fs.readFileSync('c:/envmoss/guide/index.html', 'utf8');
const sitemap = fs.readFileSync('c:/envmoss/sitemap.xml', 'utf8');
const robots = fs.readFileSync('c:/envmoss/robots.txt', 'utf8');

const checks = [
  // Landing page meta
  ['landing: Title', landing.includes('EnvMoss — Compare .env Files Locally')],
  ['landing: Meta description', landing.includes('developer utility for comparing two environment files')],
  ['landing: Canonical link', landing.includes('<link rel="canonical" href="https://envmoss.vercel.app/" />')],
  ['landing: og:type', landing.includes('<meta property="og:type" content="website" />')],
  ['landing: og:url', landing.includes('<meta property="og:url" content="https://envmoss.vercel.app/" />')],
  ['landing: og:title', landing.includes('<meta property="og:title" content="EnvMoss — Compare .env Files Locally')],
  ['landing: og:image', landing.includes('<meta property="og:image" content="https://envmoss.vercel.app/assets/og-image.png" />')],
  ['landing: twitter:card', landing.includes('<meta name="twitter:card" content="summary_large_image" />')],
  ['landing: twitter:image', landing.includes('<meta name="twitter:image" content="https://envmoss.vercel.app/assets/og-image.png" />')],

  // Tool page meta
  ['tool: Title with keywords', tool.includes('EnvMoss — Privacy-First Local .env File Comparison &amp; Merge Tool (Zero-Backend)')],
  ['tool: Meta description with keywords', tool.includes('Privacy-first, zero-backend developer utility for local .env file comparison and merge env operations.')],
  ['tool: Meta keywords', tool.includes('privacy-first, local .env file comparison, merge env, zero-backend')],
  ['tool: Canonical link', tool.includes('<link rel="canonical" href="https://envmoss.vercel.app/app/" />')],
  ['tool: og:url', tool.includes('<meta property="og:url" content="https://envmoss.vercel.app/app/" />')],
  ['tool: og:title', tool.includes('<meta property="og:title" content="EnvMoss — Privacy-First Local .env File Comparison &amp; Merge Tool" />')],
  ['tool: twitter:title', tool.includes('<meta name="twitter:title" content="EnvMoss — Privacy-First Local .env File Comparison &amp; Merge Tool" />')],

  // Guide page meta
  ['guide: Title', guide.includes('Guide — EnvMoss')],
  ['guide: Canonical link', guide.includes('<link rel="canonical" href="https://envmoss.vercel.app/guide/" />')],
  ['guide: og:url', guide.includes('<meta property="og:url" content="https://envmoss.vercel.app/guide/" />')],

  // Struktur semantik di ketiga halaman (navbar fixed + main + footer)
  ['semantics: header/navbar', [landing, tool, guide].every(h => h.includes('class="site-header"') && h.includes('class="site-navbar"'))],
  ['semantics: main', [landing, tool, guide].every(h => h.includes('class="site-main'))],
  ['semantics: footer', [landing, tool, guide].every(h => h.includes('class="site-footer"') && h.includes('role="contentinfo"'))],

  ['sitemap.xml: Structure', sitemap.includes('<loc>https://envmoss.vercel.app/</loc>') && sitemap.includes('<lastmod>2026-11-16</lastmod>')],
  ['robots.txt: Content', robots.includes('User-agent: *') && robots.includes('Allow: /') && robots.includes('Sitemap: https://envmoss.vercel.app/sitemap.xml')]
];

let pass = 0;
checks.forEach(([name, ok]) => {
  if (ok) pass++;
  console.log((ok ? 'PASS: ' : 'FAIL: ') + name);
});
console.log('Total checks passed: ' + pass + '/' + checks.length);
if (pass !== checks.length) process.exit(1);
