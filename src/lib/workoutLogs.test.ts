import { describe, it, expect } from 'vitest';
import {
  baseLog,
  setLogs,
  writeRowLogs,
  readRowLog,
  logRowId,
  completedExerciseCount,
} from './workoutLogs';
import { fixtureProfile, logSchema } from './schema';
import { generate } from './program';
import { sessionStats } from './sessionInsights';
import { initialState, parseBackup } from './storage';
const row = { ...generate(fixtureProfile)[0], sets: 3 };
describe('shared Focus and Overview log writes', () => {
  it('stores identical validated results for individual and batch completion', () => {
    let focus = writeRowLogs([], row, { sets: [true] }, 0);
    focus = writeRowLogs(focus, row, { sets: [true] }, 1);
    focus = writeRowLogs(focus, row, { sets: [true] }, 2);
    const overview = writeRowLogs([], row, { sets: [true, true, true] });
    expect(focus).toEqual(overview);
    expect(focus.every((log) => logSchema.safeParse(log).success)).toBe(true);
    expect(sessionStats([row], focus).done).toBe(3);
    expect(sessionStats([row], focus).tonnage).toBe(3 * (row.weight ?? 0) * row.reps);
  });
  it('keeps each set weight, reps and effort independent across both views', () => {
    let logs = writeRowLogs([], row, { weight: 50, reps: 4, rpe: 6, sets: [true] }, 0);
    logs = writeRowLogs(logs, row, { weight: 55, reps: 3, rpe: 8, sets: [true] }, 1);
    expect(setLogs(row, logs).map((log) => log.weight)).toEqual([50, 55, row.weight]);
    expect(sessionStats([row], logs)).toMatchObject({ done: 2, tonnage: 365, averageRpe: 7 });
    logs = writeRowLogs(logs, row, { sets: [true, true, true] });
    expect(setLogs(row, logs)[0]).toMatchObject({ weight: 50, reps: 4, rpe: 6 });
    expect(readRowLog(row, logs).sets).toEqual([true, true, true]);
  });
  it('expands a legacy exercise log without losing completion, note or local video reference', () => {
    const legacy = {
      ...baseLog(row),
      sets: [true, false, false],
      note: 'Legacy note',
      video: row.id,
    };
    const logs = writeRowLogs([legacy], row, { rpe: 8 }, 1);
    expect(logs).toHaveLength(3);
    expect(logs[0]).toMatchObject({ note: 'Legacy note', video: row.id, sets: [true] });
    expect(readRowLog(row, logs).sets).toEqual([true, false, false]);
    expect(parseBackup(JSON.stringify({ ...initialState, logs })).logs).toEqual(logs);
    expect(logRowId(row.id + '::set:0-history-archived')).not.toBe(row.id);
  });
  it('counts completed exercises independently of per-set storage', () => {
    const legacy = { ...baseLog(row), sets: [true, true, false] };
    const individual = writeRowLogs([legacy], row, { rpe: 8 }, 1);
    expect(completedExerciseCount(individual)).toBe(completedExerciseCount([legacy]));
    expect(completedExerciseCount(individual)).toBe(1);
  });
  it('rejects invalid values atomically and invalid set indices', () => {
    const logs = writeRowLogs([], row, { sets: [true] }, 0);
    expect(() => writeRowLogs(logs, row, { weight: -1 }, 1)).toThrow();
    expect(() => writeRowLogs(logs, row, { rpe: 11 }, 1)).toThrow();
    expect(() => writeRowLogs(logs, row, { reps: 3.5 }, 1)).toThrow();
    expect(() => writeRowLogs(logs, row, {}, 30)).toThrow();
    expect(logs[0].sets).toEqual([true]);
  });
  it('migrates old profile and logs with an unset view preference', () => {
    const legacy = { ...initialState, version: 2, profile: fixtureProfile, logs: [baseLog(row)] };
    const migrated = parseBackup(JSON.stringify(legacy));
    expect(migrated).toMatchObject({
      version: 4,
      workoutView: null,
      profile: fixtureProfile,
      logs: legacy.logs,
    });
  });
});
