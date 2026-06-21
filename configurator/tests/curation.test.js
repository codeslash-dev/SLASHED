/**
 * Future-proofing: every public knob must have a home domain.
 *
 * Mirrors scripts/check-curation.mjs so the guarantee is enforced in CI's test
 * run as well as the standalone check. If the framework adds a knob whose name
 * domains.js doesn't recognise, this fails with the offending names — the cue to
 * add a pattern (or allowlist it) so Basic/Advanced stay comprehensive.
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { findUncategorisedKnobs } from '../scripts/check-curation.mjs';

describe('token curation coverage', () => {
  test('no public knob falls through to the Misc fallback bucket', () => {
    const orphans = findUncategorisedKnobs();
    assert.deepEqual(
      orphans,
      [],
      orphans.length
        ? `Uncategorised knobs (add a pattern to src/lib/domains.js): ${orphans.join(', ')}`
        : ''
    );
  });
});
