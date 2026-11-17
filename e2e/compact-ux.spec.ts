import { test, expect } from './fixtures';
import { journeyMessages } from './journeyMessages';
import AxeBuilder from '@axe-core/playwright';
for (const language of ['ru', 'kk', 'en'] as const)
  test(`compact profile and optional information ${language}`, async ({ page }) => {
    const t = journeyMessages(language);
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/?lang=' + language + '#/profile');
    const original = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
    await expect(
      page.getByLabel(t('bodyweight') + ' (' + t('kg') + ')', { exact: true }),
    ).toHaveValue('77');
    await page.getByRole('combobox', { name: t('experienceLevel'), exact: true }).selectOption('3');
    await page.getByLabel(t('height') + ' (' + t('cm') + ')', { exact: true }).fill('180');
    await page.getByRole('button', { name: t('save'), exact: true }).click();
    await expect(page.getByRole('status')).toContainText(t('saved'));
    await page.reload();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
    expect(saved.profile.height).toBe(180);
    expect(saved.profile.experience).toBe(4);
    expect({
      ...saved.profile,
      height: original.profile.height,
      experience: original.profile.experience,
    }).toEqual(original.profile);
    for (const key of ['logs', 'swaps', 'adjustments', 'shifts', 'customProgram'])
      expect(saved[key]).toEqual(original[key]);
    await page.goto('/?lang=' + language + '#/nutrition');
    const options = page.locator('details.compact-disclosure').filter({
      has: page.getByRole('combobox', { name: t('activity'), exact: true, includeHidden: true }),
    });
    await expect(options).not.toHaveAttribute('open');
    await options.locator('summary').first().focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('combobox', { name: t('activity'), exact: true, includeHidden: true }),
    ).toBeVisible();
    await page
      .getByRole('combobox', { name: t('activity'), exact: true, includeHidden: true })
      .selectOption('1.9');
    await options.locator('summary').first().click();
    await options.locator('summary').first().click();
    await expect(
      page.getByRole('combobox', { name: t('activity'), exact: true, includeHidden: true }),
    ).toHaveValue('1.9');
    const audit = await new AxeBuilder({ page }).analyze();
    expect(
      audit.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')),
    ).toEqual([]);
  });
