/**
 * Screenshot QA — captures every Studio domain at three viewport widths.
 *
 * Not part of the main regression suite (separate "screenshots" project in
 * playwright.config.js). Run with:
 *
 *   npx playwright test --project=screenshots --reporter=html
 *
 * Output: test-results/screenshots/<domain>-<width>.png  (27 files)
 */
import { test } from '@playwright/test';
import { gotoClean, sideItem } from './helpers.js';

const DOMAINS = ['Colors', 'Typography', 'Spacing', 'Layout', 'Borders', 'Shadows', 'Motion', 'Effects', 'Misc'];
const WIDTHS = [1280, 768, 390];

test.describe('Studio screenshot QA', () => {
  for (const domain of DOMAINS) {
    for (const width of WIDTHS) {
      test(`${domain} @ ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoClean(page);
        await sideItem(page, domain).click();
        await page.waitForLoadState('networkidle');
        await page.screenshot({
          path: `test-results/screenshots/${domain.toLowerCase()}-${width}.png`,
          fullPage: true,
        });
      });
    }
  }
});
