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
<link rel="stylesheet" href="core/layout.css">
<link rel="stylesheet" href="core/states.css">
<link rel="stylesheet" href="core/accessibility.css">
<link rel="stylesheet" href="core/print.css">

<!-- optional -->
<link rel="stylesheet" href="optional/tokens.palette.css">
<link rel="stylesheet" href="optional/tokens.components.css">
<link rel="stylesheet" href="optional/components.css">
<link rel="stylesheet" href="optional/utilities.css">
<link rel="stylesheet" href="optional/legacy.css">
```

Or use the pre-built bundle (see [Releases](https://github.com/codeslash-dev/SLASHED/releases/latest)):

```html
<link rel="stylesheet" href="slashed.essential.css">
```

## Cascade layer order

```text
slashed.tokens → reset → base → layout → components → utilities →
states → themes → motion → accessibility → print → legacy → overrides
```

Declared in `core/layers.css`. Later layers win. `slashed.overrides`
is reserved for your own overrides and sits last so it always wins.
`slashed.legacy` sits just before it; its rules are gated by
`@supports not (...)` and are inert on modern engines.

## Token file rule

Any module may have its own token file (e.g. `tokens.print.css`),
always loaded together with its parent module. All token files share
the `slashed.tokens` layer.

## Bundles

| Bundle | Contents |
| --- | --- |
| `slashed.essential.css` | `layers` + `tokens` + `reset` + `base` + `layout` + `states` + `accessibility` + `print` |

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

## Animation presets

Eight named `animation` shorthands ship in `core/tokens.css`. Each pairs a keyframe (defined in `core/motion.css`) with a duration and easing.

- `--sf-animation-fade-in`
- `--sf-animation-fade-out`
- `--sf-animation-slide-in-up`
- `--sf-animation-slide-in-down`
- `--sf-animation-slide-in-left`
- `--sf-animation-slide-in-right`
- `--sf-animation-scale-up`
- `--sf-animation-scale-down`

Use directly:

```css
.toast { animation: var(--sf-animation-slide-in-up); }
```

`core/accessibility.css` zeros every `--sf-duration-*` token and forces
`animation-duration: 0s !important` for users with `prefers-reduced-motion: reduce`,
so presets respect that preference automatically.

## Accessibility baseline

Out of the box, `core/accessibility.css` ships:

- **Focus**: a high-contrast `:focus-visible` ring built from `--sf-focus-ring-*` tokens.
- **Hidden helpers**: `.sr-only` and `.visually-hidden` for screen-reader-only content.
- **Skip link**: `.skip-link` jumps to `#main` and reveals on focus.
- **`prefers-reduced-motion`**: every `--sf-duration-*` token zeros out, plus `animation-duration` and `transition-duration` are forced to `0s !important`. `scroll-behavior` falls back to `auto !important`.
- **`prefers-contrast: more`**: increases border weight, raises text contrast, removes translucency.
- **`prefers-reduced-transparency`**: drops `backdrop-filter`, opaque overlays.
- **`forced-colors: active`**: maps SLASHED tokens to system keywords (`Canvas`, `CanvasText`, `LinkText`, etc.).
- **Touch targets**: `@media (pointer: coarse)` enforces a minimum 44px target via `--sf-touch-target`.
- **Safe-area insets**: `--sf-safe-top/bottom/left/right` consume `env(safe-area-inset-*)` for notched devices.

## Documentation

- [Architecture](docs/architecture.md): cascade layer order, token taxonomy, file structure
- [Token reference](docs/tokens.md): every public `--sf-` token with default value and override class
- [Recipes](docs/recipes.md): cookbook for branding, theming, animation, container queries
- [Color aliases design decisions](docs/color-aliases-design-decisions.md): rationale for the on-color formula and base palette V-shape
- [0.1 to 0.2 migration](docs/migration-0.1-to-0.2.md): new tokens, bugfixes, behavioural changes

## Browser support

Targets modern browsers; requires native cascade layers (floor:
~2022 — Safari 15.4, Chrome 99, Firefox 97). `optional/legacy.css`
smooths remaining gaps inside that window but does **not** extend
support to pre-`@layer` browsers.

## Development

```sh
npm run build        # bundle dist/slashed.essential.css
npm run watch        # rebuild on change
npm run lint:css     # stylelint all CSS
npm run lint:css:fix # auto-fix where possible
npm run release      # bump version, update CHANGELOG, tag & push
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/).
`CHANGELOG.md` is generated automatically on release.
