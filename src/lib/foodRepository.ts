import { getDatabase } from './database';
import { foodSchema, foodSearchText, indexFood, type FoodRecord } from './foodSchema';
export interface FoodRepository {
  search(query: string, favoritesOnly?: boolean): Promise<FoodRecord[]>;
  get(id: string): Promise<FoodRecord | undefined>;
  save(food: FoodRecord): Promise<void>;
  remove(id: string): Promise<FoodRecord | undefined>;
  toggleFavorite(id: string): Promise<void>;
  favoriteIds(): Promise<string[]>;
  customFoods(): Promise<FoodRecord[]>;
  restore(food: FoodRecord): Promise<void>;
}
export async function initializeFoodCatalog(catalog: unknown, version = '2026-11-catalog-v2') {
  const foods = foodSchema.array().min(600).max(10000).parse(catalog),
    db = getDatabase();
  if (new Set(foods.map((f) => f.id)).size !== foods.length) throw Error('Duplicate food IDs');
  if ((await db.metadata.get('food-catalog'))?.value === version) return;
  await db.transaction('rw', db.foods, db.metadata, async () => {
    await db.foods.bulkPut(foods.map(indexFood));
    await db.metadata.put({ key: 'food-catalog', value: version });
  });
}
export const foodRepository: FoodRepository = {
  async search(query, favoritesOnly = false) {
    const db = getDatabase(),
      normalized = query.normalize('NFKC').trim().toLocaleLowerCase().replace(/ё/g, 'е'),
      words = normalized.split(/\s+/).filter(Boolean),
      favorites = favoritesOnly ? new Set(await this.favoriteIds()) : null;
    const collection = words.length
      ? db.foods.where('searchTokens').startsWith(words[0])
      : db.foods.toCollection();
    return collection
      .filter(
        (food) =>
          (!favorites || favorites.has(food.id)) &&
          words.every((word) => foodSearchText(food).includes(word)),
      )
      .distinct()
      .limit(100)
      .toArray();
  },
  async get(id) {
    return getDatabase().foods.get(id);
  },
  async save(value) {
    const food = foodSchema.parse({ ...value, custom: true });
    await getDatabase().foods.put(indexFood(food));
  },
  async remove(id) {
    const db = getDatabase(),
      food = await db.foods.get(id);
    if (!food?.custom) throw Error('Only custom foods can be removed');
    await db.transaction('rw', db.foods, db.favorites, async () => {
      await db.foods.delete(id);
      await db.favorites.delete(id);
    });
    return food;
  },
  async restore(food) {
    await this.save(food);
  },
  async toggleFavorite(foodId) {
    const db = getDatabase();
    await db.transaction('rw', db.favorites, async () => {
      if (await db.favorites.get(foodId)) await db.favorites.delete(foodId);
      else await db.favorites.put({ foodId });
    });
  },
  async favoriteIds() {
    return (await getDatabase().favorites.toArray()).map((item) => item.foodId);
  },
  async customFoods() {
    return getDatabase().foods.where('customFlag').equals(1).toArray();
  },
};
