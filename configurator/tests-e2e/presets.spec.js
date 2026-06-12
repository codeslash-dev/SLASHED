/**
 * Style preset rows (Basic borders/shadows) and power knobs (Advanced):
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
  await sideItem(page, 'Borders').click();
  await page.locator('.presets__btn', { hasText: 'Pill' }).click();
  await page.keyboard.press('a');
  // Hand-edit one of the preset's tokens in Advanced search.
  await page.fill('#cfg-search', '--sf-radius-m');
  const row = page.locator('.row', { hasText: '--sf-radius-m' }).first();
  const input = row.locator('input[type="text"], input:not([type])').first();
  await input.fill('3px');
  await input.press('Enter');
  await page.fill('#cfg-search', '');
  await page.keyboard.press('b');
  await sideItem(page, 'Borders').click();
  await expect(page.locator('.presets__btn[aria-pressed="true"]')).toHaveCount(0);
});

test('power knobs live only in Advanced, collapsed at the panel bottom', async ({ page }) => {
  await gotoClean(page);
  for (const label of ['Colors', 'Typography', 'Spacing', 'Borders', 'Shadows']) {
    await sideItem(page, label).click();
    await expect(page.locator('.knobs'), `${label}: no knobs in Basic`).toHaveCount(0);
  }
  await page.keyboard.press('a');
  await sideItem(page, 'Spacing').click();
  const power = page.locator('details.power');
  await expect(power).toHaveCount(1);
  expect(await power.evaluate((el) => el.open)).toBe(false);
  await power.locator('summary').click();
  const knob = power.locator('.knob', { hasText: '--sf-space-scale' });
  await knob.locator('input[type="number"]').fill('1.3');
  await knob.locator('input[type="number"]').press('Enter');
  expect((await readOverrides(page))['--sf-space-scale']).toBe('1.3');
});

test('shadow-strength knob round-trips its dark-mode calc() encoding', async ({ page }) => {
  await gotoClean(page);
  await page.keyboard.press('a');
  await sideItem(page, 'Shadows').click();
  const power = page.locator('details.power');
  await power.locator('summary').click();
  const knob = power.locator('.knob', { hasText: '--sf-shadow-strength' });
  await knob.locator('input[type="number"]').fill('0.2');
  await knob.locator('input[type="number"]').press('Enter');
  expect((await readOverrides(page))['--sf-shadow-strength']).toBe('calc(0.2 + var(--sf-is-dark) * 0.17)');
  await expect(knob.locator('input[type="number"]')).toHaveValue('0.20');
});
