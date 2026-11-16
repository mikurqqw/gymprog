import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const baseline = JSON.parse(await readFile('docs/PROTECTED_SOURCES.json', 'utf8'));
for (const [file, expected] of Object.entries(baseline.files)) {
  const content = (await readFile(file, 'utf8')).replaceAll('\r\n', '\n');
  if (createHash('sha256').update(content).digest('hex') !== expected)
    throw Error('Protected source changed: ' + file);
}
const exercises = JSON.parse(await readFile('src/data/exercises.json', 'utf8'));
const actual = exercises.map((exercise) =>
  Object.fromEntries(baseline.fields.map((field) => [field, exercise[field] ?? null])),
);
if (JSON.stringify(actual) !== JSON.stringify(baseline.exercises))
  throw Error('Protected exercise fields changed');
console.log('Protected programs, calculations and exercise rule fields unchanged.');
