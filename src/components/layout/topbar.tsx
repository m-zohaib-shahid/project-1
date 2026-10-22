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
    <div className="sticky top-0 z-40 border-b border-[#e2ddd0] dark:border-[#3a332c] bg-[#fdfbf7]/80 dark:bg-[#1c1917]/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="p-2 hover:bg-[#e8e2d4] dark:hover:bg-[#4a433a] rounded-lg transition-colors md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-[#6b6258] dark:text-[#c4baa8]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-electric-blue rounded-xl shadow-sm flex items-center justify-center">
              <span className="text-[#fdfbf7] font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl text-[#2d3748] dark:text-[#c4baa8] tracking-tight">
              BayFlow
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <ShopSwitcher />
          <NotificationBell />
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-[#e8e2d4] dark:hover:bg-[#4a433a] rounded-lg transition-colors shrink-0"
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-[#6b6258] dark:text-[#c4baa8]" />
            ) : (
              <Moon className="h-5 w-5 text-[#6b6258] dark:text-[#c4baa8]" />
            )}
          </button>
          <ClayAvatar name={CURRENT_USER.name} size="md" className="hidden sm:flex shrink-0" />
        </div>
      </div>
    </div>
  );
}