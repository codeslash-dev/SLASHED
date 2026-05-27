/**
 * In-panel undo ring buffer.
 *
 * Holds up to MAX snapshots produced by applyPlan(). The buffer is
 * in-memory and panel-scoped — it resets when the builder reloads
 * and never persists. The reBEMer panel reads pop() on Cmd/Ctrl-Z.
 *
 * No redo in v1: a popped snapshot is discarded after restore.
 *
 * @module undo
 */

const MAX = 5;

let buffer = [];

/**
 * Push a snapshot onto the buffer. Oldest snapshots are evicted when
 * the buffer reaches MAX entries.
 *
 * @param {object} snapshot
 */
export function push(snapshot) {
  if (!snapshot) return;
  buffer.push(snapshot);
  while (buffer.length > MAX) buffer.shift();
}

/**
 * Pop the most recent snapshot, or null if the buffer is empty.
 * @returns {object|null}
 */
export function pop() {
  return buffer.length === 0 ? null : buffer.pop();
}

/** Wipe the buffer. Used on builder unload and on panel reset. */
export function clear() {
  buffer = [];
}

/** @returns {number} */
export function size() {
  return buffer.length;
}
