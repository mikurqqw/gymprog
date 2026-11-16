import { expect, it } from 'vitest';
import { defaultProfile as p, type Checkin, type Log } from './schema';
import { immediateAdjustment, readiness, regulate, weeklySuggestion } from './autoregulation';
import { dateOffset } from './formulas';
import { generate } from './program';
const c: Checkin = {
  date: '2026-11-16',
  sleep: 8,
  quality: 5,
  recovery: 5,
  soreness: 1,
  stress: 1,
  mood: 5,
  calories: 3000,
  protein: 160,
  pain: 'none',
  location: '',
  speed: 'fast',
  dizziness: false,
  weakness: false,
  worsening: false,
};
it('scores transparent weights to 100', () => {
  const r = readiness(c, p);
  expect(r.score).toBe(100);
  expect(Object.values(r.parts).reduce((a, b) => a + b, 0)).toBe(100);
});
it.each([
  [5.4, 'yellow'],
  [4.4, 'orange'],
] as const)('sleep %s caps at %s', (sleep, level) =>
  expect(readiness({ ...c, sleep }, p).level).toBe(level),
);
it.each(['sharp', 'worsening', 'dizziness', 'weakness'])('blocks heavy training for %s', (flag) => {
  const input = flag === 'sharp' ? { ...c, pain: 'sharp' as const } : { ...c, [flag]: true };
  const r = readiness(input, p);
  expect(r.level).toBe('red');
  expect(regulate(generate(p), r, p)).toEqual([]);
});
it('warns for three consecutive short nights but not gaps', () => {
  const input = { ...c, sleep: 5 };
  const history = [1, 2].map((i) => ({ ...input, date: dateOffset(c.date, -i) }));
  expect(readiness(input, p, history).reasons).toContain('sleepDebt');
  expect(readiness(input, p, [history[1]]).reasons).not.toContain('sleepDebt');
});
it('downgrades two low nutrition days but not single day', () => {
  const low = { ...c, protein: 50 };
  expect(readiness(low, p, [{ ...low, date: dateOffset(c.date, -1) }]).score).toBeLessThan(
    readiness(low, p).score,
  );
});
it('yellow retains second movement and removes last accessory', () => {
  const input = generate(p).filter((r) => r.week === 1 && r.day === 0);
  const output = regulate(input, readiness({ ...c, sleep: 5 }, p), p);
  expect(output.some((l) => l.lift === 'bench')).toBe(true);
  expect(output.length).toBe(input.length - 1);
  expect(output[0].rpe).toBe(input[0].rpe - 0.5);
});
it('orange excludes high-RPE singles and reduces sets', () => {
  const input = generate(p).filter((r) => r.week === 6 && r.day === 0);
  const output = regulate(input, readiness({ ...c, sleep: 4 }, p), p);
  expect(output.every((l) => l.lift && !(l.mode === 'single' && l.rpe > 7))).toBe(true);
  expect(output.find((l) => l.mode === 'volume')?.sets).toBe(1);
});
it('immediately reduces for technique loss or one RPE over', () => {
  expect(immediateAdjustment(8, 7, true)).toBe(-0.05);
  expect(immediateAdjustment(7, 7, false)).toBe(-0.05);
  expect(immediateAdjustment(7, 7, true)).toBe(0);
});
const log = (session: string, rpe: number): Log => ({
  id: session,
  session,
  exercise: 'ex-0',
  lift: 'squat',
  date: '2026-11-16',
  weight: 100,
  reps: 5,
  sets: [true, true, true],
  rpe,
  targetRpe: 7,
  planned: 100,
  status: 'done',
  note: '',
  video: '',
  technique: true,
  mode: 'volume',
});
it('requires two sessions, not two sets', () => {
  expect(weeklySuggestion([log('1', 8), log('1', 8)], 'squat', 2, true)).toBe(0);
  expect(weeklySuggestion([log('1', 8), log('2', 8)], 'squat', 2, true)).toBe(-0.025);
});
it('only offers increases with stable sleep outside protected weeks', () => {
  const logs = [log('1', 6), log('2', 6)];
  expect(weeklySuggestion(logs, 'squat', 2, true)).toBe(0.025);
  expect(weeklySuggestion(logs, 'squat', 2, false)).toBe(0);
  for (const week of [4, 7, 8]) expect(weeklySuggestion(logs, 'squat', week, true)).toBe(0);
});
