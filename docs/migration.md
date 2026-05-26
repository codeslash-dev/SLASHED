
# Migration guide

Mapping concepts from popular CSS frameworks to SLASHED, plus an
intra-project migration section for upgrading SLASHED itself.

## SLASHED 0.2.x → 0.3.0

v0.3.0 introduces a new `slashed.macros` cascade layer and relocates
three class definitions to fit the new taxonomy. The class names and
their declared properties are unchanged — only the cascade layer they
live in changes. Most consumers won't notice.

### What changed

| # | Class / file | Was (0.2.x) | Now (0.3.0) |
|---|---|---|---|
| 1 | `.sf-prose`, `.sf-not-prose` | `slashed.layout` (in `core/layout.css`) | `slashed.macros` (in `core/macros.css`) |
| 2 | `.focus-parent` | `slashed.states` (in `core/states.css`) | `slashed.accessibility` (in `core/accessibility.css`) |
| 3 | new layer | — | `slashed.macros` between `components` and `utilities` |

### Are these breaking changes?

Formally yes — the cascade layer of an existing class changed.
Practically, no — the classes themselves and their declared properties
are byte-identical to v0.2.x. **A site that worked in 0.2.x works in
0.3.0 without any markup changes.**

You only see a difference if your CSS targeted these classes from
**within a specific layer that lost the priority race**:

- A `@layer slashed.layout { .sf-prose { … } }` consumer override no
  longer participates — `.sf-prose` is no longer in `slashed.layout`.
  The fix is to move the override into `slashed.overrides` (the
  documented escape hatch, last in the cascade) — that's been the
  recommended path all along.
- A `@layer slashed.states { .focus-parent { … } }` override stops
  winning over the framework's rule. Same fix: move it to
  `slashed.overrides`.

### What's new in essential

- New file: `core/macros.css` (12 recipes).
- New file: `core/tokens.macros.css` (5 macro tokens).
- New a11y pattern: `.sf-clickable-parent` (the card-with-link pattern).
- New modifier: `.sf-icon--boxed` on the existing `.sf-icon`.
- New tokens: border-style scale (`--sf-border-style`, `-strong`,
  `-soft`, `-dotted`) and the icon-boxed tokens (`--sf-icon-box-pad`,
  `-radius`, `-bg`, `-border`).

See [`docs/macros.md`](macros.md) for the full macro reference.

### Components — incomplete files

`optional/components.css` and `optional/tokens.components.css` are no
longer empty `/* TODO */` files — they now contain structured class
definitions and tokens, but **every line is commented out**. The
`@layer` declarations are real, the cascade slot is in place, and 8
component names are taken; the implementations will land in upcoming
minor releases (additive only). See [`docs/components.md`](components.md).

If you previously wrote your own `.sf-button` / `.sf-card` etc. styles,
you have two options for v0.3.0:

1. Keep them as-is until the activation minor; then choose between
   adopting the framework version or switching to a different name.
2. Rename to a project-prefixed class (`.app-button`) right away to
   guarantee no future collision.

---

## From other frameworks

SLASHED is **token + BEM**, not utility-first and not classless — so
the migration is mostly about *where* styling lives.

### Mental model

| Concern | Classless / element-styled | Utility-first | **SLASHED** |
|---|---|---|---|
| Element defaults | global element styles | reset only | minimal `base` layer (flow/inline text) |
| Components | restyle bare elements | utility classes on markup | your own BEM classes consuming `--sf-*` tokens |
| Theming | CSS vars (some) | config file + build | override 6 source tokens, no build |
| Layout | utility/grid classes | flex/grid utilities | container-query primitives (`.sf-*`) |
| Recipes | bespoke per project | utility chains | macros (`.sf-prose`, `.sf-flow`, …) |
| States | `:disabled` etc. | variant modifiers | `.is-*` state classes |

### From a classless / element-styled framework

These frameworks style bare HTML globally; SLASHED keeps `base` minimal and expects components.

- **Rich element styling** (`table`, `blockquote`, `figure`, `dl`): globally
  styled in classless frameworks. In SLASHED they're styled **inside
  `.sf-prose`** — wrap long-form content in `<div class="sf-prose">`.
- **Forms**: many classless frameworks style inputs globally. SLASHED's are
  opt-in — add `optional/forms.css` (the `optimal` bundle includes it).
- **Containers**: use `.sf-container`.
- **Pre-compiled colour themes**: not needed — override the 6 source tokens.

### From a component / modifier framework

- **Helpers/modifiers** (`.is-primary`, `.is-active`): SLASHED reserves `.is-*`
  exclusively for runtime **states** (`.is-active`, `.is-disabled`, …). Visual
  variants belong in your component CSS using brand tokens
  (`background: var(--sf-color-primary)`).
- **Columns**: use `.sf-grid`, `.sf-grid-N`, or `.sf-switcher`.
- **Section/container**: `.sf-section` / `.sf-container`.

### From a utility-first framework

- **Utility classes on markup**: SLASHED is not utility-first. Compose with the
  layout primitives, the macros (`.sf-flow`, `.sf-truncate`, etc.), and
  write small BEM components that read tokens.
- **Config file / build step**: there's no config or build — override `--sf-*`
  tokens in a stylesheet. See [theming.md](theming.md).
- **Dark variant syntax**: use `data-theme` (auto-derived dark mode) — see
  [dark-mode.md](dark-mode.md).
- **Spacing/colour scales**: available as tokens (`--sf-space-*`,
  `--sf-color-*`) — use them in your own classes instead of inline utilities.
- **`line-clamp-N` / `truncate`**: directly available as `.sf-line-clamp-N`
  and `.sf-truncate` macros.

### Practical steps

1. Drop in a bundle (`slashed.optimal.css` is a good default).
2. Rebrand with the 6 source tokens.
3. Replace layout utilities with layout primitives.
4. Replace recurring patterns with macros (prose, flow, truncate, …).
5. Move element-level overrides into BEM components that consume tokens.
6. Wrap long-form content in `.sf-prose`.
7. Map interactive state toggles to `.is-*` classes (+ matching ARIA).
