# SLASHED

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic

A cascade-layer CSS framework. No build step. No Node. No runtime dependencies.

> Work in progress — this README is not final.

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
<link rel="stylesheet" href="optional/themes.css">
<link rel="stylesheet" href="optional/motion.css">

<!-- optional, load LAST -->
<link rel="stylesheet" href="optional/legacy.css">
```

## Cascade layer order

```text
slashed.tokens → reset → base → layout → components → utilities →
states → themes → motion → accessibility → print → overrides → legacy
```

Declared in `core/layers.css`. Later layers win. `slashed.overrides`
is reserved for your own overrides; `slashed.legacy` sits last.

## Token file rule

Any module may have its own token file (e.g. `tokens.print.css`),
always loaded together with its parent module. All token files share
the `slashed.tokens` layer.

## Bundles

| Bundle | Contents |
| --- | --- |
| `slashed.core.css` | `layers` + `tokens` + `reset` + `base` |
| `slashed.essential.css` | core + `layout` + `states` + `accessibility` + `print` |
| `slashed.full.css` | everything |

Core ships only as a bundle, so all its tokens live in one
`tokens.css`. `motion`, `utilities`, `components`, `themes` are
optional and combinable in any way.

## Browser support

Targets modern browsers; requires native cascade layers (floor:
~2022 — Safari 15.4, Chrome 99, Firefox 97). `optional/legacy.css`
smooths remaining gaps inside that window but does **not** extend
support to pre-`@layer` browsers.
