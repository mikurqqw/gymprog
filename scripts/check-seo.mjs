import { readFile } from 'node:fs/promises';
const html = await readFile('dist/index.html', 'utf8'),
  sitemap = await readFile('dist/sitemap.xml', 'utf8'),
  robots = await readFile('dist/robots.txt', 'utf8'),
  og = await readFile('dist/og.png');
for (const expected of [
  'rel="canonical"',
  'summary_large_image',
  'og:image',
  'hreflang="kk"',
  'hreflang="en"',
  '<noscript>',
  'application/ld+json',
  'id="root"><main>',
])
  if (!html.includes(expected)) throw Error('Missing SEO element ' + expected);
const schema = JSON.parse(
  html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)?.[1] || 'null',
);
if (schema?.['@type'] !== 'SoftwareApplication' || schema.aggregateRating)
  throw Error('Invalid or fabricated application schema');
if (og.readUInt32BE(16) !== 1200 || og.readUInt32BE(20) !== 630)
  throw Error('OG image must be1200x630');
if (
  sitemap.includes('#') ||
  (sitemap.match(/<loc>/g) || []).length !== 3 ||
  !robots.includes('sitemap.xml')
)
  throw Error('Invalid localized sitemap/robots');
console.log(
  'Static fallback, localized canonical/sitemap/robots, unrated JSON-LD and1200x630 OG verified.',
);
