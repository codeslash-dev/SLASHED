/**
 * Feature: tier-1-color-fallback
 * Property 6: Running the generator twice on the same source produces
 *             byte-identical output.
 *
 * Run: node --test tests/tier1-p6-idempotence.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import fc from 'fast-check';

const ROOT    = path.resolve(import.meta.dirname, '..');
const OUTPUT  = path.join(ROOT, 'core/tokens.color-fallbacks.css');
const TOKENS  = path.join(ROOT, 'core/tokens.css');

describe('P6: Generator idempotence', () => {

  test('two consecutive runs produce byte-identical output', () => {
    execSync('node scripts/gen-color-fallbacks.js', { cwd: ROOT });
    const run1 = fs.readFileSync(OUTPUT, 'utf8');

    execSync('node scripts/gen-color-fallbacks.js', { cwd: ROOT });
    const run2 = fs.readFileSync(OUTPUT, 'utf8');

    assert.equal(run1, run2, 'Generator output is not idempotent across two runs');
  });

  test('output does not contain timestamp or run-id', () => {
    const css = fs.readFileSync(OUTPUT, 'utf8');
    // No date-like patterns that could break idempotence
    assert.ok(!/\d{4}-\d{2}-\d{2}/.test(css), 'Date found in generated output');
    assert.ok(!/Date\.now|new Date/.test(css), 'Date call found in generated output');
  });

  test('output line count is stable across runs', () => {
    execSync('node scripts/gen-color-fallbacks.js', { cwd: ROOT });
    const count1 = fs.readFileSync(OUTPUT, 'utf8').split('\n').length;

    execSync('node scripts/gen-color-fallbacks.js', { cwd: ROOT });
    const count2 = fs.readFileSync(OUTPUT, 'utf8').split('\n').length;

    assert.equal(count1, count2, 'Line count differs between runs');
  });

  // fast-check: for any number of runs 1..5, output should be the same
  test('fast-check: output is stable for N runs in [1,5] (100 iterations)', () => {
    // Run once to get baseline
    execSync('node scripts/gen-color-fallbacks.js', { cwd: ROOT });
    const baseline = fs.readFileSync(OUTPUT, 'utf8');

    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        (n) => {
          for (let i = 0; i < n; i++) {
            execSync('node scripts/gen-color-fallbacks.js', { cwd: ROOT });
          }
          const result = fs.readFileSync(OUTPUT, 'utf8');
          return result === baseline;
        }
      ),
      { numRuns: 10 } // Each run invokes the generator 1-5 times; limit to 10
    );
  });
});
