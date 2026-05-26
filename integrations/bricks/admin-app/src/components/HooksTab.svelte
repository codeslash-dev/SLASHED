<script>
  /**
   * Static documentation tab listing all available filter hooks with
   * descriptions and PHP code examples.
   */
  const hooks = [
    {
      name: 'slashed_bricks/css_bundle_url',
      description: 'Override which CSS bundle URL to load.',
      params: '$url (string) - The current CSS bundle URL.',
      example: `add_filter( 'slashed_bricks/css_bundle_url', function( $url ) {
    // Load from a CDN instead.
    return 'https://cdn.example.com/slashed/slashed.optimal.css';
} );`,
    },
    {
      name: 'slashed_bricks/registered_classes',
      description: 'Filter the array of classes before registration with Bricks.',
      params: '$classes (array) - Array of class definitions with name and category.',
      example: `add_filter( 'slashed_bricks/registered_classes', function( $classes ) {
    // Remove state classes.
    return array_filter( $classes, function( $class ) {
        return $class['category'] !== 'SLASHED State';
    } );
} );`,
    },
    {
      name: 'slashed_bricks/registered_colors',
      description: 'Filter the colors array before registration with Bricks.',
      params: '$colors (array) - Array of color definitions with name, value, and category.',
      example: `add_filter( 'slashed_bricks/registered_colors', function( $colors ) {
    // Only keep brand colors, remove semantic.
    return array_filter( $colors, function( $color ) {
        return strpos( $color['category'], 'Semantic' ) === false;
    } );
} );`,
    },
    {
      name: 'slashed_bricks/registered_variables',
      description: 'Filter the CSS variables array before registration with Bricks.',
      params: '$variables (array) - Associative array keyed by category label.',
      example: `add_filter( 'slashed_bricks/registered_variables', function( $variables ) {
    // Remove z-index variables.
    unset( $variables['Z-Index'] );
    return $variables;
} );`,
    },
    {
      name: 'slashed_bricks/inventory',
      description: 'Replace the resolved inventory wholesale. Useful for tests, custom forks of the framework, or sites that want to ship their own token list.',
      params: "$inventory (array) - Array with keys 'variables', 'sf_classes', 'is_classes'.",
      example: `add_filter( 'slashed_bricks/inventory', function( $inventory ) {
    $inventory['variables'][] = '--sf-color-my-custom';
    return $inventory;
} );`,
    },
    {
      name: 'slashed_bricks/inventory_local_path',
      description: 'Override the local CSS path the inventory parses. Return a string for a specific path, false to skip local resolution, or null (default) to use bundled candidates.',
      params: '$path (string|false|null) - Override path or control flag.',
      example: `// Use a child-theme copy of the bundle.
add_filter( 'slashed_bricks/inventory_local_path', function() {
    return get_stylesheet_directory() . '/assets/slashed.optimal.css';
} );`,
    },
    {
      name: 'slashed_bricks/color_categories',
      description: 'Filter which color categories to include in the Bricks palette.',
      params: '$categories (array) - Associative array of category name to color entries.',
      example: `add_filter( 'slashed_bricks/color_categories', function( $categories ) {
    // Only include primary and secondary brand palettes.
    return array_intersect_key( $categories, array_flip( [
        'SLASHED Primary',
        'SLASHED Secondary',
    ] ) );
} );`,
    },
  ];
</script>

<section>
  <h2>Filter Hooks Reference</h2>
  <p class="hint">
    These WordPress filter hooks let you customize the SLASHED Bricks integration
    from your theme or a mu-plugin. Each hook fires during plugin initialization.
  </p>

  {#each hooks as hook (hook.name)}
    <div class="hook">
      <h3 class="hook__name"><code>{hook.name}</code></h3>
      <p class="hook__desc">{hook.description}</p>
      <p class="hook__params"><strong>Parameters:</strong> <code>{hook.params}</code></p>
      <pre class="hook__example"><code>{hook.example}</code></pre>
    </div>
  {/each}
</section>

<style>
  h2 { margin-top: 0; }
  .hint { color: #50575e; margin-bottom: 20px; max-width: 720px; }

  .hook {
    border: 1px solid #f0f0f1;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 12px;
    background: #fcfcfd;
  }

  .hook__name {
    margin: 0 0 8px;
    font-size: 14px;
  }
  .hook__name code {
    background: #e7e8ea;
    padding: 3px 8px;
    border-radius: 3px;
    font-size: 13px;
  }

  .hook__desc {
    margin: 0 0 8px;
    color: #1d2327;
    font-size: 14px;
  }

  .hook__params {
    margin: 0 0 12px;
    font-size: 13px;
    color: #50575e;
  }
  .hook__params code {
    background: #f0f0f1;
    padding: 1px 4px;
    border-radius: 2px;
    font-size: 12px;
  }

  .hook__example {
    margin: 0;
    padding: 12px;
    background: #1d2327;
    color: #e4e6e8;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.5;
  }
  .hook__example code {
    background: none;
    padding: 0;
    color: inherit;
  }
</style>
