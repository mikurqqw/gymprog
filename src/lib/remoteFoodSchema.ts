import { z } from 'zod';
import { foodSchema, type FoodRecord } from './foodSchema';
const numeric = z.number().finite().nonnegative();
const offProduct = z.object({
  code: z.string().regex(/^\d{8,14}$/),
  product_name: z.string().max(300).optional(),
  product_name_ru: z.string().max(300).optional(),
  brands: z.string().max(300).optional(),
  nutriments: z.record(z.string(), z.unknown()),
  nutrition_data_per: z.string().optional(),
});
const usdaProduct = z.object({
  fdcId: z.number().int().positive(),
  description: z.string().min(1).max(300),
  brandOwner: z.string().max(300).optional(),
  foodNutrients: z.array(z.object({ nutrientId: z.number(), value: numeric })).max(300),
});
function record(
  id: string,
  name: string,
  macros: unknown,
  sourceId: string,
  license: string,
  fdcId?: number,
): FoodRecord | null {
  const label = { ru: name.slice(0, 200), kk: name.slice(0, 200), en: name.slice(0, 200) };
  const parsed = foodSchema.safeParse({
    id,
    name: label,
    aliases: { ru: [], kk: [], en: [] },
    ...(typeof macros === 'object' && macros ? macros : {}),
    tags: [],
    portions: [],
    allergens: [],
    vegetarian: false,
    halal: 'verify',
    sourceId,
    license,
    estimated: true,
    fdcId,
  });
  return parsed.success ? parsed.data : null;
}
export function parseOffProducts(input: unknown): FoodRecord[] {
  const envelope = z.object({ products: z.array(z.unknown()).max(100) }).parse(input);
  return envelope.products.flatMap((value) => {
    const parsed = offProduct.safeParse(value);
    if (!parsed.success) return [];
    const p = parsed.data,
      n = p.nutriments;
    const name = p.product_name_ru || p.product_name;
    if (!name || p.nutrition_data_per === '100ml') return [];
    const energy =
      n['energy-kcal_100g'] ??
      (typeof n['energy-kj_100g'] === 'number' ? n['energy-kj_100g'] / 4.184 : undefined);
    const food = record(
      'off-' + p.code,
      name + (p.brands ? ' · ' + p.brands : ''),
      { kcal: energy, p: n.proteins_100g, f: n.fat_100g, c: n.carbohydrates_100g },
      'open-food-facts',
      'ODbL-1.0 / DbCL-1.0',
    );
    return food ? [food] : [];
  });
}
export function parseUsdaProducts(input: unknown): FoodRecord[] {
  const envelope = z.object({ foods: z.array(z.unknown()).max(100) }).parse(input);
  return envelope.foods.flatMap((value) => {
    const parsed = usdaProduct.safeParse(value);
    if (!parsed.success) return [];
    const p = parsed.data,
      get = (id: number) => p.foodNutrients.find((n) => n.nutrientId === id)?.value;
    const food = record(
      'fdc-live-' + p.fdcId,
      p.description + (p.brandOwner ? ' · ' + p.brandOwner : ''),
      { kcal: get(1008), p: get(1003), f: get(1004), c: get(1005) },
      'usda-live',
      'CC0-1.0',
      p.fdcId,
    );
    return food ? [food] : [];
  });
}
