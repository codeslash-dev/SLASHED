# Layout primitives

SLASHED ships breakpoint-free, container-query-driven layout primitives in the
`slashed.layout` layer (`core/layout.css`). Each is a single class with
per-instance tokens you can override inline (`style="--sf-stack-gap: …"`).
Tokens are declared in `core/tokens.layout.css`.

All primitives are demoed in [`demo.html`](demo.html).

## The primitives

| Class | What it does | Key tokens |
|---|---|---|
| `.sf-section` | vertical page rhythm; sizes `--xs/--s/--m/--l/--xl/--2xl` | `--sf-section-pad*` |
| `.sf-section-group` | collapses the gap between adjacent sections | — |
| `.sf-container` | centered max-width wrapper; declares the named `sf-layout` container; `--narrow` | `--sf-container-*`, `--sf-gutter` |
| `.sf-box` | isolated unit with padding and optional border outline | `--sf-box-padding`, `--sf-box-border-width`, `--sf-box-border-color` |
| `.sf-center` | intrinsic centering with max-width and gutters; `--intrinsic` | `--sf-center-max`, `--sf-center-gutter` |
| `.sf-stack` | vertical flow with consistent gap (the "owl") | `--sf-stack-gap` |
| `.sf-cluster` | wrapping inline group; `--no-wrap` | `--sf-cluster-gap/-align/-justify` |
| `.sf-sidebar` | content + fixed-ish side panel that wraps when narrow | `--sf-sidebar-*` |
| `.sf-switcher` | N columns above a threshold, stacked below; `--no-wrap`, `--vertical` | `--sf-switcher-threshold/-gap` |
| `.sf-grid` | auto-fill responsive grid; `--fit`, `--xs … --2xl`, `--dense` | `--sf-grid-min`, `--sf-grid-gap` |
| `.sf-grid-cols-1 / -2 / -3 / -4 / -6` | fixed-column grids, container-responsive (no `-5`) | `--sf-grid-gap` |
| `.sf-grid-cols-1-2 / -2-1 / -1-3 / -3-1` | ratio two-column grids | `--sf-grid-gap` |
| `.sf-bento` | dense free-form grid; `--sf-bento-cols/-row` overrides | `--sf-bento-*` |
| `.sf-alternate` | zigzag two-column layout, reverses every other row; CQ-responsive | `--sf-content-gap`, `--sf-gap` |
| `.sf-pancake` | sticky-footer grid: header / main(1fr) / footer | — |
| `.sf-content-grid` | breakout layout; children `.sf-breakout`, `.sf-full-bleed` | `--sf-content-width`, `--sf-breakout-width` |
| `.sf-grid-flex` | flex-based grid alternative for uneven item counts; last-row leftovers stretch to fill (default) or stay fixed and centered (`--center`); `--xs … --2xl` | `--sf-grid-min`, `--sf-grid-gap` |
| `.sf-cover` | full-height region with a centered `.sf-cover__center`; `--min/--max/--padding-*` | `--sf-cover-*` |
| `.sf-frame` | aspect-ratio media box | `--sf-frame-ratio` |
| `.sf-bg` | cover media layer behind the parent's content (parent auto-positions + isolates); composes under `.sf-scrim` | `--sf-bg-inset/-fit/-position/-radius/-z` |
| `.sf-reel` | horizontal scroll strip | `--sf-reel-*`, `--sf-mask-scrim-*` |
| `.sf-imposter` | absolutely-centered overlay; `--fixed`, `--contain` | `--sf-imposter-margin` |
| `.sf-subgrid` / `.sf-subgrid-rows` | inherit parent grid tracks | — |
| `.sf-divider` | token-driven separator; `--vertical`, `--soft`, `--strong`, `--dashed`, `--dotted`, `--gradient` | `--sf-divider-*` |
| `.sf-gap` | injects gap into any existing flex/grid container without imposing display; `--xs … --2xl` | `--sf-gap` |
| `.sf-equal` | flowing multi-column layout (CSS `columns`, not grid) — content distributes like a newspaper column instead of sitting in fixed cells; `--2/--3/--4/--6` set a target `column-count` | `--sf-equal-min-col`, `--sf-equal-gap`, `--sf-equal-rule-*` |
| `.sf-section--collapse` | adjacent sections share padding 50/50 across the boundary | `--sf-section-pad` |
| `.sf-icon` | em-based inline icon sizing; `--xs … --2xl` | `--sf-icon-*` |
| `.sf-icon--boxed` | padded, bordered icon frame (content-box sizing) | `--sf-icon-box-pad`, `--sf-icon-box-radius`, `--sf-icon-box-bg`, `--sf-icon-box-border` |

## Size-modifier scale -- `xs..2xl` everywhere

Every size-aware primitive supports the canonical range
`--xs --s --m --l --xl --2xl`.

| primitive | what the suffix scales | `--xs` | `--s` | `--m` *(default)* | `--l` | `--xl` | `--2xl` |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|
| `.sf-stack`   | block-axis gap         | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `.sf-cluster` | inline-axis gap        | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `.sf-gap`     | layout-agnostic gap    | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `.sf-grid` | min column width       | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `.sf-grid-flex` | min item width    | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `.sf-section` | block padding          | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `.sf-icon`    | font-size              | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

Three suffixes scale different physical dimensions. `.sf-grid--xs` means "narrow
column tier" (denser layouts), not "small gap" — gap on `.sf-grid` is controlled
separately by `--sf-grid-gap`, independent of the column-min modifier. To go beyond
the built-in scale, override the scoped token directly:
`style="--sf-stack-gap: var(--sf-space-3xl)"`. The underlying space tokens
(`--sf-space-2xs`/`-3xl`/`-4xl`) are part of the public token API.

## Why no breakpoints

Primitives respond to **their own container width** via `@container`, not the
viewport. Drop a `.sf-grid-cols-3` inside any width context and it adapts — no media
queries, no breakpoint tokens. See the
[container query contract](architecture.md#container-query-contract) for the
two named containers (`sf-layout`, `sf-alternate`) and when to use them.

## Composing

Primitives nest freely:

```html
<section class="sf-section">
  <div class="sf-container">
    <div class="sf-stack">
      <h1>Title</h1>
      <div class="sf-grid sf-grid--m">
        <article class="sf-stack sf-stack--s">…</article>
        <article class="sf-stack sf-stack--s">…</article>
      </div>
    </div>
  </div>
</section>
```

Override a single instance without new CSS:

```html
<div class="sf-cluster" style="--sf-cluster-gap: var(--sf-space-l)">…</div>
```
