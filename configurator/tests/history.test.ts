/**
 * Unit tests for src/lib/history.ts — the undo-coalescing decision behind the
 * store. Pins that a continuous same-token gesture merges into one history
 * entry while distinct edits or a pause start a new one.
 */
import { describe, test, expect } from 'vitest';
import { changedKeys, shouldCoalesce, NO_COALESCE } from '../src/lib/history';

describe('changedKeys', () => {
  test('reports added, removed and altered keys', () => {
    expect(changedKeys({ a: '1' }, { a: '2' })).toEqual(['a']);              // altered
    expect(changedKeys({}, { a: '1' })).toEqual(['a']);                       // added
    expect(changedKeys({ a: '1' }, {})).toEqual(['a']);                       // removed
    expect(changedKeys({ a: '1' }, { a: '1' })).toEqual([]);                  // no change
  });
  test('reports every differing key for a multi-key change', () => {
    expect(changedKeys({ a: '1', b: '1' }, { a: '2', b: '2' }).sort()).toEqual(['a', 'b']);
  });
});

describe('shouldCoalesce', () => {
  test('merges a same-token change within the window', () => {
    expect(shouldCoalesce({ key: '--sf-x', time: 1000 }, ['--sf-x'], 1200)).toBe(true);
  });
  test('does not merge after the window elapses', () => {
    expect(shouldCoalesce({ key: '--sf-x', time: 1000 }, ['--sf-x'], 2000)).toBe(false);
  });
  test('does not merge a different token', () => {
    expect(shouldCoalesce({ key: '--sf-x', time: 1000 }, ['--sf-y'], 1100)).toBe(false);
  });
  test('does not merge a multi-key change', () => {
    expect(shouldCoalesce({ key: '--sf-x', time: 1000 }, ['--sf-x', '--sf-y'], 1100)).toBe(false);
  });
  test('never merges from the initial (null) state', () => {
    expect(shouldCoalesce(NO_COALESCE, ['--sf-x'], 1)).toBe(false);
  });
  test('respects a custom window', () => {
    expect(shouldCoalesce({ key: '--sf-x', time: 0 }, ['--sf-x'], 50, 100)).toBe(true);
    expect(shouldCoalesce({ key: '--sf-x', time: 0 }, ['--sf-x'], 150, 100)).toBe(false);
  });
});
