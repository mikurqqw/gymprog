import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
test.use({ configuredProfile: false });
async function body(page: import('@playwright/test').Page) {
  await page.goto('/#/profile');
  await expect(page.locator('.onboarding-goals input')).toHaveCount(8);
  await page.getByLabel('Возраст', { exact: true }).fill('30');
  await page.getByLabel('Рост (cm)', { exact: true }).fill('175');
  await page.getByLabel('Масса тела (kg)', { exact: true }).fill('70');
  await page
    .getByRole('combobox', { name: 'Пол для расчёта калорий', exact: true })
    .selectOption('male');
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
}
test('three-step unknown-strength onboarding reaches Focus without automatic numeric loads', async ({
  page,
}) => {
  const started = Date.now();
  await page.setViewportSize({ width: 375, height: 812 });
  await body(page);
  await expect(page.locator('.strength-entry')).toHaveCount(3);
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Твой старт', exact: true })).toBeVisible();
  const start = await page.getByLabel('Начало цикла', { exact: true }).inputValue();
  expect(new Date(start + 'T12:00:00Z').getUTCDay()).toBe(1);
  await page.getByRole('button', { name: 'Начать цикл', exact: true }).click();
  await page.getByRole('link', { name: 'Начать тренировку', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Фокус', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
  expect(stored.profile.strengthAssessment).toEqual({
    squat: 'unknown',
    bench: 'unknown',
    deadlift: 'unknown',
  });
  await expect(page.locator('.workout-focus .workout-plan')).toContainText('Подбери вес по RPE');
  await expect(
    page.locator('.focus-set').first().getByRole('spinbutton', { name: 'Вес', exact: true }),
  ).toHaveValue('0');
  await page
    .locator('.focus-set')
    .first()
    .getByRole('button', { name: 'Подход выполнен', exact: true })
    .click();
  await expect(page.locator('.workout-result')).toBeVisible();
  await page.goto('/#/test');
  await expect(page.locator('main')).toContainText('тест максимума отключены');
  expect(Date.now() - started).toBeLessThan(120000);
});
test('known and estimated strength choices autosave and remain explicit', async ({ page }) => {
  await body(page);
  const entries = page.locator('.strength-entry');
  await entries.nth(0).getByRole('combobox').selectOption('known');
  await entries.nth(0).getByRole('spinbutton').fill('60');
  await entries.nth(1).getByRole('combobox').selectOption('set');
  await entries.nth(1).getByLabel('Вес недавнего подхода (kg)', { exact: true }).fill('30');
  await expect(entries.nth(1)).toContainText('Расчётная оценка, не проверенный максимум');
  await page.reload();
  await expect(page.getByLabel('Возраст', { exact: true })).toHaveValue('30');
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await expect(entries.nth(0).getByRole('spinbutton')).toHaveValue('60');
  await expect(
    entries.nth(1).getByLabel('Вес недавнего подхода (kg)', { exact: true }),
  ).toHaveValue('30');
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await page.getByRole('button', { name: 'Начать цикл', exact: true }).click();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
  expect(stored.profile.strengthAssessment).toEqual({
    squat: 'known',
    bench: 'estimated',
    deadlift: 'unknown',
  });
  expect(stored.profile.lifts.squat.current).toBe(60);
  expect(stored.profile.lifts.bench.current).toBeGreaterThan(30);
});

test('onboarding responsive visual and accessibility review', async ({ page }) => {
  await page.goto('/#/profile');
  for (const theme of ['dark', 'light']) {
    if ((await page.locator('html').getAttribute('data-theme')) !== theme)
      await page.locator('.app-header').getByRole('button', { name: /^Тема/ }).click();
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({
        path: `artifacts/screenshots/onboarding-${width}-${theme}.png`,
        fullPage: true,
      });
    }
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter((item) => ['critical', 'serious'].includes(item.impact ?? '')),
    ).toEqual([]);
  }
});
