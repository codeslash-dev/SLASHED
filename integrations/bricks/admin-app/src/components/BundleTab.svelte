<script>
  import { meta } from '../lib/stores.svelte.js';
  import { saveSettings } from '../lib/api.js';

  let bundle          = $state(meta.pluginSettings?.css_bundle ?? 'optimal');
  let fontSize        = $state(meta.pluginSettings?.html_font_size ?? '');
  let showClassHints  = $state(meta.pluginSettings?.show_class_hints ?? false);
  let saving = $state(false);
  let saved = $state(false);
  let error = $state('');
  let savedTimer = null;

  async function handleSave() {
    saving = true;
    saved = false;
    error = '';
    try {
      await saveSettings({ css_bundle: bundle, html_font_size: fontSize, show_class_hints: showClassHints });
      saved = true;
      if (savedTimer) clearTimeout(savedTimer);
      savedTimer = setTimeout(() => { saved = false; savedTimer = null; }, 3000);
    } catch (e) {
      error = e.message || 'Save failed';
    } finally {
      saving = false;
    }
  }
</script>

<section>
  <h2>Bundle Info</h2>
  <p class="hint">
    The SLASHED CSS bundle is loaded automatically by the plugin. The inventory
    is parsed from whichever bundle is active (essential / optimal / full) and
    drives the variable pickers, class autocomplete, and color palette in Bricks.
  </p>
  <dl class="info">
    <dt>Variables registered</dt>
    <dd>{meta.inventory?.variables?.length ?? 0}</dd>
    <dt>Classes registered</dt>
    <dd>{(meta.inventory?.sf_classes?.length ?? 0) + (meta.inventory?.is_classes?.length ?? 0)}</dd>
  </dl>

  <h2 class="settings-heading">Plugin Settings</h2>

  <div class="setting-row">
    <label for="css-bundle">CSS Bundle</label>
    <select id="css-bundle" bind:value={bundle}>
      <option value="essential">Essential — base variables only</option>
      <option value="optimal">Optimal — variables + core utilities (default)</option>
      <option value="full">Full — all utilities included</option>
    </select>
    <p class="description">
      Choose which SLASHED CSS bundle to load on the frontend and in the Bricks editor canvas.
    </p>
  </div>

  <div class="setting-row">
    <label for="html-font-size">HTML Font Size</label>
    <select id="html-font-size" bind:value={fontSize}>
      <option value="">Default (don't override)</option>
      <option value="100">Force 100%</option>
      <option value="62.5">Force 62.5%</option>
    </select>
    <p class="description">
      Override the HTML root font-size. Use this if Bricks forces a font-size you don't want.
    </p>
  </div>

  <div class="field-row">
    <label class="toggle-label" for="show-class-hints">
      <input
        id="show-class-hints"
        type="checkbox"
        bind:checked={showClassHints}
      />
      Show class hints in Bricks editor
    </label>
    <p class="description">
      When enabled, hovering a SLASHED class in the Bricks class manager shows a short
      description of what it does. Powered by <code>data/classes-hints.json</code>.
    </p>
  </div>

  <div class="save-row">
    <button
      type="button"
      class="save-btn"
      onclick={handleSave}
      disabled={saving}
    >
      {saving ? 'Saving...' : 'Save Settings'}
    </button>
    {#if saved}
      <span class="status status--ok">Saved</span>
    {/if}
    {#if error}
      <span class="status status--err">{error}</span>
    {/if}
  </div>
</section>

<style>
  h2 { margin-top: 0; }
  .settings-heading { margin-top: 24px; }
  .hint { color: #50575e; margin-bottom: 16px; max-width: 720px; }

  .info {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4px 16px;
    margin-bottom: 24px;
    font-size: 14px;
  }
  .info dt { font-weight: 500; }
  .info dd { margin: 0; color: #50575e; }

  .setting-row {
    margin-bottom: 20px;
  }
  .setting-row label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
  }
  .setting-row select {
    padding: 6px 10px;
    border: 1px solid #8c8f94;
    border-radius: 4px;
    font-size: 14px;
  }
  .description {
    color: #50575e;
    font-size: 13px;
    margin-top: 6px;
  }

  .save-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
  }
  .save-btn {
    background: #2271b1;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }
  .save-btn:hover { background: #135e96; }
  .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .status {
    font-size: 13px;
    font-weight: 500;
  }
  .status--ok { color: #00a32a; }
  .status--err { color: #d63638; }
</style>
