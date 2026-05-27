import { describe, it, expect } from 'vitest';
import { buildPlan, STYLE_KEYS_ALLOWLIST } from '../plan.js';
import { defaultPolicy, readPolicy } from '../policy.js';

const policy = defaultPolicy();

const SUBTREE = [
  { id: 'r',  depth: 0, label: 'Section', settings: { _cssGlobalClasses: ['old1'], _padding: { top: '20px' } } },
  { id: 'c1', depth: 1, label: 'Heading', settings: { _cssGlobalClasses: ['old2'], _color: 'red', text: 'Hello' } },
  { id: 'c2', depth: 1, label: 'Image',   settings: { _cssGlobalClasses: [] } },
];
const EXISTING = [
  { id: 'old1', name: 'old-section', settings: { _padding: { top: '40px' } } },
  { id: 'old2', name: 'old-heading', settings: { _color: 'blue' } },
];

const rows = (block, { mod = '', include = [true, true, true] } = {}) => ([
  { id: 'r',  name: block,    modifier: '',   include: include[0] },
  { id: 'c1', name: 'heading', modifier: mod, include: include[1] },
  { id: 'c2', name: 'image',   modifier: '',  include: include[2] },
]);

const build = (mode, block, opts = {}) =>
  buildPlan({
    rootId: 'r',
    subtree: SUBTREE,
    mode,
    rows: rows(block, opts),
    policy,
    existingClasses: EXISTING,
    syncLabels: opts.syncLabels !== false,
  });

describe('buildPlan: shape', () => {
  it('returns ok:true with a serialisable plan', () => {
    const r = build('add', 'card');
    expect(r.ok).toBe(true);
    expect(r.plan.mode).toBe('add');
    expect(r.plan.rootId).toBe('r');
    expect(r.plan.blockName).toBe('card');
    expect(JSON.parse(JSON.stringify(r.plan))).toEqual(r.plan);
  });

  it('skips rows where include=false', () => {
    const r = build('add', 'card', { include: [true, false, true] });
    expect(r.plan.operations.map(o => o.elementId)).toEqual(['r', 'c2']);
  });
});


describe('buildPlan: per-mode operation semantics', () => {
  it('add: oldClassIds=[], keep=current, seed empty', () => {
    const r = build('add', 'card');
    const c1 = r.plan.operations.find(o => o.elementId === 'c1');
    expect(c1.oldClassIds).toEqual([]);
    expect(c1.keepClassIds).toEqual(['old2']);
    expect(c1.upsert.seedSettings).toEqual({});
    expect(c1.finalClassName).toBe('card__heading');
  });

  it('rename: detaches all old, seeds from first old class settings', () => {
    const r = build('rename', 'card');
    const root = r.plan.operations[0];
    expect(root.oldClassIds).toEqual(['old1']);
    expect(root.keepClassIds).toEqual([]);
    expect(root.upsert.seedSettings).toEqual({ _padding: { top: '40px' } });
  });

  it('replace: detaches old, empty seed', () => {
    const r = build('replace', 'card');
    const root = r.plan.operations[0];
    expect(root.oldClassIds).toEqual(['old1']);
    expect(root.upsert.seedSettings).toEqual({});
  });

  it('modifier: keeps old classes, suffix becomes --mod', () => {
    const r = build('modifier', 'card', { mod: 'large' });
    const c1 = r.plan.operations.find(o => o.elementId === 'c1');
    expect(c1.finalClassName).toBe('card__heading--large');
    expect(c1.keepClassIds).toEqual(['old2']);
    expect(c1.oldClassIds).toEqual([]);
  });

  it('modifier: single-dash flavor uses single dash separator', () => {
    const single = readPolicy({ flavor: 'single-dash' });
    const r = buildPlan({
      rootId: 'r', subtree: SUBTREE, mode: 'modifier',
      rows: rows('card', { mod: 'large' }),
      policy: single, existingClasses: EXISTING,
    });
    expect(r.plan.operations[1].finalClassName).toBe('card__heading-large');
  });

  it('migrate: only allowlisted keys go into seedSettings + migrateFrom', () => {
    const r = build('migrate', 'card');
    const c1 = r.plan.operations.find(o => o.elementId === 'c1');
    expect(c1.upsert.seedSettings).toEqual({ _color: 'red' });
    expect(c1.migrateFrom).toEqual({ from: 'element-settings', keys: ['_color'] });
    // 'text' is content, not in allowlist — must NOT be migrated.
    expect(c1.upsert.seedSettings).not.toHaveProperty('text');
  });
});


describe('buildPlan: errors', () => {
  it('reports invalid_chars for malformed block name', () => {
    const r = build('add', '1Bad');
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual([{ rowId: 'r', code: 'invalid_chars' }]);
  });

  it('reports reserved for prefixed block name', () => {
    const r = build('add', 'sf-stack');
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual([{ rowId: 'r', code: 'reserved' }]);
  });

  it('reports empty for whitespace-only block name', () => {
    const r = build('add', '   ');
    expect(r.ok).toBe(false);
    expect(r.errors[0].code).toBe('empty');
  });

  it('reports max_depth_exceeded when subtree exceeds policy.maxDepth', () => {
    const tight = readPolicy({ maxDepth: 0 });
    // maxDepth=0 means unlimited per docs; use 0->unlimited rule, then a real bound.
    const bound = readPolicy({ maxDepth: 1 });
    const deep = SUBTREE.concat([{ id: 'g', depth: 2, label: 'Deep', settings: {} }]);
    const r = buildPlan({
      rootId: 'r', subtree: deep, mode: 'add',
      rows: [...rows('card'), { id: 'g', name: 'deep', modifier: '', include: true }],
      policy: bound, existingClasses: EXISTING,
    });
    expect(r.ok).toBe(false);
    expect(r.errors[0]).toEqual({ rowId: 'g', code: 'max_depth_exceeded' });
    // Confirm tight (=0) is unlimited: same input passes.
    const r2 = buildPlan({
      rootId: 'r', subtree: deep, mode: 'add',
      rows: [...rows('card'), { id: 'g', name: 'deep', modifier: '', include: true }],
      policy: tight, existingClasses: EXISTING,
    });
    expect(r2.ok).toBe(true);
  });

  it('reports duplicate_in_plan when two rows resolve to the same name', () => {
    const r = buildPlan({
      rootId: 'r', subtree: SUBTREE, mode: 'add',
      rows: [
        { id: 'r',  name: 'card',    modifier: '', include: true },
        { id: 'c1', name: 'item',    modifier: '', include: true },
        { id: 'c2', name: 'item',    modifier: '', include: true }, // dup
      ],
      policy, existingClasses: EXISTING,
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some(e => e.code === 'duplicate_in_plan')).toBe(true);
  });
});


describe('buildPlan: label sync', () => {
  it('produces newLabel from final class name (skip in modifier mode)', () => {
    const r = build('rename', 'card');
    expect(r.plan.operations[0].newLabel).toBe('Card');
    expect(r.plan.operations[1].newLabel).toBe('Heading');

    const m = build('modifier', 'card', { mod: 'large' });
    expect(m.plan.operations[1].newLabel).toBe(null);
  });

  it('respects syncLabels=false', () => {
    const r = build('rename', 'card', { syncLabels: false });
    for (const op of r.plan.operations) expect(op.newLabel).toBe(null);
  });
});

describe('STYLE_KEYS_ALLOWLIST', () => {
  it('is a frozen Set with at least 50 keys covering common style namespaces', () => {
    expect(STYLE_KEYS_ALLOWLIST instanceof Set).toBe(true);
    expect(STYLE_KEYS_ALLOWLIST.size).toBeGreaterThanOrEqual(50);
    for (const k of ['_padding', '_margin', '_color', '_typography', '_border', '_zIndex']) {
      expect(STYLE_KEYS_ALLOWLIST.has(k)).toBe(true);
    }
  });

  it('does NOT include content keys like text/title/image', () => {
    for (const k of ['text', 'title', 'image', 'content', 'html']) {
      expect(STYLE_KEYS_ALLOWLIST.has(k)).toBe(false);
    }
  });
});
