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
  default: "bg-slate-200 text-slate-700 shadow-clay-badge",
  primary: "bg-electric-blue text-white shadow-clay-badge",
  success: "bg-emerald-accent text-white shadow-clay-badge",
  warning: "bg-amber-accent text-white shadow-clay-badge",
  danger: "bg-rose-accent text-white shadow-clay-badge",
  info: "bg-slate-600 text-white shadow-clay-badge",
  pending: "bg-amber-100 text-amber-800 shadow-clay-badge",
  confirmed: "bg-blue-100 text-blue-800 shadow-clay-badge",
  in_progress: "bg-blue-100 text-blue-800 shadow-clay-badge",
  waiting_parts: "bg-amber-100 text-amber-800 shadow-clay-badge",
  qc: "bg-purple-100 text-purple-800 shadow-clay-badge",
  ready_for_pickup: "bg-emerald-100 text-emerald-800 shadow-clay-badge",
  completed: "bg-emerald-100 text-emerald-800 shadow-clay-badge",
  cancelled: "bg-rose-100 text-rose-800 shadow-clay-badge",
  rejected: "bg-rose-100 text-rose-800 shadow-clay-badge",
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