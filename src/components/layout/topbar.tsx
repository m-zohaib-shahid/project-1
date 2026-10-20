"use client";

import { ShopSwitcher } from "./shop-switcher";
import { NotificationBell } from "./notification-bell";
import { ClayAvatar } from "@/components/ui/clay-avatar";
import { Menu, Sun, Moon } from "lucide-react";
import { useState } from "react";

export function Topbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-electric-blue rounded-xl shadow-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              BayFlow
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ShopSwitcher />
          <NotificationBell />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-slate-600" />
            ) : (
              <Moon className="h-5 w-5 text-slate-600" />
            )}
          </button>
          <ClayAvatar name="Marcus Chen" size="md" />
        </div>
      </div>
    </div>
  );
}