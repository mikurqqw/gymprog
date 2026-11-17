import { chooseBirth } from './birthDate';
import { test, expect } from './fixtures';
import { test as fresh } from '@playwright/test';
test('key flow: Focus logs survive reload and language changes', async ({ page }) => {
  const foreign: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).origin !== 'http://127.0.0.1:4173') foreign.push(r.url());
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/workout');
  await page.getByRole('button', { name: 'Фокус', exact: true }).click();
  await page
    .locator('.focus-set')
    .first()
    .getByRole('button', { name: 'Подход выполнен', exact: true })
    .click();
  await page.reload();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem('ironcycle:data')!).logs.some((log: { sets: boolean[] }) =>
        log.sets.some(Boolean),
      ),
    ),
  ).toBe(true);
  await page.goto('/?lang=kk#/program');
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await page.goto('/?lang=en#/nutrition');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(foreign).toEqual([]);
});
fresh('key flow: fresh age gate never pre-fills a birth date or writes data', async ({ page }) => {
  await page.goto('/#/start');
  await expect(
    page.getByRole('button', { name: 'Дата рождения (не сохраняется)', exact: true }),
  ).toContainText('Выбрать дату рождения');
  await chooseBirth(page, '2015-01-01');
  await page.locator('form button[type="submit"]').click();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  await expect(page.locator('.birth-trigger')).toHaveCount(0);
});
