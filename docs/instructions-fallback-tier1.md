# Tier 1 Color Fallback — Implementation Instructions

> Self-contained brief. Hand this file to a fresh session; it needs no other context. Goal: add clean, deterministic fallbacks for the three CSS features that currently set the framework's hard browser floor and that, without fallbacks, make pages **unusable** (invisible text, transparent backgrounds).

## 1. Scope — the three features

| Feature | Used for | Last engine to ship | Failure mode without fallback |
|---|---|---|---|
| `light-dark()` | every resolved color token (light/dark switch) | Chrome 123, Safari 17.5, Firefox 120 | token becomes invalid → text inherits (black-on-black) / background transparent |
| Relative color `oklch(from … )` | all derived shades, tints, alphas, auto-contrast text | Chrome 119, Safari 16.4, Firefox 128 | derived backgrounds/borders/buttons go transparent or invisible |
| `@property` | registered animatable color/source tokens | Chrome 85, Safari 16.4, Firefox 128 | a token whose only value is the `initial-value` becomes undefined |

`color-mix()` (Chrome 111 / Safari 16.2 / Firefox 113) is used alongside relative color in the derived layer and is fixed by the same gate.

Out of scope for this task: Tier 2 (`:has()`, subgrid), Tier 3 (`@starting-style`, `text-wrap`), components, utilities, and base `oklch()` source colors (universally supported by mid-2023; only revisit if a sub-2023 floor is later required).

## 2. Read this first — why these three are catastrophic (IACVT)

A `--token: light-dark(…)` (or relative-color / `color-mix`) declaration **parses successfully even on engines that don't support the function**. The value only becomes invalid when it is substituted into a real property via `var()` — this is **Invalid At Computed Value Time (IACVT)**. At that point the *consuming* property resolves to `unset` (→ inherited for `color`, transparent for `background`/`border`). Crucially, IACVT does **not** fall back to an earlier declaration of the same custom property.

**Consequence:** you cannot "declare a fallback value first, then the modern value second" — the modern declaration parses fine, shadows the fallback, and then poisons every consumer. 

**The one rule that governs this whole task:** *gate at the declaration site.* The precomputed sRGB value is the **unguarded default**; the modern expression lives **inside** an `@supports` block. (This inverts the current structure, where modern expressions are unguarded.)

## 3. Hard constraints — do not violate

- **Consumer stays build-free.** No runtime dependency, no consumer build step. Any generator is a dev-time script only. One shipped stylesheet must work on every engine — no separate file the consumer has to include.
- **Token API is frozen.** Do not remove or rename any `PUBLIC` / `PUBLIC-ADVANCED` token. `tests/token-api.snapshot.json` enforces this; update it only additively.
- **Preserve the 15-layer `@layer` order** declared in `core/layers.css`. All new color CSS belongs in the `slashed.tokens` layer (or `slashed.themes` for mode switching), never later.
- **Logical properties only**; `--sf-*` namespace only.
- **Default resolved values must not change** on modern engines — the modern path stays byte-equivalent to today.

## 4. Current architecture (where things live)

- `core/tokens.css` — three color sub-layers:
  1. **Source tokens** registered via `@property` (6 brand + 5 status, `-light`; `-dark` optional) and `@property --sf-is-dark`.
  2. **Resolved tokens** via `light-dark()` with dark auto-derived from light using relative color, e.g.
     `--sf-color-primary: light-dark(var(--sf-color-primary-light), var(--sf-color-primary-dark, oklch(from var(--sf-color-primary-light) clamp(0.65, calc(0.95 - l * 0.5), 0.88) calc(c * 0.9) h)));`
  3. **Derived tokens** via `color-mix(in oklab, …)` (shade ramp) and `oklch(from … l c h / <alpha>)` (alpha + auto-contrast), e.g.
     `--sf-color-primary-darker: color-mix(in oklab, var(--sf-color-primary) 82%, var(--sf-color-text));`
     `--sf-color-primary-subtle: oklch(from var(--sf-color-primary) l c h / 0.10);`
- `core/themes.css` — `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { color-scheme: dark } }`, explicit `[data-theme="light"|"dark"]`, and a lumlocker block already gated with `@supports (color: oklch(from red l c h))`.
- `optional/legacy.css` — `slashed.legacy` layer; today holds only non-color `@supports not (...)` fallbacks (`dvh`, `:focus-visible`, `scrollbar-gutter`). It explicitly does NOT handle color. This task fills that gap (but the new color fallbacks live in the tokens layer, not here — see §5).
- `scripts/gen-token-reference.js` — existing dev-time token tooling; mirror its conventions for the new generator.
- `tests/` — `token-api` snapshot, `container-queries`, `bundle-size`, `color-model`, plus a Playwright setup (`playwright.config.js`) usable for visual regression.

## 5. Work phases

### Phase 0 — verify before changing
- Confirm which source `-light` tokens have a plain `:root { --sf-color-…-light: … }` declaration vs only an `@property … initial-value`. List any that exist solely as an `initial-value`.
- Confirm the exact dark-derivation formula and every `color-mix` ratio / alpha value in `core/tokens.css` so the generator can reproduce them precisely.

### Phase 1 — `@property` source-token mirrors
For every registered source token that lacks one, add a plain `:root` declaration equal to its `@property` `initial-value`. `@property` then only adds typing/animation; it is never the sole source of a value.
- Drift guard (test): every `@property` color token has a matching plain `:root` declaration whose value equals the `initial-value`.

### Phase 2 — resolved tokens default to precomputed sRGB
Restructure each resolved token so the default is a precomputed sRGB literal and the modern `light-dark()` expression is gated:

```css
:root { --sf-color-primary: #RRGGBB; }                      /* generated: LIGHT sRGB */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { --sf-color-primary: #RRGGBB; }  /* generated: DARK sRGB */
}
[data-theme="light"] { --sf-color-primary: #RRGGBB; }
[data-theme="dark"]  { --sf-color-primary: #RRGGBB; }
@supports (color: light-dark(white, black)) {
  :root { --sf-color-primary: light-dark(var(--sf-color-primary-light), var(--sf-color-primary-dark)); }
}
```
Precedence on old engines: explicit `[data-theme]` > `prefers-color-scheme` > light default. On modern engines the `@supports` block restores today's live behaviour, and each token resolves through exactly one path.

### Phase 3 — derived tokens default to precomputed sRGB
Same pattern for the shade/tint/alpha/auto-contrast tokens (the largest set and the ones that vanish today). Alpha tokens precompute to `rgba()`:

```css
:root { --sf-color-primary-darker: #RRGGBB; }               /* generated, both modes via the §Phase-2 blocks */
:root { --sf-color-primary-subtle: rgba(R,G,B,0.10); }
@supports (color: oklch(from red l c h)) {
  :root {
    --sf-color-primary-darker: color-mix(in oklab, var(--sf-color-primary) 82%, var(--sf-color-text));
    --sf-color-primary-subtle: oklch(from var(--sf-color-primary) l c h / 0.10);
  }
}
```
The single gate `@supports (color: oklch(from red l c h))` covers both relative color and `color-mix`. Also gate the shadow tint (`--sf-shadow-color: oklch(from var(--sf-color-neutral) 0.15 c h)`) the same way.

### Phase 4 — the generator (dev-time only)
- Add `scripts/gen-color-fallbacks.js` next to `gen-token-reference.js`. Use a small OKLCH→sRGB converter as a **dev dependency only** (e.g. `culori`).
- It reads the source `-light`/`-dark` tokens, replays the exact dark-derivation formula and every `color-mix` ratio / alpha from `core/tokens.css`, and emits the gated fallback declarations for **both modes**, gamut-mapped into sRGB, alpha preserved.
- Emit into a generated partial in the `slashed.tokens` layer, ordered **before** the modern declarations, and ship it inside the normal bundle so a single stylesheet works everywhere (no consumer build).
- Wire it into the existing build/`scripts` flow so regeneration is one command.

### Phase 5 — overrides & staleness
- On modern engines, overriding a `-light` source token recomputes everything live (the `@supports` path uses `var()`), so nothing goes stale.
- On old engines, the precomputed literals will not track a runtime override. Handle by: (a) regenerating the fallback partial for a custom brand via the dev-time generator, and (b) documenting that arbitrary runtime overrides only fully propagate on modern engines.

### Phase 6 — validation
- **Property tests:** for every Tier-1 token, the unguarded default parses as a valid sRGB color (never empty / `unset` / invalid).
- **Perceptual bound:** fallback vs modern differ by `ΔE_OK ≤ 0.02`, or the pair is listed in a documented accepted-degradation register.
- **Contrast:** WCAG 2.1 AA (4.5:1 normal, 3:1 large/UI) on the default palette, both modes, computed on the **fallback** values.
- **Visual regression (Playwright):** snapshot the demo with `light-dark()` / relative color disabled vs enabled; diff bounded.
- **Drift:** re-running the generator produces no diff in CI.
- **Regression:** modern-engine computed values are unchanged vs current `main`.

## 6. Definition of done

- [ ] Every source token has a plain `:root` value (not only an `@property` `initial-value`).
- [ ] Every resolved and derived color token has a precomputed sRGB (or `rgba`) default, with the modern expression gated behind the correct `@supports` query.
- [ ] Dark mode works on engines without `light-dark()` via `prefers-color-scheme` + `[data-theme]`, with documented precedence and single-path resolution.
- [ ] A single shipped stylesheet works on all targeted engines; no consumer build introduced.
- [ ] `gen-color-fallbacks.js` exists, is dev-time only, and regeneration is idempotent (CI drift check passes).
- [ ] All validation in Phase 6 passes; `tests/token-api.snapshot.json` updated additively only.
- [ ] Modern-engine output is byte-equivalent to pre-change for the default palette.

## 7. Suggested order of execution

Phase 0 → 1 (small, unblocks the rest) → 4 (generator, so values are produced not hand-typed) → 2 → 3 → 5 → 6.
