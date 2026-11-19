import { test, expect } from './fixtures';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { seriesPlan, variantSchema } from '../src/lib/fitSeries';

test('catalog shows separate bodybuilding plans and records a completed source workout', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/#/catalog/bodybuilding');
  await expect(page.getByRole('link', { name: /Мужской бодибилдинг ·/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Женский бодибилдинг ·/ })).toBeVisible();
  await page.getByRole('link', { name: /Мужской бодибилдинг ·/ }).click();
  await page.getByLabel('Вариант программы').selectOption({ index: 1 });
  await expect(page.locator('.series-exercises li').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Начать цикл', exact: true })).toBeDisabled();
  await page.getByRole('checkbox', { name: /Профиль, оборудование/ }).check();
  await page.getByRole('button', { name: 'Начать цикл', exact: true }).click();
  await page.getByRole('button', { name: 'Отметить выполненную тренировку' }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Тренировок отмечено 1/' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('status').filter({ hasText: 'Тренировок отмечено 1/' }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('starts cycle I again after III and retains the completed run', async ({ page }) => {
  const root = 'public/fit-series/';
  const [{ id: profile }] = variantSchema
    .array()
    .parse(JSON.parse(readFileSync(root + 'home_core_8w.json', 'utf8')));
  const plan = seriesPlan.parse(
    JSON.parse(gunzipSync(readFileSync(root + profile + '-home-3.json.gz')).toString('utf8')),
  );
  await page.goto('/#/series/home_core_8w');
  await page.evaluate(
    ({ plan, profile }) => {
      const state = JSON.parse(localStorage.getItem('ironcycle:data')!);
      const date = new Date().toISOString();
      state.seriesRuns = [
        {
          id: crypto.randomUUID(),
          program: plan.program,
          profile,
          mode: 'home',
          cycle: 3,
          started: date,
          days: Object.fromEntries(
            plan.calendar.flatMap((day, i) => (day.work ? [[i, date]] : [])),
          ),
        },
      ];
      localStorage.setItem('ironcycle:data', JSON.stringify(state));
    },
    { plan, profile },
  );
  await page.reload();
  const restart = page.getByRole('button', { name: 'Снова начать с цикла I' });
  await expect(restart).toBeDisabled();
  await page.getByRole('checkbox', { name: /Профиль, оборудование/ }).check();
  await restart.click();
  await expect(page.getByRole('heading', { name: 'Цикл I', exact: true })).toBeVisible();
  await page.getByText('История циклов · 2').click();
  await expect(page.getByText(/^Цикл III ·/)).toBeVisible();
});
