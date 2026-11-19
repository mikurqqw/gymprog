import { readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { expect, it } from 'vitest';
import { nextSeries, seriesIds, seriesPlan, seriesProgress, variantSchema } from './fitSeries';
import type { SeriesPlan, SeriesRun } from './fitSeries';
import { initialState, parseBackup } from './storage';

const root = 'public/fit-series/';
it('validates all adult calendars and links to their exact source plan', () => {
  const files = readdirSync(root).filter((name) => name.endsWith('.gz'));
  expect(files).toHaveLength(1634);
  const plans = new Map<string, SeriesPlan>();
  for (const name of files) {
    const plan = seriesPlan.parse(
      JSON.parse(gunzipSync(readFileSync(root + name)).toString('utf8')),
    );
    expect(name).toBe(`${plan.profile}-${plan.mode}-${plan.cycle}.json.gz`);
    plans.set(name, plan);
  }
  const visited = new Set<string>();
  for (const id of seriesIds) {
    const variants = variantSchema
      .array()
      .parse(JSON.parse(readFileSync(root + id + '.json', 'utf8')));
    expect(variants.length).toBeGreaterThan(0);
    for (const variant of variants)
      for (const mode of variant.modes) {
        expect(variant.age).not.toContain('Подросток');
        for (const cycle of [1, 2, 3].slice(0, id === 'gym_first_month' ? 2 : 3)) {
          const name = `${variant.id}-${mode}-${cycle}.json.gz`;
          const plan = plans.get(name)!;
          expect(plan.program).toBe(id);
          expect(plan.calendar.some((day) => day.work?.length)).toBe(true);
          if (plan.following) {
            const next = plans.get(
              `${plan.following.profile}-${mode}-${plan.following.cycle}.json.gz`,
            )!;
            expect(next.plan).toBe(plan.following.plan);
            expect(next.program).toBe(id === 'gym_first_month' && cycle === 2 ? 'fitness' : id);
          } else expect(nextSeries(plan).cycle).toBe(1);
          visited.add(name);
        }
      }
  }
  expect(visited.size).toBe(files.length);
}, 30000);

it('keeps source cycle completion distinct from rest days and preserves history on backup', () => {
  const key = 'home_core_8w';
  const [{ id }] = variantSchema
    .array()
    .parse(JSON.parse(readFileSync(root + key + '.json', 'utf8')));
  const plan = seriesPlan.parse(
    JSON.parse(gunzipSync(readFileSync(root + id + '-home-3.json.gz')).toString('utf8')),
  );
  const now = '2026-11-20T00:00:00.000Z';
  const run: SeriesRun = {
    id: '62f61738-e5b3-4d2d-9a3f-1f028623edad',
    cycle: 3,
    profile: id,
    mode: 'home',
    program: key,
    started: now,
    days: {},
  };
  expect(seriesProgress(plan, run).complete).toBe(false);
  for (const [i, day] of plan.calendar.entries()) if (day.work) run.days[i] = now;
  expect(seriesProgress(plan, run).complete).toBe(true);
  expect(nextSeries(plan)).toEqual({ profile: id, mode: 'home', cycle: 1 });
  expect(parseBackup(JSON.stringify({ ...initialState, seriesRuns: [run] })).seriesRuns).toEqual([
    run,
  ]);
});
