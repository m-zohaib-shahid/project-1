"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { SHOPS, type Shop } from "@/lib/mockData";
import {
  persistShopId,
  persistTheme,
  readPreferredShopId,
  readPreferredTheme,
  subscribePreferences,
} from "@/lib/prefs-store";

interface AppContextValue {
  currentShop: Shop;
  currentShopId: string;
  setCurrentShopId: (id: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  // Persisted preferences live in an external store so the server snapshot is
  // stable and hydration never mismatches (no setState-in-effect cascade).
  const shopId = useSyncExternalStore(
    subscribePreferences,
    () => readPreferredShopId(SHOPS[0].id, (id) => SHOPS.some((s) => s.id === id)),
    () => SHOPS[0].id
  );
  const theme = useSyncExternalStore(
    subscribePreferences,
    () => readPreferredTheme("light"),
    () => "light" as const
  );
  const isDark = theme === "dark";

  // Apply the `dark` class to <html> so the dark variants activate.
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  const setCurrentShopId = useCallback((id: string) => {
    persistShopId(id);
  }, []);

  const toggleTheme = useCallback(() => {
    persistTheme(isDark ? "light" : "dark");
  }, [isDark]);

  const value = useMemo<AppContextValue>(() => {
    const shop = SHOPS.find((s) => s.id === shopId) ?? SHOPS[0];
    return {
      currentShop: shop,
      currentShopId: shop.id,
      setCurrentShopId,
      isDark,
      toggleTheme,
    };
  }, [shopId, setCurrentShopId, isDark, toggleTheme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used inside <AppProvider>");
  }
  return ctx;
}

/** Convenience hook for screens that only need the active shop id. */
export function useCurrentShopId() {
  return useApp().currentShopId;
}
