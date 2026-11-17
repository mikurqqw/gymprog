import { expect, it } from 'vitest';
import { foodServing, diaryTotals } from './foodLog';
import { parseOffProducts, parseUsdaProducts } from './remoteFoodSchema';
import { parseBackup, initialState } from './storage';
import { checkinDraft } from './checkinDraft';
const payload = {
  products: [
    {
      code: '4600000000000',
      product_name: 'Test biscuit',
      brands: 'TEST',
      nutrition_data_per: '100g',
      nutriments: {
        'energy-kcal_100g': 480,
        proteins_100g: 5,
        fat_100g: 20,
        carbohydrates_100g: 65,
      },
    },
  ],
};
it('records all four nutrients for the actual serving and keeps source attribution through migration/export', () => {
  const [food] = parseOffProducts(payload),
    entry = foodServing(food, 50, '2026-11-18', 'Test biscuit');
  expect(entry).toMatchObject({
    grams: 50,
    kcal: 240,
    protein: 2.5,
    fat: 10,
    carbs: 32.5,
    sourceId: 'open-food-facts',
  });
  const restored = parseBackup(JSON.stringify({ ...initialState, foodLogs: [entry] }));
  expect(restored.foodLogs).toEqual([entry]);
  expect(diaryTotals(restored.foodLogs)).toEqual({ kcal: 240, protein: 2.5, fat: 10, carbs: 32.5 });
  expect(() => foodServing(food, NaN, '2026-11-18', 'Bad')).toThrow();
});
it('does not invent missing macros in legacy state5 records', () => {
  const old = { id: 'old', date: '2026-11-17', name: 'Legacy', grams: 100, kcal: 200, protein: 8 };
  const restored = parseBackup(JSON.stringify({ ...initialState, version: 5, foodLogs: [old] }));
  expect(restored.version).toBe(6);
  expect(restored.foodLogs).toEqual([old]);
  expect(diaryTotals(restored.foodLogs)).toEqual({ kcal: 200, protein: 8, fat: null, carbs: null });
});
it('rejects incomplete, implausible and wrong-unit source records rather than substituting zero', () => {
  expect(
    parseOffProducts({
      products: [{ ...payload.products[0], nutriments: { 'energy-kcal_100g': 480 } }],
    }),
  ).toEqual([]);
  expect(
    parseOffProducts({ products: [{ ...payload.products[0], nutrition_data_per: '100ml' }] }),
  ).toEqual([]);
  expect(parseOffProducts({ products: [{ ...payload.products[0], code: 'bad<script>' }] })).toEqual(
    [],
  );
  expect(() => parseOffProducts({ products: 'wrong' })).toThrow();
  expect(
    parseUsdaProducts({
      foods: [
        {
          fdcId: 42,
          description: 'Test fallback',
          foodNutrients: [
            { nutrientId: 1008, value: 100 },
            { nutrientId: 1003, value: 2 },
            { nutrientId: 1004, value: 3 },
            { nutrientId: 1005, value: 16 },
          ],
        },
      ],
    }),
  ).toHaveLength(1);
});
it('uses the selected day for yesterday totals and starts new measurements from profile weight', () => {
  const profile = { weight: 77, sleep: 7 },
    entry = {
      id: '1',
      date: '2026-11-17',
      name: 'Food',
      grams: 100,
      kcal: 400,
      protein: 20,
      carbs: 40,
    };
  expect(checkinDraft('2026-11-18', profile, [entry])).toMatchObject({
    weight: 77,
    calories: 400,
    protein: 20,
    carbs: 40,
  });
  expect(checkinDraft('2026-11-19', profile, [entry]).calories).toBeUndefined();
});
