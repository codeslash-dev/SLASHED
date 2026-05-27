<script>
  /**
   * The "BEM" badge injected per structure-panel item.
   *
   * Real <button> with aria-label and explicit type="button" so it
   * never accidentally submits a form Bricks happens to host. Both
   * click and keyboard activation route through onActivate.
   */
  /** @type {{ elementId: string, label?: string, onActivate?: (id: string) => void }} */
  let { elementId, label, onActivate } = $props();

  function activate(event) {
    event.stopPropagation();
    event.preventDefault();
    onActivate?.(elementId);
  }
</script>

<button
  type="button"
  class="rebemer-badge"
  title={label ? `reBEMer: ${label}` : 'reBEMer'}
  aria-label={label ? `Open reBEMer for ${label}` : 'Open reBEMer'}
  onclick={activate}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && activate(e)}
>BEM</button>
