const { defineConfig, devices } = require('@playwright/test');

// Token + a11y regression suite. No dev server — fixtures load the built
// bundle / demo over file://. The framework leans on bleeding-edge CSS
// (oklch relative colour, @property inherits, light-dark()), all within the
// documented support floor for Chromium, Firefox, and WebKit — so the suite
// runs on all three.
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
