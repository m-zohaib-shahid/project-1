"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ClayAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  name?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function ClayAvatar({
  src,
  alt,
  size = "md",
  name,
  className,
  ...props
}: ClayAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div
      className={cn(
        "relative clay-shadow-inset rounded-full flex items-center justify-center font-bold text-[#4a433a] overflow-hidden border border-[#fdfbf7]/60",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || "avatar"}
          fill
          sizes="48px"
          className="object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}