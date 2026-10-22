"use client";

import { useState } from "react";
import { Clock, Wrench, Bell, ChevronRight, Truck, CheckCircle2, Phone } from "lucide-react";
import { BOOKINGS, ESTIMATES, STATUS_LABELS } from "@/lib/mockData";
import { getVehicleById, getServicesByIds, getShopById } from "@/lib/mockData";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge, bookingStatusVariant } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { EstimateCard } from "@/components/customer/estimate-card";
import { StatusTimeline } from "@/components/customer/status-timeline";
import { ClayAvatar } from "@/components/ui/clay-avatar";
import { ClayModal } from "@/components/ui/clay-modal";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("active");
  const [estimateStatus, setEstimateStatus] = useState<Record<string, "PENDING" | "ACCEPTED" | "REJECTED">>(() =>
    Object.fromEntries(ESTIMATES.map((e) => [e.id, e.status]))
  );
  const [estimateNotice, setEstimateNotice] = useState<string | null>(null);
  const [detailBookingId, setDetailBookingId] = useState<string | null>(null);
  const bookings = BOOKINGS.filter(b => b.customerId === "cust-1");
  const activeBookings = bookings.filter(b => b.status !== "COMPLETED" && b.status !== "CANCELLED");
  const pendingEstimate = ESTIMATES.find(e => estimateStatus[e.id] === "PENDING");
  const detailBooking = bookings.find(b => b.id === detailBookingId) ?? null;
  const detailVehicle = detailBooking ? getVehicleById(detailBooking.vehicleId) : null;
  const detailServices = detailBooking ? getServicesByIds(detailBooking.serviceIds) : [];
  const primaryShop = getShopById(bookings[0]?.shopId ?? "shop-1");

  return (
    <div className="min-h-screen bg-[#f0ebe2]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2d3748]">Welcome back, Alex</h1>
            <p className="text-[#9a9186]">Here&apos;s what&apos;s happening with your vehicles</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <ClayButton
              variant="ghost"
              size="sm"
              className="px-3 py-2"
              onClick={() => {
                if (!primaryShop) return;
                window.location.assign(`tel:${primaryShop.phone.replace(/[^\d+]/g, "")}`);
              }}
              aria-label={`Call ${primaryShop?.name ?? "shop"}`}
            >
              <Phone className="h-4 w-4" /> Call Shop
            </ClayButton>
            <ClayAvatar name="Alex Rivera" size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Active Bookings" value={activeBookings.length} icon={<Wrench />} color="text-blue-600" />
          <StatCard label="Completed" value={bookings.filter(b => b.status === "COMPLETED").length} icon={<CheckCircle2 />} color="text-emerald-600" />
          <StatCard label="Pending Estimate" value={pendingEstimate ? 1 : 0} icon={<Clock />} color="text-amber-600" />
          <StatCard label="Notifications" value={3} icon={<Bell />} color="text-purple-600" />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#2d3748] mb-6">Live Service Tracker</h2>
          <ClayCard padding="lg">
            <div className="space-y-6">
              {bookings.map((booking) => {
                const vehicle = getVehicleById(booking.vehicleId);
                const service = getServicesByIds(booking.serviceIds);
                const statusInfo = STATUS_LABELS[booking.status];

                return (
                  <div key={booking.id} className="flex gap-6">
                    <div className="w-64 shrink-0">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#f0ebe2] flex items-center justify-center text-[#6b6258]">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-[#2d3748]">{vehicle?.make} {vehicle?.model}</div>
                          <div className="text-xs text-[#9a9186]">{vehicle?.plateNumber}</div>
                        </div>
                      </div>
                      <StatusTimeline currentStatus={booking.status} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <ClayBadge variant={bookingStatusVariant(booking.status)} className="text-xs">
                            {statusInfo.label}
                          </ClayBadge>
                          {booking.status === "READY_FOR_PICKUP" && (
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                              <Truck className="h-3 w-3" /> Ready for pickup
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#2d3748]">{formatDateTime(booking.scheduledAt)}</div>
                          <div className="text-xs text-[#9a9186]">{booking.technicianId ? "Assigned technician" : "Not assigned"}</div>
                        </div>
                      </div>
                      <div className="bg-[#f0ebe2] rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-[#4a433a]">Services:</span>
                          <span className="text-sm text-[#9a9186]">{service.map(s => s.name).join(", ")}</span>
                        </div>
                        {booking.notes && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-[#4a433a]">Notes:</span>
                            <span className="text-sm text-[#9a9186]">{booking.notes}</span>
                          </div>
                        )}
                      </div>
                      {booking.status === "READY_FOR_PICKUP" && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                          <div className="text-sm text-emerald-800">
                            Your vehicle is ready for pickup! Please bring your ID.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ClayCard>
        </div>

        {estimateNotice && (
          <div
            role="status"
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 mb-8"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{estimateNotice}</span>
            <button type="button" onClick={() => setEstimateNotice(null)} className="ml-auto text-xs font-semibold underline">
              Dismiss
            </button>
          </div>
        )}

        {pendingEstimate && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#2d3748] mb-6">Pending Estimate</h2>
            <ClayCard padding="lg">
              <EstimateCard
                estimate={{ ...pendingEstimate, status: estimateStatus[pendingEstimate.id] }}
                onAccept={() => {
                  setEstimateStatus(prev => ({ ...prev, [pendingEstimate.id]: "ACCEPTED" }));
                  setEstimateNotice(`Estimate #${pendingEstimate.id.slice(-4)} accepted. Your shop has been notified.`);
                }}
                onReject={() => {
                  setEstimateStatus(prev => ({ ...prev, [pendingEstimate.id]: "REJECTED" }));
                  setEstimateNotice(`Estimate #${pendingEstimate.id.slice(-4)} rejected. Your shop has been notified.`);
                }}
              />
            </ClayCard>
          </div>
        )}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#2d3748]">Booking History</h2>
            <div className="flex gap-2">
              <button onClick={() => setActiveTab("active")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "active" ? "bg-electric-blue text-[#fdfbf7] shadow-sm" : "bg-[#e8e2d4] text-[#6b6258] hover:bg-[#d4ccc0]"}`}>
                Active
              </button>
              <button onClick={() => setActiveTab("past")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "past" ? "bg-electric-blue text-[#fdfbf7] shadow-sm" : "bg-[#e8e2d4] text-[#6b6258] hover:bg-[#d4ccc0]"}`}>
                Past
              </button>
            </div>
          </div>
          <div className="clay-card overflow-hidden">
            <div className="divide-y divide-slate-200">
              {bookings.filter(b => activeTab === "active" ? b.status !== "COMPLETED" && b.status !== "CANCELLED" : b.status === "COMPLETED" || b.status === "CANCELLED").map((booking) => {
                const vehicle = getVehicleById(booking.vehicleId);
                return (
                  <div key={booking.id} className="p-6 flex justify-between items-start hover:bg-[#f0ebe2] transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#f0ebe2] flex items-center justify-center text-[#6b6258] text-xs">
                          {vehicle?.make[0]}{vehicle?.model[0]}
                        </div>
                        <div>
                          <div className="font-bold text-[#2d3748]">{vehicle?.make} {vehicle?.model}</div>
                          <div className="text-xs text-[#9a9186]">{vehicle?.plateNumber}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#6b6258]">{formatDateTime(booking.scheduledAt)}</span>
                        <ClayBadge variant={bookingStatusVariant(booking.status)} className="text-xs">
                          {STATUS_LABELS[booking.status].label}
                        </ClayBadge>
                      </div>
                    </div>
                    <div className="text-right">
                      {booking.totalAmount && (
                        <div className="text-lg font-bold text-[#2d3748]">{formatCurrency(booking.totalAmount)}</div>
                      )}
                      <button
                        type="button"
                        onClick={() => setDetailBookingId(booking.id)}
                        className="mt-2 text-sm text-electric-blue font-medium hover:underline inline-flex items-center"
                      >
                        View Details <ChevronRight className="h-3 w-3 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {bookings.length === 0 && (
                <div className="p-8 text-center text-[#9a9186]">
                  No bookings found.
                </div>
              )}
            </div>
          </div>
        </div>

        <ClayModal
          isOpen={!!detailBooking}
          onClose={() => setDetailBookingId(null)}
          title={detailBooking ? `Booking #${detailBooking.id.slice(-3)}` : "Booking"}
        >
          {detailBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-[#2d3748]">
                    {detailVehicle ? `${detailVehicle.make} ${detailVehicle.model}` : "Vehicle"}
                  </div>
                  <div className="text-sm text-[#9a9186]">{detailVehicle?.plateNumber}</div>
                </div>
                <ClayBadge variant={bookingStatusVariant(detailBooking.status)} className="text-xs">
                  {STATUS_LABELS[detailBooking.status].label}
                </ClayBadge>
              </div>

              <div className="p-3 rounded-xl bg-[#f0ebe2] text-sm text-[#6b6258]">
                <span className="font-medium text-[#2d3748]">Scheduled:</span>{" "}
                {formatDateTime(detailBooking.scheduledAt)}
              </div>

              <div>
                <div className="text-sm font-semibold text-[#2d3748] mb-2">Services</div>
                {detailServices.length === 0 ? (
                  <p className="text-sm text-[#9a9186]">No services on this booking.</p>
                ) : (
                  <ul className="space-y-1">
                    {detailServices.map((s) => (
                      <li key={s.id} className="text-sm text-[#6b6258] flex justify-between gap-4">
                        <span>{s.name}</span>
                        <span className="text-[#9a9186]">{formatCurrency(s.basePrice)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {detailBooking.notes && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
                  <span className="font-semibold">Notes:</span> {detailBooking.notes}
                </div>
              )}

              {detailBooking.totalAmount && (
                <div className="flex justify-between border-t pt-3 text-lg font-bold text-[#2d3748]">
                  <span>Total</span>
                  <span>{formatCurrency(detailBooking.totalAmount)}</span>
                </div>
              )}
            </div>
          )}
        </ClayModal>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <ClayCard padding="sm" className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className={color}>{icon}</span>
        <span className="text-[#9a9186] text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#2d3748]">{value}</div>
    </ClayCard>
  );
}
