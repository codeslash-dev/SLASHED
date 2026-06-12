/**
 * Playwright config for the configurator's end-to-end regression suite.
 *
 * These specs pin the behaviors that unit tests can't reach (real cascade,
 * localStorage, keyboard, viewport transitions) — most of them are direct
 * regressions for bugs found during the IA-restructure QA sweeps.
 *
 * `npm run test:e2e` builds first (pretest:e2e) and Playwright then manages
 * the preview server itself via `webServer`. Chromium-only on purpose: the
 * suite tests the configurator app, not the framework's cross-engine CSS
 * (that lives in the root /tests Playwright suite).
 */
import { defineConfig } from '@playwright/test';

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
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
