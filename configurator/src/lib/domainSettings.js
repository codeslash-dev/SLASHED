/**
 * Declarative smart settings shown above the raw All variables catalogue.
 * These panels are intentionally beginner-first: each section edits a small
 * set of meaningful design decisions while the full configure/consume token
 * list remains available below for power users.
 */
export const SMART_SETTINGS_BY_DOMAIN = {
  colors: [
    {
      id: 'palette-curve',
      title: 'Palette shade curve',
      hint: 'Granular shade spread for every generated color scale.',
      kind: 'sliders',
      controls: [
        { token: '--sf-palette-mix-50', label: '50 · ultra light', min: 2, max: 30, step: 1, unit: '%' },
        { token: '--sf-palette-mix-100', label: '100 · lightest', min: 5, max: 40, step: 1, unit: '%' },
        { token: '--sf-palette-mix-200', label: '200 · lighter', min: 10, max: 55, step: 1, unit: '%' },
        { token: '--sf-palette-mix-300', label: '300 · light', min: 20, max: 70, step: 1, unit: '%' },
        { token: '--sf-palette-mix-400', label: '400 · semi-light', min: 35, max: 90, step: 1, unit: '%' },
        { token: '--sf-palette-mix-600', label: '600 · semi-dark', min: 35, max: 90, step: 1, unit: '%' },
        { token: '--sf-palette-mix-700', label: '700 · dark', min: 20, max: 75, step: 1, unit: '%' },
        { token: '--sf-palette-mix-800', label: '800 · darker', min: 10, max: 60, step: 1, unit: '%' },
        { token: '--sf-palette-mix-900', label: '900 · darkest', min: 5, max: 45, step: 1, unit: '%' },
        { token: '--sf-palette-mix-950', label: '950 · ultra dark', min: 2, max: 30, step: 1, unit: '%' },
      ],
      presets: [
        { label: 'Default', patch: null },
        { label: 'Softer', patch: { '--sf-palette-mix-50': '6%', '--sf-palette-mix-100': '10%', '--sf-palette-mix-200': '18%', '--sf-palette-mix-300': '30%', '--sf-palette-mix-400': '46%', '--sf-palette-mix-600': '46%', '--sf-palette-mix-700': '30%', '--sf-palette-mix-800': '18%', '--sf-palette-mix-900': '10%', '--sf-palette-mix-950': '6%' } },
        { label: 'Punchy', patch: { '--sf-palette-mix-50': '15%', '--sf-palette-mix-100': '24%', '--sf-palette-mix-200': '36%', '--sf-palette-mix-300': '50%', '--sf-palette-mix-400': '68%', '--sf-palette-mix-600': '68%', '--sf-palette-mix-700': '50%', '--sf-palette-mix-800': '36%', '--sf-palette-mix-900': '24%', '--sf-palette-mix-950': '15%' } },
      ],
    },
  ],

  typography: [
    {
      id: 'typography-defaults',
      title: 'Typography defaults',
      hint: 'Fonts, headings and readable defaults in one compact panel.',
      kind: 'tokens',
      controls: [
        { token: '--sf-font-body', label: 'Body font', help: 'Default UI and prose font stack.' },
        { token: '--sf-font-heading', label: 'Heading font', help: 'Heading/display font stack.' },
        { token: '--sf-font-mono', label: 'Code font', help: 'Code, kbd and tabular font stack.' },
        { token: '--sf-leading-normal', label: 'Body line height', help: 'Default body rhythm.' },
        { token: '--sf-font-weight-heading', label: 'Heading weight', help: 'Global heading weight.' },
        { token: '--sf-heading-text-wrap', label: 'Heading wrap', help: 'Balance/pretty/wrap behavior for headings.' },
      ],
      presets: [
        { label: 'Default', patch: null },
        { label: 'Compact app', patch: { '--sf-text-scale': '0.92', '--sf-leading-normal': '1.45', '--sf-font-weight-heading': '650' } },
        { label: 'Editorial', patch: { '--sf-text-scale': '1.08', '--sf-leading-normal': '1.7', '--sf-font-weight-heading': '700', '--sf-heading-text-wrap': 'balance' } },
      ],
    },
  ],

  spacing: [
    {
      id: 'spacing-density',
      title: 'Density & rhythm',
      hint: 'One-click density plus the rhythm tokens most layouts consume.',
      kind: 'tokens',
      controls: [
        { token: '--sf-section-pad', label: 'Section padding', help: 'Vertical breathing room for page sections.' },
        { token: '--sf-content-gap', label: 'Content rhythm', help: 'Gap between prose/content blocks.' },
        { token: '--sf-gutter', label: 'Viewport gutter', help: 'Horizontal page edge padding.' },
        { token: '--sf-component-pad', label: 'Component padding', help: 'Default inner component padding.' },
      ],
      presets: [
        { label: 'Default', patch: null },
        { label: 'Compact', patch: { '--sf-space-scale': '0.85', '--sf-section-scale': '0.8' } },
        { label: 'Comfortable', patch: { '--sf-space-scale': '1.12', '--sf-section-scale': '1.15' } },
        { label: 'Spacious', patch: { '--sf-space-scale': '1.28', '--sf-section-scale': '1.35' } },
      ],
    },
  ],

  gradients: [
    {
      id: 'gradient-builder',
      title: 'Gradient builder',
      hint: 'Visual controls for direction, stops and presets; raw CSS stays below.',
      kind: 'gradient',
      tokens: ['--sf-gradient-primary', '--sf-gradient-secondary', '--sf-gradient-tertiary', '--sf-gradient-brand', '--sf-gradient-surface', '--sf-gradient-fade--t', '--sf-gradient-fade--b'],
    },
  ],

  layout: [
    {
      id: 'layout-shell',
      title: 'Header, containers & sizing',
      hint: 'The layout decisions people actually want first.',
      kind: 'tokens',
      controls: [
        { token: '--sf-header-height-mobile', label: 'Header mobile', help: 'Mobile header height used by the fluid header clamp.' },
        { token: '--sf-header-height-desktop', label: 'Header desktop', help: 'Desktop header height used by sticky offsets.' },
        { token: '--sf-container-narrow', label: 'Narrow width', help: 'Narrow columns and asides.' },
        { token: '--sf-container-prose', label: 'Reading width', help: 'Long-form readable line length.' },
        { token: '--sf-container-default', label: 'Content width', help: 'Main container width.' },
        { token: '--sf-container-wide', label: 'Wide width', help: 'Wide marketing/docs sections.' },
        { token: '--sf-touch-target', label: 'Touch target', help: 'Minimum accessible hit area.' },
        { token: '--sf-icon-m', label: 'Icon size', help: 'Default medium icon size.' },
      ],
      presets: [
        { label: 'Default', patch: null },
        { label: 'App shell', patch: { '--sf-header-height-mobile': '3.5rem', '--sf-header-height-desktop': '4rem', '--sf-container-default': '72rem' } },
        { label: 'Marketing', patch: { '--sf-header-height-mobile': '4rem', '--sf-header-height-desktop': '5rem', '--sf-container-wide': '90rem' } },
      ],
    },
  ],

  borders: [
    {
      id: 'border-system',
      title: 'Radius & strokes',
      hint: 'Corner style presets plus editable radius/stroke ramp.',
      kind: 'tokens',
      controls: [
        { token: '--sf-radius-s', label: 'Small radius', help: 'Badges, inputs and chips.' },
        { token: '--sf-radius-m', label: 'Medium radius', help: 'Buttons and cards.' },
        { token: '--sf-radius-l', label: 'Large radius', help: 'Panels and dialogs.' },
        { token: '--sf-radius-xl', label: 'XL radius', help: 'Hero/media surfaces.' },
        { token: '--sf-border-width-1', label: 'Border width', help: 'Default stroke thickness.' },
        { token: '--sf-divider-width', label: 'Divider width', help: 'Horizontal rules and separators.' },
      ],
    },
  ],

  shadows: [
    {
      id: 'shadow-system',
      title: 'Elevation system',
      hint: 'Edit the elevation ramp; strength stays available as the global lever.',
      kind: 'tokens',
      controls: [
        { token: '--sf-shadow-s', label: 'Elevation 1', help: 'Subtle lift.' },
        { token: '--sf-shadow-m', label: 'Elevation 2', help: 'Default cards/buttons.' },
        { token: '--sf-shadow-l', label: 'Elevation 3', help: 'Popovers and sticky UI.' },
        { token: '--sf-shadow-xl', label: 'Elevation 4', help: 'Dialogs and overlays.' },
        { token: '--sf-shadow-color', label: 'Shadow color', help: 'Base color used by shadows.' },
      ],
    },
  ],

  motion: [
    {
      id: 'motion-timing',
      title: 'Timing system',
      hint: 'Durations, easing and reduced-motion-friendly speed in one place.',
      kind: 'motion',
      durationTokens: ['--sf-duration-instant', '--sf-duration-fast', '--sf-duration-normal', '--sf-duration-slow', '--sf-duration-slower'],
      easingTokens: ['--sf-ease-linear', '--sf-ease-in', '--sf-ease-out', '--sf-ease-in-out', '--sf-ease-spring', '--sf-ease-overshoot'],
      presets: [
        { label: 'Default', patch: null },
        { label: 'Snappy', patch: { '--sf-motion-scale': '0.75', '--sf-duration-fast': 'calc(110ms * var(--sf-motion-scale))', '--sf-duration-normal': 'calc(220ms * var(--sf-motion-scale))', '--sf-duration-slow': 'calc(360ms * var(--sf-motion-scale))' } },
        { label: 'Smooth', patch: { '--sf-motion-scale': '1.15', '--sf-duration-fast': 'calc(180ms * var(--sf-motion-scale))', '--sf-duration-normal': 'calc(360ms * var(--sf-motion-scale))', '--sf-duration-slow': 'calc(620ms * var(--sf-motion-scale))' } },
        { label: 'Reduced', patch: { '--sf-motion-scale': '0', '--sf-duration-fast': '1ms', '--sf-duration-normal': '1ms', '--sf-duration-slow': '1ms' } },
      ],
    },
  ],

  effects: [
    {
      id: 'effects-compositing',
      title: 'Compositing',
      hint: 'Blur, opacity and scrim controls with visual presets.',
      kind: 'tokens',
      controls: [
        { token: '--sf-blur', label: 'Default blur', help: 'Backdrop/filter blur amount.' },
        { token: '--sf-opacity-muted', label: 'Muted opacity', help: 'Opacity for secondary/faded UI.' },
        { token: '--sf-opacity-disabled', label: 'Disabled opacity', help: 'Opacity for disabled controls.' },
        { token: '--sf-scrim-color', label: 'Scrim color', help: 'Overlay color before it fades to transparent.' },
        { token: '--sf-scrim-direction', label: 'Scrim direction', help: 'Gradient direction for readability scrims.' },
      ],
      presets: [
        { label: 'Default', patch: null },
        { label: 'Subtle', patch: { '--sf-opacity-muted': '0.72', '--sf-opacity-disabled': '0.5', '--sf-blur': '8px' } },
        { label: 'Strong overlay', patch: { '--sf-opacity-muted': '0.55', '--sf-opacity-disabled': '0.38', '--sf-blur': '18px' } },
      ],
    },
  ],
};

export function smartSettingsFor(domainId) {
  return SMART_SETTINGS_BY_DOMAIN[domainId] ?? [];
}

export function sectionTokenNames(section) {
  const names = [
    ...(section.controls?.map((c) => c.token) ?? []),
    ...(section.tokens ?? []),
    ...(section.durationTokens ?? []),
    ...(section.easingTokens ?? []),
  ];
  for (const preset of section.presets ?? []) {
    if (preset.patch) names.push(...Object.keys(preset.patch));
  }
  return [...new Set(names)];
}

export function smartTokensFor(domainId) {
  return smartSettingsFor(domainId).flatMap(sectionTokenNames);
}
