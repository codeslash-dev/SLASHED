# SLASHED for WordPress

WordPress plugin for the [SLASHED](https://github.com/codeslash-dev/SLASHED)
cascade-layer CSS framework. Ships two independent integrations that can each
run as a standalone plugin or load together from the unified `slashed.php`
bootstrap:

- **Bricks Builder** — CSS loading, `--sf-*` variable pickers, `.sf-*`/`.is-*`
  class autocomplete, a Color System panel, and **reBEMer** (subtree-scoped BEM
  class manager in the structure panel).
- **Gutenberg** — CSS loading in the block editor canvas + frontend, color
  palette sync, and a dark-mode bridge.

## Repository layout

```
SLASHED-for-WP/            The plugin (PHP + bundled CSS + built SPA assets)
  slashed.php              Unified bootstrap entry point
  readme.txt               WordPress.org plugin header
  includes/                Shared PHP classes
  data/                    Fallback inventory + class hints (generated)
  dist/                    Bundled CSS for local-first delivery (synced)
  integrations/bricks/     Bricks integration (PHP + Svelte editor/admin apps)
  integrations/gutenberg/  Gutenberg integration (PHP)
scripts/                   Build + drift-check tooling
tests/                     Unit tests for the editor-app libs (node:test)
docs/                      reBEMer design doc, Bricks template workflow, roadmap
```

## Framework dependency

The data-generation and drift-check scripts read the SLASHED framework's CSS
sources and token registry, which live in the separate framework repo. Point
them at a local checkout via `SLASHED_FRAMEWORK_DIR`; it defaults to a sibling
`../SLASHED` checkout:

```sh
git clone https://github.com/codeslash-dev/SLASHED.git ../SLASHED
( cd ../SLASHED && npm ci && npm run build )   # produces dist/ + docs/registry.json
```

| Script | Reads from framework |
| --- | --- |
| `scripts/gen-bricks-inventory.js` | `core/`, `optional/` token + class CSS |
| `scripts/gen-class-hints.js` | `core/`, `optional/forms.css` section comments |
| `scripts/check-admin-app.js` | `docs/registry.json`, `core/`, `optional/` CSS |
| `scripts/sync-plugin-dist.js` | `dist/slashed.{essential,optimal,full}.css` |

`scripts/zip-plugin.js` and `scripts/check-cheatsheet.js` are self-contained
(operate only on plugin files).

## Build

```sh
# one-time: install SPA dependencies
npm --prefix SLASHED-for-WP/integrations/bricks/editor-app ci
npm --prefix SLASHED-for-WP/integrations/bricks/admin-app  ci

npm run build:data    # regenerate data/inventory.json + data/classes-hints.json
npm run sync-dist     # copy framework CSS bundles into SLASHED-for-WP/dist/
npm run build:apps    # build the Svelte editor + admin SPAs into assets/
npm run build:zip     # package SLASHED-for-WP/ → dist/slashed.zip
npm run build         # all of the above, in order
```

## Test & check

```sh
npm test              # unit tests for the editor-app libs (node:test)
npm run check         # admin-app cssVar/default drift + cheatsheet coverage
```

`npm run check` requires PHP on PATH (executes `Slashed_Token_Defaults` to read
canonical factory defaults) and the framework checkout (for `registry.json`).

## Documentation

| Guide | What's inside |
| --- | --- |
| [reBEMer](docs/rebemer.md) | BEM class manager design doc |
| [Bricks template workflow](docs/bricks-template-workflow.md) | template build workflow |
| [Roadmap](docs/roadmap.md) | integration roadmap |
| [Bricks integration README](SLASHED-for-WP/integrations/bricks/README.md) | full Bricks docs |

## Versioning

`scripts/version-sync.js` in the framework repo previously stamped this
plugin's PHP version constants and CDN refs. After the split, version
stamping for `slashed.php`, `slashed-bricks.php`, `slashed-gutenberg.php`,
`readme.txt`, and the Bricks README CDN example needs a local `version-sync`
step in this repo — port the relevant blocks from the framework's old
`scripts/version-sync.js` if you automate releases here.
