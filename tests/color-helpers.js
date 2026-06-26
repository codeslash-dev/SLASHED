// Browser-serializable WCAG colour helpers.
// These functions are passed to page.evaluate() — they must be self-contained
// (no imports, no closures over Node.js variables). Playwright serialises each
// function via .toString() before sending it to the browser context.

// Returns WCAG relative luminance for one CSS custom property token.
// Usage: page.evaluate(resolveTokenLuminance, '--sf-color-bg')
export function resolveTokenLuminance(tok) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const el = document.createElement('div'); el.style.backgroundColor = `var(${tok})`;
  document.body.appendChild(el);
  ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = '#000';
  ctx.fillStyle = getComputedStyle(el).backgroundColor; el.remove();
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

// Returns WCAG contrast ratio between two CSS custom property tokens.
// Accepts a two-element array [token1, token2] — page.evaluate only allows one argument.
// Usage: page.evaluate(contrastBetween, ['--sf-color-text', '--sf-color-bg'])
export function contrastBetween([token1, token2]) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const toLum = color => {
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const resolve = tok => {
    const el = document.createElement('div'); el.style.backgroundColor = `var(${tok})`;
    document.body.appendChild(el); const c = getComputedStyle(el).backgroundColor; el.remove(); return c;
  };
  const a = toLum(resolve(token1));
  const b = toLum(resolve(token2));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
