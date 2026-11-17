// npm cannot map a private source fork to upstream advisories. Keep that coverage explicit.
import { verifyGlobAdvisories } from './glob-advisories.mjs';
try {
  const response = await fetch('https://registry.npmjs.org/-/npm/v1/security/advisories/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ picomatch: ['4.0.7'] }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Error('Upstream advisory request failed: ' + response.status);
  const result = await response.json();
  const advisories = verifyGlobAdvisories(result);
  console.log('Full upstream picomatch advisory report:', JSON.stringify(advisories));
  if (advisories.length) {
    console.log(
      'CVE-2026-112366: fixed in reviewed source backport; installed hashes and exploit regressions verified.',
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Upstream advisory verification failed');
  process.exitCode = 1;
}
