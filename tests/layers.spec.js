// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * Layer ordering invariant test.
 *
 * Verifies that slashed.themes beats slashed.components on the same
 * specificity — per the @layer declaration in core/layers.css.
 */
test.describe('Layer ordering', () => {
  test('slashed.themes wins over slashed.components at equal specificity', async ({ page }) => {
    await page.setContent(`
      <style>
        @layer slashed.components { .layer-check { color: rgb(255, 0, 0); } }
        @layer slashed.themes     { .layer-check { color: rgb(0, 128, 0); } }
      </style>
      <div class="layer-check">test</div>
    `);
    await page.addStyleTag({ path: path.join(process.cwd(), 'dist', 'slashed.essential.css') });

    const color = await page.locator('.layer-check').evaluate(el =>
      getComputedStyle(el).color
    );
    expect(color).toBe('rgb(0, 128, 0)');
  });

  test('slashed.states wins over slashed.utilities at equal specificity', async ({ page }) => {
    await page.setContent(`
      <style>
        @layer slashed.utilities { .layer-check-2 { opacity: 0.1; } }
        @layer slashed.states    { .layer-check-2 { opacity: 0.9; } }
      </style>
      <div class="layer-check-2">test</div>
    `);
    await page.addStyleTag({ path: path.join(process.cwd(), 'dist', 'slashed.essential.css') });

    const opacity = await page.locator('.layer-check-2').evaluate(el =>
      getComputedStyle(el).opacity
    );
    expect(opacity).toBe('0.9');
  });

  test('slashed.motion wins over slashed.themes at equal specificity', async ({ page }) => {
    await page.setContent(`
      <style>
        @layer slashed.themes { .layer-check-3 { opacity: 0.2; } }
        @layer slashed.motion { .layer-check-3 { opacity: 0.8; } }
      </style>
      <div class="layer-check-3">test</div>
    `);
    await page.addStyleTag({ path: path.join(process.cwd(), 'dist', 'slashed.essential.css') });

    const opacity = await page.locator('.layer-check-3').evaluate(el =>
      getComputedStyle(el).opacity
    );
    expect(opacity).toBe('0.8');
  });
});
