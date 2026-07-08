/**
 * Unit tests for the shared @supports scanner (tests/supports-helpers.js),
 * which backs both P2 (source-level) and P7 (build-level) gating tests. The
 * cases below pin the tricky invariants: braces in the @supports *prelude*
 * (the @property feature-query form) and delimiter characters inside string
 * literals must never perturb block matching.
 *
 * Run: node --test tests/supports-helpers.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { stripSupports, findUngatedModernExpressions } from './supports-helpers.js';

describe('stripSupports', () => {
  test('removes a plain @supports block', () => {
    const css = 'a{color:red}@supports (display:grid){b{color:blue}}c{color:green}';
    assert.equal(stripSupports(css), 'a{color:red}c{color:green}');
  });

  test('handles an @property feature-query prelude that contains braces', () => {
    const css =
      'a{color:red}@supports (@property --x { syntax: "<color>"; inherits: false; }) {' +
      ' @keyframes k { 50% { --x: oklch(from var(--x) 0.9 c h); } } } d{color:green}';
    const out = stripSupports(css);
    assert.ok(!out.includes('oklch(from'), 'gated keyframe must be removed');
    assert.ok(out.includes('a{color:red}') && out.includes('d{color:green}'), 'surrounding rules kept');
  });

  test('braces inside string literals do not end the block early', () => {
    // The `}` inside content:"}" must not be read as the block close, or the
    // trailing gated declaration would leak out.
    const css = '@supports (display:grid){ x{content:"}"} y{background:color-mix(in oklab,red,blue)} } z{color:green}';
    const out = stripSupports(css);
    assert.ok(!out.includes('color-mix('), 'gated color-mix must stay removed despite the "}" in a string');
    assert.ok(out.includes('z{color:green}'), 'rule after the block is preserved');
  });

  test('parens inside a prelude string do not mis-locate the body brace', () => {
    const css = '@supports (background: url("data:image/svg+xml;utf8,(){}")) { p{background:light-dark(red,blue)} } q{color:green}';
    const out = stripSupports(css);
    assert.ok(!out.includes('light-dark('), 'gated declaration removed');
    assert.ok(out.includes('q{color:green}'), 'trailing rule preserved');
  });

  test('does not match @supports appearing inside a string value', () => {
    const css = 'a{content:"@supports (x) {"}b{color:green}';
    assert.equal(stripSupports(css), css, 'string-embedded @supports text is left untouched');
  });
});

describe('findUngatedModernExpressions', () => {
  test('flags an ungated modern expression in an ordinary declaration', () => {
    const hits = findUngatedModernExpressions('.x:hover{background:color-mix(in oklab,var(--c) 8%,transparent)}');
    assert.equal(hits.length, 1);
    assert.match(hits[0], /color-mix\(\)/);
  });

  test('is clean when the expression is properly gated', () => {
    const css = '@supports (background: color-mix(in oklab, red, red)) { .x:hover{background:color-mix(in oklab,red,blue)} }';
    assert.deepEqual(findUngatedModernExpressions(css), []);
  });
});
