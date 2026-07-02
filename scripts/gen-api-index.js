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
 */

import fs   from 'node:fs';
import path from 'node:path';
import { TOKEN_FILES, CLASS_FILES } from './registry-sources.js';
import { tierOf, roleOf } from './token-tiers.js';
import { maskComments, maskStrings, readValue, requireFile } from './lib/parse.js';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT    = path.join(ROOT, 'docs', 'api-index.json');
const OUT_MD = path.join(ROOT, 'docs', 'api-index.md');

const BUNDLE_CONFIG      = 'bundle.config.json';
const ANNOTATIONS_FILE   = path.join(ROOT, 'docs', 'token-annotations.json');

/**
 * Read docs/token-annotations.json — the curated overlay for per-token notes
 * and per-class descriptions. Returns a shape with `tokens` and `classes`
 * objects; both default to {} when the file is absent or unreadable.
 * @returns {{ tokens: Record<string,string>, classes: Record<string,string> }}
 */
function readAnnotations() {
  if (!fs.existsSync(ANNOTATIONS_FILE)) return { tokens: {}, classes: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(ANNOTATIONS_FILE, 'utf8'));
    return {
      tokens:  parsed.tokens  ?? {},
      classes: parsed.classes ?? {},
    };
  } catch (err) {
    console.warn(`[docs] Failed to parse ${ANNOTATIONS_FILE}:`, err.message);
    return { tokens: {}, classes: {} };
  }
}

/**
 * Read the previously generated API index as a compatibility overlay. This
 * preserves curated groups/descriptions when source comments are intentionally
 * reduced to terse category markers.
 * @returns {{ tokens: Map<string, object>, classes: Map<string, object> }}
 */
function readExistingApiIndex() {
  const empty = { tokens: new Map(), classes: new Map() };
  if (!fs.existsSync(OUT)) return empty;
  try {
    const parsed = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    const tokens = new Map();
    const classes = new Map();
    for (const entry of parsed.entries ?? []) {
      if (entry.type === 'token') tokens.set(entry.name, entry);
      if (entry.type === 'class') classes.set(entry.name, entry);
    }
    return { tokens, classes };
  } catch (err) {
    console.warn(`[docs] Failed to parse existing ${OUT}:`, err.message);
    return empty;
  }
}

function isUsefulDescription(description) {
  return Boolean(description && !/^SLASHED\s+[—-]/.test(description));
}

// ── Per-file metadata ─────────────────────────────────────────────────────────
// `category` is the high-level, human-facing area. `area` is a short machine
// slug. `kind` is the element family produced by the file.
const FILE_META = {
  // Token files
  'core/tokens.css':                    { category: 'Core tokens',              area: 'core',     kind: 'token' },
  'core/tokens.layout.css':             { category: 'Layout tokens',            area: 'layout',   kind: 'token' },
  'core/tokens.macros.css':             { category: 'Macro tokens',             area: 'macros',   kind: 'token' },
  'optional/tokens.components.css':     { category: 'Component tokens',         area: 'components', kind: 'token' },
  // Class files
  'core/layout.css':            { category: 'Layout primitives',     area: 'layout',        kind: 'layout'        },
  'core/macros.css':            { category: 'Macro classes',         area: 'macros',        kind: 'macro'         },
  'core/states.css':            { category: 'State classes',         area: 'states',        kind: 'state'         },
  'core/accessibility.css':     { category: 'Accessibility',         area: 'accessibility', kind: 'accessibility' },
  'core/motion.css':            { category: 'Motion / animation',    area: 'motion',        kind: 'motion'        },
  'core/print.css':             { category: 'Print',                 area: 'print',         kind: 'print'         },
  'core/themes.css':            { category: 'Theme utilities',        area: 'theme',         kind: 'theme'         },
  'optional/forms.css':         { category: 'Forms (classless)',     area: 'forms',         kind: 'form'          },
  'optional/components.css':    { category: 'Components',             area: 'components',    kind: 'component'     },
  'optional/theme-example.css': { category: 'Theme example',         area: 'theme',         kind: 'theme'         },
};

// ── Source masking (length-preserving) ─────────────────────────────────────────
// Replacing comment/string bodies with spaces (NOT removing them) keeps every
// character index stable, so a token/class match found in the masked text can
// be looked up against section banners parsed from the original text.
// maskComments/maskStrings (offset-preserving) come from scripts/lib/parse.js —
// NOT the same contract as that module's stripComments/stripStrings.

function readFile(rel) {
  return requireFile(rel, ROOT, `[docs:api] Missing source file: ${rel}`);
}

// ── Section-banner parsing ──────────────────────────────────────────────────
// A "banner" is a block comment that contains a long divider run (>=10 of '='
// or '-'). The file-header comment (starts with "SLASHED —" at offset 0) is
// recognised separately and never used as an element's group — regardless of
// whether it contains a divider run. Plain NOTE comments (no divider) are not
// treated as section banners.

const DIVIDER_RUN = /[-=─═]{10,}/;

/**
 * True when a comment line is purely a divider rule (ASCII or box-drawing).
 * @param {string} line trimmed comment line
 * @returns {boolean}
 */
function lineIsDivider(line) {
  const compact = line.replace(/\s/g, '');
  return compact.length >= 4 && /^[-=─═]+$/.test(compact);
}

/**
 * Parse a section-banner comment into a `{ title, description }` pair, stripping
 * divider fences and promoting an inline `Title — lead` description.
 * @param {string} raw the raw block comment (including delimiters)
 * @returns {{title: string, description: string}}
 */
function parseBanner(raw) {
  const inner = raw.replace(/^\/\*+/, '').replace(/\*+\/$/, '');
  const rawLines = inner.split('\n')
    .map(l => l.replace(/^\s*\*?\s?/, '').trimEnd())
    .map(l => l.trim());

  const lines = [];
  for (let line of rawLines) {
    if (!line) continue;
    // "-- Title --------" form (ASCII or box-drawing fences): strip the fences.
    const fenced = /^[-─]{2,}\s*(.*?)\s*[-─]{2,}$/.exec(line);
    if (fenced) { if (fenced[1]) lines.push(fenced[1]); continue; }
    if (lineIsDivider(line)) continue;
    lines.push(line);
  }
  if (!lines.length) return { title: '', description: '' };

  let title = lines[0];
  let rest  = lines.slice(1);

  // A title like "Flow — distance between flow children" carries an inline
  // description after an em/en dash (or " - "). Split it off as lead text.
  const dash = /^(.+?)\s+[—–]\s+(.+)$/.exec(title) || /^(.+?)\s+-\s+(.+)$/.exec(title);
  let lead = '';
  if (dash) { title = dash[1].trim(); lead = dash[2].trim(); }

  // Section banners in tokens.css are prefixed with the at-rule they document
  // (e.g. "@property — BRAND COLORS …"). The keyword is noise as a group name —
  // promote the part after the dash to be the title instead.
  if (/^@[\w-]+$/.test(title) && lead) {
    title = lead;
    lead = '';
  }

  const description = [lead, ...rest]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { title, description };
}

/**
 * Collect every block comment with its position and classification
 * (file header vs. section banner vs. plain note) for context lookups.
 * @param {string} css source CSS (comments intact)
 * @returns {Array<object>} ordered comment records
 */
function collectComments(css) {
  const comments = [];
  for (const m of css.matchAll(/\/\*[\s\S]*?\*\//g)) {
    const raw    = m[0];
    const start  = m.index;
    const end    = m.index + raw.length;
    const isHeader = /SLASHED\s+[—-]/.test(raw) && start < 4;
    // A banner is either a divider-fenced comment, a "/* -- Title -- */" form,
    // or a single-line at-rule sub-header ("/* @property — STATUS COLORS */").
    const singleLineSubHeader = !/\n/.test(raw.trim()) && /^\/\*\s*@[\w-]+\s+[—–-]\s+\S/.test(raw);
    const isBanner = DIVIDER_RUN.test(raw) || /^\/\*\s*--\s+\S/.test(raw) || singleLineSubHeader;
    const parsed = (isBanner || isHeader) ? parseBanner(raw) : parseNote(raw);
    comments.push({ start, end, raw, isHeader, isBanner, ...parsed });
  }
  return comments;
}

/**
 * Collapse a non-banner note comment into a single descriptive string.
 * @param {string} raw the raw block comment
 * @returns {{title: string, description: string}} title is always empty
 */
function parseNote(raw) {
  const inner = raw.replace(/^\/\*+/, '').replace(/\*+\/$/, '');
  const text = inner.split('\n')
    .map(l => l.replace(/^\s*\*?\s?/, '').trim())
    .filter(Boolean)
    .filter(l => !lineIsDivider(l))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { title: '', description: text };
}

/**
 * Find the comment context governing the element at character `idx`: the
 * nearest preceding section banner and the nearest preceding comment of any
 * kind (the latter may attach a more specific description).
 * @param {Array<object>} comments records from collectComments
 * @param {number} idx character offset of the element
 * @returns {{banner: ?object, nearest: ?object}}
 */
function contextAt(comments, idx) {
  let banner = null;
  let nearest = null;
  for (const c of comments) {
    if (c.end > idx) break;
    if (c.isHeader) continue;
    nearest = c;
    if (c.isBanner) banner = c;
  }
  return { banner, nearest };
}

/**
 * Derive a `{ group, description }` for the element at `idx` from its comment
 * context, preferring an attached note over the governing banner's prose.
 * @param {Array<object>} comments records from collectComments
 * @param {number} idx character offset of the element
 * @returns {{group: string, description: string}}
 */
function describe(comments, idx) {
  const { banner, nearest } = contextAt(comments, idx);
  const group = banner ? banner.title : '';
  // Prefer a specific note attached directly above the element; otherwise fall
  // back to the governing banner's own description (or its title).
  let description = '';
  if (nearest && nearest !== banner && nearest.description) {
    description = nearest.description;
  } else if (banner) {
    description = banner.description || banner.title;
  } else if (nearest) {
    description = nearest.description;
  }
  return { group, description: truncate(description) };
}

/**
 * Trim a description to a documentation-hint length, breaking on a word
 * boundary and appending an ellipsis when truncated.
 * @param {string} str input text
 * @param {number} [max=280] maximum length
 * @returns {string}
 */
function truncate(str, max = 280) {
  if (!str) return '';
  const clean = str.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

// readValue (comment-masked-safe, identical contract to gen-token-index.js /
// gen-token-reference.js) comes from scripts/lib/parse.js.

/**
 * Find the first `@layer` a file declares (e.g. "slashed.layout").
 * @param {string} maskedCss comment-masked CSS
 * @returns {?string} the layer name, or null
 */
function layerOf(maskedCss) {
  const m = /@layer\s+(slashed(?:\.[\w-]+)?)/.exec(maskedCss);
  return m ? m[1] : null;
}

// ── Bundle membership ───────────────────────────────────────────────────────
// Map each source file to the set of bundle tiers that ship it. Layered and
// flat variants of the same tier collapse to one name (e.g. "essential").
/**
 * Build the file → bundle-tiers map from bundle.config.json (layered and flat
 * variants of a tier collapse to one name) plus a `bundlesFor(file)` resolver.
 * @returns {{bundlesFor: (file: string) => string[], allBundles: string[]}}
 */
function buildBundleMap() {
  const cfg = JSON.parse(readFile(BUNDLE_CONFIG));
  const fileToBundles = new Map();
  const allBundles = new Set();
  for (const bundle of cfg.bundles || []) {
    const tier = path.basename(bundle.output)
      .replace(/^slashed\./, '')
      .replace(/\.flat/, '')
      .replace(/\.css$/, '');
    allBundles.add(tier);
    for (const file of bundle.files || []) {
      if (!fileToBundles.has(file)) fileToBundles.set(file, new Set());
      fileToBundles.get(file).add(tier);
    }
  }
  // Stable bundle ordering: by ascending breadth (how many files each ships),
  // so smaller tiers list first.
  const order = [...allBundles].sort((a, b) => a.localeCompare(b));
  const rank = new Map(order.map((b, i) => [b, i]));
  const bundlesFor = file => {
    const set = fileToBundles.get(file);
    if (!set) return [];
    return [...set].sort((a, b) => rank.get(a) - rank.get(b));
  };
  return { bundlesFor, allBundles: order };
}

// ── Token name → namespace ──────────────────────────────────────────────────
// The second path segment of a token name is a useful machine-filterable
// facet, e.g. --sf-color-primary → "color", --sf-space-m → "space".
/**
 * Extract a token's namespace facet — the second name segment, e.g.
 * `--sf-color-primary` → "color", `--sf-space-m` → "space".
 * @param {string} name token custom-property name
 * @returns {?string}
 */
function namespaceOf(name) {
  const m = /^--sf-([a-z0-9]+)/.exec(name);
  return m ? m[1] : null;
}

/**
 * Return the alias target when a value is exactly one `var(--sf-x)` reference.
 * @param {string} value declared value
 * @returns {?string} the referenced token name, or null
 */
function aliasTarget(value) {
  const m = /^var\(\s*(--sf-[\w-]+)\s*\)$/.exec(value || '');
  return m ? m[1] : null;
}

// ── Token extraction ──────────────────────────────────────────────────────────

/**
 * Extract every token from one source file with its value, @property metadata
 * and derived group/description. Last declaration wins per file for the value.
 * @param {string} rel source file path
 * @returns {Map<string, object>} name → partial token data
 */
function extractTokensFromFile(rel) {
  const original = readFile(rel);
  const masked   = maskComments(original);
  const comments = collectComments(original);
  const layer    = layerOf(masked);
  const rows = new Map(); // name -> partial entry data

  // @property registrations: tier-precise syntax / inherits / initial-value.
  for (const m of masked.matchAll(/@property\s+(--sf-[\w-]+)\s*\{([^}]*)\}/g)) {
    const name = m[1];
    const body = m[2];
    const syntax   = /syntax\s*:\s*("(?:[^"]*)"|'(?:[^']*)')/.exec(body);
    const inherits = /inherits\s*:\s*(true|false)/.exec(body);
    const initial  = /initial-value\s*:\s*([^;]+);/.exec(body);
    const { group, description } = describe(comments, m.index);
    rows.set(name, {
      registered: true,
      syntax:   syntax ? syntax[1].replace(/^['"]|['"]$/g, '') : null,
      inherits: inherits ? inherits[1] === 'true' : null,
      value:    initial ? initial[1].trim() : (rows.get(name)?.value ?? null),
      group, description, layer,
    });
  }

  // Custom-property declarations (last declaration wins per file for value).
  const re = /(--sf-[\w-]+)\s*:/g;
  let m;
  while ((m = re.exec(masked)) !== null) {
    const name  = m[1];
    const colon = m.index + m[0].length - 1;
    const value = readValue(masked, colon);
    const prev  = rows.get(name) || {};
    const ctx   = describe(comments, m.index);
    rows.set(name, {
      registered: prev.registered || false,
      syntax:   prev.syntax ?? null,
      inherits: prev.inherits ?? null,
      value,
      // Keep the first encountered group/description (definition site); fall
      // back to declaration context if @property didn't supply one.
      group:       prev.group || ctx.group,
      description: prev.description || ctx.description,
      layer:       prev.layer || layer,
    });
  }

  return rows;
}

/**
 * Merge tokens across all TOKEN_FILES into finished entries (tier, namespace,
 * value, alias, bundle membership, …). Redeclarations: last value wins, sources
 * unioned.
 * @param {(file: string) => string[]} bundlesFor bundle resolver
 * @returns {Map<string, object>} name → token entry
 */
// ── Class extraction ──────────────────────────────────────────────────────────

/**
 * Extract prefixed (.sf-/.is-) and unprefixed framework classes from one file,
 * with selector, kind, BEM-variant info and derived group/description.
 * @param {string} rel source file path
 * @returns {Map<string, object>} name → class entry
 */
function extractClassesFromFile(rel) {
  const original = readFile(rel);
  const masked   = maskStrings(maskComments(original));
  const comments = collectComments(original);
  const layer    = layerOf(masked);
  const meta     = FILE_META[rel];
  const rows = new Map(); // name -> entry

  // Prefixed classes: .sf-* and .is-*
  for (const m of masked.matchAll(/\.((?:sf|is)-[\w-]+)/g)) {
    addClass(rows, m[1], m.index);
  }
  // Unprefixed framework classes (a11y helpers, print utilities, theme helper).
  // Skip dotted @layer names by neutralising @layer declarations first.
  const noLayer = masked.replace(/@layer\s+[^{;]+[{;]/g, mm => mm.replace(/[^\n]/g, ' '));
  for (const m of noLayer.matchAll(/\.([a-z][\w-]*)/g)) {
    const name = m[1];
    if (name.startsWith('sf-') || name.startsWith('is-')) continue;
    addClass(rows, name, m.index);
  }

  /**
   * Record a class on first occurrence (which defines its comment context).
   * @param {Map<string, object>} map accumulator
   * @param {string} name class name (no leading dot)
   * @param {number} idx character offset of the match
   */
  function addClass(map, name, idx) {
    if (map.has(name)) return; // first occurrence defines its context
    const prefix = name.startsWith('sf-') ? 'sf' : name.startsWith('is-') ? 'is' : '';
    const variantSplit = name.indexOf('--');
    const ctx = describe(comments, idx);
    map.set(name, {
      name,
      type: 'class',
      tier: 'PUBLIC',
      selector: `.${name}`,
      prefix,
      kind: meta.kind,
      category: meta.category,
      area: meta.area,
      group: ctx.group || '',
      description: ctx.description || '',
      isVariant: variantSplit > 0,
      baseClass: variantSplit > 0 ? name.slice(0, variantSplit) : null,
      optional: rel.startsWith('optional/'),
      layer: layer || null,
      sourceFiles: [rel],
      bundles: bundlesFor_(rel),
    });
  }

  return rows;
}

/**
 * Hoisted bundle resolver so addClass (a closure) can reach it; assigned in
 * buildClassEntries before extraction runs.
 * @type {(file: string) => string[]}
 */
let bundlesFor_ = () => [];

/**
 * Merge tokens across all TOKEN_FILES with curated per-token annotations.
 * @param {(file: string) => string[]} bundlesFor bundle resolver
 * @param {Record<string,string>} tokenAnnotations token name → curated description
 * @returns {Map<string, object>} name → token entry
 */
function buildTokenEntries(bundlesFor, tokenAnnotations = {}, existingTokens = new Map()) {
  const merged = new Map(); // name -> entry

  for (const rel of TOKEN_FILES) {
    const rows = extractTokensFromFile(rel);
    const meta = FILE_META[rel];
    for (const [name, data] of rows) {
      const existing = merged.get(name);
      if (!existing) {
        merged.set(name, {
          name,
          type: 'token',
          tier: tierOf(name),
          role: roleOf(data.value, name),
          namespace: namespaceOf(name),
          category: meta.category,
          area: meta.area,
          group: data.group || '',
          description: data.description || '',
          value: data.value ?? null,
          aliasOf: aliasTarget(data.value),
          registered: !!data.registered,
          animatable: !!data.registered,
          syntax: data.syntax ?? null,
          inherits: data.inherits ?? null,
          optional: rel.startsWith('optional/'),
          layer: data.layer || null,
          sourceFiles: [rel],
          bundles: new Set(bundlesFor(rel)),
        });
      } else {
        // Token redeclared in a later file — last value wins, union sources.
        existing.value = data.value ?? existing.value;
        existing.aliasOf = aliasTarget(existing.value);
        existing.role = roleOf(existing.value, name);
        existing.registered = existing.registered || !!data.registered;
        existing.animatable = existing.registered;
        existing.syntax = existing.syntax ?? data.syntax ?? null;
        existing.inherits = existing.inherits ?? data.inherits ?? null;
        if (!existing.group && data.group) existing.group = data.group;
        if (!existing.description && data.description) existing.description = data.description;
        if (!existing.sourceFiles.includes(rel)) existing.sourceFiles.push(rel);
        for (const b of bundlesFor(rel)) existing.bundles.add(b);
      }
    }
  }
  // Overlay curated per-token descriptions from token-annotations.json.
  for (const [name, entry] of merged) {
    const previous = existingTokens.get(name);
    if (previous) {
      if (!entry.group && previous.group) entry.group = previous.group;
      if (!isUsefulDescription(entry.description) && previous.description) entry.description = previous.description;
    }
    if (tokenAnnotations[name]) entry.description = tokenAnnotations[name];
  }
  return merged;
}

/**
 * Merge classes across all CLASS_FILES into finished entries, unioning source
 * files and bundle membership for classes declared in more than one file.
 * Per-class descriptions from docs/token-annotations.json["classes"] override
 * the auto-derived banner-comment description when present.
 * @param {(file: string) => string[]} bundlesFor bundle resolver
 * @param {Record<string,string>} classAnnotations class name → curated description
 * @returns {Map<string, object>} name → class entry
 */
function buildClassEntries(bundlesFor, classAnnotations = {}, existingClasses = new Map()) {
  bundlesFor_ = bundlesFor;
  const merged = new Map(); // name -> entry (union of files)
  for (const rel of CLASS_FILES) {
    const rows = extractClassesFromFile(rel);
    for (const [name, entry] of rows) {
      const existing = merged.get(name);
      if (!existing) {
        merged.set(name, { ...entry, bundles: new Set(entry.bundles) });
      } else {
        if (!existing.sourceFiles.includes(rel)) existing.sourceFiles.push(rel);
        for (const b of entry.bundles) existing.bundles.add(b);
        if (!existing.group && entry.group) existing.group = entry.group;
        if (!existing.description && entry.description) existing.description = entry.description;
      }
    }
  }
  // Overlay curated per-class descriptions from token-annotations.json.
  // The annotation wins unconditionally so the curated text always appears.
  for (const [name, entry] of merged) {
    const previous = existingClasses.get(name);
    if (previous) {
      if (!entry.group && previous.group) entry.group = previous.group;
      if (!isUsefulDescription(entry.description) && previous.description) entry.description = previous.description;
    }
    if (classAnnotations[name]) entry.description = classAnnotations[name];
  }
  return merged;
}

// ── Assemble ────────────────────────────────────────────────────────────────

/**
 * Finalise an entry for output: convert its `bundles` Set into a stably ordered
 * array.
 * @param {object} entry in-progress entry (bundles is a Set)
 * @param {(b: string) => number} bundleOrderRank ordering key
 * @returns {object} output-ready entry
 */
function finalizeEntry(entry, bundleOrderRank) {
  const out = { ...entry };
  out.bundles = [...entry.bundles].sort((a, b) => bundleOrderRank(a) - bundleOrderRank(b));
  return out;
}

/**
 * Count entries grouped by the value of one key, returned as a key-sorted
 * object (used for the `_meta.counts` breakdowns).
 * @param {Array<object>} entries rows
 * @param {string} key field to group by
 * @returns {Object<string, number>}
 */
function tally(entries, key) {
  const counts = {};
  for (const e of entries) {
    const k = e[key];
    if (k == null) continue;
    counts[k] = (counts[k] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])));
}

// ── Markdown view ─────────────────────────────────────────────────────────────
// A browseable companion to the JSON, generated from the SAME data so the two
// can never drift. Tokens and classes are split (different columns), each
// grouped by category and alphabetised within a group.

/**
 * Escape a value for a Markdown table cell: backslash first (so we don't
 * re-escape our own escapes), then the pipe column-separator.
 * @param {*} v cell value
 * @returns {string} escaped text
 */
const escCell = v => String(v ?? '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|');

/**
 * Group entries by their `category` field, returned as category-sorted
 * `[category, entries]` pairs for the Markdown tables.
 * @param {Array<object>} entries rows
 * @returns {Array<[string, object[]]>}
 */
function groupByCategory(entries) {
  const map = new Map();
  for (const e of entries) {
    if (!map.has(e.category)) map.set(e.category, []);
    map.get(e.category).push(e);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

/**
 * Render the human-readable Markdown companion from the same assembled data as
 * the JSON, so the two views can never drift.
 * @param {object} data assembled entries + count breakdowns
 * @returns {string} Markdown document
 */
function buildMarkdown({ entries, tokenEntries, classEntries, tierCounts, typeCounts }) {
  let md = `# API index

> **Generated** from source by \`scripts/gen-api-index.js\` —
> run \`npm run docs:api\` to refresh. Do not edit by hand.

A single browseable catalogue of every public SLASHED element — design
**tokens** and **classes** — with stability tier, category, bundle membership
and a short description. The machine-readable companion (with all columns) is
[api-index.json](api-index.json); for the flat name list see
[registry.json](registry.json); for the tier contract see
[architecture.md](architecture.md).

**${entries.length} elements** — ${typeCounts.token || 0} tokens, ${typeCounts.class || 0} classes.

| Tier | Count | Meaning |
|---|---|---|
| PUBLIC | ${tierCounts.PUBLIC || 0} | Everyday surface. SemVer-stable. |
| PUBLIC-ADVANCED | ${tierCounts['PUBLIC-ADVANCED'] || 0} | Same SemVer guarantee; niche/powerful. |
| INTERNAL | ${tierCounts.INTERNAL || 0} | Implementation detail; may change without a major bump. |

`;

  // Tokens
  md += `## Tokens (${tokenEntries.length})\n\n`;
  for (const [category, list] of groupByCategory(tokenEntries)) {
    md += `### ${category} (${list.length})\n\n`;
    md += '| Token | Tier | Role | Namespace | Default | Description |\n|---|---|---|---|---|---|\n';
    for (const e of list) {
      md += `| \`${e.name}\` | ${e.tier} | ${e.role || '—'} | ${e.namespace || '—'} | \`${escCell(e.value)}\` | ${escCell(e.description)} |\n`;
    }
    md += '\n';
  }

  // Classes
  md += `## Classes (${classEntries.length})\n\n`;
  for (const [category, list] of groupByCategory(classEntries)) {
    md += `### ${category} (${list.length})\n\n`;
    md += '| Class | Tier | Kind | Group | Description |\n|---|---|---|---|---|\n';
    for (const e of list) {
      md += `| \`${e.selector}\` | ${e.tier} | ${e.kind} | ${escCell(e.group) || '—'} | ${escCell(e.description)} |\n`;
    }
    md += '\n';
  }

  return md;
}

/**
 * Entry point: assemble token + class entries, build counts and the column
 * schema, and write docs/api-index.json and docs/api-index.md.
 */
function main() {
  const { bundlesFor, allBundles } = buildBundleMap();
  const rank = new Map(allBundles.map((b, i) => [b, i]));
  const bundleOrderRank = b => (rank.has(b) ? rank.get(b) : Number.MAX_SAFE_INTEGER);

  const annotations = readAnnotations();
  const existing = readExistingApiIndex();
  const tokenMap   = buildTokenEntries(bundlesFor, annotations.tokens, existing.tokens);
  const classMap   = buildClassEntries(bundlesFor, annotations.classes, existing.classes);

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
  const isClasses = classEntries.filter(e => e.prefix === 'is');
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
    bundles:     'Array of bundle tiers that ship the element (optimal, optimal-components, optimal-utilities, full).',
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
    prefix:      "CLASS: 'sf' | 'is' | '' (unprefixed).",
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

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const md = buildMarkdown({ entries, tokenEntries, classEntries, tierCounts, typeCounts });
  fs.writeFileSync(OUT_MD, md, 'utf8');

  console.log(
    `[docs] → docs/api-index.json + docs/api-index.md ` +
    `(${entries.length} elements: ${tokenEntries.length} tokens, ${classEntries.length} classes; ` +
    `${sfClasses.length} .sf-, ${isClasses.length} .is-, ${unprefixed.length} unprefixed)`
  );
}

main();
