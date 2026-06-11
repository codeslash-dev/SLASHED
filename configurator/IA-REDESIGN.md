# Configurator IA redesign — Basic / Advanced / Power tiers

Status: **proposal** (not yet implemented).
Companion docs: [`ROADMAP.md`](ROADMAP.md), [`../docs/architecture.md`](../docs/architecture.md).

Inspiration: the panel DX of Automatic.css 4.0 — a flat home list of clearly
named categories, sub-pages with a breadcrumb, inline plain-language copy
explaining *what each feature does and whether you should touch it*, and the
dangerous stuff folded away. We copy the **DX**, not the mechanism: ACSS
regenerates a stylesheet via PHP on save; SLASHED is buildless, so every edit
is live `--sf-*` overrides with instant preview and a copy-paste export. That
is our structural advantage and the redesign should make it *feel* like one.

---

## 1. Problem statement

The current configurator is complete (all 841 tokens reachable) but chaotic
as a first-run experience:

- **Quick Knobs open every Basic panel.** `--sf-space-scale` drives 45 tokens,
  `--sf-shadow-strength` 14, `--sf-contrast-threshold` 11. These are atomic
  power tools, not "first thing a new user should drag". They currently sit
  *above* the essentials, in Basic mode.
- **Basic mode is a filter, not a curation.** It hides rows but still speaks
  raw token names (`--sf-text-display-scale`), shows engine internals, and
  renders 12 sidebar domains, most of which a typical project never opens
  (Motion, Effects, Misc).
- **No guidance on "change vs leave".** Nothing tells the user that ~11 colors
  + two fluid generators + a handful of layout/border/shadow values are the
  entire per-project surface, and everything else has good defaults.
- **Generators bake output.** The scale generators write `clamp()` results
  per step instead of the four engine scalars, which orphans the live fluid
  engine and makes later tweaks harder.

## 2. Design principles

1. **Basic = the per-project checklist.** Only options that almost every
   project changes from default. Everything else has a good default and is
   *reachable*, not *visible*.
2. **Progressive disclosure in three tiers**, not two:
   - **Basic** — curated, friendly-labelled forms.
   - **Advanced** — the full token catalogue, grouped, raw names visible.
   - **Power** — global multipliers and engine internals: present inside
     Advanced but visually fenced (collapsed, warning chip, "drives N").
3. **Friendly labels in Basic, raw tokens in Advanced.** Basic says "Content
   width", not `--sf-container-default`; a hover/info affordance reveals the
   token name so users graduate naturally.
4. **Defaults are a feature.** Every Basic control shows the framework
   default and a one-click reset; untouched = visibly "using default"
   (the ACSS toggle metaphor mapped onto our override model: toggle-off
   ⇒ clear override, never "disable the token").
5. **Write engine inputs, not baked outputs.** Generators and presets set
   source scalars (`--sf-text-base-min`, ratios…) so the buildless fluid
   engine stays live downstream.
6. **Educate in place.** Two sentences of intro copy per panel (ACSS-style),
   "drives N" everywhere, and the planned dependency-hover ties the preview
   back to tokens.

## 3. The tier model

Add a `surface` field per token: `basic | advanced | power` (orthogonal to
the existing PUBLIC / PUBLIC-ADVANCED / INTERNAL tier, which describes API
stability, not UI prominence).

| Surface | What | Where it renders |
|---|---|---|
| `basic` | ~40 curated controls (below) | Basic mode forms + Advanced list |
| `advanced` | everything else public | Advanced list only |
| `power` | global multipliers, engine scalars, palette-mix %, contrast bias/threshold, per-step sub-properties, bridges, state flags | Advanced, inside a collapsed **Power knobs** group with warning styling |

Mode toggle stays global (`B`/`A` shortcut preserved); search in Basic
reports "N more matches in Advanced" instead of silently hiding them.

## 4. Basic mode — exact contents

Sidebar in Basic shows **six domains + Themes**. Motion, Effects, WCAG,
Misc, Cheatsheet appear only in Advanced (tools stay keyboard-reachable).

### 4.1 Colors
- The **11 main colors**, as today's BrandColorRow (light value, auto-dark
  preview, optional dark override):
  - Brand: `primary`, `secondary`, `tertiary`, `action`, `neutral`, `base`
  - Status: `success`, `warning`, `error`, `info`, `danger`
- A read-only **derived swatch strip** per family (hover/subtle/shade ramp)
  so users see what one color buys them — not editable in Basic.
- *Moved out:* `--sf-contrast-bias`, `--sf-contrast-threshold` → Power;
  `--sf-focus-ring-width`, link/selection/mark colors, palette 50–950,
  gradients → Advanced.

### 4.2 Typography
- Font family: body, heading, mono (3 selects with stack presets + free text).
- **Fluid type generator** as the centrepiece: base size min/max, ratio
  min/max as a *named-scale dropdown* (Minor third 1.2, Major third 1.25,
  Perfect fourth 1.333, Golden 1.618…), live ramp preview. Apply writes the
  four engine scalars — never per-step `clamp()`.
- Body line-height (`--sf-leading-normal`), heading weight.
- *Moved out:* `--sf-text-scale`, `--sf-text-display-scale` → Power; weights
  table, tracking, per-step sub-properties, prose/heading aliases → Advanced.

### 4.3 Spacing
- **Fluid space generator** (same pattern: base min/max + named ratio,
  preview of the 2xs–4xl ramp, writes engine scalars).
- Section padding (`--sf-section-pad`), content gap, gutter.
- *Moved out:* `--sf-space-scale` (drives 45!), `--sf-section-scale` → Power;
  per-step overrides, per-primitive gaps, bridges → Advanced.

### 4.4 Layout
- Content width (`--sf-container-default`), reading width
  (`--sf-container-prose`), narrow / wide containers.
- Header height, touch target.
- *Moved out:* grid mins, primitives' per-token config, ratios, z-index,
  sticky offsets → Advanced.

### 4.5 Borders
- Radius: `s` / `m` / `l` (+ a **style preset** row: Sharp / Subtle /
  Rounded / Pill — each just patches the three radius tokens, fully undoable).
- Border width, divider width, border color (light/dark pair like ACSS).
- *Moved out:* `--sf-radius-scale` → Power; full width/outline/divider
  catalogue, extra radius steps → Advanced.

### 4.6 Shadows
- The four elevation steps `s` / `m` / `l` / `xl` (+ a **style preset** row:
  None / Subtle / Soft / Strong patching the four tokens).
- *Moved out:* `--sf-shadow-strength` (with its dark-mode `calc()`
  encode/decode) → Power; drop/text/glow shadows, shadow colors → Advanced.

### 4.7 Themes (tool, both modes)
Preset gallery stays — it is the friendliest entry point and demonstrates
what overrides can do. "Save current" doubles as the project hand-off story.

## 5. Advanced mode

- All 12 domains, full catalogue, current filters (tier, usage,
  modified-only, internal) unchanged.
- Each domain panel gains a **Power knobs** group at the *bottom* (not top):
  collapsed by default, ⚡ chip, intro line — e.g. *"`--sf-space-scale`
  multiplies all 45 fluid spacing tokens. Prefer the generator above unless
  you want a uniform global squeeze."* — and the existing slider+number UI.
- QuickKnobs component is reused as-is inside that group; it stops rendering
  in Basic entirely.

## 6. Panel anatomy (ACSS-grade DX, every panel)

1. **Header**: icon + name + modified-count badge.
2. **Intro copy**: 1–2 sentences — what this controls, whether typical
   projects change it. Stored in `domains.js`.
3. **Groups as accordions** with plain-language names; first group open.
4. **Per-control**: friendly label, default ghost value, reset, "drives N"
   badge, info popover revealing the raw token name + one-line description
   (from `api-index`).
5. **Footer**: "Reset domain" + link to the relevant `docs/*.md`.

No "Save" button — we keep live-edit + undo/redo + Output drawer. Instead a
persistent **"N tokens customised — Export CSS"** affordance in the header,
so the ACSS Save mental model maps onto our export step.

## 7. Home / first-run

A **Home screen** (Basic mode default landing, like the ACSS root list):
the six Basic domains + Themes as large rows with one-line descriptions and
per-domain customised-count — doubling as a *project setup checklist*
("Colors · 0 customised → start here"). Sidebar remains for switching;
Home is the orientation surface.

## 8. What we deliberately do NOT copy from ACSS

- **Save/build cycle** — buildless live preview is the point.
- **Feature on/off toggles that change shipped CSS** — bundle composition is
  a loading-time decision (`optional/*.css`), documented, not a configurator
  switch. (A future "bundle advisor" note in the Output drawer may *suggest*
  dropping `tokens.palette.css` if untouched — suggestion only.)
- **Plugin/builder integration panels** (Bricks, Gutenberg, Class Manager) —
  out of scope for a framework configurator.
- **Separate Light/Dark scheme pages** — `light-dark()` + auto-derivation
  already collapse this; we keep the light/dark pair-per-row UI.

## 9. Implementation phases

### Phase 1 — tier metadata + knob demotion *(small, immediate win)*
- `lib/domains.js`: add `surface` map (curated lists live configurator-side;
  no framework churn). Default unknown → `advanced`.
- Render QuickKnobs only in Advanced, moved to bottom "Power knobs" group.
- Basic sidebar filtered to 6 domains + Themes.
- Search across modes with "N more in Advanced" affordance.

### Phase 2 — curated Basic forms
- `DomainPanel.svelte`: Basic branch renders curated controls with friendly
  labels + intro copy; Advanced branch unchanged.
- Info popover (raw token name + description) on every Basic control.
- Colors panel: derived swatch strip per family.

### Phase 3 — generators & presets
- `ScaleGenerator.svelte`: write engine scalars instead of per-step
  `clamp()`; named-ratio dropdown; make it the hero of Typography/Spacing
  Basic panels.
- Border & shadow **style preset rows** (token patches via
  `patchOverrides`, single undo step).

### Phase 4 — orientation & education
- Home screen / setup checklist.
- Per-panel intro copy + docs links.
- Dependency-graph hover (already roadmap #1) — closes the loop between
  preview and tokens.

### Phase 5 — sync & docs
- Optionally promote `surface` into `docs/api-index.json` via
  `scripts/gen-api-index.js` once the curation stabilises, so docs and
  configurator share one source of truth.
- Update `configurator/README.md` + ROADMAP; screenshot refresh.

## 10. Open questions

- Should **Motion** earn a Basic slot (single "reduce/disable motion"
  switch)? Leaning no — default + `prefers-reduced-motion` already cover it.
- Status colors: collapse `error`/`danger` presentation in Basic (they are
  distinct tokens) or show both? Proposal: show both, shared group header.
- Does Basic get the Output drawer diff view, or only "Export CSS"?
  Proposal: full drawer in both modes — it is the product.
