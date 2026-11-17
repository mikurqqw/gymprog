import { test as fresh, expect } from '@playwright/test';
import { test } from './fixtures';
fresh('theme bootstrap does not open personal records before consent', async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.getItem;
    const reads: string[] = [];
    Object.defineProperty(window, '__storageReads', { value: reads });
    Storage.prototype.getItem = function (key) {
      reads.push(key);
      return original.call(this, key);
    };
  });
  await page.goto('/#/start');
  await expect(page.locator('input[type="date"]')).toBeVisible();
  const reads = await page.evaluate(
    () => (window as unknown as { __storageReads: string[] }).__storageReads,
  );
  expect(reads).toContain('ironcycle:preferences');
  expect(reads).not.toContain('ironcycle:data');
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
});
test('feedback diagnostics expose only three technical fields', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/workout');
  await page.getByRole('button', { name: 'Ещё', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Сообщить о проблеме' })).toBeDisabled();
  await page.getByRole('button', { name: 'Скопировать диагностику' }).click();
  const textarea = page.locator('.diagnostics-preview');
  await expect(textarea).toBeVisible();
  const value = JSON.parse(await textarea.inputValue());
  expect(Object.keys(value).sort()).toEqual(['browser', 'storage', 'version']);
  expect(value.version).toBe('1.1.0');
});

test('updated policy asks again without deleting existing profile records', async ({ page }) => {
  await page.goto('/#/workout');
  const original = await page.evaluate(() => {
    const raw = localStorage.getItem('ironcycle:data')!;
    const consent = JSON.parse(localStorage.getItem('ironcycle:consent')!);
    consent.versions.privacy = 'preview-1';
    localStorage.setItem('ironcycle:consent', JSON.stringify(consent));
    return raw;
  });
  await page.reload();
  await expect(page.locator('.consent-checkbox input')).toHaveCount(5);
  expect(await page.evaluate(() => localStorage.getItem('ironcycle:data'))).toBe(original);
  for (const input of await page.locator('.consent-checkbox input').all()) await input.check();
  await page.getByRole('button', { name: 'Отклонить необязательное', exact: true }).click();
  await page.getByRole('button', { name: 'Начать цикл', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Тренировка', exact: true })).toBeVisible();
  const current = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
  expect(current.profile).toEqual(JSON.parse(original).profile);
});
