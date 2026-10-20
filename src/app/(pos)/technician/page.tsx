"use client";

import { useState } from "react";
import { Wrench, ArrowRight, ClipboardCheck } from "lucide-react";
import { JOB_CARDS, STATUS_LABELS, getVehicleById, getServicesByIds } from "@/lib/mockData";
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

  const inspectionJob = JOB_CARDS.find((j) => j.id === inspectionJobId);
  const inspectionVehicle = inspectionJob ? getVehicleById(inspectionJob.vehicle.id) : undefined;

  const openInspection = (jobId: string) => {
    setInspectionJobId(jobId);
    setInspectionOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Technician Dashboard</h1>
          <p className="text-slate-500">Manage your assigned jobs and vehicle inspections</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton variant="primary" size="sm" className="px-4 py-2">
            <Wrench className="h-4 w-4 mr-2" /> Start Repair
          </ClayButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Assigned Jobs" value={JOB_CARDS.length} color="text-blue-600" />
        <StatCard label="In Progress" value={JOB_CARDS.filter(j => j.status === "IN_PROGRESS").length} color="text-blue-600" />
        <StatCard label="Waiting Parts" value={JOB_CARDS.filter(j => j.status === "WAITING_PARTS").length} color="text-amber-600" />
        <StatCard label="Awaiting QC" value={JOB_CARDS.filter(j => j.status === "QC").length} color="text-purple-600" />
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Assigned Jobs</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {JOB_CARDS.map((job) => {
            const vehicle = getVehicleById(job.vehicle.id);
            const services = getServicesByIds(job.services.map((s) => s.id));
            const statusInfo = STATUS_LABELS[job.status];

            return (
              <div key={job.id} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
                      {vehicle?.make[0]}{vehicle?.model[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 text-sm">{vehicle?.make} {vehicle?.model}</div>
                      <div className="text-xs text-slate-500">{vehicle?.plateNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <ClayBadge variant={bookingStatusVariant(job.status)} className="text-xs">
                      {statusInfo.label}
                    </ClayBadge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span>{services.map(s => s.name).join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === "IN_PROGRESS" && (
                    <ClayButton variant="primary" size="sm" onClick={() => openInspection(job.id)} className="px-3 py-2">
                      Inspection Form
                    </ClayButton>
                  )}
                  {job.status === "WAITING_PARTS" && (
                    <ClayButton variant="warning" size="sm" className="px-3 py-2">
                      Request Parts
                    </ClayButton>
                  )}
                  {job.status === "IN_PROGRESS" && (
                    <ClayButton variant="success" size="sm" className="px-3 py-2">
                      Send to QC
                    </ClayButton>
                  )}
                  <ClayButton variant="ghost" size="sm" className="px-3 py-2 text-slate-500">
                    <ArrowRight className="h-4 w-4" />
                  </ClayButton>
                </div>
              </div>
            );
          })}
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
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <ClipboardCheck className="h-5 w-5 text-electric-blue shrink-0" />
            <p className="text-sm text-slate-600">
              Complete each check below before sending the vehicle to QC.
            </p>
          </div>

          <div className="space-y-2">
            {INSPECTION_CHECKS.map((check) => (
              <label
                key={check}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-electric-blue rounded border-slate-300"
                />
                <span className="text-sm text-slate-700">{check}</span>
              </label>
            ))}
          </div>

          <ClayInput label="Odometer Reading" placeholder="e.g. 42500" />
          <ClayTextarea
            label="Inspection Notes"
            placeholder="Add any notes about the inspection..."
            rows={3}
          />

          <div className="flex gap-3 pt-2">
            <ClayButton
              variant="primary"
              size="sm"
              onClick={() => setInspectionOpen(false)}
              className="flex-1 px-4 py-2"
            >
              Submit Inspection
            </ClayButton>
            <ClayButton
              variant="ghost"
              size="sm"
              onClick={() => setInspectionOpen(false)}
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
      <div className={`text-slate-500 text-xs font-medium uppercase tracking-wider mb-1 ${color}`}>{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </ClayCard>
  );
}