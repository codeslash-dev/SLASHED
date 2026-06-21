/**
 * History: a chain of five mixed operations (two style presets, a scale
 * generator apply, a scaling knob, a theme preset) must unwind to the empty
 * state in exactly five undos and replay byte-for-byte in five redos.
 */
import { test, expect } from '@playwright/test';
import { gotoClean, sideItem, readOverrides, stableSnapshot } from './helpers.js';

test('5-step mixed chain unwinds and replays exactly', async ({ page }) => {
  await gotoClean(page);
  const snapshots = [stableSnapshot(await readOverrides(page))]; // state 0: {}

  // 1. Border preset
  await sideItem(page, 'Borders').click();
  await page.locator('.presets__btn', { hasText: 'Pill' }).click();
  snapshots.push(stableSnapshot(await readOverrides(page)));

  // 2. Shadow preset
  await sideItem(page, 'Shadows').click();
  await page.locator('.presets__btn', { hasText: 'Strong' }).click();
  snapshots.push(stableSnapshot(await readOverrides(page)));

  // 3. Type-scale apply
  await sideItem(page, 'Typography').click();
  const gen = page.locator('.card').first();
  await gen.locator('.gen__toggle').click();
  await gen.locator('.ctl', { hasText: 'Ratio (min)' }).locator('select:not([disabled])').selectOption('1.414');
  await gen.locator('button', { hasText: /Apply scale/ }).first().click();
  snapshots.push(stableSnapshot(await readOverrides(page)));

  // 4. Scaling knob (Settings "Scaling" group)
  await sideItem(page, 'Spacing').click();
  const knob = page.locator('.knobs .knob', { hasText: '--sf-space-scale' });
  await knob.locator('input[type="number"]').fill('1.3');
  await knob.locator('input[type="number"]').press('Enter');
  snapshots.push(stableSnapshot(await readOverrides(page)));

  // 5. Theme preset (wipes + replaces in one step)
  await sideItem(page, 'Themes').click();
  await page.locator('button', { hasText: 'Apply' }).nth(1).click();
  snapshots.push(stableSnapshot(await readOverrides(page)));

  // Unwind: each undo lands exactly on the previous snapshot.
  for (let i = snapshots.length - 2; i >= 0; i--) {
    await page.keyboard.press('Control+z');
    expect(stableSnapshot(await readOverrides(page)), `undo to state ${i}`).toBe(snapshots[i]);
  }
  // Replay: each redo lands exactly on the next snapshot.
  for (let i = 1; i < snapshots.length; i++) {
    await page.keyboard.press('Control+Shift+z');
    expect(stableSnapshot(await readOverrides(page)), `redo to state ${i}`).toBe(snapshots[i]);
  }
});

test('overrides persist across reload', async ({ page }) => {
  await gotoClean(page);
  await sideItem(page, 'Borders').click();
  await page.locator('.presets__btn', { hasText: 'Sharp' }).click();
  await page.reload();
  await sideItem(page, 'Borders').click();
  await expect(page.locator('.presets__btn', { hasText: 'Sharp' })).toHaveAttribute('aria-pressed', 'true');
});
