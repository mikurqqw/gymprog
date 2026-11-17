import { readFile, writeFile } from 'node:fs/promises';
const site = new URL(process.env.VITE_SITE_URL || 'https://mikurqqw.github.io/gymprog/');
if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash)
  throw Error('VITE_SITE_URL must be an HTTPS base URL without credentials, query or fragment');
if (!site.pathname.endsWith('/')) site.pathname += '/';
const escape = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const locales = ['ru', 'kk', 'en'].map((lang) => {
  const url = new URL(site);
  if (lang !== 'ru') url.searchParams.set('lang', lang);
  return { lang, url: url.href };
});
let html = await readFile('dist/index.html', 'utf8');
const meta = `<link rel="canonical" href="${escape(site.href)}"/>
<meta property="og:url" content="${escape(site.href)}"/>
<meta property="og:image" content="${escape(new URL('og.png', site).href)}"/>
<meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/>
${locales.map(({ lang, url }) => `<link rel="alternate" hreflang="${lang}" href="${escape(url)}"/>`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${escape(site.href)}"/>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'IronCycle', applicationCategory: 'HealthApplication', operatingSystem: 'Web', url: site.href, inLanguage: ['ru', 'kk', 'en'] }).replaceAll('<', '\\u003c')}</script>`;
if (!html.includes('<!-- BUILD_SEO -->')) throw Error('Missing SEO injection marker');
html = html.replace('<!-- BUILD_SEO -->', meta);
if (html.includes('<!-- BUILD_SEO -->')) throw Error('SEO injection failed');
await writeFile('dist/index.html', html);
const alternates = locales
  .map(({ lang, url }) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${escape(url)}"/>`)
  .join('');
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${locales.map(({ url }) => `<url><loc>${escape(url)}</loc>${alternates}</url>`).join('')}</urlset>`,
);
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', site).href}\n`,
);
console.log('Generated localized landing canonical/OG/sitemap/robots from ' + site.href);
