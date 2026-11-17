import { test, expect } from './fixtures';
import { journeyMessages } from './journeyMessages';
import exercises from '../src/data/exercises.json' with { type: 'json' };
for (const language of ['ru', 'kk', 'en'] as const)
  test(`uncleared elbow and pain stop path ${language}`, async ({ page }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/injuries');
    await page.getByRole('button', { name: t('add'), exact: true }).click();
    const injuries = await page.evaluate(
      () => JSON.parse(localStorage.getItem('ironcycle:data')!).profile.injuryRecords,
    );
    expect(injuries).toHaveLength(1);
    expect(injuries[0]).toMatchObject({ area: 'elbow', side: 'left', cleared: false });
    await page.goto('/?lang=' + language + '#/workout');
    await expect(page.locator('h1')).toBeVisible();
    for (const name of await page.locator('.workout-line h2').allTextContents()) {
      const exercise = exercises.find((ex) => ex.name[language] === name);
      expect(exercise).toBeDefined();
      expect(exercise!.jointStress.elbow === 0 || exercise!.loadingSide === 'right').toBe(true);
    }
    await page.goto('/?lang=' + language + '#/checkin');
    await page
      .locator('details')
      .filter({ has: page.getByLabel(t('painScore'), { exact: true }) })
      .locator('summary')
      .first()
      .click();
    await page.getByLabel(t('painScore'), { exact: true }).fill('4');
    await expect(page.locator('.score.red')).toBeVisible();
    await expect(page.getByText(t('redText'), { exact: true })).toBeVisible();
    await page.locator('#checkin-form button[type="submit"]').click();
    expect(
      await page.evaluate(() =>
        JSON.parse(localStorage.getItem('ironcycle:data')!).checkins.some(
          (entry: { painScore?: number }) => entry.painScore === 4,
        ),
      ),
    ).toBe(true);
  });
