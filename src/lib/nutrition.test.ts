import { expect, it } from 'vitest';
import { defaultProfile as p } from './schema';
import { nutrition, mealPlan, allowedFood } from './nutrition';
import foods from '../data/foods.json';
it('reproduces Mifflin St Jeor and default protein range', () => {
  const n = nutrition(p);
  expect(n.bmr).toBe(1829);
  expect(n.minProtein).toBeCloseTo(123.2);
  expect(n.maxProtein).toBe(154);
  expect(n.protein).toBeCloseTo(138.6);
});
it('caps fat-loss deficit and provides safe energy', () => {
  const n = nutrition({ ...p, nutritionGoal: 'loss', pace: 0.005 });
  expect(n.kcal).toBeGreaterThanOrEqual(n.tdee * 0.8 - 1);
  expect(n.kcal).toBeGreaterThanOrEqual(1500);
  expect(n.fat).toBeGreaterThanOrEqual(p.weight * 0.7);
});
it('keeps the deficit cap even on lower-calorie rest days', () => {
  const n = nutrition({ ...p, nutritionGoal: 'loss', pace: 0.005 }, 'rest');
  expect(n.kcal).toBeGreaterThanOrEqual(n.tdee * 0.8 - 1);
});
it.each(['omnivore', 'vegetarian', 'halal', 'lactoseFree'] as const)(
  'menus hit macros within 5%% for %s',
  (diet) => {
    for (let seed = 0; seed < 7; seed++) {
      const plan = mealPlan({ ...p, diet }, foods, seed);
      for (const key of ['kcal', 'protein', 'fat', 'carbs'] as const)
        expect(
          Math.abs(plan.total[key] - plan.target[key]) / plan.target[key],
          `${diet} ${seed} ${key}`,
        ).toBeLessThanOrEqual(0.05);
    }
  },
);
it('respects diet and declared allergies', () => {
  const profile = { ...p, diet: 'vegetarian' as const, allergies: 'soy, gluten, egg' };
  expect(
    foods
      .filter((f) => allowedFood(f, profile))
      .every((f) => !f.tags.some((t) => ['meat', 'soy', 'gluten', 'egg'].includes(t))),
  ).toBe(true);
  expect(() => mealPlan({ ...p, allergies: 'protein' }, foods)).toThrow();
});
