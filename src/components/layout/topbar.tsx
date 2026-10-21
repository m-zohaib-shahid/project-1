"use client";

import { ShopSwitcher } from "./shop-switcher";
import { NotificationBell } from "./notification-bell";
import { ClayAvatar } from "@/components/ui/clay-avatar";
import { Menu, Sun, Moon } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { CURRENT_USER } from "@/lib/mockData";

export function Topbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { isDark, toggleTheme } = useApp();

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-electric-blue rounded-xl shadow-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-slate-50 tracking-tight">
              BayFlow
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <ShopSwitcher />
          <NotificationBell />
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>
          <ClayAvatar name={CURRENT_USER.name} size="md" className="hidden sm:flex shrink-0" />
        </div>
      </div>
    </div>
  );
}