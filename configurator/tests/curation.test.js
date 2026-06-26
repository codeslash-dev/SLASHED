/**
 * Future-proofing: every public knob must have a home domain.
 *
 * If the framework adds a knob whose name no domain pattern recognises,
 * this fails with the offending names — the cue to add a pattern to
 * DOMAIN_PATTERNS in scripts/check-curation.mjs and src/lib/domains.ts.
 */
import { describe, test, expect } from 'vitest';
import { findUncategorisedKnobs } from '../scripts/check-curation.mjs';

describe('token curation coverage', () => {
  test('no public knob falls through to the Misc fallback bucket', () => {
    const orphans = findUncategorisedKnobs();
    expect(
      orphans,
      orphans.length
        ? `Uncategorised knobs (add a pattern to DOMAIN_PATTERNS): ${orphans.join(', ')}`
        : ''
    ).toEqual([]);
  });
});
