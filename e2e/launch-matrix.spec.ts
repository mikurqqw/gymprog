import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
const routes = [
  '',
  'profile',
  'builder',
  'program',
  'workout',
  'checkin',
  'nutrition',
  'progress',
  'test',
  'library',
  'reference',
  'settings',
  'injuries',
  'privacy-consent',
  'start',
  'welcome',
  'catalog',
  'catalog/powerlifting',
  'demo',
  ...[
    'terms',
    'privacy',
    'storage',
    'medical',
    'ai',
    'advertising',
    'operator',
    'sources',
    'accessibility',
    'contact',
  ].map((id) => 'legal/' + id),
];
for (const language of ['ru', 'kk', 'en'])
  for (const theme of ['dark', 'light'])
    test(`route accessibility ${language} ${theme}`, async ({ page }) => {
      test.setTimeout(240000);
      await page.setViewportSize({ width: 375, height: 900 });
      await page.goto('/#/settings');
      await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption(theme);
      for (const route of routes) {
        await page.goto('/?lang=' + language + '#/' + route);
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('html')).toHaveAttribute('lang', language);
        const result = await new AxeBuilder({ page }).analyze();
        expect
          .soft(
            result.violations
              .filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))
              .map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
            route,
          )
          .toEqual([]);
        expect
          .soft(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            route,
          )
          .toBe(true);
      }
      await page.goto('/?lang=' + language + '#/workout');
      await page.locator('.mobile-tabs > button').click();
      await expect(page.locator('.more-sheet[open]')).toBeVisible();
      const menuAudit = await new AxeBuilder({ page }).analyze();
      expect(
        menuAudit.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')),
      ).toEqual([]);
    });
test('extended widths, landscape, zoom and requested review screenshots', async ({ page }) => {
  test.setTimeout(240000);
  for (const theme of ['dark', 'light']) {
    await page.goto('/#/settings');
    await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption(theme);
    for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['welcome', '', 'workout', 'nutrition']) {
        await page.goto('/#/' + route);
        await expect(page.locator('h1')).toBeVisible();
        if (route === 'workout')
          await page.getByRole('button', { name: 'Фокус', exact: true }).click();
        expect
          .soft(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            route + ':' + width,
          )
          .toBe(true);
        if ([320, 375, 768, 1280].includes(width)) {
          if (route === 'welcome')
            await page.locator('img').evaluateAll(async (imgs) => {
              for (const img of imgs) {
                img.loading = 'eager';
                await img.decode().catch(() => {});
              }
            });
          await page.screenshot({
            path: `artifacts/screenshots/launch-${route || 'home'}-${width}-${theme}.png`,
            fullPage: true,
            animations: 'disabled',
          });
        }
      }
      if (width < 768) {
        await page.getByRole('button', { name: 'Ещё', exact: true }).click();
        await expect(page.locator('.more-sheet[open]')).toBeVisible();
        if ([320, 375].includes(width))
          await page.screenshot({
            path: `artifacts/screenshots/launch-more-${width}-${theme}.png`,
            animations: 'disabled',
          });
        await page.keyboard.press('Escape');
      }
    }
    await page.setViewportSize({ width: 812, height: 375 });
    await page.goto('/#/workout');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/#/nutrition');
    await page.evaluate(() => {
      document.documentElement.style.zoom = '2';
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.evaluate(() => {
      document.documentElement.style.zoom = '';
    });
  }
});
