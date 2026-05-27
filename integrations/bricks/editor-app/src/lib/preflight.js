/**
 * REST preflight client.
 *
 * Sends the proposed plan to /wp-json/slashed-bricks/v1/rebemer/preflight
 * and shapes the response into UI-ready warnings.
 *
 * Stub for task #3. Implementation lands in task #5/#9.
 *
 * @module preflight
 */

/* eslint-disable no-unused-vars */

/**
 * @typedef {Object} PreflightResult
 * @property {Object<string, {name:string, outsideSubtreeOnPage:number, otherPosts:number}>} referenceCounts
 * @property {Array<{finalClassName:string, existingClassId:string, match:'byName'}>} nameCollisions
 * @property {Array<{finalClassName:string, reason:string}>} reservedHits
 */

/**
 * @param {import('./plan.js').Plan} plan
 * @param {{rest:{url:string, nonce:string}, currentPostId:number}} env
 * @returns {Promise<PreflightResult>}
 */
export async function fetchPreflight(plan, env) {
  return { referenceCounts: {}, nameCollisions: [], reservedHits: [] };
}
