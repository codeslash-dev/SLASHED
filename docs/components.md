# Components

> **Status (pre-v1.0):** `optional/components.css` and
> `optional/tokens.components.css` are incomplete — everything is commented out
> and ships 0 bytes. The `@layer slashed.components` slot is real and ordered.

Eight component names are reserved by convention. They will land incrementally in
upcoming minor releases as additive features; none will be renamed. You can write
your own BEM components against the same selector pattern (e.g. `.my-button`) today
and switch to `.sf-button` when it ships.

## Taken component names

| # | Class | Modifiers | Slots / children |
|---|---|---|---|
| 1 | `.sf-button` | `--primary`, `--secondary`, `--ghost`, `--danger`, `--s`, `--m`, `--l` | — |
| 2 | `.sf-card` | `--bordered`, `--elevated`, `--interactive` | `__header`, `__body`, `__footer` |
| 3 | `.sf-badge` | `--success`, `--warning`, `--error`, `--info`, `--neutral` | — |
| 4 | `.sf-tag` | `--clickable`, `--removable`, `--s`, `--m` | — |
| 5 | `.sf-alert` | `--success`, `--warning`, `--error`, `--info`, `--dismissible` | `__icon`, `__close` |
| 6 | `.sf-avatar` | `--xs`, `--s`, `--m`, `--l`, `--xl`, `--square` | — |
| 7 | `.sf-modal` | `--s`, `--m`, `--l`, `--full` | `__header`, `__body`, `__footer`, `__close` |
| 8 | `.sf-skeleton` | `--text`, `--avatar`, `--card`, `--line` | — |

## Component tokens

`optional/tokens.components.css` declares token names per component (currently
commented out). Sample:

```css
/* card */
--sf-card-padding;        --sf-card-gap;
--sf-card-radius;         --sf-card-radius-outer;
--sf-card-bg;             --sf-card-border-width;
--sf-card-border-color;   --sf-card-shadow;

/* button */
--sf-button-pad-x;        --sf-button-pad-y;
--sf-button-gap;          --sf-button-radius;
--sf-button-font-weight;  --sf-button-min-height;
--sf-button-border-width;
```

Don't use `--sf-button-*` token names for your own `.my-button` yet — they don't
resolve until the matching class ships. Use the global tokens (`--sf-space-*`,
`--sf-radius-*`, `--sf-color-*`) until then.

## Out of scope for 0.x

Not reserved and won't ship in 0.x (need JS, already covered by a macro/recipe, or
the API needs more usage data). Write these as your own BEM class reading SLASHED
tokens:

- `.sf-tabs`, `.sf-accordion` — need JS for keyboard nav / disclosure
- `.sf-tooltip`, `.sf-popover` — popover API + anchor positioning still in flux
- `.sf-pagination` — needs UX research
- `.sf-breadcrumb` — too simple to justify a class API
- `.sf-progress` — native `<progress>` already styled in `slashed.base`
- `.sf-spinner` — `.is-loading` covers it
- `.sf-table` — `.sf-prose` styles long-form tables
- `.sf-form-field` — forms are classless via `optional/forms.css`
- `.sf-nav` — too site-specific

## Roadmap

Order not finalised; likely first batch is `.sf-card` + `.sf-button` (stable
tokens). Each minor that ships a component will uncomment its block in
`optional/components.css` + the matching token block, document it here with HTML
examples, add tests under `tests/`, and bump `MINOR` only (no breaking changes).
