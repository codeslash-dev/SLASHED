# SLASHED

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.

[![release](https://img.shields.io/github/v/release/codeslash-dev/SLASHED?label=version&color=blueviolet&logo=css3)](https://github.com/codeslash-dev/SLASHED/releases/latest)
[![CI](https://img.shields.io/github/actions/workflow/status/codeslash-dev/SLASHED/ci.yml?label=CI&logo=github)](https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml)
[![license](https://img.shields.io/github/license/codeslash-dev/SLASHED)](LICENSE)

---

## Quick start

`core/layers.css` must load first. `optional/legacy.css` must load last.

```html
<!-- core -->
<link rel="stylesheet" href="core/layers.css">
<link rel="stylesheet" href="core/tokens.css">
<link rel="stylesheet" href="core/tokens.layout.css">
<link rel="stylesheet" href="core/reset.css">
<link rel="stylesheet" href="core/base.css">
<link rel="stylesheet" href="core/themes.css">
<link rel="stylesheet" href="core/layout.css">
<link rel="stylesheet" href="core/states.css">
<link rel="stylesheet" href="core/motion.css">
<link rel="stylesheet" href="core/accessibility.css">
<link rel="stylesheet" href="core/print.css">

<!-- optional (populated) -->
<link rel="stylesheet" href="optional/tokens.palette.css">
<link rel="stylesheet" href="optional/forms.css">
<link rel="stylesheet" href="optional/legacy.css">
```

> **Note:** `optional/components.css`, `optional/utilities.css` and
> `optional/tokens.components.css` are empty placeholders reserved for a
> future component/utility layer. They ship (as no-ops) only in the
> `*-components` / `*-utilities` / `full` bundles and do nothing until
> populated — there's no need to link them individually yet.

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
slashed.tokens → reset → base → forms → layout → components → utilities →
states → themes → motion → accessibility → print → legacy → overrides
```

Declared in `core/layers.css`. Later layers win. `slashed.overrides`
is reserved for your own overrides and sits last so it always wins.
`slashed.legacy` sits just before it; its rules are gated by
`@supports not (...)` and are inert on modern engines.

`slashed.forms` (between `base` and `layout`) holds the opt-in
classless form styling from `optional/forms.css`.

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
| `slashed.essential.css` | all `core/` (`layers` + `tokens` + `tokens.layout` + `reset` + `base` + `themes` + `layout` + `states` + `motion` + `accessibility` + `print`) |
| `slashed.optimal.css` | essential + `tokens.palette` + `forms` + `legacy` |
| `slashed.optimal-components.css` | optimal + `tokens.components` + `components` |
| `slashed.optimal-utilities.css` | optimal + `utilities` |
| `slashed.full.css` | optimal + `tokens.components` + `components` + `utilities` |

`optional/legacy.css` is always concatenated last. Every rule lives in an
`@layer`, so concatenation order never affects the cascade — `core/layers.css`
fixes it. The `components` / `utilities` / `tokens.components` files are still
empty stubs: they ship (no-op) only in the `*-components` / `*-utilities` /
`full` bundles and do nothing until populated.

À la carte is also supported — start from `essential` (or raw `core/`) and add
hand-picked optional files in any order.

## Customising tokens

Override the 22 source tokens in your own stylesheet — any valid CSS color works (hex, oklch, hsl…):

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

## Development

```sh
npm run build        # build dist/ bundles (essential + full)
npm run watch        # rebuild on change
npm run lint:css     # stylelint all CSS
npm run lint:css:fix # auto-fix where possible
npm test             # token regression suite (Playwright, light + dark)
npm run test:install # one-time: install the Chromium test browser
npm run release      # bump version, update CHANGELOG, tag & push
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
`CHANGELOG.md` is generated automatically on release.
