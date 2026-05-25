<script>
  /**
   * Sticky footer bar with save / reset / status feedback.
   *
   * Keeps the user oriented: the dirty flag is reflected in the bar's
   * accent color, save spins a "Saving..." state, and a transient
   * "Saved" pill appears for two seconds after success. Replaces the
   * hard page reload on form POST in the legacy admin page.
   */
  import { tokens, ui, meta, clearSection } from '../lib/stores.svelte.js';
  import * as api from '../lib/api.js';

  async function save() {
    if (ui.saving) return;
    ui.saving = true;
    ui.error = '';
    try {
      const section = ui.activeTab;
      const values = tokens[section] ?? {};
      const res = await api.saveSection(section, values);
      if (res && res.values) {
        // Prefer the server-sanitized values so dev/UI state matches DB.
        tokens[section] = res.values;
      }
      ui.dirty = false;
      ui.lastSavedAt = Date.now();
    } catch (err) {
      ui.error = (err && err.message) || String(err);
    } finally {
      ui.saving = false;
    }
  }

  async function reset() {
    if (ui.saving) return;
    if (!confirm(`Reset the ${meta.tabs[ui.activeTab] ?? ui.activeTab} tab to defaults?`)) return;
    ui.saving = true;
    ui.error = '';
    try {
      await api.resetSection(ui.activeTab);
      clearSection(ui.activeTab);
      ui.dirty = false;
      ui.lastSavedAt = Date.now();
    } catch (err) {
      ui.error = (err && err.message) || String(err);
    } finally {
      ui.saving = false;
    }
  }

  // "Saved" pill auto-fades after 2 seconds.
  let showSaved = $state(false);
  $effect(() => {
    if (ui.lastSavedAt) {
      showSaved = true;
      const t = setTimeout(() => (showSaved = false), 2000);
      return () => clearTimeout(t);
    }
  });
</script>

<div class="bar" class:dirty={ui.dirty}>
  <div class="bar__status">
    {#if ui.error}
      <span class="bar__error">{ui.error}</span>
    {:else if ui.saving}
      <span class="bar__pending">Saving…</span>
    {:else if showSaved}
      <span class="bar__saved">Saved</span>
    {:else if ui.dirty}
      <span class="bar__dirty">Unsaved changes</span>
    {:else}
      <span class="bar__clean">All changes saved</span>
    {/if}
  </div>
  <div class="bar__actions">
    <button type="button" class="bar__reset" onclick={reset} disabled={ui.saving}>
      Reset section
    </button>
    <button
      type="button"
      class="bar__save"
      onclick={save}
      disabled={ui.saving || !ui.dirty}
    >
      {ui.saving ? 'Saving…' : 'Save changes'}
    </button>
  </div>
</div>

<style>
  .bar {
    position: fixed;
    bottom: 0;
    left: 160px; /* clear of the WP admin sidebar */
    right: 0;
    background: white;
    border-top: 2px solid #c3c4c7;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    z-index: 100;
    transition: border-color 150ms;
  }
  .bar.dirty { border-top-color: #2271b1; }

  .bar__status { font-size: 13px; }
  .bar__dirty   { color: #2271b1; font-weight: 500; }
  .bar__pending { color: #50575e; }
  .bar__saved   { color: #00a32a; font-weight: 500; }
  .bar__clean   { color: #50575e; }
  .bar__error   { color: #d63638; font-weight: 500; }

  .bar__actions { display: flex; gap: 8px; }
  .bar__save, .bar__reset {
    padding: 6px 14px;
    border-radius: 3px;
    border: 1px solid #2271b1;
    background: white;
    color: #2271b1;
    cursor: pointer;
    font-size: 13px;
  }
  .bar__save {
    background: #2271b1;
    color: white;
  }
  .bar__save:disabled, .bar__reset:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .bar__reset {
    border-color: #d63638;
    color: #d63638;
  }

  /* Collapse the sidebar offset on small screens (folded WP admin). */
  @media (max-width: 782px) {
    .bar { left: 0; }
  }
</style>
