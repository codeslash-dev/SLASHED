<?php
/**
 * Variable registration for the Bricks Builder Global Variable Manager
 * and code editor autocomplete.
 *
 * @package SLASHED_Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Class Slashed_Bricks_Variables
 *
 * Registers SLASHED CSS custom properties with Bricks Builder.
 *
 * Strategy
 * --------
 * Bricks 1.9.8+ stores user-managed variables in the `bricks_global_variables`
 * wp_option (categories in `bricks_global_variables_categories`). Same as
 * the Colors and Classes modules, we treat SLASHED entries as managed/virtual:
 * inject on read, strip on save, so the integration is the single source of
 * truth and bumping the framework or switching the active CSS bundle keeps
 * the Variable Manager in sync without leaving stale rows in the DB.
 *
 * Naming
 * ------
 * SLASHED variables live in the `--sf-*` namespace. Bricks generates CSS
 * for every entry it has under `:root { --<name>: <value>; }`. If we
 * registered `--sf-color-primary` directly with `value: var(--sf-color-primary)`
 * Bricks would emit `--sf-color-primary: var(--sf-color-primary);` - a
 * circular reference that resolves to the CSS initial value (invalid) and
 * would break every SLASHED token.
 *
 * To avoid clobbering the framework's own definitions, the Bricks-registered
 * variables use a `slashed-` prefix and chain back to the SLASHED token:
 *
 *   SLASHED defines:  --sf-color-primary: <theme-aware value>;
 *   Bricks emits:     --slashed-color-primary: var(--sf-color-primary);
 *
 * The picker shows `slashed-color-primary`; using it inserts
 * `var(--slashed-color-primary)` into the property, which the cascade
 * resolves through the framework so theme switches and dark mode keep
 * propagating.
 *
 * The code editor autocomplete (`bricks/code/get_code_signatures`) keeps
 * the original `--sf-*` names so users hand-typing CSS still get the
 * framework's native namespace suggested directly.
 */
class Slashed_Bricks_Variables {

    /**
     * Prefix used on every variable id and category id this integration
     * injects. Used to identify our entries when stripping on save.
     */
    const ID_PREFIX = 'slashed-';

    /**
     * Prefix used on the user-visible variable name in the picker.
     * E.g. `--sf-color-primary` becomes `slashed-color-primary`.
     */
    const VAR_PREFIX = 'slashed-';

    /**
     * Prefix used on category ids stored in
     * `bricks_global_variables_categories`.
     */
    const CAT_PREFIX = 'slashed-cat-';

    /**
     * Constructor. Register option filters and the code editor signatures filter.
     */
    public function __construct() {
        // Inject SLASHED variables when Bricks reads the option.
        add_filter( 'option_bricks_global_variables', array( $this, 'inject_variables' ), 20 );
        add_filter( 'default_option_bricks_global_variables', array( $this, 'inject_variables' ), 20 );

        // Strip SLASHED variables before they are persisted back to the DB.
        add_filter( 'pre_update_option_bricks_global_variables', array( $this, 'strip_variables' ), 10, 1 );

        // Same managed/virtual pattern for variable categories.
        add_filter( 'option_bricks_global_variables_categories', array( $this, 'inject_categories' ), 20 );
        add_filter( 'default_option_bricks_global_variables_categories', array( $this, 'inject_categories' ), 20 );
        add_filter( 'pre_update_option_bricks_global_variables_categories', array( $this, 'strip_categories' ), 10, 1 );

        // Code editor autocomplete (real Bricks 1.9.2+ filter; lists the
        // original --sf-* names so authors typing custom CSS see the
        // framework's native namespace, not the slashed- alias).
        add_filter( 'bricks/code/get_code_signatures', array( $this, 'register_code_signatures' ) );
    }

    // ---------------------------------------------------------------
    // Inject / strip plumbing.
    // ---------------------------------------------------------------

    /**
     * Inject SLASHED variables into the global variables list.
     *
     * Idempotent: any existing SLASHED-prefixed entries are removed first
     * so multiple read passes don't create duplicates.
     *
     * @param mixed $variables Existing value of bricks_global_variables option.
     * @return array
     */
    public function inject_variables( $variables ) {
        if ( ! is_array( $variables ) ) {
            $variables = array();
        }

        $variables = $this->strip_variables( $variables );

        foreach ( $this->build_variables() as $entry ) {
            $variables[] = $entry;
        }

        return $variables;
    }

    /**
     * Remove SLASHED-prefixed variables from a variables array.
     *
     * @param mixed $variables Value of bricks_global_variables option.
     * @return array
     */
    public function strip_variables( $variables ) {
        return $this->strip_prefixed( $variables );
    }

    /**
     * Inject SLASHED variable category entries.
     *
     * @param mixed $categories Existing value of bricks_global_variables_categories option.
     * @return array
     */
    public function inject_categories( $categories ) {
        if ( ! is_array( $categories ) ) {
            $categories = array();
        }

        $categories = $this->strip_categories( $categories );

        foreach ( $this->build_categories() as $cat ) {
            $categories[] = $cat;
        }

        return $categories;
    }

    /**
     * Remove SLASHED-prefixed categories from a categories array.
     *
     * @param mixed $categories Value of bricks_global_variables_categories option.
     * @return array
     */
    public function strip_categories( $categories ) {
        return $this->strip_prefixed( $categories );
    }

    /**
     * Shared "strip every entry whose id starts with our prefix" helper.
     *
     * @param mixed $entries Possibly malformed list of `{id,...}` entries.
     * @return array
     */
    private function strip_prefixed( $entries ) {
        if ( ! is_array( $entries ) ) {
            return array();
        }

        $kept = array();
        foreach ( $entries as $entry ) {
            if ( is_array( $entry )
                && isset( $entry['id'] )
                && is_string( $entry['id'] )
                && 0 === strpos( $entry['id'], self::ID_PREFIX )
            ) {
                continue;
            }
            $kept[] = $entry;
        }

        return array_values( $kept );
    }

    // ---------------------------------------------------------------
    // Build the SLASHED entries from the inventory.
    // ---------------------------------------------------------------

    /**
     * Build SLASHED variable entries.
     *
     * Each SLASHED `--sf-X` becomes a Bricks variable named `slashed-X`
     * with value `var(--sf-X)`. The chained reference keeps the framework's
     * own definition authoritative for theme/dark-mode propagation.
     *
     * Shape per entry: `{ id, name, value, category }`.
     *
     * @return array<int, array<string,string>>
     */
    public function build_variables() {
        $entries = array();

        foreach ( $this->get_variables() as $category => $vars ) {
            $cat_id = self::CAT_PREFIX . sanitize_key( $category );
            foreach ( $vars as $var ) {
                $entries[] = array(
                    'id'       => self::ID_PREFIX . sanitize_key( $var ),
                    'name'     => $this->alias_name( $var ),
                    'value'    => 'var(' . $var . ')',
                    'category' => $cat_id,
                );
            }
        }

        /**
         * Filter the SLASHED variable entries before injection.
         *
         * @param array $entries Variable entries in the Bricks-native shape.
         */
        return apply_filters( 'slashed_bricks/registered_variable_entries', $entries );
    }

    /**
     * Build SLASHED variable category entries.
     *
     * @return array<int, array<string,string>>
     */
    public function build_categories() {
        $cats = array();
        foreach ( array_keys( $this->get_variables() ) as $category ) {
            $cats[] = array(
                'id'   => self::CAT_PREFIX . sanitize_key( $category ),
                /* translators: %s: variable group name, e.g. "Colors" */
                'name' => sprintf( __( 'SLASHED %s', 'slashed-bricks' ), $category ),
            );
        }
        return $cats;
    }

    /**
     * Convert a SLASHED variable name to its Bricks-side alias.
     *
     * Strips the leading `--sf-` (if present) and prepends `slashed-`.
     *
     * Examples:
     *   --sf-color-primary  -> slashed-color-primary
     *   --sf-space-md       -> slashed-space-md
     *   --custom-var        -> slashed-custom-var
     *
     * @param string $var SLASHED variable name (with leading --).
     * @return string
     */
    private function alias_name( $var ) {
        $name = substr( (string) $var, 2 ); // strip the canonical `--` prefix
        if ( 0 === strpos( $name, 'sf-' ) ) {
            $name = substr( $name, 3 );
        }
        return self::VAR_PREFIX . $name;
    }

    // ---------------------------------------------------------------
    // Backward-compatible accessors and code editor autocomplete.
    // ---------------------------------------------------------------

    /**
     * Get all SLASHED CSS variables grouped by category.
     *
     * Backward-compatible shape kept for existing filter consumers and tests.
     *
     * @return array<string, string[]> Map of category => variable names.
     */
    public function get_variables() {
        $variables = Slashed_Bricks_Inventory::get_variables_by_category();

        /**
         * Filter the registered CSS variables (legacy accessor shape).
         *
         * @param array $variables Map of category => variable names.
         */
        return apply_filters( 'slashed_bricks/registered_variables', $variables );
    }

    /**
     * Register variables for the Bricks code editor autocomplete.
     *
     * Uses the original --sf-* names so authors writing CSS see the
     * framework's native namespace directly.
     *
     * @param array $signatures Existing code signatures.
     * @return array Modified code signatures.
     */
    public function register_code_signatures( $signatures ) {
        if ( ! is_array( $signatures ) ) {
            $signatures = array();
        }

        $css_vars = array();
        foreach ( $this->get_variables() as $category => $vars ) {
            foreach ( $vars as $var ) {
                $css_vars[] = array(
                    'label'  => $var,
                    'detail' => 'SLASHED ' . $category,
                    'type'   => 'variable',
                );
            }
        }

        if ( ! isset( $signatures['css'] ) || ! is_array( $signatures['css'] ) ) {
            $signatures['css'] = array();
        }

        $signatures['css']['slashed_variables'] = $css_vars;

        return $signatures;
    }
}
