#!/usr/bin/env node
/**
 * CI gate: the release workflow must commit every file version-sync.js writes.
 *
 * The `sync-main` job in .github/workflows/release.yml runs `version-sync.js`
 * and then `git add <explicit list>`. If a file version-sync writes is missing
 * from that list, the bump is written to the working tree, never staged, and
 * silently discarded on commit — which is exactly how docs/llm-guide.md drifted
 * a version behind after every release.
 *
 * This gate asserts VERSION_SYNCED_FILES (scripts/version-synced-files.js) is a
 * subset of the `git add` line in the sync-main job. Paired with the write-set
 * assertion inside version-sync.js, the two close the loop: a new sync target
 * must be registered, and a registered target must be committed.
 *
 * Run:
 *   node scripts/check-release-add-list.js     # check only
 *   npm run check:release-add                   # same via npm
 */
import fs from 'node:fs';
import path from 'node:path';
import { VERSION_SYNCED_FILES } from './version-synced-files.js';

const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');
const WORKFLOW = path.join(ROOT, '.github', 'workflows', 'release.yml');

function fail(msg) {
  console.error(`check:release-add FAILED — ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(WORKFLOW)) fail('.github/workflows/release.yml not found.');
const yaml = fs.readFileSync(WORKFLOW, 'utf8');

// Scope to the sync-main job so an unrelated `git add` elsewhere can't satisfy
// the check. Job keys sit at 2-space indent; the block runs until the next
// same-indent key (or EOF).
const jobStart = yaml.search(/^ {2}sync-main:$/m);
if (jobStart === -1) fail('sync-main job not found in release.yml.');
const rest = yaml.slice(jobStart + 1);
const nextJob = rest.search(/^ {2}\S/m);
const jobBlock = nextJob === -1 ? yaml.slice(jobStart) : yaml.slice(jobStart, jobStart + 1 + nextJob);

// Collect every path token from every `git add …` line in the job. A path may
// carry a trailing backslash (line continuation) — strip it.
const addLines = [...jobBlock.matchAll(/git add ([^\n]*)/g)].map((m) => m[1]);
if (addLines.length === 0) fail('no `git add` command found in the sync-main job.');
const added = new Set(
  addLines
    .flatMap((line) => line.split(/\s+/))
    .map((tok) => tok.replace(/\\$/, '').trim())
    .filter(Boolean),
);

const missing = VERSION_SYNCED_FILES.filter((f) => !added.has(f));
if (missing.length > 0) {
  fail(
    'release.yml sync-main `git add` is missing file(s) that version-sync.js writes:\n' +
    missing.map((f) => `  - ${f}`).join('\n') +
    '\n\nAdd them to the `git add` line so the release commit does not discard their bump.',
  );
}

console.log(
  `check:release-add OK — all ${VERSION_SYNCED_FILES.length} version-synced file(s) ` +
  'are staged by the release sync-main job.',
);
