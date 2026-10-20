"use client";

import { useState } from "react";
import { Bell, ChevronDown, CheckCircle2 } from "lucide-react";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";

const NOTIFICATIONS = [
  {
    id: "n1",
    title: "Estimate Ready",
    message: "Brake service estimate for Honda Civic is ready for review",
    time: "10 min ago",
    type: "info",
    read: false,
  },
  {
    id: "n2",
    title: "Parts Arrived",
    message: "Oil filter for Toyota Camry has arrived",
    time: "1 hour ago",
    type: "success",
    read: false,
  },
  {
    id: "n3",
    title: "QC Failed",
    message: "Transmission service failed quality check",
    time: "3 hours ago",
    type: "danger",
    read: true,
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="relative inline-block">
      <ClayButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <ClayBadge variant="danger" className="absolute top-1 right-1 -mt-2 -mr-2 h-5 w-5 text-[10px] leading-none">
            {unreadCount}
          </ClayBadge>
        )}
      </ClayButton>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-72 clay-card z-50">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {NOTIFICATIONS.map((n) => (
              <button
                key={n.id}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-100 ${
                  !n.read ? "bg-slate-50" : ""
                }`}
              >
                <div className={`shrink-0 p-1.5 rounded-lg ${
                  n.type === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : n.type === "danger"
                    ? "bg-rose-100 text-rose-600"
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {n.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : n.type === "danger" ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <Bell className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">{n.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{n.message}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-slate-200 text-center">
            <ClayButton variant="ghost" size="sm" className="w-full text-xs">
              View All
            </ClayButton>
          </div>
        </div>
      )}
    </div>
  );
}