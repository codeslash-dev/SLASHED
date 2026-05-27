/**
 * Class-id generation.
 *
 * Uses crypto.randomUUID with collision retry against an existing-id
 * Set. The `uuidSource` parameter is a test seam: tests inject a
 * deterministic generator to exercise the collision branch.
 *
 * Why 8 hex chars: matches Bricks' own class-id length convention so
 * generated ids look at home in the Bricks Global Class Manager.
 *
 * @module ids
 */

/**
 * Default UUID source. Falls back through:
 *   1. crypto.randomUUID()      — every browser since 2022, Node 19+
 *   2. crypto.getRandomValues() — older browsers, Node 17+
 *   3. Math.random()            — last-resort. Not crypto-grade but
 *      sufficient given the 16-attempt collision retry below.
 * @returns {string}
 */
export function getRandomUUID() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  if (c && typeof c.getRandomValues === 'function') {
    const b = new Uint8Array(16);
    c.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = (n) => n.toString(16).padStart(2, '0');
    const hex = Array.from(b, h).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  let out = '';
  for (let i = 0; i < 32; i++) out += Math.floor(Math.random() * 16).toString(16);
  return `${out.slice(0, 8)}-${out.slice(8, 12)}-${out.slice(12, 16)}-${out.slice(16, 20)}-${out.slice(20)}`;
}

/**
 * Generate a fresh 8-char class id that does not collide with any id
 * in `existingIds`. Throws after 16 attempts.
 *
 * @param {Iterable<string>|Set<string>|null|undefined} existingIds
 * @param {() => string} [uuidSource]
 * @returns {string}
 */
export function newClassId(existingIds, uuidSource = getRandomUUID) {
  const set = existingIds instanceof Set ? existingIds : new Set(existingIds || []);
  for (let attempt = 0; attempt < 16; attempt++) {
    const id = uuidSource().replace(/-/g, '').slice(0, 8);
    if (id.length === 8 && !set.has(id)) return id;
  }
  throw new Error('rebemer:id_collision_exhausted');
}
