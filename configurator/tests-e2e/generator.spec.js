/**
 * Fluid scale generators: scalar-writing (never baked clamp() steps),
 * the shared viewport range across ramps, resets and edge inputs.
 */
import { test, expect } from '@playwright/test';
import { gotoClean, sideItem, readOverrides } from './helpers.js';

const STEP_RE = /^--sf-(text|space)-(2xs|xs|s|m|l|xl|2xl|3xl|4xl)$/;
const APPLY = (gen) => gen.locator('button', { hasText: /Apply scale/ }).first();

test('type generator writes engine scalars only', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Typography').click();
  const gen = page.locator('.card').first();
  await gen.locator('.ctl', { hasText: 'Ratio (min)' }).locator('select:not([disabled])').selectOption('1.125');
  await APPLY(gen).click();
  const map = await readOverrides(page);
  expect(map['--sf-text-ratio-min']).toBe('1.125');
  for (const key of Object.keys(map)) {
    expect(key, 'no baked per-step clamp() in the export').not.toMatch(STEP_RE);
  }
});

test('display tab: ratio selects are read-only (shared with type)', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Typography').click();
  const display = page.locator('.card').nth(1);
  await expect(display.locator('select[disabled]')).toHaveCount(2);
  await expect(display.locator('.scales__hint').first()).toContainText('reuses the type scale');
});

test('viewport range is shared: space sets it, type seeds it, reset clears it', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Spacing').click();
  const space = page.locator('.card').first();
  await space.locator('.ctl', { hasText: 'Viewport max' }).locator('input').fill('100');
  await APPLY(space).click();
  expect((await readOverrides(page))['--sf-fluid-max-vw']).toBe('100');

  await sideItem(page, 'Typography').click();
  const type = page.locator('.card').first();
  await expect(type.locator('.ctl', { hasText: 'Viewport max' }).locator('input')).toHaveValue('100');
  // Re-applying with the seeded (unchanged) viewport must not clear it.
  await APPLY(type).click();
  expect((await readOverrides(page))['--sf-fluid-max-vw']).toBe('100');

  await type.locator('button', { hasText: 'Reset viewport range' }).click();
  const map = await readOverrides(page);
  expect(map['--sf-fluid-max-vw']).toBeUndefined();
  expect(map['--sf-fluid-min-vw']).toBeUndefined();
});

test('"Reset these" returns the ramp to framework defaults', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Spacing').click();
  const gen = page.locator('.card').first();
  await gen.locator('.ctl', { hasText: 'Base max' }).locator('input').fill('2.5');
  await APPLY(gen).click();
  expect((await readOverrides(page))['--sf-space-base-max']).toBe('2.5');
  await gen.locator('button', { hasText: 'Reset these' }).click();
  expect((await readOverrides(page))['--sf-space-base-max']).toBeUndefined();
});

test('edge inputs never persist garbage values', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Spacing').click();
  const gen = page.locator('.card').first();
  await gen.locator('.ctl', { hasText: 'Base min' }).locator('input').fill('-1');
  await gen.locator('.ctl', { hasText: 'Base max' }).locator('input').fill('0');
  await APPLY(gen).click();
  for (const [key, value] of Object.entries(await readOverrides(page))) {
    expect(value, `${key} must hold a real value`).not.toMatch(/^(?:|NaN|undefined|null)$/);
  }
});
