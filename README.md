# SLASHED CSS Framework
<img width="1536" height="268" alt="logo" src="https://github.com/user-attachments/assets/7a1e419b-ab07-439b-956a-9c33deab99ae" />

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**xplicit · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.

[![version](https://img.shields.io/github/v/tag/codeslash-dev/SLASHED?sort=semver&label=version&color=blueviolet&logo=css3)](https://github.com/codeslash-dev/SLASHED/tags)
[![CI](https://img.shields.io/github/actions/workflow/status/codeslash-dev/SLASHED/ci.yml?branch=main&label=CI&logo=github)](https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/codeslash-dev/SLASHED)](LICENSE)
[![optimal bundle](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/codeslash-dev/SLASHED/dist/badge-optimal.json)](https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css)
[![runtime deps](https://img.shields.io/badge/runtime_deps-zero-brightgreen)](https://github.com/codeslash-dev/SLASHED/blob/main/package.json)
[![CDN](https://img.shields.io/badge/CDN-jsDelivr-e84d3d?logo=jsdelivr&logoColor=white)](https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/)

---

## Quick start

Use a pre-built bundle (see [Releases](https://github.com/codeslash-dev/SLASHED/releases)):

```html
<!-- core + classless form styling (recommended for most sites) -->
<link rel="stylesheet" href="slashed.optimal.css">

<!-- optimal + components -->
<link rel="stylesheet" href="slashed.optimal-components.css">

<!-- optimal + utilities -->
<link rel="stylesheet" href="slashed.optimal-utilities.css">

<!-- everything -->
<link rel="stylesheet" href="slashed.full.css">
```

À la carte is also supported. When wiring up individual files, `core/layers.css`
must load **first**. `optional/legacy.css` is not bundled by default — add it
explicitly if you need back-compat shims and load it **last**:

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

<!-- optional -->
<link rel="stylesheet" href="optional/forms.css">

<!-- legacy shims (opt-in only) -->
<!-- <link rel="stylesheet" href="optional/legacy.css"> -->
```

`optional/components.css` and `optional/tokens.components.css` are incomplete:
their `@layer` declarations are real, but every class and component token is
commented out, so no CSS is emitted. `optional/utilities.css` is an empty stub —
SLASHED is BEM-first and ships no utility classes in 0.x.

## Cascade layer order

```text
slashed.tokens → reset → base → forms → layout → components → macros →
utilities → states → themes → motion → accessibility → print → legacy →
overrides
```

Declared in `core/layers.css`. Later layers win. `slashed.overrides` is reserved
for your own overrides and sits last. `slashed.legacy` sits just before it; its
rules are gated by `@supports not (...)` and are inert on modern engines.
`slashed.forms` holds the opt-in classless form styling from `optional/forms.css`.
`slashed.macros` holds recipes like `.sf-prose`, `.sf-flow`, `.sf-truncate`,
`.sf-aspect`, `.sf-scroll-shadow` (see [`docs/macros.md`](docs/macros.md)).

## Scope of the base layer

The `base` layer is a minimal foundation, **not** a classless UI kit. SLASHED is
BEM-first: the token API is the product, and consumers build components on top.

- **Global base** — flow and inline text: headings, `p`, `a`, `code`, `pre`,
  `mark`, `hr`, `sub`/`sup`, `abbr`, `::selection`.
- **Rich blocks** (`table`, `blockquote`, `figure`, `dl`) — styled **only inside
  `.sf-prose`**, not globally.
- **Interactive widgets** (`dialog`, `details`, `progress`, `meter`) — consumer
  BEM / future `components` territory; `core` carries reset-level normalization
  only.
- **Native form controls** — opt-in via `optional/forms.css`.

Any module may have its own token file (e.g. `tokens.print.css`), loaded with its
parent module. All token files share the `slashed.tokens` layer.

## Bundles

| Bundle | Contents |
| --- | --- |
| `slashed.optimal.css` | all `core/` + `forms` |
| `slashed.optimal-components.css` | optimal + `tokens.components` *(incomplete)* + `components` *(incomplete)* |
| `slashed.optimal-utilities.css` | optimal + `utilities` *(empty)* |
| `slashed.full.css` | optimal + `tokens.components` *(incomplete)* + `components` *(incomplete)* + `utilities` *(empty)* |

`optional/legacy.css` is **not bundled by default** — add it explicitly when you
need back-compat shims. Every rule lives in an `@layer`, so concatenation order
never affects the cascade. Each bundle is emitted readable and minified with a
source map: `dist/slashed.<name>.css`, `dist/slashed.<name>.min.css`,
`dist/slashed.<name>.min.css.map`, plus a layer-flattened `.flat` variant.
`npm run build` prints raw / gzip / brotli sizes;
`tests/bundle-size.spec.js` guards against bloat.

## Customising tokens

Override the source tokens in your own stylesheet — any valid CSS color works. The
minimum rebrand is the 6 brand `-source-light` tokens; optionally add `-source-dark`
counterparts for per-mode control. The 4 status colours
(`success`/`warning`/`danger`/`info`) auto-derive but are overridable
too, for up to 20 color tokens total (10 source-light + 10 source-dark).
```css
:root {
  --sf-color-primary-source-light:   #3b5bdb;
  --sf-color-secondary-source-light: #5c677d;
  --sf-color-tertiary-source-light:  #0c8599;
  --sf-color-action-source-light:    #0ca678;
  --sf-color-neutral-source-light:   #495057;
  --sf-color-base-source-light:      #f8f9fa;

  /* optional dark counterparts for per-mode control */
  --sf-color-primary-source-dark:    #748ffc;
  --sf-color-action-source-dark:     #38d9a9;
  --sf-color-neutral-source-dark:    #adb5bd;
  --sf-color-base-source-dark:       #1a1b1e;
}
```

Or shorthand with `light-dark()`:

```css
:root { --sf-color-primary: light-dark(#3b5bdb, #748ffc); }
```

## Fluid engine

The fluid type, display, and space scales are **generated at runtime** from 12
input scalars — viewport range, modular ratios (a separate ratio for the min
and max viewport), and base sizes. Change one ratio and the whole system
regenerates — no build:

```css
:root {
  --sf-text-ratio-max: 1.414;  /* steeper headline hierarchy on desktop */
  --sf-fluid-max-vw:   110;    /* keep growing until very wide screens  */
}
```

For a one-off fluid value, write a `clamp()` that reads the engine's viewport
range so it recalibrates with the scale. See
[docs/theming.md](docs/theming.md#fluid-engine) and the
all-dials-in-one-file reference
[`optional/config-example.css`](optional/config-example.css).

## Dark mode

```html
<html>                   <!-- follows OS preference by default -->
<html data-theme="dark"> <!-- force dark                       -->
<section data-theme="dark"> <!-- dark section inside light page -->
```

## Browser support

**Floor: Chrome 125+, Safari 18.0+, Firefox 129+** (≈ April–September 2024). Set by
colour-system, fluid-engine, and scroll-driven animation features that arrived
in 2024 with no graceful fallback — below the floor, derived colours collapse
to `initial`, the generative scales stop computing, and scroll-driven animations
are unavailable.

| Feature | Used for | Chrome | Safari | Firefox |
|---|---|---|---|---|
| `light-dark()` | every resolved colour token | 123 | 17.5 | 120 |
| `@property` with `inherits: true` | animatable brand/status colours, `initial` reset | 85 | 16.4 | 128 |
| `oklch(from …)` relative colour | hover/tint/shade/dark derivation | 119 | 16.4 | 128 |
| `pow()` math function | generative fluid type/space scales (ratio + viewport) | 125 | 15.4 | 118 |
| `animation-timeline: view()` | scroll-driven animations | 115 | 18.0 | 114 |
| `@starting-style` | dialog / modal entry animations | 117 | 17.5 | 129 |

The effective floor is the maximum per engine. Cascade layers (`@layer`) are
foundational — below cascade-layer support (~2022) the architecture collapses.

`optional/legacy.css` smooths a few property-level gaps within the
cascade-layer window (Safari 15.0–15.3 `dvh`/`:focus-visible`, Safari
`scrollbar-gutter`), gated by `@supports not (...)`. It does **not** lower the
colour floor. If you must support older engines, SLASHED is not the right tool.

## Documentation

| Guide | What's inside |
| --- | --- |
| [Architecture](docs/architecture.md) | layers, file structure, class taxonomy, bundles, token contract, performance |
| [Theming](docs/theming.md) | rebrand in 6 tokens, dark mode, multi-brand, contrast |
| [Layout primitives](docs/layout.md) | every `.sf-*` layout class + tokens |
| [Macros / recipes](docs/macros.md) | every `.sf-*` macro-class + tokens |
| [Components](docs/components.md) | taken component names + roadmap |
| [State classes](docs/states.md) | every `.is-*` + ARIA mapping + overlap semantics |
| [Motion](docs/motion.md) | animation classes, tokens, reduced-motion |
| [Class reference](docs/classes.md) | every shipped class (generated) |
| [Token reference](docs/tokens.md) | all `--sf-*` tokens + defaults (generated) |
| [Migration](docs/migration.md) | upgrading SLASHED + migrating from other frameworks |
| [Contributing](CONTRIBUTING.md) | setup, conventions, tests |

The WordPress plugin (Bricks Builder + Gutenberg) lives in its own repository:
[slashed-for-wp](https://github.com/codeslash-dev/slashed-for-wp).

## Development

```sh
npm run build        # build all dist/ bundles
npm run watch        # rebuild on change
npm run docs:tokens  # regenerate docs/tokens.md from source
npm run lint:css     # stylelint all CSS
npm run lint:css:fix # auto-fix where possible
npm test             # token regression suite (Playwright, light + dark)
npm run test:install # one-time: install the Chromium, Firefox & WebKit test browsers
npm run release      # bump version (runs version-sync + build), tag & push
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
`CHANGELOG.md` is maintained by hand following
[Keep a Changelog](https://keepachangelog.com/); move `[Unreleased]` entries under
a version heading before releasing (see [CONTRIBUTING.md](CONTRIBUTING.md)).
