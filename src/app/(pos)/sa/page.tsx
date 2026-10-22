"use client";

import { useState } from "react";
import { Plus, Filter, CheckCircle2 } from "lucide-react";
import { BOOKINGS, STAFF, STATUS_LABELS, getServicesByIds, getVehicleById, type Booking } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge, bookingStatusVariant } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { ClayModal } from "@/components/ui/clay-modal";
import { ClaySelect } from "@/components/ui/clay-input";

export default function SADashboard() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignBookingId, setAssignBookingId] = useState("");
  const [assignTechId, setAssignTechId] = useState("");
  const [assignError, setAssignError] = useState<string | undefined>(undefined);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

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
  const technicians = STAFF.filter((s) => s.role === "TECHNICIAN");

  const closeAssignModal = () => {
    setAssignOpen(false);
    setAssignBookingId("");
    setAssignTechId("");
    setAssignError(undefined);
  };

  const handleAssign = () => {
    if (!assignBookingId || !assignTechId) {
      setAssignError("Select both a booking and a technician");
      return;
    }
    setAssignError(undefined);
    const booking = BOOKINGS.find((b) => b.id === assignBookingId);
    const tech = STAFF.find((s) => s.id === assignTechId);
    setAssignments(prev => ({ ...prev, [assignBookingId]: assignTechId }));
    setNotice(`${tech?.name ?? "Technician"} assigned to booking #${booking?.id.slice(-3) ?? ""}.`);
    closeAssignModal();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">Service Advisor Dashboard</h1>
          <p className="text-[#9a9186]">Manage bookings, estimates, and technician assignments</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton variant="primary" size="sm" className="px-4 py-2" onClick={() => setAssignOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Assign Technician
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
        <StatCard label="Pending" value={statuses.find(s => s.key === "PENDING")?.count || 0} color="text-amber-600" />
        <StatCard label="Confirmed" value={statuses.find(s => s.key === "CONFIRMED")?.count || 0} color="text-blue-600" />
        <StatCard label="In Progress" value={statuses.find(s => s.key === "IN_PROGRESS")?.count || 0} color="text-blue-600" />
        <StatCard label="Ready" value={statuses.find(s => s.key === "READY_FOR_PICKUP")?.count || 0} color="text-emerald-600" />
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-[#e2ddd0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#9a9186]" />
            <span className="text-sm font-medium text-[#4a433a]">Filter by Status</span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setStatusFilter(s.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s.key
                    ? "bg-electric-blue text-[#fdfbf7] shadow-sm"
                    : "bg-[#f0ebe2] text-[#6b6258] hover:bg-[#f0ebe2]"
                }`}
              >
                {s.label} ({s.count})
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f0ebe2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="h-6 w-6 text-[#b8aea5]" />
            </div>
            <h3 className="text-lg font-bold text-[#2d3748]">No bookings here</h3>
            <p className="text-[#9a9186] text-sm">
              No bookings match the &ldquo;{statuses.find(s => s.key === statusFilter)?.label}&rdquo; filter.
            </p>
            <ClayButton variant="ghost" size="sm" onClick={() => setStatusFilter("all")} className="mt-4 px-4 py-2">
              Show all bookings
            </ClayButton>
          </div>
        ) : (
          <BookingList
            bookings={filtered}
            assignments={assignments}
            onView={(booking) => setDetailBooking(booking)}
          />
        )}
      </div>

      <ClayModal isOpen={assignOpen} onClose={closeAssignModal} title="Assign Technician">
        <div className="space-y-4">
          <p className="text-sm text-[#6b6258]">
            Choose a booking and the technician who will handle the work.
          </p>
          <ClaySelect
            label="Booking"
            value={assignBookingId}
            onChange={(e) => setAssignBookingId(e.target.value)}
            error={assignError && !assignBookingId ? "Select a booking" : undefined}
          >
            <option value="">Select a booking...</option>
            {BOOKINGS.map((b) => (
              <option key={b.id} value={b.id}>
                #{b.id.slice(-3)} — {STATUS_LABELS[b.status].label}
              </option>
            ))}
          </ClaySelect>
          <ClaySelect
            label="Technician"
            value={assignTechId}
            onChange={(e) => setAssignTechId(e.target.value)}
            error={assignError && !assignTechId ? "Select a technician" : undefined}
          >
            <option value="">Select a technician...</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </ClaySelect>
          {assignError && (
            <p className="text-sm text-rose-accent">{assignError}</p>
          )}
          <div className="flex gap-3 pt-2">
            <ClayButton variant="primary" size="sm" className="flex-1 px-4 py-2" onClick={handleAssign}>
              Assign
            </ClayButton>
            <ClayButton variant="ghost" size="sm" className="flex-1 px-4 py-2" onClick={closeAssignModal}>
              Cancel
            </ClayButton>
          </div>
        </div>
      </ClayModal>

      <ClayModal
        isOpen={!!detailBooking}
        onClose={() => setDetailBooking(null)}
        title={detailBooking ? `Booking #${detailBooking.id.slice(-3)}` : "Booking"}
      >
        {detailBooking && (
          <BookingDetail
            booking={detailBooking}
            technicianName={
              assignments[detailBooking.id]
                ? STAFF.find((s) => s.id === assignments[detailBooking.id])?.name
                : undefined
            }
          />
        )}
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

function BookingList({
  bookings,
  assignments,
  onView,
}: {
  bookings: typeof BOOKINGS;
  assignments: Record<string, string>;
  onView: (booking: Booking) => void;
}) {
  return (
    <div className="divide-y divide-[#e2ddd0]">
      {bookings.map((booking) => {
        const vehicle = getVehicleById(booking.vehicleId);
        const services = getServicesByIds(booking.serviceIds);
        const technicianId = assignments[booking.id] ?? booking.technicianId;
        const technician = technicianId ? STAFF.find((s) => s.id === technicianId) : undefined;

        return (
          <div key={booking.id} className="p-6 flex flex-col sm:flex-row justify-between sm:items-start gap-4 hover:bg-[#f0ebe2] transition-colors group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-right">
                  <div className="text-xs font-medium text-[#9a9186]">#{booking.id.slice(-3)}</div>
                </div>
                {vehicle && (
                  <div className="text-sm font-semibold text-[#2d3748]">
                    {vehicle.make} {vehicle.model}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm mb-4 flex-wrap">
                <span className="text-[#6b6258]">{booking.scheduledAt.split("T")[0]}</span>
                <ClayBadge variant={bookingStatusVariant(booking.status)} className="text-xs">
                  {STATUS_LABELS[booking.status].label}
                </ClayBadge>
                {technician && (
                  <span className="text-xs text-[#9a9186]">Technician: {technician.name}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-[#6b6258] mb-4 flex-wrap">
                {services.length > 0 ? (
                  services.map((s) => (
                    <span key={s.id} className="px-2 py-1 rounded-lg bg-[#f0ebe2] text-xs text-[#6b6258]">
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#b8aea5]">No services listed</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClayButton
                variant="ghost"
                size="sm"
                className="px-3 py-2 text-[#9a9186]"
                onClick={() => onView(booking)}
                aria-label={`View booking ${booking.id}`}
              >
                View
              </ClayButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookingDetail({ booking, technicianName }: { booking: Booking; technicianName?: string }) {
  const vehicle = getVehicleById(booking.vehicleId);
  const services = getServicesByIds(booking.serviceIds);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-bold text-[#2d3748]">
            {vehicle ? `${vehicle.make} ${vehicle.model}` : "Vehicle"}
          </div>
          <div className="text-sm text-[#9a9186]">
            {vehicle ? vehicle.plateNumber : booking.vehicleId}
          </div>
        </div>
        <ClayBadge variant={bookingStatusVariant(booking.status)} className="text-xs">
          {STATUS_LABELS[booking.status].label}
        </ClayBadge>
      </div>

      <dl className="space-y-2">
        <div className="flex justify-between gap-4 p-3 rounded-xl bg-[#f0ebe2]">
          <dt className="text-sm text-[#9a9186]">Scheduled</dt>
          <dd className="text-sm font-medium text-[#2d3748]">{booking.scheduledAt.split("T")[0]}</dd>
        </div>
        <div className="flex justify-between gap-4 p-3 rounded-xl bg-[#f0ebe2]">
          <dt className="text-sm text-[#9a9186]">Technician</dt>
          <dd className="text-sm font-medium text-[#2d3748]">{technicianName ?? "Not assigned"}</dd>
        </div>
        <div className="flex justify-between gap-4 p-3 rounded-xl bg-[#f0ebe2]">
          <dt className="text-sm text-[#9a9186]">Total</dt>
          <dd className="text-sm font-medium text-[#2d3748]">
            {booking.totalAmount ? formatCurrency(booking.totalAmount) : "—"}
          </dd>
        </div>
      </dl>

      <div>
        <div className="text-sm font-semibold text-[#2d3748] mb-2">Services</div>
        {services.length === 0 ? (
          <p className="text-sm text-[#9a9186]">No services on this booking.</p>
        ) : (
          <ul className="space-y-1">
            {services.map((s) => (
              <li key={s.id} className="text-sm text-[#6b6258] flex justify-between gap-4">
                <span>{s.name}</span>
                <span className="text-[#9a9186]">{formatCurrency(s.basePrice)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {booking.notes && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <span className="font-semibold">Notes:</span> {booking.notes}
        </div>
      )}
    </div>
  );
}