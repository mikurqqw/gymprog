import { logRowId } from './workoutLogs';
import type { AppState } from './storage';
import type { Planned, Profile } from './schema';
import { exercises, exerciseById, compatible, generate } from './program';
import { jointStress } from './injuries';
export type ReplacementScope = 'session' | 'week' | 'cycle';
export function rankedAlternatives(id: string, profile: Profile) {
  const original = exerciseById(id);
  return exercises
    .filter(
      (ex) =>
        ex.id !== id &&
        !ex.name.en.startsWith('Test') &&
        compatible(ex, profile) &&
        (ex.pattern === original.pattern || ex.muscles.some((m) => original.muscles.includes(m))),
    )
    .map((ex) => ({
      exercise: ex,
      score:
        (ex.pattern === original.pattern ? 100 : 0) +
        ex.muscles.filter((m) => original.muscles.includes(m)).length * 10 +
        (ex.equipment === original.equipment ? 5 : 0) -
        profile.injuryRecords.reduce((sum, injury) => sum + jointStress(ex, injury.area) * 5, 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.exercise);
}
export function replaceExercise(
  state: AppState,
  row: Planned,
  replacement: string | null,
  scope: ReplacementScope,
): AppState {
  const profile = state.profile;
  if (!profile) throw Error('Profile setup required');
  if (replacement && !rankedAlternatives(row.exercise, profile).some((ex) => ex.id === replacement))
    throw Error('Unsafe replacement');
  const source = generate(profile, state.adjustments, state.shifts, {}, state.customProgram),
    original = source.find((item) => item.id === row.id);
  if (!original) throw Error('Missing prescription');
  const affected = source.filter(
    (item) =>
      item.exercise === original.exercise &&
      (scope === 'session'
        ? item.week === row.week && item.day === row.day
        : scope === 'week'
          ? item.week === row.week
          : item.week > row.week || (item.week === row.week && item.day >= row.day)),
  );
  const ids = new Set(affected.map((item) => item.id)),
    swaps = { ...state.swaps };
  for (const id of ids) {
    if (replacement) swaps[id] = replacement;
    else delete swaps[id];
  }
  // Preserve previous results as history; a new movement starts with a clean log.
  const logs = state.logs.map((log) =>
    ids.has(logRowId(log.id)) ? { ...log, id: log.id + '-history-' + crypto.randomUUID() } : log,
  );
  return { ...state, swaps, logs };
}
