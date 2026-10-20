"use client";

import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  pressed?: boolean;
}

export function ClayCard({
  children,
  className,
  padding = "md",
  pressed = false,
  ...props
}: PropsWithChildren<ClayCardProps>) {
  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
    xl: "p-9",
  }[padding];

  return (
    <div
      className={cn(
        "clay-card",
        paddingClasses,
        pressed && "clay-card-pressed",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}