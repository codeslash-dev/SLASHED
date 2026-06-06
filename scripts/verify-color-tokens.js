#!/usr/bin/env node
/* Verifies the current state of Source_Token definitions in core/tokens.css before
   any fallback restructuring. Run: node scripts/verify-color-tokens.js */

import fs   from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

const SOURCE_TOKENS = [
  '--sf-color-primary-light',
  '--sf-color-secondary-light',
  '--sf-color-tertiary-light',
  '--sf-color-action-light',
  '--sf-color-neutral-light',
  '--sf-color-base-light',
  '--sf-color-success-light',
  '--sf-color-warning-light',
  '--sf-color-error-light',
  '--sf-color-info-light',
  '--sf-color-danger-light',
];

// Reads the value of a custom-property declaration starting at `:` index,
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

function verify(tokensFile = 'core/tokens.css') {
  const abs = path.join(ROOT, tokensFile);
  if (!fs.existsSync(abs)) {
    console.error(`[verify] Missing file: ${abs}`);
    process.exit(1);
  }

  const raw  = fs.readFileSync(abs, 'utf8');
  const css  = raw.replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments

  // --- 1. Classify each of the 11 Source_Tokens ---------------------------------

  const inventory = {};
  for (const name of SOURCE_TOKENS) {
    inventory[name] = { atProperty: null, rootDecl: null };
  }

  // @property initial-value
  for (const m of css.matchAll(/@property\s+(--sf-[\w-]+)\s*\{([^}]*)\}/g)) {
    const token = m[1];
    if (!inventory[token]) continue;
    const iv = /initial-value\s*:\s*([^;]+);/.exec(m[2]);
    inventory[token].atProperty = iv ? iv[1].trim() : '';
  }

  // plain :root declarations — last value wins (as in the cascade)
  const re = /(--sf-[\w-]+)\s*:/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const token = m[0].replace(/\s*:$/, '').trim();
    if (!inventory[token]) continue;
    const colon = m.index + m[0].length - 1;
    // skip @property blocks — they aren't :root decls
    const before = css.slice(Math.max(0, m.index - 200), m.index);
    if (/@property\s*$/.test(before.trim()) || /\binitial-value\s*$/.test(before.trim())) continue;
    if (before.includes('@property') && !before.includes('}')) continue;
    inventory[token].rootDecl = readValue(css, colon);
  }

  // --- 2. Record dark-derivation formula ----------------------------------------

  const darkFormulas = {
    brandStatus: 'clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h',
    surface:     'clamp(0.16, calc(1.18 - l), 0.24) calc(c * 0.5) h',
  };

  // --- 3. Record color-mix ratios and alpha values --------------------------------

  const colorMixRatios = [];
  // color-mix(in oklab, var(--sf-color-X) 65%, ...) — extract the first percentage
  for (const mm of css.matchAll(/color-mix\s*\([^;]+?(\d+)%/g)) {
    const ratio = parseInt(mm[1], 10);
    if (!colorMixRatios.includes(ratio)) colorMixRatios.push(ratio);
  }
  colorMixRatios.sort((a, b) => a - b);

  const alphaValues = [];
  for (const mm of css.matchAll(/\/\s*(0\.\d+|1(?:\.0+)?)\s*[\);]/g)) {
    const a = parseFloat(mm[1]);
    if (!alphaValues.includes(a)) alphaValues.push(a);
  }
  alphaValues.sort((a, b) => a - b);

  // --- 4. Classify and report ---------------------------------------------------

  let hasUnresolved = false;
  const rows = [];

  for (const name of SOURCE_TOKENS) {
    const { atProperty, rootDecl } = inventory[name];
    const hasProp  = atProperty !== null && atProperty !== '';
    const hasRoot  = rootDecl  !== null;

    if (!hasProp && !hasRoot) {
      console.error(`[verify] HALT: Source_Token ${name} found in neither @property nor :root`);
      hasUnresolved = true;
    }

    let classification;
    if (hasRoot && hasProp) {
      classification = 'both @property and :root';
    } else if (hasProp) {
      classification = '@property initial-value only';
    } else if (hasRoot) {
      classification = 'plain :root declaration only';
    } else {
      classification = 'MISSING';
    }

    // 4.3 Replay check: if both present, values must match
    let replayOk = true;
    if (hasProp && hasRoot && atProperty !== rootDecl) {
      console.warn(`[verify] MISMATCH for ${name}: initial-value="${atProperty}" root="${rootDecl}"`);
      replayOk = false;
    }

    // 3.4 Halt on empty initial-value
    if (atProperty === '') {
      console.error(`[verify] EMPTY initial-value for ${name}`);
      hasUnresolved = true;
    }

    rows.push({ name, classification, value: atProperty || rootDecl, replayOk });
  }

  if (hasUnresolved) {
    console.error('[verify] Halting due to unresolved tokens.');
    process.exit(1);
  }

  // --- 5. Summary ---------------------------------------------------------------

  const result = {
    tokens:         rows,
    darkFormulas,
    colorMixRatios,
    alphaValues,
  };

  console.log('[verify] Token inventory:');
  for (const r of rows) {
    console.log(`  ${r.name.padEnd(36)} → ${r.classification}  value: ${r.value}`);
  }
  console.log(`\n[verify] Dark-derivation formulas:`);
  console.log(`  brand/status: oklch(from src ${darkFormulas.brandStatus})`);
  console.log(`  surface:      oklch(from src ${darkFormulas.surface})`);
  console.log(`\n[verify] color-mix() ratios: ${colorMixRatios.join('%, ')}%`);
  console.log(`[verify] Alpha values: ${alphaValues.join(', ')}`);
  console.log('\n[verify] All checks passed.');

  return result;
}

export { verify, SOURCE_TOKENS, readValue };

if (process.argv[1] === import.meta.filename ||
    process.argv[1].endsWith('verify-color-tokens.js')) {
  verify();
}
