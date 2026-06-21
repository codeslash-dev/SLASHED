/**
 * Tests for shareable-config encoding (src/lib/share.js).
 *
 * The wire format must round-trip losslessly for valid configs, tolerate any
 * malformed input without throwing, and refuse to emit unknown tokens or
 * unsanitised values — the same safety contract as a CSS import / a stale
 * localStorage payload.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import data from '../src/data/api-index.generated.json' with { type: 'json' };
import {
  encodeOverrides,
  decodeOverrides,
  buildShareUrl,
  readShareFromHash,
  SHARE_PARAM,
} from '../src/lib/share.js';

const known = new Set(data.tokens.map((t) => t.name));
const isKnown = (name) => known.has(name);
// A real knob token to use in round-trip tests.
const realToken = data.tokens.find((t) => t.role === 'knob')?.name ?? data.tokens[0].name;

describe('encode/decode round-trip', () => {
  test('a valid map round-trips losslessly', () => {
    const map = { [realToken]: '1.25rem' };
    const decoded = decodeOverrides(encodeOverrides(map), { isKnown });
    assert.deepEqual(decoded, map);
  });

  test('multi-token maps survive', () => {
    const tokens = data.tokens.slice(0, 5).map((t) => t.name);
    const map = Object.fromEntries(tokens.map((n, i) => [n, `${i + 1}px`]));
    const decoded = decodeOverrides(encodeOverrides(map), { isKnown });
    assert.deepEqual(decoded, map);
  });

  test('empty / non-object maps encode to an empty string', () => {
    assert.equal(encodeOverrides({}), '');
    assert.equal(encodeOverrides(null), '');
    assert.equal(encodeOverrides(undefined), '');
    assert.equal(encodeOverrides('nope'), '');
  });
});

describe('decode tolerance & safety', () => {
  test('malformed payloads decode to an empty map, never throw', () => {
    for (const bad of ['', '   ', 'garbage', '!!!', '----', '@@@', null, undefined, 42]) {
      assert.deepEqual(decodeOverrides(bad, { isKnown }), {});
    }
  });

  test('unknown tokens are dropped', () => {
    const enc = encodeOverrides({ '--sf-not-a-real-token': '1rem', [realToken]: '2rem' });
    const decoded = decodeOverrides(enc, { isKnown });
    assert.deepEqual(decoded, { [realToken]: '2rem' });
  });

  test('values are sanitised (structural CSS chars stripped)', () => {
    const enc = encodeOverrides({ [realToken]: 'red; } body { display:none' });
    const decoded = decodeOverrides(enc, { isKnown });
    assert.ok(!decoded[realToken]?.includes(';'), 'semicolons stripped');
    assert.ok(!decoded[realToken]?.includes('}'), 'braces stripped');
  });

  test('a code with an unknown binary version is rejected', () => {
    // Flip the leading version byte (byte 0) of a valid code and confirm the
    // decoder rejects it wholesale rather than misreading the payload.
    const code = encodeOverrides({ [realToken]: '1rem' });
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(code.length / 4) * 4, '=');
    const bytes = Buffer.from(b64, 'base64');
    bytes[0] = 0x09; // bogus schema version
    const bogus = bytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    assert.deepEqual(decodeOverrides(bogus, { isKnown }), {});
  });
});

describe('URL helpers', () => {
  test('buildShareUrl puts the config in the fragment', () => {
    const url = buildShareUrl({ [realToken]: '1rem' }, 'https://example.com/app/');
    assert.ok(url.startsWith('https://example.com/app/#'), 'preserves base path');
    assert.ok(url.includes(`${SHARE_PARAM}=`), 'uses the share param');
    // Round-trips through readShareFromHash.
    const hash = new URL(url).hash;
    assert.deepEqual(readShareFromHash(hash, { isKnown }), { [realToken]: '1rem' });
  });

  test('buildShareUrl with no overrides clears the fragment', () => {
    const url = buildShareUrl({}, 'https://example.com/app/#c=stale');
    assert.equal(new URL(url).hash, '');
  });

  test('readShareFromHash ignores hashes without the share param', () => {
    assert.deepEqual(readShareFromHash('#section-2', { isKnown }), {});
    assert.deepEqual(readShareFromHash('', { isKnown }), {});
  });
});
