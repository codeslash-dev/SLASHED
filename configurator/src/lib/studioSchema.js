import { tokenByName } from './model.js';

export const TYPOGRAPHY_PANELS = [
  {
    id: 'Overview',
    label: 'Overview',
    description: 'Font stacks, global rhythm and heading behavior for the whole type system.',
    tokens: ['--sf-font-body', '--sf-font-heading', '--sf-font-mono', '--sf-leading-normal', '--sf-font-weight-heading', '--sf-heading-text-wrap'],
  },
  {
    id: 'Fluid scale',
    label: 'Fluid scale',
    description: 'Tune the source values that drive the generated text ramp.',
    tokens: ['--sf-text-base-min', '--sf-text-base-max', '--sf-text-ratio-min', '--sf-text-ratio-max', '--sf-text-scale', '--sf-text-display-scale'],
  },
  {
    id: 'Headings',
    label: 'Headings',
    description: 'Heading aliases, line-height, tracking and max-width constraints.',
    tokens: ['--sf-h1-size', '--sf-h1-line-height', '--sf-h1-letter-spacing', '--sf-h1-max-width', '--sf-h2-size', '--sf-h2-line-height', '--sf-h3-size', '--sf-h3-line-height', '--sf-heading-text-wrap'],
  },
  {
    id: 'Body',
    label: 'Body',
    description: 'Body copy, prose spacing and readable line length.',
    tokens: ['--sf-body-font-size', '--sf-body-line-height', '--sf-body-text-wrap', '--sf-text-m-max-width', '--sf-prose-paragraph', '--sf-prose-heading-gap', '--sf-prose-list-gap'],
  },
  {
    id: 'Code',
    label: 'Code',
    description: 'Monospace family and inline-code sizing/padding.',
    tokens: ['--sf-font-mono', '--sf-code-font-size', '--sf-code-padding-inline', '--sf-code-padding-block', '--sf-color-code-bg', '--sf-color-code-text'],
  },
];

export const STUDIO_GROUPS = {
  spacing: [
    { title: 'Global scale', hint: 'One multiplier for the complete spacing ramp.', tokens: ['--sf-space-scale', '--sf-section-scale'] },
    { title: 'Page rhythm', hint: 'The defaults most layouts feel immediately.', tokens: ['--sf-section-pad', '--sf-content-gap', '--sf-gutter', '--sf-gap'] },
    { title: 'Component rhythm', hint: 'Interior padding and compact UI spacing.', tokens: ['--sf-component-pad', '--sf-space-2xs', '--sf-space-xs', '--sf-space-s', '--sf-space-m'] },
  ],
  layout: [
    { title: 'Containers', hint: 'Main page widths and reading measure.', tokens: ['--sf-container-narrow', '--sf-container-prose', '--sf-container-default', '--sf-container-wide'] },
    { title: 'Grid & composition', hint: 'Breakpoint-free grid and sidebar defaults.', tokens: ['--sf-grid-min', '--sf-grid-min-s', '--sf-grid-min-l', '--sf-sidebar-width', '--sf-switcher-threshold'] },
    { title: 'Global anchors', hint: 'Sticky offsets, header height and accessible targets.', tokens: ['--sf-header-height-mobile', '--sf-header-height-desktop', '--sf-touch-target', '--sf-sticky-offset-mobile', '--sf-sticky-offset-desktop'] },
  ],
  borders: [
    { title: 'Radius system', hint: 'Scale every corner from sharp to soft.', tokens: ['--sf-radius-scale', '--sf-radius-xs', '--sf-radius-s', '--sf-radius-m', '--sf-radius-l', '--sf-radius-xl', '--sf-radius-full'] },
    { title: 'Borders & dividers', hint: 'Strokes that frame cards, fields and rules.', tokens: ['--sf-border-scale', '--sf-border-style', '--sf-border-width-hairline', '--sf-border-width-1', '--sf-border-width-2', '--sf-divider-width', '--sf-divider-style'] },
    { title: 'Focus ring', hint: 'Keyboard focus affordance lives with shape controls.', tokens: ['--sf-focus-ring-width', '--sf-focus-ring-offset', '--sf-color-border--focus'] },
  ],
  shadows: [
    { title: 'Elevation strength', hint: 'Global tone and lightness for all elevations.', tokens: ['--sf-shadow-strength', '--sf-shadow-lightness', '--sf-shadow-color', '--sf-shadow-glow-color'] },
    { title: 'Box shadows', hint: 'Individual elevation outputs for cards, popovers and dialogs.', tokens: ['--sf-shadow-xs', '--sf-shadow-s', '--sf-shadow-m', '--sf-shadow-l', '--sf-shadow-xl', '--sf-shadow-2xl'] },
    { title: 'Text & drop shadows', hint: 'Media and floating asset shadow presets.', tokens: ['--sf-text-shadow-s', '--sf-text-shadow-m', '--sf-text-shadow-l', '--sf-drop-shadow-s', '--sf-drop-shadow-m', '--sf-drop-shadow-l'] },
  ],
  motion: [
    { title: 'Speed scale', hint: 'Set to 0 for near-reduced motion, raise for more expressive interfaces.', tokens: ['--sf-motion-scale', '--sf-duration-none', '--sf-duration-instant', '--sf-duration-fast', '--sf-duration-normal', '--sf-duration-slow', '--sf-duration-slower'] },
    { title: 'Easing curves', hint: 'The feel of entrance, exit and spring interactions.', tokens: ['--sf-ease-linear', '--sf-ease-in', '--sf-ease-out', '--sf-ease-in-out', '--sf-ease-spring', '--sf-ease-overshoot'] },
    { title: 'Animation presets', hint: 'Named shorthands consumed by utility classes and components.', tokens: ['--sf-animation-fade-in', '--sf-animation-slide-in-up', '--sf-animation-scale-up', '--sf-animation-float', '--sf-animation-shimmer'] },
  ],
  effects: [
    { title: 'Glass & blur', hint: 'Backdrops and soft focus effects.', tokens: ['--sf-blur'] },
    { title: 'Opacity states', hint: 'Muted, disabled and pending UI states.', tokens: ['--sf-opacity-muted', '--sf-opacity-disabled', '--sf-state-pending-opacity'] },
    { title: 'Scrims & masks', hint: 'Readable text over media and scroll fades.', tokens: ['--sf-scrim-color', '--sf-scrim-direction', '--sf-scrim-text-shadow', '--sf-mask-scrim-start', '--sf-mask-scrim-end'] },
  ],
};

export function resolveStudioGroups(groups) {
  return groups
    .map((group) => ({
      ...group,
      tokens: group.tokens.map((name) => tokenByName.get(name)).filter(Boolean),
    }))
    .filter((group) => group.tokens.length);
}
