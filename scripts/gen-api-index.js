#!/usr/bin/env node
/**
 * Generates the SLASHED API INDEX — a single machine-readable catalogue of
 * EVERY public surface element in the framework (design tokens AND classes),
 * each row carrying rich, spreadsheet-style metadata columns.
 *
 * Run: npm run docs:api   (or: node scripts/gen-api-index.js)
 *
 * Outputs (generated from source, never hand-edited):
 *   docs/api-index.json  — machine-readable rows for integrations
 *   docs/api-index.md    — human-readable, grouped browseable tables
 *
 * Intended consumers: editor integrations, autocomplete / IntelliSense
 * providers, tooltip-hint generators, design-tool plugins, documentation
 * sites — anything that wants a structured inventory of the framework with
 * categories, descriptions, stability tiers and bundle membership.
 *
 * This script is a strict superset of the data in registry.json and
 * token-index.json. It reuses their canonical parsing contract:
 *   1. Block comments are stripped/masked before pattern matching.
 *   2. CSS string literals are masked before class matching.
 *   3. Tokens are read only from TOKEN_FILES; classes only from CLASS_FILES.
 *   4. Token tiers come from scripts/token-tiers.js (single source of truth).
 * so its token/class counts line up with the other generators.
 *
 * Descriptions and groups prefer curated docs metadata, then fall back to the
 * previous generated API index, and finally to concise source section banners.
 * This keeps source CSS comments terse without erasing public API docs.
 *
 * SL-006: extraction (reading source/annotations/the previous index and
 * assembling entries) lives in scripts/lib/api-index/extract.js; rendering
 * the Markdown companion lives in scripts/lib/api-index/render.js. This file
 * is now just the path constants, the write-time regression guard, and the
 * orchestration in main().
 */

import fs   from 'node:fs';
import path from 'node:path';
import { TOKEN_FILES, CLASS_FILES } from './registry-sources.js';
import {
  readAnnotations, readExistingApiIndex, buildBundleMap,
  buildTokenEntries, buildClassEntries, finalizeEntry, tally,
} from './lib/api-index/extract.js';
import { buildMarkdown } from './lib/api-index/render.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT    = path.join(ROOT, 'docs', 'api-index.json');
const OUT_MD = path.join(ROOT, 'docs', 'api-index.md');

const ANNOTATIONS_FILE = path.join(ROOT, 'docs', 'token-annotations.json');

/**
 * Entry point: assemble token + class entries, build counts and the column
 * schema, and write docs/api-index.json and docs/api-index.md.
 */
function main() {
  const { bundlesFor, allBundles } = buildBundleMap(ROOT);
  const rank = new Map(allBundles.map((b, i) => [b, i]));
  const bundleOrderRank = b => (rank.has(b) ? rank.get(b) : Number.MAX_SAFE_INTEGER);

  const annotations = readAnnotations(ANNOTATIONS_FILE);
  const existing = readExistingApiIndex(OUT);
  const tokenMap   = buildTokenEntries(ROOT, bundlesFor, annotations.tokens, existing.tokens);
  const classMap   = buildClassEntries(ROOT, bundlesFor, annotations.classes, existing.classes);

  const tokenEntries = [...tokenMap.values()]
    .map(e => finalizeEntry(e, bundleOrderRank))
    .sort((a, b) => a.name.localeCompare(b.name));

  const classEntries = [...classMap.values()]
    .map(e => finalizeEntry(e, bundleOrderRank))
    .sort((a, b) => a.name.localeCompare(b.name));

  // One flat, sorted rows array — tokens first, then classes; each block
  // alphabetised. This is the "spreadsheet": every row is one element.
  const entries = [...tokenEntries, ...classEntries];

  const sfClasses = classEntries.filter(e => e.prefix === 'sf');
  const isClasses = classEntries.filter(e => e.prefix === 'sf-is');
  const unprefixed = classEntries.filter(e => e.prefix === '');

  const tierCounts = tally(entries, 'tier');
  const typeCounts = tally(entries, 'type');
  const categoryCounts = tally(entries, 'category');

  const schema = {
    name:        'Element identifier (token custom-property name incl. leading --, or class name without leading dot).',
    type:        "Either 'token' or 'class'.",
    tier:        "Stability tier: PUBLIC | PUBLIC-ADVANCED | INTERNAL (see docs/architecture.md).",
    role:        "TOKEN: 'knob' (input you set — a literal primitive) or 'consumption' (output you read — derived from other tokens via var(--sf-…)). Orthogonal to tier; no SemVer meaning.",
    category:    'High-level, human-facing area derived from the source file.',
    area:        'Short machine slug for the area (core, layout, macros, states, forms, …).',
    group:       'Finer-grained section, derived from the nearest section-banner comment in source.',
    description: 'Documentation hint derived from section-banner / attached comments (may be empty).',
    sourceFiles: 'Array of source CSS files that declare the element.',
    layer:       'The CSS @layer the element lives in (e.g. slashed.layout).',
    bundles:     'Array of bundle tiers that ship the element (optimal, full).',
    optional:    'True when the element ships from optional/ (not core).',
    // token-only
    namespace:   'TOKEN: second name segment, a filterable facet (color, space, font, radius, shadow, …).',
    value:       'TOKEN: default/declared value (last declaration wins; @property initial-value when registered).',
    aliasOf:     'TOKEN: target token when value is exactly one var(--sf-x) reference, else null.',
    registered:  'TOKEN: declared via @property (typed registration).',
    animatable:  'TOKEN: animatable/transition-able (true for @property-registered tokens).',
    syntax:      'TOKEN: @property syntax descriptor (e.g. <color>), else null.',
    inherits:    'TOKEN: @property inherits flag, else null.',
    // class-only
    selector:    'CLASS: the CSS selector form (.name).',
    prefix:      "CLASS: 'sf' | 'sf-is' | '' (unprefixed).",
    kind:        'CLASS: element family (layout, macro, state, accessibility, motion, print, form, component, theme).',
    isVariant:   'CLASS: true when it is a BEM modifier (contains --).',
    baseClass:   'CLASS: the base class name when isVariant, else null.',
  };

  const output = {
    _meta: {
      generated_by: 'scripts/gen-api-index.js',
      description:
        'Unified machine-readable index of every SLASHED design token and class, ' +
        'with categories, descriptions, stability tiers and bundle membership. ' +
        'Generated from source — do not edit by hand (run: npm run docs:api).',
      token_sources: TOKEN_FILES,
      class_sources: CLASS_FILES,
      bundles: allBundles,
      counts: {
        total: entries.length,
        by_type: typeCounts,
        by_tier: tierCounts,
        by_role: tally(entries, 'role'),
        tokens: tokenEntries.length,
        classes: classEntries.length,
        sf_classes: sfClasses.length,
        is_classes: isClasses.length,
        unprefixed_classes: unprefixed.length,
        by_category: categoryCounts,
      },
      schema,
    },
    entries,
  };

  // Regression guard (SL-010/SL-012): a bad regex change in one of the
  // extraction passes should fail loudly, not silently truncate the index
  // every consumer (gen-token-registry.js, check:llm-guide, the
  // configurator sync) trusts. `existing` was already read above for the
  // description/group compat overlay, so this is free.
  const previousTotal = existing.tokens.size + existing.classes.size;
  if (previousTotal > 0 && entries.length < previousTotal * 0.8) {
    throw new Error(
      `[docs:api] refusing to write ${OUT}: entry count dropped from ` +
        `${previousTotal} to ${entries.length} (>20% shrink) — looks like a parsing regression, not an intentional change.`
    );
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const md = buildMarkdown({ entries, tokenEntries, classEntries, tierCounts, typeCounts });
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    `[docs] → docs/api-index.json + docs/api-index.md ` +
    `(${entries.length} elements: ${tokenEntries.length} tokens, ${classEntries.length} classes; ` +
    `${sfClasses.length} .sf-, ${isClasses.length} .sf-is-, ${unprefixed.length} unprefixed)`
  );
}

main();
