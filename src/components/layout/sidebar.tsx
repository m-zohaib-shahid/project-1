"use client";

import {
  LayoutDashboard,
  Wrench,
  Package,
  ShieldCheck,
  Building,
  ChevronLeft,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ClayBadge } from "@/components/ui/clay-badge";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/sa", icon: LayoutDashboard },
  { name: "Technicians", href: "/technician", icon: Wrench },
  { name: "Parts", href: "/parts", icon: Package },
  { name: "QC", href: "/qc", icon: ShieldCheck },
  { name: "Owner", href: "/owner", icon: Building },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 clay-card border-r border-slate-200 z-40 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-electric-blue rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs">B</span>
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              BayFlow
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-200 rounded-lg"
            aria-label="Close navigation"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                  isActive
                    ? "bg-electric-blue text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                onClick={onClose}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-slate-200">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 clay-shadow-inset rounded-full flex items-center justify-center font-medium text-slate-800">
                MC
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">Marcus Chen</div>
                <div className="text-xs text-slate-500">Service Advisor</div>
              </div>
            </div>
            <ClayBadge variant="success" className="text-xs">
              Active
            </ClayBadge>
          </div>
        </div>
      </aside>
    </>
  );
}