/**
 * Persisted user preferences (active shop + theme) kept in localStorage.
 *
 * Implemented as a tiny external store so it can be read with
 * `useSyncExternalStore`: the server snapshot returns stable defaults, and the
 * client snapshot returns the persisted values. That keeps SSR and hydration
 * consistent without a "setState inside an effect" cascade.
 */

export type ThemePreference = "light" | "dark";

export const SHOP_STORAGE_KEY = "bayflow.activeShopId";
export const THEME_STORAGE_KEY = "bayflow.theme";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribePreferences(onChange: () => void) {
  listeners.add(onChange);
  // Keep multiple tabs in sync.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* localStorage unavailable — ignore */
  }
}

export function readPreferredShopId(fallback: string, isValid: (id: string) => boolean): string {
  const saved = readStorage(SHOP_STORAGE_KEY);
  return saved && isValid(saved) ? saved : fallback;
}

export function persistShopId(id: string) {
  writeStorage(SHOP_STORAGE_KEY, id);
  emit();
}

export function readPreferredTheme(fallback: ThemePreference): ThemePreference {
  const saved = readStorage(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return fallback;
}

export function persistTheme(theme: ThemePreference) {
  writeStorage(THEME_STORAGE_KEY, theme);
  emit();
}
