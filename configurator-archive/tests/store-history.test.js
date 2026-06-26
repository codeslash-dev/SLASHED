/**
 * Tests for the override-history algorithms.
 *
 * Targets the runes-free `historyOps.js` (which is what `store.svelte.js`
 * actually delegates to) so we can run under `node --test` without a Svelte
 * compile pass. The test fakes the dependency surface — `sanitize`,
 * `isKnown`, `persist` — using the real `sanitizeValue` for realism.
 */
import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeValue } from '../src/lib/css.js';
import {
  setOne, clearOne, clearEvery, replaceAll, patchMany,
  applyThemeToState, undoStep, redoStep, dragSet, endDrag,
} from '../src/lib/historyOps.js';

/** Build a fresh test bag with a permissive isKnown predicate. */
function makeState(known = () => true) {
  return {
    overrides: {},
    history: { past: [], future: [] },
    limit: 50,
    sanitize: sanitizeValue,
    isKnown: known,
    persistCalls: 0,
    persist() { this.persistCalls++; },
  };
}

let s;
beforeEach(() => { s = makeState(); });

describe('setOne / clearOne', () => {
  test('first edit pushes one undo step', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    assert.equal(s.overrides['--sf-radius-scale'], '1.4');
    assert.equal(s.history.past.length, 1);
    assert.equal(s.history.future.length, 0);
    assert.equal(s.persistCalls, 1);
  });

  test('undoStep restores prior state and populates the redo stack', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    const ok = undoStep(s);
    assert.equal(ok, true);
    assert.equal(s.overrides['--sf-radius-scale'], undefined);
    assert.equal(s.history.past.length, 0);
    assert.equal(s.history.future.length, 1);
  });

  test('redoStep replays the undone change', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    undoStep(s);
    const ok = redoStep(s);
    assert.equal(ok, true);
    assert.equal(s.overrides['--sf-radius-scale'], '1.4');
    assert.equal(s.history.future.length, 0);
  });

  test('a fresh edit after undo drops the redo branch', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    undoStep(s);
    setOne(s, '--sf-color-primary-source-light', 'oklch(0.5 0.2 220)');
    assert.equal(s.history.future.length, 0, 'redo branch dropped on new edit');
  });

  test('setting the same value twice is a no-op (no extra history, no extra persist)', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    const persistsBefore = s.persistCalls;
    const lenBefore = s.history.past.length;
    const changed = setOne(s, '--sf-radius-scale', '1.4');
    assert.equal(changed, false);
    assert.equal(s.history.past.length, lenBefore);
    assert.equal(s.persistCalls, persistsBefore);
  });

  test('clearing a never-set token is a no-op', () => {
    const changed = clearOne(s, '--sf-radius-scale');
    assert.equal(changed, false);
    assert.equal(s.history.past.length, 0);
  });

  test('undoStep returns false when there is nothing to undo', () => {
    assert.equal(undoStep(s), false);
  });

  test('redoStep returns false when there is nothing to redo', () => {
    assert.equal(redoStep(s), false);
  });

  test('setting an empty/whitespace value clears the override', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    const ok = setOne(s, '--sf-radius-scale', '   ');
    assert.equal(ok, true);
    assert.equal(s.overrides['--sf-radius-scale'], undefined);
  });
});

describe('clearEvery', () => {
  test('collapses N overrides into a single undo step', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    setOne(s, '--sf-motion-scale', '0.8');
    const lenBefore = s.history.past.length;
    clearEvery(s);
    assert.equal(Object.keys(s.overrides).length, 0);
    assert.equal(s.history.past.length, lenBefore + 1);
    undoStep(s);
    assert.equal(s.overrides['--sf-radius-scale'], '1.4');
    assert.equal(s.overrides['--sf-motion-scale'], '0.8');
  });

  test('is a no-op when nothing is overridden', () => {
    const changed = clearEvery(s);
    assert.equal(changed, false);
    assert.equal(s.history.past.length, 0);
  });
});

describe('patchMany', () => {
  test('applies multiple changes as a single history step', () => {
    const n = patchMany(s, {
      '--sf-radius-scale': '1.4',
      '--sf-motion-scale': '0.5',
      '--sf-shadow-strength': '0.2',
    });
    assert.equal(n, 3);
    assert.equal(s.history.past.length, 1);
    undoStep(s);
    assert.equal(Object.keys(s.overrides).length, 0);
  });

  test('null values clear that token', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    const n = patchMany(s, { '--sf-radius-scale': null });
    assert.equal(n, 1);
    assert.equal(s.overrides['--sf-radius-scale'], undefined);
  });

  test('skips unknown token names silently', () => {
    s.isKnown = (name) => name !== '--sf-not-real';
    const n = patchMany(s, {
      '--sf-radius-scale': '1.4',
      '--sf-not-real': 'lol',
    });
    assert.equal(n, 1);
  });

  test('returns 0 and does not record history when nothing changes', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    const before = s.history.past.length;
    const n = patchMany(s, { '--sf-radius-scale': '1.4' });
    assert.equal(n, 0);
    assert.equal(s.history.past.length, before);
  });
});

describe('replaceAll', () => {
  test('replaces every override and reports applied/skipped', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    s.isKnown = (name) => name === '--sf-color-primary-source-light';
    const { applied, skipped } = replaceAll(s, {
      '--sf-color-primary-source-light': 'oklch(0.5 0.2 220)',
      '--sf-not-real': 'oops',
    });
    assert.equal(applied, 1);
    assert.deepEqual(skipped, ['--sf-not-real']);
    // pre-existing override wiped
    assert.equal(s.overrides['--sf-radius-scale'], undefined);
  });
});

describe('applyThemeToState', () => {
  test('replaces overrides with the preset map (one history step)', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    applyThemeToState(s, {
      '--sf-color-primary-source-light': 'oklch(0.5 0.2 220)',
      '--sf-shadow-strength': '0.2',
    });
    assert.equal(s.overrides['--sf-radius-scale'], undefined);
    assert.equal(s.overrides['--sf-color-primary-source-light'], 'oklch(0.5 0.2 220)');

    // single undo restores the pre-theme state
    undoStep(s);
    assert.equal(s.overrides['--sf-radius-scale'], '1.4');
    assert.equal(s.overrides['--sf-color-primary-source-light'], undefined);
  });

  test('an empty map acts as a "reset" theme', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    setOne(s, '--sf-motion-scale', '0.5');
    applyThemeToState(s, {});
    assert.equal(Object.keys(s.overrides).length, 0);
  });
});

describe('history cap', () => {
  test('the past stack is bounded — old entries fall off', () => {
    s.limit = 50;
    for (let i = 0; i < 60; i++) {
      setOne(s, '--sf-radius-scale', String(1 + i * 0.01));
    }
    assert.ok(s.history.past.length <= 50, `past.length ${s.history.past.length} should be ≤ 50`);
    // most recent value preserved on top
    assert.equal(s.overrides['--sf-radius-scale'], String(1 + 59 * 0.01));
  });
});

describe('drag-flow (dragSet + endDrag)', () => {
  test('200 dragSet ticks + one endDrag = ONE history entry, ONE persist', () => {
    // simulate a 200-tick slider drag from 1.0 to 1.5
    for (let i = 0; i <= 200; i++) {
      const v = 1 + (i / 200) * 0.5;
      dragSet(s, '--sf-space-scale', String(v));
    }
    // Mid-drag: live value updated, no history, no persist
    assert.equal(s.history.past.length, 0, 'no history during drag');
    assert.equal(s.persistCalls, 0, 'no persist during drag');
    assert.equal(s.overrides['--sf-space-scale'], '1.5');

    const ok = endDrag(s);
    assert.equal(ok, true);
    assert.equal(s.history.past.length, 1, 'exactly one history entry after drag commit');
    assert.equal(s.persistCalls, 1, 'exactly one persist after drag commit');

    // Single undo reverts the WHOLE drag back to the pre-drag state.
    undoStep(s);
    assert.equal(s.overrides['--sf-space-scale'], undefined);
  });

  test('endDrag is a no-op when no drag is pending', () => {
    assert.equal(endDrag(s), false);
    assert.equal(s.history.past.length, 0);
    assert.equal(s.persistCalls, 0);
  });

  test('endDrag is a no-op when the drag ended back at the start value', () => {
    setOne(s, '--sf-radius-scale', '1.4');
    const persistsBefore = s.persistCalls;
    const lenBefore = s.history.past.length;
    // simulate scrub up then back down
    dragSet(s, '--sf-radius-scale', '1.6');
    dragSet(s, '--sf-radius-scale', '1.5');
    dragSet(s, '--sf-radius-scale', '1.4'); // back to start
    const ok = endDrag(s);
    assert.equal(ok, false, 'no-op because final value matches pre-drag snap');
    assert.equal(s.history.past.length, lenBefore);
    assert.equal(s.persistCalls, persistsBefore);
  });

  test('a follow-up setOne auto-flushes the pending drag', () => {
    dragSet(s, '--sf-space-scale', '1.2');
    assert.equal(s.history.past.length, 0);
    // user touches a different control before releasing the slider
    setOne(s, '--sf-radius-scale', '1.4');
    assert.equal(s.history.past.length, 2, 'one entry from drag flush + one from new edit');
    // First undo reverts the new edit, second reverts the drag
    undoStep(s);
    assert.equal(s.overrides['--sf-radius-scale'], undefined);
    assert.equal(s.overrides['--sf-space-scale'], '1.2');
    undoStep(s);
    assert.equal(s.overrides['--sf-space-scale'], undefined);
  });

  test('undoStep auto-flushes a pending drag', () => {
    dragSet(s, '--sf-space-scale', '1.2');
    // The drag is uncommitted but the override is live.
    assert.equal(s.overrides['--sf-space-scale'], '1.2');
    // Triggering undo first commits the drag, then undoes it.
    undoStep(s);
    assert.equal(s.overrides['--sf-space-scale'], undefined);
  });

  test('dragSet supports unit-bearing values via sanitize()', () => {
    dragSet(s, '--sf-radius-m', '12px');
    dragSet(s, '--sf-radius-m', '14px');
    endDrag(s);
    assert.equal(s.overrides['--sf-radius-m'], '14px');
    assert.equal(s.history.past.length, 1);
  });

  test('an empty/whitespace dragSet value clears the override', () => {
    setOne(s, '--sf-radius-m', '12px');
    dragSet(s, '--sf-radius-m', '');
    assert.equal(s.overrides['--sf-radius-m'], undefined);
    endDrag(s);
    // One step from setOne, one from the drag
    assert.equal(s.history.past.length, 2);
  });
});
