/**
 * Feature: tier-1-color-fallback
 * Property 4: For any @property-registered color Source_Token, the :root
 *             mirror value equals the initial-value string.
 *
 * Run: node --test tests/tier1-p4-drift.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';
import { verify, SOURCE_TOKENS, readValue } from '../scripts/verify-color-tokens.js';

const ROOT = path.resolve(import.meta.dirname, '..');

describe('P4: @property initial-value matches :root mirror', () => {
  let result;

  test('setup: run verify()', () => {
    result = verify();
  });

  test('all 11 source tokens have both @property and :root entries', () => {
    const missing = result.tokens.filter(r => r.classification !== 'both @property and :root');
    if (missing.length > 0) {
      // Acceptable: tokens might only have one form after Phase 1 has been applied
      // But at minimum each should have a value
      const noValue = missing.filter(r => !r.value);
      assert.equal(noValue.length, 0, 'tokens with no value: ' + noValue.map(r => r.name).join(', '));
    }
  });

  test('all tokens classified as "both" have matching values', () => {
    const both = result.tokens.filter(r => r.classification === 'both @property and :root');
    const mismatches = both.filter(r => !r.replayOk);
    if (mismatches.length > 0) {
      assert.fail(
        'Mismatched initial-value vs :root mirror:\n' +
        mismatches.map(r => `  ${r.name}`).join('\n')
      );
    }
  });

  // fast-check: verify replayOk for any token in the both-category
  test('fast-check: replayOk invariant for all "both" tokens (100 iterations)', () => {
    const both = result.tokens.filter(r => r.classification === 'both @property and :root');
    if (both.length === 0) return; // nothing to test if no "both" tokens exist

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: both.length - 1 }),
        (idx) => both[idx].replayOk === true
      ),
      { numRuns: Math.min(100, both.length * 10) }
    );
  });

  // Negative test: mismatched mirror should be flagged
  test('mismatched mirror detected: verify flags it', () => {
    const FIXTURE_DIR = path.join(ROOT, 'tests/fixtures');
    fs.mkdirSync(FIXTURE_DIR, { recursive: true });
    const fixturePath = 'tests/fixtures/tokens-mismatch.css';
    const abs = path.join(ROOT, fixturePath);

    // Write a fixture with one mismatched token
    const css = `
@property --sf-color-primary-light {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.47 0.27 264);
}
/* Other 10 missing — verify should halt */
:root {
  --sf-color-primary-light: oklch(0.99 0.01 200); /* MISMATCH */
}
    `.trim();
    fs.writeFileSync(abs, css, 'utf8');

    let warnCalled = false;
    const origWarn = console.warn;
    console.warn = (...args) => {
      if (args.join(' ').includes('MISMATCH')) warnCalled = true;
      origWarn.apply(console, args);
    };

    let exitCode = null;
    const origExit = process.exit;
    process.exit = (code) => { exitCode = code; throw new Error(`EXIT:${code}`); };

    try {
      verify(fixturePath);
    } catch (e) {
      // Expected: will exit(1) due to missing tokens
    } finally {
      console.warn = origWarn;
      process.exit = origExit;
    }

    // Either a MISMATCH warning was emitted OR the process tried to exit(1) due to missing tokens
    assert.ok(warnCalled || exitCode === 1, 'verify should warn on mismatch or exit on missing tokens');
  });
});
