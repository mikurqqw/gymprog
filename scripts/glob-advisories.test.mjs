import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyGlobAdvisories, remediatedGlobAdvisory } from './glob-advisories.mjs';
test('the exact source-fixed advisory remains visible in the result', () => {
  const record = structuredClone(remediatedGlobAdvisory);
  assert.deepEqual(verifyGlobAdvisories({ picomatch: [record] }), [record]);
  assert.deepEqual(verifyGlobAdvisories({}), []);
});
test('new advisories and changed ranges or severity require a fresh review', () => {
  for (const patch of [
    { id: 9999999 },
    { vulnerable_versions: '*' },
    { severity: 'critical' },
    { cvss: { score: 10 } },
    { url: 'https://example.com/unknown' },
  ]) {
    const record = { ...structuredClone(remediatedGlobAdvisory), ...patch };
    assert.throws(
      () => verifyGlobAdvisories({ picomatch: [remediatedGlobAdvisory, record] }),
      /requires source review/,
    );
  }
});
test('malformed responses cannot silently disable upstream coverage', () => {
  for (const result of [
    null,
    [],
    '',
    { picomatch: null },
    { picomatch: {} },
    { picomatch: [{}] },
    { other: [] },
  ])
    assert.throws(() => verifyGlobAdvisories(result));
});
