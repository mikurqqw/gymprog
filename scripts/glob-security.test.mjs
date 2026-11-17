import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const root = dirname(require.resolve('picomatch/package.json'));
const provenance = JSON.parse(readFileSync('vendor/picomatch-hardened.provenance.json', 'utf8'));
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('installed matcher is the reviewed patched source, including the MIT license', () => {
  const pkg = require('picomatch/package.json');
  assert.equal(pkg.name, provenance.package);
  assert.equal(pkg.version, provenance.version);
  assert.equal(pkg.license, 'MIT');
  assert.equal(digest(readFileSync(join('vendor', provenance.archive))), provenance.archiveSha256);
  for (const [file, hash] of Object.entries(provenance.files))
    assert.equal(digest(readFileSync(join(root, file))), hash, 'Changed vendored file: ' + file);
});

test('CVE-2026-112366 and consecutive-star variants finish in an isolated process', () => {
  const source = `
    const assert = require('node:assert/strict');
    const pm = require(${JSON.stringify(root)});
    const input = 'a'.repeat(64) + '!';
    for (const options of [{}, {dot:true}, {windows:true}, {bash:true}, {capture:true}, {nocase:true}]) {
      for (const pattern of ['+(*a)', '*(*a)', '+(**a)', '*(**a)', '+(*?a)', '+(a*b)c', '+(*)z', '*(*.js)'])
        assert.equal(pm.isMatch(input, pattern, options), false, pattern);
      assert.equal(pm.isMatch('axbayb', '+(a*b)', options), true);
      assert.equal(pm.isMatch('abc', '+(*)c', options), true);
    }
  `;
  const result = spawnSync(process.execPath, ['-e', source], {
    encoding: 'utf8',
    timeout: 3000,
    windowsHide: true,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test('build/test glob APIs retain normal matching, scan and regex behavior', () => {
  const pm = require('picomatch');
  const cases = [
    ['src/pages/Home.tsx', '**/*.{ts,tsx}', true],
    ['src/components/birthDate.test.ts', '**/*.{test,spec}.?(c|m)[jt]s?(x)', true],
    ['node_modules/react/index.js', '**/node_modules/**', true],
    ['src/main.tsx', '**/*.test.ts', false],
    ['assets/example.png', '**/*.{png,jpg,webp}', true],
  ];
  for (const [file, pattern, expected] of cases) {
    assert.equal(pm(pattern, { dot: true })(file), expected);
    assert.equal(pm.isMatch(file, pattern, { dot: true }), expected);
    assert.equal(pm.makeRe(pattern, { dot: true }).test(file), expected);
  }
  assert.equal(pm.scan('src/**/*.ts').base, 'src');
  assert.equal(pm(['**/*.ts', '**/*.tsx'])('src/main.tsx'), true);
  assert.equal(pm('**/*', { ignore: '**/node_modules/**' })('node_modules/react/index.js'), false);
});
