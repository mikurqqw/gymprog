import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '../e2e',
  testMatch: 'product.capture.ts',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: process.env.CI ? undefined : 'chrome',
    locale: 'ru-RU',
    viewport: { width: 375, height: 812 },
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
});
