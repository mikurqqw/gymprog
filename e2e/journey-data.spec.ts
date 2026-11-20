import { test, expect } from './fixtures';
import { journeyMessages } from './journeyMessages';
for (const language of ['ru', 'kk', 'en'] as const) {
  test(`replacement session/week/cycle and undo ${language}`, async ({ page }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/workout');
    for (const scope of ['session', 'week', 'cycle']) {
      const first = page.locator('.workout-line').first(),
        name = await first.locator('h2').innerText();
      await first.getByRole('button', { name: new RegExp(t('readMore')) }).click();
      await first.getByText(t('changeExercise'), { exact: true }).click();
      await first.getByLabel(t('replaceFor'), { exact: true }).selectOption(scope);
      await first.getByLabel(t('swap'), { exact: true }).selectOption({ index: 1 });
      await expect(first.locator('h2')).not.toHaveText(name);
      expect(
        await page.evaluate(
          () => Object.keys(JSON.parse(localStorage.getItem('ironcycle:data')!).swaps).length,
        ),
      ).toBeGreaterThan(0);
      await page.getByRole('button', { name: t('undo'), exact: true }).click();
      await expect(first.locator('h2')).toHaveText(name);
      await page.reload();
    }
  });
  test(`nutrition input, activity and notice ${language}`, async ({ page }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/nutrition');
    await page
      .locator('details')
      .filter({
        has: page.getByRole('combobox', { name: t('activity'), includeHidden: true, exact: true }),
      })
      .locator('summary')
      .first()
      .click();
    await page
      .getByRole('combobox', { name: t('activity'), includeHidden: true, exact: true })
      .selectOption('1.9');
    await page.getByRole('button', { name: t('save'), exact: true }).click();
    await expect(page.locator('.nutrition-stats')).toContainText('3475');
    const food = page.getByRole('combobox', { name: t('searchFood'), exact: true });
    await expect(food).toBeVisible();
    await page
      .locator('section[aria-label]')
      .filter({ has: food })
      .getByRole('button', { name: t('add'), exact: true })
      .click();
    expect(
      await page.evaluate(
        () => JSON.parse(localStorage.getItem('ironcycle:data')!).foodLogs.length,
      ),
    ).toBe(1);
    await expect(page.locator('.context-notice')).toBeVisible();
  });
  test(`legacy backup survives migration and language changes ${language}`, async ({ page }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/settings');
    const original = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
    const legacy = { ...original, version: 3 };
    delete legacy.themePreference;
    delete legacy.installHintDismissed;
    page.on('dialog', (d) => d.accept());
    await page
      .locator('input[type=file]')
      .first()
      .setInputFiles({
        name: 'legacy-v3.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(legacy)),
      });
    await expect(page.getByRole('status')).toContainText(t('saved'));
    await page.reload();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
    expect(state.profile).toEqual(original.profile);
    expect(state.version).toBe(6);
    await expect(page.locator('html')).toHaveAttribute('lang', legacy.language);
    await page
      .getByRole('combobox', { name: journeyMessages(legacy.language)('language'), exact: true })
      .selectOption(language);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', language);
    expect(
      await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!).profile),
    ).toEqual(original.profile);
  });
  test(`erase all data removes every application store ${language}`, async ({ page }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/nutrition');
    await expect(page.getByRole('combobox', { name: t('searchFood'), exact: true })).toBeVisible();
    await page.goto('/?lang=' + language + '#/privacy-consent');
    page.on('dialog', (d) => d.accept());
    await page.getByRole('button', { name: t('eraseAll'), exact: true }).click();
    await expect(page.locator('.birth-trigger')).toBeVisible();
    expect(
      await page.evaluate(() =>
        Object.keys(localStorage).filter((k) => k.startsWith('ironcycle:')),
      ),
    ).toEqual([]);
    expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
    expect(await page.evaluate(() => caches.keys())).toEqual([]);
    expect(await page.evaluate(() => navigator.serviceWorker.getRegistrations())).toEqual([]);
  });
}
