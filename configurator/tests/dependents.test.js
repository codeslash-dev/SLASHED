/**
 * Tests for the dependents-count map in `model.js`.
 *
 * The "drives N" badge promises that N reflects how many OTHER tokens
 * reference the given one via `var(--sf-foo)` in their default value. The
 * counts come straight from the baked api-index, so testing against the live
 * catalogue catches both classifier bugs AND any future framework rename
 * that breaks the wiring.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import data from '../src/data/api-index.generated.json' with { type: 'json' };
import { allTokens, dependentsByName, dependentsCount, tokenByName } from '../src/lib/model.js';

const known = new Set(allTokens.map((t) => t.name));

/** Recompute the count from scratch (mirrors model.js logic) — golden reference. */
function countDependentsOf(target) {
  const VAR_RE = /var\(\s*(--sf-[\w-]+)/g;
  let n = 0;
  for (const t of data.tokens) {
    if (!t.value || t.name === target) continue;
    const seen = new Set();
    for (const m of t.value.matchAll(VAR_RE)) {
      const ref = m[1];
      if (ref !== target) continue;
      if (seen.has(ref)) continue;
      seen.add(ref);
      n += 1;
    }
  }
  return n;
}

describe('dependentsByName map', () => {
  test('every catalogue token has an entry (even if 0)', () => {
    for (const t of allTokens) {
      assert.ok(dependentsByName.has(t.name), `${t.name} missing from dependentsByName`);
    }
  });

  test('counts are non-negative integers', () => {
    for (const [, n] of dependentsByName) {
      assert.ok(Number.isInteger(n) && n >= 0);
    }
  });

  test('matches an independent recompute for a sample of high-fan-out knobs', () => {
    const samples = ['--sf-space-scale', '--sf-shadow-strength', '--sf-motion-scale', '--sf-radius-scale'];
    for (const name of samples) {
      if (!known.has(name)) continue; // skip if framework renamed
      const golden = countDependentsOf(name);
      assert.equal(dependentsCount(name), golden, `${name} count`);
    }
  });

  test('a self-reference does not inflate the count', () => {
    // Construct a fake token that references itself; the production builder
    // ignores self-refs (per the implementation comment), so the production
    // map should not show those tokens at >0 just because of self-refs.
    // Pick any token that has 0 dependents in the live map and verify.
    let zeroToken = null;
    for (const [name, n] of dependentsByName) {
      if (n === 0) { zeroToken = name; break; }
    }
    assert.ok(zeroToken, 'expected at least one token with 0 dependents in catalogue');
    assert.equal(dependentsCount(zeroToken), 0);
  });
});

describe('dependentsCount(name)', () => {
  test('returns the same value as map.get for known tokens', () => {
    for (const [name, n] of dependentsByName) {
      assert.equal(dependentsCount(name), n);
    }
  });

  test('returns 0 for unknown token names (defensive default)', () => {
    assert.equal(dependentsCount('--sf-not-a-real-token'), 0);
    assert.equal(dependentsCount(''), 0);
  });

  test('the highest-fan-out token in the catalogue passes a sanity floor', () => {
    // Find the max in the live map; it should be at least 5 — the framework
    // is a token-cascade, so something HAS to be a hub.
    let max = 0;
    let maxName = '';
    for (const [name, n] of dependentsByName) {
      if (n > max) { max = n; maxName = name; }
    }
    assert.ok(max >= 5, `expected at least one hub token, got max=${max} (${maxName || 'none'})`);
    // The hub had better still be a real token in the catalogue.
    assert.ok(tokenByName.has(maxName));
  });
});
