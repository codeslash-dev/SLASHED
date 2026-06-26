/**
 * Playwright config for the configurator's end-to-end regression suite.
 *
 * These specs pin the behaviors that unit tests can't reach (real cascade,
 * localStorage, keyboard, viewport transitions) — most of them are direct
 * regressions for bugs found during the IA-restructure QA sweeps.
 *
 * `npm run test:e2e` builds first (pretest:e2e) and Playwright then manages
 * the preview server itself via `webServer`.
 *
 * Cross-engine: the full suite runs on Chromium; the core behaviour specs plus
 * the dogfood/isolation contract also run on Firefox and WebKit, since the
 * chrome now relies on modern CSS (color-mix, light-dark, @property) that must
 * hold across engines.
 */
import { defineConfig } from '@playwright/test';

// Engine-sensitive specs worth running on every browser (kept lean so the
// cross-engine matrix stays fast and stable).
const CROSS_ENGINE = ['**/shell.spec.js', '**/share.spec.js', '**/dogfood.spec.js'];

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
    { name: 'chromium', use: { browserName: 'chromium' }, testIgnore: '**/screenshots.spec.js' },
    { name: 'firefox', use: { browserName: 'firefox' }, testMatch: CROSS_ENGINE },
    { name: 'webkit', use: { browserName: 'webkit' }, testMatch: CROSS_ENGINE },
    { name: 'screenshots', use: { browserName: 'chromium' }, testMatch: '**/screenshots.spec.js' },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
