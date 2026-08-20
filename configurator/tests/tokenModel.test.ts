/**
 * Unit tests for src/lib/tokenModel.ts — the configurator's model of how tokens
 * relate to each other (role, alias target, dependency graph, override state,
 * generative scale families, value validation).
 *
 * Why this matters: this is the foundation the UX redesign builds on. Every
 * surface that warns "you are detaching a generated output" or "this inherits
 * from X" reads from here, so the classification must be pinned. The final
 * block also runs the model over the *real* baked catalogue to guarantee every
 * shipping token classifies without throwing and the graph is internally
 * consistent.
 */
import { describe, test, expect } from 'vitest';
import {
  referencesIn,
  pureVarTarget,
  aliasTargetOf,
  roleOf,
  buildDependencyGraph,
  scaleShadows,
  isGeneratedScaleStep,
  validateTokenValue,
  isStructurallySafe,
  tokenState,
  inheritsByDefault,
  summarizeChanges,
  SCALE_FAMILIES,
} from '../src/lib/tokenModel';
import type { SlashedToken } from '../src/types';
import apiIndex from '../src/data/api-index.generated.json';
import type { ApiIndex } from '../src/types';

const tok = (name: string, over: Partial<SlashedToken> = {}): SlashedToken => ({
  name,
  value: '0',
  ...over,
});

describe('referencesIn', () => {
  test('collects every distinct --sf token referenced via var()', () => {
    expect(referencesIn('color-mix(in oklab, var(--sf-color-a), var(--sf-color-b) 20%)'))
      .toEqual(['--sf-color-a', '--sf-color-b']);
  });
  test('dedupes repeated references', () => {
    expect(referencesIn('calc(var(--sf-x) + var(--sf-x))')).toEqual(['--sf-x']);
  });
  test('empty / literal values yield no references', () => {
    expect(referencesIn('1rem')).toEqual([]);
    expect(referencesIn(null)).toEqual([]);
    expect(referencesIn(undefined)).toEqual([]);
  });
});

describe('pureVarTarget', () => {
  test('matches a bare single-token reference', () => {
    expect(pureVarTarget('var(--sf-space-m)')).toBe('--sf-space-m');
  });
  test('matches a single reference with a fallback', () => {
    expect(pureVarTarget('var(--sf-gap, 1rem)')).toBe('--sf-gap');
  });
  test('rejects compound values that merely use a token', () => {
    expect(pureVarTarget('var(--sf-border-width-2) solid var(--sf-border)')).toBeNull();
    expect(pureVarTarget('calc(var(--sf-space-m) * 2)')).toBeNull();
    expect(pureVarTarget('var(--sf-space-m, 1rem))')).toBeNull();
    expect(pureVarTarget('1rem')).toBeNull();
  });
  test('rejects a var() with a fallback followed by more content', () => {
    // The fallback group is greedy; it must not span past the var()'s own `)`.
    expect(pureVarTarget('var(--sf-a, red) var(--sf-b)')).toBeNull();
    expect(pureVarTarget('var(--sf-a, red) solid')).toBeNull();
  });
  test('accepts a var() whose fallback is itself a function', () => {
    expect(pureVarTarget('var(--sf-a, calc(1rem + 2px))')).toBe('--sf-a');
  });
});

describe('aliasTargetOf', () => {
  test('prefers the framework-declared aliasOf', () => {
    expect(aliasTargetOf(tok('--sf-a', { aliasOf: '--sf-b', value: 'anything' }))).toBe('--sf-b');
  });
  test('falls back to a pure var() default value', () => {
    expect(aliasTargetOf(tok('--sf-a', { value: 'var(--sf-b)' }))).toBe('--sf-b');
  });
  test('is null for sources and compound outputs', () => {
    expect(aliasTargetOf(tok('--sf-a', { value: '1rem' }))).toBeNull();
    expect(aliasTargetOf(tok('--sf-a', { value: 'calc(var(--sf-b) + 1px)' }))).toBeNull();
  });
});

describe('roleOf', () => {
  test('a literal knob is a source', () => {
    expect(roleOf(tok('--sf-space-base-min', { value: '1', role: 'knob' }))).toBe('source');
  });
  test('a pure re-export is an alias', () => {
    expect(roleOf(tok('--sf-heading-font', { value: 'var(--sf-body-font)', role: 'consumption' }))).toBe('alias');
  });
  test('a composed consumption value is an output', () => {
    expect(roleOf(tok('--sf-x', { value: 'color-mix(in oklab, var(--sf-a), var(--sf-b))', role: 'consumption' }))).toBe('output');
  });
  test('aliasOf wins even when role is missing', () => {
    expect(roleOf(tok('--sf-x', { aliasOf: '--sf-y', value: 'x' }))).toBe('alias');
  });
});

describe('buildDependencyGraph', () => {
  const tokens: SlashedToken[] = [
    tok('--sf-base', { value: '1rem' }),
    tok('--sf-mid', { value: 'calc(var(--sf-base) * 2)' }),
    tok('--sf-top', { value: 'var(--sf-mid)' }),
    tok('--sf-selfref', { value: 'var(--sf-selfref)' }), // pathological; must not self-link
    tok('--sf-ext', { value: 'var(--sf-not-in-catalogue)' }),
  ];
  const g = buildDependencyGraph(tokens);

  test('dependsOn lists direct references within the catalogue', () => {
    expect(g.dependsOn['--sf-mid']).toEqual(['--sf-base']);
    expect(g.dependsOn['--sf-top']).toEqual(['--sf-mid']);
  });
  test('usedBy is the reverse edge', () => {
    expect(g.usedBy['--sf-base']).toEqual(['--sf-mid']);
    expect(g.usedBy['--sf-mid']).toEqual(['--sf-top']);
  });
  test('ignores self-references and unknown targets', () => {
    expect(g.dependsOn['--sf-selfref']).toEqual([]);
    expect(g.dependsOn['--sf-ext']).toEqual([]);
  });
});

describe('scale families & shadowing', () => {
  test('generated steps are recognised across all families', () => {
    expect(isGeneratedScaleStep('--sf-space-l')).toBe(true);
    expect(isGeneratedScaleStep('--sf-radius-m')).toBe(true);
    expect(isGeneratedScaleStep('--sf-border-width-2')).toBe(true);
    expect(isGeneratedScaleStep('--sf-duration-normal')).toBe(true);
    expect(isGeneratedScaleStep('--sf-space-base-min')).toBe(false); // a source, not a step
  });

  test('detects shadowed steps for radius/border/motion — the gap the audit flagged', () => {
    const shadows = scaleShadows({
      '--sf-radius-m': '10px',
      '--sf-radius-scale': '1.5',
      '--sf-border-width-2': '3px',
      '--sf-duration-normal': '400ms',
    });
    const byId = Object.fromEntries(shadows.map((s) => [s.family.id, s]));
    expect(byId.radius.shadowedSteps).toEqual(['--sf-radius-m']);
    expect(byId.radius.overriddenSources).toEqual(['--sf-radius-scale']);
    expect(byId['border-width'].shadowedSteps).toEqual(['--sf-border-width-2']);
    expect(byId.motion.shadowedSteps).toEqual(['--sf-duration-normal']);
  });

  test('does not mark scale-linked expressions as pinned', () => {
    const shadows = scaleShadows({
      '--sf-radius-m': 'var(--sf-radius-scale)',
      '--sf-radius-l': 'calc(var(--sf-radius-scale) * 2)',
      '--sf-radius-none': '0px',
    });
    expect(shadows).toHaveLength(1);
    expect(shadows[0].shadowedSteps).toEqual(['--sf-radius-none']);
  });

  test('no shadows reported when only sources are overridden', () => {
    expect(scaleShadows({ '--sf-space-scale': '1.2' })).toEqual([]);
  });
});

describe('validateTokenValue', () => {
  const t = tok('--sf-x', { syntax: '<length>' });
  test('rejects empty and CSS-breaking values', () => {
    expect(validateTokenValue(t, '').valid).toBe(false);
    expect(validateTokenValue(t, '   ').valid).toBe(false);
    expect(validateTokenValue(t, '1rem; }').valid).toBe(false);
    expect(validateTokenValue(t, 'red /* x */').valid).toBe(false);
    expect(validateTokenValue(t, 'red\u0000').valid).toBe(false);
    expect(validateTokenValue(t, 'x'.repeat(65_536)).valid).toBe(false);
  });
  test('accepts plain values and expressions under Node (structural only)', () => {
    expect(validateTokenValue(t, '1rem').valid).toBe(true);
    expect(validateTokenValue(t, 'clamp(1rem, 2vw, 3rem)').valid).toBe(true);
    expect(validateTokenValue(t, 'var(--sf-space-m)').valid).toBe(true);
  });
  test('keeps numeric grammar distinct from z-index', () => {
    const number = tok('--sf-ratio', { syntax: '<number>' });
    const integer = tok('--sf-layer', { syntax: '<integer>' });
    expect(validateTokenValue(number, '1.25').valid).toBe(true);
    expect(validateTokenValue(number, 'auto').valid).toBe(false);
    expect(validateTokenValue(integer, 'auto').valid).toBe(false);
  });
  test('rejects malformed expressions rather than treating them as safe', () => {
    expect(validateTokenValue(t, 'var(--sf-space-m, 1rem))').valid).toBe(false);
  });
});

describe('isStructurallySafe (the export-safety gate behind tokenState invalid)', () => {
  test('rejects only what export would actually drop', () => {
    expect(isStructurallySafe('')).toBe(false);
    expect(isStructurallySafe('   ')).toBe(false);
    expect(isStructurallySafe('1rem; }')).toBe(false);
    expect(isStructurallySafe('red /* x */')).toBe(false);
    // Control characters and oversized values are dropped/refused on export too.
    expect(isStructurallySafe('red\u0007')).toBe(false);
    expect(isStructurallySafe('a'.repeat(65_536))).toBe(false);
  });
  test('accepts safe values regardless of semantic oddness', () => {
    // A fractional number, an odd colour, an expression — none are *dropped*.
    expect(isStructurallySafe('1.1')).toBe(true);
    expect(isStructurallySafe('notacolor')).toBe(true);
    expect(isStructurallySafe('clamp(1rem, 2vw, 3rem)')).toBe(true);
  });
});

describe('tokenState', () => {
  const source = tok('--sf-space-base-min', { value: '1', role: 'knob' });
  const alias = tok('--sf-heading-font', { value: 'var(--sf-body-font)', role: 'consumption' });
  const output = tok('--sf-x', { value: 'color-mix(in oklab, var(--sf-a), var(--sf-b))', role: 'consumption' });
  const step = tok('--sf-radius-m', { value: '8px', role: 'knob' });

  test('no override → default', () => {
    expect(tokenState(source, {})).toBe('default');
  });
  test('concrete override on a source → custom', () => {
    expect(tokenState(source, { '--sf-space-base-min': '1.1' })).toBe('custom');
  });
  test('pure var override → relinked (deliberate re-inheritance)', () => {
    expect(tokenState(source, { '--sf-space-base-min': 'var(--sf-space-s)' })).toBe('relinked');
  });
  test('concrete override on an output → detached', () => {
    expect(tokenState(output, { '--sf-x': 'red' })).toBe('detached');
  });
  test('concrete override on an alias → detached', () => {
    expect(tokenState(alias, { '--sf-heading-font': 'Georgia, serif' })).toBe('detached');
  });
  test('concrete override on a generated scale step → detached', () => {
    expect(tokenState(step, { '--sf-radius-m': '10px' })).toBe('detached');
  });
  test('only structurally-unsafe or malformed values are invalid', () => {
    expect(tokenState(source, { '--sf-space-base-min': '1; }' })).toBe('invalid');
    // A fractional number for a <number> source remains a valid custom value.
    expect(tokenState(source, { '--sf-space-base-min': '1.1' })).toBe('custom');
    expect(tokenState(source, { '--sf-space-base-min': 'var(--sf-space-m, 1rem))' })).toBe('invalid');
    // Control characters and oversized values are dropped/refused on export.
    expect(tokenState(source, { '--sf-space-base-min': '1\u0007' })).toBe('invalid');
    expect(tokenState(source, { '--sf-space-base-min': 'a'.repeat(65_536) })).toBe('invalid');
  });
});

describe('inheritsByDefault', () => {
  test('true for aliases and tokens that reference others', () => {
    expect(inheritsByDefault(tok('--sf-a', { value: 'var(--sf-b)' }))).toBe(true);
    expect(inheritsByDefault(tok('--sf-a', { value: 'calc(var(--sf-b) + 1px)' }))).toBe(true);
  });
  test('false for literal sources', () => {
    expect(inheritsByDefault(tok('--sf-a', { value: '1rem' }))).toBe(false);
  });
});

describe('summarizeChanges', () => {
  const catalogue: SlashedToken[] = [
    tok('--sf-space-base-min', { value: '1', role: 'knob' }),      // source
    tok('--sf-heading-font', { value: 'var(--sf-body-font)', role: 'consumption' }), // alias
    tok('--sf-radius-m', { value: '8px', role: 'knob' }),          // generated step
    tok('--sf-body-font', { value: 'system-ui', role: 'knob' }),   // source
  ];

  test('buckets each override by consequence and counts the total', () => {
    const s = summarizeChanges(catalogue, {
      '--sf-space-base-min': '1.1',                 // custom
      '--sf-heading-font': 'Georgia',               // detached (alias frozen)
      '--sf-radius-m': '10px',                       // detached (scale step)
      '--sf-body-font': 'var(--sf-heading-font)',    // relinked
      '--sf-space-base-min-typo': '9',               // unknown (not a token)
      '--sf-body-font-bad': '1; }',                  // unknown key, ignored-by-name
    });
    expect(s.custom.map((e) => e.name)).toEqual(['--sf-space-base-min']);
    expect(s.detached.map((e) => e.name)).toEqual(['--sf-heading-font', '--sf-radius-m']);
    expect(s.relinked.map((e) => e.name)).toEqual(['--sf-body-font']);
    expect(s.unknown.map((e) => e.name)).toEqual(['--sf-body-font-bad', '--sf-space-base-min-typo']);
    expect(s.total).toBe(6);
  });

  test('an invalid value lands in the invalid bucket', () => {
    const s = summarizeChanges(catalogue, { '--sf-space-base-min': '1; }' });
    expect(s.invalid.map((e) => e.name)).toEqual(['--sf-space-base-min']);
    expect(s.total).toBe(1);
  });

  test('no overrides → empty summary', () => {
    const s = summarizeChanges(catalogue, {});
    expect(s.total).toBe(0);
    expect(s.detached).toEqual([]);
  });
});

// --- Real catalogue: the model must survive every shipping token ------------
describe('real baked catalogue', () => {
  const tokens = ((apiIndex as ApiIndex).tokens ?? []) as SlashedToken[];

  test('catalogue is non-trivial', () => {
    expect(tokens.length).toBeGreaterThan(500);
  });

  test('every token classifies into a role without throwing', () => {
    const counts: Record<string, number> = { source: 0, alias: 0, output: 0 };
    for (const t of tokens) counts[roleOf(t)]++;
    expect(counts.source).toBeGreaterThan(0);
    expect(counts.alias).toBeGreaterThan(0);
    expect(counts.output).toBeGreaterThan(0);
    expect(counts.source + counts.alias + counts.output).toBe(tokens.length);
  });

  test('dependency graph is internally consistent (every usedBy edge has a matching dependsOn)', () => {
    const g = buildDependencyGraph(tokens);
    for (const [target, dependents] of Object.entries(g.usedBy)) {
      for (const dep of dependents) {
        expect(g.dependsOn[dep]).toContain(target);
      }
    }
  });

  test('every scale-family source and step is a real token in the catalogue', () => {
    const names = new Set(tokens.map((t) => t.name));
    for (const family of SCALE_FAMILIES) {
      for (const s of [...family.sources, ...family.steps]) {
        expect(names.has(s), `${s} (family ${family.id}) should exist in the catalogue`).toBe(true);
      }
    }
  });
});
