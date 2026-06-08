# SLASHED CSS Framework

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**xplicit · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.

[![release](https://img.shields.io/github/v/release/codeslash-dev/SLASHED?label=version&color=blueviolet&logo=css3&include_prereleases)](https://github.com/codeslash-dev/SLASHED/releases)
[![CI](https://img.shields.io/github/actions/workflow/status/codeslash-dev/SLASHED/ci.yml?branch=main&label=CI&logo=github)](https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/codeslash-dev/SLASHED)](LICENSE)
[![essential bundle](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/codeslash-dev/SLASHED/dist/badge-essential.json)](https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.essential.min.css)

---

## Quick start

Use a pre-built bundle (see [Releases](https://github.com/codeslash-dev/SLASHED/releases)):

```html
<!-- core only -->
<link rel="stylesheet" href="slashed.essential.css">

<!-- core + palette + forms + legacy (recommended for most sites) -->
<link rel="stylesheet" href="slashed.optimal.css">

<!-- everything, including the (currently empty) component/utility stubs -->
<link rel="stylesheet" href="slashed.full.css">
```

À la carte is also supported. When wiring up individual files, `core/layers.css`
must load **first** and `optional/legacy.css` must load **last**:

```html
<!-- core -->
<link rel="stylesheet" href="core/layers.css">
<link rel="stylesheet" href="core/tokens.color-fallbacks.css">
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
<link rel="stylesheet" href="optional/tokens.palette.css">
<link rel="stylesheet" href="optional/tokens.sizes-extended.css">
<link rel="stylesheet" href="optional/forms.css">
<link rel="stylesheet" href="optional/legacy.css">
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
| `slashed.essential.css` | all `core/` |
| `slashed.optimal.css` | essential + `tokens.palette` + `tokens.sizes-extended` + `forms` + `legacy` |
| `slashed.optimal-components.css` | optimal + `tokens.components` *(incomplete)* + `components` *(incomplete)* |
| `slashed.optimal-utilities.css` | optimal + `utilities` *(empty)* |
| `slashed.full.css` | optimal + `tokens.components` *(incomplete)* + `components` *(incomplete)* + `utilities` *(empty)* |

`optional/legacy.css` is always concatenated last. Every rule lives in an
`@layer`, so concatenation order never affects the cascade. Each bundle is emitted
readable and minified with a source map: `dist/slashed.<name>.css`,
`dist/slashed.<name>.min.css`, `dist/slashed.<name>.min.css.map`, plus a
layer-flattened `.flat` variant. `npm run build` prints raw / gzip / brotli sizes;
`tests/bundle-size.spec.js` guards against bloat.

## Customising tokens

Override the source tokens in your own stylesheet — any valid CSS color works. The
minimum rebrand is the 6 brand `-light` tokens; optionally add `-dark`
counterparts for per-mode control. The 5 status colours
(`success`/`warning`/`danger`/`error`/`info`) auto-derive but are overridable
too, for up to 22 color tokens total (11 light + 11 dark):

```css
:root {
  --sf-color-primary-light:   #3b5bdb;
  --sf-color-secondary-light: #5c677d;
  --sf-color-tertiary-light:  #0c8599;
  --sf-color-action-light:    #0ca678;
  --sf-color-neutral-light:   #495057;
  --sf-color-base-light:      #f8f9fa;

  /* optional dark counterparts for per-mode control */
  --sf-color-primary-dark:    #748ffc;
  --sf-color-action-dark:     #38d9a9;
  --sf-color-neutral-dark:    #adb5bd;
  --sf-color-base-dark:       #1a1b1e;
}
```

Or shorthand with `light-dark()`:

```css
:root { --sf-color-primary: light-dark(#3b5bdb, #748ffc); }
```

## Dark mode

```html
<html>                   <!-- follows OS preference by default -->
<html data-theme="dark"> <!-- force dark                       -->
<section data-theme="dark"> <!-- dark section inside light page -->
```

## Browser support

**Floor: Chrome 123+, Safari 17.5+, Firefox 128+** (≈ April–July 2024). Set by
three colour-system features that arrived in 2024 with no graceful fallback —
below the floor, derived colours collapse to `initial`.

| Feature | Used for | Chrome | Safari | Firefox |
|---|---|---|---|---|
| `light-dark()` | every resolved colour token | 123 | 17.5 | 120 |
| `@property` with `inherits: true` | animatable brand/status colours, `initial` reset | 85 | 16.4 | 128 |
| `oklch(from …)` relative colour | hover/tint/shade/dark derivation | 119 | 16.4 | 128 |

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
