# Design decisions: color-alias layer for SLASHED

> **Status:** Decisions 1–4 and 6–7 are **implemented** in
> `optional/tokens.palette.css` (full 50–950 numeric scale, a5–a95 alpha,
> shade aliases, functional aliases). Decision 5 (status mini-palette) was
> **already covered** in `core/tokens.css` via the
> `--sf-color-{status}-subtle/muted/strong` triplets, so it is not duplicated
> in the palette file. This document is the design record behind those tokens.

## Context and problem

SLASHED has a three-layer color architecture:
1. **Source tokens** (`@property`) — 11 `-light`/`-dark` pairs for theming
2. **Resolved tokens** — `--sf-color-primary` via `light-dark()` auto-switch
3. **Palette (optional)** — numeric shades + alpha variants

What was missing is a layer of **semantic aliases** that:
- Gives readable, self-documenting names (`--sf-color-primary-xdark` instead of
  `--sf-color-primary-900`)
- Allows global remapping with a single override (changing `xdark` from 950 to
  800 shifts the whole page)
- Separates intent from implementation

---

## Decision 1: Extend the numeric scale

**Old scale**: 100, 200, 300, 400, 600, 700, 800, 900 (8 steps, missing 50/500/950)

**New scale**: 50, 100, 200, 300, 400, **500**, 600, 700, 800, 900, 950 (11 steps)

- `500` = alias for `var(--sf-color-primary)` (the base color)
- `50` = lightest (near-white with a hint of color)
- `950` = darkest (near-black with a hint of color)
- Model matches Tailwind (the de facto industry standard)

**Applies to**: 6 brand colors (primary, secondary, tertiary, action, neutral, base)

---

## Decision 2: Extend the alpha scale

**Old scale**: a10, a20, a30, a50, a75 (5 steps, asymmetric)

**New scale**: a5, a10, a20, a30, a40, a50, a60, a70, a80, a90, a95 (11 steps)

- Symmetric, denser at the extremes (a5 and a95)
- Middle steps every 10pp
- a5 = subtle backgrounds, hovers
- a95 = nearly opaque, useful for overlays
- Full 100% isn't needed — that's the base color itself
- The old off-grid `a75` is dropped; `a70`/`a80` cover its range.

**Applies to**: 6 brand colors

---

## Decision 3: Semantic shade aliases (6 per brand color)

```text
--sf-color-{color}-superlight  → 50
--sf-color-{color}-xlight      → 200
--sf-color-{color}-lighter     → 400
  [base = 500 = --sf-color-{color}]
--sf-color-{color}-darker      → 600
--sf-color-{color}-xdark       → 800
--sf-color-{color}-superdark   → 950
```

**Naming logic**:
- 3 steps on the light side: `superlight` > `xlight` > `lighter`
- 3 steps on the dark side: `darker` > `xdark` > `superdark`
- Comparative form (`-er`) = closest to base
- Prefix `x-` = farther from base
- Prefix `super-` = the extremes
- The symmetry is immediately readable

**Why not `-light`/`-dark`**: those are taken by the source tokens
(`--sf-color-primary-light` = the light-mode value). The `-er` suffix avoids the
collision and also signals proximity to base.

**Applies to**: 6 brand colors (primary, secondary, tertiary, action, neutral, base)

---

## Decision 4: Functional aliases (per brand color)

```text
--sf-color-{color}-hover    → var(--sf-color-{color}-darker)
--sf-color-{color}-active   → var(--sf-color-{color}-xdark)
--sf-color-{color}-subtle   → var(--sf-color-{color}-a10)
--sf-color-{color}-muted    → var(--sf-color-{color}-a30)
--sf-color-{color}-ghost    → var(--sf-color-{color}-a5)
```

- They describe intent, not appearance
- They point at other aliases (not directly at numerics) — a chain of aliases, so
  one override propagates
- `hover`/`active` = interactions
- `subtle`/`muted`/`ghost` = transparent variants from barely-visible to soft

> Note: these are **per-color** (`--sf-color-primary-hover`) and complement — not
> duplicate — the generic interaction tokens in `core/tokens.css`
> (`--sf-color-bg--hover`), which are palette-agnostic. Different scope.

---

## Decision 5: Status colors — mini-palette

Status colors (success, warning, error, info, danger) **don't need a full 50–950
scale**. They get a 3-alias mini-palette:

```text
--sf-color-{status}-subtle   → background (alpha ~10%)
--sf-color-{status}-muted    → border / soft bg (alpha ~30%)
--sf-color-{status}-strong   → emphasis / text (shade ~700)
```

**Rationale**: status colors have a narrow use (alerts, badges, validation). A full
palette would be overengineering. These 3 aliases cover 95% of use cases: alert
background, alert border, alert text/icon.

**Resolved**: `core/tokens.css` already defines
`--sf-color-{status}-subtle/muted/strong`, so the palette file does **not**
redefine them — it relies on the core triplets.

---

## Decision 6: File location

Everything lives in the existing `optional/tokens.palette.css`:
- Extended numeric palette (50, 500, 950 added)
- Extended alpha (11 steps)
- Semantic shade aliases
- Functional aliases

One file, one layer (`slashed.tokens`), optional import.

---

## Decision 7: Remapping mechanism

Shade aliases point at the numeric palette via `var()`:
```css
--sf-color-primary-xdark: var(--sf-color-primary-800);
```

Functional aliases point at shade aliases via `var()`:
```css
--sf-color-primary-hover: var(--sf-color-primary-darker);
```

A consumer overrides in their own CSS:
```css
:root {
  --sf-color-primary-xdark: var(--sf-color-primary-700); /* lighter xdark */
  --sf-color-primary-hover: var(--sf-color-primary-xdark); /* hover = xdark */
}
```

One override propagates to every place that uses the alias.

---

## Quantitative summary

Per brand color (6 colors):
- 11 numeric tokens (50–950)
- 11 alpha tokens (a5–a95)
- 6 shade aliases
- 5 functional aliases

**Brand total**: 6 × 33 = **198 tokens**

Per status color (5 colors):
- 3 aliases (defined in `core/tokens.css`, not here)

**Status total**: 5 × 3 = **15 tokens**

**Grand total**: ~213 tokens across `tokens.palette.css` + `core/tokens.css`

---

## Industry patterns used as inspiration

| System | What we took |
|---|---|
| Automatic.CSS | The concept of remappable aliases (`ultra-dark` etc.) |
| Radix Colors | Each palette step has a defined functional purpose |
| Tailwind | The 50–950 scale, the de facto numeric standard |
| Material Design 3 | Role-based tokens (functional aliases) |
| W3C Design Tokens spec | Alias token = reference to another token |

---

## Resolved open questions

1. **Do functional aliases (`hover`, `active`) duplicate logic in `core/tokens.css`?**
   No — `core` has `--sf-color-bg--hover` (generic, palette-agnostic); here we have
   `--sf-color-primary-hover` (per color). Different scope; both kept.
2. **Relation of `--sf-color-{status}-subtle/muted/strong` to the existing core
   triplets?** They are the same tokens — defined once in `core/tokens.css` and not
   duplicated here.
3. **Should `500` be literally `var(--sf-color-primary)` or a `color-mix(... 100%,
   transparent)`?** Literal `var(--sf-color-primary)` — simpler and more predictable;
   no needless color-mix.
