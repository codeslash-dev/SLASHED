# Components

> **Status (v0.3.0):** `optional/components.css` and
> `optional/tokens.components.css` are not yet complete. Everything in
> them is commented out and ships 0 bytes in `*.min.css` bundles. The
> `@layer slashed.components` slot is real and ordered.

Eight component names are taken by convention so they can't be claimed
by another framework or your own BEM classes. They will land
incrementally in upcoming minor releases as additive features — none of
the names listed below will be renamed.

---

## Taken component names

| # | Class | Modifiers | Slots / children |
|---|---|---|---|
| 1 | `.sf-button` | `--primary`, `--secondary`, `--ghost`, `--destructive`, `--s`, `--m`, `--l` | — |
| 2 | `.sf-card` | `--bordered`, `--elevated`, `--interactive` | `__header`, `__body`, `__footer` |
| 3 | `.sf-badge` | `--success`, `--warning`, `--error`, `--info`, `--neutral` | — |
| 4 | `.sf-tag` | `--clickable`, `--removable`, `--s`, `--m` | — |
| 5 | `.sf-alert` | `--success`, `--warning`, `--error`, `--info`, `--dismissible` | `__icon`, `__close` |
| 6 | `.sf-avatar` | `--xs`, `--s`, `--m`, `--l`, `--xl`, `--square` | — |
| 7 | `.sf-modal` | `--s`, `--m`, `--l`, `--full` | `__header`, `__body`, `__footer`, `__close` |
| 8 | `.sf-skeleton` | `--text`, `--avatar`, `--card`, `--line` | — |

You can already write your own BEM components against the same selector
pattern (e.g. `.my-button`) and switch to `.sf-button` when it ships —
no naming collisions are introduced today.

## Component tokens

`optional/tokens.components.css` declares token names per component (all
currently commented out). Sample:

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

A consumer authoring their own `.my-button` today should NOT use the
`--sf-button-*` token names yet — they don't resolve to anything until
the matching class ships. Use the global tokens (`--sf-space-*`,
`--sf-radius-*`, `--sf-color-*`) until then.

## Out of scope for 0.x

The following are **not taken** and won't ship in the 0.x line, either
because they need JS, because a macro / recipe already covers the use
case, or because the API needs more real-world usage data before being
locked.

- `.sf-tabs` (needs JS for keyboard nav)
- `.sf-accordion` (needs JS or polyfilled `<details>` interactions)
- `.sf-tooltip` (popover API + anchor positioning still in flux across browsers)
- `.sf-popover` (same)
- `.sf-pagination` (needs concrete UX research)
- `.sf-breadcrumb` (so simple it doesn't justify a class API)
- `.sf-progress` (native `<progress>` already styled in `slashed.base`)
- `.sf-spinner` (`.is-loading` state covers it)
- `.sf-table` (style your own; `.sf-prose` styles long-form tables)
- `.sf-form-field` (forms are classless via `optional/forms.css`)
- `.sf-nav` (so site-specific that a class API constrains more than it helps)

If your project needs one of the above, write it as your own BEM class
that reads SLASHED tokens — this is the fully supported path.

## Roadmap

Order is not finalised. The likely first batch is `.sf-card` +
`.sf-button` because they're the most universally useful and the tokens
for both are stable. Each minor that ships a component will:

- Uncomment its block in `optional/components.css` and the matching
  token block in `optional/tokens.components.css`.
- Document the active class in this file with full HTML examples.
- Add behavioural tests under `tests/`.
- Bump `MINOR` only — no breaking changes.
