=== SLASHED CSS Framework ===
Contributors: codeslash
Tags: css, bricks, gutenberg, design-tokens, dark-mode
Requires at least: 6.4
Tested up to: 6.7
Stable tag: trunk
Requires PHP: 7.4
License: MIT
License URI: https://opensource.org/licenses/MIT

A cascade-layer CSS framework for WordPress. Local-first delivery, zero JavaScript, built-in dark mode. Deep integrations for Bricks Builder and Gutenberg.

== Description ==

SLASHED is an open-source CSS framework built on CSS cascade layers. It covers the same ground as commercial design-token frameworks — spacing system, typography scale, color palette, utility classes, dark mode — with no subscription and no external service dependencies.

**What it does:**

* Loads the framework CSS from locally bundled files (no CDN required)
* **Bricks Builder** — injects ~600 CSS variables into Global Variables, syncs the color palette, provides class autocomplete, and ships reBEMer: a BEM class manager built into the Bricks structure panel
* **Gutenberg / Block Editor** — syncs SLASHED color tokens with the block editor palette

**CSS delivery:**

The plugin bundles the framework CSS locally. You can update it to the latest release with one click from the settings page, or switch to CDN delivery and pin any specific version tag.

**Open source:**

MIT licensed. No subscription, no SaaS dependency, no vendor lock-in.

GitHub: https://github.com/codeslash-dev/SLASHED

== Installation ==

1. Upload the `slashed` folder to `/wp-content/plugins/`
2. Activate the plugin through the Plugins screen
3. Go to **SLASHED** in the admin menu
4. Enable the integrations you need (Bricks, Gutenberg, or both)

== Frequently Asked Questions ==

= Does it require Bricks Builder or Gutenberg? =

No. The core framework CSS loads on every WordPress site regardless of which page builder (if any) is active. Builder integrations are optional.

= How do I update the bundled CSS? =

Go to SLASHED → Settings. Under CSS delivery, click **Update framework**. The plugin downloads the latest release from jsDelivr and saves it to its local dist/ directory.

= Can I pin a specific framework version? =

Yes. Switch to CDN delivery in settings and enter a release tag (e.g. `v0.5.0`). The CSS is loaded directly from jsDelivr for that version.

= Is it a replacement for Automatic.css? =

It covers the same scope: design tokens, layout utilities, spacing system, dark mode, Bricks variable picker, class autocomplete, and BEM tooling. It is open source and free.

= What is reBEMer? =

reBEMer is a BEM class manager built into the Bricks structure panel. It lets you name a block and all its descendant elements in one operation, with transactional apply and undo.

== Screenshots ==

1. SLASHED settings page — CSS delivery and builder integration toggles
2. Bricks Global Variables panel populated with SLASHED design tokens
3. reBEMer panel open in the Bricks structure panel

== Changelog ==

= 0.5.0 =
* Initial public release (beta)
* Bricks Builder integration: variable picker, color palette, class autocomplete, reBEMer
* Gutenberg integration: color palette sync
* Local-first CSS delivery with in-plugin updater
* Token override UI with REST API
