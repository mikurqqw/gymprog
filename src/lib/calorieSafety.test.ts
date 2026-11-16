import { expect, it } from 'vitest';
import { activityLevels, calibrateEnergy } from './calorieSafety';
import { nutrition } from './nutrition';
import { defaultProfile as p } from './schema';
import { dateOffset } from './formulas';
it.each(activityLevels)('activity $id uses its specified multiplier', (level) => {
  const n = nutrition({ ...p, activity: level.value });
  expect(n.tdee).toBe(Math.round((10 * 77 + 6.25 * 183 - 5 * 18 + 5) * level.value));
});
it('blocks a deficit under BMI 18.5 for every day type', () => {
  for (const day of ['heavy', 'medium', 'rest'] as const) {
    const n = nutrition({ ...p, weight: 55, height: 183, nutritionGoal: 'loss' }, day);
    expect(n.deficitAllowed).toBe(false);
    expect(n.kcal).toBeGreaterThanOrEqual(n.tdee - 1);
  }
});
it.each(['pregnancy', 'diabetes', 'kidneyDisease', 'medications'] as const)(
  'disables automatic advice for %s',
  (key) => {
    expect(nutrition({ ...p, health: { ...p.health, [key]: true } }).automaticAllowed).toBe(false);
  },
);
it('requires at least two weeks of actual weight and intake data', () => {
  const rows = Array.from({ length: 14 }, (_, i) => ({
    date: dateOffset('2026-11-01', i),
    weight: 77,
    calories: 2800,
  }));
  expect(calibrateEnergy(rows.slice(0, 13), 2800)).toBeNull();
  expect(calibrateEnergy(rows, 2800)).toMatchObject({ estimate: 2800, days: 14 });
});
