import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { diaryStrings } from '../src/i18n/diaryStrings';
import { journeyMessages } from './journeyMessages';
for (const language of ['ru', 'kk', 'en'] as const)
  test(`primary recovery, pain regions and profile-backed measurements ${language}`, async ({
    page,
  }) => {
    const base = journeyMessages(language),
      t = (key: string) => diaryStrings[key]?.[language] ?? base(key);
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto('/?lang=' + language + '#/checkin');
    const quality = page.getByRole('group', { name: t('quality'), exact: true });
    await expect(quality).toBeVisible();
    await quality.getByRole('button', { name: '4', exact: true }).click();
    await page.getByRole('button', { name: t('region_wrist'), exact: true }).click();
    await page.getByRole('button', { name: t('region_forearm'), exact: true }).click();
    expect(await page.getByLabel(t('painLocationNote'), { exact: true }).inputValue()).toContain(
      t('region_wrist'),
    );
    const measurements = page
      .locator('details')
      .filter({ has: page.getByLabel(t('water'), { exact: true }) });
    await measurements.locator(':scope > summary').click();
    await expect(
      page.getByLabel(t('bodyweight') + ' (' + t('kg') + ')', { exact: true }),
    ).toHaveValue('77');
    await page.getByLabel(t('water'), { exact: true }).fill('2.1');
    await page
      .locator('#checkin-form')
      .getByRole('button', { name: t('save'), exact: true })
      .click();
    await page.reload();
    const saved = await page.evaluate(
      () => JSON.parse(localStorage.getItem('ironcycle:data')!).checkins,
    );
    expect(saved.at(-1)).toMatchObject({ quality: 4, water: 2.1, weight: 77 });
    expect(saved.at(-1).location).toContain(t('region_forearm'));
    await page.getByLabel(t('numbness'), { exact: true }).check();
    await expect(page.locator('.score.red')).toBeVisible();
    const audit = await new AxeBuilder({ page }).analyze();
    expect(
      audit.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')),
    ).toEqual([]);
  });
