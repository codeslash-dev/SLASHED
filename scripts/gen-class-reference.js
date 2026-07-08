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

const ROOT = path.resolve(import.meta.dirname, '..');

const FILE_META = {
  'core/layout.css':        { title: 'Layout primitives',    prefix: 'sf-' },
  'core/macros.css':        { title: 'Macro classes',         prefix: 'sf-' },
  'core/states.css':        { title: 'State classes',         prefix: 'sf-is-' },
  'core/accessibility.css': { title: 'Accessibility',         prefix: 'sf-' },
  'core/motion.css':        { title: 'Motion / entrances',    prefix: 'sf-' },
  'core/print.css':         { title: 'Print utilities',       prefix: ''    },
  'core/themes.css':        { title: 'Theme utilities',       prefix: 'sf-' },
  'optional/forms.css':     { title: 'Forms',                 prefix: 'sf-' },
  'optional/components.css':{ title: 'Components',            prefix: 'sf-' },
  'optional/theme-example.css': { title: 'Theme example',     prefix: ''    },
  'optional/utilities.css':     { title: 'Utilities',         prefix: 'sf-' },
};

const SOURCES = CLASS_FILES.map(f => ({
  file:   f,
  title:  `${FILE_META[f].title} (\`${f}\`)`,
  prefix: FILE_META[f].prefix,
}));

function extract(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    throw new Error(`[docs:classes] Missing canonical class source file: ${abs}`);
  }
  const css = fs.readFileSync(abs, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')     // strip block comments
    .replace(/"[^"]*"|'[^']*'/g, '""');   // strip string literals
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
