import { chooseBirth } from './birthDate';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('public demo and catalog show product value without storing personal data or making third-party requests', async ({
  page,
}) => {
  const thirdParty: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') thirdParty.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Знай, что делать');
  await expect(page.locator('.sf-hero a[href*=demo]')).toHaveCount(0);
  await page.goto('/#/demo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Одна минута внутри IronCycle.');
  await page.getByRole('button', { name: 'Открыть пример тренировки' }).click();
  await page
    .getByRole('button', { name: 'Подход 1 · Отметить пример подхода 1', exact: true })
    .click();
  await page.getByRole('button', { name: 'Показать итог' }).click();
  await expect(page.getByText('Теперь видно, сколько сделано', { exact: false })).toBeVisible();
  await page.goto('/#/catalog/strength');
  await expect(page.getByRole('heading', { name: 'Кому подойдёт' })).toBeVisible();
  await page.getByRole('link', { name: 'Выбрать эту программу' }).click();
  await expect(page.getByLabel('Дата рождения (не сохраняется)')).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
  expect(await page.evaluate(() => caches.keys())).toEqual([]);
  expect(thirdParty).toEqual([]);
});
test('selected program survives adult consent and is handed to profile setup', async ({ page }) => {
  await page.goto('/#/catalog/fitness');
  await page.getByRole('link', { name: 'Выбрать эту программу' }).click();
  await chooseBirth(page, '2000-01-01');
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  for (const box of await page.locator('.consent-checkbox input').all()) await box.check();
  await page.getByRole('button', { name: 'Отклонить необязательное', exact: true }).click();
  await page.getByRole('button', { name: 'Начать цикл', exact: true }).click();
  await page.getByRole('button', { name: 'Ни одного из перечисленного', exact: true }).click();
  await page.getByRole('button', { name: 'Подтвердить ответы', exact: true }).click();
  await page.getByRole('button', { name: 'Перейти к настройке' }).click();
  await expect(page).toHaveURL(/profile/);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('ironcycle:data')!).draftProfile.goal,
    ),
  ).toBe('fitness');
});
for (const width of [320, 375, 768, 1280, 1920])
  for (const theme of ['dark', 'light'])
    test(`public storefront ${width}px ${theme}`, async ({ page }) => {
      test.setTimeout(120000);
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/');
      if (theme === 'light') await page.getByRole('button', { name: 'Тема', exact: true }).click();
      for (const route of ['welcome', 'catalog', 'catalog/strength', 'demo']) {
        await page.goto('/#/' + route);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await page.waitForTimeout(150);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        expect
          .soft(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            route,
          )
          .toBe(true);
        if (route === 'welcome') {
          for (const picture of await page.locator('.product-device img').all()) {
            await picture.scrollIntoViewIfNeeded();
            await picture.evaluate((element) => (element as HTMLImageElement).decode());
          }
          await page.evaluate(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          });
        }
        await page.screenshot({
          path: `artifacts/screenshots/storefront-${route.replace('/', '-')}-${width}-${theme}.png`,
          fullPage: true,
          animations: 'disabled',
        });
      }
      const result = await new AxeBuilder({ page }).analyze();
      expect(
        result.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? '')),
      ).toEqual([]);
    });
