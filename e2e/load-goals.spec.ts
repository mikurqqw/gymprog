import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test('profile saves exercise targets, derives dates from the programme and edits goals', async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date('2026-11-15T12:00:00Z'));
  await page.goto('/#/profile');
  const card = page.locator('.load-goals');
  const exercise = card.getByRole('combobox', { name: 'Упражнение или тренажёр' });
  const weight = card.getByRole('spinbutton', { name: 'Желаемый вес (кг)' });
  const save = card.getByRole('button', { name: 'Сохранить цель' });
  const squat = card.locator('.load-goal').filter({ hasText: 'Присед соревновательный' });
  await exercise.selectOption('ex-0');
  await weight.fill('115');
  await save.click();
  await expect(squat).toContainText('По плану · завтра (16 ноября 2026 г.)');
  await page.setViewportSize({ width: 375, height: 900 });
  await card.screenshot({ path: 'artifacts/screenshots/ironcycle-load-goal-date.png' });
  await page.reload();
  await expect(squat).toContainText('115 кг');
  await squat.getByRole('button', { name: 'Изменить цель' }).click();
  await weight.fill('250');
  await save.click();
  await expect(squat).toContainText('Цель выше расчётных весов в плане');
  await exercise.selectOption('variant:strictCurl');
  await weight.fill('45');
  await save.click();
  await expect(
    card.locator('.load-goal').filter({ hasText: 'Строгий подъём на бицепс' }),
  ).toContainText('Этого варианта нет в текущем плане');
  await exercise.selectOption('custom:');
  await card
    .getByRole('textbox', { name: 'Название упражнения или тренажёра' })
    .fill('Жим ногами в зале');
  await weight.fill('160');
  await save.click();
  await expect(card.locator('.load-goal')).toHaveCount(3);
  await squat.getByRole('button', { name: 'Удалить' }).click();
  await expect(card.locator('.load-goal')).toHaveCount(2);
  for (const theme of ['dark', 'light']) {
    if ((await page.locator('html').getAttribute('data-theme')) !== theme)
      await page.locator('.app-header').getByRole('button', { name: /^Тема/ }).click();
    for (const width of [375, 768, 1280, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await card.screenshot({
        path: `artifacts/screenshots/ironcycle-load-goals-${width}-${theme}.png`,
      });
    }
    const report = await new AxeBuilder({ page }).include('.load-goals').analyze();
    expect(
      report.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious'),
    ).toEqual([]);
  }
});
