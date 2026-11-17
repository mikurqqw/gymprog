import { test, expect } from './fixtures';
test('five activity levels update TDEE independently from workouts and medical flags disable targets', async ({
  page,
}) => {
  await page.goto('/#/nutrition');
  await page
    .locator('details')
    .filter({
      has: page.getByRole('combobox', {
        name: 'Коэффициент активности',
        includeHidden: true,
        exact: true,
      }),
    })
    .locator('summary')
    .first()
    .click();
  await page
    .getByRole('combobox', { name: 'Коэффициент активности', includeHidden: true, exact: true })
    .selectOption('1.9');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('.nutrition-stats')).toContainText('3475');
  await page.getByRole('checkbox', { name: 'Диабет', exact: true }).check();
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.locator('.nutrition-stats')).toHaveCount(0);
  await expect(
    page.getByText('Автоматические рекомендации по питанию отключены.', { exact: false }).first(),
  ).toBeVisible();
});
