import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const [file, size, target] of [
    ['icon.svg', 192, 'icon-192.png'],
    ['icon.svg', 512, 'icon-512.png'],
    ['icon-maskable.svg', 512, 'icon-maskable-512.png'],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      '<style>html,body{margin:0}svg{display:block;width:100vw;height:100vh}</style>' +
        (await readFile('public/' + file, 'utf8')),
    );
    await page.screenshot({ path: 'public/' + target });
  }
} finally {
  await browser.close();
}
