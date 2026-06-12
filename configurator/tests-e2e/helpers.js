/**
 * Shared helpers for the e2e suite.
 *
 * Every spec arms the error collectors — a page error or console.error
 * anywhere during a scenario is itself a failure, independent of the
 * scenario's own assertions.
 */
export const STORAGE_KEY = 'slashed-configurator/overrides/v1';

/** Attach pageerror/console-error collectors; returns the (live) array. */
export function watchErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  return errors;
}

/** Navigate to the app with a clean localStorage slate. */
export async function gotoClean(page, url = '/') {
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

/** Click a sidebar destination by its visible label. */
export function sideItem(page, label) {
  return page.locator('.side__item', { hasText: label }).first();
}

/** Parse the persisted override map (empty object when unset/corrupt). */
export async function readOverrides(page) {
  return page.evaluate((key) => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '{}');
    } catch {
      return {};
    }
  }, STORAGE_KEY);
}

/**
 * Canonical JSON snapshot (sorted keys) — byte-for-byte comparisons of the
 * override map must not depend on key insertion order.
 * @param {Record<string, string>} obj
 */
export function stableSnapshot(obj) {
  return JSON.stringify(
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
  );
}
