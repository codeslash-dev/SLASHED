/**
 * Extraction half of scripts/gen-api-index.js (SL-006): everything that reads
 * source CSS / annotations / the previous generated index and turns it into
 * assembled token/class entries. The Markdown rendering half lives in
 * ./render.js — see that file's header for why the split runs there and not
 * elsewhere. This module has no behavior of its own beyond what
 * gen-api-index.js already did; it's a relocation, not a rewrite.
 */
import fs   from 'node:fs';
import path from 'node:path';
import { TOKEN_FILES, CLASS_FILES } from '../../registry-sources.js';
import { tierOf, roleOf } from '../../token-tiers.js';
import { maskComments, maskStrings, readValue, requireFile } from '../parse.js';

/**
 * Read docs/token-annotations.json — the curated overlay for per-token notes
 * and per-class descriptions. Returns a shape with `tokens` and `classes`
 * objects; both default to {} when the file is absent or unreadable.
 * @param {string} annotationsFile absolute path to token-annotations.json
 * @returns {{ tokens: Record<string,string>, classes: Record<string,string> }}
 */
export function readAnnotations(annotationsFile) {
  if (!fs.existsSync(annotationsFile)) return { tokens: {}, classes: {} };
  try {
    const parsed = JSON.parse(fs.readFileSync(annotationsFile, 'utf8'));
    return {
      tokens:  parsed.tokens  ?? {},
      classes: parsed.classes ?? {},
    };
  } catch (err) {
    console.warn(`[docs] Failed to parse ${annotationsFile}:`, err.message);
    return { tokens: {}, classes: {} };
  }
}

/**
 * Read the previously generated API index as a compatibility overlay. This
 * preserves curated groups/descriptions when source comments are intentionally
 * reduced to terse category markers.
 * @param {string} outFile absolute path to the existing docs/api-index.json
 * @returns {{ tokens: Map<string, object>, classes: Map<string, object> }}
 */
export function readExistingApiIndex(outFile) {
  const empty = { tokens: new Map(), classes: new Map() };
  if (!fs.existsSync(outFile)) return empty;
  try {
    const parsed = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    const tokens = new Map();
    const classes = new Map();
    for (const entry of parsed.entries ?? []) {
      if (entry.type === 'token') tokens.set(entry.name, entry);
      if (entry.type === 'class') classes.set(entry.name, entry);
    }
    return { tokens, classes };
  } catch (err) {
    console.warn(`[docs] Failed to parse existing ${outFile}:`, err.message);
    return empty;
  }
}

export function isUsefulDescription(description) {
  return Boolean(description && !/^SLASHED\s+[—-]/.test(description));
}

// ── Per-file metadata ─────────────────────────────────────────────────────────
// `category` is the high-level, human-facing area. `area` is a short machine
// slug. `kind` is the element family produced by the file.
export const FILE_META = {
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
  'optional/utilities.css':     { category: 'Utilities',             area: 'utilities',     kind: 'utility'       },
};

// ── Source masking (length-preserving) ─────────────────────────────────────────
// Replacing comment/string bodies with spaces (NOT removing them) keeps every
// character index stable, so a token/class match found in the masked text can
// be looked up against section banners parsed from the original text.
// maskComments/maskStrings (offset-preserving) come from scripts/lib/parse.js —
// NOT the same contract as that module's stripComments/stripStrings.

/**
 * Read a workspace-relative source file, throwing a clear error if missing.
 * @param {string} rel path relative to `root`
 * @param {string} root absolute repo root
 * @returns {string} file contents
 */
function readSourceFile(rel, root) {
  return requireFile(rel, root, `[docs:api] Missing source file: ${rel}`);
}

// ── Section-banner parsing ──────────────────────────────────────────────────
// A "banner" is a block comment that contains a long divider run (>=10 of '='
// or '-'). The file-header comment (starts with "SLASHED —" at offset 0) is
// recognised separately and never used as an element's group — regardless of
// whether it contains a divider run. Plain NOTE comments (no divider) are not
// treated as section banners.

export const DIVIDER_RUN = /[-=─═]{10,}/;

/**
 * True when a comment line is purely a divider rule (ASCII or box-drawing).
 * @param {string} line trimmed comment line
 * @returns {boolean}
 */
export function lineIsDivider(line) {
  const compact = line.replace(/\s/g, '');
  return compact.length >= 4 && /^[-=─═]+$/.test(compact);
}

/**
 * Parse a section-banner comment into a `{ title, description }` pair, stripping
 * divider fences and promoting an inline `Title — lead` description.
 * @param {string} raw the raw block comment (including delimiters)
 * @returns {{title: string, description: string}}
 */
export function parseBanner(raw) {
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
 * Collapse a non-banner note comment into a single descriptive string.
 * @param {string} raw the raw block comment
 * @returns {{title: string, description: string}} title is always empty
 */
export function parseNote(raw) {
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
 * Collect every block comment with its position and classification
 * (file header vs. section banner vs. plain note) for context lookups.
 * @param {string} css source CSS (comments intact)
 * @returns {Array<object>} ordered comment records
 */
// Tooling directive comments (stylelint-disable, eslint-disable, …) suppress
// a linter rule for the next line — they document a workaround for the rule,
// not the selector that happens to follow. Never usable as a description.
const DIRECTIVE_COMMENT = /^\/\*\s*(?:stylelint|eslint)-(?:disable|enable)\b/;

export function collectComments(css) {
  const comments = [];
  for (const m of css.matchAll(/\/\*[\s\S]*?\*\//g)) {
    const raw    = m[0];
    const start  = m.index;
    const end    = m.index + raw.length;
    const isHeader    = /SLASHED\s+[—-]/.test(raw) && start < 4;
    const isDirective = DIRECTIVE_COMMENT.test(raw);
    // A banner is either a divider-fenced comment, a "/* -- Title -- */" form,
    // or a single-line at-rule sub-header ("/* @property — STATUS COLORS */").
    const singleLineSubHeader = !/\n/.test(raw.trim()) && /^\/\*\s*@[\w-]+\s+[—–-]\s+\S/.test(raw);
    const isBanner = DIVIDER_RUN.test(raw) || /^\/\*\s*--\s+\S/.test(raw) || singleLineSubHeader;
    const parsed = (isBanner || isHeader) ? parseBanner(raw) : parseNote(raw);
    comments.push({ start, end, raw, isHeader, isDirective, isBanner, ...parsed });
  }
  return comments;
}

/**
 * Find the comment context governing the element at character `idx`: the
 * nearest preceding section banner and the nearest preceding comment of any
 * kind (the latter may attach a more specific description).
 * @param {Array<object>} comments records from collectComments
 * @param {number} idx character offset of the element
 * @returns {{banner: ?object, nearest: ?object}}
 */
export function contextAt(comments, idx) {
  let banner = null;
  let nearest = null;
  for (const c of comments) {
    if (c.end > idx) break;
    if (c.isHeader || c.isDirective) continue;
    nearest = c;
    if (c.isBanner) banner = c;
  }
  return { banner, nearest };
}

/**
 * Trim a description to a documentation-hint length, breaking on a word
 * boundary and appending an ellipsis when truncated.
 * @param {string} str input text
 * @param {number} [max=280] maximum length
 * @returns {string}
 */
export function truncate(str, max = 280) {
  if (!str) return '';
  const clean = str.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

/**
 * Derive a `{ group, description }` for the element at `idx` from its comment
 * context, preferring an attached note over the governing banner's prose.
 * @param {Array<object>} comments records from collectComments
 * @param {number} idx character offset of the element
 * @returns {{group: string, description: string}}
 */
export function describe(comments, idx) {
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

// readValue (comment-masked-safe, identical contract to gen-token-index.js /
// gen-token-reference.js) comes from scripts/lib/parse.js.

/**
 * Find the first `@layer` a file declares (e.g. "slashed.layout").
 * @param {string} maskedCss comment-masked CSS
 * @returns {?string} the layer name, or null
 */
export function layerOf(maskedCss) {
  const m = /@layer\s+(slashed(?:\.[\w-]+)?)/.exec(maskedCss);
  return m ? m[1] : null;
}

// ── Bundle membership ───────────────────────────────────────────────────────
// Map each source file to the set of bundle tiers that ship it. Layered and
// flat variants of the same tier collapse to one name (e.g. "essential").
/**
 * Build the file → bundle-tiers map from bundle.config.json (layered and flat
 * variants of a tier collapse to one name) plus a `bundlesFor(file)` resolver.
 * @param {string} root absolute repo root
 * @param {string} bundleConfigRel path to bundle.config.json, relative to root
 * @returns {{bundlesFor: (file: string) => string[], allBundles: string[]}}
 */
export function buildBundleMap(root, bundleConfigRel = 'bundle.config.json') {
  const cfg = JSON.parse(readSourceFile(bundleConfigRel, root));
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
export function namespaceOf(name) {
  const m = /^--sf-([a-z0-9]+)/.exec(name);
  return m ? m[1] : null;
}

/**
 * Return the alias target when a value is exactly one `var(--sf-x)` reference.
 * @param {string} value declared value
 * @returns {?string} the referenced token name, or null
 */
export function aliasTarget(value) {
  const m = /^var\(\s*(--sf-[\w-]+)\s*\)$/.exec(value || '');
  return m ? m[1] : null;
}

// ── Token extraction ──────────────────────────────────────────────────────────

/**
 * Extract every token from one source file with its value, @property metadata
 * and derived group/description. Last declaration wins per file for the value.
 * @param {string} rel source file path
 * @param {string} root absolute repo root
 * @returns {Map<string, object>} name → partial token data
 */
export function extractTokensFromFile(rel, root) {
  const original = readSourceFile(rel, root);
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

// ── Class extraction ──────────────────────────────────────────────────────────

/**
 * Extract prefixed (.sf-/.is-) and unprefixed framework classes from one file,
 * with selector, kind, BEM-variant info and derived group/description.
 * @param {string} rel source file path
 * @param {string} root absolute repo root
 * @param {(file: string) => string[]} bundlesFor bundle resolver
 * @returns {Map<string, object>} name → class entry
 */
export function extractClassesFromFile(rel, root, bundlesFor) {
  const original = readSourceFile(rel, root);
  const masked   = maskStrings(maskComments(original));
  const comments = collectComments(original);
  const layer    = layerOf(masked);
  const meta     = FILE_META[rel];
  const rows = new Map(); // name -> entry

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
      bundles: bundlesFor(rel),
    });
  }

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

  return rows;
}

/**
 * Merge tokens across all TOKEN_FILES with curated per-token annotations.
 * @param {string} root absolute repo root
 * @param {(file: string) => string[]} bundlesFor bundle resolver
 * @param {Record<string,string>} tokenAnnotations token name → curated description
 * @param {Map<string,object>} existingTokens previous generated index, for the compat overlay
 * @returns {Map<string, object>} name → token entry
 */
export function buildTokenEntries(root, bundlesFor, tokenAnnotations = {}, existingTokens = new Map()) {
  const merged = new Map(); // name -> entry

  for (const rel of TOKEN_FILES) {
    const rows = extractTokensFromFile(rel, root);
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
 * @param {string} root absolute repo root
 * @param {(file: string) => string[]} bundlesFor bundle resolver
 * @param {Record<string,string>} classAnnotations class name → curated description
 * @param {Map<string,object>} existingClasses previous generated index, for the compat overlay
 * @returns {Map<string, object>} name → class entry
 */
export function buildClassEntries(root, bundlesFor, classAnnotations = {}, existingClasses = new Map()) {
  const merged = new Map(); // name -> entry (union of files)
  for (const rel of CLASS_FILES) {
    const rows = extractClassesFromFile(rel, root, bundlesFor);
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
export function finalizeEntry(entry, bundleOrderRank) {
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
export function tally(entries, key) {
  const counts = {};
  for (const e of entries) {
    const k = e[key];
    if (k == null) continue;
    counts[k] = (counts[k] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])));
}
