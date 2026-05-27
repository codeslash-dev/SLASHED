<script>
  /**
   * Confirmation modal shown when preflight reports any old class on
   * the subtree is still in use OUTSIDE this subtree. The user is
   * informed the operation only detaches from the current subtree —
   * the class itself stays alive globally.
   */
  /**
   * @type {{
   *   warnings: Array<{ className: string, outsideOnPage: number, otherPosts: number }>,
   *   onConfirm: () => void,
   *   onCancel:  () => void,
   * }}
   */
  let { warnings, onConfirm, onCancel } = $props();

  // Trap focus on the primary action when the dialog mounts.
  let confirmEl = $state(null);
  $effect(() => { confirmEl?.focus(); });
</script>

<div class="rebemer-confirm-backdrop" onclick={onCancel} role="presentation">
  <div
    class="rebemer-confirm"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="rebemer-confirm-title"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Escape' && onCancel?.()}
  >
    <h3 id="rebemer-confirm-title">Old classes still in use elsewhere</h3>
    <p>
      reBEMer will only detach these classes from the current subtree.
      The class itself will remain on every other element below.
    </p>
    <ul class="rebemer-confirm-list">
      {#each warnings as w (w.className)}
        <li>
          <code>{w.className}</code>
          <span>
            {w.outsideOnPage > 0 ? `${w.outsideOnPage} on this page` : ''}
            {w.outsideOnPage > 0 && w.otherPosts > 0 ? ' · ' : ''}
            {w.otherPosts > 0 ? `${w.otherPosts} on other posts` : ''}
          </span>
        </li>
      {/each}
    </ul>
    <div class="rebemer-confirm-actions">
      <button type="button" class="rebemer-btn" onclick={onCancel}>Cancel</button>
      <button type="button" class="rebemer-btn rebemer-btn--primary" bind:this={confirmEl} onclick={onConfirm}>Proceed</button>
    </div>
  </div>
</div>
