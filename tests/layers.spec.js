// @ts-check
import { test, expect } from '@playwright/test';
import path from 'node:path';

/**
 * Layer ordering invariant test.
 *
 * Verifies that the cascade order declared in core/layers.css is
 * actually honoured at runtime. The order (truncated for the rules
 * exercised here):
 *
 *   slashed.layout < slashed.components < slashed.macros
 *     < slashed.utilities < slashed.states < slashed.themes
 *     < slashed.motion < slashed.accessibility
 *
 * Each test stages two competing rules at the same specificity in
 * two layers, then asserts that the layer with the later position
 * in the @layer declaration wins.
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
    await page.addStyleTag({ path: path.join(process.cwd(), 'badges', 'slashed.optimal.css') });

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
    await page.addStyleTag({ path: path.join(process.cwd(), 'badges', 'slashed.optimal.css') });

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
    await page.addStyleTag({ path: path.join(process.cwd(), 'badges', 'slashed.optimal.css') });

    const opacity = await page.locator('.layer-check-3').evaluate(el =>
      getComputedStyle(el).opacity
    );
    expect(opacity).toBe('0.8');
  });

  test('slashed.macros wins over slashed.components at equal specificity', async ({ page }) => {
    // New layer in v0.3.0 — sits between components and utilities so
    // macros can compose on top of opt-in components.
    await page.setContent(`
      <style>
        @layer slashed.components { .layer-check-4 { color: rgb(200, 0, 0); } }
        @layer slashed.macros     { .layer-check-4 { color: rgb(0, 100, 200); } }
      </style>
      <div class="layer-check-4">test</div>
    `);
    await page.addStyleTag({ path: path.join(process.cwd(), 'badges', 'slashed.optimal.css') });

    const color = await page.locator('.layer-check-4').evaluate(el =>
      getComputedStyle(el).color
    );
    expect(color).toBe('rgb(0, 100, 200)');
  });

  test('slashed.utilities wins over slashed.macros at equal specificity', async ({ page }) => {
    // Single-property utilities must beat compound macros so a
    // .gap-0 utility can defeat .sf-flow > * + * margin-block-start.
    await page.setContent(`
      <style>
        @layer slashed.macros    { .layer-check-5 { opacity: 0.3; } }
        @layer slashed.utilities { .layer-check-5 { opacity: 0.7; } }
      </style>
      <div class="layer-check-5">test</div>
    `);
    await page.addStyleTag({ path: path.join(process.cwd(), 'badges', 'slashed.optimal.css') });

    const opacity = await page.locator('.layer-check-5').evaluate(el =>
      getComputedStyle(el).opacity
    );
    expect(opacity).toBe('0.7');
  });

  test('slashed.accessibility wins over slashed.motion at equal specificity', async ({ page }) => {
    // a11y rules are placed near the end of the cascade so they can
    // recover focus rings, sr-only positioning, and the relocated
    // .sf-focus-parent / .sf-clickable-parent patterns.
    await page.setContent(`
      <style>
        @layer slashed.motion        { .layer-check-6 { opacity: 0.2; } }
        @layer slashed.accessibility { .layer-check-6 { opacity: 0.95; } }
      </style>
      <div class="layer-check-6">test</div>
    `);
    await page.addStyleTag({ path: path.join(process.cwd(), 'badges', 'slashed.optimal.css') });

    const opacity = await page.locator('.layer-check-6').evaluate(el =>
      getComputedStyle(el).opacity
    );
    expect(opacity).toBe('0.95');
  });
});
