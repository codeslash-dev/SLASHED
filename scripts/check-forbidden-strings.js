#!/usr/bin/env node
/**
 * CI gate: strings that must never ship.
 *
 * The other check:* gates all answer "is X still in sync with Y?" — they prove
 * generated artifacts match their sources (check-artifacts), that docs only
 * name live API (check-doc-refs, check-llm-guide), that ids are permanent
 * (check-token-registry). None of them can answer the different question this
 * gate exists for: "did something get into the source or the shipped bundle
 * that has no business being there at all?"
 *
 * Two framework promises are currently honour-system only:
 *
 *   1. "Every visual value is a named token; hardcoded numbers are treated as
 *      bugs" (README, CLAUDE.md). Nothing stops a literal `#3b5bdb` landing in
 *      core/macros.css — it would pass every existing gate.
 *   2. "Standalone — no runtime dependencies", "no external requests". Nothing
 *      stops a `@import url(https://fonts.googleapis.com/…)` reaching a dist
 *      bundle, which would silently make every consumer's page phone home.
 *
 * Both are exactly the class of regression that is cheap to prevent and
 * expensive to notice later. This gate turns each promise into a mechanical
 * check over the source tree AND the built bundles.
 *
 * Deliberate exceptions are recorded per rule in ALLOW, each with a reason —
 * same contract as docs/ref-allowlist.json. An unexplained exception is not
 * possible: the allow entry IS the explanation, and it names the exact matched
 * text, not just the file, so a second unrelated violation in an
 * already-excepted file still fails.
 *
 * Run:
 *   node scripts/check-forbidden-strings.js          # report, exit 0
 *   node scripts/check-forbidden-strings.js --check  # report, exit 1 on any hit
 *   npm run check:forbidden-strings                  # the --check form (CI)
 */

import fs from 'node:fs';
import path from 'node:path';
import { maskComments } from './lib/parse.js';

// SLASHED_ROOT lets the negative tests run this gate against a fixture tree.
const slashedRoot = process.env.SLASHED_ROOT?.trim();
const ROOT = slashedRoot
  ? path.resolve(slashedRoot)
  : path.resolve(import.meta.dirname, '..');

const checkMode = process.argv.includes('--check');

/**
 * Files whose entire job is to declare raw values — the bottom of the token
 * stack, where a literal colour is the definition, not a shortcut.
 */
const TOKEN_SOURCE_FILES = [
  'core/tokens.css',
  'core/tokens.layout.css',
  'core/tokens.macros.css',
  'optional/tokens.components.css',
];

/**
 * @typedef {object} Rule
 * @property {string}   id          stable slug, used in output and in ALLOW
 * @property {string}   label       one-line description of what was found
 * @property {string}   why         what breaks if this ships (printed on failure)
 * @property {RegExp}   pattern     global regex; every match is a candidate hit
 * @property {string[]} targets     path prefixes to walk, relative to ROOT
 * @property {string[]} extensions  file extensions to read
 * @property {string[]} [exclude]   exact relative paths to skip entirely
 * @property {boolean}  [maskComments] blank comment bodies before matching
 *                                  (offset-preserving, so line numbers still
 *                                  point at the original source)
 */

/** @type {Rule[]} */
const RULES = [
  {
    id: 'hardcoded-color',
    label: 'hardcoded colour literal outside the token source files',
    why:
      'The framework promises every visual value is a named token. A literal colour ' +
      'here cannot be rebranded, cannot participate in the light-dark() / oklch() ' +
      'derivation chain, and will not follow a consumer\'s theme.',
    // Hex literals, the legacy colour functions, and the modern ones.
    //
    // The modern functions need a lookahead: oklch(from …) and oklch(var(…))
    // are the DERIVATION syntax the whole token layer is built on, not
    // hardcoded values — flagging those would condemn the architecture. A
    // direct oklch(0.6 0.25 30) is a literal like any other and is flagged.
    // color-mix( is unaffected: \bcolor\( cannot match across the "-mix".
    pattern:
      /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(|\b(?:hwb|lab|lch|oklab|oklch|color)\(\s*(?!from\b|var\()/gi,
    targets: ['core/', 'optional/'],
    extensions: ['.css'],
    exclude: [
      ...TOKEN_SOURCE_FILES,
      // A copy-and-customise starter that ships in no bundle (see its own
      // header, and bundle.config.json). Literal brand colours are the point
      // of the file — they are what a user replaces.
      'optional/customize-example.css',
    ],
    maskComments: true,
  },
  {
    id: 'external-url',
    label: 'external URL in a shipped bundle',
    why:
      'A shipped bundle must never cause a network request. Any absolute URL here ' +
      'means every consumer page silently fetches from a third party — breaking the ' +
      '"standalone, no external requests" guarantee and leaking visitor IPs.',
    // (?:https?:)? — a protocol-relative //host/path is a real external
    // request too: CSS accepts @import url(//fonts.example/x.css) and the
    // browser fetches it using the page's scheme.
    pattern: /(?:https?:)?\/\/[^\s"')]+/gi,
    targets: ['dist/'],
    extensions: ['.css'],
    // Deliberately NOT comment-masked: a URL in a bundle banner is still a URL
    // shipped to consumers, and should be a recorded decision.
  },
  {
    id: 'debug-statement',
    label: 'debug statement left in configurator source',
    why:
      'console.log/debug and debugger statements are development leftovers. They ship ' +
      'to the deployed configurator, clutter the console, and can leak internal state. ' +
      'Diagnostics that are meant to survive belong in console.warn/error.',
    pattern: /\bconsole\s*\.\s*(?:log|debug)\s*\(|\bdebugger\b/g,
    targets: ['configurator/src/'],
    extensions: ['.ts', '.svelte', '.js'],
    // scripts/ is deliberately out of scope: those are CLIs whose console.log
    // IS their output.
  },
];

/**
 * Deliberate, reasoned exceptions.
 *
 * Shape: ALLOW[ruleId][relativePath][exactMatchedText] = reason.
 *
 * Keyed by the matched TEXT, not just the file, so excepting `#fff` in a file
 * does not blanket-approve a future `#3b5bdb` in that same file.
 */
const ALLOW = {
  'hardcoded-color': {
    'core/base.css': {
      '#fff':
        'var() fallback of last resort — renders readable if the token layer ' +
        'failed to load entirely. Not a themeable value by definition.',
    },
    'optional/components.css': {
      '#000':
        'linear-gradient(#000 0 0) mask stops — a mask reads only the alpha ' +
        'channel, so the colour is structurally inert and tokenising it would ' +
        'imply a themeable value that does not exist.',
    },
  },
  'external-url': {
    'dist/slashed.full.css': {
      'http://www.w3.org/2000/svg':
        'XML namespace identifier inside an inline SVG data: URI. Namespaces are ' +
        'never dereferenced — no network request is made.',
    },
  },
};

// The same inline-SVG namespace appears in every bundle variant; mirror the one
// documented exception across them rather than repeating the reason four times.
for (const variant of [
  'dist/slashed.optimal.css',
  'dist/slashed.full.flat.css',
  'dist/slashed.optimal.flat.css',
  'dist/slashed.full.min.css',
  'dist/slashed.optimal.min.css',
  'dist/slashed.full.flat.min.css',
  'dist/slashed.optimal.flat.min.css',
]) {
  ALLOW['external-url'][variant] = ALLOW['external-url']['dist/slashed.full.css'];
}

/**
 * Collect every file under a rule's targets matching its extensions.
 * A target may be a directory prefix ("core/") or an exact file.
 * @param {Rule} rule
 * @returns {string[]} repo-relative paths, sorted
 */
function collectFiles(rule) {
  const out = new Set();
  const exclude = new Set(rule.exclude ?? []);

  const visit = (abs, rel) => {
    let stat;
    try {
      stat = fs.statSync(abs);
    } catch {
      return; // target absent (e.g. dist/ before a build) — nothing to scan
    }
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(abs)) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue;
        visit(path.join(abs, entry), rel ? `${rel}/${entry}` : entry);
      }
      return;
    }
    if (!rule.extensions.some((ext) => rel.endsWith(ext))) return;
    if (exclude.has(rel)) return;
    out.add(rel);
  };

  for (const target of rule.targets) {
    const clean = target.replace(/\/$/, '');
    visit(path.join(ROOT, clean), clean);
  }
  return [...out].sort();
}

/** 1-based line number of a character offset. */
function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) {
    if (text[i] === '\n') line++;
  }
  return line;
}

/**
 * Run one rule over the tree.
 * @param {Rule} rule
 * @returns {{ rule: Rule, hits: Array<{file:string,line:number,text:string}>, allowed: number, scanned: number }}
 */
function runRule(rule) {
  const hits = [];
  let allowed = 0;
  const files = collectFiles(rule);

  for (const rel of files) {
    const raw = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    // maskComments blanks comment bodies with same-length whitespace, so match
    // offsets still line up with the original file's line numbering.
    const haystack = rule.maskComments ? maskComments(raw) : raw;
    const allowForFile = ALLOW[rule.id]?.[rel] ?? {};

    rule.pattern.lastIndex = 0;
    for (const match of haystack.matchAll(rule.pattern)) {
      const text = match[0];
      if (Object.prototype.hasOwnProperty.call(allowForFile, text)) {
        allowed++;
        continue;
      }
      hits.push({ file: rel, line: lineAt(haystack, match.index ?? 0), text });
    }
  }

  return { rule, hits, allowed, scanned: files.length };
}

const results = RULES.map(runRule);
const failing = results.filter((r) => r.hits.length > 0);

if (failing.length) {
  console.error('check:forbidden-strings FAILED:\n');
  for (const { rule, hits } of failing) {
    console.error(`  [${rule.id}] ${rule.label}`);
    console.error(`  ${rule.why}\n`);
    for (const hit of hits) {
      console.error(`    ${hit.file}:${hit.line}  ${hit.text}`);
    }
    console.error('');
  }
  console.error(
    'If a match is deliberate, add it to ALLOW in scripts/check-forbidden-strings.js\n' +
      'keyed by rule id → file → the exact matched text, with a reason explaining why\n' +
      'it is safe. An exception without a reason is not an exception.',
  );
  if (checkMode) process.exit(1);
} else {
  const summary = results
    .map((r) => `${r.rule.id}: ${r.scanned} file(s)${r.allowed ? `, ${r.allowed} allowed` : ''}`)
    .join('; ');
  console.log(`check:forbidden-strings OK — ${summary}.`);
}
