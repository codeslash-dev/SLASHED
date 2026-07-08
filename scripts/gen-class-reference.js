#!/usr/bin/env node
/**
 * Generates docs/classes.md from CSS source files.
 * Run: npm run docs:classes
 *
 * The reference is derived from source so it never drifts.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { CLASS_FILES } from './registry-sources.js';
import { stripComments, stripStrings, requireFile } from './lib/parse.js';

const ROOT = path.resolve(import.meta.dirname, '..');

// Human-facing section title per class-source file. Keyed by the same paths
// as registry-sources.js CLASS_FILES — a file added there without a title here
// fails loudly below rather than emitting an "undefined" section.
const FILE_TITLES = {
  'core/layout.css':            'Layout primitives',
  'core/macros.css':            'Macro classes',
  'core/states.css':            'State classes',
  'core/accessibility.css':     'Accessibility',
  'core/motion.css':            'Motion / entrances',
  'core/print.css':             'Print utilities',
  'core/themes.css':            'Theme utilities',
  'optional/forms.css':         'Forms',
  'optional/components.css':    'Components',
  'optional/theme-example.css': 'Theme example',
  'optional/utilities.css':     'Utilities',
};

const SOURCES = CLASS_FILES.map(f => {
  const title = FILE_TITLES[f];
  if (!title) {
    throw new Error(
      `[docs:classes] ${f} is in registry-sources.js CLASS_FILES but has no title ` +
        `in FILE_TITLES (scripts/gen-class-reference.js). Add one.`,
    );
  }
  return { file: f, title: `${title} (\`${f}\`)` };
});

function extract(file) {
  // Same parsing contract as scripts/audit.js (the authoritative counter):
  // strip comments then string literals so content:"…" can't yield false
  // `.sf-*` matches. Shared via scripts/lib/parse.js so the two never diverge.
  const css = stripStrings(stripComments(
    requireFile(file, ROOT, `[docs:classes] Missing canonical class source file: ${file}`),
  ));
  const names = new Set();
  for (const m of css.matchAll(/\.(sf-[\w-]+)/g)) names.add(m[1]);
  return [...names].sort();
}

let out = `# Class reference

> **Generated** from source by \`scripts/gen-class-reference.js\` —
> run \`npm run docs:classes\` to refresh. Do not edit by hand.

Every \`.sf-*\` layout/macro class and \`.sf-is-*\` state class.
See [architecture.md](architecture.md) for layer order and naming conventions.

`;

const globalSf = new Set();
const globalIs = new Set();
const sections = [];

for (const { file, title } of SOURCES) {
  const names = extract(file);
  if (!names.length) continue;
  const sf = names.filter(n => n.startsWith('sf-') && !n.startsWith('sf-is-'));
  const is = names.filter(n => n.startsWith('sf-is-'));
  sf.forEach(n => globalSf.add(n));
  is.forEach(n => globalIs.add(n));
  sections.push({ title, names });
}

const totalSf = globalSf.size;
const totalIs = globalIs.size;

out = out.replace('Every', `**${totalSf} .sf-classes, ${totalIs} .sf-is-classes.** Every`);

for (const { title, names } of sections) {
  out += `## ${title}\n\n`;
  out += `${names.length} classes.\n\n`;
  out += '| Class |\n|---|\n';
  for (const name of names) out += `| \`.${name}\` |\n`;
  out += '\n';
}

const OUT = path.join(ROOT, 'docs', 'classes.md');
fs.writeFileSync(OUT, out, 'utf8');
console.log(`[docs] → docs/classes.md (${totalSf} .sf-classes, ${totalIs} .sf-is-classes)`);
