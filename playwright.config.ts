import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    locale: 'ru-RU',
    headless: true,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', channel: process.env.CI ? undefined : 'chrome' },
    },
    { name: 'firefox', testMatch: 'cross-browser.spec.ts', use: { browserName: 'firefox' } },
    { name: 'webkit', testMatch: 'cross-browser.spec.ts', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
