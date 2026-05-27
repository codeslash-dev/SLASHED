# Motion

Everything animation and transition in SLASHED. Source: `core/motion.css`
(layer `slashed.motion`) and the animation/duration/easing tokens in
`core/tokens.css`.

**Reduced-motion handling:** all classes and presets below are gated by
`@media (prefers-reduced-motion: no-preference)`. Users who disable motion
see nothing — `accessibility.css` also neutralises animation-duration as a
hard backstop. Never rely on an animation class as the sole way to show/hide
content.

---

## Direct animation classes

Apply directly to an element. Each maps to an `--sf-animation-*` token preset
which pairs the keyframe name with duration, easing, and `fill-mode: both`.

| Class | Keyframe | Default timing | Use case |
|---|---|---|---|
| `.sf-fade-in` | `sf-fade-in` | normal / ease-out | Element appears |
| `.sf-fade-out` | `sf-fade-out` | normal / ease-in | Element disappears |
| `.sf-slide-in-up` | `sf-slide-in-up` | normal / ease-out | Content enters from below |
| `.sf-slide-in-down` | `sf-slide-in-down` | normal / ease-out | Content enters from above |
| `.sf-slide-in-left` | `sf-slide-in-left` | normal / ease-out | Content enters from right |
| `.sf-slide-in-right` | `sf-slide-in-right` | normal / ease-out | Content enters from left |
| `.sf-scale-up` | `sf-scale-up` | normal / overshoot | Modal/popover entrance |
| `.sf-scale-down` | `sf-scale-down` | normal / ease-in | Modal/popover exit |
| `.sf-color-pulse` | `sf-color-pulse` | slow / ease-in-out / infinite | Brand color breathe (proves @property interpolation) |

---

## Scroll-driven entrance classes

Animate an element as it enters the viewport. Uses `animation-timeline: view()`
where supported (Chrome 115+, Firefox 145+); falls back to a one-shot
time-driven animation at `--sf-duration-slow` on engines without support
(Safari as of 2026).

| Class | Animation | Direction |
|---|---|---|
| `.sf-entrance--fade` | Opacity 0 → 1 | — |
| `.sf-entrance--fade-up` | Opacity + translate from below | ↑ |
| `.sf-entrance--fade-down` | Opacity + translate from above | ↓ |
| `.sf-entrance--fade-left` | Opacity + translate from right | ← |
| `.sf-entrance--fade-right` | Opacity + translate from left | → |
| `.sf-entrance--scale-up` | Opacity + scale 0.92 → 1 | ↗ |

Override the scroll range via tokens:
```css
:root {
  --sf-scroll-timeline-range-start: entry 10%;
  --sf-scroll-timeline-range-end:   cover 40%;
}
```

---

## Keyframes-only (no utility class)

These keyframes ship but have no direct `.sf-*` class. Apply via your own
component rules or use the `--sf-animation-*` token preset directly:

```css
.notification-badge::after {
  animation: var(--sf-animation-ping);
}
```

| Keyframe | Token preset | Timing | Purpose |
|---|---|---|---|
| `sf-spin` | `--sf-animation-spin` | slower / linear / infinite | Spinner rotation |
| `sf-shimmer` | `--sf-animation-shimmer` | 1.5s / ease-in-out / infinite | Skeleton loading gradient |
| `sf-ping` | `--sf-animation-ping` | slow / ease-out / infinite | Expanding ring (notification badge) |
| `sf-blink` | `--sf-animation-blink` | 1s / steps / infinite | Cursor blink |
| `sf-float` | `--sf-animation-float` | 3s / ease-in-out / infinite | Gentle vertical bob |

**Why no utility class?** `spin` and `shimmer` are consumed internally by
`.is-loading` and `.is-skeleton` (in `core/states.css`). `ping`, `blink`,
and `float` are decorative and highly contextual — a generic class would
encourage overuse and accessibility issues.

---

## Animation preset tokens

Full shorthand tokens — use in `animation:` declarations:

| Token | Value |
|---|---|
| `--sf-animation-fade-in` | `sf-fade-in var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-fade-out` | `sf-fade-out var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-slide-in-up` | `sf-slide-in-up var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-down` | `sf-slide-in-down var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-left` | `sf-slide-in-left var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-slide-in-right` | `sf-slide-in-right var(--sf-duration-normal) var(--sf-ease-out) both` |
| `--sf-animation-scale-up` | `sf-scale-up var(--sf-duration-normal) var(--sf-ease-overshoot) both` |
| `--sf-animation-scale-down` | `sf-scale-down var(--sf-duration-normal) var(--sf-ease-in) both` |
| `--sf-animation-color-pulse` | `sf-color-pulse var(--sf-duration-slow) var(--sf-ease-in-out) infinite` |
| `--sf-animation-ping` | `sf-ping var(--sf-duration-slow) var(--sf-ease-out) infinite` |
| `--sf-animation-blink` | `sf-blink 1s steps(1, end) infinite` |
| `--sf-animation-float` | `sf-float 3s var(--sf-ease-in-out) infinite` |
| `--sf-animation-spin` | `sf-spin var(--sf-duration-slower) linear infinite` |
| `--sf-animation-shimmer` | `sf-shimmer 1.5s ease-in-out infinite` |

---

## Stagger delays

Apply staggered entrance timing to successive child elements:

```html
<div class="sf-stack">
  <article class="sf-fade-in" style="animation-delay: var(--sf-animation-delay-1)">…</article>
  <article class="sf-fade-in" style="animation-delay: var(--sf-animation-delay-2)">…</article>
  <article class="sf-fade-in" style="animation-delay: var(--sf-animation-delay-3)">…</article>
</div>
```

| Token | Value |
|---|---|
| `--sf-animation-delay-1` | 75ms × motion-scale |
| `--sf-animation-delay-2` | 150ms × motion-scale |
| `--sf-animation-delay-3` | 225ms × motion-scale |
| `--sf-animation-delay-4` | 300ms × motion-scale |
| `--sf-animation-delay-5` | 375ms × motion-scale |

No `.sf-stagger` utility class ships (by design). Use inline styles or
your own BEM rules.

---

## Duration & easing tokens

| Token | Value |
|---|---|
| `--sf-duration-none` | `0ms` |
| `--sf-duration-instant` | `100ms` × motion-scale |
| `--sf-duration-fast` | `150ms` × motion-scale |
| `--sf-duration-normal` | `250ms` × motion-scale |
| `--sf-duration-slow` | `400ms` × motion-scale |
| `--sf-duration-slower` | `600ms` × motion-scale |

| Token | Curve |
|---|---|
| `--sf-ease-linear` | `linear` |
| `--sf-ease-out` | `cubic-bezier(0.25, 0, 0.15, 1)` |
| `--sf-ease-in` | `cubic-bezier(0.5, 0, 0.75, 0.25)` |
| `--sf-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--sf-ease-spring` | `linear(0, 0.5, 1.1, 0.95, 1.02, 1)` |
| `--sf-ease-elastic` | `linear(0, 0.3, 1.2, 0.9, 1.05, 1)` |
| `--sf-ease-bounce` | `linear(0, 0.35 18%, 1 32%, 0.86 42%, …)` |
| `--sf-ease-overshoot` | `linear(0, 0.6 30%, 1.08 55%, 0.98 75%, 1)` |

Override globally: `--sf-motion-scale: 1.5` slows everything 50%.
Set `--sf-motion-scale: 0` to disable all motion at the token level.

---

## Transition presets (in `core/tokens.css`)

Shorthand values for `transition`:

| Token | Properties |
|---|---|
| `--sf-transition-all` | `all` (perf footgun — forces browser to watch every property) |
| `--sf-transition-colors` | `color, background-color, border-color, text-decoration-color, fill, stroke` |
| `--sf-transition-transform` | `transform` |
| `--sf-transition-opacity` | `opacity` |
| `--sf-transition-shadow` | `box-shadow` |
| `--sf-transition-fast` | duration-fast timing shorthand |
| `--sf-transition-slow` | duration-slow timing shorthand |
| `--sf-transition-enter` | entry timing (normal / ease-out) |
| `--sf-transition-exit` | exit timing (fast / ease-in) |

---

## View transitions

`core/motion.css` ships default timing for `::view-transition-old(root)` and
`::view-transition-new(root)` (duration-normal, ease-out). The
`.theme-transition` class in `optional/theme-example.css` is a complementary
opt-in for colour transitions during theme toggles.

---

## Design decisions

- **No `@starting-style` rules.** These are element-specific (dialog, popover)
  and will ship with the components layer when it activates.
- **`html:focus-within { scroll-behavior: auto }`** — the Andy Bell pattern.
  Prevents smooth-scroll from hijacking keyboard navigation.
- **Keyframes outside `@media (prefers-reduced-motion)`** — inert until
  referenced, so consumers can use them at will. The no-preference wrapper
  only gates the utility classes.
