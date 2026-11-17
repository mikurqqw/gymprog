import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { chooseBirth } from './birthDate';
import { journeyMessages } from './journeyMessages';
for (const language of ['ru', 'kk', 'en'] as const)
  test(`birth picker cancel, validation and consent-only age transfer ${language}`, async ({
    page,
  }) => {
    const t = journeyMessages(language);
    await page.goto('/?lang=' + language + '#/start');
    const trigger = page.getByRole('button', { name: t('birthDate'), exact: true });
    await expect(page.getByRole('button', { name: t('next'), exact: true })).toBeDisabled();
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: t('birthChoose'), exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: t('birthApply'), exact: true })).toBeDisabled();
    await dialog.getByRole('combobox', { name: t('birthYear'), exact: true }).selectOption('2000');
    await dialog.getByRole('combobox', { name: t('birthMonth'), exact: true }).selectOption('02');
    await dialog.getByRole('combobox', { name: t('birthDay'), exact: true }).selectOption('29');
    await dialog.getByRole('combobox', { name: t('birthYear'), exact: true }).selectOption('2001');
    await expect(dialog.getByRole('combobox', { name: t('birthDay'), exact: true })).toHaveValue(
      '',
    );
    await expect(dialog.getByRole('button', { name: t('birthApply'), exact: true })).toBeDisabled();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toContainText(t('birthChoose'));
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
    await chooseBirth(page, '2000-01-01', language);
    await trigger.click();
    await dialog.getByRole('combobox', { name: t('birthYear'), exact: true }).selectOption('2001');
    await dialog.getByRole('button', { name: t('birthCancel'), exact: true }).click();
    await trigger.click();
    await expect(dialog.getByRole('combobox', { name: t('birthYear'), exact: true })).toHaveValue(
      '2000',
    );
    const audit = await new AxeBuilder({ page }).analyze();
    expect(
      audit.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')),
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: t('next'), exact: true }).click();
    expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
    for (const checkbox of await page.locator('.consent-checkbox input').all())
      await checkbox.check();
    await page.getByRole('button', { name: t('rejectOptional'), exact: true }).click();
    await page.getByRole('button', { name: t('finish'), exact: true }).click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('ironcycle:data')!));
    expect(saved.draftProfile.age).toBe(new Date().getFullYear() - 2000);
    expect(JSON.stringify(saved)).not.toContain('2000-01-01');
    expect(saved.profile).toBeNull();
  });
