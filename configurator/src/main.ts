import { mount } from 'svelte';
import './app.css';
import App from './App.svelte';

// DOGFOOD: load SLASHED's own token + theme layers at :root so the configurator
// chrome renders with the framework it edits. We load only token/theme layers —
// not reset/base/layout/components — so the framework styles the chrome's design
// tokens without fighting the bespoke shell layout or editor controls.
import '../../core/layers.css';
import '../../core/tokens.css';
import '../../core/tokens.layout.css';
import '../../core/tokens.macros.css';
import '../../core/themes.css';
// Layout + macro primitives — only .sf-* class selectors, safe alongside chrome.
import '../../core/layout.css';
import '../../core/macros.css';

const app = mount(App, { target: document.getElementById('app')! });
export default app;
