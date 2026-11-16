import { test, expect } from './fixtures';
test('invalid backup preserves state; valid import can be undone', async ({ page }) => {
  await page.goto('/#/settings');
  await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption('light');
  const original = await page.evaluate(() => localStorage.getItem('ironcycle:data'));
  const input = page.locator('input[type=file]').first();
  await input.setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":999}'),
  });
  await expect(page.getByRole('status')).toContainText('не прошёл проверку');
  expect(await page.evaluate(() => localStorage.getItem('ironcycle:data'))).toBe(original);
  const data = JSON.parse(original!);
  data.profile.weight = 90;
  page.on('dialog', (d) => d.accept());
  await input.setInputFiles({
    name: 'valid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(data)),
  });
  await expect(page.getByRole('status')).toContainText('Сохранено');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!).profile.weight),
  ).toBe(90);
  await page.getByRole('button', { name: 'Отменить замену' }).click();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!).profile.weight),
  ).toBe(77);
});
test('exercise replacement clears uncalibrated planned weight', async ({ page }) => {
  await page.goto('/#/workout');
  const first = page.locator('.workout-line').first();
  await first.getByRole('button', { name: /Подробнее/ }).click();
  await first.getByRole('combobox', { name: 'Заменить', exact: true }).selectOption('ex-21');
  await expect(page.locator('.workout-line').first().locator('.workout-plan')).toContainText(
    'Подбери вес по RPE',
  );
});
test('failed opener never raises the second-attempt suggestion', async ({ page }) => {
  await page.goto('/#/test');
  await page.getByRole('checkbox', { name: 'Безопасность', exact: true }).check();
  const squat = page
    .locator('section')
    .filter({ has: page.getByRole('heading', { name: 'Присед', exact: true }) });
  await squat.getByRole('button', { name: /Попытка 1:/ }).click();
  await squat.getByRole('button', { name: 'Неудача', exact: true }).click();
  await expect(squat.getByRole('button', { name: /Попытка 2:/ })).toContainText('125');
});
