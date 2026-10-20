"use client";

import { BookingStatus } from "@/lib/mockData";

interface TimelineStep {
  key: string;
  label: string;
  description: string;
}

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  steps?: TimelineStep[];
}

export function StatusTimeline({ currentStatus, steps }: StatusTimelineProps) {
  const stepList = steps || [
    { key: "PENDING", label: "Booked", description: "Appointment requested" },
    { key: "CONFIRMED", label: "Confirmed", description: "Shop confirmed" },
    { key: "IN_PROGRESS", label: "In Repair", description: "Technician working" },
    { key: "QC", label: "Quality Check", description: "Final inspection" },
    { key: "READY_FOR_PICKUP", label: "Ready", description: "Ready for pickup" },
    { key: "COMPLETED", label: "Completed", description: "Service complete" },
  ];

  const statusOrder: BookingStatus[] = [
    "PENDING",
    "CONFIRMED",
    "IN_PROGRESS",
    "QC",
    "READY_FOR_PICKUP",
    "COMPLETED",
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCompleted = currentIndex >= statusOrder.length - 1;

  return (
    <div className="relative w-full">
      {/* Progress line */}
      <div className="absolute top-6 left-2 right-2 -z-10 h-1 bg-slate-200 rounded-full">
        <div
          className="h-full bg-electric-blue rounded-full transition-all duration-500"
          style={{
            width: isCompleted
              ? "100%"
              : Math.max(0, (currentIndex / (statusOrder.length - 1))) * 100,
          }}
        />
      </div>

      <div className="flex justify-between py-8">
        {stepList.map((step, index) => {
          const status: BookingStatus = step.key as BookingStatus;
          const isActive = status === currentStatus;
          const isCompletedStep = index <= currentIndex;
          const isPending = index > currentIndex;

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
  );
}

function cn(...classes: (string | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}