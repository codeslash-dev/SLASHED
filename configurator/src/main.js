/**
 * SLASHED configurator entry point.
 *
 * Mounts the Svelte app into #app. Everything downstream is driven by the
 * baked-in token catalogue (src/data/api-index.generated.json), so the app
 * has no network or backend dependency.
 */
import { mount } from 'svelte';
import App from './App.svelte';

// DOGFOOD: load SLASHED's own token + theme layers at :root so the configurator
// chrome renders with the framework it edits (see styles/app.css, which maps
// every --cfg-* alias onto these --sf-* tokens). We deliberately load only the
// token/theme layers — not reset/base/layout/components — so the framework
// styles the chrome's *design tokens* and dark mode without fighting the
// bespoke shell layout or the editor's own controls.
//
// Layer order is established by layers.css first; light/dark is the framework's
// native light-dark() resolved against [data-theme] (set in App.svelte). User
// overrides never reach :root (they scope to the preview stage), so the chrome
// always shows framework defaults.
import '../../core/layers.css';
import '../../core/tokens.css';
import '../../core/tokens.layout.css';
import '../../core/tokens.macros.css';
import '../../core/themes.css';
import '../../optional/tokens.palette.css';
// Layout primitives — only .sf-* class selectors, safe alongside chrome styles.
// Required so the live-preview Layout tab can demonstrate real sf-* classes
// (sf-stack, sf-cluster, sf-grid, sf-bento, sf-sidebar, etc.) instead of
// custom simulations. User overrides still scope only to the preview stage.
import '../../core/layout.css';

import './styles/app.css';

const target = document.getElementById('app');
mount(App, { target });
