/**
 * Class documentation hints for the Bricks builder.
 *
 * When the "Show class hints" plugin setting is enabled, hovering a
 * SLASHED class name inside the Bricks UI (the element's CSS-class list
 * in the settings panel, the class autocomplete dropdown, or the global
 * class manager) shows a small styled tooltip describing what the class
 * does, plus its category.
 *
 * Design notes — why this looks the way it does:
 *
 *   - **Scoped, not body-wide.** A single delegated `mouseover` listener
 *     is cheap, but acting on *every* hovered node on the page is not:
 *     it risks tagging unrelated text and fighting Bricks' own DOM. We
 *     only react when the hovered node sits inside a known Bricks panel
 *     container (see `BRICKS_CONTAINERS`) and never inside our own
 *     reBEMer host.
 *
 *   - **Exact match on a known key only.** `resolveClassName()` rejects
 *     anything that isn't a single `sf-*` / `is-*` token present in the
 *     hint map. Because container rows carry lots of text, multi-word
 *     `textContent` is rejected outright — so climbing a few ancestors
 *     to find the label wrapper can't accidentally match a big row.
 *
 *   - **Styled tooltip, not the native `title` attribute.** `title` is
 *     slow to appear, unstyled, and mutating Bricks' nodes is invasive.
 *     We render our own element into the reBEMer host so it inherits the
 *     panel theme and never touches Bricks' DOM.
 *
 *   - **Graceful degradation.** If Bricks restructures and none of the
 *     known containers exist, the feature simply does nothing — matching
 *     the rest of the integration's "bail out silently" philosophy.
 *
 * @module class-hints
 */

const HOST_ID = 'slashed-rebemer-host';
const TOOLTIP_ID = 'slashed-class-hint';

// Containers inside which a hovered class name is worth a tooltip. The
// element settings panel (`#bricks-panel`) holds the per-element class
// list and the class autocomplete; the global class manager renders its
// own popup. Listed defensively — extras cost nothing and missing ones
// just mean no hint in that region.
const BRICKS_CONTAINERS = [
  '#bricks-panel',
  '.bricks-class-manager',
  '#bricks-class-manager',
  '[data-control="cssClasses"]',
];

// How many ancestors to climb from the hovered node looking for the
// element that wholly represents a single class label. Bricks wraps the
// class text in a span/li; the pointer often lands on that text node's
// element directly, occasionally on a child glyph. Three is plenty.
const MAX_CLIMB = 3;

/**
 * Resolve a raw text string to a hint, or null.
 *
 * Pure and DOM-free so it can be unit tested with `node --test`.
 * Accepts the visible label of a class (with or without a leading dot),
 * and returns the matching hint enriched with the resolved `name`, or
 * `null` when the text is not a single known `sf-*` / `is-*` class.
 *
 * @param {string} raw - Candidate text (e.g. ".sf-stack" or "sf-stack").
 * @param {Record<string, {description: string, category: string}>} hints
 * @returns {{ name: string, description: string, category: string } | null}
 */
export function resolveClassName(raw, hints) {
  if (!raw || !hints) return null;

  let token = String(raw).trim();
  if (!token) return null;

  // A single class label has no internal whitespace. Rejecting
  // multi-token strings is what keeps us from matching whole rows.
  if (/\s/.test(token)) return null;

  // Strip a single leading dot (class lists sometimes render ".sf-x").
  if (token[0] === '.') token = token.slice(1);

  if (!token.startsWith('sf-') && !token.startsWith('is-')) return null;

  if (!Object.prototype.hasOwnProperty.call(hints, token)) return null;

  const hint = hints[token];
  if (!hint || typeof hint.description !== 'string') return null;

  return { name: token, description: hint.description, category: hint.category };
}

// ----- DOM glue (only runs in the browser) ---------------------------

let _enabled = false;
let _hints = {};
let _tooltip = null;
let _controller = null;
let _currentTarget = null;

function ensureTooltip() {
  if (_tooltip && _tooltip.isConnected) return _tooltip;

  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    document.body.appendChild(host);
  }

  const el = document.createElement('div');
  el.id = TOOLTIP_ID;
  el.className = 'rebemer-class-hint';
  el.setAttribute('role', 'tooltip');
  el.hidden = true;
  el.innerHTML =
    '<code class="rebemer-class-hint__name"></code>' +
    '<span class="rebemer-class-hint__cat"></span>' +
    '<p class="rebemer-class-hint__desc"></p>';
  host.appendChild(el);

  _tooltip = el;
  return el;
}

/**
 * Walk up from the hovered node to find the element that represents a
 * single known class, returning `{ el, hint }` or null.
 *
 * @param {Element|null} start
 * @returns {{ el: Element, hint: { name: string, description: string, category: string } } | null}
 */
function findHintTarget(start) {
  let el = start;
  for (let depth = 0; el && depth < MAX_CLIMB; depth++) {
    if (el.nodeType === 1) {
      const hint = resolveClassName(el.textContent, _hints);
      if (hint) return { el, hint };
    }
    el = el.parentElement;
  }
  return null;
}

function position(el, target) {
  const r = target.getBoundingClientRect();
  // Measure after making it visible-but-transparent so width/height read.
  const tw = el.offsetWidth;
  const th = el.offsetHeight;
  const gap = 8;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  // Prefer below the target; flip above if it would overflow the viewport.
  let top = r.bottom + gap;
  if (top + th > vh && r.top - gap - th >= 0) top = r.top - gap - th;

  // Left-align to the target, clamped into the viewport.
  let left = r.left;
  if (left + tw > vw - 4) left = Math.max(4, vw - 4 - tw);
  if (left < 4) left = 4;

  el.style.top = `${Math.round(top)}px`;
  el.style.left = `${Math.round(left)}px`;
}

function show(target, hint) {
  const el = ensureTooltip();
  el.querySelector('.rebemer-class-hint__name').textContent = `.${hint.name}`;
  const cat = el.querySelector('.rebemer-class-hint__cat');
  cat.textContent = hint.category || '';
  cat.hidden = !hint.category;
  el.querySelector('.rebemer-class-hint__desc').textContent = hint.description;

  el.hidden = false;
  position(el, target);
  _currentTarget = target;
}

function hide() {
  if (_tooltip) _tooltip.hidden = true;
  _currentTarget = null;
}

function onMouseOver(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  // Never react to our own UI.
  if (target.closest(`#${HOST_ID}`)) return;

  // Only inside known Bricks panel regions.
  if (!target.closest(BRICKS_CONTAINERS.join(','))) {
    if (_currentTarget) hide();
    return;
  }

  const match = findHintTarget(target);
  if (!match) {
    if (_currentTarget) hide();
    return;
  }
  if (match.el === _currentTarget) return; // already showing for this node
  show(match.el, match.hint);
}

function onMouseOut(event) {
  if (!_currentTarget) return;
  // Hide only when the pointer truly leaves the labelled element.
  const to = event.relatedTarget;
  if (to instanceof Node && _currentTarget.contains(to)) return;
  hide();
}

// Mirror the hover handlers for keyboard users: a class label focused
// via Tab gets the same tooltip a mouse hover would surface.
function onFocusIn(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (target.closest(`#${HOST_ID}`)) return;
  if (!target.closest(BRICKS_CONTAINERS.join(','))) {
    if (_currentTarget) hide();
    return;
  }
  const match = findHintTarget(target);
  if (!match) {
    if (_currentTarget) hide();
    return;
  }
  if (match.el === _currentTarget) return;
  show(match.el, match.hint);
}

function onFocusOut(event) {
  if (!_currentTarget) return;
  const to = event.relatedTarget;
  if (to instanceof Node && _currentTarget.contains(to)) return;
  hide();
}

function onKeyDown(event) {
  if (event.key === 'Escape') hide();
}

/**
 * Initialise class hints.
 *
 * Safe to call when disabled (no-ops) and idempotent (a second call
 * tears down the first). Pass an `AbortSignal` to have the listeners
 * removed automatically when the host aborts, matching how the reBEMer
 * entry point manages its own lifecycle.
 *
 * @param {boolean} enabled
 * @param {Record<string, {description: string, category: string}>} hints
 * @param {{ signal?: AbortSignal }} [options]
 */
export function init(enabled, hints, options = {}) {
  destroy();

  _enabled = !!enabled;
  _hints = hints && typeof hints === 'object' ? hints : {};
  if (!_enabled || Object.keys(_hints).length === 0) return;

  _controller = new AbortController();
  const { signal } = _controller;
  const opts = { passive: true, signal };

  document.addEventListener('mouseover', onMouseOver, opts);
  document.addEventListener('mouseout', onMouseOut, opts);
  document.addEventListener('focusin', onFocusIn, opts);
  document.addEventListener('focusout', onFocusOut, opts);
  document.addEventListener('keydown', onKeyDown, opts);
  // The tooltip is anchored to a fixed viewport position; hide it on
  // scroll rather than chase a moving target.
  window.addEventListener('scroll', hide, { capture: true, passive: true, signal });

  if (options.signal) {
    if (options.signal.aborted) destroy();
    else options.signal.addEventListener('abort', destroy, { once: true });
  }
}

/**
 * Tear down listeners and remove the tooltip element.
 */
export function destroy() {
  if (_controller) {
    _controller.abort();
    _controller = null;
  }
  if (_tooltip) {
    _tooltip.remove();
    _tooltip = null;
  }
  _currentTarget = null;
  _enabled = false;
  _hints = {};
}
