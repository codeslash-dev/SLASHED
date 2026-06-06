/**
 * Feature: tier-1-color-fallback
 * Property 2: For any Tier-1 token, exactly one unguarded default exists;
 *             no omission, no duplication.
 *
 * Run: node --test tests/tier1-p2-coverage.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';

const ROOT = path.resolve(import.meta.dirname, '..');
const FALLBACKS = path.join(ROOT, 'core/tokens.color-fallbacks.css');

const TIER1_TOKENS = [
  '--sf-color-primary', '--sf-color-secondary', '--sf-color-tertiary',
  '--sf-color-action', '--sf-color-neutral', '--sf-color-base',
  '--sf-color-success', '--sf-color-warning', '--sf-color-error',
  '--sf-color-info', '--sf-color-danger',
  '--sf-color-bg', '--sf-color-inset', '--sf-color-raised',
  '--sf-color-text', '--sf-color-text--secondary', '--sf-color-heading',
  '--sf-color-border', '--sf-color-border--subtle', '--sf-color-border--strong',
  '--sf-color-link', '--sf-color-selection-bg',
  '--sf-color-success-strong', '--sf-color-warning-strong',
  '--sf-color-error-strong', '--sf-color-info-strong', '--sf-color-danger-strong',
  '--sf-shadow-xs', '--sf-shadow-s', '--sf-shadow-m', '--sf-shadow-l',
];

describe('P2: Coverage and uniqueness of Tier-1 fallback declarations', () => {
  let css;
  let ungatedDecls;

  test('setup: load fallbacks file', () => {
    css = fs.readFileSync(FALLBACKS, 'utf8');
    // Only count declarations in the @layer slashed.tokens block (light-mode defaults)
    // The themes block intentionally re-declares tokens per selector
    const tokensEnd = css.indexOf('@layer slashed.themes');
    const lightCSS  = css.slice(0, tokensEnd > 0 ? tokensEnd : css.length);
    const stripped  = lightCSS.replace(/\/\*[\s\S]*?\*\//g, '');
    const counts    = new Map();
    for (const m of stripped.matchAll(/(--sf-[\w-]+)\s*:/g)) {
      const name = m[1];
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    ungatedDecls = counts;
  });

  test('all required Tier-1 tokens are present', () => {
    const missing = TIER1_TOKENS.filter(t => !ungatedDecls.has(t));
    if (missing.length > 0) {
      assert.fail('Missing Tier-1 tokens: ' + missing.join(', '));
    }
  });

  test('no Tier-1 token declared more than once in light-mode block', () => {
    const dupes = TIER1_TOKENS.filter(t => (ungatedDecls.get(t) ?? 0) > 1);
    if (dupes.length > 0) {
      assert.fail('Duplicate fallback declarations in tokens block: ' + dupes.join(', '));
    }
  });

  test('tokens.css has no ungated light-dark() declarations', () => {
    const tokensCss = fs.readFileSync(path.join(ROOT, 'core/tokens.css'), 'utf8');
    const stripped = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '');
    // Find light-dark() not inside @supports
    let depth = 0;
    let inSupports = 0;
    for (const line of stripped.split('\n')) {
      if (line.includes('@supports')) inSupports++;
      if (line.trim() === '}') { if (inSupports > 0) inSupports--; }
      if (line.includes('light-dark(') && inSupports === 0) {
        assert.fail(`Ungated light-dark() found in tokens.css: ${line.trim()}`);
      }
    }
  });

  test('tokens.css has no ungated oklch(from…) declarations', () => {
    const tokensCss = fs.readFileSync(path.join(ROOT, 'core/tokens.css'), 'utf8');
    const stripped = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '');
    let inSupports = 0;
    for (const line of stripped.split('\n')) {
      if (line.includes('@supports')) inSupports++;
      if (line.trim() === '}') { if (inSupports > 0) inSupports--; }
      if ((line.includes('oklch(from') || line.includes('color-mix(')) && inSupports === 0) {
        assert.fail(`Ungated oklch(from)/color-mix() found in tokens.css: ${line.trim()}`);
      }
    }
  });

  // fast-check: any token from a known-covered set is present in the fallbacks
  test('fast-check: random sample of Tier-1 tokens has a fallback (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: TIER1_TOKENS.length - 1 }),
        (idx) => {
          const token = TIER1_TOKENS[idx];
          return (ungatedDecls.get(token) ?? 0) >= 1;
        }
      ),
      { numRuns: 100 }
    );
  });
});
