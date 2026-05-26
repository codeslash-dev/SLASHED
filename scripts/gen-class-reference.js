#!/usr/bin/env node
/**
 * Generates docs/classes.md from CSS source files.
 * Run: npm run docs:classes
 *
 * The reference is derived from source so it never drifts.
 * Must match CLASS_FILES in scripts/audit.js — that is the canonical list.
 */

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const SOURCES = [
  { file: 'core/layout.css',       title: 'Layout primitives (`core/layout.css`)',    prefix: 'sf-' },
  { file: 'core/macros.css',       title: 'Macro classes (`core/macros.css`)',         prefix: 'sf-' },
  { file: 'core/states.css',       title: 'State classes (`core/states.css`)',         prefix: 'is-' },
  { file: 'core/accessibility.css',title: 'Accessibility (`core/accessibility.css`)',  prefix: 'sf-' },
  { file: 'core/motion.css',       title: 'Motion / entrances (`core/motion.css`)',    prefix: 'sf-' },
  { file: 'optional/forms.css',    title: 'Forms (`optional/forms.css`)',              prefix: 'sf-' },
  { file: 'optional/components.css', title: 'Components (`optional/components.css`)', prefix: 'sf-' },
];

function extract(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) return [];
  const css = fs.readFileSync(abs, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')      // strip block comments
    .replace(/"[^"]*"|'[^']*'/g, '""');    // strip string literals
  const names = new Set();
  for (const m of css.matchAll(/\.((sf|is)-[\w-]+)/g)) names.add(m[1]);
  return [...names].sort();
}

let out = `# Class reference

> **Generated** from source by \`scripts/gen-class-reference.js\` —
> run \`npm run docs:classes\` to refresh. Do not edit by hand.

Every \`.sf-*\` layout/macro class and \`.is-*\` state class.
See [architecture.md](architecture.md) for layer order and naming conventions.

`;

let totalSf = 0;
let totalIs = 0;
const sections = [];

for (const { file, title } of SOURCES) {
  const names = extract(file);
  if (!names.length) continue;
  const sf = names.filter(n => n.startsWith('sf-'));
  const is = names.filter(n => n.startsWith('is-'));
  totalSf += sf.length;
  totalIs += is.length;
  sections.push({ title, names });
}

out = out.replace('Every', `**${totalSf} .sf-classes, ${totalIs} .is-classes.** Every`);

for (const { title, names } of sections) {
  out += `## ${title}\n\n`;
  out += `${names.length} classes.\n\n`;
  out += '| Class |\n|---|\n';
  for (const name of names) out += `| \`.${name}\` |\n`;
  out += '\n';
}

const OUT = path.join(ROOT, 'docs', 'classes.md');
fs.writeFileSync(OUT, out, 'utf8');
console.log(`[docs] → docs/classes.md (${totalSf} .sf-classes, ${totalIs} .is-classes)`);
