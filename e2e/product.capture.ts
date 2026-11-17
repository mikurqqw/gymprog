import { test } from './fixtures';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
test('capture actual product media from isolated demonstration fixtures', async ({ page }) => {
  await mkdir('public/screenshots', { recursive: true });
  for (const theme of ['dark', 'light']) {
    await page.goto('/#/settings');
    await page.getByRole('combobox', { name: 'Тема', exact: true }).selectOption(theme);
    await page.goto('/#/workout');
    await page.getByRole('button', { name: 'Фокус', exact: true }).click();
    await page.locator('.workout-focus').evaluate((element) => {
      element.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    const screenshot = await page.screenshot({ animations: 'disabled' });
    const webp = await page.evaluate(async (base64) => {
      const picture = new Image();
      picture.src = 'data:image/png;base64,' + base64;
      await picture.decode();
      const canvas = document.createElement('canvas');
      canvas.width = picture.width;
      canvas.height = picture.height;
      canvas.getContext('2d')!.drawImage(picture, 0, 0);
      return canvas.toDataURL('image/webp', 0.9).split(',')[1];
    }, screenshot.toString('base64'));
    await writeFile('public/screenshots/focus-' + theme + '.webp', Buffer.from(webp, 'base64'));
    if (theme === 'dark')
      await writeFile('public/screenshots/workout-narrow.webp', Buffer.from(webp, 'base64'));
  }
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/#/workout');
  const shot = await page.screenshot({ animations: 'disabled' });
  const wide = await page.evaluate(async (base64) => {
    const picture = new Image();
    picture.src = 'data:image/png;base64,' + base64;
    await picture.decode();
    const canvas = document.createElement('canvas');
    canvas.width = picture.width;
    canvas.height = picture.height;
    canvas.getContext('2d')!.drawImage(picture, 0, 0);
    return canvas.toDataURL('image/webp', 0.9).split(',')[1];
  }, shot.toString('base64'));
  await writeFile('public/screenshots/workout-wide.webp', Buffer.from(wide, 'base64'));
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.setContent(
    '<style>html,body{margin:0}svg{display:block;width:1200px;height:630px}</style>' +
      (await readFile('public/og.svg', 'utf8')),
  );
  await page.screenshot({ path: 'public/og.png', animations: 'disabled' });
});
