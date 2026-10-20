"use client";

import { useState } from "react";
import { ChevronDown, Building2 } from "lucide-react";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { SHOPS } from "@/lib/mockData";

export function ShopSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const currentShop = SHOPS[0];

  return (
    <div className="relative inline-block">
      <ClayButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2"
      >
        <Building2 className="h-4 w-4" />
        <span className="font-medium text-slate-700">{currentShop.name}</span>
        <ChevronDown className="h-4 w-4" />
        <ClayBadge variant="info" className="ml-2">
          {currentShop.city}
        </ClayBadge>
      </ClayButton>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 clay-card z-50">
          {SHOPS.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                shop.id === currentShop.id
                  ? "bg-electric-blue/10 text-electric-blue font-medium"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Building2 className="h-5 w-5" />
              <div>
                <div className="text-sm font-medium">{shop.name}</div>
                <div className="text-xs text-slate-500">{shop.city}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}