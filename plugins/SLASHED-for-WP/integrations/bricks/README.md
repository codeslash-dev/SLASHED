# SLASHED for Bricks

A WordPress plugin that integrates the [SLASHED](https://github.com/codeslash-dev/SLASHED) cascade-layer CSS framework with [Bricks Builder](https://bricksbuilder.io/).

## Features

- **CSS Loading** - Automatically enqueues the SLASHED CSS bundle on the frontend and within the Bricks editor iframe
- **Variable Pickers** - Registers every `--sf-*` CSS custom property declared in the active bundle (~600 in `optimal`, ~700 in `full`) with the Bricks variable pickers and code editor autocomplete, organized into category groups
- **Class Autocomplete** - Registers every `.sf-*` layout/utility class and `.is-*` state class declared in the active bundle with the Bricks class input, organized into "SLASHED Layout" and "SLASHED State" categories
- **Color Palette** - Synchronizes every `--sf-color-*` token (brand scales including alpha steps, status, and semantic colors) with the Bricks global color palette. Disabled automatically on Bricks 2.2+ (the new Color Manager bakes palette colors into `:root` as static hex, which would override the framework's adaptive `light-dark()` tokens and break dark mode) — use the Variable Manager to reach the tokens there
- **Variable-Picker Swatches** - Paints a colour square next to each `--sf-color-*` entry in the Bricks variable-picker dropdown, builder-side only. Because the variables stay empty-valued, Bricks has no value to draw a swatch from; the square is rendered from a server-resolved hex map so dark/light stays 100% framework-driven and nothing is written to `:root`. Purely additive and fail-silent: if Bricks ever changes the picker markup you lose the squares, never the picker. Restores the swatch affordance lost when the Color Palette is disabled on Bricks 2.2+. Toggle with the `slashed_bricks/show_color_swatches` filter
- **Dynamic Detection** - The integration parses the loaded CSS bundle at runtime, so registrations stay in sync with whichever bundle (`essential` / `optimal` / `full`) and SLASHED release is active. There is no hand-curated list to drift out of date.
- **reBEMer** - Subtree-scoped BEM class manager inside the Bricks builder structure panel: add / rename / replace classes for an element and its children in one transaction, with reference-count preflight (REST), snapshot+rollback, reserved-name guard against SLASHED utilities, and Cmd/Ctrl-Z undo. See [docs/rebemer.md](../../docs/rebemer.md) for the full design.

## Requirements

- WordPress 6.0+
- PHP 7.4+
- Bricks Builder 1.9.2+ (Variables require 1.9.8+; Classes require 1.9.5+)
- SLASHED CSS framework (included via the `dist/slashed.optimal.css` bundle)

## Installation

### Option A: Copy to plugins directory

Copy the `integrations/bricks/` folder to your WordPress plugins directory:

```bash
cp -r integrations/bricks /path/to/wp-content/plugins/slashed-bricks
```

The plugin loads CSS from jsDelivr by default, so no local file setup is needed.
Optionally, you can copy the `dist/` folder into the plugin directory for local/offline use:

```bash
cp -r dist /path/to/wp-content/plugins/slashed-bricks/dist
```

### Option B: Symlink (for development)

```bash
ln -s /path/to/SLASHED/integrations/bricks /path/to/wp-content/plugins/slashed-bricks
```

Then activate the plugin in **WordPress Admin > Plugins**.

## Configuration

The plugin works out of the box with sensible defaults. All behavior can be customized via WordPress filter hooks.

### Filter Hooks

#### `slashed_bricks/css_bundle_url`

Override which CSS bundle URL to load.

```php
add_filter( 'slashed_bricks/css_bundle_url', function( $url ) {
    // Load from a CDN instead.
    return 'https://cdn.example.com/slashed/slashed.optimal.css';
} );
```

#### `slashed_bricks/registered_classes`

Filter the array of classes before registration with Bricks.

```php
add_filter( 'slashed_bricks/registered_classes', function( $classes ) {
    // Remove state classes.
    return array_filter( $classes, function( $class ) {
        return $class['category'] !== 'SLASHED State';
    } );
} );
```

#### `slashed_bricks/registered_colors`

Filter the colors array before registration with Bricks.

```php
add_filter( 'slashed_bricks/registered_colors', function( $colors ) {
    // Only keep brand colors, remove semantic.
    return array_filter( $colors, function( $color ) {
        return strpos( $color['category'], 'Semantic' ) === false;
    } );
} );
```

#### `slashed_bricks/inject_color_palette`

Control whether SLASHED palettes are injected into the Bricks color palette (`bricks_color_palette`). Defaults to `true` on Bricks &lt; 2.2 and `false` on Bricks 2.2+ (whose Color Manager would bake the tokens into `:root` as static hex and break dark mode). Force it back on if you want the swatches and accept that those palette colors become static hex snapshots without dark-mode adaptation.

```php
// Force palette injection even on Bricks 2.2+.
add_filter( 'slashed_bricks/inject_color_palette', '__return_true' );
```

#### `slashed_bricks/show_color_swatches`

Control whether colour swatches are painted next to `--sf-color-*` entries in the Bricks variable-picker dropdown (builder-side only — see Variable-Picker Swatches above). Defaults to `true`. Returning `false` also skips localising the hex map, so no extra data is sent to the builder.

```php
// Hide the variable-picker swatches.
add_filter( 'slashed_bricks/show_color_swatches', '__return_false' );
```

#### `slashed_bricks/registered_variables`

Filter the CSS variables array before registration with Bricks.

```php
add_filter( 'slashed_bricks/registered_variables', function( $variables ) {
    // Remove z-index variables.
    unset( $variables['Z-Index'] );
    return $variables;
} );
```

#### `slashed_bricks/inventory`

Replace the resolved inventory wholesale. Useful for tests, custom forks of the framework, or sites that want to ship their own token list. Expects an array shaped `['variables' => string[], 'sf_classes' => string[], 'is_classes' => string[]]`.

```php
add_filter( 'slashed_bricks/inventory', function( $inventory ) {
    $inventory['variables'][] = '--sf-color-my-custom';
    return $inventory;
} );
```

#### `slashed_bricks/inventory_local_path`

Override the local CSS path the inventory parses. The filter is authoritative:

- Return a string to use a specific path (skipping the default candidates).
- Return `false` to skip local resolution entirely (forcing a CDN fetch).
- Return `null` (the default) to use the bundled candidate paths.

```php
// Use a child-theme copy of the bundle.
add_filter( 'slashed_bricks/inventory_local_path', function() {
    return get_stylesheet_directory() . '/assets/slashed.optimal.css';
} );
```

#### `slashed_bricks/color_categories`

Filter which color categories to include in the palette.

```php
add_filter( 'slashed_bricks/color_categories', function( $categories ) {
    // Only include primary and secondary brand palettes.
    return array_intersect_key( $categories, array_flip( [
        'SLASHED Primary',
        'SLASHED Secondary',
    ] ) );
} );
```

## Architecture

```
integrations/bricks/
  slashed-bricks.php            Main plugin bootstrap (guards, constants, loader)
  data/inventory.json           Built-in fallback inventory (used when no
                                local CSS or CDN is reachable)
  includes/class-css-parser.php Pure parser: declared --sf-* properties +
                                .sf-/.is- class selectors from a CSS string
  includes/class-inventory.php  Resolves the active CSS bundle (local file,
                                then CDN with transient cache, then fallback)
                                and categorizes variables by prefix family
  includes/class-enqueue.php    CSS enqueue for frontend + editor iframe
  includes/class-variables.php  Variable registration for builder pickers
  includes/class-classes.php    Class registration for autocomplete
  includes/class-colors.php     Color palette synchronization
  assets/editor.css             Minimal editor panel styling
  README.md                     This file
```

### How It Works

1. **Bootstrap** (`slashed-bricks.php`) - Checks that Bricks is active, defines constants, and loads class files.

2. **Enqueue** (`class-enqueue.php`) - Hooks into `wp_enqueue_scripts` to load the SLASHED CSS bundle. Bricks fires that hook in three contexts: the public frontend, the builder canvas iframe, and the builder admin chrome (the panels around the canvas). The first two should receive the framework CSS; the third must not, otherwise resets/themes/typography would override Bricks' own UI styles. The handler bails early when `bricks_is_builder_main()` returns true (canonical Bricks Academy pattern).

3. **Inventory** (`class-inventory.php`) - The single source of truth for "what does the framework actually ship?" It locates the active CSS bundle (preferring a local file, falling back to the CDN, then to a built-in `data/inventory.json`), parses it once via `class-css-parser.php`, and caches the result via WordPress transients (keyed by file mtime or URL). All three registration classes share one process-local cache so a single page load incurs at most one parse.

4. **Variables** (`class-variables.php`) - Injects framework variables into the Bricks Global Variable Manager (Bricks 1.9.8+) by filtering the `bricks_global_variables` and `bricks_global_variables_categories` options - inject on read, strip on save - so the integration is the single source of truth and the database is never polluted with SLASHED rows. Bricks-registered names use a `slashed-` prefix (`--sf-color-primary` is exposed as `slashed-color-primary` with value `var(--sf-color-primary)`) so Bricks' own generated `:root` CSS chains back to the framework instead of clobbering its theme-aware `--sf-*` definitions. Code editor autocomplete (`bricks/code/get_code_signatures`) surfaces the original `--sf-*` names directly.

5. **Classes** (`class-classes.php`) - Pulls `.sf-*` and `.is-*` class lists from the inventory and injects them into the Bricks Global Class Manager (Bricks 1.9.5+) by filtering the `bricks_global_classes` and `bricks_global_classes_categories` options on the same managed/virtual pattern (inject on read, strip on save). Each entry is shipped with `settings.locked = true` so it lands in the Class Manager's "Locked" filter and can't be accidentally edited. The actual CSS rules still come from the SLASHED bundle.

6. **Colors** (`class-colors.php`) - Pulls every `--sf-color-*` from the inventory, splits them into brand-family palettes (one per brand: Primary, Secondary, Tertiary, Action, Neutral, Base), Status, and Semantic groups, and injects them by filtering the `bricks_color_palette` option on the same managed/virtual pattern. Swatches reference CSS variables (`var(--sf-color-*)`) rather than hardcoded values, so they adapt to theme customization and dark mode.

   **Bricks 2.2+ (Color Manager):** injection is skipped automatically. Bricks 2.2's Color Manager materializes every palette entry into `:root` as a static value (plus a `[data-brx-theme="dark"]` variant), which overrides the framework's adaptive `light-dark()` tokens and freezes dark/light switching. On 2.2+ the tokens are reached through the Variable Manager instead (step 4), which never writes to `:root`. The behavior is gated by `slashed_bricks_supports_color_manager()` and can be overridden with the `slashed_bricks/inject_color_palette` filter (return `true` to force injection, accepting that palette colors become static hex snapshots without dark-mode adaptation).

### Inventory Resolution Order

The inventory class tries these sources in order, stopping at the first one that succeeds:

1. **Local file** at `dist/slashed.optimal.css` (relative to the plugin) - covers symlink/in-repo development and copy-installs that include the `dist/` folder. Cached as a transient keyed by file mtime, so edits invalidate automatically.
2. **CDN URL** - whatever `slashed_bricks_get_css_url()` returns, fetched via `wp_remote_get` and cached as a transient for one day.
3. **Built-in fallback** - `data/inventory.json`, generated at release time from `dist/slashed.optimal.css` by `scripts/gen-bricks-inventory.js`. This keeps the plugin functional on hosts that block outbound HTTP.

You can short-circuit step 1 with the `slashed_bricks/inventory_local_path` filter, or replace the resolved inventory entirely with the `slashed_bricks/inventory` filter.

### Regenerating the Fallback Inventory

The fallback JSON ships with the plugin and must be regenerated whenever the framework adds or removes tokens or classes. The build script does this automatically:

```bash
npm run build              # rebuilds dist/ AND regenerates inventory.json
npm run bricks:inventory   # only regenerate inventory.json
```

## CSS Bundle

By default, the plugin loads `dist/slashed.optimal.css` from the jsDelivr CDN, pinned to an immutable release tag (e.g. `https://cdn.jsdelivr.net/gh/codeslash-dev/SLASHED@v0.5.0-beta5/dist/slashed.optimal.css`). Pinning to a tag (rather than `@main`) ensures the served CSS cannot change outside a plugin release, which is important for reproducibility and supply-chain safety - jsDelivr treats commit/tag refs as effectively immutable, whereas branch refs follow the moving branch tip with a short cache window. The pinned ref lives in the `SLASHED_BRICKS_CSS_REF` constant in `slashed-bricks.php` and is bumped with each plugin release.

This means the plugin works out of the box without copying any CSS files locally.

If a local copy of the bundle is detected (symlink/in-repo mode or a `dist/` folder inside the plugin directory), the local file takes precedence for faster loads and offline development.

To load a different bundle (e.g., the minimal `dist/slashed.essential.css` or the full `dist/slashed.full.css`), or to override the pinned ref / point to a commit SHA, use the `slashed_bricks/css_bundle_url` filter.

## License

MIT - Same as the SLASHED framework.
