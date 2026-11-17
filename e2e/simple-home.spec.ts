import { test, expect } from './fixtures';
import { journeyMessages } from './journeyMessages';
import { fixtureProfile } from '../src/lib/schema';
for (const language of ['ru', 'kk', 'en'] as const)
  test(`compact home keeps stop reasons visible outside optional hints ${language}`, async ({
    page,
  }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/checkin');
    await page.getByLabel(t('day'), { exact: true }).fill(fixtureProfile.start);
    await page.getByLabel(t('pain'), { exact: true }).selectOption('sharp');
    await page
      .locator('#checkin-form')
      .getByRole('button', { name: t('save'), exact: true })
      .click();
    await page.goto('/?lang=' + language + '#/');
    const readiness = page.locator('.compact-readiness');
    await expect(readiness.locator('.notice.danger')).toBeVisible();
    await expect(readiness.locator('.notice.danger')).toContainText(t('redText'));
    await expect(readiness.locator('.notice.danger')).toContainText(t('stopPain'));
    await expect(readiness.locator('details')).not.toHaveAttribute('open');
    await expect(page.locator('.home-week')).not.toBeVisible();
  });
