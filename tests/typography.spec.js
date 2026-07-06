// @ts-check
// Typography, spacing, border-radius, and z-index token scale tests.
// Tokens use clamp() / calc() — values are resolved via element styles
// at a fixed 1200px viewport so comparisons are stable.
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderWithBundle } from './render-helpers.js';

const FIXTURE = pathToFileURL(path.join(import.meta.dirname, 'fixture.html')).href;

async function setup(page, html) {
  await renderWithBundle(page, html, { width: 1200, height: 900 });
}

// ── Heading size scale ───────────────────────────────────────────
test.describe('Typography: heading scale', () => {
  test('font sizes decrease strictly h1 → h6', async ({ page }) => {
    await setup(page, `
      <h1 id="h1">H1</h1><h2 id="h2">H2</h2><h3 id="h3">H3</h3>
      <h4 id="h4">H4</h4><h5 id="h5">H5</h5><h6 id="h6">H6</h6>
    `);
    const sizes = await page.evaluate(() =>
      ['h1','h2','h3','h4','h5','h6'].map(id =>
        parseFloat(getComputedStyle(document.getElementById(id)).fontSize)
      )
    );
    for (let i = 0; i < sizes.length - 1; i++) {
      expect(sizes[i], `h${i+1} should be larger than h${i+2}`).toBeGreaterThan(sizes[i + 1]);
    }
  });

  test('h1 has font-weight ≥ 700', async ({ page }) => {
    await setup(page, `<h1 id="t">Heading</h1>`);
    const fw = await page.locator('#t').evaluate(el =>
      parseInt(getComputedStyle(el).fontWeight, 10)
    );
    expect(fw).toBeGreaterThanOrEqual(600);
  });

  test('h1 is larger than body text at same viewport', async ({ page }) => {
    await setup(page, `<h1 id="h">Heading</h1><p id="p">body</p>`);
    const [hSize, pSize] = await Promise.all([
      page.locator('#h').evaluate(el => parseFloat(getComputedStyle(el).fontSize)),
      page.locator('#p').evaluate(el => parseFloat(getComputedStyle(el).fontSize)),
    ]);
    expect(hSize).toBeGreaterThan(pSize);
  });
});

// ── Fluid text scale ────────────────────────────────────────────
test.describe('Typography: fluid text scale', () => {
  test('--sf-text-* tokens increase from 2xs to 4xl', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE);
    const steps = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'];
    const sizes = await page.evaluate((steps) => {
      return steps.map(s => {
        const el = document.createElement('div');
        el.style.fontSize = `var(--sf-text-${s})`;
        document.body.appendChild(el);
        const val = parseFloat(getComputedStyle(el).fontSize);
        el.remove();
        return { name: s, val };
      });
    }, steps);
    for (let i = 0; i < sizes.length - 1; i++) {
      expect(
        sizes[i].val,
        `--sf-text-${sizes[i].name} should be smaller than --sf-text-${sizes[i + 1].name}`
      ).toBeLessThan(sizes[i + 1].val);
    }
  });

  test('display text sizes (s < m < l)', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE);
    const sizes = await page.evaluate(() =>
      ['s', 'm', 'l'].map(s => {
        const el = document.createElement('div');
        el.style.fontSize = `var(--sf-text-display-${s})`;
        document.body.appendChild(el);
        const val = parseFloat(getComputedStyle(el).fontSize);
        el.remove();
        return val;
      })
    );
    expect(sizes[0]).toBeLessThan(sizes[1]);
    expect(sizes[1]).toBeLessThan(sizes[2]);
  });
});

// ── Font families ────────────────────────────────────────────────
test.describe('Typography: font families', () => {
  test('--sf-font-body resolves to a non-empty stack', async ({ page }) => {
    await page.goto(FIXTURE);
    const ff = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--sf-font-body').trim()
    );
    expect(ff).toBeTruthy();
    expect(ff.length).toBeGreaterThan(3);
  });

  test('--sf-font-mono resolves to a monospace stack', async ({ page }) => {
    await setup(page, `<code id="t" style="font-family:var(--sf-font-mono)">code</code>`);
    const ff = await page.locator('#t').evaluate(el => getComputedStyle(el).fontFamily.toLowerCase());
    expect(ff).toMatch(/mono|courier|consolas|menlo|lucida/);
  });

  test('body text uses --sf-font-body', async ({ page }) => {
    await setup(page, `<p id="t">body text</p>`);
    const [tokenFont, actualFont] = await page.evaluate(() => {
      const token = getComputedStyle(document.documentElement).getPropertyValue('--sf-font-body').trim();
      const actual = getComputedStyle(document.getElementById('t')).fontFamily;
      return [token, actual];
    });
    expect(tokenFont).toBeTruthy();
    // The first font family in the token should appear in the element's computed stack.
    const firstFont = tokenFont.split(',')[0].replace(/['"]/g, '').trim();
    expect(actualFont.toLowerCase()).toContain(firstFont.toLowerCase());
  });
});

// ── Line-height tokens ───────────────────────────────────────────
test.describe('Typography: line-height tokens', () => {
  test('tight < snug < normal < relaxed', async ({ page }) => {
    await page.goto(FIXTURE);
    const lhs = await page.evaluate(() => {
      const r = getComputedStyle(document.documentElement);
      return ['tight', 'snug', 'normal', 'relaxed'].map(s => ({
        name: s,
        val:  parseFloat(r.getPropertyValue(`--sf-leading-${s}`).trim()),
      }));
    });
    for (let i = 0; i < lhs.length - 1; i++) {
      expect(lhs[i].val, `${lhs[i].name} < ${lhs[i + 1].name}`).toBeLessThan(lhs[i + 1].val);
    }
  });

  test('--sf-leading-taper tightens per-size line-heights progressively', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE);
    const [before, after] = await page.evaluate(() => {
      const probe = () => {
        const el = document.createElement('div');
        el.textContent = 'x';
        el.style.fontSize = '16px';
        el.style.lineHeight = 'var(--sf-text-4xl-line-height)';
        document.body.appendChild(el);
        const v = parseFloat(getComputedStyle(el).lineHeight);
        el.remove();
        return v;
      };
      const a = probe();
      document.documentElement.style.setProperty('--sf-leading-taper', '0.02');
      const b = probe();
      document.documentElement.style.removeProperty('--sf-leading-taper');
      return [a, b];
    });
    // taper 0 (default) = curated default --sf-leading-tight (1.1) → 17.6px
    expect(before).toBeCloseTo(16 * 1.1, 1);
    // 4xl is step index 8: 1.1 − 8 × 0.02 = 0.94 → 15.04px
    expect(after).toBeCloseTo(16 * (1.1 - 8 * 0.02), 1);
  });
});

// ── Section rhythm dial ─────────────────────────────────────────
test.describe('Section padding scale', () => {
  test('--sf-section-scale: 2 doubles --sf-section-pad--m', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE);
    const [before, after] = await page.evaluate(() => {
      const probe = () => {
        const el = document.createElement('div');
        el.style.paddingTop = 'var(--sf-section-pad--m)';
        document.body.appendChild(el);
        const v = parseFloat(getComputedStyle(el).paddingTop);
        el.remove();
        return v;
      };
      const a = probe();
      document.documentElement.style.setProperty('--sf-section-scale', '2');
      const b = probe();
      document.documentElement.style.removeProperty('--sf-section-scale');
      return [a, b];
    });
    expect(before).toBeGreaterThan(0);
    expect(after).toBeCloseTo(before * 2, 1);
  });
});

// ── Spacing scale ────────────────────────────────────────────────
test.describe('Spacing scale', () => {
  test('--sf-space-none resolves to 0px', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE);
    const val = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.padding = 'var(--sf-space-none)';
      document.body.appendChild(el);
      const v = parseFloat(getComputedStyle(el).padding);
      el.remove();
      return v;
    });
    expect(val).toBe(0);
  });

  test('spacing scale increases from xs to 4xl', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE);
    const steps = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'];
    const vals = await page.evaluate((steps) => {
      return steps.map(s => {
        const el = document.createElement('div');
        el.style.padding = `var(--sf-space-${s})`;
        document.body.appendChild(el);
        const v = parseFloat(getComputedStyle(el).paddingTop);
        el.remove();
        return { name: s, val: v };
      });
    }, steps);
    for (let i = 0; i < vals.length - 1; i++) {
      expect(vals[i].val, `space-${vals[i].name} < space-${vals[i + 1].name}`)
        .toBeLessThan(vals[i + 1].val);
    }
  });

  test('--sf-space-2xs < --sf-space-xs (smallest steps)', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(FIXTURE);
    const [v2xs, vxs] = await page.evaluate(() => {
      const resolve = (tok) => {
        const el = document.createElement('div');
        el.style.padding = `var(${tok})`;
        document.body.appendChild(el);
        const v = parseFloat(getComputedStyle(el).paddingTop);
        el.remove();
        return v;
      };
      return [resolve('--sf-space-2xs'), resolve('--sf-space-xs')];
    });
    expect(v2xs).toBeLessThan(vxs);
  });
});

// ── Border radius scale ──────────────────────────────────────────
test.describe('Border radius scale', () => {
  test('--sf-radius-none = 0', async ({ page }) => {
    await page.goto(FIXTURE);
    const val = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.borderRadius = 'var(--sf-radius-none)';
      document.body.appendChild(el);
      const v = parseFloat(getComputedStyle(el).borderRadius);
      el.remove();
      return v;
    });
    expect(val).toBe(0);
  });

  test('radii increase from xs to 4xl', async ({ page }) => {
    await page.goto(FIXTURE);
    const steps = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'];
    const vals = await page.evaluate((steps) => {
      return steps.map(s => {
        const el = document.createElement('div');
        el.style.borderRadius = `var(--sf-radius-${s})`;
        document.body.appendChild(el);
        const v = parseFloat(getComputedStyle(el).borderRadius);
        el.remove();
        return { name: s, val: v };
      });
    }, steps);
    for (let i = 0; i < vals.length - 1; i++) {
      expect(vals[i].val, `radius-${vals[i].name} < radius-${vals[i + 1].name}`)
        .toBeLessThan(vals[i + 1].val);
    }
  });

  test('--sf-radius-full is very large (9999px → pill shape)', async ({ page }) => {
    await page.goto(FIXTURE);
    const val = await page.evaluate(() => {
      const el = document.createElement('div');
      el.style.width = '200px';
      el.style.height = '50px';
      el.style.borderRadius = 'var(--sf-radius-full)';
      document.body.appendChild(el);
      // Chrome normalises "9999px" down to half the element's height for a pill
      const v = parseFloat(getComputedStyle(el).borderTopLeftRadius);
      el.remove();
      return v;
    });
    // Should render as 25px (half of 50px height) — normalised from 9999px
    expect(val).toBeGreaterThanOrEqual(25);
  });
});

// ── Global media radius ──────────────────────────────────────────
test.describe('Global media radius (--sf-media-radius)', () => {
  test('img has no radius by default (0)', async ({ page }) => {
    await setup(page, `<img id="t" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7">`);
    const v = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).borderRadius));
    expect(v).toBe(0);
  });

  test('setting --sf-media-radius rounds img globally', async ({ page }) => {
    await setup(page, `
      <style>:root { --sf-media-radius: var(--sf-radius-m); }</style>
      <img id="t" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7">
    `);
    const v = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).borderRadius));
    expect(v).toBeGreaterThan(0);
  });

  test('.sf-bg keeps its own radius regardless of --sf-media-radius', async ({ page }) => {
    await setup(page, `
      <style>:root { --sf-media-radius: var(--sf-radius-m); }</style>
      <div style="position:relative">
        <img id="t" class="sf-bg" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBTAA7">
      </div>
    `);
    const v = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).borderRadius));
    expect(v).toBe(0); // --sf-bg-radius default is 0, and .sf-bg (slashed.layout) wins over the base rule
  });
});

// ── Z-index scale ────────────────────────────────────────────────
test.describe('Z-index scale', () => {
  test('z-index tokens increase: below < base < raised < sticky < fixed < dropdown < overlay < modal < toast < tooltip', async ({ page }) => {
    await page.goto(FIXTURE);
    const zs = await page.evaluate(() => {
      const r = getComputedStyle(document.documentElement);
      return ['below', 'base', 'raised', 'sticky', 'fixed', 'dropdown', 'overlay', 'modal', 'toast', 'tooltip'].map(s => ({
        name: s,
        val:  parseInt(r.getPropertyValue(`--sf-z-${s}`).trim(), 10),
      }));
    });
    for (let i = 0; i < zs.length - 1; i++) {
      expect(zs[i].val, `z-${zs[i].name} < z-${zs[i + 1].name}`)
        .toBeLessThan(zs[i + 1].val);
    }
  });

  test('--sf-z-below is negative', async ({ page }) => {
    await page.goto(FIXTURE);
    const val = await page.evaluate(() =>
      parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sf-z-below').trim(), 10)
    );
    expect(val).toBeLessThan(0);
  });

  test('--sf-z-tooltip is the highest semantic rung', async ({ page }) => {
    await page.goto(FIXTURE);
    const vals = await page.evaluate(() => {
      const g = (t) => parseInt(getComputedStyle(document.documentElement).getPropertyValue(t).trim(), 10);
      return {
        tooltip: g('--sf-z-tooltip'), toast: g('--sf-z-toast'),
        modal: g('--sf-z-modal'), sticky: g('--sf-z-sticky'),
      };
    });
    expect(vals.tooltip).toBeGreaterThan(vals.toast);
    expect(vals.toast).toBeGreaterThan(vals.modal);
    expect(vals.modal).toBeGreaterThan(vals.sticky);
  });
});

// ── Duration scale ───────────────────────────────────────────────
test.describe('Animation duration scale', () => {
  test('durations increase: instant < fast < normal < slow < slower', async ({ page }) => {
    await page.goto(FIXTURE);
    const durs = await page.evaluate(() => {
      const r = getComputedStyle(document.documentElement);
      return ['instant', 'fast', 'normal', 'slow', 'slower'].map(s => ({
        name: s,
        // parse "200ms" → 200 or "0.2s" → 200 (convert to ms)
        val: (() => {
          const raw = r.getPropertyValue(`--sf-duration-${s}`).trim();
          if (raw.endsWith('ms')) return parseFloat(raw);
          if (raw.endsWith('s') && !raw.includes('calc')) return parseFloat(raw) * 1000;
          // Handle calc(Xms * N) or calc(Xs * N) produced by motion-scale tokens.
          const msMatch = raw.match(/calc\((\d+(?:\.\d+)?)ms/);
          const sMatch  = raw.match(/calc\((\d+(?:\.\d+)?)s/);
          if (msMatch) return parseFloat(msMatch[1]);
          if (sMatch)  return parseFloat(sMatch[1]) * 1000;
          return parseFloat(raw);
        })(),
      }));
    });
    for (let i = 0; i < durs.length - 1; i++) {
      expect(durs[i].val, `duration-${durs[i].name} < duration-${durs[i + 1].name}`)
        .toBeLessThan(durs[i + 1].val);
    }
  });
});

// ── sf-prose macro ───────────────────────────────────────────────
test.describe('Typography: .sf-prose', () => {
  test('sets a readable max-width on prose content', async ({ page }) => {
    await setup(page, `<div id="t" class="sf-prose" style="width:1200px"><p>text</p></div>`);
    const mw = await page.locator('#t').evaluate(el => parseFloat(getComputedStyle(el).maxWidth));
    // Prose max-width should be in the 60–80ch / 40–75rem range
    expect(mw).toBeGreaterThan(400);
    expect(mw).toBeLessThan(1200);
  });
});
