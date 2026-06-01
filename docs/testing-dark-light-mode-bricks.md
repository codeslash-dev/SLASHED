# Testing Light/Dark Mode in SLASHED with Bricks

A step-by-step guide to verify that light/dark mode toggles work correctly in Bricks-built pages using the SLASHED framework.

---

## Part 1: Prerequisites & Setup

### 1.1 Verify Installation
Before testing, confirm:

- [ ] WordPress 6.0+ installed
- [ ] Bricks Builder 1.9.2+ active
- [ ] SLASHED for Bricks plugin activated
- [ ] SLASHED CSS bundle loaded (Essential / Optimal / Full)
- [ ] Browser DevTools available (F12)

### 1.2 Check SLASHED CSS is Loaded

Open your Bricks page in the browser and open DevTools (F12).

**In the Console tab**, run:
```javascript
document.querySelector('link[href*="slashed"]')
```

**Expected result:** A `<link>` element, not `null`.

If `null` → SLASHED CSS is not loaded. Check:
- Admin > Plugins: Is SLASHED for Bricks active?
- Admin > SLASHED > Bundle: Is a bundle selected?

### 1.3 Create a Test Element with Dark Mode Awareness

In Bricks Builder:

1. Create or edit a section/block
2. Add a **Text** element with content like: "Current theme: [THEME_INDICATOR]"
3. In the element's **Style** tab, add a **Custom CSS class**: `theme-test-box`
4. In the **CSS** editor, add:

```css
.theme-test-box {
  padding: var(--sf-space-4);
  border-radius: var(--sf-radius-md);
  background: var(--sf-color-base);
  color: var(--sf-color-text);
  border: 2px solid var(--sf-color-primary);
  transition: all 0.3s ease;
}

/* Optional: Add a visual indicator */
.theme-test-box::before {
  content: attr(data-theme-mode);
  display: inline-block;
  margin-right: 8px;
  padding: 2px 6px;
  background: var(--sf-color-primary);
  color: var(--sf-color-on-primary);
  border-radius: 4px;
  font-weight: 600;
  font-size: var(--sf-text-sm);
}
```

---

## Part 2: Setting Up the Toggle

### 2.1 Add a Toggle Button

In Bricks Builder, add a **Button** element above or inside the test element:

- **Label:** "Toggle Dark Mode"
- **ID:** `theme-toggle` (important for the script)
- **Class:** `button` (or style it with SLASHED color tokens)

### 2.2 Add the Theme Toggle Script

In your Bricks page settings or a custom code block:

1. Add an **HTML** element to your page
2. Paste this code:

```html
<script>
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  
  // Function to apply theme and persist
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem('slashed-theme', theme);
    btn.setAttribute('aria-pressed', String(theme === 'dark'));
    btn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    
    // Update test element indicator
    const testBox = document.querySelector('.theme-test-box');
    if (testBox) {
      testBox.setAttribute('data-theme-mode', theme.toUpperCase());
    }
    
    console.log(`✓ Theme applied: ${theme}`);
  };
  
  // Restore saved theme on load
  const savedTheme = localStorage.getItem('slashed-theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Default to OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
  
  // Toggle on button click
  if (btn) {
    btn.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      
      // Use view transition if supported (smooth animation)
      if (document.startViewTransition) {
        document.startViewTransition(() => applyTheme(next));
      } else {
        applyTheme(next);
      }
    });
  }
</script>
```

---

## Part 3: Testing Light Mode

### 3.1 Verify Light Mode Colors

1. **Ensure light mode is active:**
   - Reload the page
   - Click the toggle button if needed to enter light mode
   - The button should show "🌙 Dark Mode"

2. **In DevTools Console, verify the state:**

```javascript
// Should return "light"
document.documentElement.dataset.theme

// Should return "light" (Bricks bridge)
document.documentElement.dataset.brxTheme

// Should be a light OKLCH color like "oklch(0.98 0.001 280)"
getComputedStyle(document.documentElement).getPropertyValue('--sf-color-base')

// Should return "light"
getComputedStyle(document.documentElement).getPropertyValue('color-scheme').trim()
```

### 3.2 Visual Inspection (Light Mode)

Check these elements:

- [ ] Background is light (white/light gray)
- [ ] Text is dark (high contrast)
- [ ] Primary color buttons/links are saturated and bright
- [ ] Hover states are visible
- [ ] No illegible white text on light background
- [ ] Form inputs are visible (borders/backgrounds)

### 3.3 Test Styling Cascades Correctly

In DevTools Inspector:

1. Select the test box element (`.theme-test-box`)
2. In the **Styles** panel, find these rules and verify the computed values:
   - `background: var(--sf-color-base)` → should be light color
   - `color: var(--sf-color-text)` → should be dark color
   - `border-color: var(--sf-color-primary)` → should be vibrant

---

## Part 4: Testing Dark Mode

### 4.1 Activate Dark Mode

1. Click the "Toggle Dark Mode" button
2. The button should change to "☀️ Light Mode"
3. The page should transition smoothly (if supported)

### 4.2 Verify Dark Mode State in Console

```javascript
// Should return "dark"
document.documentElement.dataset.theme

// Should return "dark" (Bricks bridge)
document.documentElement.dataset.brxTheme

// Should be a dark OKLCH color like "oklch(0.18 0.01 280)"
getComputedStyle(document.documentElement).getPropertyValue('--sf-color-base')

// Should return "dark"
getComputedStyle(document.documentElement).getPropertyValue('color-scheme').trim()
```

### 4.3 Visual Inspection (Dark Mode)

Check these elements:

- [ ] Background is dark (charcoal/dark gray)
- [ ] Text is light (white/light gray, high contrast)
- [ ] Primary color is automatically darkened (derived from `-light` tokens)
- [ ] No bright white elements that hurt eyes
- [ ] Form inputs are visible with dark backgrounds
- [ ] Hover states still work
- [ ] All text remains readable

### 4.4 Verify Token Derivation

The SLASHED framework derives dark colors automatically from `-light` tokens:

```javascript
// In light mode:
getComputedStyle(document.documentElement).getPropertyValue('--sf-color-primary')
// Returns something like: oklch(0.65 0.15 270)

// Switch to dark mode
document.documentElement.dataset.theme = 'dark'

// Now check the same variable:
getComputedStyle(document.documentElement).getPropertyValue('--sf-color-primary')
// Returns something like: oklch(0.70 0.08 270) (lighter, less saturated)
```

---

## Part 5: Testing Persistence

### 5.1 Test localStorage Persistence

1. **Start in light mode** → Click toggle to dark mode
2. **Refresh the page** (F5)
3. **Expected:** Page loads in dark mode (no flash to light)

4. **Toggle back to light mode**
5. **Close the browser tab** (or open in incognito after)
6. **Reopen the page**
7. **Expected:** Page loads in light mode

### 5.2 Check localStorage Value

In Console:
```javascript
// Should show the current theme
localStorage.getItem('slashed-theme')
// Returns: "dark" or "light"
```

### 5.3 Test Clearing Persistence

```javascript
localStorage.removeItem('slashed-theme')
// Then refresh page - should follow OS preference
```

---

## Part 6: Testing Nested Dark/Light Regions

### 6.1 Create a Dark Region in Light Page

In Bricks, add a **Section** element:

```html
<section data-theme="dark" style="padding: var(--sf-space-6);">
  <h3>This section is always dark</h3>
  <p>Even if the page is light mode</p>
</section>
```

**Test:**
1. Keep page in light mode
2. This section should have dark background/light text
3. Click toggle → page goes dark
4. This section should stay dark (no double-darkening)

### 6.2 Create a Light Card in Dark Page

In Bricks, add a **Card/Box** element:

```html
<article data-theme="light" style="padding: var(--sf-space-4);">
  <h4>Light card in dark page</h4>
  <p>Should always appear light</p>
</article>
```

**Test:**
1. Start in light mode
2. This card should look normal (light)
3. Toggle to dark mode
4. This card should switch to light while page is dark
5. Content inside should be readable (dark text on light bg)

---

## Part 7: Accessibility Testing

### 7.1 Test High Contrast Mode

**Windows:**
1. Enable High Contrast mode (Settings > Ease of Access > High Contrast)
2. Visit your page
3. Theme toggle should still work
4. Colors should adapt

**macOS:**
1. Enable Increase Contrast (System Settings > Accessibility > Display)
2. Test the theme toggle

### 7.2 Test for Readability

Use the **WCAG Contrast Checker** in DevTools:

1. Open Inspector → Select an element with text
2. Go to the **Accessibility** panel
3. Check **Contrast ratio** → should be ≥ 4.5:1 (normal), ≥ 3:1 (large text)
4. Repeat for light and dark modes

### 7.3 Test prefers-reduced-motion

The toggle uses `document.startViewTransition()` which respects `prefers-reduced-motion`:

```javascript
// Check if user prefers reduced motion
window.matchMedia('(prefers-reduced-motion: reduce)').matches

// If true, transition is disabled automatically
```

**Test:**
1. Enable prefers-reduced-motion (usually in OS accessibility settings or DevTools simulation)
2. Click the toggle
3. Theme should change instantly (no smooth transition)

---

## Part 8: Debugging Issues

### Issue: Theme doesn't toggle

**Check:**
```javascript
// Button exists?
document.getElementById('theme-toggle')

// Script loaded (check Network tab for JS file)
// Check browser Console for errors (red warnings)
```

**Fix:**
- Verify button ID is exactly `theme-toggle`
- Check no JavaScript errors in Console
- Ensure script runs after button is loaded (defer/async, or at end of body)

### Issue: Dark mode colors look wrong

**Check:**
```javascript
// Are we actually in dark mode?
document.documentElement.dataset.theme === 'dark'

// Is color-scheme set?
getComputedStyle(document.documentElement).getPropertyValue('color-scheme')

// Is SLASHED CSS loaded?
document.querySelector('link[href*="slashed"]')
```

**Fix:**
- Confirm SLASHED CSS is loaded (see 1.2)
- Check bundle is Optimal or Full (Essential may have limited colors)
- Verify custom colors use `var(--sf-*)`, not hex values

### Issue: Theme doesn't persist across refresh

**Check:**
```javascript
// Is localStorage working?
localStorage.setItem('test', 'works')
localStorage.getItem('test')

// Is the theme being saved?
localStorage.getItem('slashed-theme')
```

**Fix:**
- Check browser allows localStorage (not in incognito on some browsers)
- Verify script saves theme after toggle
- Check no `localStorage.clear()` runs after theme is set

### Issue: Form inputs don't adapt to dark mode

**Check:**
```javascript
// Do inputs have correct color-scheme?
getComputedStyle(document.querySelector('input')).getPropertyValue('color-scheme')
```

**Fix:**
- Ensure `color-scheme` is set on `:root` (SLASHED does this via `data-theme`)
- Check no hardcoded colors on inputs (should use CSS variables)
- Verify bundle includes form styling (use Optimal or Full)

---

## Part 9: Bricks Integration Specifics

### 9.1 Bridging data-brx-theme to data-theme

The SLASHED Bricks plugin automatically bridges `data-brx-theme` (Bricks' native theme attribute) to `data-theme` (SLASHED' theme attribute).

**Verify the bridge is active:**

```javascript
// Check if CSS rule for bridging exists
const styleSheet = [...document.styleSheets].find(s => 
  s.cssText?.includes('[data-brx-theme="dark"]')
)
// Should return a stylesheet, not undefined

// Or check computed style:
getComputedStyle(document.documentElement).getPropertyValue('--sf-is-dark')
// In dark mode: should return " 1" (with space, or "1")
// In light mode: should return "" (empty) or " 0"
```

### 9.2 Using Bricks' Native Theme Toggle

If Bricks has a native theme toggle (in newer versions):

1. Go to **Bricks > Settings > Theme**
2. Look for a toggle/switcher component
3. Test that it sets `data-brx-theme` correctly
4. Verify SLASHED bridge picks it up

### 9.3 Global Variables in Dark Mode

When using SLASHED variables in Bricks:

1. **In Bricks Global Variables panel:**
   - Search for `slashed-color-primary`
   - Value shown: `var(--sf-color-primary)`

2. **Toggle dark mode** (using your button)

3. **Inspect element using that variable:**
   - DevTools Inspector → Computed Styles
   - Should show the darkened color value (OKLCH), not the variable name

---

## Part 10: Checklist for Complete Testing

### Visual Testing
- [ ] Light mode background is bright
- [ ] Dark mode background is dark
- [ ] Text contrast is good in both modes
- [ ] Colors derived from primary/secondary/tertiary tokens
- [ ] Nested `data-theme` regions work correctly
- [ ] No layout shifts when toggling
- [ ] Smooth transition (if supported)

### Functional Testing
- [ ] Button click toggles the theme
- [ ] Theme persists across page refresh
- [ ] Theme respects OS preference on first load
- [ ] localStorage stores correct value
- [ ] No console errors

### Bricks Integration
- [ ] SLASHED CSS loads in editor
- [ ] SLASHED CSS loads on frontend
- [ ] Color pickers show SLASHED colors
- [ ] Classes starting with `sf-` autocomplete
- [ ] Variables like `--sf-color-*` available in code editor

### Accessibility
- [ ] Contrast ratio ≥ 4.5:1 in both modes
- [ ] Works in high-contrast mode
- [ ] Respects prefers-reduced-motion
- [ ] Works with keyboard navigation (Tab → Enter)
- [ ] `aria-pressed` attribute updates on toggle

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

---

## Quick Command Reference

### Console Snippets

**Check all theme state at once:**
```javascript
console.log({
  htmlDataTheme: document.documentElement.dataset.theme,
  htmlDataBrxTheme: document.documentElement.dataset.brxTheme,
  colorScheme: getComputedStyle(document.documentElement).colorScheme,
  savedTheme: localStorage.getItem('slashed-theme'),
  baseColor: getComputedStyle(document.documentElement).getPropertyValue('--sf-color-base'),
  slashedCssLoaded: !!document.querySelector('link[href*="slashed"]'),
});
```

**Force dark mode (for testing):**
```javascript
document.documentElement.dataset.theme = 'dark';
```

**Force light mode:**
```javascript
document.documentElement.dataset.theme = 'light';
```

**Clear theme preference (revert to OS default):**
```javascript
localStorage.removeItem('slashed-theme');
location.reload();
```

---

## Related Documentation

- [Dark Mode Cookbook](./dark-mode.md)
- [Bricks Template Workflow](./bricks-template-workflow.md)
- [SLASHED for Bricks README](../plugins/SLASHED-for-WP/integrations/bricks/README.md)
- [SLASHED Theming Guide](./theming.md)
