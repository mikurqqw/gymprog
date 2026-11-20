import { chooseBirth } from './birthDate';
import { test, expect } from '@playwright/test';
import { journeyMessages } from './journeyMessages';
for (const language of ['ru', 'kk', 'en'] as const)
  test(`entire first workout journey ${language}`, async ({ page }) => {
    test.setTimeout(120000);
    const t = journeyMessages(language),
      foreign: string[] = [];
    page.on('request', (r) => {
      if (new URL(r.url()).origin !== 'http://127.0.0.1:4173') foreign.push(r.url());
    });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/?lang=' + language + '#/welcome');
    await page
      .locator('.sf-hero')
      .getByRole('link', { name: t('landingStart'), exact: true })
      .click();
    await chooseBirth(page, '2000-01-01', language);
    await page.getByRole('button', { name: t('next'), exact: true }).click();
    for (const box of await page.locator('.consent-checkbox input').all()) await box.check();
    await page.getByRole('button', { name: t('rejectOptional'), exact: true }).click();
    await page.getByRole('button', { name: t('finish'), exact: true }).click();
    await page.getByRole('button', { name: t('screenAllNo'), exact: true }).click();
    await page.getByRole('button', { name: t('screenConfirm'), exact: true }).click();
    await page.getByRole('button', { name: t('sfApplyProgram'), exact: true }).click();
    await expect(page.getByLabel(t('age'), { exact: true })).toHaveValue(
      String(new Date().getFullYear() - 2000),
    );
    await page.getByLabel(t('age'), { exact: true }).fill('30');
    await page.getByLabel(t('height') + ' (' + t('cm') + ')', { exact: true }).fill('175');
    await page.getByLabel(t('bodyweight') + ' (' + t('kg') + ')', { exact: true }).fill('70');
    await page.getByRole('combobox', { name: t('sex'), exact: true }).selectOption('male');
    await page.getByRole('button', { name: t('next'), exact: true }).click();
    await expect(page.locator('.strength-entry')).toHaveCount(3);
    await page.getByRole('button', { name: t('next'), exact: true }).click();
    await page.getByRole('button', { name: t('finish'), exact: true }).click();
    const profile = await page.evaluate(
      () => JSON.parse(localStorage.getItem('ironcycle:data')!).profile,
    );
    expect(profile).toMatchObject({ age: 30, height: 175, weight: 70, sex: 'male', experience: 0 });
    await page.getByRole('link', { name: t('startWorkout'), exact: true }).click();
    const count = Number(
      (await page.locator('.focus-progress p').innerText()).split('/')[1].trim(),
    );
    for (let i = 0; i < count; i++) {
      for (const row of await page.locator('.focus-set').all()) {
        await row.getByRole('button', { name: t('focusSetDone'), exact: true }).click();
        await page
          .locator('.rest-timer')
          .getByRole('button', { name: t('stopTimer'), exact: true })
          .click();
      }
      if (i < count - 1)
        await page
          .locator('.focus-navigation')
          .getByRole('button', { name: t('next'), exact: true })
          .click();
    }
    await page
      .locator('.workout-result')
      .getByRole('button', { name: t('sfFinish'), exact: true })
      .click();
    await expect(page.getByRole('heading', { name: t('sfFinished'), exact: true })).toBeVisible();
    await page.goto('/?lang=' + language + '#/progress');
    await expect(page.locator('h1')).toBeVisible();
    await page
      .locator('main details')
      .filter({ has: page.locator('table') })
      .first()
      .locator('summary')
      .first()
      .click();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    const state = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
    expect(Object.keys(state.sessionCompletions)).toHaveLength(1);
    expect(state.logs.some((log: { sets: boolean[] }) => log.sets.some(Boolean))).toBe(true);
    expect(state.profile.strengthAssessment).toEqual({
      squat: 'unknown',
      bench: 'unknown',
      deadlift: 'unknown',
    });
    expect(foreign).toEqual([]);
  });

for (const language of ['ru', 'kk', 'en'] as const)
  test(`under18 stores nothing ${language}`, async ({ page }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/start');
    await chooseBirth(page, '2015-01-01', language);
    await page.getByRole('button', { name: t('next'), exact: true }).click();
    await expect(page.locator('.birth-trigger')).toHaveCount(0);
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
    expect(await page.evaluate(() => indexedDB.databases())).toEqual([]);
    expect(await page.evaluate(() => caches.keys())).toEqual([]);
  });
