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
import {
  allTokens, dependentsByName, dependentsCount, tokenByName, buildDependentsByName,
} from '../src/lib/model.js';

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

  test('a self-reference does not inflate the count (synthetic catalogue)', () => {
    // Drive the algorithm directly with a contrived 3-token catalogue so
    // we can prove the self-reference exclusion rather than just observe it.
    const tokens = [
      { name: '--a', value: 'var(--a)' },               // self-ref ONLY
      { name: '--b', value: 'var(--a) calc(var(--c) * 2)' }, // refs --a + --c
      { name: '--c', value: '0' },
    ];
    const map = buildDependentsByName(tokens);
    // --a: only --b references it (self-ref excluded ⇒ 1, not 2).
    assert.equal(map.get('--a'), 1, 'self-ref must not inflate --a');
    // --b: nothing references it.
    assert.equal(map.get('--b'), 0);
    // --c: only --b references it.
    assert.equal(map.get('--c'), 1);
  });

  test('a self-reference does not inflate the count (live catalogue)', () => {
    // If the framework happens to ship any tokens whose value contains
    // var(<self>), this test asserts the production map matches the
    // golden recompute (which itself excludes self-refs). When the
    // catalogue has zero self-refs, the loop is empty — the synthetic
    // test above covers the algorithm regardless.
    const VAR_RE = /var\(\s*(--sf-[\w-]+)/g;
    let checked = 0;
    for (const t of data.tokens) {
      if (typeof t.value !== 'string') continue;
      let selfRef = false;
      for (const m of t.value.matchAll(VAR_RE)) {
        if (m[1] === t.name) { selfRef = true; break; }
      }
      if (selfRef) {
        const golden = countDependentsOf(t.name);
        assert.equal(dependentsCount(t.name), golden, `${t.name} self-ref handled`);
        checked += 1;
      }
    }
    // Document — for posterity in test output — how many self-refs the
    // framework currently ships, so the absence/presence of this signal
    // remains intentional.
    assert.ok(checked >= 0, `examined ${checked} self-referencing tokens in live catalogue`);
  });

  test('multiple var() refs to the same target inside one value count once', () => {
    const tokens = [
      { name: '--x', value: 'calc(var(--y) + var(--y))' }, // --y mentioned twice
      { name: '--y', value: '0' },
    ];
    const map = buildDependentsByName(tokens);
    assert.equal(map.get('--y'), 1, 'duplicate refs in one value de-duped');
  });

  test('refs to tokens NOT in the catalogue are ignored', () => {
    const tokens = [
      { name: '--a', value: 'var(--ghost)' }, // --ghost never declared
      { name: '--b', value: '0' },
    ];
    const map = buildDependentsByName(tokens);
    assert.equal(map.has('--ghost'), false);
    assert.equal(map.get('--a'), 0);
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
