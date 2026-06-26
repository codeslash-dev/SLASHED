import { defineConfig } from '@playwright/test';

const CROSS_ENGINE = ['**/shell.spec.js'];

export default defineConfig({
  testDir: './tests-e2e',
  timeout: 30_000,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
    viewport: { width: 1600, height: 1000 },
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  use: { browserName: 'firefox' },  testMatch: CROSS_ENGINE },
    { name: 'webkit',   use: { browserName: 'webkit' },   testMatch: CROSS_ENGINE },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
