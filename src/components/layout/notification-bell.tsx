"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, CheckCheck, X } from "lucide-react";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";

const INITIAL_NOTIFICATIONS = [
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
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications = showAll ? notifications : notifications.slice(0, 3);

  // Close the popover on outside click / Escape.
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

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelect = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setIsOpen(false);
  };

  const iconFor = (type: string) => {
    if (type === "success") return <CheckCircle2 className="h-4 w-4" />;
    if (type === "danger") return <AlertTriangle className="h-4 w-4" />;
    return <Info className="h-4 w-4" />;
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <ClayButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <ClayBadge variant="danger" className="absolute top-1 right-1 -mt-2 -mr-2 h-5 w-5 text-[10px] leading-none">
            {unreadCount}
          </ClayBadge>
        )}
      </ClayButton>

      {isOpen && (
        <div role="dialog" aria-label="Notifications" className="absolute bottom-full right-0 mb-2 w-80 max-w-[calc(100vw-2rem)] clay-card z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-electric-blue hover:underline flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="clay-empty py-10">
                <div className="clay-empty-icon">
                  <Bell className="h-5 w-5" />
                </div>
                <p className="text-sm text-slate-500">You&apos;re all caught up</p>
              </div>
            ) : (
              visibleNotifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleSelect(n.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 ${
                    !n.read ? "bg-slate-50 dark:bg-slate-800/60" : ""
                  }`}
                >
                  <div className={`shrink-0 p-1.5 rounded-lg ${
                    n.type === "success"
                      ? "bg-emerald-100 text-emerald-600"
                      : n.type === "danger"
                      ? "bg-rose-100 text-rose-600"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {iconFor(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-50 flex items-center gap-2">
                      {n.title}
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-electric-blue shrink-0" aria-label="Unread" />}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{n.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-center">
            {showAll ? (
              <ClayButton
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setShowAll(false)}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Show Less
              </ClayButton>
            ) : (
              <ClayButton
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => setShowAll(true)}
                disabled={notifications.length <= 3}
              >
                View All ({notifications.length})
              </ClayButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}