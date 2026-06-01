/**
 * Color swatches for the Bricks variable-picker dropdown.
 *
 * SLASHED color tokens are registered with Bricks' Variable Manager as
 * empty-valued variables (see includes/class-variables.php) so the
 * framework's adaptive `light-dark()` definitions in `:root` stay the
 * single source of truth and nothing the plugin injects competes with
 * them. The cost of that fidelity is that Bricks has no value to render
 * a colour swatch from in the variable picker — entries show as plain
 * text.
 *
 * This module paints the swatch back in, builder-side only, without ever
 * touching `:root`. Each `--sf-color-*` entry in the picker dropdown gets
 * a small coloured square using a server-resolved hex map (localised from
 * `Slashed_Bricks_Inventory::get_color_hex_map()`), because the builder
 * panel does not load the SLASHED stylesheet and so cannot resolve
 * `var(--sf-color-*)` itself.
 *
 * Design notes — mirrors the rest of the integration's philosophy:
 *
 *   - **Additive and fail-silent.** Bricks renders the list, names and
 *     the canvas hover-preview natively; we only prepend a swatch. If the
 *     markup ever changes or anything throws, you lose the square — never
 *     the picker.
 *
 *   - **Reconcile, don't stamp-once.** Bricks (Vue) reuses `<li>` nodes
 *     when the list is filtered via the search box, so a row that was
 *     "sf-color-action" can become "sf-color-primary" — or a non-colour
 *     variable — while keeping the same DOM node. Every pass recomputes
 *     each row's desired colour and adds / updates / removes its swatch
 *     accordingly, which is reuse-safe where a one-time marker would go
 *     stale.
 *
 *   - **Scoped to colour tokens only.** `resolveSwatchColor()` returns a
 *     colour only for `--sf-color-*` names present in the hex map, so the
 *     same observer is harmless in the spacing / typography pickers.
 *
 * @module color-swatches
 */

const ITEM_SELECTOR = 'li.variable-picker-item';
const SWATCH_CLASS = 'slashed-var-swatch';
const DEBOUNCE_MS = 50;

const log = (level, ...args) => console[level]('[slashed-swatches]', ...args);

/**
 * Resolve the swatch colour for a variable label, or null.
 *
 * Pure and DOM-free so it can be unit tested with `node --test`. Accepts
 * the variable name as shown in the picker (Bricks omits the leading
 * `--`, e.g. "sf-color-primary") and returns the resolved hex from the
 * map, or null when the name is not a single known `--sf-color-*` token.
 *
 * @param {string} rawName - e.g. "sf-color-primary" or "--sf-color-primary".
 * @param {Record<string, string>} hexMap - Map keyed by "--sf-color-*".
 * @returns {string | null}
 */
export function resolveSwatchColor(rawName, hexMap) {
  if (!rawName || !hexMap) return null;

  let name = String(rawName).trim();
  if (!name || /\s/.test(name)) return null;

  // The picker renders names without the leading `--`; normalise so the
  // lookup key matches the hex map (which is keyed by the full property).
  if (name.slice(0, 2) !== '--') name = '--' + name.replace(/^-+/, '');

  if (name.indexOf('--sf-color-') !== 0) return null;

  const hex = hexMap[name];
  return typeof hex === 'string' && hex ? hex : null;
}

// ----- DOM glue (only runs in the browser) ---------------------------

let _enabled = false;
let _hexMap = {};
let _observer = null;
let _debounce = null;
let _controller = null;

/**
 * Read the variable name a picker row represents.
 *
 * The row layout is:
 *   <li class="variable-picker-item">
 *     <span title="sf-color-primary">sf-color-primary</span>
 *     <span class="option-value"></span>
 *   </li>
 * The first span's `title` holds the canonical name; fall back to its
 * text, then the row text, so a minor markup shift still resolves.
 *
 * @param {Element} li
 * @returns {string}
 */
function itemName(li) {
  const span =
    li.querySelector(':scope > span[title]') || li.querySelector(':scope > span');
  if (span) {
    const title = span.getAttribute('title');
    if (title && title.trim()) return title.trim();
    return (span.textContent || '').trim();
  }
  return (li.textContent || '').trim();
}

/**
 * Add, update, or remove a single row's swatch to match its current
 * variable. Idempotent and safe to run on every pass.
 *
 * @param {Element} li
 */
function reconcile(li) {
  // Category / group headers (`.title`, `.category`) are not variables.
  if (li.classList.contains('title') || li.classList.contains('category')) {
    const stale = li.querySelector(':scope > .' + SWATCH_CLASS);
    if (stale) stale.remove();
    return;
  }

  const color = resolveSwatchColor(itemName(li), _hexMap);
  let swatch = li.querySelector(':scope > .' + SWATCH_CLASS);

  if (!color) {
    if (swatch) swatch.remove();
    return;
  }

  if (!swatch) {
    swatch = document.createElement('span');
    swatch.className = SWATCH_CLASS;
    swatch.setAttribute('aria-hidden', 'true');
    li.insertBefore(swatch, li.firstChild);
  }

  if (swatch.dataset.color !== color) {
    swatch.style.setProperty('--slashed-swatch-color', color);
    swatch.dataset.color = color;
  }
}

function runPass() {
  try {
    const items = document.querySelectorAll(ITEM_SELECTOR);
    for (const li of items) reconcile(li);
  } catch (err) {
    log('warn', 'swatch pass failed', err);
  }
}

function schedule() {
  if (_debounce !== null) return;
  _debounce = setTimeout(() => {
    _debounce = null;
    runPass();
  }, DEBOUNCE_MS);
}

/**
 * Initialise variable-picker swatches.
 *
 * Safe to call when disabled (no-ops) and idempotent (a second call
 * tears down the first). Pass an `AbortSignal` to have the observer
 * disconnected automatically when the host aborts, matching how the
 * reBEMer entry point manages its own lifecycle.
 *
 * @param {boolean} enabled
 * @param {Record<string, string>} hexMap - Map keyed by "--sf-color-*".
 * @param {{ signal?: AbortSignal }} [options]
 */
export function init(enabled, hexMap, options = {}) {
  destroy();

  _enabled = !!enabled;
  _hexMap = hexMap && typeof hexMap === 'object' ? hexMap : {};
  if (!_enabled || Object.keys(_hexMap).length === 0) return;

  _controller = new AbortController();

  // The picker dropdown is created, destroyed, and re-rendered (on search)
  // by Bricks, so a persistent observer that re-decorates on any DOM
  // churn is simpler and more robust than trying to hook open/close.
  // The callback only schedules a cheap debounced pass; our own swatch
  // insertions trigger at most one extra no-op pass before settling.
  _observer = new MutationObserver(schedule);
  _observer.observe(document.body, { childList: true, subtree: true });

  runPass();

  if (options.signal) {
    if (options.signal.aborted) destroy();
    else options.signal.addEventListener('abort', destroy, { once: true });
  }
}

/**
 * Tear down the observer and remove every swatch we injected.
 */
export function destroy() {
  if (_debounce !== null) {
    clearTimeout(_debounce);
    _debounce = null;
  }
  if (_observer) {
    _observer.disconnect();
    _observer = null;
  }
  if (_controller) {
    _controller.abort();
    _controller = null;
  }
  try {
    document.querySelectorAll('.' + SWATCH_CLASS).forEach((node) => node.remove());
  } catch {
    /* ignore */
  }
  _enabled = false;
  _hexMap = {};
}
