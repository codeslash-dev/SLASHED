/**
 * Property 2: tokens.css uses @supports gating — no bare light-dark() or
 *             oklch(from…)/color-mix() declarations outside a @supports block.
 *
 * Run: node --test tests/tier1-p2-coverage.test.js
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs   from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

describe('P2: tokens.css modern expressions are @supports-gated', () => {
  test('tokens.css has no ungated light-dark() declarations', () => {
    const tokensCss = fs.readFileSync(path.join(ROOT, 'core/tokens.css'), 'utf8');
    const stripped = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '');
    let inSupports = 0;
    for (const line of stripped.split('\n')) {
      if (line.includes('@supports')) inSupports++;
      if (line.trim() === '}') { if (inSupports > 0) inSupports--; }
      if (line.includes('light-dark(') && inSupports === 0) {
        assert.fail(`Ungated light-dark() found in tokens.css: ${line.trim()}`);
      }
    }
  });

  test('tokens.css has no ungated oklch(from…) declarations', () => {
    const tokensCss = fs.readFileSync(path.join(ROOT, 'core/tokens.css'), 'utf8');
    const stripped = tokensCss.replace(/\/\*[\s\S]*?\*\//g, '');
    let inSupports = 0;
    for (const line of stripped.split('\n')) {
      if (line.includes('@supports')) inSupports++;
      if (line.trim() === '}') { if (inSupports > 0) inSupports--; }
      if ((line.includes('oklch(from') || line.includes('color-mix(')) && inSupports === 0) {
        assert.fail(`Ungated oklch(from)/color-mix() found in tokens.css: ${line.trim()}`);
      }
    }
  });
});
