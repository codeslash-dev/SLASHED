# Configurator IA — Basic / Advanced / Power tiers

Status: **implemented** (phases 1–5; see git history on this file's branch).
Companion docs: [`ROADMAP.md`](ROADMAP.md), [`../docs/architecture.md`](../docs/architecture.md).

The panel DX follows the conventions that make the best framework
configurators approachable — a flat home list of clearly named categories,
inline plain-language copy explaining *what each option does and whether you
should touch it*, and the dangerous controls folded away — adapted to
SLASHED's buildless model: there is no save/regenerate cycle, every edit is
a live `--sf-*` override with instant preview and a copy-paste CSS export.
That is our structural advantage and the panel is built to make it felt.

---

## 1. Problem statement (pre-restructure)

The configurator was complete (every token reachable — 841 at the time of
writing) but chaotic as a
first-run experience:

- **Quick Knobs opened every Basic panel.** `--sf-space-scale` drives 45
  tokens, `--sf-shadow-strength` 14, `--sf-contrast-threshold` 11. Atomic
  power tools — not "first thing a new user should drag" — sat *above* the
  essentials, in Basic mode.
- **Basic mode was a filter, not a curation.** It hid rows but still spoke
  raw token names, showed engine internals, and rendered 12 sidebar domains,
  most of which a typical project never opens (Motion, Effects, Misc).
- **No guidance on "change vs leave".** Nothing said that ~11 colors + two
  fluid generators + a handful of layout/border/shadow values are the entire
  per-project surface, and everything else has good defaults.
- **Generators baked output.** The scale generators wrote per-step `clamp()`
  results instead of the engine scalars, orphaning the live fluid engine.

## 2. Design principles

1. **Basic = the per-project checklist.** Only options that almost every
   project changes from default. Everything else has a good default and is
   *reachable*, not *visible*.
2. **Progressive disclosure in three tiers**:
   - **Basic** — curated, friendly-labelled forms.
   - **Advanced** — the full token catalogue, grouped, raw names visible.
   - **Power** — global multipliers: rendered inside Advanced but visually
     fenced (collapsed `⚡ Power knobs` group at the *bottom* of the panel,
     amber warning styling, per-domain `powerIntro` copy, "drives N").
3. **Friendly labels in Basic, raw tokens in Advanced.** Basic says "Content
   width", not `--sf-container-default`; the ⓘ popover reveals the token
   name (click-to-copy), description, default and reach, so users graduate
   naturally.
4. **Defaults are a feature.** Every control shows the framework default and
   a one-click reset; style-preset rows always include the framework-default
   look, and presets null what they don't set so they can never mask each
   other.
5. **Write engine inputs, not baked outputs.** Generators set the source
   scalars (`--sf-text-base-min`, ratios, the shared viewport range) so the
   buildless fluid engine stays live downstream — a few numbers in the
   export, never `clamp()` walls.
6. **Educate in place.** Intro copy per panel, "drives N" everywhere, docs
   links in the panel footer, and the Home checklist as orientation.

## 3. The tier model (as shipped)

| Surface | What | Where it renders |
|---|---|---|
| Basic | 11 brand/status colors + ~25 curated controls (`src/lib/basics.js`) + generators + style presets | Basic forms; same tokens also appear in Advanced |
| Advanced | every public token | Advanced grouped catalogue |
| Power | global multipliers (`KNOBS_BY_DOMAIN`) | collapsed group at the bottom of Advanced panels only |

The mode toggle stays global (`B`/`A`); Basic search scopes to the curated
surface and reports "N more matches in Advanced" with a one-click jump that
preserves the query.

## 4. Basic mode contents

Sidebar in Basic: **Home + six domains + Themes**. Motion, Effects, WCAG,
Misc, Cheatsheet appear only in Advanced.

- **Home** — setup-checklist landing: one row per domain with intro copy,
  per-domain customised counts, "start here" pointer and an Export CSS
  shortcut into the output drawer.
- **Colors** — the 11 brand/status pair rows (light value, auto-derived dark
  with optional override): base, neutral, primary, secondary, tertiary,
  action, success, warning, error, info, danger.
- **Typography** — Body/Heading/Code font, body line height, heading weight;
  the fluid **type generator** (+ display tab; display reuses the type
  ratios, so its ratio selects are read-only).
- **Spacing** — the fluid **space generator** plus section padding, content
  rhythm, gutter, component padding.
- **Layout** — content/reading/narrow/wide widths, header height, touch
  target.
- **Borders** — **Corner style** preset row (Sharp / Subtle / Rounded /
  Pill) + radius s/m/l, border width, divider width, border color.
- **Shadows** — **Shadow style** preset row (None / Subtle / Soft / Strong)
  + the four elevation steps.
- **Themes** — preset gallery + saved slots (the friendliest entry point
  into the override model).

## 5. Keeping it in lockstep with the framework

The curation is configurator-side data (`basics.js`, `stylePresets.js`,
`fluidEngine.js`, `KNOBS_BY_DOMAIN`), so the framework needs no changes —
and the test suite is the sync tripwire:

- `tests/basics.test.js` — every curated control exists in the catalogue
  with a non-empty default; labels unique; `domain.essentials` derives from
  `basics.js` so the card and the search surface can't drift.
- `tests/fluid-engine.test.js` — every engine scalar exists and its
  hardcoded default equals the live catalogue value; patches clear baked
  per-step overrides and never touch the shared viewport on reset.
- `tests/style-presets.test.js` — every patch key exists; values survive
  the sanitizer; exactly one all-null default preset per list; uniform key
  sets so presets can't leave leftovers.
- `tests/themes.test.js` — knob default parity, including the
  encode/decode round-trip for `--sf-shadow-strength`.

The upgrade ritual after a framework release: `npm run sync && npm test` —
a vanished token or drifted default fails CI loudly instead of rendering a
dead control.

## 6. Deliberate non-goals

- **A save/build cycle** — buildless live preview is the point; the header
  "N customised — Export CSS" affordance maps the conventional save mental
  model onto our export step.
- **Feature on/off toggles that change shipped CSS** — bundle composition
  is a loading-time decision (`optional/*.css`), documented, not a
  configurator switch.
- **Page-builder / CMS integration panels** — out of scope for a framework
  configurator.
- **Separate light/dark scheme pages** — `light-dark()` + auto-derivation
  collapse this; the pair-per-row UI covers both modes at once.

## 7. Possible follow-ups

- Read-only derived swatch strip per color family (show what one brand color
  buys: hover/tint/shade ramp).
- Promote the curation metadata (`surface`) into `docs/api-index.json` once
  it stabilises, so docs and configurator share one source of truth.
- The roadmap items in [`ROADMAP.md`](ROADMAP.md) (dependency-graph hover,
  preset builder, shareable URLs…).
