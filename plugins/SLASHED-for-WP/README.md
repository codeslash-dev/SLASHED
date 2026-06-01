# SLASHED for WordPress

The official WordPress integration for the [SLASHED CSS Framework](https://github.com/codeslash-dev/SLASHED). This plugin brings cascade-layer CSS, token synchronization, and advanced design tools to the WordPress ecosystem.

## Overview

SLASHED for WordPress is a unified plugin that provides:
- **Core CSS Delivery**: Automatically enqueues the SLASHED framework on your site.
- **Design Token Management**: A central UI to customize brand colors, typography, and spacing.
- **Deep Builder Integrations**: Deeply integrated with popular page builders like Bricks and Gutenberg.
- **reBEMer Tool**: A powerful BEM class manager for Bricks Builder.

## Integrations

### Bricks Builder
The Bricks integration is the most feature-complete, offering:
- **Automatic Token Sync**: Every SLASHED token is registered as a Bricks global variable.
- **Color Palette Integration**: Brand and status colors appear in the Bricks color palette.
- **Class Autocomplete**: All `.sf-*` and `.is-*` classes are available in the class manager.
- **reBEMer**: A subtree-scoped BEM manager in the structure panel.

See [Bricks Integration README](integrations/bricks/README.md) for more details.

### Gutenberg (Block Editor)
The Gutenberg integration provides:
- **CSS Enqueue**: Loads the framework in the editor canvas and frontend.
- **Color Palette Sync**: Syncs SLASHED brand colors with the Gutenberg color palette.
- **Dark Mode Bridge**: Syncs the editor's dark mode state with SLASHED.

## Key Features

### Centralized Token UI
Manage your entire design system from **Admin > SLASHED**. Changes here update the CSS variables used across all builders and the frontend.

### reBEMer (Bricks Only)
reBEMer solves the "class hell" problem in Bricks by allowing you to rename or add BEM-compliant classes to an entire subtree in one transaction. It includes reference-count safety and snapshot rollback.

### Builder-Adaptive
The plugin is designed to be builder-adaptive. The core CSS delivery works independently of any specific builder, while integrations add specific hooks and UI enhancements where they make sense.

## Requirements
- WordPress 6.0+
- PHP 7.4+

## License
MIT - Same as the SLASHED framework.
