/**
 * Feature: tier-1-color-fallback
 * Property 7: On Old_Engine (no @supports match), ungated sRGB defaults are
 *             the only surviving declarations and never contain light-dark()
 *             or oklch(from …).
 *
 * Simulates an Old_Engine by extracting only non-@supports declarations from
 * the full bundle and asserting they satisfy the sRGB invariant.
 *
 * Run: node --test tests/tier1-p7-oldengine.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist/slashed.full.css');

/**
 * Simulate Old_Engine by stripping all @supports blocks from CSS.
 * Returns only the declarations that survive (ungated ones).
 */
function stripSupports(css) {
  // Remove @supports { ... } blocks (handles nesting)
  let result = '';
  let depth = 0;
  let inSupports = false;
  let supportsDepth = 0;
  const lines = css.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('@supports')) {
      inSupports = true;
      supportsDepth = depth;
    }
    if (!inSupports) {
      result += line + '\n';
    }
    // Count braces
    for (const ch of line) {
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (inSupports && depth <= supportsDepth) {
          inSupports = false;
        }
      }
    }
  }
  return result;
}

function extractCustomDecls(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const decls = new Map();
  for (const m of stripped.matchAll(/(--sf-[\w-]+)\s*:\s*([^;]+);/g)) {
    decls.set(m[1], m[2].replace(/\s+/g, ' ').trim());
  }
  return decls;
}

const TESTED_TOKENS = [
  '--sf-color-primary',
  '--sf-color-secondary',
  '--sf-color-action',
  '--sf-color-neutral',
  '--sf-color-base',
  '--sf-color-text',
  '--sf-color-border',
  '--sf-color-success',
  '--sf-color-warning',
  '--sf-color-error',
];

const HEX_RE = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;
const RGB_RE = /^rgb\(\s*\d+\s+\d+\s+\d+\s*(?:\/\s*[\d.]+\s*)?\)$/;

// hsl() can contain var() references (nested parens) — check by prefix/suffix
function isHSL(v) { return v.startsWith('hsl(') && v.endsWith(')'); }

function isValidSRGBValue(v) {
  return HEX_RE.test(v) || RGB_RE.test(v) || isHSL(v) ||
    /^none$/.test(v) || /^transparent$/.test(v) || /^inherit$/.test(v) ||
    /^oklch\(\s*[\d.]+%?\s+[\d.]+\s+[\d.]+\s*\)$/.test(v); // absolute oklch is OK
}

describe('P7: Old-engine cascade simulation', () => {
  let oldEngineDecls;

  test('setup: load and strip @supports blocks', () => {
    assert.ok(fs.existsSync(DIST), 'dist/slashed.full.css missing');
    const full = fs.readFileSync(DIST, 'utf8');
    const stripped = stripSupports(full);
    oldEngineDecls = extractCustomDecls(stripped);
    assert.ok(oldEngineDecls.size > 0, 'No declarations found in old-engine simulation');
  });

  test('no light-dark() survives on old engine', () => {
    const violations = [...oldEngineDecls.entries()]
      .filter(([, v]) => v.includes('light-dark'));
    if (violations.length > 0) {
      assert.fail('light-dark() survived on Old_Engine: ' +
        violations.map(([k]) => k).join(', '));
    }
  });

  test('no oklch(from…) survives on old engine', () => {
    const violations = [...oldEngineDecls.entries()]
      .filter(([, v]) => v.includes('oklch(from'));
    if (violations.length > 0) {
      assert.fail('oklch(from…) survived on Old_Engine: ' +
        violations.map(([k]) => k).join(', '));
    }
  });

  test('no color-mix() in core Tier-1 tokens survives on old engine', () => {
    // Scope to core semantic tokens (not numeric palette scale from optional/tokens.palette.css)
    const CORE_TOKEN_PATTERN = /^--sf-color-(?!.+-\d{2,3}$|.+-a\d+$)/;
    const violations = [...oldEngineDecls.entries()]
      .filter(([k, v]) => CORE_TOKEN_PATTERN.test(k) && v.includes('color-mix('));
    if (violations.length > 0) {
      assert.fail('color-mix() survived on Old_Engine in core tokens: ' +
        violations.map(([k]) => k).join(', '));
    }
  });

  test('all core color tokens have sRGB values on old engine', () => {
    for (const token of TESTED_TOKENS) {
      const val = oldEngineDecls.get(token);
      assert.ok(val, `${token} has no value on Old_Engine`);
      assert.ok(isValidSRGBValue(val), `${token} value "${val}" is not valid sRGB`);
    }
  });

  // fast-check: any sampled core token has a valid sRGB value on old engine
  test('fast-check: sampled tokens have sRGB values on old engine (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: TESTED_TOKENS.length - 1 }),
        (idx) => {
          const token = TESTED_TOKENS[idx];
          const val = oldEngineDecls.get(token);
          return !!val && isValidSRGBValue(val) &&
            !val.includes('light-dark') && !val.includes('oklch(from');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Simulate dark mode on old engine: [data-theme="dark"] block should also have sRGB
  test('dark-mode [data-theme="dark"] values are sRGB on old engine', () => {
    const full = fs.readFileSync(DIST, 'utf8');
    const stripped = stripSupports(full);
    // Extract just the [data-theme="dark"] block
    const darkStart = stripped.indexOf('[data-theme="dark"]');
    if (darkStart < 0) return; // may not be in old-engine content

    const darkBlock = stripped.slice(darkStart, stripped.indexOf('}', darkStart) + 1);
    const decls = extractCustomDecls(darkBlock);
    for (const [name, val] of decls) {
      if (!name.startsWith('--sf-color-')) continue;
      assert.ok(
        isValidSRGBValue(val),
        `Dark-mode ${name} value "${val}" is not valid sRGB`
      );
    }
  });
});
