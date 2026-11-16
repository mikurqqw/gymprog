import { describe, it, expect } from 'vitest';
import { generate } from './program';
import { initialState, parseBackup } from './storage';
import { defaultProfile, type Log } from './schema';
import {
  sessionStats,
  resumeSession,
  finishSession,
  nextOpenSession,
  sessionKey,
  previousExerciseLog,
} from './sessionInsights';
const rows = generate(defaultProfile),
  session = rows.filter((row) => row.week === 1 && row.day === 0);
const log = (patch: Partial<Log> = {}): Log => ({
  id: session[0].id,
  session: '1-0',
  exercise: session[0].exercise,
  lift: session[0].lift,
  date: session[0].date,
  weight: 100,
  reps: 5,
  sets: [true],
  rpe: 7,
  targetRpe: 7,
  planned: 115,
  status: 'done',
  note: '',
  video: '',
  technique: true,
  mode: 'single',
  ...patch,
});
describe('workout continuity and results', () => {
  it('counts only completed current prescriptions and excludes skipped/archived/changed exercise logs', () => {
    const stats = sessionStats(session, [
      log(),
      log({ id: 'archived' }),
      log({ exercise: 'ex-99' }),
      log({ id: session[1].id, status: 'skipped', exercise: session[1].exercise }),
    ]);
    expect(stats.done).toBe(1);
    expect(stats.tonnage).toBe(500);
    expect(stats.averageRpe).toBe(7);
  });
  it('caps imported set arrays at the prescribed set count', () => {
    expect(sessionStats(session, [log({ sets: [true, true, true] })]).done).toBe(session[0].sets);
  });
  it('resumes a partial session after export/reload, not an archived history row', () => {
    const state = parseBackup(
      JSON.stringify({
        ...initialState,
        logs: [log()],
        activeSession: { week: 1, day: 0, touchedAt: '2026-11-16T10:00:00Z' },
      }),
    );
    expect(resumeSession(state, rows)).toMatchObject({ week: 1, day: 0, done: 1 });
    expect(resumeSession({ ...state, logs: [log({ id: 'archived' })] }, rows)).toBeNull();
  });
  it('finishes partial work without inventing completed sets and advances to the next session', () => {
    const state = { ...initialState, logs: [log()] },
      next = finishSession(state, session, '2026-11-16T11:00:00Z');
    expect(next.logs).toEqual(state.logs);
    expect(next.sessionCompletions[sessionKey(next, 1, 0)].completedAt).toBe(
      '2026-11-16T11:00:00Z',
    );
    expect(resumeSession(next, rows)).toBeNull();
    expect(nextOpenSession(next, rows)).toMatchObject({ week: 1, day: 1 });
    expect(() => finishSession(initialState, session, '2026-11-16T11:00:00Z')).toThrow();
  });
  it('compares only an earlier log for the same movement', () => {
    const previous = log({ date: '2026-11-09', weight: 95 });
    expect(
      previousExerciseLog(log(), [
        previous,
        log({ date: '2026-11-09', exercise: 'ex-5', weight: 180 }),
      ]),
    ).toEqual(previous);
    expect(previousExerciseLog(log(), [log({ date: '2026-11-20' })])).toBeUndefined();
  });
  it('reads older backups with empty completion metadata', () => {
    const raw = JSON.parse(JSON.stringify(initialState));
    delete raw.activeSession;
    delete raw.sessionCompletions;
    expect(parseBackup(JSON.stringify(raw))).toMatchObject({
      activeSession: null,
      sessionCompletions: {},
    });
  });
});
