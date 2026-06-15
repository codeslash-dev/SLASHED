// SLASHED — token API surface lock.
//
// Snapshots the set of declared --sf-* token names. After API freeze
// any token rename or removal becomes a breaking change. This test
// ensures changes to the public token surface are intentional —
// adding a token is fine (CHANGELOG ### Added), removing or renaming
// requires a deliberate snapshot update with a CHANGELOG ⚠️ Breaking
// Changes entry.
//
// To update the snapshot after intentional changes:
//   1. Run the tests; the failure prints added/removed names.
//   2. Update tests/token-api.snapshot.json to match the new set.
//   3. Add a CHANGELOG entry justifying the change.
//
// This test is pure-Node (no browser). It runs under @playwright/test
// for consistency with the rest of the suite.

import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

// Source files contributing to the public token surface.
// Imported from scripts/registry-sources.js — the canonical single definition.
import { TOKEN_FILES } from '../scripts/registry-sources.js';

// Names declared inside @keyframes blocks and other contexts that
// look like tokens but aren't custom properties on :root. The regex
// already filters by --sf- prefix and `:` declaration, so this is
// only here to allow surgical exclusions if needed.
const EXCLUDED = new Set([]);

function declaredTokens() {
  const names = new Set();
  for (const rel of TOKEN_FILES) {
    const css = fs.readFileSync(path.join(ROOT, rel), 'utf8');

    // Strip /* … */ comments so example declarations inside comments
    // (used to document component tokens before activation) don't
    // pollute the surface.
    const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

    // Custom-property declarations: --sf-foo: value;
    for (const m of cssNoComments.matchAll(/(--sf-[\w-]+)\s*:/g)) {
      names.add(m[1]);
    }
    // @property registrations: @property --sf-foo { … }
    for (const m of cssNoComments.matchAll(/@property\s+(--sf-[\w-]+)/g)) {
      names.add(m[1]);
    }
  }
  for (const ex of EXCLUDED) names.delete(ex);
  return [...names].sort();
}

test('Token API: declared --sf-* names match the locked snapshot', () => {
  const SNAPSHOT_PATH = path.join(import.meta.dirname, 'token-api.snapshot.json');
  const current = declaredTokens();

  if (!fs.existsSync(SNAPSHOT_PATH)) {
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(current, null, 2) + '\n');
    throw new Error(
      `No snapshot found — created initial snapshot at ` +
      `${path.relative(ROOT, SNAPSHOT_PATH)} with ${current.length} tokens. ` +
      `Re-run tests to verify.`
    );
  }

  const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
  const added   = current.filter((t) => !snapshot.includes(t));
  const removed = snapshot.filter((t) => !current.includes(t));

  if (added.length || removed.length) {
    const lines = ['Token surface diff vs locked snapshot:'];
    if (added.length) {
      lines.push('');
      lines.push(`  Added (${added.length}):`);
      for (const t of added) lines.push(`    + ${t}`);
    }
    if (removed.length) {
      lines.push('');
      lines.push(`  Removed (${removed.length}):`);
      for (const t of removed) lines.push(`    - ${t}`);
    }
    lines.push('');
    lines.push('  If intentional:');
    lines.push(`    1. Update ${path.relative(ROOT, SNAPSHOT_PATH)}`);
    lines.push(`    2. Add a CHANGELOG entry`);
    lines.push(`       (### Added for new names; ⚠️ Breaking Changes for removals)`);
    console.log(lines.join('\n'));
  }

  expect(current).toEqual(snapshot);
});
