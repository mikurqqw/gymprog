import { expect, it } from 'vitest';
import type { SeriesPlan, SeriesRun } from './fitSeries';
import { baseGoalSchedule, estimateLoadGoal, importedGoalSchedule } from './loadGoalForecast';
import { fixtureProfile, type Log } from './schema';
import { initialState, parseBackup } from './storage';
import { sessionKey } from './sessionInsights';

const goal = { exercise: 'ex-0', weight: 115 };
const start = '2026-11-16';

it('uses calendar shifts and skips completed sessions and past dates', () => {
  const state = { ...initialState, profile: fixtureProfile, shifts: { '1-0': '2026-11-17' } };
  const result = estimateLoadGoal(goal, baseGoalSchedule(state), [], start);
  expect(result).toMatchObject({ kind: 'scheduled', session: { date: '2026-11-17', reps: '1' } });
  const completed = {
    ...state,
    sessionCompletions: {
      [sessionKey(state, 1, 0)]: { completedAt: '2026-11-17T10:00:00Z', rowIds: [] },
    },
  };
  expect(estimateLoadGoal(goal, baseGoalSchedule(completed), [], start)).not.toEqual(result);
  expect(estimateLoadGoal(goal, baseGoalSchedule(state), [], '2099-01-01')).toEqual({
    kind: 'ended',
  });
  expect(estimateLoadGoal({ ...goal, weight: 800 }, baseGoalSchedule(state), [], start).kind).toBe(
    'above',
  );
});

it('requires an explicit calibrated reference for a spreadsheet load', () => {
  const run: SeriesRun = {
    id: '62f61738-e5b3-4d2d-9a3f-1f028623edad',
    cycle: 1,
    profile: 'profile_045dcf3a17098f158e02764b',
    mode: 'gym',
    program: 'powerlifting',
    started: '2026-11-16T08:00:00Z',
    days: {},
  };
  const plan: SeriesPlan = {
    ...run,
    plan: 'fixture',
    title: 'Fixture',
    source: 'fixture',
    blocks: 1,
    days: 2,
    control: {},
    following: null,
    calendar: [
      {
        kind: 'training',
        phase: 'base',
        work: [
          {
            exercise_original: 'Присед соревновательный',
            quantity_unit: 'rep',
            load_unit: 'кг штанги',
            reference_lift: 'squat',
            load_fraction_1rm: '0.85',
            reps_min: '3',
          },
        ],
      },
      {
        kind: 'training',
        phase: 'base',
        work: [
          {
            exercise_original: 'Мой тренажёр',
            quantity_unit: 'rep',
            load_unit: 'кг шкалы',
            load_method: 'РПЕ',
            reps_min: '8',
          },
        ],
      },
    ],
  };
  const rows = importedGoalSchedule(plan, run, fixtureProfile);
  expect(estimateLoadGoal(goal, rows, [], start)).toMatchObject({
    kind: 'scheduled',
    session: { weight: 119, reps: '3' },
  });
  expect(
    estimateLoadGoal({ exercise: 'series:Мой тренажёр', weight: 50 }, rows, [], start),
  ).toEqual({ kind: 'manual' });
  expect(
    importedGoalSchedule(plan, run, {
      ...fixtureProfile,
      strengthAssessment: { ...fixtureProfile.strengthAssessment, squat: 'unknown' },
    })[0].weight,
  ).toBeNull();
});

it('recognizes achieved loads only from performed sets and restores older backups', () => {
  const log: Log = {
    id: 'set',
    session: 'session',
    exercise: 'ex-0',
    lift: 'squat',
    date: start,
    weight: 117.5,
    sets: [true],
    reps: 1,
    rpe: 7,
    targetRpe: 8,
    planned: 115,
    status: 'done',
    note: '',
    video: '',
    technique: true,
    mode: 'single',
  };
  expect(estimateLoadGoal(goal, [], [log], start)).toEqual({ kind: 'recorded', date: start });
  expect(estimateLoadGoal(goal, [], [{ ...log, sets: [false] }], start)).toEqual({
    kind: 'absent',
  });
  const { loadGoals, ...legacy } = initialState;
  expect(parseBackup(JSON.stringify(legacy)).loadGoals).toEqual(loadGoals);
  expect(parseBackup(JSON.stringify({ ...legacy, loadGoals: [goal] })).loadGoals).toEqual([goal]);
});
