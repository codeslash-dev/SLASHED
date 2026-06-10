# SLASHED — Competitive Gap Analysis (v0.5.28)

> **Question:** what is still missing from SLASHED that holds it back versus its
> direct competitor **Automatic.css (ACSS) v4**?
>
> **Scope guard (per request):** pre-built components, plain utility classes,
> and ecosystem/community factors are **excluded** on both sides. We compare
> *engines*: the token/variable API, the generative colour/type/space machinery,
> theming, contexts, and architecture.
>
> **Lens:** every gap is judged against SLASHED's stated philosophy —
> **no build, no Node, no JS, pure CSS, BEM-first, token-first, modern-only.**
> A "gap" only counts if closing it is *consistent with that philosophy*. Where a
> difference is a deliberate philosophical choice, it is flagged as **Not a gap**.
>
> This supersedes the earlier revision of this document, which audited a
> pre-generative-engine build. Two of its Tier-1 gaps have since been closed in
> source; the verdicts below reflect **v0.5.28** as shipped.

Sources: [ACSS — What's new in 4](https://docs.automaticcss.com/setup/whats-new-in-4),
[ACSS contextual backgrounds](https://docs.automaticcss.com/backgrounds/contextual-background-colors),
[ACSS colour palette](https://docs.automaticcss.com/colors/palette-intro),
[ACSS section spacing](https://docs.automaticcss.com/spacing/section-spacing).
*Content was rephrased for compliance with licensing restrictions.*

---

## Headline

ACSS v4 has repositioned to **"variable-first, BEM-first"** with cascade layers,
OKLCH, `light-dark()`/`color-scheme`, and a breakpoint-free stance — the exact
category SLASHED occupies. They are now directly comparable engines, and the
feature-for-feature distance has **narrowed dramatically since the previous
audit**:

- **The generative fluid engine has landed.** Type, display, and space scales
  are now computed at runtime from 12 override-able inputs
  (`--sf-fluid-{min,max}-vw`, `--sf-{text,space}-ratio-{min,max}`,
  `--sf-{text,space}-base-{min,max}`, `--sf-text-display-base-{min,max}`,
  `core/tokens.css`). This was the previous audit's #1 gap. SLASHED now matches
  ACSS's "few inputs regenerate the system" value proposition **without a
  dashboard or build step** — and exceeds it in one respect: the **dual-ratio**
  design (a different modular ratio at the min and max viewport) has no ACSS
  equivalent.
- **The contextual colour cascade has landed.** `.sf-surface--*` (11 variants,
  `core/macros.css`) now re-declares ~11 semantic tokens (`--sf-color-text`,
  `--sf-color-heading`, `--sf-color-link`+states, secondary/placeholder/disabled
  text, three border weights, shadow colour) so descendants adapt with no extra
  classes. This is functional parity with ACSS v4 contextual backgrounds.
- The 72 `-to-` bridge tokens are now **generated from the same engine**
  (`optional/tokens.sizes-extended.css`) and recalibrate with it, and have been
  re-tiered PUBLIC-ADVANCED — the "hand-computed matrix" critique no longer
  applies.

What remains is a shorter list: one genuine platform-bound limitation
(`fluid()`), one coverage gap (contexts beyond the 11 surfaces), and a cluster
of **documentation/packaging gaps** — the new engine is barely surfaced in the
human-readable docs.

---

## Closed since the previous audit (verified in source)

| Former gap | Status in v0.5.28 |
|---|---|
| #1 Fluid scales pre-computed, not generative | **Closed.** Runtime `pow()`/`calc()` engine over 12 `@property`-typed inputs; every `clamp()` recalibrates from `:root` overrides. |
| #4 Colour contexts class-gated, shallow | **Largely closed.** `.sf-surface--*` rebinds the full semantic token set for descendants (text, heading, links, borders, shadow colour). |
| Bridge matrix as "brute-force stand-in" | **Reframed.** Bridges are now engine-derived outputs, consistent by construction. |

---

## Tier 1 — Remaining real gaps

### 1. No ad-hoc `fluid(min, max)` primitive ⭐ (the one ACSS feature with no SLASHED answer)

ACSS v4 ships `fluid()` so *any* property value can interpolate between two
endpoints. SLASHED offers the fixed scale steps plus the bridge matrix; an
arbitrary "go from 0.875rem to 1.375rem here" still needs a hand-written
`clamp()`, and nothing guarantees the author reuses the engine's viewport range.

CSS has no cross-browser user-defined functions, so a literal `fluid()` remains
**a platform limitation, not an oversight**. But it can be closed in stages,
all philosophy-safe:

1. **Now — documented recipe.** One canonical `clamp()` pattern driven by the
   existing engine tokens, published in `docs/theming.md`/`docs/macros.md`:

   ```css
   /* fluid from MIN rem to MAX rem across the engine's viewport range */
   --my-value: clamp(
     MINrem,
     calc((MAX - MIN) / (var(--sf-fluid-max-vw) - var(--sf-fluid-min-vw))
          * (100vw - var(--sf-fluid-min-vw) * 1rem) + MINrem),
     MAXrem
   );
   ```

   Because it reads `--sf-fluid-*`, ad-hoc values stay in sync when the engine
   is recalibrated — the property ACSS's `fluid()` users actually rely on.
2. **Now — open slots.** A few pre-wired tokens
   (`--sf-fluid-custom-{1..3}` with `--sf-fluid-custom-N-{min,max}` endpoint
   inputs) so common cases need only two numbers, no formula.
3. **Later — native `@function`.** CSS custom functions (`@function --fluid(...)`)
   shipped in Chromium in 2025 and are progressing elsewhere. An optional
   `optional/functions.css` module can deliver a true `--fluid()` as progressive
   enhancement once a second engine ships, without violating no-build. Track it
   in the roadmap now.

### 2. The generative engine is invisible in the docs and the theming story

This is the inverse of the old gap: the engine exists, but a consumer reading
`README.md`, `docs/theming.md`, or `optional/theme-example.css` will not learn
it exists. Verified: `docs/theming.md` and `docs/architecture.md` contain **no
mention** of `--sf-text-ratio-*` / `--sf-fluid-*-vw`; `theme-example.css`
demonstrates every *colour* mechanism but none of the 12 scale dials. ACSS's
adoption advantage is precisely that its inputs are impossible to miss
(dashboard); SLASHED's equivalent must be impossible to miss *in the docs*.

**Fix (docs/packaging, no engine work):**
- a "Fluid engine" section in `docs/theming.md` (what each of the 12 inputs
  does, worked examples: change ratio, widen viewport range, scale base);
- extend `optional/theme-example.css` (or add `optional/config-example.css`)
  into the **single annotated control panel** the previous audit asked for:
  6 brand colours + 12 engine inputs + 5 scale multipliers + font families +
  radius in one copy-paste block;
- a README paragraph: "change one ratio, the whole system regenerates — no
  build" is now true and is the headline ACSS-parity claim. Say it.

### 3. Colour contexts stop at the 11 surface classes

ACSS contexts apply to any palette background, including tints/shades. SLASHED's
contextual cascade fires only on `.sf-surface--{brand|status|inverse}`. Set
`background: var(--sf-color-primary-100)` (or any arbitrary background) and
nothing re-derives; there is also no documented way to *author your own* surface
that participates in the contract.

**Fix, in order of leverage:**
1. **Document the surface contract as a recipe** — the 11-token rebinding block
   is a copy-paste pattern; publishing it lets any BEM component become a
   conforming surface today.
2. **Ship a generic surface primitive**: a `.sf-surface` (or `[data-surface]`)
   that reads one input — `--sf-surface-color: <any colour>` — and derives
   background, auto-contrast foreground (the `oklch(from …)` lightness-flip
   technique already used for `--sf-color-text--on-*`), and the contextual
   token set from it. This generalises contexts to *every* colour, including
   palette shades, with one class + one custom property — arguably beyond what
   ACSS offers.
3. Optional sugar: tint variants (`.sf-surface--primary-subtle` etc.) mapping to
   the existing `-100`/`-900` ramp with dark-mode-aware flips.

---

## Tier 2 — Smaller gaps / polish

### 4. Smart, metric-aware line-height
ACSS computes line-height from a leading value relative to font size. SLASHED
has static `--sf-leading-*` plus per-size overrides in `sizes-extended` whose
*defaults* encode the convention (big = tight) — close in outcome, manual in
mechanism. **Closeable** with a `calc()` leading formula keyed to the size step
(the engine exposes everything needed); low priority.

### 5. Section rhythm: indirect dial only
`--sf-section-pad--*` now derives from the generative space scale, so
recalibrating the engine or `--sf-space-scale` *does* re-rhythm sections — but
there is no **independent** section multiplier (ACSS: one section-space input ×
fluid multiplier). **Fix:** multiply the six `--sf-section-pad--*` definitions
by a new `--sf-section-scale` (default `1`). One token, ~6 lines.

### 6. Root font-size / zoom accessibility story
ACSS documents root-size and rem strategy explicitly. SLASHED is rem-based and
zoom-safe in practice but says nothing about it. **Docs-only gap:** a short
"root size, rem and user zoom" section in `docs/theming.md` (don't set a px
root size; how `--sf-*-base-*` interacts with user font-size preferences).

---

## Not a gap — deliberate philosophical choices (do NOT "fix")

| ACSS v4 feature | Why SLASHED should not copy it |
|---|---|
| **Dashboard / live preview / selective CSS output** | Requires a WordPress plugin runtime. SLASHED's equivalent is the engine tokens + (gap #2) a config partial. |
| **`?btn`-style expandable Recipes** | Build-time expansion inside a page-builder; needs tooling. SLASHED's macros (`.sf-prose`, `.sf-flow`, …) are runtime recipes — different, philosophy-consistent answer. |
| **Breakpoint configuration** | Both frameworks are now breakpoint-free; SLASHED is container-query-first on top. Parity-or-better, nothing to add. |
| **Utility classes** | Excluded from scope; BEM-first stance through v1.0. |
| **WordPress/builder integrations** | Ecosystem — out of scope per request; handled by the separate `slashed-for-wp` repo anyway. |

---

## Where SLASHED leads ACSS v4 (context for balance)

- **Dual-ratio fluid engine** — different modular ratio at min vs max viewport;
  ACSS exposes single ratios.
- **Typed tokens** — `@property` registration (animatable colours, typed engine
  scalars, sane `initial` behaviour). ACSS variables are untyped.
- **Fully ordered explicit layer stack** (`tokens → … → overrides`) with an
  always-last consumer layer; ACSS adopted layers in v4 but with a coarser
  contract.
- **Container-query-native layout primitives**, a real **print layer**, the
  **motion token system**, the 40-strong **`.is-*` ARIA-mapped state
  vocabulary**, and **LumLocker** — no ACSS equivalents.
- **Zero-dependency portability** — one `<link>`, any stack; ACSS requires the
  WordPress plugin (noting ecosystem is out of scope, the *architectural*
  consequence — no runtime requirement — is in scope and favours SLASHED).
- **One-token→full-ramp palette** (22 steps/family in `tokens.palette.css`)
  derived in pure CSS — ACSS needs its dashboard to do the same job.

---

## Recommended priority order

1. **Surface the engine** — docs section + single config-example "control
   panel" partial + README claim. Highest value-per-effort; pure docs. *(Gap #2)*
2. **Ship the fluid recipe + open slots**, and put native `@function --fluid()`
   on the roadmap. *(Gap #1)*
3. **Generalise the surface contract** — document the rebinding recipe, then a
   `--sf-surface-color`-driven generic surface. *(Gap #3)*
4. Polish: `--sf-section-scale`, calc-based smart leading, root-size/zoom docs.
   *(Gaps #4–6)*

> Net verdict: with the generative engine and contextual cascade shipped,
> SLASHED has reached **engine parity with ACSS v4 and leads it on modern-CSS
> depth** (typed tokens, dual ratios, container queries, layer rigour). The
> remaining deficit is one platform-bound primitive (`fluid()`, mitigable today,
> solvable natively soon) and **discoverability**: the engine's configurability
> currently lives only in source comments and generated references.
