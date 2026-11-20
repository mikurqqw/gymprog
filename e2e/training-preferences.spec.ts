import { test, expect } from './fixtures';
import { fixtureProfile } from '../src/lib/schema';
import { journeyMessages } from './journeyMessages';

const t = journeyMessages('ru');

test('imperial profile and equipment round trip without changing the planned load', async ({
  page,
}) => {
  await page.goto('/#/workout');
  const original = await page.locator('.workout-plan').first().innerText();
  await page.goto('/#/settings');
  const units = page.getByRole('combobox', { name: t('units'), exact: true });
  await units.selectOption('imperial');
  await page
    .locator('summary')
    .filter({ hasText: t('compactEquipment') })
    .click();
  const increment = page.getByLabel('Шаг веса (фунт)', { exact: true });
  await expect(increment).toHaveValue('5');
  await expect(page.getByLabel(t('bar') + ' (фунт)', { exact: true })).toHaveValue('45');
  await page.goto('/#/profile');
  const height = page.getByLabel('Рост (дюйм)', { exact: true });
  await expect(height).toHaveValue(String(Number((fixtureProfile.height / 2.54).toFixed(2))));
  await height.fill('70');
  await page.getByLabel('Масса тела (фунт)', { exact: true }).fill('200');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await page.goto('/#/workout');
  await expect(page.locator('.workout-plan').first()).toContainText('фунт');
  await page.getByRole('button', { name: 'Фокус', exact: true }).click();
  const firstSet = page.locator('.focus-set').first();
  const weight = firstSet.getByRole('spinbutton', { name: 'Вес', exact: true });
  const first = Number(await weight.inputValue());
  await firstSet.getByRole('button', { name: 'Вес +', exact: true }).click();
  await expect(weight).toHaveValue(String(Number((first + 5).toFixed(2))));
  await page.goto('/#/settings');
  await units.selectOption('metric');
  await page.goto('/#/profile');
  await expect(page.getByLabel('Рост (см)', { exact: true })).toHaveValue('177.8');
  await expect(page.getByLabel('Масса тела (кг)', { exact: true })).toHaveValue('90.72');
  await page.goto('/#/workout');
  await expect(page.locator('.workout-plan').first()).toHaveText(original, { useInnerText: true });
});

test('three source levels and the selected program are accessible from Today', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/');
  await expect(
    page.locator('main').getByRole('link', { name: t('checkin'), exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('main').getByRole('link', { name: t('builder'), exact: true }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Выбрать программу', exact: true }).click();
  await page.locator('.training-preferences select').selectOption('powerlifting');
  await page.getByRole('button', { name: 'Выбрать вариант', exact: true }).click();
  await expect(page.locator('optgroup')).toHaveCount(3);
  await page.getByLabel('Вариант программы').selectOption({ index: 1 });
  const firstDay = page.getByRole('heading', { name: 'Неделя 1 · День 1', exact: true });
  await expect(firstDay).toBeVisible();
  await page.getByRole('checkbox', { name: /Профиль, оборудование/ }).check();
  await page.getByRole('button', { name: 'Начать цикл', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Отметить выполненную тренировку' })).toBeVisible();
  await page.goto('/#/workout');
  await expect(page).toHaveURL(/\/series\/powerlifting/);
  await page.goto('/#/profile?training=1');
  await page.locator('.training-preferences select').selectOption('');
  await page.getByRole('button', { name: 'Открыть программу', exact: true }).click();
  await page.goto('/#/workout');
  await expect(firstDay).toBeVisible();
  await expect(page.getByRole('button', { name: /распечатать/i, includeHidden: true })).toHaveCount(
    0,
  );
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('ironcycle:data')!).seriesRuns.length,
    ),
  ).toBe(1);
});

test('nutrition targets update with the selected goal and day type', async ({ page }) => {
  await page.goto('/#/nutrition');
  const goal = page.getByRole('combobox', { name: 'Цель питания', exact: true });
  const day = page.getByRole('combobox', { name: 'Тип дня', exact: true });
  const calories = page.locator('.nutrition-stats strong').first();
  await goal.selectOption('gain');
  await day.selectOption('heavy');
  const bulk = parseInt(await calories.innerText(), 10);
  await day.selectOption('rest');
  expect(parseInt(await calories.innerText(), 10)).toBeLessThan(bulk);
  await goal.selectOption('loss');
  expect(parseInt(await calories.innerText(), 10)).toBeLessThan(bulk);
  await page.reload();
  await expect(goal).toHaveValue('loss');
  await expect(day).toHaveValue('rest');
});
