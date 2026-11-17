import { test, expect } from '@playwright/test';
test('short landing links to all directions, real screenshots and honest FAQs', async ({
  page,
}) => {
  await page.goto('/#/welcome');
  await expect(page.getByRole('link', { name: 'Начать бесплатно', exact: true })).toHaveCount(1);
  await expect(page.locator('.sf-offer-list > a')).toHaveCount(0);
  await page
    .locator('.compact-entry-links')
    .getByRole('link', { name: /Подробнее о сервисе/ })
    .click();
  await expect(page.locator('.sf-offer-list > a')).toHaveCount(8);
  await expect(page.locator('.landing-features article')).toHaveCount(6);
  await expect(page.locator('.sf-faq details')).toHaveCount(8);
  await expect(page.locator('.product-device img')).toHaveCount(2);
  for (const image of await page.locator('.product-device img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth))
      .toBeGreaterThan(0);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:/);
});
test('localized entry URL, language switch and route titles remain consistent', async ({
  page,
}) => {
  await page.goto('/?lang=en#/welcome');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Know what to do/);
  await page.locator('.sf-header').getByRole('combobox').selectOption('kk');
  await expect(page).toHaveURL(/lang=kk/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'kk');
  await page.goto('/?lang=kk#/about');
  await expect(page.locator('.sf-faq details')).toHaveCount(8);
  await page.locator('.sf-header').getByRole('combobox').selectOption('ru');
  await page.goto('/#/catalog');
  await expect(page).toHaveTitle(/Программы/);
});
