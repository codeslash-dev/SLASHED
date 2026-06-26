export const STORAGE_KEY = 'slashed-studio/overrides/v2';

export function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  return errors;
}

export async function gotoClean(page, url = '/') {
  await page.goto(url);
  await page.evaluate(() => {
    localStorage.clear();
    window.location.hash = '';
  });
  await page.reload();
}

export async function readOverrides(page) {
  return page.evaluate(key => {
    try { return JSON.parse(localStorage.getItem(key) ?? '{}'); }
    catch { return {}; }
  }, STORAGE_KEY);
}

/** Click a sidebar nav button by its title attribute. */
export function navButton(page, label) {
  return page.getByTitle(label).first();
}
