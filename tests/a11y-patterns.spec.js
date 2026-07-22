// @ts-check
// Tests for core/accessibility.css utility patterns:
//   .sr-only, .sr-only-focusable, .skip-link,
//   .sf-focus-parent, .sf-clickable-parent,
//   touch-target token, forced-colors, disabled cursor.
import { test, expect } from '@playwright/test';
import { renderWithBundle, NO_TRANSITIONS_STYLE } from './render-helpers.js';

async function setup(page, html) {
  // Disable transitions so computed property reads are stable (no mid-animation values).
  await renderWithBundle(page, html, { width: 800, height: 600, extraStyle: NO_TRANSITIONS_STYLE });
}

// ── .sr-only ────────────────────────────────────────────────────
test.describe('a11y: .sr-only', () => {
  test('renders at 1×1 px, absolutely positioned, clipped', async ({ page }) => {
    await setup(page, `<span id="t" class="sr-only">hidden label</span>`);
    const cs = await page.locator('#t').evaluate(el => {
      const s = getComputedStyle(el);
      return {
        w:         s.width,
        h:         s.height,
        pos:       s.position,
        overflow:  s.overflow,
        clipPath:  s.clipPath,
        whiteSpace: s.whiteSpace,
      };
    });
    expect(cs.w).toBe('1px');
    expect(cs.h).toBe('1px');
    expect(cs.pos).toBe('absolute');
    expect(['hidden', 'clip']).toContain(cs.overflow);
    expect(cs.clipPath).toContain('inset');
    expect(cs.whiteSpace).toBe('nowrap');
  });

  test('stays in the DOM (not display:none)', async ({ page }) => {
    await setup(page, `<span id="t" class="sr-only">label</span>`);
    const display = await page.locator('#t').evaluate(el => getComputedStyle(el).display);
    expect(display).not.toBe('none');
  });
});

// ── .sr-only-focusable ──────────────────────────────────────────
test.describe('a11y: .sr-only-focusable', () => {
  test('is hidden (1px) when not focused', async ({ page }) => {
    await setup(page, `<a id="t" href="#" class="sr-only-focusable">Skip</a>`);
    const cs = await page.locator('#t').evaluate(el => ({
      w: getComputedStyle(el).width,
      h: getComputedStyle(el).height,
    }));
    expect(cs.w).toBe('1px');
    expect(cs.h).toBe('1px');
  });

  test('becomes visible when focused', async ({ page }) => {
    await setup(page, `<a id="t" href="#" class="sr-only-focusable">Skip</a>`);
    await page.locator('#t').focus();
    // getBoundingClientRect gives rendered size; getComputedStyle.width is "auto" for inline.
    const cs = await page.locator('#t').evaluate(el => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });
    expect(cs.w).toBeGreaterThan(1);
    expect(cs.h).toBeGreaterThan(1);
  });
});

// ── .skip-link ──────────────────────────────────────────────────
test.describe('a11y: .skip-link', () => {
  test('starts off-screen (negative top, outside viewport)', async ({ page }) => {
    await setup(page, `<a id="t" href="#main" class="skip-link">Skip</a><main id="main"></main>`);
    // getComputedStyle resolves top:-100% to pixels; verify it is off-screen (negative).
    const top = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).top));
    expect(top).toBeLessThan(-10);
  });

  test('moves into viewport on focus', async ({ page }) => {
    await setup(page, `<a id="t" href="#main" class="skip-link">Skip</a><main id="main"></main>`);
    await page.locator('#t').focus();
    const top = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).top));
    expect(top).toBeGreaterThanOrEqual(0);
  });
});

// ── .sf-focus-parent ────────────────────────────────────────────
test.describe('a11y: .sf-focus-parent', () => {
  test('outline is none before focus', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-focus-parent">
        <input id="inp" type="text">
      </div>
    `);
    const style = await page.locator('#t').evaluate(el => getComputedStyle(el).outlineStyle);
    expect(style).toBe('none');
  });

  test('shows outline when child is focused', async ({ page }) => {
    await setup(page, `
      <div id="t" class="sf-focus-parent">
        <input id="inp" type="text">
      </div>
    `);
    await page.locator('#inp').focus();
    const style = await page.locator('#t').evaluate(el => getComputedStyle(el).outlineStyle);
    expect(style).not.toBe('none');
  });
});

// ── .sf-clickable-parent ────────────────────────────────────────
test.describe('a11y: .sf-clickable-parent', () => {
  test('container is position:relative with cursor:pointer', async ({ page }) => {
    await setup(page, `
      <article id="t" class="sf-clickable-parent">
        <h3><a href="#">Title</a></h3>
      </article>
    `);
    const cs = await page.locator('#t').evaluate(el => ({
      pos:    getComputedStyle(el).position,
      cursor: getComputedStyle(el).cursor,
    }));
    expect(cs.pos).toBe('relative');
    expect(cs.cursor).toBe('pointer');
  });

  test('buttons inside are elevated above the overlay (position:relative)', async ({ page }) => {
    await setup(page, `
      <article class="sf-clickable-parent">
        <h3><a href="#">Title</a></h3>
        <button id="btn">Action</button>
      </article>
    `);
    const pos = await page.locator('#btn').evaluate(el => getComputedStyle(el).position);
    expect(pos).toBe('relative');
  });

  test('[data-overlay-link] explicit mode: secondary links are elevated', async ({ page }) => {
    await setup(page, `
      <article class="sf-clickable-parent">
        <h3><a href="#" data-overlay-link>Title</a></h3>
        <a id="secondary" href="#">Category</a>
      </article>
    `);
    const pos = await page.locator('#secondary').evaluate(el => getComputedStyle(el).position);
    expect(pos).toBe('relative');
  });

  test('[data-no-overlay] element is elevated', async ({ page }) => {
    await setup(page, `
      <article class="sf-clickable-parent">
        <h3><a href="#">Title</a></h3>
        <span id="no-ov" data-no-overlay>opt-out</span>
      </article>
    `);
    const pos = await page.locator('#no-ov').evaluate(el => getComputedStyle(el).position);
    expect(pos).toBe('relative');
  });

  test('shows card-level focus ring on focus-within', async ({ page }) => {
    await setup(page, `
      <article id="card" class="sf-clickable-parent">
        <h3><a id="link" href="#">Title</a></h3>
      </article>
    `);
    await page.locator('#link').focus();
    const style = await page.locator('#card').evaluate(el => getComputedStyle(el).outlineStyle);
    expect(style).not.toBe('none');
  });
});

// ── Disabled cursor ─────────────────────────────────────────────
test.describe('a11y: disabled cursor', () => {
  test('[disabled] gets cursor: not-allowed', async ({ page }) => {
    await setup(page, `<button id="t" disabled>Disabled</button>`);
    const cursor = await page.locator('#t').evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('not-allowed');
  });

  test('[aria-disabled="true"] gets cursor: not-allowed', async ({ page }) => {
    await setup(page, `<div id="t" aria-disabled="true">Disabled</div>`);
    const cursor = await page.locator('#t').evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('not-allowed');
  });
});

// ── Touch-target token ──────────────────────────────────────────
test.describe('a11y: touch target token', () => {
  test('--sf-touch-target resolves to ≥ 44px', async ({ page }) => {
    await setup(page, `<button>x</button>`);
    // Resolve via an element so rem/clamp() values are computed to pixels.
    const px = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.width = 'var(--sf-touch-target)';
      document.body.appendChild(el);
      const v = parseFloat(getComputedStyle(el).width);
      el.remove();
      return v;
    });
    expect(px).toBeGreaterThanOrEqual(44);
  });

  // .sf-touch-target — explicit opt-in for a classed control the automatic
  // class-less floor no longer reaches. Not gated to a coarse pointer, so it
  // enforces the 44px hit area here on a normal (fine) pointer too.
  test('.sf-touch-target enforces a ≥44px hit area on both axes on a classed control', async ({ page }) => {
    await setup(page, `<button id="t" class="my-toggle sf-touch-target"
                               style="inline-size:20px;block-size:20px;padding:0">x</button>`);
    const box = await page.locator('#t').evaluate(el => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });
    expect(box.w).toBeGreaterThanOrEqual(44);
    expect(box.h).toBeGreaterThanOrEqual(44);
  });

  // A single class (0,1,0) — a component rule can still override it without
  // !important, so a specific control can opt back out.
  test('.sf-touch-target is overridable by a plain class rule (no !important)', async ({ page }) => {
    await setup(page, `<style>.small{min-block-size:20px;min-inline-size:20px}</style>
                       <button id="t" class="sf-touch-target small"
                               style="inline-size:20px;block-size:20px;padding:0">x</button>`);
    const box = await page.locator('#t').evaluate(el => {
      const r = el.getBoundingClientRect();
      return { w: r.width, h: r.height };
    });
    expect(box.w).toBeLessThan(44);
    expect(box.h).toBeLessThan(44);
  });

  // #582: the WCAG floor must NOT track the configurable --sf-size-* scale.
  // Shrinking a size rung must not drag the touch target below spec.
  test('--sf-touch-target is independent of the --sf-size-* scale', async ({ page }) => {
    await setup(page, `<button>x</button>`);
    const px = await page.evaluate(() => {
      const el = document.createElement('div');
      // Retune the size scale hard: if the touch target were an alias of a rung
      // it would collapse with it.
      el.style.setProperty('--sf-size-l', '10px');
      el.style.setProperty('--sf-size-m', '8px');
      el.style.width = 'var(--sf-touch-target)';
      document.body.appendChild(el);
      const v = parseFloat(getComputedStyle(el).width);
      el.remove();
      return v;
    });
    expect(px).toBeGreaterThanOrEqual(44);
  });
});

// ── Focus ring (:focus-visible) ─────────────────────────────────
test.describe('a11y: focus ring', () => {
  test(':focus:not(:focus-visible) has no outline', async ({ page }) => {
    // Verify the rule is declared. Check style.outlineStyle rather than cssText
    // because WebKit serialises "outline: none" as "outline: medium" in cssText.
    await setup(page, `<button id="t">Focus me</button>`);
    const hasRule = await page.evaluate(() => {
      const isTargetRule = r =>
        r.selectorText === ':focus:not(:focus-visible)' &&
        r.style && r.style.outlineStyle === 'none';
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (isTargetRule(rule)) return true;
            // Rules may live one level deep inside @layer blocks.
            if (rule.cssRules) {
              for (const nested of rule.cssRules) {
                if (isTargetRule(nested)) return true;
              }
            }
          }
        } catch {}
      }
      return false;
    });
    expect(hasRule).toBe(true);
  });

  test(':focus-visible outline uses --sf-focus-ring-width (non-zero)', async ({ page }) => {
    await setup(page, `<button id="t">Focus me</button>`);
    await page.locator('#t').focus();
    const ow = await page.locator('#t').evaluate(el =>
      parseFloat(getComputedStyle(el).outlineWidth)
    );
    expect(ow).toBeGreaterThan(0);
  });

  test('focus ring color token resolves to a non-transparent color', async ({ page }) => {
    await setup(page, `<button>x</button>`);
    const color = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--sf-focus-ring-color').trim()
    );
    expect(color).toBeTruthy();
    expect(color.toLowerCase()).not.toBe('transparent');
    expect(color.toLowerCase()).not.toBe('rgba(0, 0, 0, 0)');
  });
});

// ── Reduced motion !important hardening ─────────────────────────
test.describe('a11y: reduced-motion hardening', () => {
  test('transition-duration is forced to 0.01ms under prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await setup(page, `<div id="t" style="transition: opacity 2s">x</div>`);
    const dur = await page.locator('#t').evaluate(el =>
      parseFloat(getComputedStyle(el).transitionDuration)
    );
    // 0.01ms = 0.00001s → should be ≤ 0.001s (1ms)
    expect(dur).toBeLessThanOrEqual(0.001);
  });

  test('animation-duration is forced to 0.01ms under prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await setup(page, `<div id="t" style="animation: spin 2s infinite">x</div>`);
    const dur = await page.locator('#t').evaluate(el =>
      parseFloat(getComputedStyle(el).animationDuration)
    );
    expect(dur).toBeLessThanOrEqual(0.001);
  });
});

// ── Forced colors ────────────────────────────────────────────────
test.describe('a11y: forced-colors', () => {
  test('form controls get a border in forced-colors mode (Chromium only)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
    await page.emulateMedia({ forcedColors: 'active' });
    await setup(page, `<input id="t" type="text">`);
    const bw = await page.locator('#t').evaluate(el =>
      parseFloat(getComputedStyle(el).borderBlockStartWidth)
    );
    expect(bw).toBeGreaterThan(0);
  });

  test('focus ring uses Highlight system colour in forced-colors (Chromium only)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
    await page.emulateMedia({ forcedColors: 'active' });
    await setup(page, `<div>x</div>`);
    const color = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--sf-focus-ring-color').trim()
    );
    expect(color).toBe('Highlight');
  });

  test('decorative shadows are removed in forced-colors (Chromium only)', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'forced-colors emulation is Chromium-only');
    await page.emulateMedia({ forcedColors: 'active' });
    await setup(page, `<div id="t" style="box-shadow: 0 4px 8px rgba(0,0,0,0.3)">x</div>`);
    const shadow = await page.locator('#t').evaluate(el => getComputedStyle(el).boxShadow);
    expect(shadow).toBe('none');
  });
});
