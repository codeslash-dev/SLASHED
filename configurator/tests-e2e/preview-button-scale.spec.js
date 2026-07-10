/**
 * Regression guard for the "all button sizes look identical" bug.
 *
 * The live-preview iframe bakes the framework bundle (dist/slashed.full.css)
 * while the Controls live preview renders from source. When the baked bundle
 * went stale — or the .sf-btn--xs…xl size scale collapsed for any other reason
 * — the Components preview showed every XS…XL button at the same height even
 * though the framework CSS itself was correct. This test renders the real
 * Components gallery in the iframe and asserts the size scale is actually
 * visible: each step is strictly taller than the previous one.
 */
import { test, expect } from '@playwright/test';
import { gotoClean, navButton } from './helpers.js';

test('Components preview renders a visible XS→XL button size scale', async ({ page }) => {
  await gotoClean(page);

  // Switching the control panel to Components auto-follows the preview to the
  // Components gallery tab (App.svelte PANEL_TO_TAB auto-switch).
  await navButton(page, 'Components').click();

  const frame = page.frameLocator('iframe[title="SLASHED live preview"]');
  // section()'s data-pv-section scopes to the size-scale block, so we don't
  // pick up the size-s buttons used elsewhere (e.g. nested card buttons).
  const sizeButtons = frame.locator(
    'section[data-pv-section^="Size scale"] button.sf-btn',
  );
  await expect(sizeButtons).toHaveCount(5); // XS · Small · Default · Large · XL

  const heights = [];
  for (let i = 0; i < 5; i++) {
    const box = await sizeButtons.nth(i).boundingBox();
    expect(box, `size button ${i} should be laid out`).not.toBeNull();
    heights.push(box.height);
  }

  // Each rung strictly taller than the one before — a flat/stale bundle
  // collapses them to a single height and fails here.
  for (let i = 1; i < heights.length; i++) {
    expect(
      heights[i],
      `button #${i} (${heights[i]}px) should be taller than #${i - 1} (${heights[i - 1]}px)`,
    ).toBeGreaterThan(heights[i - 1]);
  }

  // And the XS→XL span is a real, human-visible difference, not sub-pixel drift.
  expect(heights[4] - heights[0]).toBeGreaterThan(20);
});
