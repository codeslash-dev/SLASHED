# SLASHED Configurator

A standalone Svelte 5 panel for configuring **every** SLASHED token / knob and
generating ready-to-paste override CSS for your project. No backend, no build
step for consumers — open it, tweak tokens, copy the CSS.

## What it does

- Lists all `--sf-*` tokens exposed by the framework, grouped by category and
  source section, with tier badges (`public` / `advanced` / `internal`),
  descriptions, alias info, and the framework default shown as a placeholder.
- Smart editors per token: color picker / swatch for colors, numeric and
  length inputs where appropriate, text otherwise.
- Search across names, descriptions, values and namespaces; filter by tier or
  "modified only".
- Live preview that applies every framework default + your overrides to a
  scoped sample UI (with light/dark toggle) so `light-dark()` and relative
  `oklch(from …)` colors resolve just like in production.
- Generates `@layer slashed.overrides { :root { … } }` (or a bare `:root`)
  containing only the tokens you changed. Copy, download, or re-import an
  existing override sheet.
- Overrides are persisted to `localStorage` so a refresh keeps your work.

## Auto-sync with the framework API

The token catalogue is **never hand-maintained**. It is derived from the
framework's generated `docs/api-index.json` (the machine-readable source of
truth produced by `scripts/gen-api-index.js`).

`scripts/sync-api.mjs` reads that index and writes
`src/data/api-index.generated.json`. It runs automatically:

- on the configurator's own `predev` / `prebuild`, and
- as the final step of the framework's `npm run docs` pipeline
  (`configurator:sync`).

So whenever a token is added, renamed, retiered, or re-valued in the CSS and
the docs are regenerated, the panel picks it up on the next build with zero
manual edits.

## Local development

```bash
cd configurator
npm install
npm run dev      # predev re-syncs the catalogue, then starts Vite
```

## Build

```bash
npm run build    # prebuild re-syncs, then outputs a static site to dist/
npm run preview
```

The build in `dist/` is fully self-contained and uses relative asset paths
(`base: './'`), so it can be hosted from any sub-path — a GitHub Pages project
site, a CDN folder, or even opened over `file://`.

## Manual re-sync

```bash
npm run sync                       # reads ../docs/api-index.json
node scripts/sync-api.mjs <path>   # or point at an explicit api-index.json
```
