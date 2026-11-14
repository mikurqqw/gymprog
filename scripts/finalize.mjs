import { readdir, readFile, writeFile } from 'node:fs/promises';
const files=await readdir('dist/assets');
const paths=['./','./index.html','./icon.svg','./manifest.webmanifest','./theme.js','./icon-192.png','./icon-512.png',...files.map(f=>'./assets/'+f)];
let sw=await readFile('public/sw.js','utf8');
sw=sw.replace("['./','./index.html','./icon.svg','./manifest.webmanifest']",JSON.stringify(paths));
const {createHash}=await import('node:crypto');
const hash=createHash('sha256').update(files.join('|')).digest('hex').slice(0,12);
sw=sw.replace('ironcycle-v1','ironcycle-'+hash);
await writeFile('dist/sw.js',sw);
await writeFile('dist/.nojekyll','');

const html=await readFile('dist/index.html','utf8');
await writeFile('dist/index.html',html.replace("connect-src 'self' ws://127.0.0.1:*", "connect-src 'self'"));
