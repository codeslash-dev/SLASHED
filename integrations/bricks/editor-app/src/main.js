/**
 * reBEMer entry point — runs inside the Bricks builder main panel.
 *
 * Responsibilities:
 *   1. Probe the Bricks Vue app (with retries; Bricks mounts after our
 *      script in some load orders). Bail out silently on incompatible
 *      builds — the badge is never injected and no UI is shown.
 *   2. Watch the structure panel via a narrowly-scoped MutationObserver
 *      and inject one <BemBadge> per `li[data-id]`.
 *   3. Mount a single <BemPanel> on badge activation. Subsequent
 *      activations replace the existing panel.
 *   4. Tear everything down via a single AbortController on unload.
 *
 * Imperative on purpose: there is no Svelte App component above this
 * level because Bricks owns the structure-panel DOM and we have to
 * mount badges into elements Bricks controls. A single Svelte tree
 * couldn't follow Bricks' re-renders without fighting it.
 */
import { mount, unmount } from 'svelte';
import * as api from './lib/bricks-api.js';
import BemBadge from './components/BemBadge.svelte';
import BemPanel from './components/BemPanel.svelte';
import './styles/panel.css';

const STRUCTURE_PANEL_SELECTOR = '#bricks-structure';
const ITEM_SELECTOR = 'li[data-id]';
const HOST_ID = 'slashed-rebemer-host';
const ATTACHED_FLAG = 'rebemerAttached';
const PROBE_INTERVAL_MS = 400;
const PROBE_MAX_ATTEMPTS = 25; // ≈10s total grace before we give up

const log = (level, ...args) => console[level]('[reBEMer]', ...args);

const controller = new AbortController();
const { signal } = controller;

/** @type {Map<string, { instance: any, host: HTMLElement }>} */
const badgeInstances = new Map();

/** @type {{ instance: any, node: HTMLElement } | null} */
let activePanel = null;


function ensureHost() {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    document.body.appendChild(host);
  }
  return host;
}

function start() {
  let attempts = 0;
  const tryProbe = () => {
    if (signal.aborted) return;
    if (api.probe()) {
      onProbed();
      return;
    }
    if (++attempts >= PROBE_MAX_ATTEMPTS) {
      log('warn', 'Bricks Vue app not detected after grace window — reBEMer disabled on this page.');
      return;
    }
    setTimeout(tryProbe, PROBE_INTERVAL_MS);
  };
  tryProbe();
}

function onProbed() {
  // The structure panel may not be in the DOM yet on first paint;
  // observe body once for its arrival, then narrow to the panel.
  const existing = document.querySelector(STRUCTURE_PANEL_SELECTOR);
  if (existing) {
    onStructurePanelReady(existing);
    return;
  }

  const bodyObs = new MutationObserver(() => {
    const panelEl = document.querySelector(STRUCTURE_PANEL_SELECTOR);
    if (panelEl) {
      bodyObs.disconnect();
      onStructurePanelReady(panelEl);
    }
  });
  bodyObs.observe(document.body, { childList: true, subtree: true });
  signal.addEventListener('abort', () => bodyObs.disconnect(), { once: true });
}


function onStructurePanelReady(panelEl) {
  // Debounce churny mutation bursts (Bricks rebuilds the tree on
  // drag/drop, on import, on undo). 50 ms is enough to coalesce a
  // typical burst without feeling laggy.
  let debounceHandle = null;
  const schedule = () => {
    if (debounceHandle !== null) return;
    debounceHandle = setTimeout(() => {
      debounceHandle = null;
      refreshBadges(panelEl);
    }, 50);
  };

  const obs = new MutationObserver(schedule);
  obs.observe(panelEl, { childList: true, subtree: true });
  signal.addEventListener('abort', () => {
    obs.disconnect();
    if (debounceHandle !== null) clearTimeout(debounceHandle);
  }, { once: true });

  refreshBadges(panelEl);
}

function refreshBadges(panelEl) {
  // Mount any newly-arrived items.
  const items = panelEl.querySelectorAll(ITEM_SELECTOR);
  for (const li of items) {
    if (!li.dataset[ATTACHED_FLAG]) injectBadgeInto(li);
  }

  // Reap any badges whose host node has been detached. Bricks tends
  // to rebuild list nodes wholesale on undo; the dataset flag goes
  // away with the old node, so the badge just needs to be unmounted.
  for (const [id, entry] of badgeInstances) {
    if (!entry.host.isConnected) {
      try { unmount(entry.instance); } catch (err) { log('warn', 'badge unmount failed', err); }
      badgeInstances.delete(id);
    }
  }
}


function injectBadgeInto(li) {
  const elementId = li.getAttribute('data-id');
  if (!elementId) return;

  // Try the conventional Bricks container; fall back to the row
  // itself so the badge always renders even when Bricks restructures.
  const target =
    li.querySelector(':scope > .actions') ||
    li.querySelector(':scope > .structure-item-actions') ||
    li;

  const host = document.createElement('span');
  host.className = 'rebemer-badge-host';
  if (target.firstChild) {
    target.insertBefore(host, target.firstChild);
  } else {
    target.appendChild(host);
  }

  const labelNode = li.querySelector(':scope > .structure-item-title, :scope > .name, :scope .label');
  const label = labelNode ? labelNode.textContent.trim() : '';

  const instance = mount(BemBadge, {
    target: host,
    props: { elementId, label, onActivate: openPanel },
  });

  badgeInstances.set(elementId, { instance, host });
  li.dataset[ATTACHED_FLAG] = '1';
}

function openPanel(elementId) {
  closePanel();
  const node = document.createElement('div');
  ensureHost().appendChild(node);
  activePanel = {
    instance: mount(BemPanel, {
      target: node,
      props: { rootId: elementId, onClose: closePanel },
    }),
    node,
  };
}

function closePanel() {
  if (!activePanel) return;
  try { unmount(activePanel.instance); } catch (err) { log('warn', 'panel unmount failed', err); }
  activePanel.node.remove();
  activePanel = null;
}


window.addEventListener('beforeunload', () => {
  controller.abort();
  closePanel();
  for (const { instance } of badgeInstances.values()) {
    try { unmount(instance); } catch { /* ignore */ }
  }
  badgeInstances.clear();
}, { once: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
