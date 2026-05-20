# Migrating from SLASHED 0.1.0 to 0.2.0

## TL;DR

0.2.0 is a drop-in upgrade. No public token was renamed, no rule was removed, no selector was tightened. The release adds 70 plus new tokens (full `font-weight` scale, font features and variation, three new easings, eight named animation presets, text-shadow and drop-shadow scales, breakpoint and container-query tokens, perspective and anchor-offset slots, on-color and shadow control parameters), introduces forced-colors support, and resolves three rendering bugs found in the 0.1.0 audit.

---

## New tokens

**Typography**

- `--sf-font-weight-100` through `--sf-font-weight-900` (full numeric scale)
- `--sf-font-features-body`, `--sf-font-features-heading`, `--sf-font-features-display`, `--sf-font-features-mono`
- `--sf-font-variation-body`, `--sf-font-variation-heading`, `--sf-font-variation-display`
- `--sf-font-optical-sizing`

**Motion**

- `--sf-ease-back-in`, `--sf-ease-back-out`, `--sf-ease-bounce`
- `--sf-animation-fade-in`, `--sf-animation-fade-out`, `--sf-animation-slide-in-up`, `--sf-animation-slide-in-down`, `--sf-animation-slide-in-left`, `--sf-animation-slide-in-right`, `--sf-animation-scale-up`, `--sf-animation-scale-down`

**Shadows**

- `--sf-text-shadow-s`, `--sf-text-shadow-m`, `--sf-text-shadow-l`
- `--sf-drop-shadow-s`, `--sf-drop-shadow-m`, `--sf-drop-shadow-l`

**Breakpoints and container queries**

- `--sf-bp-xs`, `--sf-bp-sm`, `--sf-bp-md`, `--sf-bp-lg`, `--sf-bp-xl`, `--sf-bp-2xl`
- `--sf-cq-xs`, `--sf-cq-sm`, `--sf-cq-md`, `--sf-cq-lg`, `--sf-cq-xl`

**Forward-looking**

- `--sf-anchor-offset`
- `--sf-perspective-near`, `--sf-perspective-normal`, `--sf-perspective-far`

**Control parameters**

- `--sf-on-color-light`, `--sf-on-color-dark`, `--sf-on-color-threshold`
- `--sf-shadow-cap`, `--sf-shadow-base-strength`, `--sf-shadow-dark-boost`
- `--sf-derive-l-min`, `--sf-derive-l-max`, `--sf-derive-l-slope`, `--sf-derive-l-intercept`, `--sf-derive-c-factor`
- `--sf-derive-base-l-min`, `--sf-derive-base-l-max`, `--sf-derive-base-l-intercept`, `--sf-derive-base-c-factor`

---

## Bugs fixed

- **BUG-1: shadow alpha capped.** The largest shadow tier in 0.1.0 could exceed alpha 1 in dark mode. The new `--sf-shadow-cap` (default `0.7`) prevents the long-blur layers on `--sf-shadow-l`, `--sf-shadow-xl`, and `--sf-shadow-2xl` from saturating into a flat black blob.
- **BUG-2: link hover direction.** `--sf-color-link--hover` and `--sf-color-link--active` now use `light-dark()` so that hover darkens the link in light mode and lightens it in dark mode (0.1.0 darkened in both modes).
- **BUG-3: inverse text clamp.** `--sf-color-text--inverse` now clamps the L value into a safe contrast range, eliminating the near-black on near-black case when consumers picked an unusual `--sf-color-neutral`.

---

## Behavioural changes

- **Smooth scroll**: `html { scroll-behavior: smooth }` is now gated only by `@media (prefers-reduced-motion: no-preference)`. Anchor-link clicks scroll smoothly for everyone who has not explicitly opted out. The previous `:focus-within` trapdoor pattern (which forced `scroll-behavior: auto` whenever any element on the page held focus) was removed: it broke smooth scroll on every page that contained a focusable element. Reduced-motion users remain protected by `core/accessibility.css`, which forces `scroll-behavior: auto !important` and zeros every `--sf-duration-*` token.

---

## Breaking changes

None.

---

## Recommended upgrade path

1. Pull the new bundle: replace `dist/slashed.essential.css`, or update your individual `core/*.css` imports.
2. Override changes are not required: every existing `:root` override keeps working.
3. Optionally adopt the new tokens. Common quick wins:
   - Reach for `--sf-animation-slide-in-up` instead of writing your own `@keyframes` for toasts.
   - Use `--sf-cq-md` and friends in your container queries instead of hardcoded `48em`.
   - Tune `--sf-shadow-color` once to tint every shadow on the page.
4. Run your existing visual regression suite. No expected diffs apart from the three bugfix sites listed above.
