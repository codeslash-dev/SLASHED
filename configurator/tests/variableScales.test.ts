/**
 * Unit tests for src/lib/variableScales.ts — the sibling-scale option lists
 * SliderRow's variable picker offers when a knob defaults to another token
 * (e.g. `--sf-gap: var(--sf-space-m)`).
 *
 * Why this matters: these lists are consumed as-is to build dropdowns whose
 * `value` strings are written straight into the exported CSS. A malformed
 * `var(--sf-…)` string, a wrong prefix, or a dropped step would silently emit
 * broken CSS. This pins the shape and the exact wire format.
 */
import { describe, test, expect } from 'vitest';
import {
  SPACE_SCALE,
  RADIUS_SCALE,
  BORDER_WIDTH_SCALE,
  CONTAINER_SCALE,
  SIZE_SCALE,
  SHADOW_SCALE,
  type VarOption,
} from '../src/lib/variableScales';

const ALL: Record<string, { scale: VarOption[]; prefix: string; steps: string[] }> = {
  SPACE_SCALE: { scale: SPACE_SCALE, prefix: 'space', steps: ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl'] },
  RADIUS_SCALE: { scale: RADIUS_SCALE, prefix: 'radius', steps: ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', 'full'] },
  BORDER_WIDTH_SCALE: { scale: BORDER_WIDTH_SCALE, prefix: 'border-width', steps: ['1', '2', '3', '4'] },
  CONTAINER_SCALE: { scale: CONTAINER_SCALE, prefix: 'container', steps: ['narrow', 'prose', 'default', 'wide', 'full'] },
  SIZE_SCALE: { scale: SIZE_SCALE, prefix: 'size', steps: ['xs', 's', 'm', 'l', 'xl'] },
  SHADOW_SCALE: { scale: SHADOW_SCALE, prefix: 'shadow', steps: ['xs', 's', 'm', 'l', 'xl'] },
};

describe.each(Object.entries(ALL))('%s', (_name, { scale, prefix, steps }) => {
  test('has one option per documented step, in order', () => {
    expect(scale.map((o) => o.label)).toEqual(steps.map((s) => `${prefix}-${s}`));
  });

  test('every value is a well-formed var(--sf-<prefix>-<step>) reference', () => {
    for (const [i, opt] of scale.entries()) {
      expect(opt.value).toBe(`var(--sf-${prefix}-${steps[i]})`);
      expect(opt.value).toMatch(/^var\(--sf-[a-z0-9-]+\)$/);
    }
  });

  test('labels are unique', () => {
    expect(new Set(scale.map((o) => o.label)).size).toBe(scale.length);
  });
});
