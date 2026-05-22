# Performance considerations

SLASHED is plain CSS with no runtime, so the performance story is mostly about
a few modern-CSS footguns. None are SLASHED-specific bugs — they're costs worth
knowing when you build on top.

## `transition: all` is a footgun

`--sf-transition-all` (and its deprecated alias `--sf-transition-base`)
transition **every** animatable property, forcing the browser to watch every
computed value for change. Prefer a scoped token:

| Instead of | Use |
|---|---|
| `--sf-transition-all` | `--sf-transition-colors` / `-transform` / `-opacity` / `-shadow` |

Scoped tokens also avoid accidentally animating layout properties (which
trigger reflow). Animate `transform` and `opacity` — they're compositor-only.

## `oklch` + relative colour paint cost

Every resolved colour token is a `light-dark(oklch(from …))` expression. These
are cheap to compute but are recalculated when their inputs change. Two
implications:

- **Animating a registered colour** (e.g. the `.sf-color-pulse` demo mutating
  `--sf-color-primary-light`) re-derives everything downstream each frame. It's
  fine for a small accent, but don't pulse a token that hundreds of elements
  read.
- **Overriding source tokens at runtime** (theme toggle) re-resolves the
  derived graph once — negligible, and what the design intends.

## `@property` registration

Brand/status colours are registered with `@property`. Registration enables
smooth interpolation and an `initial` reset, at the cost of a one-time parse.
The set is small (11 colours + `--sf-is-dark`); the cost is immaterial.

## Cascade layers

`@layer` has no runtime cost — layering is resolved at parse time. The 14-layer
order in `core/layers.css` keeps selectors single-class / low-specificity, which
keeps style recalculation fast and lets you override without `!important`.

## Container queries

Responsive primitives use `@container`. Containment establishes a new layout/
style boundary; this is generally a *win* (scoped invalidation) but avoid
declaring thousands of tiny containers. The named `sf-layout` container is
declared once on `.sf-container`.

## Bundle size

Ship only what you use. `slashed.essential.css` (all `core/`) is the baseline;
add optional files à la carte rather than always shipping `full`. Serve
compressed — the token-heavy `:root` block gzips extremely well. See
[architecture.md](architecture.md#bundle-configuration) for the tiered bundles.

## Reduced motion

`core/accessibility.css` neutralises animation/transition under
`prefers-reduced-motion: reduce` (and the manual `.no-motion` opt-out) with
property-level `!important` — a correctness *and* performance safeguard for
users who request it.
