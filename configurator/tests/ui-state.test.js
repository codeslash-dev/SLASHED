/**
 * Tests for the persisted-UI-state validator (lib/uiState.js).
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { sanitiseUiState, UI_STORAGE_KEY } from '../src/lib/uiState.js';
import { BASIC_DOMAIN_IDS } from '../src/lib/domains.js';

describe('sanitiseUiState', () => {
  test('round-trips a fully valid payload', () => {
    const raw = JSON.stringify({ mode: 'advanced', domain: 'motion', outputMode: 'root' });
    assert.deepEqual(sanitiseUiState(raw), { mode: 'advanced', domain: 'motion', outputMode: 'root' });
  });

  test('accepts home and every checklist domain in basic mode', () => {
    for (const domain of ['home', ...BASIC_DOMAIN_IDS]) {
      const raw = JSON.stringify({ mode: 'basic', domain });
      assert.equal(sanitiseUiState(raw).domain, domain, domain);
    }
  });

  test('drops a domain invalid for the saved mode', () => {
    // motion is advanced-only; home does not exist in advanced.
    assert.equal(sanitiseUiState(JSON.stringify({ mode: 'basic', domain: 'motion' })).domain, undefined);
    assert.equal(sanitiseUiState(JSON.stringify({ mode: 'advanced', domain: 'home' })).domain, undefined);
  });

  test('drops unknown values field by field', () => {
    const raw = JSON.stringify({ mode: 'turbo', domain: 'nope', outputMode: 'yaml', extra: 1 });
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
