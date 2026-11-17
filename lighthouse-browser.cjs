module.exports = async (browser, { url }) => {
  const { readFile } = await import('node:fs/promises');
  const page = await browser.newPage();
  try {
    await page.goto(new URL('/', url).href);
    await page.evaluate(async () => {
      for (const registration of await globalThis.navigator.serviceWorker.getRegistrations())
        await registration.unregister();
      globalThis.localStorage.clear();
      for (const key of await globalThis.caches.keys()) await globalThis.caches.delete(key);
    });
    if (!url.endsWith('#/welcome')) {
      const fixture = JSON.parse(await readFile('artifacts/lighthouse-fixture.json', 'utf8'));
      await page.evaluate((data) => {
        for (const [key, value] of Object.entries(data))
          globalThis.localStorage.setItem(key, JSON.stringify(value));
      }, fixture);
    }
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCache');
    await client.detach();
  } finally {
    await page.close();
  }
};
