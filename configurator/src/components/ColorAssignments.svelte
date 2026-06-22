<script>
  /**
   * Semantic color role swatch grid.
   *
   * Shows how the current brand choices surface through the framework's
   * semantic consumption tokens (body bg, text, border, link, …). Each swatch
   * is resolved via the hidden probe host so var(), light-dark(), and
   * oklch(from …) all compute correctly against the active overrides.
   *
   * Reactive: re-measures whenever overrides or the preview theme change.
   */
  import { overrides, ui } from '../lib/store.svelte.js';
  import { measureBackground } from '../lib/probeHost.js';
  import { COLOR_ROLE_GROUPS, ALL_ROLE_TOKENS } from '../lib/colorRoles.js';

  /** @type {Record<string, string>} token → resolved rgb() string */
  let resolved = $state({});

  $effect(() => {
    void overrides;         // reactive dep
    void ui.previewTheme;   // reactive dep
    queueMicrotask(() => {
      const next = {};
      for (const token of ALL_ROLE_TOKENS) {
        const rgb = measureBackground(`var(${token})`);
        if (rgb && rgb !== 'rgba(0, 0, 0, 0)') next[token] = rgb;
      }
      resolved = next;
    });
  });

  /** Perceived lightness to decide swatch text color (0–255). */
  function perceived(rgb) {
    if (!rgb) return 128;
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb);
    if (!m) return 128;
    return 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3];
  }
</script>

<div class="ca">
  {#each COLOR_ROLE_GROUPS as group (group.section)}
    <div class="ca__section">
      <h3 class="ca__section-title">{group.section}</h3>
      <div class="ca__roles">
        {#each group.roles as role (role.token)}
          {@const bg = resolved[role.token]}
          {@const light = bg ? perceived(bg) > 128 : true}
          <div class="ca__role">
            <div
              class="ca__swatch"
              class:ca__swatch--light={light}
              class:ca__swatch--empty={!bg}
              style:background={bg ?? 'transparent'}
              title="{role.token}: {bg ?? 'resolving…'}"
            >
              {#if !bg}
                <span class="ca__swatch-dots" aria-hidden="true">···</span>
              {/if}
            </div>
            <div class="ca__meta">
              <span class="ca__label">{role.label}</span>
              <code class="ca__token">{role.token}</code>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}

  <p class="ca__note">
    Theme: <strong>{ui.previewTheme}</strong> · toggle in the preview pane to see the other mode.
  </p>
</div>

<style>
  .ca {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 14px 16px;
  }

  .ca__section-title {
    margin: 0 0 8px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--cfg-text-faint);
  }

  .ca__roles {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }

  .ca__role {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ca__swatch {
    height: 44px;
    border-radius: var(--cfg-radius-s);
    border: 1px solid var(--cfg-border-strong);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;
    background-image:
      conic-gradient(#444 25%, #2a2a2a 0 50%, #444 0 75%, #2a2a2a 0);
    background-size: 10px 10px;
  }
  .ca__swatch:not(.ca__swatch--empty) {
    background-image: none;
  }

  .ca__swatch-dots {
    font-size: 14px;
    color: var(--cfg-text-faint);
    letter-spacing: 2px;
  }

  .ca__meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .ca__label {
    font-size: 11.5px;
    font-weight: 600;
    color: var(--cfg-text);
    line-height: 1.3;
  }
  .ca__token {
    font-family: var(--cfg-mono);
    font-size: 9.5px;
    color: var(--cfg-text-faint);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ca__note {
    margin: 0;
    font-size: 11px;
    color: var(--cfg-text-faint);
    border-top: 1px solid var(--cfg-border);
    padding-top: 10px;
  }

  @media (max-width: 600px) {
    .ca { padding: 10px 12px; }
    .ca__roles { grid-template-columns: repeat(2, 1fr); }
  }
</style>
