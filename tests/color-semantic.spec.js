// @ts-check
// Verifies semantic colour-token pairs meet WCAG contrast requirements
// and that the palette scale and surface hierarchy are coherent.
// Runs in both light and dark themes.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

// fixture.html loads slashed.full.css (includes tokens.palette.css)
const FIXTURE = pathToFileURL(path.join(__dirname, 'fixture.html')).href;

// ── Serialisable in-browser helpers ─────────────────────────────
// Functions passed directly to page.evaluate() must be self-contained
// (no closure over Node.js variables). Single-token helpers are called
// from Node.js with page.evaluate(fn, tokenName) so callers can compose
// them without duplicating the canvas boilerplate.

// Returns WCAG luminance of the resolved value of one CSS custom property.
// Self-contained: safe to pass to page.evaluate(resolveTokenLuminance, tok).
function resolveTokenLuminance(tok) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const el = document.createElement('div'); el.style.backgroundColor = `var(${tok})`;
  document.body.appendChild(el);
  ctx.clearRect(0,0,1,1); ctx.fillStyle='#000'; ctx.fillStyle=getComputedStyle(el).backgroundColor; el.remove();
  ctx.fillRect(0,0,1,1);
  const [r,g,b] = ctx.getImageData(0,0,1,1).data;
  const lin = v => { v/=255; return v<=0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4; };
  return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
}

// Returns WCAG contrast ratio between two CSS custom property tokens.
function contrastBetween(token1, token2) {
  // Must be self-contained: re-declare helpers (page.evaluate serialises the fn body).
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const toLum = (color) => {
    ctx.clearRect(0,0,1,1); ctx.fillStyle='#000'; ctx.fillStyle=color; ctx.fillRect(0,0,1,1);
    const [r,g,b] = ctx.getImageData(0,0,1,1).data;
    const lin = v => { v/=255; return v<=0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4; };
    return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b);
  };
  const resolve = (tok) => {
    const el = document.createElement('div'); el.style.backgroundColor = `var(${tok})`;
    document.body.appendChild(el); const c = getComputedStyle(el).backgroundColor; el.remove(); return c;
  };
  const a = toLum(resolve(token1));
  const b = toLum(resolve(token2));
  return (Math.max(a,b) + 0.05) / (Math.min(a,b) + 0.05);
}

// Node.js async helpers — compose page.evaluate(resolveTokenLuminance) calls
// so the canvas boilerplate lives in exactly one place.

async function getSurfaceLuminances(page) {
  const [bg, raised, well] = await Promise.all([
    page.evaluate(resolveTokenLuminance, '--sf-color-bg'),
    page.evaluate(resolveTokenLuminance, '--sf-color-raised'),
    page.evaluate(resolveTokenLuminance, '--sf-color-well'),
  ]);
  return { bg, raised, well };
}

// Returns {step, lum} pairs for the primary palette steps provided.
function paletteLuminances(steps) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  return steps.map(s => {
    ctx.clearRect(0,0,1,1); ctx.fillStyle='#000';
    const el=document.createElement('div'); el.style.backgroundColor=`var(--sf-color-primary-${s})`;
    document.body.appendChild(el); ctx.fillStyle=getComputedStyle(el).backgroundColor; el.remove();
    ctx.fillRect(0,0,1,1);
    const [r,g,b]=ctx.getImageData(0,0,1,1).data;
    const lin=v=>{v/=255;return v<=0.03928?v/12.92:((v+0.055)/1.055)**2.4;};
    return { step: s, lum: 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b) };
  });
}

for (const theme of ['light', 'dark']) {
  test.describe(`Colour semantics — ${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(FIXTURE);
      await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
      await page.evaluate(() => document.fonts && document.fonts.ready);
    });

    // ── Body text on background ──────────────────────────────────
    test('body text (--sf-color-text) on page bg meets WCAG AA (4.5:1)', async ({ page }) => {
      const ratio = await page.evaluate(contrastBetween, '--sf-color-text', '--sf-color-bg');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    // ── Heading text on background ───────────────────────────────
    test('heading colour (--sf-color-heading) on page bg meets WCAG AA (4.5:1)', async ({ page }) => {
      const ratio = await page.evaluate(contrastBetween, '--sf-color-heading', '--sf-color-bg');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    // ── Muted text on background ─────────────────────────────────
    test('muted text (--sf-color-text--muted) on page bg meets WCAG AA Large (3:1)', async ({ page }) => {
      // --sf-color-text--muted = --sf-color-neutral, designed for
      // secondary/meta text which can be 14pt+ (AA Large = 3:1).
      const ratio = await page.evaluate(contrastBetween, '--sf-color-text--muted', '--sf-color-bg');
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    });

    // ── Body text on raised surface ──────────────────────────────
    test('body text on raised surface meets WCAG AA (4.5:1)', async ({ page }) => {
      const ratio = await page.evaluate(contrastBetween, '--sf-color-text', '--sf-color-raised');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    // ── Body text on well surface ────────────────────────────────
    test('body text on well surface meets WCAG AA (4.5:1)', async ({ page }) => {
      const ratio = await page.evaluate(contrastBetween, '--sf-color-text', '--sf-color-well');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    // ── Surface hierarchy: bg ≠ raised ≠ well ───────────────────
    test('bg, raised, and well surfaces have distinct luminance values', async ({ page }) => {
      const lums = await getSurfaceLuminances(page);
      // Each surface should differ by at least 0.002 in luminance
      expect(Math.abs(lums.bg - lums.raised)).toBeGreaterThan(0.002);
      expect(Math.abs(lums.bg - lums.well)).toBeGreaterThan(0.002);
      expect(Math.abs(lums.raised - lums.well)).toBeGreaterThan(0.002);
    });

    // ── Background polarity ──────────────────────────────────────
    test('page background luminance is > 0.5 in light, < 0.5 in dark', async ({ page }) => {
      const lum = await page.evaluate(resolveTokenLuminance, '--sf-color-bg');
      if (theme === 'light') {
        expect(lum).toBeGreaterThan(0.5);
      } else {
        expect(lum).toBeLessThan(0.5);
      }
    });

    // ── Border contrast ──────────────────────────────────────────
    test('--sf-color-border resolves to a non-transparent value', async ({ page }) => {
      const color = await page.evaluate(() => {
        const el = document.createElement('div');
        el.style.borderColor = 'var(--sf-color-border)';
        document.body.appendChild(el);
        const c = getComputedStyle(el).borderTopColor;
        el.remove();
        return c;
      });
      expect(color).toBeTruthy();
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
    });

    // ── Action colour ────────────────────────────────────────────
    test('--sf-color-action resolves to a non-transparent value', async ({ page }) => {
      const color = await page.evaluate(() => {
        const el = document.createElement('div');
        el.style.backgroundColor = 'var(--sf-color-action)';
        document.body.appendChild(el);
        const c = getComputedStyle(el).backgroundColor;
        el.remove();
        return c;
      });
      expect(color).not.toBe('rgba(0, 0, 0, 0)');
      expect(color).not.toBe('transparent');
    });

    // ── Status colours non-transparent ──────────────────────────
    for (const status of ['success', 'warning', 'error', 'info', 'danger']) {
      test(`--sf-color-${status} resolves to an opaque colour`, async ({ page }) => {
        const alpha = await page.evaluate((tok) => {
          const cv = document.createElement('canvas'); cv.width = cv.height = 1;
          const ctx = cv.getContext('2d', { willReadFrequently: true });
          const el = document.createElement('div');
          el.style.backgroundColor = `var(${tok})`;
          document.body.appendChild(el);
          const c = getComputedStyle(el).backgroundColor;
          el.remove();
          ctx.clearRect(0,0,1,1); ctx.fillStyle='#000'; ctx.fillStyle=c; ctx.fillRect(0,0,1,1);
          const [r,g,b,a] = ctx.getImageData(0,0,1,1).data;
          return a; // 255 = fully opaque
        }, `--sf-color-${status}`);
        expect(alpha).toBe(255);
      });
    }
  });
}

// ── Palette scale monotonicity (light theme, uses full bundle) ───
test.describe('Palette scale — primary', () => {
  test('luminance decreases monotonically from step 50 to 950', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
    const lums = await page.evaluate(paletteLuminances, steps);

    // Luminance should strictly decrease from 50 → 950
    for (let i = 0; i < lums.length - 1; i++) {
      expect(
        lums[i].lum,
        `step ${lums[i].step} should be lighter than ${lums[i + 1].step}`
      ).toBeGreaterThan(lums[i + 1].lum);
    }
  });

  test('step 50 is visually light and step 950 is visually dark in light theme', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    const [lum50, lum950] = await Promise.all([
      page.evaluate(resolveTokenLuminance, '--sf-color-primary-50'),
      page.evaluate(resolveTokenLuminance, '--sf-color-primary-950'),
    ]);
    expect(lum50).toBeGreaterThan(0.7);   // near-white
    expect(lum950).toBeLessThan(0.15);    // near-black
  });
});

// ── Alpha palette variants ───────────────────────────────────────
test.describe('Palette alpha variants', () => {
  test('--sf-color-primary-a5 is more transparent than --sf-color-primary-a95', async ({ page }) => {
    await page.goto(FIXTURE);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

    const alphas = await page.evaluate(() => {
      const cv = document.createElement('canvas'); cv.width = cv.height = 1;
      const ctx = cv.getContext('2d', { willReadFrequently: true });
      const getAlpha = (tok) => {
        const el = document.createElement('div'); el.style.backgroundColor = `var(${tok})`;
        document.body.appendChild(el);
        const color = getComputedStyle(el).backgroundColor;
        el.remove();
        // Extract alpha from rgba(r,g,b,a) or rgb(r,g,b)
        const match = color.match(/rgba?\([\d.]+,\s*[\d.]+,\s*[\d.]+(?:,\s*([\d.]+))?\)/);
        if (match && match[1] !== undefined) return parseFloat(match[1]);
        return 1; // no alpha = fully opaque
      };
      return { a5: getAlpha('--sf-color-primary-a5'), a95: getAlpha('--sf-color-primary-a95') };
    });
    expect(alphas.a5).toBeLessThan(alphas.a95);
  });
});
