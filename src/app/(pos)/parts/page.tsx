"use client";

import { useState } from "react";
import { Package, Plus, ArrowRight } from "lucide-react";
import { INVENTORY, JOB_CARDS, getVehicleById } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { ClayInput } from "@/components/ui/clay-input";
import { ClayModal } from "@/components/ui/clay-modal";

export default function PartsDashboard() {
  const [poModalOpen, setPOModalOpen] = useState(false);

  const lowStockItems = INVENTORY.filter(i => i.quantity <= i.reorderLevel);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parts Inventory</h1>
          <p className="text-slate-500">Manage stock levels, purchase orders, and parts allocation</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton variant="primary" size="sm" onClick={() => setPOModalOpen(true)} className="px-4 py-2">
            <Plus className="h-4 w-4 mr-2" /> Create PO
          </ClayButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total SKUs" value={INVENTORY.length} color="text-blue-600" />
        <StatCard label="Low Stock" value={lowStockItems.length} color="text-amber-600" />
        <StatCard label="Out of Stock" value={INVENTORY.filter(i => i.quantity === 0).length} color="text-rose-600" />
        <StatCard label="Total Value" value={INVENTORY.reduce((acc, i) => acc + i.quantity * i.unitCost, 0).toFixed(2)} color="text-emerald-600" />
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Inventory Stock</span>
          </div>
          <div className="flex gap-2">
            <ClayInput placeholder="Search SKU or part name..." className="w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Reorder</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Unit Cost</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Location</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {INVENTORY.map((item) => {
                const isLowStock = item.quantity <= item.reorderLevel;
                const isOutOfStock = item.quantity === 0;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                    <td className={`px-6 py-4 text-sm ${isOutOfStock ? "text-rose-600 font-medium" : isLowStock ? "text-amber-600 font-medium" : "text-slate-600"}`}>
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.reorderLevel}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatCurrency(item.unitCost)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.location}</td>
                    <td className="px-6 py-4">
                      <ClayBadge variant={isOutOfStock ? "danger" : isLowStock ? "warning" : "success"} className="text-xs">
                        {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                      </ClayBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ClayButton variant="ghost" size="sm" className="p-2">
                          <ArrowRight className="h-4 w-4" />
                        </ClayButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Jobs Awaiting Parts</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {JOB_CARDS.filter(j => j.status === "WAITING_PARTS").map((job) => {
            const vehicle = getVehicleById(job.vehicle.id);
            return (
              <div key={job.id} className="p-6 flex justify-between items-start hover:bg-slate-50 transition-colors">
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
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span>Parts needed: {job.partsNeeded.length}</span>
                    <ClayBadge variant="warning" className="text-xs">Shortage</ClayBadge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClayButton variant="primary" size="sm" className="px-3 py-2">
                    Allocate Parts
                  </ClayButton>
                  <ClayButton variant="ghost" size="sm" className="px-3 py-2 text-slate-500">
                    <ArrowRight className="h-4 w-4" />
                  </ClayButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ClayModal isOpen={poModalOpen} onClose={() => setPOModalOpen(false)} title="Create Purchase Order">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Create a purchase order to restock low inventory items:</p>
          <div className="space-y-3">
            <ClayInput label="Supplier" placeholder="Enter supplier name..." />
            <ClayInput label="Expected Delivery" type="date" />
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Suggested Items to Order</h4>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                  <div>
                    <div className="text-sm text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">Current: {item.quantity} • Reorder: {item.reorderLevel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900">{formatCurrency(item.unitCost)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <ClayButton variant="primary" size="sm" className="flex-1 px-4 py-2">
              Send PO
            </ClayButton>
            <ClayButton variant="ghost" size="sm" onClick={() => setPOModalOpen(false)} className="flex-1 px-4 py-2">
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