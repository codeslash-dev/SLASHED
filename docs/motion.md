# Motion

SLASHED ships animation primitives in the `slashed.motion` layer
(`core/motion.css`). Everything is gated behind
`@media (prefers-reduced-motion: no-preference)` -- users who prefer
reduced motion see no animation from the framework.

All animations are exercised live in the [demo](/demo/).

## Design principles

- **Token-driven** — every duration, easing, and named animation is a custom
  property; override per-instance without new CSS.
- **Opt-in** — nothing animates until you add a class or consume a transition
  token.
- **Reduced-motion first** — the whole layer is wrapped in
  `@media (prefers-reduced-motion: no-preference)`. Set `.no-motion` on an
  ancestor to suppress individually.

## Transition tokens

Declared in `core/tokens.css` (layer `slashed.tokens`). Apply them in
your own components:

```css
.card { transition: var(--sf-transition-colors); }
```

| Token | Properties | Duration | Easing |
|---|---|---|---|
| `--sf-transition-colors` | color, background-color, border-color, text-decoration-color, fill, stroke | normal | ease-out |
| `--sf-transition-form-field` | color, background-color, text-decoration-color, fill, stroke (normal) · border-color, box-shadow, opacity (fast) | mixed | ease-out |
| `--sf-transition-transform` | transform | normal | ease-out |
| `--sf-transition-opacity` | opacity | normal | ease-out |
| `--sf-transition-shadow` | box-shadow | normal | ease-out |
| `--sf-transition-fast` | color, background-color, border-color, box-shadow, opacity, transform, filter | fast | ease-out |
| `--sf-transition-slow` | color, background-color, border-color, box-shadow, opacity, transform, filter | slow | ease-in-out |
| `--sf-transition-enter` | color, background-color, border-color, box-shadow, opacity, transform, filter | normal | ease-out |
| `--sf-transition-exit` | color, background-color, border-color, box-shadow, opacity, transform, filter | fast | ease-in |

## Duration tokens

| Token | Default value |
|---|---|
| `--sf-duration-none` | `0ms` |
| `--sf-duration-instant` | `100ms` |
| `--sf-duration-fast` | `150ms` |
| `--sf-duration-normal` | `250ms` |
| `--sf-duration-slow` | `400ms` |
| `--sf-duration-slower` | `600ms` |

> **Note:** All non-zero durations are multiplied by `--sf-motion-scale`
> (default `1`). The values above assume the default scale.

## Easing tokens

| Token | Value |
|---|---|
| `--sf-ease-linear` | `linear` |
| `--sf-ease-in` | `cubic-bezier(0.5, 0, 0.75, 0.25)` |
| `--sf-ease-out` | `cubic-bezier(0.25, 0, 0.15, 1)` |
| `--sf-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--sf-ease-spring` | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` |
| `--sf-ease-elastic` | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` |
| `--sf-ease-bounce` | `linear(0, 0.35 18%, 1 32%, 0.86 42%, 1.02 56%, 0.98 72%, 1)` |
| `--sf-ease-overshoot` | `linear(0, 0.6 30%, 1.08 55%, 0.98 75%, 1)` |

## Animation classes

### Entrance animations

Apply one of these classes to trigger a one-shot entrance animation.
These are scroll-driven (their timing is `animation-range`, not
`animation-delay`); for staggering a group of **time-based** entrances
(`.sf-fade-in` / `.sf-slide-in-*`), see [Stagger](#stagger) below.

| Class | Effect |
|---|---|
| `.sf-entrance--fade` | fade in |
| `.sf-entrance--fade-up` | fade in + slide up |
| `.sf-entrance--fade-down` | fade in + slide down |
| `.sf-entrance--fade-left` | fade in + slide from left |
| `.sf-entrance--fade-right` | fade in + slide from right |
| `.sf-entrance--scale-up` | fade in + scale from 95% |

### Looping animations

| Class | Effect |
|---|---|
| `.sf-fade-in` | fade in (fill forwards) |
| `.sf-fade-out` | fade out (fill forwards) |
| `.sf-scale-up` | scale from 0 to 1 |
| `.sf-scale-down` | scale from 1 to 0 |
| `.sf-slide-in-up` | slide from below |
| `.sf-slide-in-down` | slide from above |
| `.sf-slide-in-left` | slide from left |
| `.sf-slide-in-right` | slide from right |

### Special

| Class | Effect |
|---|---|
| `.sf-color-pulse` | the element's `background-color` gently "breathes" — brightens toward a lighter tint and eases back, looping. See [Colour pulse](#colour-pulse). |

## Keyframes

All keyframe names use the `sf-` prefix:

- `sf-fade-in`, `sf-fade-out`
- `sf-scale-up`, `sf-scale-down`
- `sf-slide-in-up`, `sf-slide-in-down`, `sf-slide-in-left`, `sf-slide-in-right`
- `sf-float`, `sf-ping`, `sf-spin`, `sf-shimmer`, `sf-blink`
- `sf-color-pulse`

## Stagger

Put `.sf-stagger` on a **parent**; every direct child gets an incrementing
`animation-delay`, so a time-based entrance plays in sequence. `.sf-stagger`
is choreography only — each child still needs its own animation
(`.sf-fade-in`, `.sf-slide-in-*`, …). Children without one just carry an
inert delay, so you opt in per child with nothing to exclude.

```html
<ul class="sf-stagger">
  <li class="sf-fade-in">First</li>
  <li class="sf-fade-in">Second</li>
  <li class="sf-fade-in">Third</li>
  <!-- any number of children -->
</ul>
```

The per-item increment is one knob:

| Token | Value |
|---|---|
| `--sf-stagger-step` | `75ms` |

Each child's delay is `index × --sf-stagger-step × --sf-motion-scale`.

Where the browser supports `sibling-index()` the ramp is unbounded; older
engines fall back to an 8-step `:nth-child` ramp (covering a 4-column grid's
first two rows) that then plateaus, so arbitrarily long lists still animate.

> Best paired with the time-based looping classes (`.sf-fade-in` /
> `.sf-slide-in-*`), which stagger consistently everywhere. On the
> scroll-driven path — `.sf-entrance--*`/`.sf-exit--*` under
> `animation-timeline: view()` — the rhythm is `animation-range`, not
> `animation-delay`, so stagger has no effect there. (`.sf-entrance--*`
> does fall back to a time-based one-shot on engines without `view()`,
> where the delay *does* apply; `.sf-exit--*` has no such fallback.)

## Colour pulse

`.sf-color-pulse` makes an element's **`background-color`** slowly "breathe":
it brightens toward a lighter tint at the midpoint of the loop, then eases
back — a gentle, non-blinking heartbeat that draws the eye to something *live*
or *ongoing* (a "● live" / "recording" dot, a "syncing…" / "processing…"
indicator, an unsaved-changes badge).

It works with **any colour**. The default is `primary`; override
`--sf-color-pulse` per element to pulse a status or brand colour:

```html
<span class="sf-color-pulse">primary (default)</span>
<span class="sf-color-pulse" style="--sf-color-pulse: var(--sf-color-danger)">recording</span>
<span class="sf-color-pulse" style="--sf-color-pulse: var(--sf-color-success)">live</span>
```

Two knobs:

| Token | Default | What it controls |
|---|---|---|
| `--sf-color-pulse` | `var(--sf-color-primary)` | the colour the pulse breathes around |
| `--sf-color-pulse-amount` | `0.25` | how far the OKLCH lightness lifts at the peak (higher = more pronounced) |

The animation drives `background-color` directly (a natively interpolable
property, so no `@property` registration is needed) and is gated on
relative-colour support — `@supports (color: oklch(from red l c h))` — since
the brightened midpoint is computed with `oklch(from var(--sf-color-pulse) …)`.
On engines without relative colour the element simply keeps its static
`--sf-color-pulse` colour. Like the rest of the layer it is paused under
`prefers-reduced-motion: reduce`.

## Motion scale

`--sf-motion-scale` (default `1`) multiplies every duration in the
motion layer. Set it to `0` to kill all framework animation globally,
or to `1.5` to slow everything down for debugging.

```css
:root { --sf-motion-scale: 0; } /* kill all motion */
```

## Reduced motion

The entire `slashed.motion` layer is wrapped in:

```css
@media (prefers-reduced-motion: no-preference) { … }
```

Additionally, `core/accessibility.css` sets a hard override:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The `.no-motion` class provides per-element suppression independent of
the OS preference.

## Theme transitions

For smooth colour transitions when toggling light/dark mode, use the
opt-in `.sf-theme-transition` helper (`core/themes.css`): add it to `<html>`
(or any subtree) so colour tokens cross-fade when `[data-theme]` changes.
See [theming.md](theming.md).
