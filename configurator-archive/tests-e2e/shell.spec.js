/**
 * Shell: Overview landing, the flat (single-list) sidebar, the per-panel
 * "Show all variables" disclosure, keyboard cycling and persistence —
 * console-clean at desktop / narrow / phone widths.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem } from './helpers.js';

// Overview + the full domain taxonomy — every category is always reachable.
const NAV_LABELS = [
  'Overview', 'Colors', 'Typography', 'Spacing', 'Layout',
  'Borders', 'Shadows', 'Motion', 'Effects', 'WCAG', 'Themes', 'Install',
  'Misc', 'Cheatsheet',
];

test('lands on the Overview with the setup checklist', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await expect(page.locator('.home__title')).toHaveText('Set up your design');
  // The flat sidebar always shows Overview + every domain.
  await expect(page.locator('.side__item')).toHaveCount(NAV_LABELS.length);
  await expect(page.locator('.home__row')).toHaveCount(8);
  // Clean slate: exactly one "start here" pointer, themes row reads "presets".
  await expect(page.locator('.home__count--start')).toHaveCount(1);
  await expect(page.locator('.home__row', { hasText: 'Themes' }).locator('.home__count')).toHaveText('presets');
  expect(errors).toEqual([]);
});

test('every destination renders console-clean at 3 widths', async ({ page }) => {
  const errors = watchErrors(page);
  for (const width of [1600, 1000, 480]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoClean(page);
    for (const label of NAV_LABELS) await sideItem(page, label).click();
  }
  expect(errors).toEqual([]);
});

test('every category panel leads with Settings, with All variables collapsed below', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Colors').click();
  // Inputs-first: the Color Studio is visible before any raw catalogue.
  await expect(page.locator('.color-studio')).toBeVisible();
  // The full catalogue lives in a collapsed disclosure.
  const allvars = page.locator('details.allvars');
  await expect(allvars).toHaveCount(1);
  expect(await allvars.evaluate((el) => el.open)).toBe(false);
  await allvars.locator('summary').click();
  expect(await allvars.evaluate((el) => el.open)).toBe(true);
  await expect(allvars.locator('.allvars__body')).toBeVisible();
});

test('a domain with no curated Settings shows the catalogue inline', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Misc').click();
  // Misc has no curated inputs, so it never hides behind a disclosure.
  await expect(page.locator('details.allvars')).toHaveCount(0);
  await expect(page.locator('.allvars__filters')).toBeVisible();
});

test('[ and ] cycle Overview + every domain with wrap-around', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await page.keyboard.press(']');
  await expect(page.locator('.panel__title')).toHaveText('Colors');
  await page.keyboard.press('[');
  await expect(page.locator('.home__title')).toBeVisible();
  await page.keyboard.press('['); // wraps backwards to the last domain (Cheatsheet)
  await expect(page.locator('.side__item.side__item--on')).toHaveCount(1);
  await expect(page.locator('.side__item.side__item--on')).toContainText('Cheatsheet');
  expect(errors).toEqual([]);
});

test('domain and output format persist across reload (validated restore)', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Motion').click();
  await page.locator('.out [aria-label="Output format"] button', { hasText: ':root' }).click();
  await page.reload();
  await expect(page.locator('.panel__title')).toHaveText('Motion');
  await expect(page.locator('.out [aria-label="Output format"] button', { hasText: ':root' })).toHaveAttribute('aria-pressed', 'true');
  // Corrupt prefs fall back to the defaults instead of crashing.
  await page.evaluate(() => localStorage.setItem('slashed-configurator/ui/v1', '{broken'));
  await page.reload();
  await expect(page.locator('.home__title')).toBeVisible();
});

test('a legacy persisted mode field is ignored on restore', async ({ page }) => {
  await gotoClean(page);
  // Older app versions stored a complexity mode; the flat IA must ignore it
  // and still restore the saved domain cleanly.
  await page.evaluate(() =>
    localStorage.setItem('slashed-configurator/ui/v1', JSON.stringify({ mode: 'basic', domain: 'motion' }))
  );
  await page.reload();
  await expect(page.locator('.panel__title')).toHaveText('Motion');
});
