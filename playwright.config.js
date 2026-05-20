const { defineConfig, devices } = require('@playwright/test');

// Token regression suite. No dev server — the fixture loads the built
// bundle over file://. Chromium only (relative color syntax + light-dark()
// + @property are all supported there).
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
