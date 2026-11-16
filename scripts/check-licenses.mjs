import { readFile } from 'node:fs/promises';
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const approved = new Set([
  'MIT',
  'ISC',
  'Apache-2.0',
  'BSD-3-Clause',
  'BSD-2-Clause',
  'BlueOak-1.0.0',
  '0BSD',
  'PSF-2.0',
  'CC-BY-4.0',
  '(MIT OR CC0-1.0)',
  'MIT AND ISC AND BSD-3-Clause',
  'MPL-2.0',
]);
let count = 0;
for (const [path, pkg] of Object.entries(lock.packages)) {
  if (!path) continue;
  count++;
  if (approved.has(pkg.license)) continue;
  // Lighthouse's tooling dependency is not shipped to the browser. Review on change.
  if (
    path === 'node_modules/sentry' &&
    pkg.version === '0.49.0' &&
    pkg.dev &&
    pkg.license === 'FSL-1.1-Apache-2.0'
  )
    continue;
  throw Error(`License review required: ${path}@${pkg.version} (${pkg.license ?? 'missing'})`);
}
console.log(
  `Checked ${count} dependency licenses. FSL exception: development-only sentry 0.49.0 via Lighthouse; see COMPLIANCE.md.`,
);
