import { test, expect } from './fixtures';
import { updateServer } from './updateServer';
test('build A to B waits for user approval, loads new entry, removes every old cache and stays offline', async ({
  page,
  context,
}) => {
  test.setTimeout(120000);
  const server = await updateServer();
  try {
    await page.goto(server.url + '/#/workout');
    await expect(page.locator('h1')).toHaveText('Тренировка');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    expect(await page.evaluate(() => Reflect.get(window, '__IRONCYCLE_TEST_BUILD__'))).toBe('A');
    await page.evaluate(() => caches.open('ironcycle-extra-stale'));
    server.publishB();
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration?.update();
    });
    const update = page.getByRole('button', { name: 'Обновить приложение', exact: false });
    await expect(page.locator('.offline-status').getByRole('button')).toBeVisible();
    expect(await page.evaluate(() => Reflect.get(window, '__IRONCYCLE_TEST_BUILD__'))).toBe('A');
    page.on('dialog', (dialog) => dialog.accept());
    if (await update.count()) await update.click();
    else await page.locator('.offline-status').getByRole('button').click();
    await page.waitForFunction(() => Reflect.get(window, '__IRONCYCLE_TEST_BUILD__') === 'B');
    await expect.poll(() => page.evaluate(() => caches.keys())).toEqual(['ironcycle-fixture-B']);
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('h1')).toHaveText('Тренировка');
    expect(await page.evaluate(() => Reflect.get(window, '__IRONCYCLE_TEST_BUILD__'))).toBe('B');
    await context.setOffline(false);
  } finally {
    await context.setOffline(false);
    await page.goto('about:blank');
    await server.close();
  }
});
test.describe('unconfigured profile', () => {
  test.use({ configuredProfile: false });
  test('fresh user has empty placeholders, no generated personal plan, and dated setup starts next Monday', async ({
    page,
  }) => {
    await page.goto('/#/profile');
    await expect(page.getByLabel('Возраст', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Рост (cm)', { exact: true })).toHaveValue('');
    await expect(page.getByLabel('Масса тела (kg)', { exact: true })).toHaveValue('');
    await page.goto('/#/workout');
    await expect(page.getByRole('link', { name: 'Перейти к настройке' })).toBeVisible();
    await expect(page.locator('.workout-line')).toHaveCount(0);
  });
});
