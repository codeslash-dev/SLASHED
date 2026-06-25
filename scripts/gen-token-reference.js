#!/usr/bin/env node
/* Generates docs/tokens.md from the token source files. Run: npm run docs:tokens
   The reference is derived from source so it never drifts. */

import fs   from 'node:fs';
import path from 'node:path';
import { TOKEN_FILES } from './registry-sources.js';

const ROOT = path.resolve(import.meta.dirname, '..');

const FILE_TITLES = {
  'core/tokens.css':               'Core tokens',
  'core/tokens.layout.css':        'Layout tokens',
  'core/tokens.macros.css':        'Macro tokens',
  'optional/tokens.components.css':     'Component tokens',
};

const SOURCES = TOKEN_FILES.map(f => ({ file: f, title: `${FILE_TITLES[f]} (\`${f}\`)` }));

// Read the value of a custom-property declaration starting at `:` index,
// honouring nested parentheses so light-dark()/oklch() values stay intact.
function readValue(css, colonIdx) {
  let depth = 0;
  let out = '';
  for (let i = colonIdx + 1; i < css.length; i++) {
    const ch = css[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) break;
    out += ch;
  }
  return out.replace(/\s+/g, ' ').trim();
}

function extract(file) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    throw new Error(`[docs:tokens] Missing canonical token source file: ${abs}`);
  }
  const css = fs.readFileSync(abs, 'utf8').replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments first
  const rows = new Map(); // name -> value (last declaration wins)

  // @property registrations: initial-value — scanned AFTER comment stripping
  // to avoid picking up commented-out @property blocks.
  for (const m of css.matchAll(/@property\s+(--sf-[\w-]+)\s*\{([^}]*)\}/g)) {
    const iv = /initial-value\s*:\s*([^;]+);/.exec(m[2]);
    rows.set(m[1], iv ? `${iv[1].trim()} *(registered)*` : '*(registered)*');
  }

  const re = /(--sf-[\w-]+)\s*:/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const colon = m.index + m[0].length - 1;
    rows.set(m[1], readValue(css, colon));
  }
  return [...rows.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

let out = `# Token reference

> **Generated** from source by \`scripts/gen-token-reference.js\` —
> run \`npm run docs:tokens\` to refresh. Do not edit by hand.

Every \`--sf-*\` custom property and its default value, grouped by source file.
If a token is defined in multiple files, it is listed once per section — so this
count can be higher than \`docs/registry.json\` (which deduplicates by name). See
[architecture.md](architecture.md) for the PUBLIC / PUBLIC-ADVANCED / INTERNAL
contract and naming conventions (a DEPRECATED tier will be introduced when
tokens are first retired), and [theming.md](theming.md) for the
rebrand workflow.

`;

let grand = 0;
for (const { file, title } of SOURCES) {
  const rows = extract(file);
  grand += rows.length;
  out += `## ${title}\n\n`;
  out += `${rows.length} tokens.\n\n`;
  out += '| Token | Default |\n|---|---|\n';
  for (const [name, value] of rows) {
    const v = value.replace(/\|/g, '\\|');
    out += `| \`${name}\` | \`${v}\` |\n`;
  }
  out += '\n';
}

out = out.replace('Every `--sf-*`', `**${grand} tokens.** Every \`--sf-*\``);

fs.writeFileSync(path.join(ROOT, 'docs', 'tokens.md'), out, 'utf8');
console.log(`[docs] → docs/tokens.md (${grand} tokens)`);
