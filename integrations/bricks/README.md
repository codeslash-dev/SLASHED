# SLASHED for Bricks

A WordPress plugin that integrates the [SLASHED](https://github.com/codeslash-dev/SLASHED) cascade-layer CSS framework with [Bricks Builder](https://bricksbuilder.io/).

## Features

- **CSS Loading** - Automatically enqueues the SLASHED CSS bundle on the frontend and within the Bricks editor iframe
- **Variable Pickers** - Registers all 587+ SLASHED CSS custom properties for use in Bricks variable pickers and the code editor autocomplete
- **Class Autocomplete** - All `.sf-*` layout classes and `.is-*` state classes appear in the Bricks class input with organized categories
- **Color Palette** - Synchronizes SLASHED color tokens (brand scales, status, and semantic colors) with the Bricks global color palette

## Requirements

- WordPress 6.0+
- PHP 7.4+
- Bricks Builder 1.9.2+
- SLASHED CSS framework (included via the `dist/slashed.optimal.css` bundle)

## Installation

### Option A: Copy to plugins directory

Copy the `integrations/bricks/` folder to your WordPress plugins directory:

```bash
cp -r integrations/bricks /path/to/wp-content/plugins/slashed-bricks
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

#### `slashed_bricks/registered_variables`

Filter the CSS variables array before registration with Bricks.

```php
add_filter( 'slashed_bricks/registered_variables', function( $variables ) {
    // Remove z-index variables.
    unset( $variables['Z-Index'] );
    return $variables;
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
  includes/class-enqueue.php    CSS enqueue for frontend + editor iframe
  includes/class-variables.php  Variable registration for builder pickers
  includes/class-classes.php    Class registration for autocomplete
  includes/class-colors.php     Color palette synchronization
  assets/editor.css             Minimal editor panel styling
  README.md                     This file
```

### How It Works

1. **Bootstrap** (`slashed-bricks.php`) - Checks that Bricks is active, defines constants, and loads class files.

2. **Enqueue** (`class-enqueue.php`) - Hooks into `wp_enqueue_scripts` to load the SLASHED CSS bundle. Since Bricks fires `wp_enqueue_scripts` in its editor iframe context, this single hook covers both frontend and builder preview.

3. **Variables** (`class-variables.php`) - Registers organized variable groups via `bricks/builder/i18n` and provides code editor autocomplete data via `bricks/code/get_code_signatures`.

4. **Classes** (`class-classes.php`) - Registers all layout and state classes as locked global classes via `bricks/setup/control_options`, making them available in the class picker with categorized organization.

5. **Colors** (`class-colors.php`) - Injects color entries into the Bricks global color palette via `bricks/setup/control_options`. Colors reference CSS variables (`var(--sf-color-*)`) rather than hardcoded values, so they adapt to theme customization and dark mode.

## CSS Bundle

By default, the plugin loads `dist/slashed.optimal.css` from the SLASHED framework directory (resolved relative to the plugin location). This is the recommended bundle that includes core tokens, layout primitives, states, and optional palette tokens.

To load a different bundle (e.g., the minimal `dist/slashed.essential.css` or the full `dist/slashed.full.css`), use the `slashed_bricks/css_bundle_url` filter.

## License

MIT - Same as the SLASHED framework.
