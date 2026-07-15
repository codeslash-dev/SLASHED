/**
 * Tests for scripts/lib/parse.js — the shared CSS/file-reading helpers
 * consolidated from 6 generator/audit scripts (SL-007). The PR that
 * introduced this module relies on "generated docs output is byte-identical"
 * as its correctness signal; these tests guard the shared surface itself so
 * a future regex/logic change fails fast here instead of only showing up as
 * a silent docs diff.
 *
 * Run: node --test tests/parse-lib.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  stripComments, stripStrings, maskComments, maskStrings,
  readValue, readFile, requireFile,
} from '../scripts/lib/parse.js';
import {
  collectComments,
  describe as describeElement,
  extractClassesFromFile,
} from '../scripts/lib/api-index/extract.js';

describe('stripComments vs maskComments', () => {
  const css = '.a { color: red; } /* comment */ .b { color: blue; }';

  test('stripComments removes the comment body, shortening the string', () => {
    const result = stripComments(css);
    assert.equal(result.includes('comment'), false);
    assert.ok(result.length < css.length);
  });

  test('maskComments preserves the original length and every non-comment character offset', () => {
    const result = maskComments(css);
    assert.equal(result.length, css.length);
    // Everything outside the comment is untouched, so a match found in the
    // masked text lands on the same offset in the original.
    const bIndex = css.indexOf('.b');
    assert.equal(result.indexOf('.b'), bIndex);
    assert.equal(result.includes('comment'), false); // body is blanked
  });

  test('maskComments preserves embedded newlines (offset math stays line-accurate)', () => {
    const multiline = '.a {}\n/* line1\nline2 */\n.b {}';
    const masked = maskComments(multiline);
    assert.equal(masked.length, multiline.length);
    assert.equal(masked.split('\n').length, multiline.split('\n').length);
  });
});

describe('stripStrings vs maskStrings', () => {
  const css = '.a::before { content: "hello"; } .b { color: red; }';

  test('stripStrings collapses the string literal, shortening the string', () => {
    const result = stripStrings(css);
    assert.equal(result.includes('hello'), false);
    assert.ok(result.length < css.length);
  });

  test('maskStrings preserves length and offsets outside the string', () => {
    const result = maskStrings(css);
    assert.equal(result.length, css.length);
    const bIndex = css.indexOf('.b');
    assert.equal(result.indexOf('.b'), bIndex);
  });
});

describe('readValue', () => {
  test('reads a simple declaration up to the terminating semicolon', () => {
    const css = '--sf-space-m: 1rem;';
    assert.equal(readValue(css, css.indexOf(':')), '1rem');
  });

  test('does not terminate on a semicolon nested inside parentheses', () => {
    // clamp()/light-dark() style values can't contain a literal ';' in real
    // CSS, but the depth counter must still ignore ')' vs top-level ';'
    // correctly for nested function calls generally.
    const css = '--sf-x: clamp(1rem, calc(1rem + 2vw), 3rem);';
    assert.equal(readValue(css, css.indexOf(':')), 'clamp(1rem, calc(1rem + 2vw), 3rem)');
  });

  test('handles deeply nested parentheses without losing the outer close', () => {
    const css = '--sf-y: oklch(from var(--sf-color-base) clamp(0.1, calc(l - 0.04), 0.9) c h);';
    const value = readValue(css, css.indexOf(':'));
    assert.equal(value, 'oklch(from var(--sf-color-base) clamp(0.1, calc(l - 0.04), 0.9) c h)');
  });

  test('collapses internal whitespace and trims the result', () => {
    const css = '--sf-z:   1   2   ;';
    assert.equal(readValue(css, css.indexOf(':')), '1 2');
  });
});

describe('readFile vs requireFile — missing-file behavior', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'parse-lib-test-'));
  const existingRel = 'present.css';
  fs.writeFileSync(path.join(root, existingRel), '.a {}', 'utf8');
  const missingRel = 'does-not-exist.css';

  test('readFile returns contents for a file that exists', () => {
    assert.equal(readFile(existingRel, root), '.a {}');
  });

  test('readFile has no existence check — a missing file throws Node\'s own ENOENT', () => {
    assert.throws(() => readFile(missingRel, root), /ENOENT/);
  });

  test('requireFile returns contents for a file that exists', () => {
    assert.equal(requireFile(existingRel, root, 'should not be thrown'), '.a {}');
  });

  test('requireFile throws the supplied custom message for a missing file, not ENOENT', () => {
    assert.throws(
      () => requireFile(missingRel, root, '[test] custom missing-file message'),
      (err) => err.message === '[test] custom missing-file message',
    );
  });
});

describe('collectComments / describe — directive comments never become descriptions', () => {
  // Synthetic reproduction of a historical directive-comment leak: a
  // stylelint-disable comment sits right above a vendor-prefixed declaration
  // inside the base rule, with no comment of their own governing the variant
  // selectors that follow — those variants must fall back to the base rule's
  // governing note, never inherit the stylelint-disable directive as a
  // description.
  const css = `
    /* Masked shape — an element clipped by a radial-gradient mask. */
    .sf-mask-cut {
      /* stylelint-disable-next-line property-no-vendor-prefix -- required for Safari < 18 */
      -webkit-mask-image: radial-gradient(circle, transparent 1rem, black 1rem);
    }
    .sf-mask-cut--top-left { --sf-mask-cut-at: 0 0; }
  `;

  test('a stylelint-disable comment is classified as a directive, not a note', () => {
    const comments = collectComments(css);
    const directive = comments.find(c => c.raw.includes('stylelint-disable'));
    assert.ok(directive, 'expected to find the stylelint-disable comment');
    assert.equal(directive.isDirective, true);
  });

  test('a variant selector with no comment of its own falls back to the governing note, not the directive', () => {
    const comments = collectComments(css);
    const idx = css.indexOf('.sf-mask-cut--top-left');
    const { description } = describeElement(comments, idx);
    assert.ok(!description.includes('stylelint-disable'));
    assert.match(description, /masked shape/i);
  });
});

describe('api-index class extraction namespace guards', () => {
  test('legacy .is-* selectors throw instead of becoming unprefixed API classes', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'api-index-class-guard-'));
    fs.mkdirSync(path.join(root, 'core'), { recursive: true });
    fs.writeFileSync(
      path.join(root, 'core/states.css'),
      '@layer slashed.states { .is-open { --sf-is-open: 1; } }',
      'utf8',
    );

    assert.throws(
      () => extractClassesFromFile('core/states.css', root, () => ['optimal']),
      /Legacy state selector \.is-open/,
    );
  });
});
