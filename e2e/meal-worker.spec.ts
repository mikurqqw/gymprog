import { test, expect } from './fixtures';
test('meal calculation failure offers a working retry without changing targets', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const NativeWorker = Worker;
    let first = true;
    class UnavailableOnce extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        if (first) {
          first = false;
          throw Error('Test worker unavailable');
        }
        super(url, options);
      }
    }
    Object.defineProperty(window, 'Worker', { value: UnavailableOnce });
  });
  await page.goto('/#/nutrition');
  await expect(page.getByRole('alert')).toContainText('Не удалось запустить расчёт меню');
  await expect(page.locator('.nutrition-stats')).toContainText('2835');
  await page.getByRole('button', { name: 'Повторить', exact: true }).click();
  await expect(page.locator('.meal-grid .meal-card')).toHaveCount(3);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('.nutrition-stats')).toContainText('2835');
});
