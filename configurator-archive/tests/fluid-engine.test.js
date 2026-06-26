/**
 * Tests for lib/fluidEngine.js — the scalar-writing scale generator support.
 *
 * Sync tripwires: every engine scalar must exist in the baked catalogue and
 * its hardcoded default must equal the framework's live value, so a future
 * framework retune (e.g. a new base ratio) fails CI instead of making the
 * generator silently seed stale numbers.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  ENGINES,
  VIEWPORT_SCALARS,
  engineTokens,
  buildEnginePatch,
  resetEnginePatch,
  resetViewportPatch,
} from '../src/lib/fluidEngine.js';
import data from '../src/data/api-index.generated.json' with { type: 'json' };

const tokenByName = new Map(data.tokens.map((t) => [t.name, t]));

const ALL_SCALARS = [
  ...Object.values(ENGINES).flatMap((e) => Object.values(e.scalars)),
  VIEWPORT_SCALARS.vpMin,
  VIEWPORT_SCALARS.vpMax,
];

describe('engine scalars exist with default parity', () => {
  for (const s of ALL_SCALARS) {
    test(`${s.token} exists and defaults to ${s.default}`, () => {
      const t = tokenByName.get(s.token);
      assert.ok(t, `${s.token} not in api-index — fix lib/fluidEngine.js`);
      assert.equal(
        parseFloat(t.value),
        s.default,
        `${s.token}: framework default drifted (catalogue ${t.value} vs engine ${s.default}) — update lib/fluidEngine.js`
      );
    });
  }

  test('every per-step token exists in the catalogue', () => {
    for (const [kind, e] of Object.entries(ENGINES)) {
      for (const name of e.stepTokens) {
        assert.ok(tokenByName.has(name), `${kind}: step ${name} not in api-index`);
      }
    }
  });

  test('engineTokens covers scalars + the shared viewport pair', () => {
    for (const kind of Object.keys(ENGINES)) {
      const tokens = engineTokens(kind);
      assert.ok(tokens.includes(VIEWPORT_SCALARS.vpMin.token));
      assert.ok(tokens.includes(VIEWPORT_SCALARS.vpMax.token));
      for (const s of Object.values(ENGINES[kind].scalars)) {
        assert.ok(tokens.includes(s.token));
      }
    }
  });

  test('the display ramp shares the type ratios (no own ratio scalars)', () => {
    assert.equal(ENGINES.display.sharedRatios, true);
    assert.ok(!('ratioMin' in ENGINES.display.scalars));
    assert.ok(!('ratioMax' in ENGINES.display.scalars));
  });
});

describe('buildEnginePatch', () => {
  const KNOBS = { baseMin: 1.125, baseMax: 1.5, ratioMin: 1.2, ratioMax: 1.414, vpMin: 22.5, vpMax: 90 };

  test('writes changed scalars as plain number strings', () => {
    const patch = buildEnginePatch('type', KNOBS);
    assert.equal(patch['--sf-text-base-min'], '1.125');
    assert.equal(patch['--sf-text-base-max'], '1.5');
    assert.equal(patch['--sf-text-ratio-min'], '1.2');
    assert.equal(patch['--sf-text-ratio-max'], '1.414');
  });

  test('clears scalars sitting at the framework default (incl. viewport)', () => {
    const patch = buildEnginePatch('type', { baseMin: 1, baseMax: 1.25, ratioMin: 1.25, ratioMax: 1.333, vpMin: 22.5, vpMax: 90 });
    assert.equal(patch['--sf-text-base-min'], null);
    assert.equal(patch['--sf-text-base-max'], null);
    assert.equal(patch['--sf-text-ratio-min'], null);
    assert.equal(patch['--sf-text-ratio-max'], null);
    assert.equal(patch['--sf-fluid-min-vw'], null);
    assert.equal(patch['--sf-fluid-max-vw'], null);
  });

  test('writes the shared viewport scalars when changed', () => {
    const patch = buildEnginePatch('space', { ...KNOBS, vpMin: 20, vpMax: 100 });
    assert.equal(patch['--sf-fluid-min-vw'], '20');
    assert.equal(patch['--sf-fluid-max-vw'], '100');
  });

  test('nulls every per-step token of the ramp (clears baked clamp() masks)', () => {
    for (const [kind, e] of Object.entries(ENGINES)) {
      const patch = buildEnginePatch(kind, KNOBS);
      for (const name of e.stepTokens) {
        assert.ok(name in patch, `${kind}: ${name} missing from patch`);
        assert.equal(patch[name], null, `${kind}: ${name} must be cleared`);
      }
    }
  });

  test('display never writes ratio scalars', () => {
    const patch = buildEnginePatch('display', { ...KNOBS, baseMin: 2.6, baseMax: 3.4 });
    assert.ok(!('--sf-text-ratio-min' in patch));
    assert.ok(!('--sf-text-ratio-max' in patch));
    assert.equal(patch['--sf-text-display-base-min'], '2.6');
    assert.equal(patch['--sf-text-display-base-max'], '3.4');
  });

  test('unknown kind yields an empty patch', () => {
    assert.deepEqual(buildEnginePatch('nope', KNOBS), {});
  });
});

describe('reset patches', () => {
  test('resetEnginePatch clears scalars + steps but never the viewport', () => {
    for (const [kind, e] of Object.entries(ENGINES)) {
      const patch = resetEnginePatch(kind);
      for (const s of Object.values(e.scalars)) assert.equal(patch[s.token], null);
      for (const t of e.stepTokens) assert.equal(patch[t], null);
      assert.ok(!(VIEWPORT_SCALARS.vpMin.token in patch), `${kind} must not touch the shared viewport`);
      assert.ok(!(VIEWPORT_SCALARS.vpMax.token in patch));
    }
  });

  test('resetViewportPatch clears exactly the viewport pair', () => {
    assert.deepEqual(resetViewportPatch(), {
      '--sf-fluid-min-vw': null,
      '--sf-fluid-max-vw': null,
    });
  });
});
