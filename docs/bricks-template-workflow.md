# Bricks Template Workflow

A repeatable, step-by-step process for creating and moving Bricks templates that always look identical on every site with the SLASHED plugin installed.

---

## Why templates break

Bricks stores color values in the template JSON in one of three ways:

| Method | How it gets into the template | Portability |
|--------|-------------------------------|-------------|
| `var(--sf-color-primary)` | Selected from a SLASHED palette in the color picker | ✅ Portable — works on any site with SLASHED |
| `#4a90e2` | Typed manually or chosen from the color wheel | ❌ Hardcoded — ignores brand tokens |
| `bricks-color-abc123` | Selected from Bricks "Global Colors" | ❌ Site-specific ID — results in transparency on other sites |

The same issue applies to:
- **Spacing** — `padding: 24px` instead of `var(--sf-space-m)` doesn't scale
- **Typography** — `font-family: "Inter"` instead of `var(--sf-font-body)` doesn't react to tokens
- **SLASHED Tokens** — values from the admin panel (`slashed_bricks_tokens`) don't travel with the Bricks JSON file

---

## Prerequisites

On **both** sites (source and destination):

- Bricks Builder ≥ 1.9.2
- SLASHED WordPress plugin active
- CSS bundle (Essential / Optimal / Full) — the same or higher on the destination site
- Fonts loaded via WordPress or Bricks (Google Fonts, custom fonts)

---

## Phase 1 — Template Design (Source Site)

### Rule #1: Colors exclusively from SLASHED palettes

In the Bricks color picker, expand the palette groups. Use **exclusively** these groups:
- `SLASHED · Primary`
- `SLASHED · Secondary`
- `SLASHED · Tertiary`
- `SLASHED · Action`
- `SLASHED · Neutral`
- `SLASHED · Base`
- `SLASHED · Status`
- `SLASHED · Semantic`

**Never** use:
- The color wheel (inserts a hex code `#rrggbb`)
- Bricks "Global Colors" section (saves an internal site ID)
- The color text field with a manually entered value

> **How to check:** Inspect the element in DevTools. The color should look like
> `color: var(--sf-color-primary)`, not `color: #4a90e2`.

### Rule #2: CSS variables in "Custom CSS" fields

In the Bricks element's CSS tab, use tokens for all custom CSS:

```css
/* ✅ Good */
.my-element {
  background: var(--sf-color-primary);
  padding: var(--sf-space-m) var(--sf-space-l);
  font-size: var(--sf-text-m);
  font-family: var(--sf-font-body);
  border-radius: var(--sf-radius-m);
  box-shadow: var(--sf-shadow-m);
  transition: all var(--sf-duration-normal) var(--sf-ease-out);
}

/* ❌ Bad */
.my-element {
  background: #4a90e2;
  padding: 16px 24px;
  font-size: 16px;
  font-family: "Inter", sans-serif;
}
```

### Rule #3: sf-* classes for layout

Use SLASHED classes for element layouts instead of manual Flexbox/Grid values:

| Instead of... | Use class |
|---------------|-----------|
| `display: flex; gap: 16px; flex-wrap: wrap` | `sf-cluster` |
| `display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px` | `sf-grid` |
| `max-width: 1200px; margin: 0 auto` | `sf-center` |
| `display: flex; flex-direction: column; gap: 16px` | `sf-stack` |

Classes are available in the Bricks class manager (category "SLASHED Layout").

### Rule #4: Do not use Bricks Global Colors

Bricks has its own "Global Colors" (a color with a custom name like "Accent Blue").
These colors have internal IDs specific to the WordPress installation.
**After importing the template to another site, these IDs don't exist → the color disappears.**

Instead of Bricks Global Colors → use SLASHED Color Palette.

---

## Phase 2 — Export (Source Site)

### Step 1: Export SLASHED tokens

1. Open **WordPress Admin → SLASHED → Design Tokens**
2. Go to the **Export / Import** tab
3. Click **Download token file**
4. Save the `slashed-tokens-YYYY-MM-DD.json` file

This file contains all your overrides for colors, typography, spacing, etc.

### Step 2: Export Bricks template

1. In Bricks, open the page/section you want to export
2. **Bricks → Templates → Export** or save as a template
3. Download the template JSON file

### Step 3: Package both files together

Naming convention:
```text
my-template/
  ├── bricks-template-hero.json    # Bricks template
  ├── slashed-tokens-2026-06-01.json  # SLASHED tokens
  └── README.txt                   # optional: font description, bundle info, etc.
```

---

## Phase 3 — Import (Destination Site)

### Step 1: Check prerequisites

- [ ] SLASHED WordPress plugin installed and active
- [ ] CSS Bundle: same or higher (Essential ≤ Optimal ≤ Full)
- [ ] Bricks ≥ 1.9.2
- [ ] Fonts configured (Google Fonts, Adobe Fonts, self-hosted)

### Step 2: Import SLASHED tokens

1. **Admin → SLASHED → Design Tokens → Export / Import**
2. Click "Choose file" and select `slashed-tokens-*.json`
3. Click **Import token file**
4. Wait for the confirmation "Imported N section(s) successfully"
5. **Refresh the page** — tokens are now active

### Step 3: Import Bricks template

1. **Bricks → Templates → Import**
2. Select the `bricks-template-*.json` file
3. Import

### Step 4: Verify in Bricks editor

Open the page in the Bricks editor. The canvas should render the template with correct colors.

---

## Phase 4 — Verification

### Visual Checklist

- [ ] Colors match the tokens (Primary, Secondary, etc.)
- [ ] Dark mode toggles correctly (`data-theme="dark"`)
- [ ] Spacing/gaps look proportional
- [ ] Fonts load correctly (not fallback serif/sans-serif)
- [ ] Radius, shadows, and animations work

### Technical Verification (DevTools)

Open the Inspector and check:

```js
// In the browser console, on the page with the template:
getComputedStyle(document.documentElement).getPropertyValue('--sf-color-primary')
// Should return an OKLCH color, not an empty string
```

If the value is empty → SLASHED CSS is not loaded (see Debugging).

---

## Debugging

### Problem: Colors are wrong / don't change

**Cause:** Elements have hardcoded hex values instead of `var()`.

**Diagnosis:** In DevTools → Inspector → Computed Styles, look for values that
look like `#rrggbb` or `rgb(...)` instead of `var(--sf-color-*)`.

**Solution:** Redesign the element by selecting a color from the SLASHED palette,
not the color wheel.

---

### Problem: Everything is colorless / grey

**Cause:** SLASHED CSS bundle is not loaded on the page.

**Diagnosis:**
```js
// In the console:
document.querySelector('link[href*="slashed"]')
// Should return a <link> element. null = bundle not loaded.
```

**Solution:**
1. Check if the SLASHED plugin is active
2. Admin → SLASHED → Settings — check if a bundle is selected
3. Check for conflicts with other plugins blocking CSS

---

### Problem: Tokens are default, not yours

**Cause:** Token file was not imported or import failed.

**Diagnosis:** Admin → SLASHED → Colors — colors should show your overrides.
If everything is default (purple), the file didn't make it to the database.

**Solution:** Repeat token import (Phase 3, Step 2).

---

### Problem: sf-* classes don't work (no styling)

**Cause:** CSS bundle doesn't contain these classes (e.g., Essential used instead of Optimal/Full).

**Diagnosis:**
```js
// Check if CSS rule exists:
[...document.styleSheets].flatMap(s => [...s.cssRules]).find(r => r.selectorText?.includes('sf-cluster'))
// undefined = rule doesn't exist in bundle
```

**Solution:** Admin → SLASHED → Settings → change bundle to Optimal or Full.

---

### Problem: Dark mode doesn't work

**Cause:** Bricks uses `data-brx-theme` instead of `data-theme` (SLASHED).
The plugin automatically bridges these two attributes, but only when CSS is loaded.

**Verification:** Check if the loaded CSS has the rule:
```css
[data-theme="dark"] { color-scheme: dark; --sf-is-dark: 1 }
```

If not → check plugin version (requires ≥ current).

---

## Quick Cheatsheet

```text
Before designing:
  ✅ Color → from SLASHED palette group
  ✅ Custom CSS → var(--sf-*)
  ✅ Layout → sf-* class
  ❌ Color → hex from color wheel
  ❌ Custom CSS → px / hex literal
  ❌ Layout → Bricks Global Colors

Export (from this site):
  1. Admin → SLASHED → Design Tokens → Export / Import → Download token file
  2. Bricks → Export template

Import (to new site):
  1. Admin → SLASHED → Design Tokens → Export / Import → Import token file
  2. Bricks → Import template
  3. Refresh page
  4. Verify in editor
```
