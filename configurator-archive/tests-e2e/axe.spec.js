/**
 * Automated accessibility audit (Workstream 4) — axe-core over the main routes
 * in both chrome themes.
 *
 * color-contrast is excluded here on purpose: the chrome's colours are the
 * framework's own --sf-* tokens, whose contrast is already enforced by the
 * framework's WCAG token tests (root tests/a11y.spec.js + the in-app WCAG tool).
 * This spec guards the structural a11y axe can check generically — roles, names,
 * landmarks, ARIA validity — across the configurator's panels.
 */
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { gotoClean, sideItem } from './helpers.js';

async function audit(page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules(['color-contrast'])
    .analyze();
  if (results.violations.length) {
    console.log(
      'axe violations:\n' +
        results.violations
          .map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
          .join('\n')
    );
  }
  return results.violations;
}

for (const theme of ['dark', 'light']) {
  test(`no structural a11y violations on the main routes (${theme})`, async ({ page }) => {
    await gotoClean(page);
    if (theme === 'light') {
      await page.locator('[aria-label="Toggle configurator theme"]').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    }

    // Overview (landing).
    expect(await audit(page)).toEqual([]);

    // Install panel (new bundle picker).
    await sideItem(page, 'Install').click();
    expect(await audit(page)).toEqual([]);

    // A token-editing domain panel.
    await sideItem(page, 'Colors').click();
    expect(await audit(page)).toEqual([]);
  });
}
