"use client";

import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export interface ClayButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  pressed?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-electric-blue text-white shadow-[4px_4px_8px_#1d4ed8]",
  secondary: "bg-slate-300 text-slate-900 shadow-[4px_4px_8px_#cbd5e1]",
  success: "bg-emerald-accent text-white shadow-[4px_4px_8px_#047857]",
  warning: "bg-amber-accent text-white shadow-[4px_4px_8px_#b45309]",
  danger: "bg-rose-accent text-white shadow-[4px_4px_8px_#dc2626]",
  ghost: "bg-transparent text-slate-600 shadow-none hover:bg-slate-200",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-8 py-3 text-lg",
};

export function ClayButton({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  pressed = false,
  disabled,
  ...props
}: PropsWithChildren<ClayButtonProps>) {
  return (
    <button
      className={cn(
        "clay-btn",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed",
        pressed && "clay-card-pressed",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
}