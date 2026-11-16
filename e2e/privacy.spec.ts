import { test, expect } from '@playwright/test';
test('under-18 is blocked, no personal storage or third-party requests before consent', async ({
  page,
}) => {
  const thirdParty: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') thirdParty.push(request.url());
  });
  await page.goto('/#/start');
  await expect(
    page.getByRole('heading', { name: 'IronCycle — только для взрослых 18+' }),
  ).toBeVisible();
  await page.getByLabel('Дата рождения (не сохраняется)').fill('2010-11-15');
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: /До 18 лет приложение недоступно/ }),
  ).toBeVisible();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await page.evaluate(async () => await indexedDB.databases())).toEqual([]);
  expect(await page.evaluate(async () => await caches.keys())).toEqual([]);
  expect(thirdParty).toEqual([]);
});
test('adult consent is separate, unchecked, versioned; health screening follows consent', async ({
  page,
}) => {
  await page.goto('/#/start');
  await page.getByLabel('Дата рождения (не сохраняется)').fill('2000-01-01');
  await page.getByRole('button', { name: 'Далее', exact: true }).click();
  const boxes = page.locator('.consent-checkbox input');
  await expect(boxes).toHaveCount(5);
  for (const box of await boxes.all()) {
    await expect(box).not.toBeChecked();
    await box.check();
  }
  await page.getByRole('button', { name: 'Отклонить необязательное', exact: true }).click();
  await page.getByRole('button', { name: 'Начать цикл', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Предварительный опрос о здоровье' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Ни одного из перечисленного', exact: true }).click();
  await page.getByRole('button', { name: 'Подтвердить ответы', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Настроим программу под твои условия.' }),
  ).toBeVisible();
  const record = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:consent')!));
  expect(record).toMatchObject({ adult: true, health: true, privacy: true, terms: true });
  expect(record.versions.privacy).toBe('preview-1');
  expect(JSON.stringify(record)).not.toContain('2000-01-01');
});
