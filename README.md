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
<link rel="stylesheet" href="core/motion.css">
<link rel="stylesheet" href="core/accessibility.css">
<link rel="stylesheet" href="core/print.css">

<!-- optional -->
<link rel="stylesheet" href="optional/tokens.palette.css">
<link rel="stylesheet" href="optional/tokens.components.css">
<link rel="stylesheet" href="optional/components.css">
<link rel="stylesheet" href="optional/utilities.css">
<link rel="stylesheet" href="optional/legacy.css">
```

**Recommended:** use a pre-built bundle instead of wiring up every file
(see [Releases](https://github.com/codeslash-dev/SLASHED/releases/latest)):

```html
<!-- core only -->
<link rel="stylesheet" href="slashed.essential.css">

<!-- core + populated optionals (palette, legacy) -->
<link rel="stylesheet" href="slashed.full.css">
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
| `slashed.essential.css` | `layers` + `tokens` + `reset` + `base` + `layout` + `states` + `motion` + `accessibility` + `print` |
| `slashed.full.css` | essential + `tokens.palette` + `legacy` |

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

Targets modern browsers; requires native cascade layers (floor:
~2022 — Safari 15.4, Chrome 99, Firefox 97). `optional/legacy.css`
smooths remaining gaps inside that window but does **not** extend
support to pre-`@layer` browsers.

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
