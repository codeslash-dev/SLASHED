/**
 * Feature: tier-1-color-fallback
 * Property 11: Overriding --sf-*-h/s/l channel variables propagates to all
 *              derived tokens on every browser (no build step required).
 *
 * Unlike a JS re-implementation of the formulas (which can stay green even if
 * the real CSS regresses), this suite parses the actual derivation expressions
 * out of core/tokens.color-fallbacks.css and resolves THOSE against overridden
 * channel values — so a change to the shipped formulas changes what's tested.
 *
 * Run: node --test tests/tier1-p11-overrides.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';
import fc   from 'fast-check';
import { parse } from 'culori';

const ROOT = path.resolve(import.meta.dirname, '..');
const CSS  = fs.readFileSync(path.join(ROOT, 'core/tokens.color-fallbacks.css'), 'utf8');

// Read --sf-<family>-h/s/l channel defaults (percent sign stripped — values are plain numbers).
function readChannels(css) {
  const ch = {};
  for (const m of css.matchAll(/--(sf-[\w]+-[hsl])\s*:\s*([\d.]+)%?\s*;/g)) {
    ch[m[1]] = parseFloat(m[2]);
  }
  return ch;
}

// Extract `--sf-color-X: hsl(var(--sf-<family>-h) var(--sf-<family>-s)
//   [ var(--sf-<family>-l) | calc(var(--sf-<family>-l) ± N%) ] [/ alpha])`
// — i.e. every Tier-1 color token whose value derives from a single family's channels.
function extractDerivations(css) {
  const re = /(--sf-color-[\w-]+)\s*:\s*hsl\(\s*var\(--sf-([\w]+)-h\)\s+var\(--sf-\2-s\)\s+(?:var\(--sf-\2-l\)|calc\(\s*var\(--sf-\2-l\)\s*([+-])\s*([\d.]+)%\s*\))\s*(?:\/\s*([\d.]+)\s*)?\)/g;
  const decls = [];
  let m;
  while ((m = re.exec(css)) !== null) {
    const [, token, family, sign, delta, alpha] = m;
    decls.push({
      token,
      family,
      lDelta: delta ? (sign === '-' ? -parseFloat(delta) : parseFloat(delta)) : 0,
      alpha: alpha !== undefined ? parseFloat(alpha) : null,
    });
  }
  return decls;
}

// Resolve a parsed derivation against a given channel set — mirrors what the
// browser's cascade does when var()/calc() resolve against :root custom properties.
function resolve(decl, channels) {
  const h = channels[`sf-${decl.family}-h`];
  const s = channels[`sf-${decl.family}-s`];
  const l = channels[`sf-${decl.family}-l`] + decl.lDelta;
  return decl.alpha != null ? `hsl(${h} ${s}% ${l}% / ${decl.alpha})` : `hsl(${h} ${s}% ${l}%)`;
}

const baseChannels = readChannels(CSS);
const derivations  = extractDerivations(CSS);

describe('P11: HSL channel override propagation (real CSS contract)', () => {

  test('setup: fallback file declares derived color tokens parseable from source channels', () => {
    assert.ok(Object.keys(baseChannels).length >= 30, 'Expected --sf-*-h/s/l channel triples for all families');
    assert.ok(derivations.length >= 8, 'Expected multiple --sf-color-* tokens deriving from --sf-*-h/s/l channels');
  });

  test('overriding a family hue changes its resolved color but not its lightness/saturation', () => {
    const primary = derivations.find(d => d.token === '--sf-color-primary');
    assert.ok(primary, '--sf-color-primary must derive directly from --sf-primary-h/s/l');

    const overridden = { ...baseChannels, 'sf-primary-h': (baseChannels['sf-primary-h'] + 130) % 360 };
    const before = parse(resolve(primary, baseChannels));
    const after  = parse(resolve(primary, overridden));
    assert.ok(before && after, 'resolved colors must be parseable');
    assert.notEqual(before.h, after.h, 'Hue override must change resolved hue');
    assert.equal(before.s, after.s, 'Saturation must stay the same when only hue changes');
    assert.equal(before.l, after.l, 'Lightness must stay the same when only hue changes');
  });

  test('overriding --sf-base-l propagates to every base-derived surface token by the same delta', () => {
    const surfaceTokens = derivations.filter(d => d.family === 'base' && d.token !== '--sf-color-base');
    assert.ok(surfaceTokens.length >= 2, 'Expected surface tokens (bg/inset/raised) to derive from --sf-base-l');

    const DELTA = 10;
    const overridden = { ...baseChannels, 'sf-base-l': baseChannels['sf-base-l'] + DELTA };

    for (const decl of surfaceTokens) {
      const before = parse(resolve(decl, baseChannels));
      const after  = parse(resolve(decl, overridden));
      assert.ok(before && after, `${decl.token} must resolve to a parseable color`);
      // culori normalizes HSL lightness to [0,1]; DELTA is in percentage points.
      assert.ok(
        Math.abs((after.l - before.l) - DELTA / 100) < 1e-9,
        `${decl.token} lightness must shift by exactly the --sf-base-l delta (${DELTA}%), got ${((after.l - before.l) * 100).toFixed(3)}%`
      );
    }
  });

  test('overriding --sf-action-l propagates to --sf-color-link with its formula offset preserved', () => {
    const link = derivations.find(d => d.token === '--sf-color-link');
    assert.ok(link, '--sf-color-link must derive from --sf-action-h/s/l');

    const DELTA = 8;
    const overridden = { ...baseChannels, 'sf-action-l': baseChannels['sf-action-l'] + DELTA };
    const before = parse(resolve(link, baseChannels));
    const after  = parse(resolve(link, overridden));
    assert.ok(before && after, 'link must resolve to a parseable color');
    // culori normalizes HSL lightness to [0,1]; DELTA is in percentage points.
    assert.ok(
      Math.abs((after.l - before.l) - DELTA / 100) < 1e-9,
      `link lightness must track --sf-action-l 1:1 (offset preserved), got Δ=${((after.l - before.l) * 100).toFixed(3)}%`
    );
  });

  // fast-check: overriding any family's hue changes the resolved hue of every
  // Tier-1 token that derives from that family (the propagation guarantee).
  test('fast-check: overriding a family hue changes every token derived from it (100 iterations)', () => {
    const families = [...new Set(derivations.map(d => d.family))];
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: families.length - 1 }),
        fc.integer({ min: 1, max: 359 }),
        (famIdx, hueShift) => {
          const family = families[famIdx];
          const familyDecls = derivations.filter(d => d.family === family);
          const overridden = { ...baseChannels, [`sf-${family}-h`]: (baseChannels[`sf-${family}-h`] + hueShift) % 360 };

          return familyDecls.every(decl => {
            const before = parse(resolve(decl, baseChannels));
            const after  = parse(resolve(decl, overridden));
            return !!before && !!after && before.h !== after.h;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // fast-check: every parsed derivation resolves to a valid, parseable color
  // both at its committed defaults and under random channel overrides.
  test('fast-check: parsed derivations resolve to valid colors under random overrides (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: derivations.length - 1 }),
        fc.integer({ min: 0, max: 359 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (idx, h, s, l) => {
          const decl = derivations[idx];
          const overridden = { ...baseChannels, [`sf-${decl.family}-h`]: h, [`sf-${decl.family}-s`]: s, [`sf-${decl.family}-l`]: l };
          return !!parse(resolve(decl, overridden));
        }
      ),
      { numRuns: 100 }
    );
  });
});
