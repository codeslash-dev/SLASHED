<script>
  /**
   * Placeholder shown for tabs that haven't been ported to Svelte yet.
   * Real production code would render the typography / spacing /
   * radius / shadows / motion / zindex tabs the same way as ColorTab.
   * Kept as a stub here to keep the POC focused on the most JS-heavy
   * tab (Colors) without conflating concerns.
   */
  let { tab } = $props();
</script>

<div class="stub">
  <h2>{tab}</h2>
  <p class="muted">
    Not ported yet. The legacy admin page (<code>SLASHED → SLASHED</code>)
    still handles every tab; this v2 page only fully implements the
    Colors tab to demonstrate the Svelte data flow.
  </p>
  <p class="muted">
    Porting another tab follows the same pattern: a single
    <code>{`<TabName>Tab.svelte`}</code> component reading its
    section from <code>tokens</code> and writing back via
    <code>markDirty()</code>.
  </p>
</div>

<style>
  .stub h2 { margin-top: 0; }
  .muted  { color: #50575e; }
  code    {
    background: #f0f0f1;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 90%;
  }
</style>
