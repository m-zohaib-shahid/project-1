"use client";

import { cn } from "@/lib/utils";

export interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function ClayInput({
  label,
  error,
  helperText,
  className,
  ...props
}: ClayInputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          "clay-input w-full px-4 py-2.5 text-slate-900 placeholder-slate-400",
          error && "ring-1 ring-rose-accent",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-rose-accent">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export interface ClayTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
}

export function ClayTextarea({
  label,
  error,
  helperText,
  rows = 4,
  className,
  ...props
}: ClayTextareaProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "clay-input w-full px-4 py-2.5 text-slate-900 placeholder-slate-400",
          error && "ring-1 ring-rose-accent",
          className
        )}
        rows={rows}
        {...props}
      />
      {error && <p className="text-sm text-rose-accent">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export interface ClaySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function ClaySelect({
  label,
  error,
  helperText,
  className,
  ...props
}: ClaySelectProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        className={cn(
          "clay-input w-full px-4 py-2.5 text-slate-900 placeholder-slate-400 cursor-pointer appearance-none",
          error && "ring-1 ring-rose-accent",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-rose-accent">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}