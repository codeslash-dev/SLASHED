import { describe, it, expect, beforeEach } from 'vitest';
import { push, pop, clear, size } from '../undo.js';

beforeEach(() => clear());

describe('undo ring buffer', () => {
  it('starts empty', () => {
    expect(size()).toBe(0);
    expect(pop()).toBe(null);
  });

  it('push then pop returns the same snapshot', () => {
    const snap = { a: 1 };
    push(snap);
    expect(size()).toBe(1);
    expect(pop()).toBe(snap);
    expect(size()).toBe(0);
  });

  it('LIFO order: most-recent push is popped first', () => {
    push({ tag: 'a' });
    push({ tag: 'b' });
    push({ tag: 'c' });
    expect(pop().tag).toBe('c');
    expect(pop().tag).toBe('b');
    expect(pop().tag).toBe('a');
  });

  it('evicts oldest entries beyond MAX=5', () => {
    for (const tag of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) push({ tag });
    expect(size()).toBe(5);
    // First two pushes should have been evicted.
    const tags = [];
    while (size() > 0) tags.push(pop().tag);
    expect(tags).toEqual(['g', 'f', 'e', 'd', 'c']);
  });

  it('ignores null / undefined snapshots', () => {
    push(null);
    push(undefined);
    expect(size()).toBe(0);
  });

  it('clear empties the buffer', () => {
    push({ tag: 'a' });
    push({ tag: 'b' });
    clear();
    expect(size()).toBe(0);
    expect(pop()).toBe(null);
  });
});
