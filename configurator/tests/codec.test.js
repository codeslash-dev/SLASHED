/**
 * Tests for the binary config codec (src/lib/codec.js).
 *
 * Contract: round-trip losslessly for known tokens, stay URL-safe (base64url,
 * no padding), skip ids the registry doesn't know (forward-compat) and ids
 * flagged removed, and never throw on malformed / truncated input.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import registry from '../src/data/token-registry.generated.json' with { type: 'json' };
import { encode, decode, CODEC_VERSION } from '../src/lib/codec.js';

const active = registry.tokens.filter((t) => !t.removed);
const t0 = active[0].name;
const t1 = active[1].name;
const t2 = active[2].name;

describe('encode/decode round-trip', () => {
  test('a single token round-trips', () => {
    const map = { [t0]: '1.25rem' };
    assert.deepEqual(decode(encode(map, registry), registry), map);
  });

  test('multi-token maps survive (incl. unicode values)', () => {
    const map = { [t0]: '10px', [t1]: 'oklch(0.7 0.1 200)', [t2]: 'café—wide' };
    assert.deepEqual(decode(encode(map, registry), registry), map);
  });

  test('encoding is deterministic regardless of key order', () => {
    const a = encode({ [t0]: '1px', [t1]: '2px' }, registry);
    const b = encode({ [t1]: '2px', [t0]: '1px' }, registry);
    assert.equal(a, b);
  });

  test('empty / invalid maps encode to an empty string', () => {
    assert.equal(encode({}, registry), '');
    assert.equal(encode(null, registry), '');
    assert.equal(encode({ [t0]: '' }, registry), ''); // empty value dropped
  });
});

describe('URL safety', () => {
  test('codes are base64url with no padding or unsafe chars', () => {
    const code = encode({ [t0]: '10px', [t1]: 'red' }, registry);
    assert.ok(code.length > 0);
    assert.match(code, /^[A-Za-z0-9_-]+$/, 'only base64url alphabet');
    assert.ok(!code.includes('='), 'no padding');
    assert.ok(!code.includes('+') && !code.includes('/'), 'no base64 chars');
  });

  test('byte 0 is the schema version', () => {
    const code = encode({ [t0]: '1px' }, registry);
    let b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    assert.equal(Buffer.from(b64, 'base64')[0], CODEC_VERSION);
  });
});

describe('forward / backward compatibility', () => {
  test('unknown ids are silently skipped', () => {
    // A registry that knows fewer tokens than the one used to encode.
    const small = { tokens: registry.tokens.slice(0, 2) };
    const code = encode({ [t0]: '1px', [t2]: '3px' }, registry);
    // t2's id isn't in `small` → dropped; t0 survives.
    assert.deepEqual(decode(code, small), { [t0]: '1px' });
  });

  test('ids outside the uint16 range are dropped, not truncated', () => {
    // An out-of-range id (0x10001) masks down to 0x0001 on the wire — if it
    // were encoded it would alias whatever token owns id 1. It must be dropped.
    const bad = {
      tokens: [
        { id: 0x10001, name: '--sf-overflow-token' },
        ...registry.tokens,
      ],
    };
    const code = encode({ '--sf-overflow-token': '9px', [t1]: '2px' }, bad);
    const out = decode(code, bad);
    assert.equal(out['--sf-overflow-token'], undefined, 'overflow id not encoded');
    assert.equal(out[t1], '2px');
  });

  test('removed tokens are not encoded', () => {
    const flagged = {
      tokens: registry.tokens.map((t) => (t.name === t0 ? { ...t, removed: true } : t)),
    };
    const code = encode({ [t0]: '1px', [t1]: '2px' }, flagged);
    assert.deepEqual(decode(code, flagged), { [t1]: '2px' });
  });

  test('a code stays decodable after the registry grows', () => {
    const code = encode({ [t0]: '1px' }, registry);
    const grown = {
      _meta: { nextId: registry._meta.nextId + 1 },
      tokens: [...registry.tokens, { id: registry._meta.nextId, name: '--sf-future-token' }],
    };
    assert.deepEqual(decode(code, grown), { [t0]: '1px' });
  });
});

describe('decode tolerance & safety', () => {
  test('malformed / truncated input returns {} and never throws', () => {
    const valid = encode({ [t0]: 'some-long-value-here' }, registry);
    const cases = ['', '   ', '!!!!', '----', valid.slice(0, 4), valid + 'AAAA', null, undefined, 42];
    for (const bad of cases) {
      assert.deepEqual(decode(bad, registry), {});
    }
  });

  test('sanitize hook is applied to decoded values', () => {
    const code = encode({ [t0]: 'red' }, registry);
    const out = decode(code, registry, { sanitize: (v) => v.toUpperCase() });
    assert.equal(out[t0], 'RED');
  });

  test('isKnown hook drops rejected token names', () => {
    const code = encode({ [t0]: '1px', [t1]: '2px' }, registry);
    const out = decode(code, registry, { isKnown: (n) => n === t1 });
    assert.deepEqual(out, { [t1]: '2px' });
  });
});
