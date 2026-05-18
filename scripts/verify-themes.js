#!/usr/bin/env node

/* SLASHED - scripts/verify-themes.js
   ───────────────────────────────────────────────────

   Static invariants for the light-dark() theming model.

   The framework relies on a small set of cascade contracts
   that browsers won't warn about if they break: an active
   token registered as @property freezes light-dark(), an
   unregistered token set to `initial` produces the
   guaranteed-invalid value, and writing the active token
   shadows light-dark() with a constant. These bugs surface
   only by running the demo in a real browser and toggling
   theme, which the sandbox can't do.

   This harness is the cheapest substitute: parse-level
   string checks against the source files. It runs on the
   source CSS and the bundled output, has no dependencies,
   and is meant to be invoked on demand:

     node scripts/verify-themes.js

   It is NOT wired to CI or the pre-commit hook. The repo's
   contract is hand-authored CSS with no consumer build step,
   so heavyweight test infrastructure is out of scope.
   ─────────────────────────────────────────────────── */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const BRAND_KEYS  = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
const STATUS_KEYS = ['success', 'warning', 'error', 'info', 'danger'];
const ACTIVE_KEYS = BRAND_KEYS.concat(STATUS_KEYS);

const failures = [];
const passes   = [];

function check(label, ok, detail) {
  if (ok) {
    passes.push(label);
  } else {
    failures.push({ label, detail });
  }
}

/* ────────────────────────────────────────────────
   Source files
   ──────────────────────────────────────────────── */

const tokens = read('core/tokens.css');
const themes = read('core/themes.css');
const base   = read('core/base.css');
const demo   = read('docs/demo.html');
const bundle = read('dist/slashed.essential.css');

/* ────────────────────────────────────────────────
   1. Active brand/status tokens are NOT registered with
      @property. Registering them would cause light-dark()
      to resolve once at registration time, breaking the
      theme-switch contract.
   ──────────────────────────────────────────────── */

for (const key of ACTIVE_KEYS) {
  // The bare active token (no -light / -dark suffix).
  const re = new RegExp(`@property\\s+--sf-color-${key}\\b(?!-light|-dark)`);
  check(
    `active --sf-color-${key} is unregistered`,
    !re.test(tokens),
    `core/tokens.css declares @property --sf-color-${key}; must remain unregistered so light-dark() re-resolves at use-site.`
  );
}

/* ────────────────────────────────────────────────
   2. Each active token has an unregistered :root
      declaration of the form light-dark(*-light, *-dark).
   ──────────────────────────────────────────────── */

for (const key of ACTIVE_KEYS) {
  const re = new RegExp(
    `--sf-color-${key}\\s*:\\s*light-dark\\(\\s*var\\(--sf-color-${key}-light\\)\\s*,\\s*var\\(--sf-color-${key}-dark\\)\\s*\\)`
  );
  check(
    `--sf-color-${key} declared as light-dark(*-light, *-dark)`,
    re.test(tokens),
    `core/tokens.css missing --sf-color-${key}: light-dark(var(--sf-color-${key}-light), var(--sf-color-${key}-dark))`
  );
}

/* ────────────────────────────────────────────────
   3. The 22 source tokens ARE registered with @property
      (12 brand + 10 status, all with -light / -dark suffix).
   ──────────────────────────────────────────────── */

for (const key of ACTIVE_KEYS) {
  for (const suffix of ['-light', '-dark']) {
    const re = new RegExp(`@property\\s+--sf-color-${key}${suffix}\\b`);
    check(
      `@property --sf-color-${key}${suffix} registered`,
      re.test(tokens),
      `core/tokens.css missing @property registration for --sf-color-${key}${suffix}`
    );
  }
}

/* ────────────────────────────────────────────────
   4. The forced-light reset block must NOT use `initial`
      on the active tokens (issue 1 of the v1 review).
      `initial` on an unregistered custom property yields
      the guaranteed-invalid value, breaking descendants.

      The forced-dark reset block (added in v2-review fix)
      mirrors the light side: a forced-dark island nested
      inside a parent that wrote `--sf-color-X` inline must
      re-establish the `light-dark()` chain on its own
      element, otherwise the parent's constant inherits
      unchanged through the dark section.
   ──────────────────────────────────────────────── */

const resetBlockMatch = themes.match(
  /\[data-theme="light"\]:not\(:root\)\s*\{([\s\S]*?)\}/
);
check(
  'forced-light reset block exists',
  !!resetBlockMatch,
  'core/themes.css missing [data-theme="light"]:not(:root) reset block'
);

if (resetBlockMatch) {
  const body = resetBlockMatch[1];
  const initialUses = body.match(/--sf-color-[a-z]+\s*:\s*initial\b/g) || [];
  check(
    'forced-light reset block does not use `initial` on active tokens',
    initialUses.length === 0,
    `core/themes.css reset block has ${initialUses.length} `
      + `--sf-color-X: initial declaration(s); under unregistered active tokens, `
      + `\`initial\` produces guaranteed-invalid. Use light-dark(var(--sf-color-X-light), var(--sf-color-X-dark)) instead.`
  );

  for (const key of ACTIVE_KEYS) {
    const re = new RegExp(
      `--sf-color-${key}\\s*:\\s*light-dark\\(`
    );
    check(
      `forced-light reset re-declares --sf-color-${key} via light-dark()`,
      re.test(body),
      `core/themes.css [data-theme="light"]:not(:root) does not re-declare --sf-color-${key}`
    );
  }
}

const darkResetBlockMatch = themes.match(
  /\[data-theme="dark"\]:not\(:root\)\s*\{([\s\S]*?)\}/
);
check(
  'forced-dark reset block exists',
  !!darkResetBlockMatch,
  'core/themes.css missing [data-theme="dark"]:not(:root) reset block; a forced-dark island must mirror the forced-light block to override a parent\'s inline --sf-color-X write.'
);

if (darkResetBlockMatch) {
  const body = darkResetBlockMatch[1];
  const initialUses = body.match(/--sf-color-[a-z]+\s*:\s*initial\b/g) || [];
  check(
    'forced-dark reset block does not use `initial` on active tokens',
    initialUses.length === 0,
    `core/themes.css [data-theme="dark"]:not(:root) reset block has ${initialUses.length} `
      + `--sf-color-X: initial declaration(s); under unregistered active tokens, `
      + `\`initial\` produces guaranteed-invalid. Use light-dark(var(--sf-color-X-light), var(--sf-color-X-dark)) instead.`
  );

  for (const key of ACTIVE_KEYS) {
    const re = new RegExp(
      `--sf-color-${key}\\s*:\\s*light-dark\\(`
    );
    check(
      `forced-dark reset re-declares --sf-color-${key} via light-dark()`,
      re.test(body),
      `core/themes.css [data-theme="dark"]:not(:root) does not re-declare --sf-color-${key}`
    );
  }
}

/* ────────────────────────────────────────────────
   5. base.css does not contain any color-token swap blocks
      (post-FEAT-001 contract).
   ──────────────────────────────────────────────── */

check(
  'core/base.css has no @media (prefers-color-scheme: dark) color-swap block',
  !/@media\s*\(\s*prefers-color-scheme:\s*dark\s*\)[\s\S]*?--sf-color-/.test(base),
  'core/base.css contains a prefers-color-scheme: dark block that swaps --sf-color-* tokens; this belongs to the pre-FEAT-001 model.'
);

check(
  'core/base.css has no [data-theme="dark"] color-swap block',
  !/\[data-theme="dark"\][^{]*\{[^}]*--sf-color-[a-z]+\s*:/.test(base),
  'core/base.css contains a [data-theme="dark"] block that swaps --sf-color-* tokens.'
);

/* ────────────────────────────────────────────────
   6. The demo's Randomize button writes to *-light, NOT
      to the bare active token (issue 2 of the v1 review).
      Writing the active token shadows light-dark() with
      a constant in both modes.
   ──────────────────────────────────────────────── */

const randomizeMatch = demo.match(
  /cz-randomize'[\s\S]*?addEventListener\('click'[\s\S]*?\}\);[\s\S]*?\}\);/
);
check(
  'Randomize handler found in demo.html',
  !!randomizeMatch,
  'docs/demo.html missing cz-randomize click handler'
);

if (randomizeMatch) {
  const handlerSrc = randomizeMatch[0];

  // Bad: applyToken('--sf-color-' + key, ...) writes the active token directly.
  const badPattern = /applyToken\(\s*['"]--sf-color-['"]\s*\+\s*key\s*,/;
  check(
    'Randomize does not write to the bare active --sf-color-${key}',
    !badPattern.test(handlerSrc),
    'docs/demo.html Randomize calls applyToken(\'--sf-color-\' + key, ...) which shadows light-dark() with a constant; should target -light.'
  );

  // Good: writes to both *-light and *-dark.
  check(
    'Randomize writes to --sf-color-${key}-light',
    /applyToken\(\s*['"]--sf-color-['"]\s*\+\s*key\s*\+\s*['"]-light['"]/.test(handlerSrc),
    'docs/demo.html Randomize does not write to the *-light source token.'
  );
  check(
    'Randomize writes to --sf-color-${key}-dark',
    /applyToken\(\s*['"]--sf-color-['"]\s*\+\s*key\s*\+\s*['"]-dark['"]/.test(handlerSrc),
    'docs/demo.html Randomize does not write to the *-dark source token.'
  );
}

/* ────────────────────────────────────────────────
   7. Customizer Light-column inputs target *-light tokens,
      not the bare active token. (Mirrors the Randomize fix.)
   ──────────────────────────────────────────────── */

const bareLightInput = new RegExp(
  `data-token="--sf-color-(${ACTIVE_KEYS.join('|')})"(?!-)`
);
check(
  'no customizer input targets a bare active --sf-color-X token',
  !bareLightInput.test(demo),
  'docs/demo.html has at least one input with data-token="--sf-color-X" (no -light/-dark suffix). The Light column must target --sf-color-X-light.'
);

/* ────────────────────────────────────────────────
   8. Bundle is consistent: every source file appears in
      dist/slashed.essential.css in declared order.
   ──────────────────────────────────────────────── */

const config = JSON.parse(read('bundle.config.json'));
let cursor = 0;
let bundleOrderOk = true;
for (const file of config.files) {
  const marker = `/* ─── ${file} ─── */`;
  const idx = bundle.indexOf(marker, cursor);
  if (idx < 0) {
    bundleOrderOk = false;
    failures.push({
      label: 'bundle order',
      detail: `dist/slashed.essential.css missing or out-of-order marker for ${file}`
    });
    break;
  }
  cursor = idx + marker.length;
}
if (bundleOrderOk) {
  passes.push(`bundle includes ${config.files.length} files in declared order`);
}

/* ────────────────────────────────────────────────
   Report
   ──────────────────────────────────────────────── */

const total = passes.length + failures.length;
console.log(`[verify-themes] ${passes.length}/${total} checks passed`);

if (failures.length) {
  console.log('');
  for (const { label, detail } of failures) {
    console.log(`  FAIL  ${label}`);
    console.log(`        ${detail}`);
  }
  process.exit(1);
}
