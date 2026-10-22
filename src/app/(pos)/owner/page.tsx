"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight, Mail, Shield } from "lucide-react";
import { BOOKINGS, STAFF, INVENTORY, SHOPS, type User } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { ClayInput, ClaySelect } from "@/components/ui/clay-input";
import { ClayModal } from "@/components/ui/clay-modal";

const STAFF_ROLES = ["Service Advisor", "Technician", "Parts Person", "QC Inspector"] as const;

const ROLE_TO_USER_ROLE: Record<(typeof STAFF_ROLES)[number], User["role"]> = {
  "Service Advisor": "SA",
  Technician: "TECHNICIAN",
  "Parts Person": "PARTS",
  "QC Inspector": "QC",
};

interface StaffFormState {
  name: string;
  email: string;
  role: (typeof STAFF_ROLES)[number];
}

interface StaffFormErrors {
  name?: string;
  email?: string;
  role?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateStaffForm(form: StaffFormState): StaffFormErrors {
  const errors: StaffFormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
  if (!form.role) errors.role = "Role is required";
  return errors;
}

export default function OwnerDashboard() {
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [staffList, setStaffList] = useState<User[]>(STAFF);
  const [detailStaff, setDetailStaff] = useState<User | null>(null);
  const [form, setForm] = useState<StaffFormState>({ name: "", email: "", role: "Technician" });
  const [errors, setErrors] = useState<StaffFormErrors>({});
  const [formTouched, setFormTouched] = useState(false);

  const totalRevenue = BOOKINGS.filter(b => b.status === "COMPLETED").reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const activeJobs = BOOKINGS.filter(b => b.status !== "COMPLETED" && b.status !== "CANCELLED").length;

  const technicians = staffList.filter(s => s.role === "TECHNICIAN");

  const closeTeamModal = () => {
    setTeamModalOpen(false);
    setForm({ name: "", email: "", role: "Technician" });
    setErrors({});
    setFormTouched(false);
  };

  const handleAddStaff = () => {
    const nextErrors = validateStaffForm(form);
    setErrors(nextErrors);
    setFormTouched(true);
    if (Object.keys(nextErrors).length > 0) return;

    const newStaff: User = {
      id: `staff-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: ROLE_TO_USER_ROLE[form.role],
      shopId: SHOPS[0].id,
    };
    setStaffList(prev => [...prev, newStaff]);
    closeTeamModal();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">Owner Dashboard</h1>
          <p className="text-[#9a9186]">Multi-shop overview, team management, and business insights</p>
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
        <StatCard label="Shops" value={SHOPS.length} color="text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="clay-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#2d3748]">Team Management</h3>
            <span className="text-xs text-[#9a9186]">
              {staffList.length} staff &middot; {technicians.length} technicians
            </span>
          </div>
          <div className="space-y-4">
            {staffList.map((staff) => (
              <button
                key={staff.id}
                type="button"
                onClick={() => setDetailStaff(staff)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#e2ddd0] bg-[#f0ebe2] hover:bg-[#e8e2d4] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f0ebe2] flex items-center justify-center text-[#6b6258] text-xs">
                    {staff.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#2d3748]">{staff.name}</div>
                    <div className="text-xs text-[#9a9186]">{staff.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClayBadge variant="success" className="text-[10px] leading-none h-5 w-5">Active</ClayBadge>
                  <ChevronRight className="h-3 w-3 text-[#b8aea5]" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="clay-card p-6">
          <h3 className="text-lg font-bold text-[#2d3748] mb-6">Inventory Summary</h3>
          <div className="space-y-4">
            {INVENTORY.slice(0, 5).map((item) => {
              const isLowStock = item.quantity <= item.reorderLevel;
              return (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-[#e2ddd0] bg-[#f0ebe2]">
                  <div>
                    <div className="text-sm font-medium text-[#2d3748]">{item.name}</div>
                    <div className="text-xs text-[#9a9186]">SKU: {item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${isLowStock ? "text-amber-600" : "text-[#2d3748]"}`}>
                      {item.quantity}
                    </div>
                    <div className="text-xs text-[#9a9186]">in stock</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="clay-card p-6">
          <h3 className="text-lg font-bold text-[#2d3748] mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/sa" className="w-full flex items-center justify-between p-4 rounded-xl border border-[#e2ddd0] bg-[#f0ebe2] hover:bg-[#e8e2d4] transition-colors text-left group">
              <div>
                <div className="font-medium text-[#2d3748]">View SA Dashboard</div>
                <div className="text-xs text-[#9a9186]">Service Advisor view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#b8aea5] group-hover:text-electric-blue" />
            </Link>
            <Link href="/technician" className="w-full flex items-center justify-between p-4 rounded-xl border border-[#e2ddd0] bg-[#f0ebe2] hover:bg-[#e8e2d4] transition-colors text-left group">
              <div>
                <div className="font-medium text-[#2d3748]">View Technician Dashboard</div>
                <div className="text-xs text-[#9a9186]">Technician view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#b8aea5] group-hover:text-electric-blue" />
            </Link>
            <Link href="/parts" className="w-full flex items-center justify-between p-4 rounded-xl border border-[#e2ddd0] bg-[#f0ebe2] hover:bg-[#e8e2d4] transition-colors text-left group">
              <div>
                <div className="font-medium text-[#2d3748]">View Parts Dashboard</div>
                <div className="text-xs text-[#9a9186]">Parts person view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#b8aea5] group-hover:text-electric-blue" />
            </Link>
            <Link href="/qc" className="w-full flex items-center justify-between p-4 rounded-xl border border-[#e2ddd0] bg-[#f0ebe2] hover:bg-[#e8e2d4] transition-colors text-left group">
              <div>
                <div className="font-medium text-[#2d3748]">View QC Dashboard</div>
                <div className="text-xs text-[#9a9186]">QC Inspector view</div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#b8aea5] group-hover:text-electric-blue" />
            </Link>
          </div>
        </div>
      </div>

      <ClayModal isOpen={teamModalOpen} onClose={closeTeamModal} title="Add New Staff Member">
        <div className="space-y-4">
          <ClayInput
            label="Full Name"
            placeholder="Enter staff name..."
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            error={formTouched ? errors.name : undefined}
          />
          <ClayInput
            label="Email"
            type="email"
            placeholder="email@bayflow.com"
            value={form.email}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            error={formTouched ? errors.email : undefined}
          />
          <ClaySelect
            label="Role"
            value={form.role}
            onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value as StaffFormState["role"] }))}
            error={formTouched ? errors.role : undefined}
          >
            {STAFF_ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </ClaySelect>
          <div className="flex gap-3">
            <ClayButton variant="primary" size="sm" className="flex-1 px-4 py-2" onClick={handleAddStaff}>
              Add Staff
            </ClayButton>
            <ClayButton variant="ghost" size="sm" onClick={closeTeamModal} className="flex-1 px-4 py-2">
              Cancel
            </ClayButton>
          </div>
        </div>
      </ClayModal>

      <ClayModal isOpen={!!detailStaff} onClose={() => setDetailStaff(null)} title="Staff Details">
        {detailStaff && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#f0ebe2] flex items-center justify-center text-[#6b6258] font-bold">
                {detailStaff.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="font-bold text-[#2d3748]">{detailStaff.name}</div>
                <div className="text-sm text-[#9a9186]">{detailStaff.role}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f0ebe2]">
                <Mail className="h-4 w-4 text-[#b8aea5]" />
                <span className="text-sm text-[#4a433a] break-all">{detailStaff.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f0ebe2]">
                <Shield className="h-4 w-4 text-[#b8aea5]" />
                <span className="text-sm text-[#4a433a]">{detailStaff.role}</span>
              </div>
            </div>
            <ClayButton variant="ghost" size="sm" onClick={() => setDetailStaff(null)} className="w-full px-4 py-2">
              Close
            </ClayButton>
          </div>
        )}
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
