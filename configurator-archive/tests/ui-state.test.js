/**
 * Tests for the persisted-UI-state validator (lib/uiState.js).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { sanitiseUiState, UI_STORAGE_KEY } from '../src/lib/uiState.js';
import { DOMAINS } from '../src/lib/domains.js';

describe('sanitiseUiState', () => {
  test('round-trips a valid payload', () => {
    const raw = JSON.stringify({ domain: 'motion', outputMode: 'root' });
    assert.deepEqual(sanitiseUiState(raw), { domain: 'motion', outputMode: 'root' });
  });

  test('accepts home and every domain id', () => {
    for (const domain of ['home', ...DOMAINS.map((d) => d.id)]) {
      const raw = JSON.stringify({ domain });
      assert.equal(sanitiseUiState(raw).domain, domain, domain);
    }
  });

  test('ignores a legacy mode field (flat IA has no complexity mode)', () => {
    const out = sanitiseUiState(JSON.stringify({ mode: 'advanced', domain: 'motion' }));
    assert.equal(out.mode, undefined);
    assert.equal(out.domain, 'motion');
  });

  test('drops an unknown domain id', () => {
    assert.equal(sanitiseUiState(JSON.stringify({ domain: 'nope' })).domain, undefined);
  });

  test('drops unknown values field by field', () => {
    const raw = JSON.stringify({ domain: 'nope', outputMode: 'yaml', extra: 1 });
    assert.deepEqual(sanitiseUiState(raw), {});
  });

  test('survives malformed payloads', () => {
    for (const raw of [null, '', '{not json', '42', '"string"', JSON.stringify(null), JSON.stringify([1, 2])]) {
      assert.deepEqual(sanitiseUiState(raw), {}, String(raw));
    }
  });

  test('storage key is versioned', () => {
    assert.match(UI_STORAGE_KEY, /\/v\d+$/);
  });
});
