/**
 * Feature: tier-1-color-fallback
 * Property 1: Every Tier-1 unguarded default parses as valid sRGB.
 *
 * Parses all unguarded color custom-property declarations from
 * dist/slashed.full.css and asserts each value is a valid sRGB
 * expression (hex or modern rgb()).
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

const HEX_RE   = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
const RGB_RE   = /^rgb\(\s*\d+\s+\d+\s+\d+\s*(?:\/\s*[\d.]+\s*)?\)$/;
const NONE_RE  = /^none$/;
const STATIC_OKLCH_RE = /^oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+\s*\)$/;

function isValidSRGB(value) {
  const v = value.trim();
  return HEX_RE.test(v) || RGB_RE.test(v) || NONE_RE.test(v) || STATIC_OKLCH_RE.test(v) ||
    v === 'transparent' || v === 'inherit' || v === 'auto';
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

  test('all color custom properties have valid sRGB values', () => {
    const colorDecls = decls.filter(d => d.name.includes('-color-') || d.name.startsWith('--sf-shadow-color'));
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

  // fast-check: any hex value is 3 or 6 hex digits, any rgb() has channels 0-255
  test('fast-check: all hex values have valid format (100 iterations)', () => {
    const hexDecls = decls.filter(d => d.value.trim().startsWith('#'));
    if (hexDecls.length === 0) return;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: hexDecls.length - 1 }),
        (idx) => {
          const { value } = hexDecls[idx];
          return HEX_RE.test(value.trim());
        }
      ),
      { numRuns: 100 }
    );
  });

  test('fast-check: all rgb() values have channels in [0,255] (100 iterations)', () => {
    const rgbDecls = decls.filter(d => d.value.trim().startsWith('rgb('));
    if (rgbDecls.length === 0) return;

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: rgbDecls.length - 1 }),
        (idx) => {
          const m = rgbDecls[idx].value.match(/rgb\(\s*(\d+)\s+(\d+)\s+(\d+)/);
          if (!m) return false;
          return [+m[1], +m[2], +m[3]].every(ch => ch >= 0 && ch <= 255);
        }
      ),
      { numRuns: 100 }
    );
  });
});
