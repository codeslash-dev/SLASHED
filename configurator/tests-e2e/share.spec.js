/**
 * Shareable config URLs (Workstream 2): the URL fragment encodes the override
 * map, and opening that URL on a clean slate restores the exact configuration.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, readOverrides } from './helpers.js';

// Apply a deterministic override via the Import affordance (no fiddly slider
// drags), then assert the address bar fragment carries it.
async function importOverride(page, css) {
  await page.locator('.out__actions .cfg-btn', { hasText: 'Import…' }).click();
  await page.locator('.out__import .cfg-textarea').fill(css);
  await page.locator('.out__import .cfg-btn', { hasText: 'Apply import' }).click();
}

test('editing a token writes the config into the URL fragment', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await importOverride(page, ':root{--sf-radius-scale:0.5;}');
  // Hash sync is debounced (~400ms) — wait for it to land.
  await expect.poll(() => page.url()).toContain('#c=');
  expect(errors).toEqual([]);
});

test('opening a shared URL on a clean slate restores the overrides', async ({ page }) => {
  await gotoClean(page);
  await importOverride(page, ':root{--sf-radius-scale:0.5;}');
  await expect.poll(() => page.url()).toContain('#c=');

  // Simulate a fresh visitor: wipe storage, then reload the shared URL.
  // page.reload() is used instead of page.goto(shareUrl) because navigating
  // to the same URL (the hash sync already updated it) is a same-document
  // navigation in Chromium/Firefox — the JS modules don't reinitialise and
  // loadOverrides() never runs.  reload() always forces a full page load.
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect.poll(async () => (await readOverrides(page))['--sf-radius-scale']).toBe('0.5');
});

test('the Share button copies a link with the config fragment', async ({ page, browserName }) => {
  // Clipboard read is only reliably scriptable in Chromium under Playwright.
  test.skip(browserName !== 'chromium', 'clipboard read is chromium-only here');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await gotoClean(page);
  await importOverride(page, ':root{--sf-radius-scale:0.5;}');

  await page.locator('[aria-label="Copy shareable configuration link"]').click();
  await expect.poll(async () => await page.evaluate(() => navigator.clipboard.readText())).toContain('#c=');
});
