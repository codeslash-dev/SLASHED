/**
 * SLASHED configurator entry point.
 *
 * Mounts the Svelte app into #app. Everything downstream is driven by the
 * baked-in token catalogue (src/data/api-index.generated.json), so the app
 * has no network or backend dependency.
 */
import { mount } from 'svelte';
import App from './App.svelte';
import './styles/app.css';

const target = document.getElementById('app');
mount(App, { target });
