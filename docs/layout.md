# Layout primitives

SLASHED ships breakpoint-free, container-query-driven layout primitives in the
`slashed.layout` layer (`core/layout.css`). Each is a single class with
per-instance tokens you can override inline (`style="--sf-stack-gap: …"`).
Tokens are declared in `core/tokens.layout.css`.

All primitives are demoed in [`demo.html`](demo.html).

## The primitives

| Class | What it does | Key tokens |
|---|---|---|
| `.sf-section` | vertical page rhythm; sizes `--s/--m/--l/--xl` | `--sf-section-pad*` |
| `.sf-section-group` | collapses the gap between adjacent sections | — |
| `.sf-container` | centered max-width wrapper; declares the named `sf-layout` container; `--narrow` | `--sf-container-*`, `--sf-space-gutter` |
| `.sf-stack` | vertical flow with consistent gap (the "owl") | `--sf-stack-gap` |
| `.sf-cluster` | wrapping inline group; `--no-wrap` | `--sf-cluster-gap/-align/-justify` |
| `.sf-sidebar` | content + fixed-ish side panel that wraps when narrow | `--sf-sidebar-*` |
| `.sf-switcher` | N columns above a threshold, stacked below; `--no-wrap`, `--vertical` | `--sf-switcher-threshold/-gap` |
| `.sf-grid` | auto-fill responsive grid; `--fit`, `--xs … --xl`, `--dense` | `--sf-grid-min`, `--sf-grid-gap` |
| `.sf-grid-1 … -6` | fixed-column grids, container-responsive | `--sf-grid-gap` |
| `.sf-grid-1-2 / -2-1 / -1-3 / -3-1` | ratio two-column grids | `--sf-grid-gap` |
| `.sf-bento` | dense free-form grid; `--sf-bento-cols/-row` overrides | `--sf-bento-*` |
| `.sf-content-grid` | breakout layout; children `.sf-breakout`, `.sf-full-bleed` | `--sf-content-width`, `--sf-breakout-width` |
| `.sf-cover` | full-height region with a centered `.sf-cover__center`; `--min/--max/--padding-*` | `--sf-cover-*` |
| `.sf-frame` | aspect-ratio media box | `--sf-frame-ratio` |
| `.sf-reel` | horizontal scroll strip | `--sf-reel-*`, `--sf-mask-scrim-*` |
| `.sf-imposter` | absolutely-centered overlay; `--fixed`, `--contain` | `--sf-imposter-margin` |
| `.sf-subgrid` / `.sf-subgrid-rows` | inherit parent grid tracks | — |
| `.sf-prose` | readable long-form text column (styles `table`, `blockquote`, `figure`, `dl`) | `--sf-prose-*` |
| `.sf-divider` | token-driven separator; `--vertical` | `--sf-divider-*` |
| `.sf-icon` | em-based inline icon sizing; `--xs … --xl` | `--sf-icon-*` |

## Why no breakpoints

Primitives respond to **their own container width** via `@container`, not the
viewport. Drop a `.sf-grid-3` inside any width context and it adapts — no media
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
