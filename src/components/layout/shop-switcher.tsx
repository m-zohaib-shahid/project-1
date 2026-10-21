"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Building2, Check } from "lucide-react";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { SHOPS } from "@/lib/mockData";
import { useApp } from "@/components/providers/app-provider";

export function ShopSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentShop, setCurrentShopId } = useApp();

  // Close the dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (shopId: string) => {
    setCurrentShopId(shopId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <ClayButton
        variant="ghost"
        size="sm"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2"
      >
        <Building2 className="h-4 w-4 shrink-0" />
        <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[10rem]">
          {currentShop.name}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        <ClayBadge variant="info" className="ml-1 hidden sm:inline-flex">
          {currentShop.city}
        </ClayBadge>
      </ClayButton>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select shop"
          className="absolute bottom-full left-0 mb-2 w-56 clay-card p-2 z-50"
        >
          {SHOPS.map((shop) => (
            <button
              key={shop.id}
              role="option"
              aria-selected={shop.id === currentShop.id}
              onClick={() => handleSelect(shop.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl transition-colors ${
                shop.id === currentShop.id
                  ? "bg-electric-blue/10 text-electric-blue font-medium"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{shop.name}</div>
                <div className="text-xs text-slate-500 truncate">{shop.city}</div>
              </div>
              {shop.id === currentShop.id && <Check className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}