/**
 * Inline SVG icon path data for the configurator chrome.
 *
 * Single-weight stroke set (24×24 viewBox) keyed by name; `domains.js`
 * references these keys and `Icon.svelte` renders them inside a
 * `stroke="currentColor"` wrapper so they inherit the dogfooded theme colour
 * and stay crisp at any size — no binary assets, no emoji.
 *
 * Pure data, so tests/icons.test.js can assert every domain icon key resolves
 * to non-empty markup (a missing key fails CI instead of rendering blank).
 *
 * @type {Record<string, string>}
 */
export const ICON_PATHS = {
  // Overview — home
  home:
    '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/>',
  // Colors — palette
  palette:
    '<circle cx="13.5" cy="6.5" r="1.3"/><circle cx="17" cy="11" r="1.3"/><circle cx="8.5" cy="7.5" r="1.3"/><circle cx="6.5" cy="12.5" r="1.3"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.83-.44-1.12-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h2c3.05 0 5.56-2.5 5.56-5.55C22 6 17.5 2 12 2Z"/>',
  // Gradients — blend (two overlapping circles)
  gradient: '<circle cx="9" cy="9" r="7"/><circle cx="15" cy="15" r="7"/>',
  // Typography — type
  type: '<path d="M4 7V5h16v2"/><path d="M12 5v14"/><path d="M9 19h6"/>',
  // Spacing — ruler
  ruler:
    '<path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>',
  // Layout — dashboard blocks
  layout:
    '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  // Borders — rounded square
  square: '<rect x="3" y="3" width="18" height="18" rx="4"/>',
  // Shadows — layers
  layers:
    '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-9.17 4.16a2 2 0 0 1-1.66 0L2 12.5"/><path d="m22 17.5-9.17 4.16a2 2 0 0 1-1.66 0L2 17.5"/>',
  // Motion — play
  motion: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4Z"/>',
  // Effects — sparkles
  sparkles:
    '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15l.7 1.8L21.5 17.5l-1.8.7L19 20l-.7-1.8L16.5 17.5l1.8-.7Z"/>',
  // WCAG — contrast
  contrast:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2v20a10 10 0 0 0 0-20Z" fill="currentColor" stroke="none"/>',
  // Themes — overlapping swatch cards
  swatches:
    '<rect x="3.5" y="3.5" width="12" height="12" rx="2"/><rect x="8.5" y="8.5" width="12" height="12" rx="2"/>',
  // Install — package
  package:
    '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
  // Misc — puzzle piece
  puzzle:
    '<path d="M15.4 3a2.4 2.4 0 0 0-2.4 2.4c0 .5-.4.9-.9.9H9.5A1.5 1.5 0 0 0 8 7.8v2.6c0 .5-.4.9-.9.9a2.4 2.4 0 1 0 0 4.8c.5 0 .9.4.9.9V19a2 2 0 0 0 2 2h2.6c.5 0 .9-.4.9-.9a2.4 2.4 0 1 1 4.8 0c0 .5.4.9.9.9H21a2 2 0 0 0 2-2v-2.6"/>',
  // Cheatsheet — list
  list:
    '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
};
