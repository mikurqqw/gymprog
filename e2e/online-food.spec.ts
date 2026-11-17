import { test, expect } from './fixtures';
import { diaryStrings } from '../src/i18n/diaryStrings';
import { journeyMessages } from './journeyMessages';
const product = {
  code: '4600000000000',
  product_name: 'Test biscuit',
  brands: 'TEST',
  nutrition_data_per: '100g',
  nutriments: { 'energy-kcal_100g': 480, proteins_100g: 5, fat_100g: 20, carbohydrates_100g: 65 },
};
for (const language of ['ru', 'kk', 'en'] as const)
  test(`explicit online food search stores serving macros and attribution ${language}`, async ({
    page,
  }) => {
    const base = journeyMessages(language),
      t = (key: string) => diaryStrings[key]?.[language] ?? base(key),
      requests: string[] = [];
    await page.route('https://world.openfoodfacts.org/**', async (route) => {
      requests.push(route.request().url());
      expect(route.request().headers()['referer']).toBeUndefined();
      await route.fulfill({ json: { products: [product] } });
    });
    await page.goto('/?lang=' + language + '#/nutrition');
    await page.getByRole('searchbox', { name: t('searchFood'), exact: true }).fill('Test biscuit');
    expect(requests).toEqual([]);
    await page.getByRole('button', { name: t('onlineFood'), exact: true }).click();
    const online = page.getByRole('region', { name: t('onlineFoodResult'), exact: true });
    await expect(online.getByRole('combobox')).toContainText('Test biscuit');
    await online.getByLabel(t('grams'), { exact: true }).fill('50');
    await online.getByRole('button', { name: t('add'), exact: true }).click();
    await page.reload();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
    expect(state.version).toBe(6);
    expect(state.foodLogs.at(-1)).toMatchObject({
      grams: 50,
      kcal: 240,
      protein: 2.5,
      fat: 10,
      carbs: 32.5,
      sourceId: 'open-food-facts',
    });
    await expect(page.getByRole('link', { name: /Open Food Facts · ODbL/ })).toBeVisible();
    expect(requests).toHaveLength(1);
  });
test('empty primary source falls back to USDA without changing the on-device catalog', async ({
  page,
}) => {
  const t = (key: string) => diaryStrings[key]?.ru ?? journeyMessages('ru')(key);
  let fallback = 0;
  await page.route('https://world.openfoodfacts.org/**', (route) =>
    route.fulfill({ json: { products: [] } }),
  );
  await page.route('https://api.nal.usda.gov/**', async (route) => {
    fallback++;
    await route.fulfill({
      json: {
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
      },
    });
  });
  await page.goto('/#/nutrition');
  await page.getByRole('searchbox', { name: t('searchFood'), exact: true }).fill('not in catalog');
  await page.getByRole('button', { name: t('onlineFood'), exact: true }).click();
  await expect(page.locator('.online-food-result')).toContainText('Test fallback');
  expect(fallback).toBe(1);
  await page
    .locator('.online-food-result')
    .getByRole('button', { name: t('add'), exact: true })
    .click();
  const logs = await page.evaluate(
    () => JSON.parse(localStorage.getItem('ironcycle:data')!).foodLogs,
  );
  expect(logs.at(-1)).toMatchObject({
    kcal: 100,
    protein: 2,
    fat: 3,
    carbs: 16,
    sourceId: 'usda-live',
  });
});
