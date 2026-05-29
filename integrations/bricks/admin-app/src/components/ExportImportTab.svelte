<script>
  import { exportTokens, importTokens } from '../lib/api.js';

  // ── Export ────────────────────────────────────────────────────────────────
  let exporting = $state(false);
  let exportError = $state('');

  async function handleExport() {
    exporting = true;
    exportError = '';
    try {
      const data = await exportTokens();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slashed-tokens-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      exportError = e.message || 'Export failed';
    } finally {
      exporting = false;
    }
  }

  // ── Import ────────────────────────────────────────────────────────────────
  let fileInput = $state(null);
  let importing = $state(false);
  let importResult = $state('');
  let importError = $state('');
  let reloadCountdown = $state(0);

  async function handleImport() {
    const file = fileInput?.files?.[0];
    if (!file) return;
    importResult = '';
    importError = '';
    importing = true;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const result = await importTokens(data);
      const settingsNote = result.settings_imported ? ' Plugin settings restored.' : '';
      importResult = `Imported ${result.imported} section(s) successfully.${settingsNote}`;
      // Reload the page after a short delay so the SPA picks up the new
      // wp_options values — token state lives server-side and cannot be
      // patched into the Svelte store without a full re-bootstrap.
      reloadCountdown = 3;
      const tick = setInterval(() => {
        reloadCountdown -= 1;
        if (reloadCountdown <= 0) {
          clearInterval(tick);
          window.location.reload();
        }
      }, 1000);
    } catch (e) {
      importError = e.message || 'Import failed';
    } finally {
      importing = false;
      if (fileInput) fileInput.value = '';
    }
  }
</script>

<section>
  <h2>Export / Import Tokens</h2>
  <p class="hint">
    Export your current SLASHED token overrides (colors, typography, spacing, etc.) to a
    <code>.json</code> file and import them on any other WordPress site running this plugin.
    This makes Bricks templates fully portable — the template JSON carries structure and
    class references; this file carries the brand tokens that drive the visual result.
  </p>

  <div class="card">
    <h3>Export</h3>
    <p class="card-desc">
      Downloads a <code>.json</code> file containing all your active token overrides and plugin settings.
      Share this file alongside your Bricks template export so the visual result is identical on every site.
    </p>
    <div class="action-row">
      <button type="button" class="btn btn--primary" onclick={handleExport} disabled={exporting}>
        {exporting ? 'Exporting…' : 'Download token file'}
      </button>
      {#if exportError}
        <span class="status status--err">{exportError}</span>
      {/if}
    </div>
  </div>

  <div class="card">
    <h3>Import</h3>
    <p class="card-desc">
      Upload a <code>.json</code> file previously exported from this plugin. Each section is validated
      before saving. Unknown or malformed sections are skipped — existing settings are not touched
      unless the file provides a valid replacement.
    </p>
    <div class="action-row">
      <input
        type="file"
        accept=".json,application/json"
        bind:this={fileInput}
        class="file-input"
      />
      <button
        type="button"
        class="btn btn--secondary"
        onclick={handleImport}
        disabled={importing}
      >
        {importing ? 'Importing…' : 'Import token file'}
      </button>
    </div>
    {#if importResult}
      <p class="status status--ok">
        {importResult}
        {#if reloadCountdown > 0}
          Reloading in {reloadCountdown}…
        {/if}
      </p>
    {/if}
    {#if importError}
      <p class="status status--err">{importError}</p>
    {/if}
  </div>

  <div class="card card--info">
    <h3>Bricks template workflow — quick reference</h3>
    <ol class="steps">
      <li>
        <strong>Design using SLASHED tokens.</strong>
        In the Bricks color picker, always choose a swatch from the <em>SLASHED · …</em> palette groups
        (Primary, Secondary, Status, Semantic). Never type a hex value directly — that bakes a
        hardcoded color into the template JSON that won't follow your brand tokens.
      </li>
      <li>
        <strong>Use <code>var(--sf-*)</code> in custom CSS.</strong>
        Any inline CSS you write inside a Bricks element's CSS tab should reference framework
        variables (<code>var(--sf-color-primary)</code>, <code>var(--sf-space-4)</code>, etc.)
        rather than literal pixel or color values.
      </li>
      <li>
        <strong>Use <code>sf-*</code> layout classes.</strong>
        Apply layout primitives (<code>sf-cluster</code>, <code>sf-grid</code>, <code>sf-center</code>, …)
        via the Bricks class manager instead of manually setting gap / display / align values.
        These classes consume spacing tokens automatically.
      </li>
      <li>
        <strong>Export the Bricks template</strong> (Bricks → Templates → Export).
        The exported JSON holds element structure, class references, and CSS variable names — it is
        already portable as long as the target site has SLASHED loaded.
      </li>
      <li>
        <strong>Export SLASHED tokens</strong> using the "Download token file" button above.
        This captures your brand colors, typography settings, and all other overrides.
      </li>
      <li>
        <strong>On the target site:</strong> install and activate the SLASHED Bricks plugin,
        import the token file via this tab, then import the Bricks template via Bricks → Templates.
        The plugin re-registers all SLASHED classes, variables, and color palettes automatically.
      </li>
      <li>
        <strong>Verify</strong> in the Bricks builder canvas that colors, spacing, and fonts match.
        If something looks off, check the browser console for unresolved <code>var()</code> calls —
        this means the CSS bundle isn't loading or the token file wasn't imported yet.
      </li>
    </ol>
  </div>
</section>

<style>
  h2 { margin-top: 0; }
  .hint { color: #50575e; max-width: 720px; margin-bottom: 20px; }

  .card {
    border: 1px solid #c3c4c7;
    border-radius: 4px;
    padding: 16px 20px;
    margin-bottom: 16px;
  }
  .card--info { background: #f6f7f7; }
  .card h3 { margin: 0 0 6px; font-size: 14px; }
  .card-desc { color: #50575e; font-size: 13px; margin: 0 0 12px; max-width: 640px; }

  .action-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn--primary { background: #2271b1; color: white; }
  .btn--primary:hover:not(:disabled) { background: #135e96; }
  .btn--secondary { background: #f0f0f1; color: #2c3338; border: 1px solid #8c8f94; }
  .btn--secondary:hover:not(:disabled) { background: #e0e0e0; }

  .file-input { font-size: 13px; }

  .status { font-size: 13px; font-weight: 500; }
  .status--ok { color: #00a32a; }
  .status--err { color: #d63638; }

  .steps {
    margin: 8px 0 0;
    padding-left: 20px;
    font-size: 13px;
    line-height: 1.6;
    color: #2c3338;
  }
  .steps li { margin-bottom: 8px; }
  .steps li:last-child { margin-bottom: 0; }
  code { background: #f0f0f1; padding: 1px 4px; border-radius: 3px; font-size: 12px; }
</style>
