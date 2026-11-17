import { test, expect } from './fixtures';
test('device theme responds to system changes, manual preference survives reload', async ({
  page,
}) => {
  await page.goto('/#/settings');
  await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption('system');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption('light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!).themePreference),
  ).toBe('light');
});
test('install prompt is hidden until completion and its dismissal persists', async ({ page }) => {
  await page.goto('/#/workout');
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.defineProperties(event, {
      prompt: {
        value: async () => {
          Reflect.set(window, 'installInvoked', true);
        },
      },
      userChoice: { value: Promise.resolve({ outcome: 'accepted' }) },
    });
    window.dispatchEvent(event);
  });
  await expect(page.locator('.install-hint')).toHaveCount(0);
  await page
    .locator('.workout-line')
    .first()
    .getByRole('button', { name: 'По плану', exact: true })
    .click();
  page.on('dialog', (dialog) => dialog.accept());
  await page
    .locator('.workout-result')
    .getByRole('button', { name: 'Завершить и сохранить итог', exact: true })
    .click();
  await expect(page.locator('.install-hint')).toBeVisible();
  await page
    .locator('.install-hint')
    .getByRole('button', { name: 'Установить', exact: true })
    .click();
  expect(await page.evaluate(() => Reflect.get(window, 'installInvoked'))).toBe(true);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('ironcycle:data')!).installHintDismissed,
    ),
  ).toBe(true);
  await page.reload();
  await expect(page.locator('.install-hint')).toHaveCount(0);
});

test.describe('iOS install help', () => {
  test.use({
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',
  });
  test('shows home-screen instructions after a workout and remembers close', async ({ page }) => {
    await page.goto('/#/workout');
    await expect(page.locator('.install-hint')).toHaveCount(0);
    await page
      .locator('.workout-line')
      .first()
      .getByRole('button', { name: 'По плану', exact: true })
      .click();
    page.on('dialog', (dialog) => dialog.accept());
    await page
      .locator('.workout-result')
      .getByRole('button', { name: 'Завершить и сохранить итог', exact: true })
      .click();
    await expect(page.locator('.install-hint')).toContainText('На экран Домой');
    await page
      .locator('.install-hint')
      .getByRole('button', { name: 'Закрыть', exact: true })
      .click();
    await page.reload();
    await expect(page.locator('.install-hint')).toHaveCount(0);
  });
});
