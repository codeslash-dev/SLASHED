# SLASHED CSS Framework

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.

[![release](https://img.shields.io/github/v/release/codeslash-dev/SLASHED?label=version&color=blueviolet&logo=css3)](https://github.com/codeslash-dev/SLASHED/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/codeslash-dev/SLASHED/ci.yml?label=CI&logo=github)](https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/codeslash-dev/SLASHED)](LICENSE)
[![essential bundle](https://img.shields.io/badge/essential-9.7kB%20gzip-brightgreen?logo=css3)](dist/slashed.essential.min.css)

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
> ship as **blueprints** in v0.3.0 — their `@layer` declarations reserve
> cascade position, but every class definition and component token is
> commented out (no CSS is emitted). They appear (as no-ops) in the
> `*-components` and `full` bundles only. `optional/utilities.css`
> remains an empty stub — SLASHED is BEM-first by design and ships no
> utility classes in 0.x. There's no need to link any of the three
> individually.

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
(between `components` and `utilities`, added in v0.3.0) holds recipes
like `.sf-prose`, `.sf-flow`, `.sf-truncate`, `.sf-aspect`,
`.sf-scroll-shadow`. See [`docs/macros.md`](docs/macros.md).

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
| `slashed.optimal-components.css` | optimal + `tokens.components` *(blueprint)* + `components` *(blueprint)* |
| `slashed.optimal-utilities.css` | optimal + `utilities` |
| `slashed.full.css` | optimal + `tokens.components` *(blueprint)* + `components` *(blueprint)* + `utilities` |

`optional/legacy.css` is always concatenated last. Every rule lives in an
`@layer`, so concatenation order never affects the cascade — `core/layers.css`
fixes it. `components.css` and `tokens.components.css` ship as **blueprints**
in 0.3.0 — their `@layer` declarations reserve cascade position, but every
selector and token is commented out (no CSS is emitted). `utilities.css`
ships as an empty stub.

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
| [Macros / recipes](docs/macros.md) | every `.sf-*` macro-class + tokens (v0.3.0+) |
| [Components blueprint](docs/components.md) | reserved component names + roadmap |
| [State classes](docs/states.md) | every `.is-*` + ARIA mapping + overlap semantics |
| [Token reference](docs/tokens.md) | all `--sf-*` tokens + defaults (generated) |
| [Browser support](docs/browser-support.md) | the support floor and why |
| [Performance](docs/performance.md) | modern-CSS footguns to avoid |
| [Migration](docs/migration.md) | 0.2.x → 0.3.0 + Pico / Bulma / Tailwind → SLASHED |
| [Contributing](CONTRIBUTING.md) | setup, conventions, tests |

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
