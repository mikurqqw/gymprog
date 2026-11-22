import type { SeriesPlan, SeriesRun } from './fitSeries';
import { dateOffset } from './formulas';
import type { LoadGoal } from './loadGoalSchema';
import { generate } from './plannedProgram';
import type { Lift, Log, Profile } from './schema';
import { seriesTechnique } from './seriesTechnique';
import { sessionKey } from './sessionInsights';
import type { AppState } from './storage';

export interface GoalSession {
  exercise: string;
  date: string;
  complete: boolean;
  weight: number | null;
  reps?: string;
}

const referenceLifts = new Map<string, Lift>([
  ['squat', 'squat'],
  ['bench_press', 'bench'],
  ['deadlift', 'deadlift'],
]);

export const seriesGoalExercise = (name: string) =>
  seriesTechnique(name)?.id ?? 'series:' + name.trim();

function seriesWeight(work: Record<string, string>, profile: Profile) {
  const reference = referenceLifts.get(work.reference_lift);
  const fraction = Number(work.load_fraction_1rm);
  const coefficient = work.load_coefficient ? Number(work.load_coefficient) : 1;
  if (
    !reference ||
    profile.strengthAssessment[reference] === 'unknown' ||
    !['кг', 'кг штанги', 'кг всего'].includes(work.load_unit) ||
    !Number.isFinite(fraction) ||
    fraction <= 0 ||
    fraction > 1 ||
    !Number.isFinite(coefficient) ||
    coefficient <= 0 ||
    coefficient > 2
  )
    return null;
  return Number((profile.lifts[reference].current * fraction * coefficient).toFixed(2));
}

export function importedGoalSchedule(plan: SeriesPlan, run: SeriesRun, profile: Profile) {
  return plan.calendar.flatMap((day, index) =>
    (day.work ?? [])
      .filter(
        (work) =>
          work.exercise_original &&
          work.quantity_unit === 'rep' &&
          /^кг(?:\s|$)/u.test(work.load_unit) &&
          work.load_unit !== 'кг помощи',
      )
      .map((work): GoalSession => {
        const min = Number(work.reps_min);
        const max = Number(work.reps_max || work.reps_min);
        return {
          exercise: seriesGoalExercise(work.exercise_original),
          date: dateOffset(run.started.slice(0, 10), index),
          complete: Boolean(run.days[index]),
          weight: seriesWeight(work, profile),
          reps: min > 0 && max >= min ? (min === max ? String(min) : min + '–' + max) : undefined,
        };
      }),
  );
}

export function baseGoalSchedule(state: AppState & { profile: Profile }): GoalSession[] {
  return generate(state.profile, state.adjustments, state.shifts, state.swaps, state.customProgram)
    .filter((row) => row.mode !== 'test' && row.mode !== 'recovery')
    .map((row) => ({
      exercise: row.exercise,
      date: row.date,
      complete: Boolean(state.sessionCompletions[sessionKey(state, row.week, row.day)]),
      weight: row.weight && row.weight > 0 ? row.weight : null,
      reps: String(row.reps),
    }));
}

export function estimateLoadGoal(
  goal: LoadGoal,
  schedule: GoalSession[],
  logs: Log[],
  date: string,
) {
  const recorded = logs.find(
    (log) =>
      log.exercise === goal.exercise &&
      log.date <= date &&
      log.weight >= goal.weight &&
      log.reps > 0 &&
      log.status !== 'skipped' &&
      log.sets.some(Boolean),
  );
  if (recorded) return { kind: 'recorded', date: recorded.date } as const;
  const matches = schedule.filter((session) => session.exercise === goal.exercise);
  if (!matches.length) return { kind: 'absent' } as const;
  const upcoming = matches.filter((session) => session.date >= date && !session.complete);
  if (!upcoming.length) return { kind: 'ended' } as const;
  const loads = upcoming.filter((session) => session.weight !== null);
  const first = loads
    .toSorted((a, b) => a.date.localeCompare(b.date))
    .find((session) => (session.weight ?? 0) >= goal.weight);
  if (first) return { kind: 'scheduled', session: first } as const;
  const maximum = Math.max(0, ...loads.map((session) => session.weight ?? 0));
  return maximum ? ({ kind: 'above', maximum } as const) : ({ kind: 'manual' } as const);
}
