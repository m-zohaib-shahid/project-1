"use client";

import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { BOOKINGS, STATUS_LABELS } from "@/lib/mockData";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge, bookingStatusVariant } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";

export default function SADashboard() {
  const [statusFilter, setStatusFilter] = useState("all");

  const statuses = [
    { key: "all", label: "All", count: BOOKINGS.length },
    { key: "PENDING", label: "Pending", count: BOOKINGS.filter(b => b.status === "PENDING").length },
    { key: "CONFIRMED", label: "Confirmed", count: BOOKINGS.filter(b => b.status === "CONFIRMED").length },
    { key: "IN_PROGRESS", label: "In Progress", count: BOOKINGS.filter(b => b.status === "IN_PROGRESS").length },
    { key: "WAITING_PARTS", label: "Waiting Parts", count: BOOKINGS.filter(b => b.status === "WAITING_PARTS").length },
    { key: "QC", label: "QC", count: BOOKINGS.filter(b => b.status === "QC").length },
    { key: "READY_FOR_PICKUP", label: "Ready", count: BOOKINGS.filter(b => b.status === "READY_FOR_PICKUP").length },
  ];

  const filtered = statusFilter === "all" ? BOOKINGS : BOOKINGS.filter(b => b.status === statusFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Service Advisor Dashboard</h1>
          <p className="text-slate-500">Manage bookings, estimates, and technician assignments</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton variant="primary" size="sm" className="px-4 py-2">
            <Plus className="h-4 w-4 mr-2" /> Assign Technician
          </ClayButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending" value={statuses.find(s => s.key === "PENDING")?.count || 0} color="text-amber-600" />
        <StatCard label="Confirmed" value={statuses.find(s => s.key === "CONFIRMED")?.count || 0} color="text-blue-600" />
        <StatCard label="In Progress" value={statuses.find(s => s.key === "IN_PROGRESS")?.count || 0} color="text-blue-600" />
        <StatCard label="Ready" value={statuses.find(s => s.key === "READY_FOR_PICKUP")?.count || 0} color="text-emerald-600" />
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter by Status</span>
          </div>
          <div className="flex gap-1">
            {statuses.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s.key
                    ? "bg-electric-blue text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s.label} ({s.count})
              </button>
            ))}
          </div>
        </div>

        <BookingList bookings={filtered} />
      </div>
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

function BookingList({ bookings }: { bookings: typeof BOOKINGS }) {
  return (
    <div className="divide-y divide-slate-200">
      {bookings.map((booking) => (
        <div key={booking.id} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors group">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-right">
                <div className="text-xs font-medium text-slate-500">#{booking.id.slice(-3)}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm mb-4">
              <span className="text-slate-600">{booking.scheduledAt.split("T")[0]}</span>
              <ClayBadge variant={bookingStatusVariant(booking.status)} className="text-xs">
                {STATUS_LABELS[booking.status].label}
              </ClayBadge>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600 mb-4">
              <span>{booking.serviceIds.join(", ")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ClayButton variant="ghost" size="sm" className="px-3 py-2 text-slate-500">
              <span className="sr-only">View</span>
            </ClayButton>
          </div>
        </div>
      ))}
    </div>
  );
}