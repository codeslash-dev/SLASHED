# Migration guide

Mapping concepts from popular CSS frameworks to SLASHED. SLASHED is **token +
BEM**, not utility-first and not classless — so the migration is mostly about
*where* styling lives.

## Mental model

| Concern | Pico / classless | Tailwind / utility-first | **SLASHED** |
|---|---|---|---|
| Element defaults | global element styles | reset only | minimal `base` layer (flow/inline text) |
| Components | restyle bare elements | utility classes on markup | your own BEM classes consuming `--sf-*` tokens |
| Theming | CSS vars (some) | config file + build | override 6 source tokens, no build |
| Layout | utility/grid classes | flex/grid utilities | container-query primitives (`.sf-*`) |
| States | `:disabled` etc. | `disabled:` variants | `.is-*` state classes |

## From Pico CSS

Pico styles bare HTML; SLASHED keeps `base` minimal and expects components.

- **Rich element styling** (`table`, `blockquote`, `figure`, `dl`): in Pico
  these are global. In SLASHED they're styled **inside `.sf-prose`** — wrap
  long-form content in `<div class="sf-prose">`.
- **Forms**: Pico styles inputs globally. SLASHED's are opt-in — add
  `optional/forms.css` (the `optimal` bundle includes it).
- **Containers**: Pico's `.container` → SLASHED `.sf-container`.
- **Pre-compiled colour themes**: not needed — override the 6 source tokens.

## From Bulma

- **Helpers/modifiers** (`.is-primary`, `.is-active`): SLASHED reserves `.is-*`
  exclusively for runtime **states** (`.is-active`, `.is-disabled`, …). Visual
  variants belong in your component CSS using brand tokens
  (`background: var(--sf-color-primary)`).
- **Columns** (`.columns`/`.column`): use `.sf-grid`, `.sf-grid-N`, or
  `.sf-switcher`.
- **`.section`/`.container`**: `.sf-section` / `.sf-container`.

## From Tailwind

- **Utility classes on markup**: SLASHED is not utility-first. Compose with the
  layout primitives and write small BEM components that read tokens. (A future
  optional `utilities` layer is stubbed but intentionally empty for now.)
- **`theme.extend` / config**: there's no config or build — override `--sf-*`
  tokens in a stylesheet. See [theming.md](theming.md).
- **`dark:` variant**: use `data-theme` (auto-derived dark mode) — see
  [dark-mode.md](dark-mode.md).
- **Spacing/colour scales**: available as tokens (`--sf-space-*`,
  `--sf-color-*`) — use them in your own classes instead of inline utilities.

## Practical steps

1. Drop in a bundle (`slashed.optimal.css` is a good default).
2. Rebrand with the 6 source tokens.
3. Replace layout utilities with layout primitives.
4. Move element-level overrides into BEM components that consume tokens.
5. Wrap long-form content in `.sf-prose`.
6. Map interactive state toggles to `.is-*` classes (+ matching ARIA).
