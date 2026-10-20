"use client";

import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { BOOKINGS, STAFF, INVENTORY } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { ClayInput } from "@/components/ui/clay-input";
import { ClayModal } from "@/components/ui/clay-modal";

export default function OwnerDashboard() {
  const [teamModalOpen, setTeamModalOpen] = useState(false);

  const totalRevenue = BOOKINGS.filter(b => b.status === "COMPLETED").reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const activeJobs = BOOKINGS.filter(b => b.status !== "COMPLETED" && b.status !== "CANCELLED").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Owner Dashboard</h1>
          <p className="text-slate-500">Multi-shop overview, team management, and business insights</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton variant="primary" size="sm" onClick={() => setTeamModalOpen(true)} className="px-4 py-2">
            <Plus className="h-4 w-4 mr-2" /> Add Staff
          </ClayButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} color="text-emerald-600" />
        <StatCard label="Active Jobs" value={activeJobs} color="text-blue-600" />
        <StatCard label="Avg. Turnaround" value="2.4 days" color="text-purple-600" />
        <StatCard label="Shops" value={1} color="text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="clay-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Team Management</h3>
          <div className="space-y-4">
            {STAFF.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs">
                    {staff.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{staff.name}</div>
                    <div className="text-xs text-slate-500">{staff.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClayBadge variant="success" className="text-[10px] leading-none h-5 w-5">Active</ClayBadge>
                  <ClayButton variant="ghost" size="sm" className="p-1.5">
                    <ChevronRight className="h-3 w-3" />
                  </ClayButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="clay-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Inventory Summary</h3>
          <div className="space-y-4">
            {INVENTORY.slice(0, 5).map((item) => {
              const isLowStock = item.quantity <= item.reorderLevel;
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">SKU: {item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${isLowStock ? "text-amber-600" : "text-slate-900"}`}>
                      {item.quantity}
                    </div>
                    <div className="text-xs text-slate-500">in stock</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="clay-card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left group">
              <div>
                <div className="font-medium text-slate-900">View SA Dashboard</div>
                <div className="text-xs text-slate-500">Service Advisor view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-electric-blue" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left group">
              <div>
                <div className="font-medium text-slate-900">View Technician Dashboard</div>
                <div className="text-xs text-slate-500">Technician view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-electric-blue" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left group">
              <div>
                <div className="font-medium text-slate-900">View Parts Dashboard</div>
                <div className="text-xs text-slate-500">Parts person view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-electric-blue" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left group">
              <div>
                <div className="font-medium text-slate-900">View QC Dashboard</div>
                <div className="text-xs text-slate-500">QC Inspector view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-electric-blue" />
            </button>
          </div>
        </div>
      </div>

      <ClayModal isOpen={teamModalOpen} onClose={() => setTeamModalOpen(false)} title="Add New Staff Member">
        <div className="space-y-4">
          <ClayInput label="Full Name" placeholder="Enter staff name..." />
          <ClayInput label="Email" type="email" placeholder="email@bayflow.com" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <select className="clay-input w-full px-4 py-2.5 text-slate-900 cursor-pointer">
              <option>Service Advisor</option>
              <option>Technician</option>
              <option>Parts Person</option>
              <option>QC Inspector</option>
            </select>
          </div>
          <div className="flex gap-3">
            <ClayButton variant="primary" size="sm" className="flex-1 px-4 py-2">
              Add Staff
            </ClayButton>
            <ClayButton variant="ghost" size="sm" onClick={() => setTeamModalOpen(false)} className="flex-1 px-4 py-2">
              Cancel
            </ClayButton>
          </div>
        </div>
      </ClayModal>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <ClayCard padding="sm" className="text-center">
      <div className={`text-slate-500 text-xs font-medium uppercase tracking-wider mb-1 ${color}`}>{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </ClayCard>
  );
}
