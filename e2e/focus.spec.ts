import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures';
import { fixtureProfile } from '../src/lib/schema';

test('Focus and Overview complete a full session with identical stored logs', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/');
  const original = await page.evaluate(() => localStorage.getItem('ironcycle:data')!);
  await page.getByRole('link', { name: 'Начать тренировку', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Фокус', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const exerciseCount = Number(
    (await page.locator('.focus-progress p').innerText()).split('/')[1].trim(),
  );
  for (let index = 0; index < exerciseCount; index++) {
    await expect(page.locator('.workout-focus .workout-line')).toHaveCount(1);
    for (let set = 0; set < (await page.locator('.focus-set').count()); set++) {
      await page
        .locator('.focus-set')
        .nth(set)
        .getByRole('button', { name: 'Подход выполнен', exact: true })
        .click();
      await expect(page.locator('.rest-timer')).toBeVisible();
      await page.locator('.rest-timer').getByRole('button', { name: 'Остановить' }).click();
    }
    if (index < exerciseCount - 1)
      await page
        .locator('.focus-navigation')
        .getByRole('button', { name: 'Далее', exact: true })
        .click();
  }
  const focusLogs = await page.evaluate(
    () => JSON.parse(localStorage.getItem('ironcycle:data')!).logs,
  );
  await page
    .locator('.workout-result')
    .getByRole('button', { name: 'Завершить и сохранить итог', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Тренировка завершена', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Тренировка завершена', exact: true }),
  ).toBeVisible();
  await page.evaluate((raw) => localStorage.setItem('ironcycle:data', raw), original);
  await page.reload();
  await page.getByRole('button', { name: 'Обзор', exact: true }).click();
  for (const line of await page.locator('.workout-line').all()) {
    await line.getByRole('button', { name: 'По плану', exact: true }).click();
    await page.locator('.rest-timer').getByRole('button', { name: 'Остановить' }).click();
  }
  const overviewLogs = await page.evaluate(
    () => JSON.parse(localStorage.getItem('ironcycle:data')!).logs,
  );
  expect(overviewLogs).toEqual(focusLogs);
  await page
    .locator('.workout-result')
    .getByRole('button', { name: 'Завершить и сохранить итог', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Тренировка завершена', exact: true }),
  ).toBeVisible();
});
test('Focus steppers, rest adjustment, choice persistence and pain check-in date', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/workout');
  await page.getByRole('button', { name: 'Фокус', exact: true }).click();
  const set = page.locator('.focus-set').first();
  const weight = set.getByRole('spinbutton', { name: 'Вес', exact: true });
  const initial = Number(await weight.inputValue());
  await set.getByRole('button', { name: 'Вес +', exact: true }).click();
  await expect(weight).toHaveValue(String(initial + fixtureProfile.step));
  await set.getByRole('button', { name: 'Вес +', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(weight).toHaveValue(String(initial + 2 * fixtureProfile.step));
  await set.getByRole('button', { name: 'Подход выполнен', exact: true }).click();
  const timer = await page.evaluate(
    () => JSON.parse(localStorage.getItem('ironcycle:data')!).timer,
  );
  await page.getByRole('button', { name: '+30 секунд', exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!).timer)).toBe(
    timer + 30000,
  );
  await page.reload();
  await expect(page.getByRole('button', { name: 'Фокус', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(
    page
      .locator('.focus-set')
      .first()
      .getByRole('button', { name: 'Отменить отметку подхода', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.focus-navigation').getByRole('link', { name: 'Боль', exact: true }).click();
  await expect(page.getByLabel('День', { exact: true })).toHaveValue(fixtureProfile.start);
});

test('Focus visual and accessibility checks in both themes', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/#/workout');
  await page.getByRole('button', { name: 'Фокус', exact: true }).click();
  for (const theme of ['dark', 'light']) {
    await page.goto('/#/settings');
    await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption(theme);
    await page.goto('/#/workout');
    for (const width of [320, 375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${width} ${theme}`,
      ).toBe(true);
      await page.screenshot({
        path: `artifacts/screenshots/focus-${width}-${theme}.png`,
        fullPage: true,
      });
    }
    const result = await new AxeBuilder({ page }).analyze();
    expect(
      result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
    ).toEqual([]);
  }
});
