/**
 * Semantic color role assignments — maps human-readable UI roles to the
 * framework's semantic consumption tokens. Displayed in ColorAssignments.svelte
 * as a live swatch grid so users see exactly how their brand choices surface
 * throughout the design system.
 *
 * These are CONSUMPTION tokens (light-dark() derived outputs you READ in
 * component CSS), not knob tokens. The configurator resolves them via the
 * probe host so the swatches reflect both themes simultaneously.
 */

/**
 * @typedef {{ label: string, token: string, description?: string }} ColorRole
 * @typedef {{ section: string, roles: ColorRole[] }} ColorRoleGroup
 */

/** @type {ColorRoleGroup[]} */
export const COLOR_ROLE_GROUPS = [
  {
    section: 'Surfaces',
    roles: [
      { label: 'Page background',  token: '--sf-color-bg',      description: 'Main page canvas' },
      { label: 'Surface',          token: '--sf-color-surface',  description: 'Cards, panels, containers' },
      { label: 'Hover state',      token: '--sf-color-bg--hover', description: 'Row/button hover fill' },
    ],
  },
  {
    section: 'Text',
    roles: [
      { label: 'Body text',        token: '--sf-color-text',           description: 'Primary reading text' },
      { label: 'Secondary text',   token: '--sf-color-text--secondary', description: 'Labels, captions' },
      { label: 'Muted text',       token: '--sf-color-text--muted',    description: 'Placeholders, hints' },
    ],
  },
  {
    section: 'Borders',
    roles: [
      { label: 'Default border',   token: '--sf-color-border',         description: 'Dividers, card edges' },
      { label: 'Strong border',    token: '--sf-color-border--strong', description: 'Inputs, focused rings' },
      { label: 'Subtle border',    token: '--sf-color-border--subtle', description: 'Hairlines, table rules' },
    ],
  },
  {
    section: 'Interactive',
    roles: [
      { label: 'Link',             token: '--sf-color-link',           description: 'Default hyperlink' },
      { label: 'Link (hover)',     token: '--sf-color-link--hover',    description: 'Hovered hyperlink' },
      { label: 'Focus ring',       token: '--sf-color-border--focus',  description: 'Keyboard focus indicator' },
    ],
  },
];

/** Flat list of all role tokens (for probe batching). */
export const ALL_ROLE_TOKENS = COLOR_ROLE_GROUPS.flatMap((g) => g.roles.map((r) => r.token));
