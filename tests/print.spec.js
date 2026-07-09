// @ts-check
import { test, expect } from '@playwright/test';
import { BUNDLE } from './render-helpers.js';

/**
 * Print color preservation smoke test.
 *
 * Verifies that authored colours survive in print emulation after
 * the Phase 3 refactor (F-04 fix: no blanket background:transparent).
 */
test.describe('Print styles', () => {
  test('<mark> retains non-transparent background in print', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await page.setContent(`<p><mark>Highlighted text</mark></p>`);
    await page.addStyleTag({ path: BUNDLE });

    const bg = await page.locator('mark').evaluate(el =>
      getComputedStyle(el).backgroundColor
    );

    // background should NOT be transparent or empty
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
    expect(bg).toBeTruthy();
  });

  test('.no-print elements are hidden in print', async ({ page }) => {
    await page.setContent(`
      <div class="no-print" id="hidden-el">Should be hidden</div>
      <div id="visible-el">Should be visible</div>
    `);
    await page.addStyleTag({ path: BUNDLE });
    await page.emulateMedia({ media: 'print' });

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
    await page.setContent(`
      <div class="print-color-exact" style="background: rgb(100, 150, 200);">Coloured</div>
    `);
    await page.addStyleTag({ path: BUNDLE });
    await page.emulateMedia({ media: 'print' });

    const pca = await page.locator('.print-color-exact').evaluate(el =>
      getComputedStyle(el).getPropertyValue('print-color-adjust') ||
      getComputedStyle(el).getPropertyValue('-webkit-print-color-adjust')
    );

    expect(pca).toBe('exact');
  });

  // A1 (#582): --sf-print-page-size / -margin must actually reach the @page box.
  // page.pdf() is Chromium-only, so this geometry check runs there; the var()
  // fallbacks keep the default render identical on every engine.
  test('@page size reads --sf-print-page-size', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'page.pdf() is Chromium-only');

    // MediaBox is emitted in the PDF in points; extract the first page box.
    const boxOf = (buf) => {
      const s = buf.toString('latin1');
      const m = s.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
      return m ? { w: +m[3] - +m[1], h: +m[4] - +m[2] } : null;
    };

    // Default: token unset → a4 fallback (≈595×842pt).
    await page.setContent('<p>x</p>');
    await page.addStyleTag({ path: BUNDLE });
    const def = boxOf(await page.pdf({ preferCSSPageSize: true }));
    expect(def).not.toBeNull();
    expect(def.w).toBeCloseTo(595, -1);
    expect(def.h).toBeCloseTo(842, -1);

    // Override the token on :root → the @page size follows (letter ≈612×792pt),
    // proving var() is substituted inside the @page descriptor.
    await page.setContent('<style>:root{--sf-print-page-size:letter}</style><p>x</p>');
    await page.addStyleTag({ path: BUNDLE });
    const over = boxOf(await page.pdf({ preferCSSPageSize: true }));
    expect(over).not.toBeNull();
    expect(over.w).toBeCloseTo(612, -1);
    expect(over.h).toBeCloseTo(792, -1);
  });

  test('headings get static pt sizes, not the fluid vw-based scale', async ({ page }) => {
    await page.setContent(`<h1 id="h1">Title</h1><h6 id="h6">Subtitle</h6>`);
    await page.addStyleTag({ path: BUNDLE });
    await page.emulateMedia({ media: 'print' });

    const h1Size = await page.locator('#h1').evaluate(el => getComputedStyle(el).fontSize);
    const h6Size = await page.locator('#h6').evaluate(el => getComputedStyle(el).fontSize);

    // 24pt = 32px, 11pt ≈ 14.67px at 96dpi — static values, not vw-derived.
    expect(h1Size).toBe('32px');
    expect(parseFloat(h6Size)).toBeCloseTo(14.67, 1);
  });
});
