import { describe, it, expect } from 'vitest';
import {
  validateName,
  buildBlockName,
  buildElementName,
  buildModifierName,
} from '../bem.js';
import { defaultPolicy, readPolicy } from '../policy.js';

const p = defaultPolicy();

describe('validateName: defaults', () => {
  it.each([
    ['card', true],
    ['site-header', true],
    ['x', true],
    ['x1', true],
  ])('accepts valid kebab block %s', (name, ok) => {
    expect(validateName(name, 'block', p).ok).toBe(ok);
  });

  it('rejects empty input with code "empty"', () => {
    expect(validateName('', 'block', p)).toMatchObject({ ok: false, code: 'empty' });
  });

  it('rejects names with uppercase / leading digit / illegal chars', () => {
    for (const bad of ['Card', '1card', 'card_title', 'card title', '-card', 'card-']) {
      expect(validateName(bad, 'block', p)).toMatchObject({ ok: false, code: 'invalid_chars' });
    }
  });

  it('rejects names with reservedPrefix as block', () => {
    expect(validateName('sf-stack', 'block', p)).toMatchObject({ ok: false, code: 'reserved' });
    expect(validateName('is-active', 'block', p)).toMatchObject({ ok: false, code: 'reserved' });
  });

  it('rejects CSS keyword reservation regardless of role', () => {
    for (const role of ['block', 'element', 'modifier']) {
      expect(validateName('auto', role, p)).toMatchObject({ ok: false, code: 'reserved' });
      expect(validateName('inherit', role, p)).toMatchObject({ ok: false, code: 'reserved' });
    }
  });

  it('allows reservedPrefix on element or modifier role (final-name check is in plan.js)', () => {
    expect(validateName('sf-stack', 'element', p).ok).toBe(true);
  });

  it('returns invalid_role for unknown role', () => {
    expect(validateName('card', 'banana', p)).toMatchObject({ ok: false, code: 'invalid_role' });
  });
});


describe('buildBlockName / buildElementName / buildModifierName', () => {
  it('slugifies and validates the block name', () => {
    expect(buildBlockName('Card Title', p)).toBe('card-title');
    expect(buildBlockName('---', p)).toBe('');
    expect(buildBlockName('sf-stack', p)).toBe(''); // reserved
  });

  it('joins parts with __ for elements (two-dash)', () => {
    expect(buildElementName('card', 'Title', p)).toBe('card__title');
  });

  it('returns "" when the block portion is invalid', () => {
    expect(buildElementName('Card', 'title', p)).toBe('');
  });

  it('joins parts with -- for modifiers in two-dash flavor', () => {
    expect(buildModifierName('card', 'primary', p)).toBe('card--primary');
  });

  it('joins parts with - for modifiers in single-dash flavor', () => {
    const single = readPolicy({ flavor: 'single-dash' });
    expect(buildModifierName('card', 'primary', single)).toBe('card-primary');
  });

  it('returns "" for empty modifier or empty base', () => {
    expect(buildModifierName('card', '', p)).toBe('');
    expect(buildModifierName('', 'primary', p)).toBe('');
  });
});
