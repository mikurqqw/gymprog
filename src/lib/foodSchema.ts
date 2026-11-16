import { z } from 'zod';
const text = z.object({
  ru: z.string().min(1).max(300),
  kk: z.string().min(1).max(300),
  en: z.string().min(1).max(300),
});
export const foodSchema = z.object({
  id: z.string().min(1).max(100),
  name: text,
  aliases: z.object({
    ru: z.array(z.string().max(200)).max(30),
    kk: z.array(z.string().max(200)).max(30),
    en: z.array(z.string().max(200)).max(30),
  }),
  kcal: z.number().min(0).max(1000),
  p: z.number().min(0).max(100),
  f: z.number().min(0).max(100),
  c: z.number().min(0).max(100),
  tags: z.array(z.string().max(100)).max(40),
  portions: z.array(z.object({ name: text, grams: z.number().min(0.1).max(5000) })).max(20),
  allergens: z.array(z.string().max(100)).max(30),
  vegetarian: z.boolean(),
  halal: z.enum(['suitable', 'not-suitable', 'verify']),
  sourceId: z.string().max(200),
  license: z.string().max(200),
  estimated: z.boolean(),
  fdcId: z.number().int().positive().optional(),
  sourceDescription: z.string().max(2000).optional(),
  translationReview: z.string().max(500).optional(),
  nutritionNote: text.optional(),
  recipeYieldGrams: z.number().positive().max(1000000).optional(),
  recipeIngredients: z
    .array(z.object({ foodId: z.string().max(100), grams: z.number().positive().max(100000) }))
    .max(100)
    .optional(),
  custom: z.boolean().optional(),
  customFlag: z.number().int().min(0).max(1).optional(),
  searchTokens: z.array(z.string()).optional(),
});
export type FoodRecord = z.infer<typeof foodSchema>;
export function foodSearchText(food: FoodRecord) {
  return [food.name.ru, food.name.kk, food.name.en, ...Object.values(food.aliases).flat()]
    .join(' ')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/ё/g, 'е');
}
export function indexFood(food: FoodRecord): FoodRecord {
  return {
    ...food,
    customFlag: food.custom ? 1 : 0,
    searchTokens: [
      ...new Set(
        foodSearchText(food)
          .split(/[^\p{L}\p{N}]+/u)
          .filter(Boolean),
      ),
    ],
  };
}
