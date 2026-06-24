import { parseLength } from './length.js';

const EXPLICIT = {
  '--sf-heading-text-wrap': { control: 'select', preview: 'wrap', options: ['balance', 'pretty', 'wrap', 'normal'], label: 'Heading wrap' },
  '--sf-scrim-direction': { control: 'select', preview: 'gradient', options: ['to top', 'to bottom', 'to right', 'to left', '135deg'], label: 'Scrim direction' },
};

function titleFromName(name = '') {
  return name.replace(/^--sf-/, '').replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function controlForToken(token, override = {}) {
  const name = token?.name ?? '';
  const explicit = EXPLICIT[name] ?? {};
  const value = token?.value ?? '';
  let schema = { label: titleFromName(name), description: token?.note || token?.description || '', control: 'text', preview: 'text' };

  if (/color|palette|hsl|oklch|hex|focus|link|caret|border/.test(name) && /(#[0-9a-f]|oklch|oklab|hsl|rgb|var\(--sf-color)/i.test(value + name)) {
    schema = { ...schema, control: 'color', preview: 'color' };
  } else if (/font/.test(name)) {
    schema = { ...schema, control: 'font', preview: 'font' };
  } else if (/duration|motion-scale/.test(name)) {
    schema = { ...schema, control: 'length', preview: 'motion' };
  } else if (/ease/.test(name)) {
    schema = { ...schema, control: 'select', preview: 'motion', options: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(.2,.8,.2,1)'] };
  } else if (/radius/.test(name)) {
    schema = { ...schema, control: 'length', preview: 'radius' };
  } else if (/shadow/.test(name)) {
    schema = { ...schema, control: 'text', preview: 'shadow' };
  } else if (/space|gap|gutter|pad|width|height|size|container|leading|tracking|border-width|divider/.test(name) || parseLength(value)) {
    schema = { ...schema, control: 'length', preview: /leading/.test(name) ? 'line-height' : 'spacing' };
  } else if (/scale|opacity|threshold|bias|weight|z-/.test(name) || /^-?\d*\.?\d+$/.test(value)) {
    schema = { ...schema, control: 'number', preview: /opacity/.test(name) ? 'opacity' : 'scale' };
  }

  return { ...schema, ...explicit, ...override };
}
