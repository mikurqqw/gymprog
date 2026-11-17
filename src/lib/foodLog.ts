import { z } from 'zod';
import type { FoodRecord } from './foodSchema';
export const foodLogSchema = z.object({
  id: z.string(),
  date: z.iso.date(),
  name: z.string().max(200),
  grams: z.number().min(0).max(10000),
  kcal: z.number().min(0).max(12000),
  protein: z.number().min(0).max(600),
  fat: z.number().min(0).max(2000).optional(),
  carbs: z.number().min(0).max(3000).optional(),
  sourceId: z.string().max(200).optional(),
  sourceLicense: z.string().max(200).optional(),
  sourceUrl: z
    .url()
    .max(500)
    .refine((value) => {
      const url = new URL(value);
      return (
        url.protocol === 'https:' &&
        ['world.openfoodfacts.org', 'fdc.nal.usda.gov'].includes(url.hostname) &&
        !url.username &&
        !url.password
      );
    })
    .optional(),
});
export type FoodLog = z.infer<typeof foodLogSchema>;
export function foodServing(food: FoodRecord, grams: number, date: string, name: string): FoodLog {
  if (!Number.isFinite(grams) || grams <= 0 || grams > 3000) throw Error('Invalid serving');
  return foodLogSchema.parse({
    id: crypto.randomUUID(),
    date,
    name: name.slice(0, 200),
    grams,
    kcal: (food.kcal * grams) / 100,
    protein: (food.p * grams) / 100,
    fat: (food.f * grams) / 100,
    carbs: (food.c * grams) / 100,
    sourceId: food.sourceId,
    sourceLicense: food.license,
    ...(food.sourceId === 'open-food-facts'
      ? { sourceUrl: 'https://world.openfoodfacts.org/product/' + food.id.replace('off-', '') }
      : food.fdcId
        ? { sourceUrl: 'https://fdc.nal.usda.gov/food-details/' + food.fdcId + '/nutrients' }
        : {}),
  });
}
export function diaryTotals(logs: FoodLog[]) {
  return {
    kcal: logs.reduce((n, f) => n + f.kcal, 0),
    protein: logs.reduce((n, f) => n + f.protein, 0),
    fat: logs.some((f) => f.fat === undefined) ? null : logs.reduce((n, f) => n + (f.fat ?? 0), 0),
    carbs: logs.some((f) => f.carbs === undefined)
      ? null
      : logs.reduce((n, f) => n + (f.carbs ?? 0), 0),
  };
}
