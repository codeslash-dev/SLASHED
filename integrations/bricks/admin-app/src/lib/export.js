/**
 * CSS export generator for SLASHED design tokens.
 *
 * Client-side mirror of PHP Slashed_Bricks_CSS_Generator — iterates
 * all token sections and builds CSS declarations for non-empty overrides.
 * Output format matches the server-generated @layer slashed.overrides block.
 */

/** Viewport bounds for fluid type clamp() — same as PHP constants. */
const VIEWPORT_MIN = 22.5;
const VIEWPORT_MAX = 95;

/**
 * Build a clamp() expression for fluid type scaling.
 *
 * @param {number} min Minimum size in rem.
 * @param {number} max Maximum size in rem.
 * @returns {string|null} clamp() expression or null if invalid.
 */
function buildClamp(min, max) {
  if (min <= 0 || max <= 0) return null;
  const slope = (max - min) / (VIEWPORT_MAX - VIEWPORT_MIN);
  const slopeRounded = parseFloat(slope.toFixed(6));
  const minRounded = parseFloat(min.toFixed(4));
  const maxRounded = parseFloat(max.toFixed(4));
  return `clamp(${minRounded}rem, calc(${slopeRounded} * (100vw - ${VIEWPORT_MIN}rem) + ${minRounded}rem), ${maxRounded}rem)`;
}

/**
 * Format a numeric value: remove trailing zeros, locale-safe dot decimal.
 *
 * @param {string|number} value Raw numeric input.
 * @returns {string}
 */
function formatFloat(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  return parseFloat(num.toFixed(6)).toString();
}

/**
 * Check if a value is non-empty (not null, undefined, or blank string).
 *
 * @param {*} v
 * @returns {boolean}
 */
function hasValue(v) {
  return v !== undefined && v !== null && v !== '';
}

/**
 * Generate color declarations.
 *
 * @param {Object} settings tokens.colors section.
 * @returns {string[]}
 */
function generateColorDeclarations(settings) {
  const declarations = [];
  const brandColors = ['primary', 'secondary', 'tertiary', 'action', 'neutral', 'base'];
  const statusColors = ['success', 'warning', 'error', 'info', 'danger'];

  for (const color of brandColors) {
    const v = settings[`brand_${color}`];
    if (hasValue(v)) declarations.push(`--sf-color-${color}-light: ${v};`);
  }
  for (const color of brandColors) {
    const v = settings[`brand_dark_${color}`];
    if (hasValue(v)) declarations.push(`--sf-color-${color}-dark: ${v};`);
  }
  for (const color of statusColors) {
    const v = settings[`status_${color}`];
    if (hasValue(v)) declarations.push(`--sf-color-${color}-light: ${v};`);
  }
  for (const color of statusColors) {
    const v = settings[`status_dark_${color}`];
    if (hasValue(v)) declarations.push(`--sf-color-${color}-dark: ${v};`);
  }

  return declarations;
}

/**
 * Generate typography declarations.
 *
 * @param {Object} settings tokens.typography section.
 * @returns {string[]}
 */
function generateTypographyDeclarations(settings) {
  const declarations = [];

  const fontStacks = ['body', 'heading', 'mono', 'display', 'humanist', 'geometric', 'slab'];
  for (const name of fontStacks) {
    const v = settings[`font_${name}`];
    if (hasValue(v)) declarations.push(`--sf-font-${name}: ${v};`);
  }

  if (hasValue(settings.text_scale)) {
    declarations.push(`--sf-text-scale: ${settings.text_scale};`);
  }
  if (hasValue(settings.text_display_scale)) {
    declarations.push(`--sf-text-display-scale: ${settings.text_display_scale};`);
  }

  const sizes = ['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', 'display-s', 'display-m', 'display-l'];
  for (const size of sizes) {
    const minKey = `size_${size}_min`;
    const maxKey = `size_${size}_max`;
    const minVal = settings[minKey] ?? '';
    const maxVal = settings[maxKey] ?? '';

    if (minVal !== '' && maxVal !== '') {
      const clamp = buildClamp(parseFloat(minVal), parseFloat(maxVal));
      if (clamp) declarations.push(`--sf-text-${size}: ${clamp};`);
    }
  }

  return declarations;
}

/**
 * Generate spacing declarations.
 *
 * @param {Object} settings tokens.spacing section.
 * @returns {string[]}
 */
function generateSpacingDeclarations(settings) {
  const declarations = [];

  if (hasValue(settings.space_scale)) {
    declarations.push(`--sf-space-scale: ${settings.space_scale};`);
  }

  const aliases = {
    gutter: '--sf-space-gutter',
    gap: '--sf-gap',
    content_gap: '--sf-content-gap',
    component_pad: '--sf-component-pad',
    section_pad: '--sf-section-pad',
  };

  for (const [key, property] of Object.entries(aliases)) {
    if (hasValue(settings[key])) {
      declarations.push(`${property}: ${settings[key]};`);
    }
  }

  return declarations;
}

/**
 * Generate radius declarations.
 *
 * @param {Object} settings tokens.radius section.
 * @returns {string[]}
 */
function generateRadiusDeclarations(settings) {
  const declarations = [];

  if (hasValue(settings.radius_scale)) {
    declarations.push(`--sf-radius-scale: ${settings.radius_scale};`);
  }

  return declarations;
}

/**
 * Generate shadow declarations.
 *
 * @param {Object} settings tokens.shadows section.
 * @returns {string[]}
 */
function generateShadowDeclarations(settings) {
  const declarations = [];

  if (hasValue(settings.shadow_strength)) {
    declarations.push(`--sf-shadow-strength: calc(${settings.shadow_strength} + var(--sf-is-dark) * 0.17);`);
  }

  return declarations;
}

/**
 * Generate motion declarations.
 *
 * @param {Object} settings tokens.motion section.
 * @returns {string[]}
 */
function generateMotionDeclarations(settings) {
  const declarations = [];

  if (hasValue(settings.motion_scale)) {
    declarations.push(`--sf-motion-scale: ${settings.motion_scale};`);
  }

  const durations = ['instant', 'fast', 'normal', 'slow', 'slower'];
  for (const name of durations) {
    const v = settings[`duration_${name}`];
    if (hasValue(v)) {
      declarations.push(`--sf-duration-${name}: calc(${v}ms * var(--sf-motion-scale));`);
    }
  }

  return declarations;
}

/**
 * Generate z-index declarations.
 *
 * @param {Object} settings tokens.zindex section.
 * @returns {string[]}
 */
function generateZindexDeclarations(settings) {
  const declarations = [];

  const levels = ['below', 'base', 'raised', 'low', 'mid', 'high', 'top', 'max'];
  for (const name of levels) {
    if (hasValue(settings[name])) {
      declarations.push(`--sf-z-${name}: ${parseInt(settings[name], 10)};`);
    }
  }

  return declarations;
}

/**
 * Generate contrast declarations.
 *
 * @param {Object} settings tokens.contrast section.
 * @returns {string[]}
 */
function generateContrastDeclarations(settings) {
  const declarations = [];

  const numerics = {
    contrast_bias: '--sf-contrast-bias',
    contrast_threshold: '--sf-contrast-threshold',
    opacity_disabled: '--sf-opacity-disabled',
  };
  for (const [key, property] of Object.entries(numerics)) {
    if (hasValue(settings[key])) {
      declarations.push(`${property}: ${formatFloat(settings[key])};`);
    }
  }

  const pixelMetrics = {
    focus_ring_width: '--sf-focus-ring-width',
    focus_ring_offset: '--sf-focus-ring-offset',
  };
  for (const [key, property] of Object.entries(pixelMetrics)) {
    if (hasValue(settings[key])) {
      declarations.push(`${property}: ${formatFloat(settings[key])}px;`);
    }
  }

  if (hasValue(settings.focus_ring_style)) {
    const allowed = ['solid', 'dashed', 'dotted', 'double', 'none'];
    if (allowed.includes(settings.focus_ring_style)) {
      declarations.push(`--sf-focus-ring-style: ${settings.focus_ring_style};`);
    }
  }

  return declarations;
}

/**
 * Generate a full CSS export string from all token sections.
 *
 * Mirrors PHP Slashed_Bricks_CSS_Generator::get_override_css() logic:
 * iterates each section, collects non-empty declarations, wraps in
 * @layer slashed.overrides { :root { … } }.
 *
 * @param {Object} allTokens The full tokens reactive object (all sections).
 * @returns {string} Complete CSS string, or empty string if no overrides.
 */
export function generateExportCSS(allTokens) {
  const declarations = [];

  if (allTokens.colors && typeof allTokens.colors === 'object') {
    declarations.push(...generateColorDeclarations(allTokens.colors));
  }
  if (allTokens.typography && typeof allTokens.typography === 'object') {
    declarations.push(...generateTypographyDeclarations(allTokens.typography));
  }
  if (allTokens.spacing && typeof allTokens.spacing === 'object') {
    declarations.push(...generateSpacingDeclarations(allTokens.spacing));
  }
  if (allTokens.radius && typeof allTokens.radius === 'object') {
    declarations.push(...generateRadiusDeclarations(allTokens.radius));
  }
  if (allTokens.shadows && typeof allTokens.shadows === 'object') {
    declarations.push(...generateShadowDeclarations(allTokens.shadows));
  }
  if (allTokens.motion && typeof allTokens.motion === 'object') {
    declarations.push(...generateMotionDeclarations(allTokens.motion));
  }
  if (allTokens.zindex && typeof allTokens.zindex === 'object') {
    declarations.push(...generateZindexDeclarations(allTokens.zindex));
  }
  if (allTokens.contrast && typeof allTokens.contrast === 'object') {
    declarations.push(...generateContrastDeclarations(allTokens.contrast));
  }

  if (declarations.length === 0) return '';

  const indent = '    ';
  const body = declarations.map(d => `${indent}${d}`).join('\n');
  return `@layer slashed.overrides {\n  :root {\n${body}\n  }\n}`;
}

/**
 * Check whether any non-empty overrides exist across all token sections.
 *
 * @param {Object} allTokens The full tokens reactive object.
 * @returns {boolean}
 */
export function hasOverrides(allTokens) {
  for (const section of Object.values(allTokens)) {
    if (!section || typeof section !== 'object') continue;
    for (const value of Object.values(section)) {
      if (hasValue(value)) return true;
    }
  }
  return false;
}
