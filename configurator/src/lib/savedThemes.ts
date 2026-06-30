/**
 * User-saved themes.
 *
 * A theme is a named snapshot of the current override set, stored in
 * localStorage. Unlike the old curated presets, every theme here is created by
 * the user from their own configuration — the configurator ships no opinionated
 * starting palettes.
 */
import type { SavedSlot } from "../types";

const LS_KEY = "slashed-studio/themes/v1";

function read(): SavedSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedSlot[]) : [];
  } catch {
    return [];
  }
}

function write(themes: SavedSlot[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(themes));
  } catch {
    /* quota — ignore */
  }
}

export function listSavedThemes(): SavedSlot[] {
  return read();
}

/** Create a new saved theme from the given overrides. Returns the full list. */
export function saveTheme(name: string, overrides: Record<string, string>): SavedSlot[] {
  const themes = read();
  const trimmed = name.trim() || "Untitled theme";
  const slot: SavedSlot = {
    id: `theme-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: trimmed,
    icon: "🎨",
    blurb: `${Object.keys(overrides).length} override${Object.keys(overrides).length === 1 ? "" : "s"}`,
    overrides: { ...overrides },
  };
  themes.push(slot);
  write(themes);
  return themes;
}

export function deleteTheme(id: string): SavedSlot[] {
  const themes = read().filter((t) => t.id !== id);
  write(themes);
  return themes;
}

export function renameTheme(id: string, name: string): SavedSlot[] {
  const themes = read().map((t) => (t.id === id ? { ...t, name: name.trim() || t.name } : t));
  write(themes);
  return themes;
}
