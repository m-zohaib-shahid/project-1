"use client";

import { useState } from "react";
import { Wrench, ClipboardCheck, CheckCircle2, PackagePlus } from "lucide-react";
import { JOB_CARDS, STATUS_LABELS, getVehicleById, getServicesByIds, type JobCard } from "@/lib/mockData";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge, bookingStatusVariant } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { ClayInput, ClayTextarea } from "@/components/ui/clay-input";
import { ClayModal } from "@/components/ui/clay-modal";

const INSPECTION_CHECKS = [
  "Visual inspection of vehicle exterior and interior completed",
  "All fluid levels verified and topped off",
  "Brakes, suspension and steering inspected",
  "Tire condition and pressure within spec",
  "Lights, signals and wipers operational",
  "No leaks or warning lights detected",
];

export default function TechnicianDashboard() {
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [inspectionJobId, setInspectionJobId] = useState<string | null>(null);
  const [jobCards, setJobCards] = useState<JobCard[]>(JOB_CARDS);
  const [checks, setChecks] = useState<boolean[]>(INSPECTION_CHECKS.map(() => false));
  const [odometer, setOdometer] = useState("");
  const [odometerError, setOdometerError] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const inspectionJob = jobCards.find((j) => j.id === inspectionJobId);
  const inspectionVehicle = inspectionJob ? getVehicleById(inspectionJob.vehicle.id) : undefined;

  const allChecked = checks.length === INSPECTION_CHECKS.length && checks.every(Boolean);

  const startableJob = jobCards.find((j) => j.status === "CONFIRMED" || j.status === "PENDING");

  const openInspection = (jobId: string) => {
    setInspectionJobId(jobId);
    setChecks(INSPECTION_CHECKS.map(() => false));
    setOdometer("");
    setOdometerError(undefined);
    setNotes("");
    setInspectionOpen(true);
  };

  const closeInspection = () => {
    setInspectionOpen(false);
    setInspectionJobId(null);
  };

  const submitInspection = () => {
    if (!allChecked) return;
    const reading = Number(odometer.trim());
    if (!odometer.trim() || Number.isNaN(reading) || reading < 0) {
      setOdometerError("Enter a valid odometer reading");
      return;
    }
    setOdometerError(undefined);

    setJobCards(prev =>
      prev.map((job) =>
        job.id === inspectionJobId
          ? { ...job, status: "QC" as const, inspectionNotes: notes.trim() || undefined }
          : job
      )
    );
    setNotice("Inspection submitted — vehicle sent to QC.");
    closeInspection();
  };

  const requestParts = (jobId: string) => {
    setJobCards(prev =>
      prev.map((job) => (job.id === jobId ? { ...job, status: "WAITING_PARTS" as const } : job))
    );
    setNotice("Parts requested — the parts team has been notified.");
  };

  const sendToQC = (jobId: string) => {
    setJobCards(prev => prev.map((job) => (job.id === jobId ? { ...job, status: "QC" as const } : job)));
    setNotice("Job sent to QC.");
  };

  const startRepair = (jobId: string) => {
    setJobCards(prev =>
      prev.map((job) => (job.id === jobId ? { ...job, status: "IN_PROGRESS" as const } : job))
    );
    setNotice("Repair started — job moved to In Progress.");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">Technician Dashboard</h1>
          <p className="text-[#9a9186]">Manage your assigned jobs and vehicle inspections</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton
            variant="primary"
            size="sm"
            className="px-4 py-2"
            disabled={!startableJob}
            onClick={() => startableJob && startRepair(startableJob.id)}
          >
            <Wrench className="h-4 w-4 mr-2" /> Start Repair
          </ClayButton>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className="ml-auto text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Assigned Jobs" value={jobCards.length} color="text-blue-600" />
        <StatCard label="In Progress" value={jobCards.filter(j => j.status === "IN_PROGRESS").length} color="text-blue-600" />
        <StatCard label="Waiting Parts" value={jobCards.filter(j => j.status === "WAITING_PARTS").length} color="text-amber-600" />
        <StatCard label="Awaiting QC" value={jobCards.filter(j => j.status === "QC").length} color="text-purple-600" />
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-[#e2ddd0]">
          <h2 className="text-lg font-bold text-[#2d3748]">Assigned Jobs</h2>
        </div>
        <div className="divide-y divide-[#e2ddd0]">
          {jobCards.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#f0ebe2] rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-7 w-7 text-[#b8aea5]" />
              </div>
              <h3 className="text-lg font-bold text-[#2d3748]">No assigned jobs</h3>
              <p className="text-[#9a9186] text-sm">Jobs assigned to you will appear here.</p>
            </div>
          ) : (
          jobCards.map((job) => {
            const vehicle = getVehicleById(job.vehicle.id);
            const services = getServicesByIds(job.services.map((s) => s.id));
            const statusInfo = STATUS_LABELS[job.status];

            return (
              <div key={job.id} className="p-6 flex justify-between items-start hover:bg-[#f0ebe2] transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#f0ebe2] flex items-center justify-center text-[#6b6258] text-xs">
                      {vehicle?.make[0]}{vehicle?.model[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[#2d3748] text-sm">{vehicle?.make} {vehicle?.model}</div>
                      <div className="text-xs text-[#9a9186]">{vehicle?.plateNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <ClayBadge variant={bookingStatusVariant(job.status)} className="text-xs">
                      {statusInfo.label}
                    </ClayBadge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#6b6258]">
                    <span>{services.map(s => s.name).join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {job.status === "IN_PROGRESS" && (
                    <ClayButton variant="primary" size="sm" onClick={() => openInspection(job.id)} className="px-3 py-2">
                      Inspection Form
                    </ClayButton>
                  )}
                  {job.status === "WAITING_PARTS" && (
                    <ClayButton variant="warning" size="sm" onClick={() => requestParts(job.id)} className="px-3 py-2">
                      <PackagePlus className="h-4 w-4 mr-2" /> Request Parts
                    </ClayButton>
                  )}
                  {job.status === "IN_PROGRESS" && (
                    <ClayButton variant="success" size="sm" onClick={() => sendToQC(job.id)} className="px-3 py-2">
                      Send to QC
                    </ClayButton>
                  )}
                  {(job.status === "CONFIRMED" || job.status === "PENDING") && (
                    <ClayButton variant="primary" size="sm" onClick={() => startRepair(job.id)} className="px-3 py-2">
                      <Wrench className="h-4 w-4 mr-2" /> Start Repair
                    </ClayButton>
                  )}
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>

      <ClayModal
        isOpen={inspectionOpen}
        onClose={() => setInspectionOpen(false)}
        title="Vehicle Inspection Form"
        description={
          inspectionVehicle
            ? `${inspectionVehicle.make} ${inspectionVehicle.model} — ${inspectionVehicle.plateNumber}`
            : undefined
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-[#f0ebe2] rounded-lg border border-[#e2ddd0]">
            <ClipboardCheck className="h-5 w-5 text-electric-blue shrink-0" />
            <p className="text-sm text-[#6b6258]">
              Complete each check below before sending the vehicle to QC.
            </p>
          </div>

          <div className="space-y-2">
            {INSPECTION_CHECKS.map((check, index) => (
              <label
                key={check}
                className="flex items-center gap-3 p-3 bg-[#f0ebe2] rounded-lg border border-[#e2ddd0] cursor-pointer hover:bg-[#f0ebe2] transition-colors"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-electric-blue rounded border-[#e2ddd0]"
                  checked={checks[index] ?? false}
                  onChange={(e) =>
                    setChecks(prev => {
                      const next = [...prev];
                      next[index] = e.target.checked;
                      return next;
                    })
                  }
                />
                <span className="text-sm text-[#4a433a]">{check}</span>
              </label>
            ))}
          </div>

          <ClayInput
            label="Odometer Reading"
            placeholder="e.g. 42500"
            value={odometer}
            onChange={(e) => {
              setOdometer(e.target.value);
              if (odometerError) setOdometerError(undefined);
            }}
            error={odometerError}
          />
          <ClayTextarea
            label="Inspection Notes"
            placeholder="Add any notes about the inspection..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {!allChecked && (
            <p className="text-xs text-amber-600">
              All {INSPECTION_CHECKS.length} inspection checks must be completed before submitting.
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <ClayButton
              variant="primary"
              size="sm"
              onClick={submitInspection}
              disabled={!allChecked}
              className="flex-1 px-4 py-2"
            >
              Submit Inspection
            </ClayButton>
            <ClayButton
              variant="ghost"
              size="sm"
              onClick={closeInspection}
              className="flex-1 px-4 py-2"
            >
              Cancel
            </ClayButton>
          </div>
        </div>
      </ClayModal>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <ClayCard padding="sm" className="text-center">
      <div className={`text-[#9a9186] text-xs font-medium uppercase tracking-wider mb-1 ${color}`}>{label}</div>
      <div className="text-2xl font-bold text-[#2d3748]">{value}</div>
    </ClayCard>
  );
}