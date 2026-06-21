/**
 * Style preset rows (borders / shadows) and the Settings "Scaling" knobs:
 * default detection, no cross-preset leftovers, single-undo-step semantics,
 * the shadow-strength encode/decode round-trip.
 */
import { test, expect } from '@playwright/test';
import { gotoClean, sideItem, readOverrides } from './helpers.js';

test('border presets: default active on clean slate, Pill keeps radius-scale live', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  await expect(page.locator('.presets__btn', { hasText: 'Rounded' })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.presets__btn', { hasText: 'Pill' }).click();
  const map = await readOverrides(page);
  expect(map['--sf-radius-m']).toBe('calc(20px * var(--sf-radius-scale))');
  expect(map['--sf-radius-l']).toBe('9999px');
  await page.keyboard.press('Control+z'); // ONE undo fully reverts the preset
  await expect(page.locator('.presets__btn', { hasText: 'Rounded' })).toHaveAttribute('aria-pressed', 'true');
});

test('shadow presets: switching leaves no leftovers from the previous preset', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Shadows').click();
  await expect(page.locator('.presets__btn', { hasText: 'Soft' })).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.presets__btn', { hasText: 'None' }).click();
  expect((await readOverrides(page))['--sf-shadow-m']).toBe('none');
  await page.locator('.presets__btn', { hasText: 'Strong' }).click();
  const map = await readOverrides(page);
  expect(map['--sf-shadow-m'], 'None must not mask Strong').toBeUndefined();
  expect(map['--sf-shadow-strength']).toBe('calc(0.16 + var(--sf-is-dark) * 0.17)');
});

test('hand-edited values show NO active preset (never a wrong one)', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Shadows').click();
  await page.locator('.presets__btn', { hasText: 'Strong' }).click();
  // Hand-edit --sf-shadow-strength to a value that differs from Strong,
  // deactivating it. The knob lives in the Settings "Scaling" group.
  const knob = page.locator('.knobs .knob', { hasText: '--sf-shadow-strength' });
  await knob.locator('input[type="number"]').fill('0.05');
  await knob.locator('input[type="number"]').press('Enter');
  await expect(page.locator('.presets__btn[aria-pressed="true"]')).toHaveCount(0);
});

test('scaling knobs live in Settings for scale domains, absent otherwise', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Spacing').click();
  const knobs = page.locator('.knobs');
  await expect(knobs).toBeVisible();
  const knob = knobs.locator('.knob', { hasText: '--sf-space-scale' });
  await knob.locator('input[type="number"]').fill('1.3');
  await knob.locator('input[type="number"]').press('Enter');
  expect((await readOverrides(page))['--sf-space-scale']).toBe('1.3');
  // Layout has no scaling knobs.
  await sideItem(page, 'Layout').click();
  await expect(page.locator('.knobs')).toHaveCount(0);
});

test('shadow-strength knob round-trips its dark-mode calc() encoding', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Shadows').click();
  const knob = page.locator('.knobs .knob', { hasText: '--sf-shadow-strength' });
  await knob.locator('input[type="number"]').fill('0.2');
  await knob.locator('input[type="number"]').press('Enter');
  expect((await readOverrides(page))['--sf-shadow-strength']).toBe('calc(0.2 + var(--sf-is-dark) * 0.17)');
  await expect(knob.locator('input[type="number"]')).toHaveValue('0.20');
});
