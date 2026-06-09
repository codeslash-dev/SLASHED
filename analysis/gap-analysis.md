# SLASHED — Competitive Gap Analysis

> **Question:** what is still missing from SLASHED that holds it back versus its
> direct competitor **Automatic.css (ACSS) v4**, cross-checked against
> **Bulma v1** and **Tailwind CSS v4**?
>
> **Scope guard (per request):** utility classes and pre-built components are
> **excluded** on both sides. We compare *engines*: the token/variable system,
> the generative colour/type/space machinery, theming, and architecture.
>
> **Lens:** every gap is judged against SLASHED's stated philosophy —
> **no build, no Node, no JS, pure CSS, BEM-first, token-first, modern-only.**
> A "gap" only counts if closing it is *consistent with that philosophy*. Where a
> difference is a deliberate philosophical choice, it is flagged as **Not a gap**.

Sources: [ACSS — What's new in 4](https://docs.automaticcss.com/setup/whats-new-in-4),
[ACSS colour palette](https://docs.automaticcss.com/colors/palette-intro),
[ACSS modern colour-scheme](https://docs.automaticcss.com/color-scheme/modern-color-scheme-workflow),
[ACSS section spacing](https://docs.automaticcss.com/spacing/section-spacing),
[ACSS columns](https://docs.automaticcss.com/columns/css-columns),
[Bulma v1 CSS variables](https://bulma.io/documentation/features/css-variables/),
[Bulma v1 themes](https://bulma.io/documentation/features/themes/),
[Tailwind v4 `@theme`](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06).
*Content was rephrased for compliance with licensing restrictions.*

---

## Headline

The single most striking finding: **ACSS v4 has repositioned to "variable-first,
BEM-first" — the exact space SLASHED occupies.** They are now genuinely the same
*category* of tool. SLASHED's architecture (cascade layers, OKLCH relative colour,
`light-dark()`, container-query primitives) is, feature-for-feature, *more modern*
than ACSS in several places. SLASHED does not lose on **what** it computes.

Where it loses is on **how configurable the computation is**. ACSS's whole value
is that a few inputs *regenerate the entire system*. SLASHED bakes the outputs into
the token values, so the consumer can recolour but cannot easily *re-shape* the
scales. That is the gap that holds it back.

---

## Tier 1 — Real gaps that hold SLASHED back

### 1. The fluid scales are pre-computed, not generative ⭐ (biggest gap)

ACSS lets you set a **type-scale ratio**, **base min/max size**, and **min/max
viewport**, and regenerates every `clamp()` from those inputs. Tailwind v4 derives
its whole spacing scale from a single `--spacing` base via `calc()`. Bulma derives
shades and sizes from a handful of Sass inputs.

SLASHED bakes the slope and the **360 px (`22.5rem`) lower viewport bound** straight
into each token value, e.g.:

```css
--sf-text-m: calc(clamp(1rem, calc(0.0037037 * (100vw - 22.5rem) + 1rem), 1.25rem) * var(--sf-text-scale));
```

The only consumer dials are **linear multipliers** (`--sf-text-scale`,
`--sf-space-scale`, …). You can make everything bigger or smaller, but you **cannot
change**:
- the **modular ratio** (1.2 vs 1.25 vs 1.333) of the type scale;
- the **viewport range** over which fluidity happens (where it starts/stops);
- the **base size** independently of the curve.

> **This is the root cause of the 72 "bridge" tokens** flagged in the
> categorization (`--sf-space-l-to-m`, etc.). They are a brute-force, hand-computed
> stand-in for the generator ACSS ships. A generator removes the need for the
> matrix entirely.

**Philosophy verdict: CLOSEABLE without a build.** Pure CSS `calc()` can compute a
fluid `clamp()` from tokenised inputs at runtime. Expose:

```css
--sf-fluid-min-vw: 22.5rem;   /* currently hard-coded */
--sf-fluid-max-vw: 96rem;     /* currently hard-coded */
--sf-text-ratio:   1.25;      /* modular ratio, currently implicit */
```

and rebuild the scale tokens as `calc()` expressions over those vars (the slope
`(max - min) / (maxVw - minVw)` is expressible in CSS). This keeps "no build" while
giving ACSS-level reshaping. **Highest-leverage single improvement.**

### 2. No `fluid()` primitive for ad-hoc responsive values

ACSS ships a `fluid(min, max)` helper so *any* property can be made responsive
inline. SLASHED offers only the fixed scale steps plus the bridge matrix; an
arbitrary "fluidly go from 14px to 22px here" needs hand-written `clamp()`.

CSS has no user-defined functions, so a literal `fluid()` is impossible without a
build — **a genuine, philosophy-bound limitation, not an oversight.** But it can be
*mitigated* the same way as gap #1: a documented one-line `clamp()` recipe driven by
the `--sf-fluid-*` viewport tokens, so consumers compose fluid values consistently
instead of guessing magic numbers. Worth shipping as a documented pattern + maybe a
couple of "open" slots (`--sf-fluid-1..3`) authors can define per scope.

### 3. No guided configuration / "starter theme" story

ACSS's adoption advantage is the **dashboard + live preview**: pick brand colours, a
scale, spacing, done. Bulma ships a default light theme file you copy and tweak.
Tailwind centralises everything in one `@theme` block.

SLASHED's onboarding is "override these 6 tokens (and optionally ~16 more), and read
several docs." There is `optional/theme-example.css`, but no single, copy-paste
**config block** that surfaces *all* the realistic dials (6 colours + ratio +
viewport + spacing scale + radius + font families) in one place.

**Philosophy verdict: a visual dashboard is correctly OUT of scope** (it would
require a runtime/host app — contradicts no-build). **But a single annotated
`config.css`** "control panel" partial *is* in scope and would close most of the
ergonomic gap. This is docs/packaging, not engine work.

### 4. Auto colour-context relationships are class-gated, not pervasive

ACSS's "automatic colour relationships": set a background context and the
**foreground, headings, and links flip automatically** to their correct values.

SLASHED has the pieces — `--sf-color-text--on-*`, the `.sf-surface--*` macros, the
auto-contrast `code` token — but the auto-flip is **triggered by applying a specific
class** (`.sf-surface--primary`), not by a general "any element that sets a SLASHED
background re-derives its own foreground" contract. On an arbitrary
`background: var(--sf-color-primary)` with no surface class, text/heading/link
colours do **not** automatically adapt.

**Philosophy verdict: CLOSEABLE.** A small set of context tokens + a documented
"surface contract" (or having `.sf-surface--*` also rebind `--sf-color-text`,
`--sf-color-heading`, `--sf-color-link` for descendants) would generalise it.
Borderline already-present; needs completion + docs.

---

## Tier 2 — Smaller gaps / polish

### 5. Smart, metric-aware line-height
ACSS computes line-height from a leading value + the font's x-height ("Smart Line
Height") rather than a flat ratio. SLASHED uses static `--sf-leading-*` tokens plus
per-size overrides (`--sf-text-*-line-height`). Result is comparable in practice but
less "auto". **Closeable** as a documented `calc()` token; low priority.

### 6. Section-rhythm system with one knob
ACSS has a dedicated **section spacing** model: base spacing × a fluid multiplier +
a gutter, so whole-page vertical rhythm scales from one input. SLASHED has
`--sf-section-pad-*` + `.sf-section--*` sizes but not a single "multiply all section
padding by N between mobile and desktop" dial. **Partially present**; could be
unified with gap #1's generative approach.

### 7. Root font-size / rem & zoom accessibility strategy
ACSS documents root font-size management and rem handling. SLASHED is rem-based and
has scale multipliers but offers no explicit story for honouring user root-size /
browser zoom for accessibility. **Mostly a docs gap.**

### 8. One-input → full palette is implicit, not explicit
Bulma markets "input one colour, get dozens of shades"; ACSS shows the OKLCH ramp in
its dashboard. SLASHED *does* derive a full ramp from one `-light` token (arguably
its strongest area — 22 steps per family in `tokens.palette.css`), but this power is
**buried in advanced docs**. This is a **marketing/discoverability** gap, not a
capability gap — SLASHED already wins here and should say so louder.

---

## Not a gap — deliberate philosophical choices (do NOT "fix")

| Difference vs ACSS/others | Why it is correct for SLASHED |
|---|---|
| **No breakpoint tokens / breakpoint config** | Container-query-first is a core stance; custom props can't be used in `@media`/`@container` conditions anyway. Intentional. |
| **No visual dashboard / live preview** | Requires a runtime host app; violates no-build/no-Node. ACSS only has it because it's a WordPress plugin. |
| **No utility classes** | Explicitly BEM-first; the empty `utilities` layer is a documented stance through v1.0. |
| **Sass-style functions/mixins (Bulma) / build-time JIT (Tailwind)** | Both need a compiler. SLASHED's "pure CSS, link-and-go" is the differentiator. |
| **Modern-only floor** | Deliberate; enables `light-dark()` + `oklch(from …)` that the whole colour engine depends on. |

---

## Where SLASHED already leads (context for balance)

- **Architecture:** explicit, fully-ordered cascade-layer system (`tokens → … →
  overrides`) — cleaner than ACSS's specificity story.
- **Zero-dependency portability:** one `<link>`, no plugin, no compiler, runs on any
  stack. ACSS is WordPress/page-builder-centric; Bulma & Tailwind need a build.
- **Layout-primitive breadth:** the Every-Layout set (stack, cluster, cover,
  sidebar, switcher, imposter, reel, frame, content-grid…) is broader and more
  rigorous than ACSS's grid/flex helpers.
- **Container-query-native primitives** and a real **print layer**, **motion token
  system**, and a **40-strong `.is-*` state vocabulary** mapped to ARIA.

---

## Recommended priority order

1. **Tokenise the fluid engine** (`--sf-fluid-min-vw`/`-max-vw`, `--sf-*-ratio`,
   base-size dials) → unlocks ACSS-level reshaping, and lets you **delete the 72
   bridge tokens**. *(Tier 1 #1 — biggest win, philosophy-safe.)*
2. **Ship a single annotated `config.css` "control panel"** partial + a documented
   `clamp()` fluid recipe over the new viewport tokens. *(Tier 1 #2/#3.)*
3. **Generalise the surface/colour-context contract** so backgrounds auto-flip
   foregrounds beyond the `.sf-surface--*` classes. *(Tier 1 #4.)*
4. **Land the 8 components** (already reserved/0-byte) so `full`/`components` bundles
   stop being hollow — the credibility gap from the categorization.
5. Polish: smart line-height token, unified section-rhythm dial, root-size/zoom docs,
   and **market the existing one-token→full-ramp colour power** prominently.

> Net: SLASHED is not behind ACSS on *modern CSS* — it is ahead in places. It is
> behind on **configurability of its generative scales** and **onboarding
> ergonomics**. Both are closeable without abandoning "no build, pure CSS."
