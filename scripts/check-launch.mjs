import { readFile, readdir } from 'node:fs/promises';
import { legalReleaseIssues } from '../src/config/legalValidation.ts';
const preview = process.argv.includes('--preview');
const info = JSON.parse(await readFile('dist/build-info.json', 'utf8'));
if (info.preview !== preview) throw Error('Artifact build mode does not match launch check');
if (!preview) {
  const issues = legalReleaseIssues(undefined, {
    allowUnreviewedLawyer: process.env.IRONCYCLE_ALLOW_UNREVIEWED_LAWYER === '1',
  });
  if (issues.length) throw Error('Production launch blocked: ' + issues.join(', '));
}
for (const file of ['sitemap.xml', 'robots.txt', 'og.png', '.well-known/security.txt', '_headers'])
  if (!(await readFile('dist/' + file)).length) throw Error('Missing ' + file);
const manifest = JSON.parse(await readFile('dist/manifest.webmanifest', 'utf8'));
if (
  manifest.name !== 'IronCycle' ||
  !manifest.icons.some((i) => i.purpose === 'maskable') ||
  manifest.shortcuts.length !== 3
)
  throw Error('Invalid manifest');
const html = await readFile('dist/index.html', 'utf8');
if (!html.includes('Content-Security-Policy') || /connect-src[^;]*ws:/.test(html))
  throw Error('Missing or development CSP');
const docs = await readdir('src/data/legal');
if (docs.filter((f) => f.endsWith('.json')).length !== 10)
  throw Error('Expected ten legal documents');
for (const file of docs.filter((f) => f.endsWith('.json'))) {
  const doc = JSON.parse(await readFile('src/data/legal/' + file, 'utf8'));
  for (const lang of ['ru', 'kk', 'en'])
    if (!doc.title[lang] || !doc.sections.every((s) => s.heading[lang] && s.body[lang]))
      throw Error('Missing legal translation ' + file + ':' + lang);
}
async function inspect(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = root + '/' + entry.name;
    if (entry.isDirectory()) await inspect(path);
    else if (/\.(?:html|js|json|webmanifest|txt|xml|css)$/.test(path)) {
      const text = await readFile(path, 'utf8');
      // Bundled Markdown uses U+FFFD intentionally for invalid input; flag it in static text, not dependency code.
      if (/вЂ|РџР/.test(text) || (!path.endsWith('.js') && /\uFFFD/.test(text)))
        throw Error('Mojibake: ' + path);
      if (!preview && /__REQUIRED_[A-Z_]+__/.test(text))
        throw Error('Production placeholder: ' + path);
    }
  }
}
await inspect('dist');
console.log(
  preview
    ? 'Preview launch checks passed; real contacts and reviews remain mandatory for production.'
    : 'Production launch checks passed.',
);
