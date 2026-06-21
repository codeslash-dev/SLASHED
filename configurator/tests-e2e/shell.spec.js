/**
 * Shell: Home landing, per-mode sidebar composition, mode/domain guards,
 * keyboard cycling — console-clean at desktop / narrow / phone widths.
 */
import { test, expect } from '@playwright/test';
import { watchErrors, gotoClean, sideItem } from './helpers.js';

const BASIC_LABELS = ['Home', 'Colors', 'Typography', 'Spacing', 'Layout', 'Borders', 'Shadows', 'Themes', 'Install'];
const ADVANCED_LABELS = ['Colors', 'Typography', 'Spacing', 'Layout', 'Borders', 'Shadows', 'Motion', 'Effects', 'WCAG', 'Themes', 'Install', 'Misc', 'Cheatsheet'];

test('basic lands on Home with the setup checklist', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await expect(page.locator('.home__title')).toHaveText('Set up your design');
  await expect(page.locator('.side__item')).toHaveCount(BASIC_LABELS.length);
  await expect(page.locator('.home__row')).toHaveCount(8);
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
  await page.keyboard.press('['); // wraps backwards to the last basic domain (Install)
  await expect(page.locator('main')).toContainText(/install/i);
  // 20 forward presses in basic stay inside the checklist and end on a valid view
  for (let i = 0; i < 20; i++) await page.keyboard.press(']');
  await expect(page.locator('.side__item.side__item--on')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('mode, domain and output format persist across reload (validated restore)', async ({ page }) => {
  await gotoClean(page);
  await page.keyboard.press('a');
  await sideItem(page, 'Motion').click();
  await page.locator('.out [aria-label="Output format"] button', { hasText: ':root' }).click();
  await page.reload();
  await expect(page.locator('.panel__title')).toHaveText('Motion');
  await expect(page.locator('[aria-label="Complexity mode"] button', { hasText: 'Advanced' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.out [aria-label="Output format"] button', { hasText: ':root' })).toHaveAttribute('aria-pressed', 'true');
  // Corrupt prefs fall back to the defaults instead of crashing.
  await page.evaluate(() => localStorage.setItem('slashed-configurator/ui/v1', '{broken'));
  await page.reload();
  await expect(page.locator('.home__title')).toBeVisible();
});

test('rapid mode toggling never corrupts the active domain', async ({ page }) => {
  const errors = watchErrors(page);
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  for (let i = 0; i < 10; i++) await page.keyboard.press(i % 2 ? 'b' : 'a');
  const active = page.locator('.side__item.side__item--on');
  await expect(active).toHaveCount(1);
  // Borders is valid in both modes, so it must survive every toggle.
  await expect(active).toContainText('Borders');
  expect(errors).toEqual([]);
});
