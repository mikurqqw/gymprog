import { expect, it } from 'vitest';
import { nextAttempt } from './testAttempts';
import { fixtureProfile } from './schema';
import { initialState, parseBackup } from './storage';
import { forecast } from './forecast';
it('opening and second attempts reproduce acceptance cases', () => {
  for (const [current, expected] of [
    [140, 125],
    [90, 80],
    [140, 125],
  ]) {
    expect(nextAttempt(current, 2.5, [])).toBe(expected);
    expect(nextAttempt(current, 2.5, [{ weight: expected, rpe: 8, success: true }])).toBe(current);
  }
});
it('never increases after failed first or slow opening', () => {
  expect(nextAttempt(140, 2.5, [{ weight: 125, rpe: 10, success: false }])).toBe(125);
  expect(nextAttempt(140, 2.5, [{ weight: 125, rpe: 9, success: true }])).toBe(125);
});
it('third attempt responds to success and RPE', () => {
  const first = { weight: 125, rpe: 8, success: true };
  for (const [rpe, expected] of [
    [7, 142.5],
    [8, 142.5],
    [9, 140],
  ])
    expect(nextAttempt(140, 2.5, [first, { weight: 140, rpe, success: true }])).toBe(expected);
  expect(nextAttempt(140, 2.5, [first, { weight: 140, rpe: 10, success: false }])).toBe(125);
  expect(nextAttempt(140, 2.5, [], false)).toBeNull();
});
it('rejects invalid backups without accepting arbitrary types', () => {
  expect(parseBackup(JSON.stringify(initialState))).toEqual(initialState);
  expect(() => parseBackup('{"version":999}')).toThrow();
  expect(() =>
    parseBackup(JSON.stringify({ ...initialState, profile: { ...fixtureProfile, weight: -5 } })),
  ).toThrow();
  expect(() => parseBackup('not json')).toThrow();
});
it('forecast retains scenario ordering and returning PR goal', () => {
  const f = forecast(fixtureProfile, []);
  expect(f.lifts.every((l) => l.low <= l.realistic && l.realistic <= l.high)).toBe(true);
  expect(f.lifts.find((l) => l.lift === 'deadlift')?.pr).toBe(155);
  expect(forecast({ ...fixtureProfile, sleep: 5 }, []).total).toBeLessThan(f.total);
});
it('migrates a compatible version-zero backup', () => {
  const legacy = { ...initialState, version: 0 };
  expect(parseBackup(JSON.stringify(legacy)).version).toBe(2);
});
it('coarse plate steps never turn a third-attempt suggestion into a jump above 5 kg', () => {
  const attempts = [
    { weight: 125, rpe: 8, success: true },
    { weight: 140, rpe: 7, success: true },
  ];
  expect(nextAttempt(140, 10, attempts)).toBeLessThanOrEqual(145);
});
