<p align="center">
  <img alt="SLASHED" width="1536" src="https://github.com/user-attachments/assets/7a1e419b-ab07-439b-956a-9c33deab99ae">
</p>

<p align="center">
  A cascade-layer CSS framework you never compile.<br>
  685 design tokens, automatic dark mode, fluid type &amp; spacing — no build step, no Node, no JavaScript.
</p>

<p align="center">
  <a href="https://github.com/codeslash-dev/SLASHED/tags"><img alt="version" src="https://img.shields.io/github/v/tag/codeslash-dev/SLASHED?sort=semver&label=version&color=blueviolet&logo=css3"></a>
  <a href="https://github.com/codeslash-dev/SLASHED/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/codeslash-dev/SLASHED/ci.yml?branch=main&label=CI&logo=github"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/github/license/codeslash-dev/SLASHED"></a>
  <a href="https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css"><img alt="optimal bundle" src="https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/codeslash-dev/SLASHED/dist/badge-optimal.json"></a>
  <a href="package.json"><img alt="runtime deps" src="https://img.shields.io/badge/runtime_deps-zero-brightgreen"></a>
  <a href="https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/"><img alt="CDN" src="https://img.shields.io/badge/CDN-jsDelivr-e84d3d?logo=jsdelivr&logoColor=white"></a>
</p>

<p align="center">
  <a href="https://slashed.codeslash.dev">Website</a> ·
  <a href="https://slashed.codeslash.dev/configurator/">Configurator</a> ·
  <a href="docs/architecture.md">Documentation</a> ·
  <a href="CHANGELOG.md">Changelog</a>
</p>

---

SLASHED — **S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**xplicit · **D**eterministic — is a CSS framework built the other way around: instead of a toolchain that generates CSS, it ships CSS that generates your design system. Add one stylesheet:

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/slashed.optimal.min.css">
```

Then rebrand the entire site by overriding six tokens. Every hover state, tint, shade, tonal step, the four status colors, and the complete dark palette derive from them — in plain CSS, at runtime, with nothing to recompile:

```css
:root {
  --sf-color-primary-source-light:   #3b5bdb;
  --sf-color-secondary-source-light: #5c677d;
  --sf-color-tertiary-source-light:  #0c8599;
  --sf-color-action-source-light:    #0ca678;
  --sf-color-neutral-source-light:   #495057;
  --sf-color-base-source-light:      #f8f9fa;
}
```

Each color takes an optional `-source-dark` counterpart for per-mode control, and the derived status colors (`success` / `warning` / `danger` / `info`) can be overridden individually — up to 20 color knobs in total. Or use the `light-dark()` shorthand:

```css
:root { --sf-color-primary: light-dark(#3b5bdb, #748ffc); }
```

To design visually instead, open the [configurator](https://slashed.codeslash.dev/configurator/): live light/dark preview of every token, override-CSS export, and shareable config links.

## The name is the philosophy

Every letter of SLASHED is a design commitment, and each one is checkable against the source:

- **Standalone** — one stylesheet. No build step, no Node, no runtime dependencies.
- **Lean** — a foundation, not a kit. No utility-class bloat, nothing to purge, nothing you didn't ask for.
- **Agnostic** — no stack assumptions. Any CMS, any builder, any JS framework, plain HTML — if it renders a stylesheet, SLASHED runs on it. No vendor lock-in, ever.
- **Structured** — fifteen named cascade layers in a fixed order, and a fully catalogued token API with stability tiers (`PUBLIC` / `PUBLIC-ADVANCED` / `INTERNAL`).
- **Hybrid** — classless where it can be (base elements, opt-in form styling), class-based where it counts (layout primitives, macros, `.is-*` states).
- **Explicit** — every visual value is a named token; hardcoded numbers are treated as bugs. Even the browser floor is stated up front instead of failing quietly.
- **Deterministic** — same tokens in, same design out. Every rule lives in a layer, so load order never changes the cascade, and every derived color and scale is computed by formula, not hand-picked.

## What's inside

- **685 design tokens** (`--sf-*`) covering color, typography, spacing, layout, borders, shadows, motion, and z-index — catalogued in a machine-readable [API index](docs/api-index.json).
- **Layout primitives** — `.sf-container`, `.sf-stack`, `.sf-grid`, `.sf-cluster`, `.sf-sidebar`, `.sf-switcher`, `.sf-cover`, `.sf-center`, `.sf-frame`, `.sf-reel`, `.sf-bento`, and more ([docs/layout.md](docs/layout.md)).
- **Macros** — recipes like `.sf-prose`, `.sf-flow`, `.sf-truncate`, `.sf-aspect`, `.sf-scroll-shadow`, `.sf-surface` ([docs/macros.md](docs/macros.md)).
- **State classes** — `.is-*` classes mapped to ARIA semantics ([docs/states.md](docs/states.md)).
- **A fluid engine** — the type, display, and space scales are generated at runtime from 12 input scalars (viewport range, modular ratios, base sizes). Change one ratio and the whole system recalculates — no build ([docs/theming.md](docs/theming.md#fluid-engine)).
- **Classless form styling**, motion, accessibility, and print modules.

SLASHED is BEM-first: the token API is the product, and you build components on top. It ships **no utility classes in 0.x**, and the component classes (`.sf-btn`, `.sf-card`, …) are staged in source — commented out until they land in v0.8. What you get today is the foundation, honestly labelled.

## Dark mode

Pure CSS — no script, no flash:

```html
<html>                        <!-- follows the OS preference by default -->
<html data-theme="dark">      <!-- force dark -->
<section data-theme="dark">   <!-- dark section inside a light page -->
```

## Cascade layers

Every rule lives in one of fifteen named `@layer`s with a fixed order, declared in [`core/layers.css`](core/layers.css):

```text
slashed.tokens → reset → base → forms → layout → components → macros →
utilities → states → themes → motion → accessibility → print → legacy →
overrides
```

Later layers win, regardless of selector specificity. `slashed.overrides` is reserved for you and sits last — your customisations always beat framework defaults, no `!important` required.

## Bundles

Pre-built bundles ship with every [release](https://github.com/codeslash-dev/SLASHED/releases) and on the [CDN](https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@dist/), each as readable, minified (+ source map), and layer-flattened `.flat` variants:

| Bundle | Contents |
| --- | --- |
| `slashed.optimal.css` | all of `core/` + classless forms — **recommended** |
| `slashed.optimal-components.css` | optimal + the staged component layer *(inert until v0.8)* |
| `slashed.optimal-utilities.css` | optimal + the staged utility layer *(inert in 0.x)* |
| `slashed.full.css` | optimal + both staged layers |

<details>
<summary>À la carte loading (individual source files)</summary>

`core/layers.css` must load **first**; `optional/legacy.css` is not bundled by default — add it explicitly if you need back-compat shims and load it **last**:

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

</details>

## Browser support

**Floor: Chrome 125+, Safari 18.0+, Firefox 129+** (≈ April–September 2024). The color system, fluid engine, and scroll-driven animations depend on CSS features that arrived in 2024 with no graceful fallback:

| Feature | Used for | Chrome | Safari | Firefox |
|---|---|---|---|---|
| `light-dark()` | every resolved color token | 123 | 17.5 | 120 |
| `@property` with `inherits: true` | animatable brand/status colors, `initial` reset | 85 | 16.4 | 128 |
| `oklch(from …)` relative color | hover/tint/shade/dark derivation | 119 | 16.4 | 128 |
| `pow()` math function | generative fluid type/space scales | 125 | 15.4 | 118 |
| `animation-timeline: view()` | scroll-driven animations | 115 | 18.0 | 114 |
| `@starting-style` | dialog / modal entry animations | 117 | 17.5 | 129 |

`optional/legacy.css` smooths a few property-level gaps within that window but does **not** lower the color floor. If you must support older engines, SLASHED is not the right tool — and it would rather tell you that than break quietly.

## Documentation

| Guide | What's inside |
| --- | --- |
| [Architecture](docs/architecture.md) | layers, file structure, class taxonomy, bundles, token contract, performance |
| [Theming](docs/theming.md) | rebrand in 6 tokens, dark mode, multi-brand, contrast |
| [Layout primitives](docs/layout.md) | every `.sf-*` layout class + tokens |
| [Macros / recipes](docs/macros.md) | every `.sf-*` macro class + tokens |
| [Components](docs/components.md) | reserved component names + roadmap |
| [State classes](docs/states.md) | every `.is-*` + ARIA mapping + overlap semantics |
| [Motion](docs/motion.md) | animation classes, tokens, reduced motion |
| [Class reference](docs/classes.md) | every shipped class (generated) |
| [Token reference](docs/tokens.md) | all `--sf-*` tokens + defaults (generated) |
| [LLM guide](docs/llm-guide.md) | compact API reference for AI-assisted development |
| [Migration](docs/migration.md) | upgrading SLASHED + migrating from other frameworks |

## WordPress

The WordPress plugin — Bricks Builder and Gutenberg integrations plus a visual token editor in wp-admin — lives in its own repository: [SLASHED-Plugins](https://github.com/codeslash-dev/SLASHED-Plugins).

## Development

```sh
npm run build        # build all badges/ bundles + docs
npm run watch        # rebuild on change
npm run lint:css     # stylelint all CSS
npm test             # full suite (unit + Playwright, light + dark)
npm run test:install # one-time: install the test browsers
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/); see [CONTRIBUTING.md](CONTRIBUTING.md) for setup and conventions.

## License

[MIT](LICENSE) © CODE/
