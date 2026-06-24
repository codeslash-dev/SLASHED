import { parseLength } from './length.js';

const EXPLICIT = {
  '--sf-heading-text-wrap': { control: 'select', preview: 'wrap', options: ['balance', 'pretty', 'wrap', 'normal'], label: 'Heading wrap', description: 'How headings wrap when space gets tight.' },
  '--sf-body-text-wrap': { control: 'select', preview: 'wrap', options: ['pretty', 'balance', 'wrap', 'normal'], label: 'Body wrap', description: 'Readable paragraph wrapping behaviour.' },
  '--sf-scrim-direction': { control: 'select', preview: 'gradient', options: ['to top', 'to bottom', 'to right', 'to left', '135deg'], label: 'Scrim direction', description: 'Gradient direction used for media overlays.' },
  '--sf-border-style': { control: 'select', preview: 'border', options: ['solid', 'dashed', 'dotted', 'double'], label: 'Border style' },
  '--sf-divider-style': { control: 'select', preview: 'border', options: ['solid', 'dashed', 'dotted', 'double'], label: 'Divider style' },
  '--sf-object-fit': { control: 'select', preview: 'media', options: ['cover', 'contain', 'fill', 'none', 'scale-down'], label: 'Object fit' },
  '--sf-object-position': { control: 'select', preview: 'media', options: ['50% 50%', 'top', 'bottom', 'left', 'right', 'center'], label: 'Object position' },
  '--sf-motion-scale': { control: 'number', preview: 'motion', label: 'Motion scale', description: 'Global multiplier for animation and transition durations.' },
  '--sf-radius-scale': { control: 'number', preview: 'radius', label: 'Radius scale', description: 'Global multiplier for the corner radius ramp.' },
  '--sf-space-scale': { control: 'number', preview: 'spacing', label: 'Space scale', description: 'Global multiplier for the spacing ramp.' },
  '--sf-section-scale': { control: 'number', preview: 'spacing', label: 'Section scale', description: 'Multiplier for large section padding.' },
};

function titleFromName(name = '') {
  return name.replace(/^--sf-/, '').replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function controlForToken(token, override = {}) {
  const name = token?.name ?? '';
  const explicit = EXPLICIT[name] ?? {};
  const value = token?.value ?? '';
  let schema = { label: titleFromName(name), description: token?.note || token?.description || '', control: 'text', preview: 'text' };

  if (/ease/.test(name)) {
    schema = { ...schema, control: 'select', preview: 'motion', options: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(.2,.8,.2,1)'] };
  } else if (/text-wrap/.test(name)) {
    schema = { ...schema, control: 'select', preview: 'wrap', options: ['balance', 'pretty', 'wrap', 'normal'] };
  } else if (/scrim|gradient/.test(name)) {
    schema = { ...schema, control: /direction/.test(name) ? 'select' : 'text', preview: 'gradient' };
  } else if (/color|palette|hsl|oklch|hex|focus|link|caret|border/.test(name) && /(#[0-9a-f]|oklch|oklab|hsl|rgb|var\(--sf-color)/i.test(value + name)) {
    schema = { ...schema, control: 'color', preview: 'color' };
  } else if (/font/.test(name)) {
    schema = { ...schema, control: 'font', preview: 'font' };
  } else if (/duration|motion-scale|animation|transition/.test(name)) {
    schema = { ...schema, control: parseLength(value) ? 'length' : 'text', preview: 'motion' };
  } else if (/radius/.test(name)) {
    schema = { ...schema, control: parseLength(value) ? 'length' : 'number', preview: 'radius' };
  } else if (/shadow/.test(name)) {
    schema = { ...schema, control: 'text', preview: 'shadow' };
  } else if (/opacity/.test(name)) {
    schema = { ...schema, control: 'number', preview: 'opacity' };
  } else if (/space|gap|gutter|pad|width|height|size|container|leading|tracking|border-width|divider|offset|inset/.test(name) || parseLength(value)) {
    schema = { ...schema, control: 'length', preview: /leading/.test(name) ? 'line-height' : 'spacing' };
  } else if (/scale|threshold|bias|weight|z-/.test(name) || /^-?\d*\.?\d+$/.test(value)) {
    schema = { ...schema, control: 'number', preview: /weight/.test(name) ? 'font' : 'scale' };
  }

  return { ...schema, ...explicit, ...override };
}
