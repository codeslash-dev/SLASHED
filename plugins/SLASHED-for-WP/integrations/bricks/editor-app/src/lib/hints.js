/**
 * Class hints for the Bricks Class Manager.
 *
 * When enabled, hovering over a SLASHED class in the Bricks class manager
 * (or element class input) shows a short description of what it does.
 *
 * This module uses a delegated mouseover listener on the body to detect
 * when a class item is hovered, avoiding the need to track individual
 * DOM elements created by Bricks' Vue app.
 */

/** @type {Object<string, {description: string, category: string}>} */
let hints = {};
let enabled = false;

/**
 * Initialize class hints.
 *
 * @param {boolean} isEnabled - Whether hints are enabled in plugin settings.
 * @param {Object} hintsMap - Map of class names to descriptions.
 */
export function init(isEnabled, hintsMap) {
  enabled = isEnabled;
  hints = hintsMap || {};

  if (!enabled) return;

  // We use a delegated listener on the document body because Bricks' panels
  // are often removed and recreated in the DOM.
  document.body.addEventListener('mouseover', handleMouseOver, { passive: true });
}

/**
 * Clean up class hints.
 */
export function destroy() {
  if (!enabled) return;
  document.body.removeEventListener('mouseover', handleMouseOver);
  enabled = false;
  hints = {};
}

/**
 * Delegated mouseover handler.
 *
 * @param {MouseEvent} event
 */
function handleMouseOver(event) {
  if (!enabled) return;

  const target = /** @type {HTMLElement} */ (event.target);
  if (!target) return;

  const className = findClassName(target);
  if (!className) return;

  // Use Object.prototype.hasOwnProperty.call for safer lookup
  if (!Object.prototype.hasOwnProperty.call(hints, className)) return;

  const hint = hints[className];
  if (!hint) return;

  // If we found a hint, set it as the title attribute.
  // We update it even if it already has a title, in case the element
  // is reused by Vue for a different class (though Bricks usually
  // recreates these nodes).
  if (target.getAttribute('title') !== hint.description) {
    target.setAttribute('title', hint.description);
  }
}

/**
 * Attempt to extract a class name from a hovered element.
 *
 * @param {HTMLElement} el
 * @returns {string|null}
 */
function findClassName(el) {
  // Strategy A: Direct text match (most common for Bricks Class Manager items)
  let text = el.textContent?.trim() || '';

  // Remove leading dot if present (e.g. ".sf-stack")
  if (text.startsWith('.')) {
    text = text.slice(1);
  }

  if (text.startsWith('sf-') || text.startsWith('is-')) {
    if (Object.prototype.hasOwnProperty.call(hints, text)) return text;
  }

  // Strategy B: Check if we're hovering a child of a class item
  // Bricks UI often wraps the name in a span or div.
  if (el.parentElement) {
    let parentText = el.parentElement.textContent?.trim() || '';
    if (parentText.startsWith('.')) parentText = parentText.slice(1);
    if ((parentText.startsWith('sf-') || parentText.startsWith('is-')) &&
        Object.prototype.hasOwnProperty.call(hints, parentText)) {
      return parentText;
    }
  }

  return null;
}
