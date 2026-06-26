/**
 * Shell: basic load, sidebar navigation, header controls — console-clean.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, navButton } from './helpers.js';

const NAV_LABELS = [
  'Home', 'Colors', 'Typography', 'Spacing', 'Layout',
  'Borders', 'Shadows', 'Motion', 'Effects', 'Misc',
  'Themes', 'WCAG', 'Install', 'Classes',
];

test('loads with the SLASHED Studio branding', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await expect(page.locator('header')).toContainText('SLASHED Studio');
  await expect(page.locator('nav')).toBeVisible();
  expect(errors).toEqual([]);
});

test('all sidebar nav destinations are present', async ({ page }) => {
  await gotoClean(page);
  for (const label of NAV_LABELS) {
    await expect(navButton(page, label)).toBeVisible();
  }
});

test('clicking sidebar items switches the panel heading', async ({ page }) => {
  await gotoClean(page);
  for (const label of ['Colors', 'Typography', 'Spacing']) {
    await navButton(page, label).click();
    await expect(page.locator('[data-testid="panel-heading"]')).toContainText(label, { ignoreCase: true });
  }
});

test('undo and redo buttons start disabled', async ({ page }) => {
  await gotoClean(page);
  await expect(page.getByTitle('Undo (Ctrl+Z)')).toBeDisabled();
  await expect(page.getByTitle('Redo (Ctrl+Shift+Z)')).toBeDisabled();
});

test('reset-all button starts disabled', async ({ page }) => {
  await gotoClean(page);
  await expect(page.getByTitle('Reset all overrides')).toBeDisabled();
});

test('share button copies a URL to clipboard', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Clipboard permissions only supported in Chromium');
  await gotoClean(page);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByTitle('Copy share link').click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('http');
});
