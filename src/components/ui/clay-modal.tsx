"use client";

import { PropsWithChildren, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
}

export function ClayModal({
  isOpen,
  onClose,
  title,
  description,
  showCloseButton = true,
  children,
}: PropsWithChildren<ClayModalProps>) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 rgba(28,25,23,0.6) backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full max-w-lg clay-card mx-4",
          showCloseButton ? "pr-10" : "pr-5"
        )}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-2 hover:bg-[#e8e2d4] rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#6b6258]" />
          </button>
        )}
        {title && (
          <div className="px-6 py-4">
            <h2 className="text-xl font-bold text-[#2d3748]">{title}</h2>
            {description && (
              <p className="text-[#9a9186] text-sm mt-1">{description}</p>
            )}
          </div>
        )}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

export interface ClayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placement?: "left" | "right";
}

export function ClayDrawer({
  isOpen,
  onClose,
  title,
  placement = "right",
  children,
}: PropsWithChildren<ClayDrawerProps>) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const positionClass = placement === "left" ? "-left-full" : "-right-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 rgba(28,25,23,0.5) backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-y-0 w-full max-w-md clay-card shadow-2xl transition-transform duration-300 ease-in-out",
          isOpen
            ? placement === "left"
              ? "translate-x-0"
              : "translate-x-0"
            : positionClass,
          placement === "left" ? "left-0" : "right-0"
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2ddd0]">
          {title && (
            <h2 className="text-xl font-bold text-[#2d3748]">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#e8e2d4] rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#6b6258]" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[85vh]">{children}</div>
      </div>
    </div>
  );
}