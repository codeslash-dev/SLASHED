# Open Issues from PR #7 Review

## 1. Text tokens produce poor contrast in dark mode

**Severity:** Critical  
**Source:** CodeRabbit review on PR #7

### Problem

The `--sf-color-text` formulas derive from `--sf-color-neutral` using static luminance offsets (`calc(l - 0.4)`). When dark mode swaps in `--sf-color-neutral-dark: oklch(0.65 0.02 260)`, text resolves to `oklch(0.25)`. On the dark surface `oklch(0.2)`, this yields a delta of only 0.05 — unreadable.

Similarly, `--sf-color-text--on-primary` is hardcoded to near-white (`oklch(1 0 0)`). In dark mode, primary becomes lighter (e.g. `oklch(0.7)`), making white-on-light poor contrast.

### Solution needed

Make text derivation mode-aware:
- Invert offset direction when neutral/base is dark
- Use different formulas in the `[data-theme="dark"]` block in `base.css`
- Explore `color-contrast()` when browser support improves

### Files
- `core/tokens.css` lines 62-85
- `core/base.css` dark mode swap

---

## 2. `[data-theme="light"]:not(:root)` uses `initial` — loses app customizations

**Severity:** Major  
**Source:** CodeRabbit review on PR #7

### Problem

Setting registered custom properties to `initial` reverts to `@property initial-value` (library defaults), not any light-theme customization the app set on `:root`. A light section nested inside a dark subtree shows library defaults instead of the page's branded light values.

### Solution needed

Consider using immutable light/dark source tokens and mapping a separate active token, rather than mutating the author override slot itself. Or accept this trade-off and document it.

### Files
- `core/base.css` lines 58-70
