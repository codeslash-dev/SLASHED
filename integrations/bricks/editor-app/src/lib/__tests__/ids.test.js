import { describe, it, expect, vi } from 'vitest';
import { newClassId, getRandomUUID } from '../ids.js';

describe('getRandomUUID', () => {
  it('returns a hex-with-dashes UUID-shaped string', () => {
    const id = getRandomUUID();
    expect(id).toMatch(/^[0-9a-f-]+$/i);
    expect(id.replace(/-/g, '').length).toBeGreaterThanOrEqual(16);
  });
});

describe('newClassId', () => {
  it('returns an 8-character hex string', () => {
    const id = newClassId([]);
    expect(id).toHaveLength(8);
    expect(id).toMatch(/^[0-9a-f]{8}$/i);
  });

  it('avoids collisions with existing ids by retrying', () => {
    let n = 0;
    const seq = ['11111111-x', '22222222-x'];
    const src = vi.fn(() => seq[n++ % seq.length]);
    const id = newClassId(['11111111'], src);
    expect(id).toBe('22222222');
    expect(src).toHaveBeenCalledTimes(2);
  });

  it('throws after 16 attempts', () => {
    const src = vi.fn(() => 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
    expect(() => newClassId(['aaaaaaaa'], src)).toThrow(/id_collision_exhausted/);
    expect(src).toHaveBeenCalledTimes(16);
  });

  it('accepts an iterable or a Set as existingIds', () => {
    const set = new Set(['11111111']);
    const arr = ['11111111'];
    const src = () => '22222222-fakefake';
    expect(newClassId(set, src)).toBe('22222222');
    expect(newClassId(arr, src)).toBe('22222222');
  });

  it('handles null / undefined existingIds', () => {
    expect(() => newClassId(null)).not.toThrow();
    expect(() => newClassId(undefined)).not.toThrow();
  });
});
