# SLASHED Configurator

A standalone Svelte 5 panel for configuring **every** SLASHED token / knob and
generating ready-to-paste override CSS for your project. No backend, no build
step for consumers — open it, tweak tokens, copy the CSS.

## What it does

- **Basic mode is a per-project checklist**: a Home landing screen plus six
  curated domains (Colors, Typography, Spacing, Layout, Borders, Shadows)
  and the Themes tool. Curated controls use friendly labels with help text;
  an ⓘ popover reveals the raw token name, description, default and reach.
- **Advanced mode** lists all `--sf-*` tokens exposed by the framework,
  grouped by category and source section, with tier badges (`public` /
  `advanced` / `internal`), descriptions, alias info, and the framework
  default shown as a placeholder. The global multipliers (e.g.
  `--sf-space-scale`, which drives 45 tokens) live in a collapsed
  **Power knobs** group at the bottom of each panel.
- **Fluid scale generators write the live engine scalars** (base / ratio /
  shared viewport range) instead of baking per-step `clamp()` expressions —
  a few numbers in your export, and the engine stays live for later tweaks.
- **One-click style presets** on the Basic borders/shadows panels (Corner
  style: Sharp / Subtle / Rounded / Pill · Shadow style: None / Subtle /
  Soft / Strong), each applied as a single undo step.
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

The hand-curated surfaces (`src/lib/basics.js`, `src/lib/stylePresets.js`,
`src/lib/fluidEngine.js`, the knob registry) are pinned to the catalogue by
the test suite: after any framework release the upgrade ritual is

```bash
npm run sync && npm test
```

A vanished token, a renamed knob, or a drifted default fails CI loudly
instead of rendering a dead control.

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

## Hosting on GitHub Pages

`.github/workflows/deploy-configurator.yml` builds and publishes this app to
GitHub Pages automatically on merges to `main` that touch `configurator/**` or
`docs/api-index.json` (and on demand via the Actions tab). Enable it once under
**Settings → Pages → Build and deployment → Source: GitHub Actions**; the site
then serves from `https://<owner>.github.io/<repo>/`.

## Manual re-sync

```bash
npm run sync                       # reads ../docs/api-index.json
node scripts/sync-api.mjs <path>   # or point at an explicit api-index.json
```
