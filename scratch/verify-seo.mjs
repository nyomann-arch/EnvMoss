import fs from 'fs';

const html = fs.readFileSync('c:/envmoss/index.html', 'utf8');
const sitemap = fs.readFileSync('c:/envmoss/sitemap.xml', 'utf8');
const robots = fs.readFileSync('c:/envmoss/robots.txt', 'utf8');

const checks = [
  ['index.html: Title with keywords', html.includes('EnvMoss — Privacy-First Local .env File Comparison &amp; Merge Tool (Zero-Backend)')],
  ['index.html: Meta description with keywords', html.includes('Privacy-first, zero-backend developer utility for local .env file comparison and merge env operations.')],
  ['index.html: Meta keywords', html.includes('privacy-first, local .env file comparison, merge env, zero-backend')],
  ['index.html: Canonical link', html.includes('<link rel="canonical" href="https://envmoss.vercel.app/" />')],
  ['index.html: og:type', html.includes('<meta property="og:type" content="website" />')],
  ['index.html: og:url', html.includes('<meta property="og:url" content="https://envmoss.vercel.app/" />')],
  ['index.html: og:title', html.includes('<meta property="og:title" content="EnvMoss — Privacy-First Local .env File Comparison &amp; Merge Tool" />')],
  ['index.html: og:description', html.includes('<meta property="og:description" content="Privacy-first, zero-backend developer utility for local .env file comparison and merge env operations.')],
  ['index.html: og:image', html.includes('<meta property="og:image" content="https://envmoss.vercel.app/assets/og-image.png" />')],
  ['index.html: twitter:card', html.includes('<meta name="twitter:card" content="summary_large_image" />')],
  ['index.html: twitter:url', html.includes('<meta name="twitter:url" content="https://envmoss.vercel.app/" />')],
  ['index.html: twitter:title', html.includes('<meta name="twitter:title" content="EnvMoss — Privacy-First Local .env File Comparison &amp; Merge Tool" />')],
  ['index.html: twitter:description', html.includes('<meta name="twitter:description" content="Privacy-first, zero-backend developer utility for local .env file comparison and merge env operations.')],
  ['index.html: twitter:image', html.includes('<meta name="twitter:image" content="https://envmoss.vercel.app/assets/og-image.png" />')],
  ['index.html: Semantics <header>', html.includes('<header role="banner">')],
  ['index.html: Semantics <main>', html.includes('<main class="main" id="main-content">')],
  ['index.html: Semantics <footer>', html.includes('<footer class="footer" role="contentinfo">')],
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
