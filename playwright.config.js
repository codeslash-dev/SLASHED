import { defineConfig, devices } from '@playwright/test';

// Token + a11y regression suite. No dev server — fixtures load the built
// bundle / demo over file://. The framework leans on bleeding-edge CSS
// (oklch relative colour, @property inherits, light-dark()), all within the
// documented support floor for Chromium, Firefox, and WebKit — so the suite
// runs on all three.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    headless: true,
  },
  projects: [
    // Chromium runs the whole suite, including the pixel/geometry visual
    // regression (demo-visual.spec.js).
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // Firefox and WebKit validate cross-engine CSS *behaviour* (colour
    // resolution, a11y, states, container queries). The visual-regression
    // suite is excluded: its boundingBox/text-metric assertions depend on
    // engine font rendering and are intentionally pinned to one engine.
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /demo-visual\.spec\.js/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /demo-visual\.spec\.js/,
    },
  ],
});
