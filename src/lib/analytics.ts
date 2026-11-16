import { exerciseById } from './program';
import type { Checkin, Log, Profile } from './schema';
import { dateOffset, displayWeight, e1rm } from './formulas';
import { readiness } from './autoregulation';
import { nutrition } from './nutrition';
export type FoodEntry = { date: string; kcal: number; protein: number };
export function dailyAnalytics(
  p: Profile,
  logs: Log[],
  checkins: Checkin[],
  foodLogs: FoodEntry[],
  units: string,
) {
  const valid = logs.filter((l) => l.status !== 'skipped' && l.sets.some(Boolean));
  const dates = [
    ...new Set([
      ...valid.map((l) => l.date),
      ...checkins.map((c) => c.date),
      ...foodLogs.map((l) => l.date),
    ]),
  ].sort();
  const running = {
    squat: p.lifts.squat.current,
    bench: p.lifts.bench.current,
    deadlift: p.lifts.deadlift.current,
  };
  const target = nutrition(p);
  return dates.map((date) => {
    const ls = valid.filter((l) => l.date === date),
      c = checkins.find((c) => c.date === date),
      food = foodLogs.filter((l) => l.date === date);
    const values: Record<string, number | null> = {
      squat: null,
      bench: null,
      deadlift: null,
      pronation: null,
      cup: null,
      rising: null,
      side: null,
      biceps: null,
    };
    for (const lift of ['squat', 'bench', 'deadlift'] as const) {
      const sets = ls
        .filter((l) => l.lift === lift)
        .map((l) => e1rm(l.weight, l.reps, l.rpe))
        .filter((n): n is number => n !== null);
      if (sets.length) {
        running[lift] = Math.max(...sets);
        values[lift] = displayWeight(running[lift], units);
      }
    }
    for (const pattern of ['pronation', 'cup', 'rising', 'side', 'biceps']) {
      const sets = ls
        .filter((l) => exerciseById(l.exercise).pattern === pattern)
        .map((l) => l.weight);
      if (sets.length) values[pattern] = displayWeight(Math.max(...sets), units);
    }
    return {
      date,
      ...values,
      tonnage: displayWeight(
        ls.reduce((n, l) => n + l.weight * l.reps * l.sets.filter(Boolean).length, 0),
        units,
      ),
      averageRpe: ls.length ? ls.reduce((n, l) => n + l.rpe, 0) / ls.length : null,
      sleep: c?.sleep,
      readiness: c ? readiness(c, p, checkins).score : null,
      bodyweight: c?.weight ? displayWeight(c.weight, units) : null,
      calories: food.length
        ? (food.reduce((n, l) => n + l.kcal, 0) / target.kcal) * 100
        : c?.calories !== undefined
          ? (c.calories / target.kcal) * 100
          : null,
      protein: food.length
        ? (food.reduce((n, l) => n + l.protein, 0) / target.protein) * 100
        : c?.protein !== undefined
          ? (c.protein / target.protein) * 100
          : null,
      planned: ls.length
        ? displayWeight(ls.reduce((n, l) => n + (l.planned ?? 0), 0) / ls.length, units)
        : null,
      actual: ls.length
        ? displayWeight(ls.reduce((n, l) => n + l.weight, 0) / ls.length, units)
        : null,
      total: displayWeight(running.squat + running.bench + running.deadlift, units),
    };
  });
}
export function weeklyTonnage(p: Profile, logs: Log[], units: string) {
  return Array.from({ length: 8 }, (_, i) => {
    const start = dateOffset(p.start, i * 7),
      end = dateOffset(start, 6);
    return {
      date: start,
      tonnage: displayWeight(
        logs
          .filter((l) => l.date >= start && l.date <= end && l.status !== 'skipped')
          .reduce((sum, l) => sum + l.weight * l.reps * l.sets.filter(Boolean).length, 0),
        units,
      ),
    };
  });
}
export function plateauCauses(p: Profile, logs: Log[], checkins: Checkin[]) {
  const last = checkins.toSorted((a, b) => a.date.localeCompare(b.date)).slice(-21),
    recent = logs
      .filter((l) => l.sets.some(Boolean))
      .toSorted((a, b) => a.date.localeCompare(b.date))
      .slice(-60);
  const avg = (a: number[]) => (a.length ? a.reduce((n, v) => n + v, 0) / a.length : 0);
  const sleep = avg(last.map((c) => c.sleep)),
    rpe = avg(recent.map((l) => l.rpe - l.targetRpe)),
    technique = recent.filter((l) => !l.technique).length;
  return [
    { key: 'plateauSleep', value: sleep, priority: last.length && sleep < p.sleep - 1 ? 3 : 0 },
    { key: 'plateauRpe', value: rpe, priority: recent.length && rpe >= 0.5 ? 3 : 1 },
    { key: 'plateauTechnique', value: technique, priority: technique ? 2 : 0 },
  ].sort((a, b) => b.priority - a.priority);
}
