// @ts-check
// Behavioural tests for the .sf-card component (shipped in 0.7.0). Loads the
// components bundle and asserts the base surface, concentric radius, header/
// footer dividers, the --bordered/--elevated/--interactive modifiers, the
// nested-button font-size override, and the __media aspect ratio. Runs in both
// light and dark themes.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { renderWithBundle, NO_TRANSITIONS_STYLE } from './render-helpers.js';

// Components ship only in the full bundle (the optimal-components tier was
// retired when the bundle set was reduced to optimal + full).
const COMPONENTS_BUNDLE = path.join(process.cwd(), 'dist', 'slashed.full.css');

for (const theme of ['light', 'dark']) {
  test.describe(`.sf-card — ${theme} theme`, () => {
    async function mount(page, html) {
      await renderWithBundle(page, html, {
        bundle: COMPONENTS_BUNDLE,
        extraStyle: NO_TRANSITIONS_STYLE,
      });
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    }

    test('base card has padding, a border, a shadow, and a rounded outer radius', async ({ page }) => {
      await mount(page, `<article class="sf-card" id="t">Body</article>`);
      const cs = await page.evaluate(() => {
        const c = getComputedStyle(document.getElementById('t'));
        return {
          pad: parseFloat(c.paddingTop),
          border: parseFloat(c.borderTopWidth),
          shadow: c.boxShadow,
          radius: parseFloat(c.borderTopLeftRadius),
        };
      });
      expect(cs.pad).toBeGreaterThan(0);
      expect(cs.border).toBeGreaterThan(0);
      expect(cs.shadow).not.toBe('none');
      // Concentric: outer radius = inner radius (~8px) + padding, so clearly > 8.
      expect(cs.radius).toBeGreaterThan(12);
    });

    test('__header and __footer carry divider borders', async ({ page }) => {
      await mount(
        page,
        `<article class="sf-card">
           <header class="sf-card__header" id="h">H</header>
           <div class="sf-card__body">B</div>
           <footer class="sf-card__footer" id="f">F</footer>
         </article>`,
      );
      const [hb, fb] = await page.evaluate(() => [
        parseFloat(getComputedStyle(document.getElementById('h')).borderBottomWidth),
        parseFloat(getComputedStyle(document.getElementById('f')).borderTopWidth),
      ]);
      expect(hb).toBeGreaterThan(0);
      expect(fb).toBeGreaterThan(0);
    });

    test('--bordered keeps the border but drops the shadow', async ({ page }) => {
      await mount(page, `<article class="sf-card sf-card--bordered" id="t">Flat</article>`);
      const cs = await page.evaluate(() => {
        const c = getComputedStyle(document.getElementById('t'));
        return { border: parseFloat(c.borderTopWidth), shadow: c.boxShadow };
      });
      expect(cs.border).toBeGreaterThan(0);
      expect(cs.shadow).toBe('none');
    });

    test('--elevated keeps a shadow but hides the border', async ({ page }) => {
      await mount(page, `<article class="sf-card sf-card--elevated" id="t">Float</article>`);
      const cs = await page.evaluate(() => {
        const c = getComputedStyle(document.getElementById('t'));
        return { borderColor: c.borderTopColor, shadow: c.boxShadow };
      });
      expect(cs.shadow).not.toBe('none');
      expect(['rgba(0, 0, 0, 0)', 'transparent']).toContain(cs.borderColor);
    });

    test('--interactive is a pointer affordance', async ({ page }) => {
      await mount(page, `<article class="sf-card sf-card--interactive" id="t">Click</article>`);
      const cursor = await page.evaluate(
        () => getComputedStyle(document.getElementById('t')).cursor,
      );
      expect(cursor).toBe('pointer');
    });

    test('a nested .sf-btn shrinks relative to a standalone one', async ({ page }) => {
      await mount(
        page,
        `<button class="sf-btn" id="loose">Loose</button>
         <article class="sf-card">
           <button class="sf-btn" id="nested">Nested</button>
         </article>`,
      );
      const [loose, nested] = await page.evaluate(() =>
        ['loose', 'nested'].map((id) => parseFloat(getComputedStyle(document.getElementById(id)).fontSize)),
      );
      expect(nested).toBeLessThan(loose);
    });

    test('__media crops to a 16/9 aspect ratio', async ({ page }) => {
      await mount(
        page,
        `<article class="sf-card"><div class="sf-card__media" id="t"></div></article>`,
      );
      const ratio = await page.evaluate(() => {
        const el = document.getElementById('t');
        const r = el.getBoundingClientRect();
        return r.width / r.height;
      });
      expect(ratio).toBeCloseTo(16 / 9, 1);
    });

    test('__media has space before the element that follows it', async ({ page }) => {
      // Regression guard: __media previously had no margin-block-end, so it
      // touched __header (or __body, if there's no header) directly.
      await mount(
        page,
        `<article class="sf-card">
           <div class="sf-card__media" id="media"></div>
           <div class="sf-card__header" id="header">Title</div>
         </article>`,
      );
      const gap = await page.evaluate(() => {
        const media = document.getElementById('media').getBoundingClientRect();
        const header = document.getElementById('header').getBoundingClientRect();
        return header.top - media.bottom;
      });
      expect(gap).toBeGreaterThan(0);
    });
  });
}

// Nested/sectional data-theme scoping — separate from the light/dark describe
// blocks above (which set data-theme on :root, the common case). This checks
// the "data-theme works on any element" guarantee (docs/theming.md) for a
// card nested inside a non-root themed section, e.g. a themed <section> on an
// otherwise light page.
test.describe('.sf-card — nested data-theme scoping', () => {
  test('a card inside a non-root [data-theme="dark"] section matches that section, not :root', async ({ page }) => {
    // Root must be deterministically light — don't rely on Playwright's
    // default colorScheme, since core/themes.css auto-flips
    // :root:not([data-theme]) dark under prefers-color-scheme.
    await page.emulateMedia({ colorScheme: 'light' });
    await renderWithBundle(
      page,
      `<div id="scope" data-theme="dark">
         <article class="sf-card" id="card">
           <div class="sf-card__body"><p id="text">Body</p></div>
         </article>
       </div>`,
      { bundle: COMPONENTS_BUNDLE, extraStyle: NO_TRANSITIONS_STYLE },
    );
    // :root stays light (no data-theme there) — only the nested section opts into dark.
    // Canvas-luminance probe (shared technique with section-theme-aliases.spec.js)
    // avoids relying on oklch() showing up in getComputedStyle — some engines
    // serialize computed colors as rgb()/rgba() regardless of the authored syntax.
    const { cardBgLum, textLum } = await page.evaluate(() => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 1;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      const toLum = (color) => {
        ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      };
      return {
        cardBgLum: toLum(getComputedStyle(document.getElementById('card')).backgroundColor),
        textLum: toLum(getComputedStyle(document.getElementById('text')).color),
      };
    });
    // Regression guard: --sf-card-bg is a plain var(--sf-color-surface) alias
    // declared once at :root in optional/tokens.components.css. Without a
    // matching re-declaration scoped to nested [data-theme] elements, that
    // alias freezes at :root's (light) value and ignores the section's own
    // dark override, producing dark text on a light card. The card's own
    // background must read as dark (not stuck at the light ~0.96 value)...
    expect(cardBgLum).toBeLessThan(0.3);
    // ...and text must read as light (dark-theme text), not light-theme's dark text.
    expect(textLum).toBeGreaterThan(0.5);
  });
});
