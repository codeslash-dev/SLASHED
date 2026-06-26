<script>
  /**
   * Inline SVG icon for the configurator chrome.
   *
   * Renders one entry from lib/icons.js inside a stroke="currentColor" wrapper,
   * so icons inherit the dogfooded `--sf-*` theme colour and stay crisp at any
   * size — no binary assets, no emoji. Keyed by name; `domains.js` references
   * these keys.
   */
  import { ICON_PATHS } from '../lib/icons.js';

  /** @type {{ name: string, size?: number }} */
  let { name, size = 20 } = $props();

  const markup = $derived(ICON_PATHS[name] ?? '');
</script>

<svg
  class="icon"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
  focusable="false">
  {@html markup}
</svg>

<style>
  .icon {
    display: block;
    flex-shrink: 0;
  }
</style>
