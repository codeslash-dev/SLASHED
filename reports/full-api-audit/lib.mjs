// Shared helpers for the SLASHED full-API audit harness.
// Builds local file:// copies of the demo pages (rewriting the CDN bundle to the
// locally built one), exposes the api-index oracle, and a browser launcher.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DEMOS = path.join(ROOT, 'demos');
export const RESULTS = path.join(ROOT, 'reports/full-api-audit/results');
export const SHOTS = path.join(ROOT, 'reports/full-api-audit/screenshots');
const CDN = 'https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.css';
const LOCAL = path.join(ROOT, 'badges/slashed.optimal.css');
const TMP = path.join(DEMOS, '.audit');

fs.mkdirSync(RESULTS, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });
// the runtime-injected + always-on override must be reachable from the temp copy
fs.copyFileSync(path.join(DEMOS, 'ultimate-override.css'), path.join(TMP, 'ultimate-override.css'));

// Rewrite a demo's CDN link to the locally built optimal bundle and drop a copy
// next to the override css so relative hrefs resolve.
export function localDemo(srcName, outName) {
  let html = fs.readFileSync(path.join(DEMOS, srcName), 'utf8');
  html = html.replaceAll(CDN, 'file://' + LOCAL);
  const out = path.join(TMP, outName);
  fs.writeFileSync(out, html);
  return 'file://' + out;
}

// Parse docs/api-index.json into the oracle the whole audit checks against.
export function oracle() {
  const idx = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/api-index.json'), 'utf8'));
  const entries = idx.entries || [];
  const tokens = entries.filter((e) => e.type === 'token');
  const classes = entries.filter((e) => e.type === 'class');
  return { meta: idx._meta, entries, tokens, classes };
}

export async function browser() {
  return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
}

export function save(name, obj) {
  fs.writeFileSync(path.join(RESULTS, name), JSON.stringify(obj, null, 2));
}
