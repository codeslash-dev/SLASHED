# Motion

SLASHED ships animation primitives in the `slashed.motion` layer
(`core/motion.css`). Everything is gated behind
`@media (prefers-reduced-motion: no-preference)` -- users who prefer
reduced motion see no animation from the framework.

All animations are demoed in the [macros & states coverage page](test-coverage-4-macros-states.html).

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
Combine with a `--sf-animation-delay-*` token for staggered sequences.

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
| `.sf-color-pulse` | animates `--sf-color-primary-source-light` lightness via `@property` interpolation in oklch |

## Keyframes

All keyframe names use the `sf-` prefix:

- `sf-fade-in`, `sf-fade-out`
- `sf-scale-up`, `sf-scale-down`
- `sf-slide-in-up`, `sf-slide-in-down`, `sf-slide-in-left`, `sf-slide-in-right`
- `sf-float`, `sf-ping`, `sf-spin`, `sf-shimmer`, `sf-blink`
- `sf-color-pulse`

## Stagger delays

Use the delay tokens to stagger children:

```html
<div class="sf-entrance--fade-up" style="animation-delay: var(--sf-animation-delay-1)">First</div>
<div class="sf-entrance--fade-up" style="animation-delay: var(--sf-animation-delay-2)">Second</div>
<div class="sf-entrance--fade-up" style="animation-delay: var(--sf-animation-delay-3)">Third</div>
```

| Token | Value |
|---|---|
| `--sf-animation-delay-1` | `75ms` |
| `--sf-animation-delay-2` | `150ms` |
| `--sf-animation-delay-3` | `225ms` |
| `--sf-animation-delay-4` | `300ms` |
| `--sf-animation-delay-5` | `375ms` |

> Delay values are also scaled by `--sf-motion-scale`.

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
`.theme-transition` helper (`optional/theme-example.css`): add it to `<html>`
during the toggle, remove it once complete. See [theming.md](theming.md).
