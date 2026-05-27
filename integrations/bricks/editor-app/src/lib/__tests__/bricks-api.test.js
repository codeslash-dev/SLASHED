import { describe, it, expect, beforeEach } from 'vitest';
import * as api from '../bricks-api.js';

const baseState = () => ({
  header: [],
  footer: [],
  content: [
    { id: 'r',  name: 'section', parent: 0,   children: ['c1', 'c2'], label: 'Section', settings: { _cssGlobalClasses: ['old1'], _padding: '10px' } },
    { id: 'c1', name: 'heading', parent: 'r', children: [],            label: 'Heading', settings: { _cssGlobalClasses: ['old2'], _color: 'red' } },
    { id: 'c2', name: 'image',   parent: 'r', children: [],            label: 'Image',   settings: { _cssGlobalClasses: [] } },
  ],
  globalClasses: [
    { id: 'old1', name: 'old-section', settings: { _padding: '40px' } },
    { id: 'old2', name: 'old-heading', settings: { _color: 'blue' } },
  ],
});

beforeEach(() => api.__setStateForTests(baseState()));

describe('probe / isReady (Node env)', () => {
  it('probe returns false in Node (no [data-v-app])', () => {
    api.__setStateForTests(null);
    expect(api.probe()).toBe(false);
    expect(api.isReady()).toBe(false);
  });

  it('isReady is true when state has been installed', () => {
    expect(api.isReady()).toBe(true);
  });
});

describe('findElement / getSubtree', () => {
  it('finds elements across content area', () => {
    expect(api.findElement('r').label).toBe('Section');
    expect(api.findElement('c1').label).toBe('Heading');
  });

  it('returns null for unknown id and empty/non-string id', () => {
    expect(api.findElement('zzz')).toBe(null);
    expect(api.findElement('')).toBe(null);
    expect(api.findElement(null)).toBe(null);
  });

  it('builds subtree array via children, depth=0 at root', () => {
    const t = api.getSubtree('r');
    expect(t.map(n => `${n.id}:${n.depth}`)).toEqual(['r:0', 'c1:1', 'c2:1']);
  });

  it('returns [] when rootId is unknown', () => {
    expect(api.getSubtree('zzz')).toEqual([]);
  });
});


describe('upsertGlobalClass', () => {
  it('returns existing class id when name matches', () => {
    expect(api.upsertGlobalClass({ name: 'old-section' })).toBe('old1');
  });

  it('does NOT overwrite the existing class settings', () => {
    api.upsertGlobalClass({ name: 'old-section', seedSettings: { _padding: 'should_be_ignored' } });
    const found = api.getGlobalClasses().find(c => c.id === 'old1');
    expect(found.settings._padding).toBe('40px');
  });

  it('creates a new class with seedSettings when name is unknown', () => {
    const id = api.upsertGlobalClass({ name: 'card', seedSettings: { _color: 'green' } });
    expect(id).toMatch(/^[0-9a-f]{8}$/i);
    const fresh = api.getGlobalClasses().find(c => c.id === id);
    expect(fresh.settings).toEqual({ _color: 'green' });
  });

  it('throws on missing/invalid upsert', () => {
    expect(() => api.upsertGlobalClass({})).toThrow(/invalid_upsert/);
    expect(() => api.upsertGlobalClass({ name: '' })).toThrow(/invalid_upsert/);
  });
});

describe('setElementClasses / setElementLabel / mutateElementSettings', () => {
  it('replaces classes in-place when array', () => {
    const before = api.findElement('c1').settings._cssGlobalClasses;
    api.setElementClasses('c1', ['x', 'y']);
    const after = api.findElement('c1').settings._cssGlobalClasses;
    expect(after).toEqual(['x', 'y']);
    expect(after).toBe(before); // same reference (in-place splice)
  });

  it('updates label', () => {
    api.setElementLabel('c1', 'New Heading');
    expect(api.findElement('c1').label).toBe('New Heading');
  });

  it('mutator can delete a settings key', () => {
    api.mutateElementSettings('c1', (s) => { delete s._color; });
    expect(api.findElement('c1').settings._color).toBeUndefined();
  });

  it('throws when element id is missing', () => {
    expect(() => api.setElementClasses('zzz', [])).toThrow(/element_missing/);
    expect(() => api.setElementLabel('zzz', 'x')).toThrow(/element_missing/);
    expect(() => api.mutateElementSettings('zzz', () => {})).toThrow(/element_missing/);
  });
});


describe('snapshot / restore', () => {
  it('snapshot captures globalClasses + per-op elements', () => {
    const snap = api.snapshot([{ elementId: 'r' }, { elementId: 'c1' }]);
    expect(snap.globalClasses).toHaveLength(2);
    expect(snap.elements.map(e => e.id)).toEqual(['r', 'c1']);
  });

  it('restore round-trips state bit-perfectly', () => {
    const before = JSON.stringify(api.getState());
    const snap = api.snapshot([{ elementId: 'r' }, { elementId: 'c1' }, { elementId: 'c2' }]);

    // Mutate everything we snapshotted.
    api.upsertGlobalClass({ name: 'extra', seedSettings: { _color: 'pink' } });
    api.setElementClasses('r', ['extra-id']);
    api.setElementLabel('c1', 'Garbage');
    api.mutateElementSettings('c2', (s) => { s._color = 'orange'; });

    api.restore(snap);
    expect(JSON.stringify(api.getState())).toBe(before);
  });

  it('restore is a no-op when state or snap is null', () => {
    expect(() => api.restore(null)).not.toThrow();
    api.__setStateForTests(null);
    expect(() => api.restore({ globalClasses: [], elements: [] })).not.toThrow();
  });
});

describe('getApi binding', () => {
  it('exposes the contract object plan.applyPlan consumes', () => {
    const a = api.getApi();
    for (const fn of ['findElement', 'getSubtree', 'getGlobalClasses', 'upsertGlobalClass',
                       'setElementClasses', 'setElementLabel', 'mutateElementSettings',
                       'snapshot', 'restore']) {
      expect(typeof a[fn]).toBe('function');
    }
  });
});
