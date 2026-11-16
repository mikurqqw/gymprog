import { readFile } from 'node:fs/promises';
const manifest = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'));
if (manifest.name !== 'IronCycle' || /вЂ|\uFFFD/.test(JSON.stringify(manifest)))
  throw Error('Invalid manifest encoding/name');
const html = await readFile('dist/index.html', 'utf8'),
  headers = await readFile('dist/_headers', 'utf8');
const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
if (!csp || /ws:|wss:|\*/.test(csp)) throw Error('Development/wildcard CSP in production output');
for (const directive of ["object-src 'none'", "base-uri 'none'"])
  if (!csp.includes(directive) || !headers.includes(directive))
    throw Error('CSP mismatch: ' + directive);
for (const image of [...manifest.icons, ...manifest.screenshots])
  await readFile('dist/' + image.src.replace(/^\.\//, ''));
console.log('Manifest assets and production CSP verified.');
