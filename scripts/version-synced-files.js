/**
 * Single source of truth for the files that scripts/version-sync.js WRITES when
 * it propagates the version out of package.json.
 *
 * Why this exists: the release pipeline once wrote docs/llm-guide.md via
 * version-sync but the `sync-main` job in .github/workflows/release.yml did not
 * `git add` it, so the bumped header was silently discarded and main drifted a
 * version behind after every release. Making the write-set explicit lets two
 * guards enforce it mechanically:
 *   - version-sync.js asserts the paths it actually syncs equal this list, so a
 *     new sync target can't be added without registering it here; and
 *   - check-release-add-list.js asserts every path here appears in the release
 *     workflow's `git add`, so a registered file can't be left uncommitted.
 *
 * Note: the ROOT package.json / package-lock.json are NOT here — `npm version`
 * writes those, and CHANGELOG.md is written by changelog-release.js. This list
 * is exactly what version-sync.js itself edits.
 */

/** @type {string[]} repo-relative paths version-sync.js writes. */
export const VERSION_SYNCED_FILES = [
  'docs/roadmap.md',
  'docs/llm-guide.md',
  'configurator/package.json',
  'configurator/package-lock.json',
];
