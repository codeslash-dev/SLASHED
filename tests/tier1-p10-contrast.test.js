/**
 * Feature: tier-1-color-fallback
 * Property 10: WCAG 2.1 AA contrast (4.5:1 body, 3:1 large/UI) for critical
 *              fg/bg pairs using the HSL channel defaults from color-fallbacks.css.
 *
 * Run: node --test tests/tier1-p10-contrast.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';
import { parse, wcagContrast } from 'culori';

const ROOT = path.resolve(import.meta.dirname, '..');

// Read --sf-X-h/s/l channel defaults from the fallbacks file
function readChannels() {
  const css = fs.readFileSync(path.join(ROOT, 'core/tokens.color-fallbacks.css'), 'utf8');
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const ch = {};
  for (const m of stripped.matchAll(/--(sf-[\w]+-[hsl])\s*:\s*([\d.]+%?)\s*;/g)) {
    ch[m[1]] = m[2];
  }
  return ch;
}

// Build resolved HSL color strings for default token values.
// calc() is evaluated in JS so culori can parse the result.
function buildColors(ch) {
  const num = (v) => parseFloat(v);
  const baseL    = num(ch['sf-base-l']);
  const actionL  = num(ch['sf-action-l']);
  return {
    text:              `hsl(${ch['sf-neutral-h']} 15% 12%)`,
    'text--secondary': `hsl(${ch['sf-neutral-h']} 10% 35%)`,
    bg:                `hsl(${ch['sf-base-h']} ${ch['sf-base-s']} ${baseL + 2}%)`,
    link:              `hsl(${ch['sf-action-h']} ${ch['sf-action-s']} ${actionL - 5}%)`,
    primary:           `hsl(${ch['sf-primary-h']} ${ch['sf-primary-s']} ${ch['sf-primary-l']})`,
  };
}

function contrast(a, b) {
  const c1 = parse(a);
  const c2 = parse(b);
  if (!c1 || !c2) return 0;
  return wcagContrast(c1, c2);
}

describe('P10: Fallback contrast pairs meet WCAG 2.1 AA (light mode defaults)', () => {
  let colors;

  test('setup: read channel defaults', () => {
    const ch = readChannels();
    colors = buildColors(ch);
  });

  test('body text on bg ≥ 4.5:1', () => {
    const c = contrast(colors.text, colors.bg);
    assert.ok(c >= 4.5, `text on bg: ${c.toFixed(2)}:1 (need 4.5:1)`);
  });

  test('secondary text on bg ≥ 4.5:1', () => {
    const c = contrast(colors['text--secondary'], colors.bg);
    assert.ok(c >= 4.5, `text--secondary on bg: ${c.toFixed(2)}:1 (need 4.5:1)`);
  });

  test('link on bg ≥ 4.5:1', () => {
    const c = contrast(colors.link, colors.bg);
    assert.ok(c >= 4.5, `link on bg: ${c.toFixed(2)}:1 (need 4.5:1)`);
  });

  test('primary on bg ≥ 3:1 (UI/large text)', () => {
    const c = contrast(colors.primary, colors.bg);
    assert.ok(c >= 3.0, `primary on bg: ${c.toFixed(2)}:1 (need 3:1)`);
  });

  // fast-check: dark text on light bg always meets 4.5:1
  test('fast-check: dark text on light bg always meets 4.5:1 (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 25 }),   // text lightness 2–25%
        fc.integer({ min: 80, max: 99 }),  // bg lightness 80–99%
        (tl, bgl) => {
          const fg = parse(`hsl(217 15% ${tl}%)`);
          const bg = parse(`hsl(211 10% ${bgl}%)`);
          if (!fg || !bg) return true;
          return wcagContrast(fg, bg) >= 4.5;
        }
      ),
      { numRuns: 100 }
    );
  });
});
