# SLASHED API — Prioritisation Audit

> Source: `docs/api-index.json` (v0.5.24) — **1024 elements** (802 tokens, 222 classes).
> Tiers: 955 PUBLIC · 68 PUBLIC-ADVANCED · 1 INTERNAL.
> This is a **review artifact**, not generated. It applies editorial judgement on
> top of the generated index, grouped by family rather than per-symbol.

## How to read this

Every family is placed in exactly one bucket from the consumer's point of view —
"if I were shipping a site on SLASHED, how much does this earn its place?"

| Bucket | Meaning |
|---|---|
| **Must have** | Core identity of the framework. Removing it breaks the value proposition. |
| **Should have** | Strongly expected; high use, low cost. |
| **Nice to have** | Genuinely useful but niche or easily hand-rolled. |
| **Could do without** | Real but marginal; large surface for the payoff, or solvable another way. |
| **Not useful** | Cost/clutter outweighs benefit as currently shipped. |
| **Broken** | Declared but emits no working CSS (incomplete). |
| **Not used** | Ships but is inert / empty / never consumed. |

A recurring caveat: SLASHED is **token-first and BEM-first**. Many tokens
(`--sf-shadow-*`, `--sf-z-*`, `--sf-gradient-*`, `--sf-blur-*`) are *deliberately
not consumed by the framework itself* — they are the consumer API. Those are
**not** "dead code"; they are the product. They are scored on how useful they are
to a consumer, not on internal usage.

---

## 1. MUST HAVE — the product

These are why someone picks SLASHED over hand-rolling.

### Tokens
| Family | Count | Why |
|---|---|---|
| Brand colours (6 `-light` sources, `@property`) | 6 | The 6-token rebrand contract. The headline feature. |
| Status colours (success/warning/error/info/danger) + triplets | 25 | Auto-derived semantic colour; core to "explicit & deterministic". |
| Resolved colour tokens (`--sf-color-text/bg/border/heading/link`…) | ~40 | The semantic layer every BEM class reads. |
| Text-on-color (auto-contrast) | 13 | Self-correcting foreground; a real differentiator. |
| Surfaces (`--sf-color-bg/inset/raised`…) | 5 | Surface elevation model. |
| Spacing scale (`--sf-space-2xs…4xl`) + aliases | 18 | Fluid `clamp()` spacing — foundational. |
| Font sizes (`--sf-text-2xs…4xl`, display) | 12 | Fluid type scale — foundational. |
| Font weights / families / line-heights / letter-spacing | ~33 | Typographic baseline. |
| Border / radius / border-width | ~30 | Universal primitives. |

### Classes
| Family | Examples | Why |
|---|---|---|
| Core layout primitives | `.sf-stack` `.sf-cluster` `.sf-grid` `.sf-sidebar` `.sf-cover` `.sf-container` `.sf-center` `.sf-switcher` | The Every-Layout-style primitive set is the framework's spine. |
| Content layout | `.sf-content-grid` `.sf-breakout` `.sf-full-bleed` `.sf-section` | Article-with-breakouts is a marquee capability. |
| Prose + flow | `.sf-prose` `.sf-flow` | Long-form content styling + owl-selector rhythm. |
| Core a11y | `.sr-only` `.skip-link` `:focus-visible` handling | Non-negotiable accessibility floor. |

---

## 2. SHOULD HAVE — expected, cheap, high-use

### Tokens
| Family | Count | Note |
|---|---|---|
| Palette tints/shades/alpha (6 × `50…950` + `a5…a30` + named) | 132 | The shade ramp powering hover/subtle/muted. Ships in `optimal+`. Slightly over-granular (see §4) but mostly earns its place. |
| Typography aliases (`--sf-h1-size`, `--sf-body-*`, `--sf-code-*`) | 36 | Ergonomic; lets headings/body be retuned without touching base. Some redundancy (see §4). |
| Layout tokens (per-primitive gap/min/threshold knobs) | 48 | The instance-level `style="--sf-stack-gap"` API. |
| Macro tokens (prose measure, scrim, aspect, line-clamp) | 18 | Backs the macro recipes. |
| Shadows / blur / gradients / z-index | ~40 | Consumer BEM API; standard expectations. |
| Motion / easing / duration / transition shorthands | ~38 | Animation token set + scoped transitions. |
| Scale multipliers (`--sf-space-scale`, `--sf-text-scale`…) | 5 | Powerful global dials; PUBLIC-ADVANCED. |
| Icon sizes, UI sizes, section padding, containers | ~23 | Sizing scales for components. |

### Classes
| Family | Examples | Note |
|---|---|---|
| Layout variants (sizes/alignment) | `.sf-stack--{xs…2xl,center,end}` `.sf-cluster--*` `.sf-gap--*` | Size/alignment modifiers on primitives. |
| Fixed/ratio/fit grids | `.sf-grid-{2,3,4,6}` `.sf-grid--fit` `.sf-grid-1-2` | Container-query responsive grids. |
| Icon system | `.sf-icon` + `--xs…2xl` `--boxed` | Em-based icon sizing. |
| Surface recipes | `.sf-surface--{primary,success,…,inverse}` (11) | Paired fg/bg + auto contrast; the BEM colouring shortcut. |
| Truncate / line-clamp | `.sf-truncate` `.sf-line-clamp-{2,3,N}` | Common text control. |
| Link variants | `.sf-link--subtle` `.sf-link--reverse` `.sf-link-external` | Frequent needs. |
| State markers (high-use) | `.is-active` `.is-disabled` `.is-loading` `.is-open` `.is-selected` `.is-invalid/valid` `.is-current` | The `.is-*` contract; maps to ARIA. |
| A11y patterns | `.sf-focus-parent` `.sf-clickable-parent` `.sr-only-focusable` | Real-world a11y recipes. |
| Aspect / frame | `.sf-aspect` `.sf-frame` + ratio variants | Media containers. |

---

## 3. NICE TO HAVE — useful but niche / easily hand-rolled

### Tokens
- **Multi-column tokens** (`--sf-col-*`, 15) — real but used by few sites.
- **Per-text-size sub-properties** (sizes-extended, 36: per-size line-height / weight / letter-spacing / max-width) — nice precision; most projects touch a handful.
- **Mask scrim, scroll-driven range, shadow glow, LumLocker** (~6, PUBLIC-ADVANCED) — advanced effects.
- **Text shadows** (7) — decorative.

### Classes
- **Bento grid** (`.sf-bento` + 4 variants) — trendy but specialised.
- **Reel, Imposter, Pancake, Box, Center--intrinsic, Subgrid** — Every-Layout long-tail; valuable to those who know them, ignorable otherwise.
- **Divider variants** (`.sf-divider--{dashed,dotted,gradient,soft,strong,vertical}`, 7) — decorative.
- **Motion entrance/keyframe classes** (15: `.sf-entrance--*`, `.sf-fade-in`, `.sf-slide-in-*`, `.sf-color-pulse`) — nice, but most teams script entrances or use tokens directly.
- **Scrim / scroll-shadow / overflow-fade / scroll-snap / text-gradient / text-protect / tabular-nums / content-auto** (macros) — each solves one small problem well.
- **Print helpers** (`.no-print` `.print-only` `.print-color-exact` `.print-no-color`) — useful, low traffic.
- **Niche states** `.is-pinned` `.is-fullscreen` `.is-resizable` `.is-readonly` `.is-unselectable` `.is-overlay` `.is-drop-target` — long-tail of the `.is-*` set.
- **`.theme-transition`** — single helper; nice polish.

---

## 4. COULD DO WITHOUT — marginal payoff for the surface area

- **Spacing + text bridge matrices** (sizes-extended: 36 + 36 = **72 tokens**).
  Full descending `{larger}-to-{smaller}` clamp matrices. This is a large,
  hard-to-memorise surface that exists mainly because SLASHED has **no `fluid()`
  generator** (see gap analysis). A handful of bridges would cover 95% of use; the
  full matrix is completeness for its own sake.
- **Redundant typography aliases.** Several alias layers point at the same place
  (`--sf-body-font-size` → `--sf-text-m`, `--sf-gap`/`--sf-space-gap`,
  `--sf-content-gap`/`--sf-space-content`). Documented as intentional canonical
  aliases, but they inflate the surface and create "which one do I override?"
  ambiguity.
- **Over-granular palette alpha steps** (`a5/a10/a30` *and* named `subtle/muted/ghost`
  per family). The named tokens alias the numeric ones — two public names for one
  value, ×6 families.
- **`.sf-equal` / `.sf-equal--{2,3,4,6}`** — overlaps heavily with `.sf-grid-*`
  fixed-column grids.
- **`.is-skeleton` vs `.is-loading`** and **`.is-busy` vs `.is-pending`** — adjacent
  semantics that invite confusion.

---

## 5. NOT USEFUL — as currently shipped

- **Legacy HSL colour-fallback channels** (`--sf-{role}-h/s/l`, **33 tokens**,
  `fallbackOnly`, PUBLIC-ADVANCED). The framework's stated browser floor *already
  requires* `oklch(from …)`, `light-dark()` and `@property`. Below that floor the
  whole colour system collapses to `initial` regardless — so an HSL channel knob
  buys little. They add a parallel colour-override mechanism that contradicts the
  "6-token oklch rebrand" story. Documented as not lowering the colour floor, which
  raises the question of what they are *for* on a modern-only framework.
- **`slashed.full` / `optimal-components` / `optimal-utilities` bundles** — today
  they bundle empty/incomplete layers (see §6/§7), so they ship **no extra working
  CSS** over `optimal`. Offering them as headline bundles is misleading until the
  components land.

---

## 6. BROKEN — declared but emits no working CSS

- **`optional/components.css`** — all 8 reserved components (`.sf-button`,
  `.sf-card`, `.sf-badge`, `.sf-tag`, `.sf-alert`, `.sf-avatar`, `.sf-modal`,
  `.sf-skeleton`) are **commented out → 0 bytes emitted**. The `@layer` slot and
  names are reserved, but nothing renders.
- **`optional/tokens.components.css`** — every component token
  (`--sf-button-*`, `--sf-card-*`…) commented out. Don't reference them; they
  don't resolve.

> Not "broken" in the bug sense — intentionally pre-v1.0 — but from a consumer's
> "does it work?" view, these ship nothing.

---

## 7. NOT USED — inert / empty by design

- **`optional/utilities.css`** — empty stub. SLASHED is BEM-first and ships **no
  utility classes** through v1.0 (explicit roadmap "out of scope"). The `@layer
  slashed.utilities` slot exists but is intentionally vacant.
- **`slashed.overrides` layer** — ships empty by design (consumer escape hatch).
- **Clarification (NOT dead code):** the large block of consumer-API tokens not
  read by the framework itself — `--sf-shadow-*`, `--sf-z-*`, `--sf-gradient-*`,
  `--sf-blur-*`, `--sf-scrollbar-*`, `--sf-optical-sizing` — are **used by
  consumers**, exercised in `docs/demo.html`, and validated by `tests/`. They are
  scored above (mostly "should have"), not here.

---

## Tally (by family judgement)

| Bucket | Token families | Class families |
|---|---|---|
| Must have | colour core, spacing, type scale, weights/families | core primitives, content layout, prose/flow, core a11y |
| Should have | palette ramp, type aliases, layout knobs, macro tokens, shadows/z/gradient, motion, scale multipliers | layout variants, grids, icons, surfaces, truncate, links, high-use states, a11y patterns |
| Nice to have | multi-column, per-size sub-props, advanced effects, text-shadows | bento, reel/imposter/pancake/box/subgrid, dividers, motion classes, scrim/scroll macros, print, niche states |
| Could do without | bridge matrices (72), redundant aliases, alpha granularity | `.sf-equal*`, overlapping states |
| Not useful | legacy HSL channels (33) | — |
| Broken | component tokens | 8 components |
| Not used | — (overrides empty) | utilities (empty) |

**Headline findings**

1. The colour engine + layout primitives + fluid scales are a genuinely strong,
   coherent "must/should" core — the framework's identity is sound.
2. ~110 tokens (72 bridges + 33 legacy HSL + alias/alpha duplication) are the main
   candidates for trimming; they inflate the surface without proportional value.
3. The biggest *credibility* gap is bundles named `full` / `components` that ship
   nothing extra, because components are 0 bytes pre-v1.0.
