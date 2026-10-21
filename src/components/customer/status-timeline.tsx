"use client";

import { AlertTriangle, Ban, Clock3 } from "lucide-react";
import { BookingStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface TimelineStep {
  key: string;
  label: string;
  description: string;
}

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  steps?: TimelineStep[];
}

const DEFAULT_STEPS: TimelineStep[] = [
  { key: "PENDING", label: "Booked", description: "Appointment requested" },
  { key: "CONFIRMED", label: "Confirmed", description: "Shop confirmed" },
  { key: "IN_PROGRESS", label: "In Repair", description: "Technician working" },
  { key: "QC", label: "Quality Check", description: "Final inspection" },
  { key: "READY_FOR_PICKUP", label: "Ready", description: "Ready for pickup" },
  { key: "COMPLETED", label: "Completed", description: "Service complete" },
];

const STATUS_ORDER: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "QC",
  "READY_FOR_PICKUP",
  "COMPLETED",
];

const TERMINAL_STATES: Partial<
  Record<BookingStatus, { title: string; description: string; tone: string; icon: typeof Ban }>
> = {
  CANCELLED: {
    title: "Booking Cancelled",
    description: "This appointment was cancelled and will not proceed.",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
    icon: Ban,
  },
  REJECTED: {
    title: "Estimate Rejected",
    description: "The repair estimate was declined, so the job was not started.",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
    icon: AlertTriangle,
  },
};

export function StatusTimeline({ currentStatus, steps }: StatusTimelineProps) {
  const stepList = steps || DEFAULT_STEPS;

  const terminal = TERMINAL_STATES[currentStatus];
  if (terminal) {
    const Icon = terminal.icon;
    return (
      <div className={cn("rounded-xl border p-4 flex items-start gap-3", terminal.tone)}>
        <Icon className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold">{terminal.title}</div>
          <div className="text-sm opacity-90">{terminal.description}</div>
        </div>
      </div>
    );
  }

  const statusOrder = STATUS_ORDER;
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCompleted = currentIndex >= statusOrder.length - 1;
  const isWaitingParts = currentStatus === "WAITING_PARTS";
  const effectiveIndex = isWaitingParts
    ? statusOrder.indexOf("IN_PROGRESS")
    : currentIndex;

  return (
    <div className="relative w-full">
      <div className="overflow-x-auto pb-2">
        <div className="relative min-w-[560px]">
          {/* Progress line */}
          <div className="absolute top-6 left-2 right-2 -z-10 h-1 bg-slate-200 rounded-full">
            <div
              className="h-full bg-electric-blue rounded-full transition-all duration-500"
              style={{
                width: isCompleted
                  ? "100%"
                  : Math.max(0, (effectiveIndex / (statusOrder.length - 1))) * 100,
              }}
            />
          </div>

          <div className="flex justify-between py-8">
            {stepList.map((step, index) => {
            const status: BookingStatus = step.key as BookingStatus;
            const isActive = status === currentStatus;
            const isCompletedStep = index <= effectiveIndex;
            const isPending = index > effectiveIndex;

            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isCompletedStep
                    ? "bg-electric-blue text-white shadow-[4px_4px_8px_#1d4ed8]"
                    : isPending
                    ? "bg-slate-200 text-slate-400"
                    : "bg-white text-electric-blue border-2 border-electric-blue shadow-sm"
                }`}>
                  {isCompletedStep ? (
                    <span className="text-xs font-bold">✓</span>
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <div className="text-xs font-medium text-center w-20">
                  <span className={cn("block", isActive ? "text-electric-blue font-bold" : "text-slate-600")}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-slate-400">{step.description}</span>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {isWaitingParts && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 flex items-start gap-3">
          <Clock3 className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Waiting for Parts</div>
            <div className="text-sm opacity-90">
              The repair is on hold until the required parts arrive at the shop.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
