/**
 * Feature: tier-1-color-fallback
 * Property 1: Every Tier-1 unguarded default is a valid CSS color expression
 *             that resolves to sRGB — hex, rgb(), or hsl() with var() channels.
 *             None use light-dark(), oklch(from…), or color-mix().
 *
 * Run: node --test tests/tier1-p1-srgb-validity.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';

const ROOT    = path.resolve(import.meta.dirname, '..');
const DIST    = path.join(ROOT, 'dist/slashed.full.css');
const FALLBACKS = path.join(ROOT, 'core/tokens.color-fallbacks.css');

// ── helpers ──────────────────────────────────────────────────────────────────

const HEX_RE = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
const RGB_RE = /^rgb\(\s*\d+\s+\d+\s+\d+\s*(?:\/\s*[\d.]+\s*)?\)$/;

// hsl() can contain var() references which have nested parens — check by prefix/suffix
function isHSL(v) { return v.startsWith('hsl(') && v.endsWith(')'); }

// Valid sRGB-resolving color expressions in the fallbacks file.
// hsl() with var() channels is valid on every browser from Chrome 49+ (2016).
// oklch() is intentionally NOT accepted here — the fallback contract is sRGB-only
// (HSL/hex/rgb); an oklch() value would mean a modern expression leaked unguarded.
function isValidSRGB(value) {
  const v = value.trim();
  return HEX_RE.test(v) || RGB_RE.test(v) || isHSL(v) ||
    v === 'none' || v === 'transparent' || v === 'inherit' || v === 'auto';
}

// ── extract unguarded declarations from color-fallbacks.css ──────────────────

function extractFallbackDecls(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const decls = [];
  for (const m of stripped.matchAll(/(--sf-[\w-]+)\s*:\s*([^;]+);/g)) {
    decls.push({ name: m[1], value: m[2].replace(/\s+/g, ' ').trim() });
  }
  return decls;
}

// ── tests ────────────────────────────────────────────────────────────────────

describe('P1: Tier-1 unguarded defaults are valid sRGB', () => {
  let decls;

  test('dist/slashed.full.css exists', () => {
    assert.ok(fs.existsSync(DIST), 'dist/slashed.full.css not found — run npm run build first');
  });

  test('core/tokens.color-fallbacks.css exists', () => {
    assert.ok(fs.existsSync(FALLBACKS), 'core/tokens.color-fallbacks.css not found');
    const css = fs.readFileSync(FALLBACKS, 'utf8');
    decls = extractFallbackDecls(css);
    assert.ok(decls.length > 0, 'No declarations found in fallbacks file');
  });

  test('all color custom properties have valid sRGB-resolving values', () => {
    // Channel variables (--sf-primary-h etc.) are numbers, not colors — skip them.
    const colorDecls = decls.filter(d =>
      (d.name.includes('-color-') || d.name.startsWith('--sf-shadow-color')) &&
      !d.name.endsWith('-h') && !d.name.endsWith('-s') && !d.name.endsWith('-l')
    );
    const violations = colorDecls.filter(d => !isValidSRGB(d.value));
    if (violations.length > 0) {
      const msg = violations.map(v => `  ${v.name}: ${v.value}`).join('\n');
      assert.fail(`Non-sRGB values found in fallbacks:\n${msg}`);
    }
  });

  test('no light-dark() in unguarded section', () => {
    const violations = decls.filter(d => d.value.includes('light-dark'));
    if (violations.length > 0) {
      assert.fail(`light-dark() in unguarded fallbacks: ${violations.map(d => d.name).join(', ')}`);
    }
  });

  test('no oklch(from…) relative color in unguarded section', () => {
    const violations = decls.filter(d => d.value.includes('oklch(from'));
    if (violations.length > 0) {
      assert.fail(`oklch(from…) in unguarded fallbacks: ${violations.map(d => d.name).join(', ')}`);
    }
  });

  test('no color-mix() in unguarded section', () => {
    const violations = decls.filter(d => d.value.includes('color-mix('));
    if (violations.length > 0) {
      assert.fail(`color-mix() in unguarded fallbacks: ${violations.map(d => d.name).join(', ')}`);
    }
  });

  // fast-check: every color declaration uses an allowed expression type
  test('fast-check: all color declarations use valid sRGB-resolving expressions (100 iterations)', () => {
    const colorDecls = decls.filter(d =>
      (d.name.includes('-color-') || d.name.startsWith('--sf-shadow-color')) &&
      !d.name.endsWith('-h') && !d.name.endsWith('-s') && !d.name.endsWith('-l')
    );
    if (colorDecls.length === 0) return;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: colorDecls.length - 1 }),
        (idx) => isValidSRGB(colorDecls[idx].value)
      ),
      { numRuns: 100 }
    );
  });

  test('fast-check: all hsl() declarations contain no modern-only features (100 iterations)', () => {
    const hslDecls = decls.filter(d => d.value.trim().startsWith('hsl('));
    if (hslDecls.length === 0) return;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: hslDecls.length - 1 }),
        (idx) => {
          const v = hslDecls[idx].value;
          return !v.includes('light-dark') && !v.includes('oklch(from') && !v.includes('color-mix(');
        }
      ),
      { numRuns: 100 }
    );
  });
});
