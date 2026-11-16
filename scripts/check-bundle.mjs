import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'));
const visited = new Set(),
  files = new Set();
function visit(key) {
  if (visited.has(key)) return;
  visited.add(key);
  const entry = manifest[key];
  if (!entry) throw Error('Unknown build chunk ' + key);
  if (entry.file.endsWith('.js')) files.add(entry.file);
  for (const dependency of entry.imports ?? []) visit(dependency);
}
for (const [key, entry] of Object.entries(manifest)) if (entry.isEntry) visit(key);
const sizes = await Promise.all(
  [...files].map(async (file) => {
    const bytes = await readFile('dist/' + file);
    return { file, raw: bytes.length, gzip: gzipSync(bytes).length };
  }),
);
const gzip = sizes.reduce((sum, item) => sum + item.gzip, 0),
  raw = sizes.reduce((sum, item) => sum + item.raw, 0),
  limit = 170 * 1024;
await mkdir('artifacts', { recursive: true });
await writeFile(
  'artifacts/bundle-size.json',
  JSON.stringify({ raw, gzip, limit, files: sizes }, null, 2),
);
console.log(
  `Initial static JS: ${(gzip / 1024).toFixed(1)} KiB gzip / ${(raw / 1024).toFixed(1)} KiB raw; budget ${limit / 1024} KiB gzip.`,
);
if (gzip > limit) throw Error('Initial JS exceeds the bundle budget');
if ([...files].some((file) => /\/(foods-v2|Progress|Legal)-/.test(file)))
  throw Error('Heavy route/data eagerly imported');
