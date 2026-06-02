# SLASHED CSS Framework

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**xplicit · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.

[![release](https://img.shields.io/github/v/release/codeslash-dev/SLASHED?label=version&color=blueviolet&logo=css3&include_prereleases)](https://github.com/codeslash-dev/SLASHED/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/codeslash-dev/SLASHED/ci.yml?label=CI&logo=github)](https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/codeslash-dev/SLASHED)](LICENSE)
[![essential bundle](https://img.shields.io/badge/essential-11.6kB%20gzip-brightgreen?logo=css3)](dist/slashed.essential.min.css)

---

## Quick start

`core/layers.css` must load first. `optional/legacy.css` must load last.

```html
<!-- core -->
<link rel="stylesheet" href="core/layers.css">
<link rel="stylesheet" href="core/tokens.css">
<link rel="stylesheet" href="core/tokens.layout.css">
<link rel="stylesheet" href="core/tokens.macros.css">
<link rel="stylesheet" href="core/reset.css">
<link rel="stylesheet" href="core/base.css">
<link rel="stylesheet" href="core/themes.css">
<link rel="stylesheet" href="core/layout.css">
<link rel="stylesheet" href="core/macros.css">
<link rel="stylesheet" href="core/states.css">
<link rel="stylesheet" href="core/motion.css">
<link rel="stylesheet" href="core/accessibility.css">
<link rel="stylesheet" href="core/print.css">

<!-- optional (populated) -->
<link rel="stylesheet" href="optional/tokens.palette.css">
<link rel="stylesheet" href="optional/forms.css">
<link rel="stylesheet" href="optional/legacy.css">
```

> **Note:** `optional/components.css` and `optional/tokens.components.css`
> are not yet complete — their `@layer` declarations are real, but every
> class definition and component token is commented out (no CSS is emitted).
> They appear (as no-ops) in the `*-components` and `full` bundles only.
> `optional/utilities.css` remains an empty stub — SLASHED is BEM-first by
> design and ships no utility classes in 0.x. There's no need to link any
> of the three individually.

**Recommended:** use a pre-built bundle instead of wiring up every file
(see [Releases](https://github.com/codeslash-dev/SLASHED/releases/latest)):

```html
<!-- core only -->
<link rel="stylesheet" href="slashed.essential.css">

<!-- core + palette + forms + legacy (recommended for most sites) -->
<link rel="stylesheet" href="slashed.optimal.css">

<!-- everything, including the (currently empty) component/utility stubs -->
<link rel="stylesheet" href="slashed.full.css">
```

## Cascade layer order

```text
slashed.tokens → reset → base → forms → layout → components → macros →
utilities → states → themes → motion → accessibility → print → legacy →
overrides
```

Declared in `core/layers.css`. Later layers win. `slashed.overrides`
is reserved for your own overrides and sits last so it always wins.
`slashed.legacy` sits just before it; its rules are gated by
`@supports not (...)` and are inert on modern engines.

`slashed.forms` (between `base` and `layout`) holds the opt-in
classless form styling from `optional/forms.css`. `slashed.macros`
(between `components` and `utilities`) holds recipes like `.sf-prose`,
`.sf-flow`, `.sf-truncate`, `.sf-aspect`, `.sf-scroll-shadow`.
See [`docs/macros.md`](docs/macros.md).

## Scope of the base layer

The `base` layer is a minimal, readable foundation — **not** a classless
UI kit. SLASHED is BEM-first: the token API is the product, and consumers
build components on top of it. The line we hold:

- **Global base** — flow and inline text for readability: headings, `p`,
  `a`, `code`, `pre`, `mark`, `hr`, `sub`/`sup`, `abbr`, `::selection`.
- **Rich blocks** (`table`, `blockquote`, `figure`, `dl`) — styled **only
  inside `.sf-prose`**, not globally.
- **Interactive widgets** (`dialog`, `details`, `progress`, `meter`) —
  consumer BEM territory (a future `components` layer); `core` carries
  reset-level normalization only.
- **Native form controls** — opt-in via `optional/forms.css`
  (the `slashed.forms` layer).

## Token file rule

Any module may have its own token file (e.g. `tokens.print.css`),
always loaded together with its parent module. All token files share
the `slashed.tokens` layer.

## Bundles

| Bundle | Contents |
| --- | --- |
| `slashed.essential.css` | all `core/` (`layers` + `tokens` + `tokens.layout` + `tokens.macros` + `reset` + `base` + `themes` + `layout` + `macros` + `states` + `motion` + `accessibility` + `print`) |
| `slashed.optimal.css` | essential + `tokens.palette` + `forms` + `legacy` |
| `slashed.optimal-components.css` | optimal + `tokens.components` *(incomplete)* + `components` *(incomplete)* |
| `slashed.optimal-utilities.css` | optimal + `utilities` |
| `slashed.full.css` | optimal + `tokens.components` *(incomplete)* + `components` *(incomplete)* + `utilities` |

`optional/legacy.css` is always concatenated last. Every rule lives in an
`@layer`, so concatenation order never affects the cascade — `core/layers.css`
fixes it. `components.css` and `tokens.components.css` are **not yet
complete** — their `@layer` declarations are real, but every selector and
token is commented out (no CSS is emitted). `utilities.css` ships as an
empty stub.

À la carte is also supported — start from `essential` (or raw `core/`) and add
hand-picked optional files in any order. When building a custom bundle by hand,
`core/layers.css` (the `@layer` declaration) must load **first** — import it via
the `slashed/core/layers.css` subpath before anything else.

Each bundle is emitted both readable and minified, with a source map:
`dist/slashed.<name>.css`, `dist/slashed.<name>.min.css`, and
`dist/slashed.<name>.min.css.map`. `npm run build` prints raw / gzip / brotli
sizes for every bundle; `tests/bundle-size.spec.js` guards against bloat.

## Customising tokens

Override the source tokens in your own stylesheet — any valid CSS color works (hex, oklch, hsl…). The minimum rebrand requires 6 `-light` tokens; optionally add `-dark` counterparts for full per-mode control (up to 22 color tokens total: 11 light + 11 dark):

```css
:root {
  /* light values */
  --sf-color-primary-light: #3b5bdb;
  --sf-color-action-light:  #0ca678;
  --sf-color-neutral-light: #495057;
  --sf-color-base-light:    #f8f9fa;

  /* dark values */
  --sf-color-primary-dark:  #748ffc;
  --sf-color-action-dark:   #38d9a9;
  --sf-color-neutral-dark:  #adb5bd;
  --sf-color-base-dark:     #1a1b1e;
}
```

Or shorthand with `light-dark()`:

```css
:root {
  --sf-color-primary: light-dark(#3b5bdb, #748ffc);
}
```

## Dark mode

```html
<!-- follows OS preference by default -->
<html>

<!-- force dark -->
<html data-theme="dark">

<!-- dark section inside light page -->
<section data-theme="dark">
```

## Browser support

**Floor: Chrome 123+, Safari 17.5+, Firefox 128+** (≈ April–July 2024).

The framework's color system is built on three features that arrived
together in 2024 and have no graceful fallback:

- `light-dark()` (Chrome 123, Safari 17.5, Firefox 120)
- `@property` with `inherits: true` (Firefox 128)
- `oklch(from … sign(…) …)` relative color syntax (Firefox 113, Safari 16.4)

`optional/legacy.css` smooths a handful of property-level gaps within
the cascade-layer-supporting window (Safari 15.0–15.3 dvh/`:focus-visible`,
Safari `scrollbar-gutter`) but does **not** extend the floor below the
versions above — colors will collapse to `initial` on older engines.

## Documentation

| Guide | What's inside |
| --- | --- |
| [Architecture](docs/architecture.md) | layers, file structure, class taxonomy, bundles, token contract |
| [Theming](docs/theming.md) | rebrand in 6 tokens, multi-brand, contrast |
| [Dark mode](docs/dark-mode.md) | toggle script, scoped themes, per-value overrides |
| [Layout primitives](docs/layout.md) | every `.sf-*` layout class + tokens |
| [Macros / recipes](docs/macros.md) | every `.sf-*` macro-class + tokens |
| [Components](docs/components.md) | taken component names + roadmap |
| [State classes](docs/states.md) | every `.is-*` + ARIA mapping + overlap semantics |
| [Token reference](docs/tokens.md) | all `--sf-*` tokens + defaults (generated) |
| [Browser support](docs/browser-support.md) | the support floor and why |
| [Performance](docs/performance.md) | modern-CSS footguns to avoid |
| [Migration](docs/migration.md) | upgrading SLASHED versions + migrating from other frameworks |
| [reBEMer](docs/rebemer.md) | BEM class manager for Bricks Builder |
| [Bricks plugin](plugins/SLASHED-for-WP/integrations/bricks/README.md) | full Bricks Builder integration docs |
| [Contributing](CONTRIBUTING.md) | setup, conventions, tests |

## WordPress plugin

SLASHED ships a companion WordPress plugin (`plugins/SLASHED-for-WP/`) with two independent integrations that can each be activated as a standalone plugin or loaded together from the main `slashed.php` bootstrap.

### Bricks Builder

Activate `integrations/bricks/slashed-bricks.php` (requires Bricks 1.9.2+, WordPress 6.0+, PHP 7.4+).

- **CSS loading** — enqueues the SLASHED bundle on the frontend and inside the Bricks editor iframe
- **Variable pickers** — registers all `--sf-*` tokens (~600 in `optimal`, ~700 in `full`) in the Bricks Global Variable Manager, organised by category
- **Class autocomplete** — registers every `.sf-*` layout class and `.is-*` state class in the Bricks class input as locked entries
- **Color palette** — syncs `--sf-color-*` tokens with the Bricks color palette (auto-disabled on Bricks 2.2+ where the Color Manager would override `light-dark()` tokens; use the Variable Manager there instead)
- **Variable-picker swatches** — paints a colour square next to each `--sf-color-*` entry in the variable-picker dropdown, powered by server-resolved hex values so dark-mode stays framework-driven
- **Dynamic detection** — parses the active CSS bundle at runtime; no hand-curated list to drift out of date
- **reBEMer** — subtree-scoped BEM class manager inside the Bricks structure panel: rename, replace, or add modifiers across an element and its children in one transaction with preflight reference-count checks and snapshot/rollback

See [`integrations/bricks/README.md`](plugins/SLASHED-for-WP/integrations/bricks/README.md) and [`docs/rebemer.md`](docs/rebemer.md).

### Gutenberg (block editor)

Activate `integrations/gutenberg/slashed-gutenberg.php` (requires WordPress 6.4+, PHP 7.4+).

- **CSS loading** — enqueues the SLASHED bundle in the block editor canvas and on the frontend
- **Color palette** — syncs 21 `--sf-color-*` tokens (brand, status, surface, text, border, link) with the WordPress editor color palette
- **Dark-mode bridge** — maps the `data-wp-dark-mode-active` attribute from the block editor's dark-mode toggle to SLASHED's `color-scheme` system

### Packaging

```sh
npm run build:plugin   # packages the plugin as a ZIP in dist/
```

---

## Development

```sh
npm run build        # build all dist/ bundles
npm run watch        # rebuild on change
npm run docs:tokens  # regenerate docs/tokens.md from source
npm run lint:css     # stylelint all CSS
npm run lint:css:fix # auto-fix where possible
npm test             # token regression suite (Playwright, light + dark)
npm run test:install # one-time: install the Chromium test browser
npm run release      # bump version, update CHANGELOG, tag & push
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
`CHANGELOG.md` is generated automatically on release.
