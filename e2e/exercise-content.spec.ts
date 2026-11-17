import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
test('specific exercise instruction, localized schematics and pending human review', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const language of ['ru', 'kk', 'en'])
    for (const theme of ['dark', 'light']) {
      await page.goto('/#/settings');
      await page.locator('main .form-grid select').nth(0).selectOption(language);
      await page.locator('main .form-grid select').nth(1).selectOption(theme);
      await page.goto('/#/library?exercise=ex-0');
      await expect(page.locator('.technique-illustration svg')).toBeVisible();
      await expect(page.locator('.exercise-review')).toBeVisible();
      const instruction = page.locator('details').filter({ has: page.locator('ol') });
      await expect(instruction).not.toHaveAttribute('open');
      await instruction.locator('summary').first().click();
      const steps = await page.locator('.exercise-detail ol li').count();
      expect(steps).toBeGreaterThanOrEqual(3);
      expect(steps).toBeLessThanOrEqual(5);
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      await page.screenshot({
        path: `artifacts/screenshots/exercise-ex0-${language}-${theme}.png`,
        fullPage: true,
        animations: 'disabled',
      });
      const result = await new AxeBuilder({ page }).analyze();
      expect(
        result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? '')),
      ).toEqual([]);
    }
  for (const exercise of ['ex-10', 'ex-5', 'ex-13', 'ex-14', 'ex-25']) {
    await page.goto('/#/library?exercise=' + exercise);
    await expect(page.locator('.technique-illustration svg')).toBeVisible();
    await page.locator('.technique-illustration').screenshot({
      path: `artifacts/screenshots/technique-${exercise}.png`,
      animations: 'disabled',
    });
  }
});
