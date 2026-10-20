"use client";

import { cn } from "@/lib/utils";

export type ClayBadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "pending"
  | "confirmed"
  | "in_progress"
  | "waiting_parts"
  | "qc"
  | "ready_for_pickup"
  | "completed"
  | "cancelled"
  | "rejected";

export interface ClayBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ClayBadgeVariant;
}

const variantStyles: Record<ClayBadgeVariant, string> = {
  default: "bg-slate-200 text-slate-700 shadow-[2px_2px_4px_#b8b9be]",
  primary: "bg-electric-blue text-white shadow-[2px_2px_4px_#1d4ed8]",
  success: "bg-emerald-accent text-white shadow-[2px_2px_4px_#047857]",
  warning: "bg-amber-accent text-white shadow-[2px_2px_4px_#b45309]",
  danger: "bg-rose-accent text-white shadow-[2px_2px_4px_#dc2626]",
  info: "bg-slate-600 text-white shadow-[2px_2px_4px_#475569]",
  pending: "bg-amber-100 text-amber-800 shadow-[2px_2px_4px_#d97706]",
  confirmed: "bg-blue-100 text-blue-800 shadow-[2px_2px_4px_#2563eb]",
  in_progress: "bg-blue-100 text-blue-800 shadow-[2px_2px_4px_#2563eb]",
  waiting_parts: "bg-amber-100 text-amber-800 shadow-[2px_2px_4px_#d97706]",
  qc: "bg-purple-100 text-purple-800 shadow-[2px_2px_4px_#7c3aed]",
  ready_for_pickup: "bg-emerald-100 text-emerald-800 shadow-[2px_2px_4px_#059669]",
  completed: "bg-emerald-100 text-emerald-800 shadow-[2px_2px_4px_#059669]",
  cancelled: "bg-rose-100 text-rose-800 shadow-[2px_2px_4px_#e11d48]",
  rejected: "bg-rose-100 text-rose-800 shadow-[2px_2px_4px_#e11d48]",
};

const statusVariants: Record<string, ClayBadgeVariant> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  WAITING_PARTS: "waiting_parts",
  QC: "qc",
  READY_FOR_PICKUP: "ready_for_pickup",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
};

/**
 * Maps a booking status (any casing) to its badge variant.
 * Falls back to "default" for unknown statuses.
 */
export function bookingStatusVariant(status: string): ClayBadgeVariant {
  return statusVariants[status.toUpperCase()] ?? "default";
}

export function ClayBadge({
  variant = "default",
  className,
  ...props
}: ClayBadgeProps) {
  return (
    <span
      className={cn(
        "clay-badge px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}