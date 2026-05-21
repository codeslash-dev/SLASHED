// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Print color preservation smoke test.
 *
 * Verifies that authored colours survive in print emulation after
 * the Phase 3 refactor (F-04 fix: no blanket background:transparent).
 */
test.describe('Print styles', () => {
  test('<mark> retains non-transparent background in print', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await page.setContent(`
      <link rel="stylesheet" href="file://${process.cwd()}/dist/slashed.essential.css">
      <p><mark>Highlighted text</mark></p>
    `);

    const bg = await page.locator('mark').evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    // background should NOT be transparent or empty
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
    expect(bg).toBeTruthy();
  });

  test('.no-print elements are hidden in print', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await page.setContent(`
      <link rel="stylesheet" href="file://${process.cwd()}/dist/slashed.essential.css">
      <div class="no-print" id="hidden-el">Should be hidden</div>
      <div id="visible-el">Should be visible</div>
    `);

    const hiddenDisplay = await page.locator('#hidden-el').evaluate(el =>
      getComputedStyle(el).display
    );
    const visibleDisplay = await page.locator('#visible-el').evaluate(el =>
      getComputedStyle(el).display
    );

    expect(hiddenDisplay).toBe('none');
    expect(visibleDisplay).not.toBe('none');
  });

  test('.print-color-exact preserves background in print', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await page.setContent(`
      <link rel="stylesheet" href="file://${process.cwd()}/dist/slashed.essential.css">
      <div class="print-color-exact" style="background: rgb(100, 150, 200);">Coloured</div>
    `);

    const pca = await page.locator('.print-color-exact').evaluate(el =>
      getComputedStyle(el).getPropertyValue('print-color-adjust') ||
      getComputedStyle(el).getPropertyValue('-webkit-print-color-adjust')
    );

    expect(pca).toBe('exact');
  });
});
