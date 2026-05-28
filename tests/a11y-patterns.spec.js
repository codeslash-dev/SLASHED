// @ts-check
// Tests for core/accessibility.css utility patterns:
//   .sr-only, .sr-only-focusable, .skip-link,
//   .sf-focus-parent, .sf-clickable-parent,
//   touch-target token, forced-colors, disabled cursor.
const { test, expect } = require('@playwright/test');
const path = require('path');

const BUNDLE = path.join(process.cwd(), 'dist', 'slashed.optimal.css');

async function setup(page, html) {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`);
  await page.addStyleTag({ path: BUNDLE });
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
    const cs = await page.locator('#t').evaluate(el => ({
      w: parseFloat(getComputedStyle(el).width),
      h: parseFloat(getComputedStyle(el).height),
    }));
    expect(cs.w).toBeGreaterThan(1);
    expect(cs.h).toBeGreaterThan(1);
  });
});

// ── .skip-link ──────────────────────────────────────────────────
test.describe('a11y: .skip-link', () => {
  test('starts off-screen (top: -100%)', async ({ page }) => {
    await setup(page, `<a id="t" href="#main" class="skip-link">Skip</a><main id="main"></main>`);
    const top = await page.locator('#t').evaluate(el => getComputedStyle(el).top);
    expect(top).toBe('-100%');
  });

  test('moves into viewport on focus', async ({ page }) => {
    await setup(page, `<a id="t" href="#main" class="skip-link">Skip</a><main id="main"></main>`);
    await page.locator('#t').focus();
    const top = await page.locator('#t').evaluate(el => getComputedStyle(el).top);
    expect(top).not.toBe('-100%');
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
    const val = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--sf-touch-target').trim()
    );
    expect(val).toBeTruthy();
    expect(parseFloat(val)).toBeGreaterThanOrEqual(44);
  });
});

// ── Focus ring (:focus-visible) ─────────────────────────────────
test.describe('a11y: focus ring', () => {
  test(':focus:not(:focus-visible) has no outline', async ({ page }) => {
    // We verify the rule is declared: clicking (mouse focus) should not
    // show an outline. Playwright can only verify the CSS rule exists.
    await setup(page, `<button id="t">Focus me</button>`);
    const hasRule = await page.evaluate(() => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.cssText &&
                rule.cssText.includes(':focus:not(:focus-visible)') &&
                rule.cssText.includes('outline: none')) return true;
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
