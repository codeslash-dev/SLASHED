<script>
  /**
   * Spacing tab: scale multiplier + named aliases.
   *
   * 1:1 port of `render_tab_spacing()` in class-admin-page.php. The
   * aliases accept arbitrary CSS values (incl. `var(--sf-space-l)`)
   * since they often delegate to other space tokens.
   */
  import { meta } from '../lib/stores.svelte.js';
  import NumberField from './NumberField.svelte';
  import TextField from './TextField.svelte';
  import AdvancedSection from './AdvancedSection.svelte';
  import SpacingPreview from './SpacingPreview.svelte';

  const SECTION = 'spacing';
  const defaults = meta.defaults?.[SECTION] ?? {};

  /**
   * Alias rows kept in display order. Each entry mirrors one of the
   * `$aliases` definitions in render_tab_spacing(). The `var` key is
   * the CSS custom property hint shown in the row's label column.
   */
  const aliases = [
    { key: 'gutter',        label: 'Gutter',        cssVar: '--sf-space-gutter' },
    { key: 'gap',           label: 'Gap',           cssVar: '--sf-gap' },
    { key: 'content_gap',   label: 'Content Gap',   cssVar: '--sf-content-gap' },
    { key: 'component_pad', label: 'Component Pad', cssVar: '--sf-component-pad' },
    { key: 'section_pad',   label: 'Section Pad',   cssVar: '--sf-section-pad' },
  ];
</script>

<section>
  <h2>Spacing</h2>
  <div class="rows">
    <NumberField
      section={SECTION}
      fieldKey="space_scale"
      label="Space Scale"
      min={0}
      step={0.05}
      default={defaults.space_scale ?? 1}
      cssVar="--sf-space-scale"
    />
  </div>

  <AdvancedSection>
    <h2 class="group-heading">Space Aliases</h2>
    <div class="rows">
      {#each aliases as alias (alias.key)}
        <TextField
          section={SECTION}
          fieldKey={alias.key}
          label={alias.label}
          default={defaults[alias.key] ?? ''}
          cssVar={alias.cssVar}
          mono
        />
      {/each}
    </div>
  </AdvancedSection>

  <SpacingPreview />
</section>

<style>
  h2 { margin-top: 0; }
  .group-heading { margin-top: 0; }
  .rows {
    border: 1px solid #f0f0f1;
    border-radius: 4px;
    padding: 0 12px;
    background: #fcfcfd;
  }
</style>
