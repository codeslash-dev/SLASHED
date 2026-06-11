/**
 * Shell: Home landing, per-mode sidebar composition, mode/domain guards,
 * keyboard cycling — console-clean at desktop / narrow / phone widths.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem } from './helpers.js';

const BASIC_LABELS = ['Home', 'Colors', 'Typography', 'Spacing', 'Layout', 'Borders', 'Shadows', 'Themes'];
const ADVANCED_LABELS = ['Colors', 'Typography', 'Spacing', 'Layout', 'Borders', 'Shadows', 'Motion', 'Effects', 'WCAG', 'Themes', 'Misc', 'Cheatsheet'];

test('basic lands on Home with the setup checklist', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await expect(page.locator('.home__title')).toHaveText('Set up your design');
  await expect(page.locator('.side__item')).toHaveCount(BASIC_LABELS.length);
  await expect(page.locator('.home__row')).toHaveCount(7);
  // Clean slate: exactly one "start here" pointer, themes row reads "presets".
  await expect(page.locator('.home__count--start')).toHaveCount(1);
  await expect(page.locator('.home__row', { hasText: 'Themes' }).locator('.home__count')).toHaveText('presets');
  expect(errors).toEqual([]);
});

test('every destination renders console-clean in both modes at 3 widths', async ({ page }) => {
  const errors = watchErrors(page);
  for (const width of [1600, 1000, 480]) {
    await page.setViewportSize({ width, height: 900 });
    await gotoClean(page);
    for (const label of BASIC_LABELS) await sideItem(page, label).click();
    await page.keyboard.press('a');
    for (const label of ADVANCED_LABELS) await sideItem(page, label).click();
    await page.keyboard.press('b');
  }
  expect(errors).toEqual([]);
});

test('mode guards: home<->colors redirects, basic hides non-checklist domains', async ({ page }) => {
  await gotoClean(page);
  await page.keyboard.press('a');
  await expect(page.locator('.panel__title')).toHaveText('Colors');
  await sideItem(page, 'Motion').click();
  await page.keyboard.press('b');
  await expect(page.locator('.home__title')).toBeVisible();
  await expect(sideItem(page, 'Motion')).toHaveCount(0);
});

test('[ and ] cycle the mode-appropriate domain list with wrap-around', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await page.keyboard.press(']');
  await expect(page.locator('.panel__title')).toHaveText('Colors');
  await page.keyboard.press('[');
  await expect(page.locator('.home__title')).toBeVisible();
  await page.keyboard.press('['); // wraps backwards to Themes (tool)
  await expect(page.locator('main')).toContainText(/preset/i);
  // 20 forward presses in basic stay inside the checklist and end on a valid view
  for (let i = 0; i < 20; i++) await page.keyboard.press(']');
  await expect(page.locator('.side__item.side__item--on')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('rapid mode toggling never corrupts the active domain', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  for (let i = 0; i < 10; i++) await page.keyboard.press(i % 2 ? 'b' : 'a');
  await expect(page.locator('.side__item.side__item--on')).toHaveCount(1);
  expect(errors).toEqual([]);
});
