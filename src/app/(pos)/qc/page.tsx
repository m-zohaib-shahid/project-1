"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { BOOKINGS, getVehicleById, getServicesByIds } from "@/lib/mockData";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { ClayInput, ClayTextarea } from "@/components/ui/clay-input";
import { ClayModal } from "@/components/ui/clay-modal";

export default function QCDashboard() {
  const [pickModalOpen, setPickModalOpen] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [checks, setChecks] = useState<boolean[]>([]);
  const [notes, setNotes] = useState("");
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [result, setResult] = useState<"passed" | "issue" | null>(null);
  const [completed, setCompleted] = useState<{ bookingId: string; status: "passed" | "issue" }[]>([]);

  const qcQueue = BOOKINGS.filter(b => b.status === "QC");

  const checklistItems = [
    "Road test completed - no unusual noises or vibrations",
    "All fluid levels verified and topped off",
    "Brakes functioning properly - no squealing or grinding",
    "Lights and signals operational",
    "Tire pressure and tread wear within spec",
    "No leaks detected under vehicle",
  ];

  const activeBooking = BOOKINGS.find(b => b.id === activeBookingId) ?? null;
  const activeVehicle = activeBooking ? getVehicleById(activeBooking.vehicleId) : null;

  const allChecked = checks.length === checklistItems.length && checks.every(Boolean);

  const openChecklist = (bookingId: string) => {
    setActiveBookingId(bookingId);
    setChecks(new Array(checklistItems.length).fill(false));
    setNotes("");
    setIssueTitle("");
    setIssueDescription("");
    setResult(null);
    setPickModalOpen(true);
  };

  const closeChecklist = () => {
    setPickModalOpen(false);
    setActiveBookingId(null);
    setResult(null);
  };

  const submitResult = () => {
    if (!activeBookingId || !result) return;
    setCompleted(prev => [
      ...prev.filter(c => c.bookingId !== activeBookingId),
      { bookingId: activeBookingId, status: result },
    ]);
    closeChecklist();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">QC Inspector Dashboard</h1>
          <p className="text-[#9a9186]">Perform quality inspections on completed repairs</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton
            variant="primary"
            size="sm"
            className="px-4 py-2"
            disabled={qcQueue.length === 0}
            onClick={() => {
              const next = qcQueue.find(b => !completed.some(c => c.bookingId === b.id));
              if (next) openChecklist(next.id);
            }}
          >
            <ShieldCheck className="h-4 w-4 mr-2" /> New Inspection
          </ClayButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="In Queue" value={qcQueue.length} color="text-purple-600" />
        <StatCard label="Passed Today" value={completed.filter(c => c.status === "passed").length} color="text-emerald-600" />
        <StatCard label="Failed Today" value={completed.filter(c => c.status === "issue").length} color="text-rose-600" />
        <StatCard label="Avg. Time" value="24 min" color="text-blue-600" />
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-[#e2ddd0]">
          <h2 className="text-lg font-bold text-[#2d3748]">QC Queue</h2>
        </div>
        <div className="divide-y divide-[#e2ddd0]">
          {qcQueue.map((booking) => {
            const vehicle = getVehicleById(booking.vehicleId);
            const services = getServicesByIds(booking.serviceIds);
            const done = completed.find(c => c.bookingId === booking.id);

            return (
              <div key={booking.id} className="p-6 flex flex-col sm:flex-row justify-between gap-4 items-start hover:bg-[#f0ebe2] transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#f0ebe2] flex items-center justify-center text-[#6b6258] text-xs shrink-0">
                      {vehicle?.make[0]}{vehicle?.model[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#2d3748] text-sm">{vehicle?.make} {vehicle?.model}</div>
                      <div className="text-xs text-[#9a9186]">{vehicle?.plateNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-4 flex-wrap">
                    <span className="text-[#6b6258]">{booking.scheduledAt.split("T")[0]}</span>
                    <ClayBadge variant="qc" className="text-xs">
                      {done ? (done.status === "passed" ? "Inspection Passed" : "Issue Raised") : "Quality Check"}
                    </ClayBadge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#6b6258]">
                    <span>{services.map(s => s.name).join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ClayButton variant="primary" size="sm" onClick={() => openChecklist(booking.id)} className="px-3 py-2">
                    {done ? "Re-inspect" : "Pick Job"}
                  </ClayButton>
                </div>
              </div>
            );
          })}
          {qcQueue.length === 0 && (
            <div className="p-10 text-center text-[#9a9186]">No jobs waiting for quality control.</div>
          )}
        </div>
      </div>

      <ClayModal isOpen={pickModalOpen} onClose={closeChecklist} title="Quality Inspection Checklist">
        {activeVehicle && (
          <div className="mb-4 p-3 rounded-lg bg-[#f0ebe2] border border-[#e2ddd0] text-sm text-[#6b6258]">
            Inspecting <span className="font-semibold text-[#2d3748]">{activeVehicle.make} {activeVehicle.model}</span> ({activeVehicle.plateNumber})
          </div>
        )}
        <div className="space-y-4">
          <p className="text-sm text-[#6b6258]">Perform the following quality checks before approving the vehicle:</p>
          <div className="space-y-3">
            {checklistItems.map((check, i) => (
              <label key={i} className="flex items-center gap-3 p-3 bg-[#f0ebe2] rounded-lg border border-[#e2ddd0] cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!checks[i]}
                  onChange={() => setChecks(prev => {
                    const next = [...prev];
                    next[i] = !next[i];
                    return next;
                  })}
                  className="h-4 w-4 text-electric-blue rounded border-[#e2ddd0] cursor-pointer shrink-0"
                />
                <span className="text-sm text-[#4a433a]">{check}</span>
              </label>
            ))}
          </div>
          {!allChecked && (
            <p className="text-xs text-amber-600">
              {checks.filter(Boolean).length} of {checklistItems.length} checks complete
            </p>
          )}
          <div className="pt-4">
            <ClayTextarea label="Inspection Notes" placeholder="Add any notes about the inspection..." rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ClayButton
              variant="success"
              size="sm"
              onClick={() => setResult("passed")}
              disabled={!allChecked}
              className="flex-1 px-4 py-2"
            >
              Pass Inspection
            </ClayButton>
            <ClayButton
              variant="danger"
              size="sm"
              onClick={() => setResult("issue")}
              className="flex-1 px-4 py-2"
            >
              Raise Issue
            </ClayButton>
          </div>
          {!allChecked && (
            <p className="text-xs text-[#b8aea5]">Complete every checklist item to pass the inspection.</p>
          )}
        </div>
      </ClayModal>

      <ClayModal
        isOpen={result === "passed"}
        onClose={closeChecklist}
        title="Inspection Result"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_8px_#047857]">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-bold text-[#2d3748]">Inspection Passed</h3>
              <p className="text-[#9a9186]">Vehicle has passed quality control.</p>
            </div>
          </div>
          {notes && (
            <div className="p-3 rounded-lg bg-[#f0ebe2] border border-[#e2ddd0] text-sm text-[#6b6258]">
              <span className="font-semibold text-[#2d3748]">Notes:</span> {notes}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3">
            <ClayButton variant="primary" size="sm" onClick={submitResult} className="flex-1 px-4 py-2">
              Submit Result
            </ClayButton>
            <ClayButton variant="ghost" size="sm" onClick={closeChecklist} className="flex-1 px-4 py-2">
              Cancel
            </ClayButton>
          </div>
        </div>
      </ClayModal>

      <ClayModal
        isOpen={result === "issue"}
        onClose={closeChecklist}
        title="Raise Issue"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center py-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_8px_#be123c]">
                <span className="text-2xl">!</span>
              </div>
              <h3 className="text-lg font-bold text-[#2d3748]">Report an Issue</h3>
              <p className="text-[#9a9186]">The vehicle will be sent back for rework.</p>
            </div>
          </div>
          <ClayInput
            label="Issue Title"
            placeholder="Enter issue title..."
            value={issueTitle}
            onChange={(e) => setIssueTitle(e.target.value)}
          />
          <ClayTextarea
            label="Issue Description"
            placeholder="Describe the issue..."
            rows={3}
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <ClayButton
              variant="danger"
              size="sm"
              onClick={submitResult}
              disabled={!issueTitle.trim() || !issueDescription.trim()}
              className="flex-1 px-4 py-2"
            >
              Submit Issue
            </ClayButton>
            <ClayButton variant="ghost" size="sm" onClick={closeChecklist} className="flex-1 px-4 py-2">
              Cancel
            </ClayButton>
          </div>
          {(!issueTitle.trim() || !issueDescription.trim()) && (
            <p className="text-xs text-[#b8aea5]">Issue title and description are required.</p>
          )}
        </div>
      </ClayModal>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <ClayCard padding="sm" className="text-center">
      <div className={`text-[#9a9186] text-xs font-medium uppercase tracking-wider mb-1 ${color}`}>{label}</div>
      <div className="text-2xl font-bold text-[#2d3748]">{value}</div>
    </ClayCard>
  );
}
