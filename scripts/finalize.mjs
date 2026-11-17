import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const files = (await readdir('dist/assets')).sort(),
  template = await readFile('public/sw.js', 'utf8');
const digest = createHash('sha256')
  .update(template)
  .update(await readFile('dist/index.html'));
for (const file of files) digest.update(await readFile('dist/assets/' + file));
const generatedId = digest.digest('hex').slice(0, 16),
  buildId = process.env.BUILD_ID ?? generatedId;
if (!/^[a-zA-Z0-9_-]{1,64}$/.test(buildId)) throw Error('Invalid BUILD_ID');
// Heavy optional routes/data are runtime-cached only after users actually open them.
const coreAssets = files.filter((file) => !/^(foods-v2|Progress|Legal)-/.test(file));
const paths = [
  './',
  './index.html',
  './icon.svg',
  './manifest.webmanifest',
  './theme.js',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  ...coreAssets.map((file) => './assets/' + file),
];
for (const font of await readdir('dist/fonts'))
  if (font.endsWith('.woff2')) paths.push('./fonts/' + font);
const sw = template
  .replaceAll('__IRONCYCLE_BUILD_ID__', buildId)
  .replace(
    /const PRECACHE = \[\]; \/\/ @build-precache/,
    'const PRECACHE = ' + JSON.stringify(paths) + ';',
  );
if (sw.includes('@build-precache')) throw Error('Precache injection failed');
await writeFile('dist/sw.js', sw);
await writeFile(
  'dist/build-info.json',
  JSON.stringify({ buildId, preview: process.env.IRONCYCLE_PREVIEW === '1' }),
);
await writeFile('dist/.nojekyll', '');
console.log('Service worker build ' + buildId + '; precached ' + paths.length + ' core resources.');
