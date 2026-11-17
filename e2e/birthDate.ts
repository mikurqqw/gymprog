import type { Page } from '@playwright/test';
import { journeyMessages, type JourneyLanguage } from './journeyMessages';
export async function chooseBirth(page: Page, date: string, language: JourneyLanguage = 'ru') {
  const t = journeyMessages(language),
    [year, month, day] = date.split('-');
  await page.getByRole('button', { name: t('birthDate'), exact: true }).click();
  const dialog = page.getByRole('dialog', { name: t('birthChoose'), exact: true });
  for (const [key, value] of [
    ['birthYear', year],
    ['birthMonth', month],
    ['birthDay', day],
  ])
    await dialog.getByRole('combobox', { name: t(key), exact: true }).selectOption(value);
  await dialog.getByRole('button', { name: t('birthApply'), exact: true }).click();
}
