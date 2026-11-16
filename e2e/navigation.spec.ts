import { test, expect } from './fixtures';
test('mobile tabs, grouped More and search preserve navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.scrollTo = (() => Promise.resolve()) as typeof window.scrollTo;
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/workout');
  const tabs = page.locator('.mobile-tabs');
  await expect(tabs.getByRole('link')).toHaveCount(4);
  await expect(tabs.locator('[aria-current="page"]')).toHaveText('Сегодня');
  await tabs.getByRole('button', { name: 'Ещё' }).click();
  const sheet = page.locator('.more-sheet');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('link', { name: 'Мой профиль', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet).not.toBeVisible();
  await page.locator('.app-header').getByRole('button', { name: 'Поиск', exact: true }).click();
  const search = page.locator('.search-sheet');
  await expect(search.getByRole('searchbox')).toBeVisible();
  await search.getByRole('searchbox').fill('присед');
  await search.getByRole('link').first().click();
  await expect(page).toHaveURL(/library/);
  await expect(search).not.toBeVisible();
  expect(errors).toEqual([]);
  await page.screenshot({
    path: 'artifacts/screenshots/navigation-library-375.png',
    fullPage: true,
  });
});
test('desktop sidebar has visible labels and slash opens search', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#/');
  await expect(
    page.locator('.navigation-sidebar').getByRole('link', { name: 'Сегодня', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('/');
  await expect(page.locator('.search-sheet[open]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.search-sheet')).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'Последняя тренировка' })).toBeVisible();
});
