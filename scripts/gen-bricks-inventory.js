#!/usr/bin/env node
/**
 * Generate the Bricks integration's fallback inventory.json from the
 * built optimal CSS bundle.
 *
 * The integration parses the active CSS bundle at runtime to keep the
 * Bricks UI registry in sync with whatever the framework actually ships.
 * When neither a local file nor a CDN fetch is reachable (e.g. hosts
 * blocking outbound HTTP), the integration falls back to this JSON file -
 * so this script must run as part of every release that bumps
 * SLASHED_BRICKS_CSS_REF in the plugin bootstrap.
 *
 * Usage:
 *   node scripts/gen-bricks-inventory.js
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'dist', 'slashed.optimal.css');
const OUT = path.join(ROOT, 'integrations', 'bricks', 'data', 'inventory.json');

if (!fs.existsSync(SOURCE)) {
    console.error(`[gen-bricks-inventory] source not found: ${SOURCE}`);
    console.error('  run the bundle build first (npm run build).');
    process.exit(1);
}

const raw = fs.readFileSync(SOURCE, 'utf8');

// Strip block comments so documentation strings like "--sf-space-*"
// don't pollute the inventory.
const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');

function unique(list) {
    return Array.from(new Set(list)).sort();
}

function matchAll(pattern) {
    const out = [];
    let m;
    while ((m = pattern.exec(css)) !== null) {
        out.push(m[1]);
    }
    return unique(out);
}

const variables = matchAll(/(--sf-[a-zA-Z0-9_-]+)\s*:/g);
const sfClasses = matchAll(/\.(sf-[a-zA-Z0-9_-]+)/g);
const isClasses = matchAll(/\.(is-[a-zA-Z0-9_-]+)/g);

const inventory = {
    _meta: {
        source: 'dist/slashed.optimal.css',
        generated_at: new Date().toISOString(),
        counts: {
            variables: variables.length,
            sf_classes: sfClasses.length,
            is_classes: isClasses.length,
        },
    },
    variables,
    sf_classes: sfClasses,
    is_classes: isClasses,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(inventory, null, 2) + '\n');

console.log(
    `[gen-bricks-inventory] wrote ${path.relative(ROOT, OUT)} ` +
    `(${variables.length} vars, ${sfClasses.length} .sf-, ${isClasses.length} .is-)`
);
