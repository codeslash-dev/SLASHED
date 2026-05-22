// @ts-check
// Automated accessibility audit of the demo page with axe-core.
// Catches WCAG regressions (contrast, ARIA, landmarks) in both themes.
const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');
const path = require('path');
const { pathToFileURL } = require('url');

// A focused fixture exercising real framework usage with correct semantics
// (labelled forms, heading order, landmarks). The kitchen-sink demo.html
// intentionally contains low-contrast helper text and unlabelled control
// samples, so it is not a fair axe target; this fixture is.
const DEMO_URL = pathToFileURL(path.resolve(__dirname, 'a11y-fixture.html')).href;

for (const theme of ['light', 'dark']) {
  test(`axe: no WCAG A/AA violations (${theme})`, async ({ page }) => {
    await page.goto(DEMO_URL);
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

    // Ensure fonts and the stylesheet are fully applied before axe samples
    // colours, so the audit is deterministic regardless of parallel-run load
    // (otherwise axe can briefly read unstyled defaults under heavy CPU).
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.waitForFunction(() => {
      const bg = getComputedStyle(document.body).backgroundColor;
      return bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length) {
      console.log(
        `axe (${theme}) violations:\n` +
        results.violations
          .map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
          .join('\n')
      );
    }
    expect(results.violations).toEqual([]);
  });
}
