import { test, expect } from './fixtures';
test('context notices expand without hiding stop warnings and footer remains compact', async ({
  page,
}) => {
  await page.goto('/#/program');
  const notice = page.locator('.context-notice').first();
  await expect(notice).not.toHaveAttribute('open');
  await notice.locator('summary').click();
  await expect(notice.locator('p')).toBeVisible();
  await page.goto('/#/nutrition');
  await expect(page.locator('.calorie-notice .context-notice summary')).toContainText(
    'индивидуального обмена веществ',
  );
  await page.goto('/#/checkin');
  await expect(page.locator('main > .notice.warning')).toBeVisible();
  const footer = page.locator('.compact-legal-footer');
  await expect(footer.locator('nav > a')).toHaveCount(3);
  await footer.locator('summary').click();
  await expect(
    footer.getByRole('link', { name: 'Медицинский отказ и риски', exact: true }),
  ).toBeVisible();
  await footer.getByRole('combobox').selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
test('Royal Blue themes match owner reference with readable primary buttons', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const [theme, accent] of [
    ['dark', '#4f8cff'],
    ['light', '#2563eb'],
  ]) {
    await page.goto('/#/settings');
    await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption(theme);
    await page.goto('/#/');
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
      ),
    ).toBe(accent);
    await expect(page.getByRole('link', { name: 'Начать тренировку', exact: true })).toBeVisible();
    await page.screenshot({
      path: `artifacts/screenshots/royal-home-375-${theme}.png`,
      fullPage: true,
      animations: 'disabled',
    });
  }
});
