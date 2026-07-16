/**
 * Negative tests for scripts/check-llm-guide.js.
 *
 * The gap this closes: check:llm-guide is a hard CI gate (Check 1: every --sf-*
 * the guide names must exist as a live token), but nothing proved it still
 * fails on a stale reference. These build a fixture (SLASHED_ROOT), confirm a
 * clean guide passes, then plant a stale token name and a missing-file case and
 * assert the gate exits non-zero.
 */
import { test, describe, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GATE = path.join(ROOT, 'scripts', 'check-llm-guide.js');

const tmpDirs = [];

function buildFixture(guideBody) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'slashed-guide-'));
  tmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, 'core'));
  fs.mkdirSync(path.join(dir, 'optional'));
  fs.mkdirSync(path.join(dir, 'docs'));

  // Live set (a): registry names.
  fs.writeFileSync(
    path.join(dir, 'token-registry.json'),
    JSON.stringify({ tokens: [{ name: '--sf-color-text' }] }),
  );
  // Live set (b): custom-property declarations in CSS source.
  fs.writeFileSync(path.join(dir, 'core', 'tokens.css'), `:root { --sf-space-m: 1rem; }\n`);
  // No public knobs → no Check-2 warnings to muddy the pass case.
  fs.writeFileSync(path.join(dir, 'docs', 'api-index.json'), JSON.stringify({ entries: [] }));

  const body = guideBody ?? `# LLM guide\n\nUse \`--sf-color-text\` for body text and \`--sf-space-m\` for gaps.\n`;
  fs.writeFileSync(path.join(dir, 'docs', 'llm-guide.md'), body);
  return dir;
}

function runGate(dir) {
  return spawnSync(process.execPath, [GATE], {
    encoding: 'utf8',
    env: { ...process.env, SLASHED_ROOT: dir },
  });
}

describe('check-llm-guide failure cases', () => {
  test('passes when every referenced token is live', () => {
    const r = runGate(buildFixture());
    assert.equal(r.status, 0, `expected pass:\n${r.stderr}`);
  });

  test('fails when the guide references a token absent from the live set', () => {
    const dir = buildFixture(
      `# LLM guide\n\nUse \`--sf-color-text\` and the removed \`--sf-ghost-token\`.\n`,
    );
    const r = runGate(dir);
    assert.equal(r.status, 1, 'expected exit 1 for a stale token reference');
    assert.match(r.stderr, /stale: --sf-ghost-token/);
  });

  test('fails when docs/llm-guide.md is missing', () => {
    const dir = buildFixture();
    fs.rmSync(path.join(dir, 'docs', 'llm-guide.md'));
    const r = runGate(dir);
    assert.equal(r.status, 1, 'expected exit 1 when the guide file is absent');
    assert.match(r.stderr, /llm-guide\.md not found/);
  });

  test('a guide ref that is only CONSUMED, never declared, is now flagged (D3)', () => {
    // core/tokens.css declares --sf-space-m but only *consumes* --sf-ghost-read
    // via var(); before #582 D3 the `[:,)]` lookahead counted the `)` after a
    // consumed token as a declaration, so the guide could name it and pass.
    const dir = buildFixture(
      `# LLM guide\n\nUse \`--sf-color-text\`, \`--sf-space-m\`, and \`--sf-ghost-read\`.\n`,
    );
    fs.writeFileSync(
      path.join(dir, 'core', 'tokens.css'),
      `:root { --sf-space-m: 1rem; gap: var(--sf-ghost-read); }\n`,
    );
    const r = runGate(dir);
    assert.equal(r.status, 1, 'a consumed-only token must not count as a live declaration');
    assert.match(r.stderr, /stale: --sf-ghost-read/);
  });

  test('fallback-only hook tokens are allowed even though undeclared (D5)', () => {
    // The real hook tokens (scripts/hook-tokens.js) are undeclared by design;
    // the guide is allowed to name them.
    const dir = buildFixture(
      `# LLM guide\n\n\`--sf-color-text\`, \`--sf-space-m\`, and hook \`--sf-color-code-block-bg\`.\n`,
    );
    const r = runGate(dir);
    assert.equal(r.status, 0, `hook tokens should be treated as live:\n${r.stderr}`);
  });

  test('a bare prefix (name ending in "-") is prose, not a checked reference', () => {
    // "--sf-color-text--on-" is glob-like prose and must NOT be flagged stale.
    const dir = buildFixture(
      `# LLM guide\n\n\`--sf-color-text\`, \`--sf-space-m\`, and patterns like --sf-color-text--on- families.\n`,
    );
    const r = runGate(dir);
    assert.equal(r.status, 0, `bare-prefix prose should not fail:\n${r.stderr}`);
  });
});

describe('check-llm-guide header token count (Check 3)', () => {
  // Builds a fixture that DOES carry a token-index.json (the committed artifact
  // production always has) so Check 3 is exercised rather than skipped.
  function buildCountFixture(headerCount, indexCount) {
    const dir = buildFixture(
      `# LLM guide\n\n> Version: **1.0.0** · Tokens: **${headerCount}** · Prefix: \`--sf-\`\n\n` +
      'Use `--sf-color-text` and `--sf-space-m`.\n',
    );
    fs.writeFileSync(
      path.join(dir, 'docs', 'token-index.json'),
      JSON.stringify({ _meta: { counts: { tokens: indexCount } } }),
    );
    return dir;
  }

  test('passes when the header count equals the live total', () => {
    const r = runGate(buildCountFixture(2, 2));
    assert.equal(r.status, 0, `matching count should pass:\n${r.stderr}`);
  });

  test('fails when the header count is stale', () => {
    const r = runGate(buildCountFixture(686, 2));
    assert.equal(r.status, 1, 'expected exit 1 for a stale token count');
    assert.match(r.stderr, /header token count "686" != live total "2"/);
  });
});

after(() => {
  for (const d of tmpDirs) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch { /* ignore */ }
  }
});
