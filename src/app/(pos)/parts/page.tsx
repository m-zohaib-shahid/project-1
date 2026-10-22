"use client";

import { useMemo, useState } from "react";
import { Package, Plus, ArrowRight, CheckCircle2, Search } from "lucide-react";
import { INVENTORY, JOB_CARDS, getVehicleById, type InventoryItem } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";
import { ClayInput } from "@/components/ui/clay-input";
import { ClayModal } from "@/components/ui/clay-modal";

export default function PartsDashboard() {
  const [poModalOpen, setPOModalOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>(INVENTORY);
  const [search, setSearch] = useState("");
  const [poForm, setPoForm] = useState({ supplier: "", expectedDelivery: "" });
  const [poErrors, setPoErrors] = useState<{ supplier?: string; expectedDelivery?: string }>({});
  const [poTouched, setPoTouched] = useState(false);
  const [poSent, setPoSent] = useState<string | null>(null);
  const [allocatedJobs, setAllocatedJobs] = useState<string[]>([]);
  const [detailItem, setDetailItem] = useState<InventoryItem | null>(null);

  const lowStockItems = useMemo(
    () => inventory.filter(i => i.quantity <= i.reorderLevel),
    [inventory]
  );

  const filteredInventory = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inventory;
    return inventory.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const jobsAwaitingParts = JOB_CARDS.filter(
    (j) => j.status === "WAITING_PARTS" && !allocatedJobs.includes(j.id)
  );

  const closePOModal = () => {
    setPOModalOpen(false);
    setPoForm({ supplier: "", expectedDelivery: "" });
    setPoErrors({});
    setPoTouched(false);
  };

  const handleSendPO = () => {
    const errors: { supplier?: string; expectedDelivery?: string } = {};
    if (!poForm.supplier.trim()) errors.supplier = "Supplier name is required";
    if (!poForm.expectedDelivery) errors.expectedDelivery = "Expected delivery date is required";
    setPoErrors(errors);
    setPoTouched(true);
    if (Object.keys(errors).length > 0) return;

    setPoSent(
      `Purchase order sent to ${poForm.supplier.trim()} for ${lowStockItems.length} low-stock item(s).`
    );
    closePOModal();
  };

  const allocateParts = (jobId: string, needed: string[]) => {
    setInventory(prev =>
      prev.map((item) => (needed.includes(item.name) ? { ...item, quantity: item.quantity + 1 } : item))
    );
    setAllocatedJobs(prev => [...prev, jobId]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2d3748]">Parts Inventory</h1>
          <p className="text-[#9a9186]">Manage stock levels, purchase orders, and parts allocation</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ClayButton variant="primary" size="sm" onClick={() => setPOModalOpen(true)} className="px-4 py-2">
            <Plus className="h-4 w-4 mr-2" /> Create PO
          </ClayButton>
        </div>
      </div>

      {poSent && (
        <div
          role="status"
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{poSent}</span>
          <button type="button" onClick={() => setPoSent(null)} className="ml-auto text-xs font-semibold underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total SKUs" value={inventory.length} color="text-blue-600" />
        <StatCard label="Low Stock" value={lowStockItems.length} color="text-amber-600" />
        <StatCard label="Out of Stock" value={inventory.filter(i => i.quantity === 0).length} color="text-rose-600" />
        <StatCard label="Total Value" value={formatCurrency(inventory.reduce((acc, i) => acc + i.quantity * i.unitCost, 0))} color="text-emerald-600" />
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-[#e2ddd0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-[#9a9186]" />
            <span className="text-sm font-medium text-[#4a433a]">Inventory Stock</span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#b8aea5] pointer-events-none" />
              <ClayInput
                placeholder="Search SKU or part name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full"
                aria-label="Search inventory"
              />
            </div>
          </div>
        </div>

        {filteredInventory.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f0ebe2] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-[#b8aea5]" />
            </div>
            <h3 className="text-lg font-bold text-[#2d3748]">No parts found</h3>
            <p className="text-[#9a9186] text-sm">No inventory items match &ldquo;{search.trim()}&rdquo;.</p>
            <ClayButton variant="ghost" size="sm" onClick={() => setSearch("")} className="mt-4 px-4 py-2">
              Clear search
            </ClayButton>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left divide-y divide-[#e2ddd0]">
            <thead>
              <tr className="bg-[#f0ebe2]">
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">SKU</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Qty</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Reorder</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Unit Cost</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Location</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-[#9a9186] uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2ddd0]">
              {filteredInventory.map((item) => {
                const isLowStock = item.quantity <= item.reorderLevel;
                const isOutOfStock = item.quantity === 0;
                return (
                  <tr key={item.id} className="hover:bg-[#f0ebe2] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2d3748]">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-[#2d3748]">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-[#9a9186]">{item.category}</td>
                    <td className={`px-6 py-4 text-sm ${isOutOfStock ? "text-rose-600 font-medium" : isLowStock ? "text-amber-600 font-medium" : "text-[#6b6258]"}`}>
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#9a9186]">{item.reorderLevel}</td>
                    <td className="px-6 py-4 text-sm text-[#6b6258]">{formatCurrency(item.unitCost)}</td>
                    <td className="px-6 py-4 text-sm text-[#9a9186]">{item.location}</td>
                    <td className="px-6 py-4">
                      <ClayBadge variant={isOutOfStock ? "danger" : isLowStock ? "warning" : "success"} className="text-xs">
                        {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                      </ClayBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                          <ClayButton
                            variant="ghost"
                            size="sm"
                            className="p-2"
                            onClick={() => setDetailItem(item)}
                            aria-label={`View details for ${item.name}`}
                          >
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
        )}
      </div>

      <div className="clay-card overflow-hidden">
        <div className="p-6 border-b border-[#e2ddd0]">
          <h2 className="text-lg font-bold text-[#2d3748]">Jobs Awaiting Parts</h2>
        </div>
        {jobsAwaitingParts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-[#2d3748]">No jobs waiting on parts</h3>
            <p className="text-[#9a9186] text-sm">
              {allocatedJobs.length > 0
                ? "All pending part requests have been allocated."
                : "Every job card has all the parts it needs."}
            </p>
          </div>
        ) : (
        <div className="divide-y divide-[#e2ddd0]">
          {jobsAwaitingParts.map((job) => {
            const vehicle = getVehicleById(job.vehicle.id);
            return (
              <div key={job.id} className="p-6 flex justify-between items-start hover:bg-[#f0ebe2] transition-colors">
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
                  <div className="flex items-center gap-3 text-sm text-[#6b6258]">
                    <span>Parts needed: {job.partsNeeded.length}</span>
                    <ClayBadge variant="warning" className="text-xs">Shortage</ClayBadge>
                  </div>
                  {job.partsNeeded.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {job.partsNeeded.map((part) => (
                        <li key={part} className="text-xs px-2 py-1 rounded-lg bg-[#f0ebe2] text-[#6b6258]">
                          {part}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ClayButton
                    variant="primary"
                    size="sm"
                    className="px-3 py-2"
                    onClick={() => allocateParts(job.id, job.partsNeeded)}
                  >
                    Allocate Parts
                  </ClayButton>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      <ClayModal isOpen={poModalOpen} onClose={closePOModal} title="Create Purchase Order">
        <div className="space-y-4">
          <p className="text-sm text-[#6b6258]">Create a purchase order to restock low inventory items:</p>
          <div className="space-y-3">
            <ClayInput
              label="Supplier"
              placeholder="Enter supplier name..."
              value={poForm.supplier}
              onChange={(e) => setPoForm(prev => ({ ...prev, supplier: e.target.value }))}
              error={poTouched ? poErrors.supplier : undefined}
            />
            <ClayInput
              label="Expected Delivery"
              type="date"
              value={poForm.expectedDelivery}
              onChange={(e) => setPoForm(prev => ({ ...prev, expectedDelivery: e.target.value }))}
              error={poTouched ? poErrors.expectedDelivery : undefined}
            />
          </div>
          <div className="bg-[#f0ebe2] rounded-lg p-4 border border-[#e2ddd0]">
            <h4 className="text-sm font-bold text-[#2d3748] mb-3">Suggested Items to Order</h4>
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-[#9a9186]">No items are below their reorder level right now.</p>
            ) : (
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-[#fefaf5] rounded border border-[#e2ddd0]">
                  <div>
                    <div className="text-sm text-[#2d3748]">{item.name}</div>
                    <div className="text-xs text-[#9a9186]">Current: {item.quantity} • Reorder: {item.reorderLevel}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#2d3748]">{formatCurrency(item.unitCost)}</div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <ClayButton variant="primary" size="sm" className="flex-1 px-4 py-2" onClick={handleSendPO}>
              Send PO
            </ClayButton>
            <ClayButton variant="ghost" size="sm" onClick={closePOModal} className="flex-1 px-4 py-2">
              Cancel
            </ClayButton>
          </div>
        </div>
      </ClayModal>

      <ClayModal isOpen={!!detailItem} onClose={() => setDetailItem(null)} title="Part Details">
        {detailItem && (
          <div className="space-y-4">
            <div>
              <div className="font-bold text-[#2d3748]">{detailItem.name}</div>
              <div className="text-sm text-[#9a9186]">SKU {detailItem.sku} • {detailItem.category}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#f0ebe2]">
                <div className="text-xs text-[#9a9186]">Quantity</div>
                <div className="text-lg font-bold text-[#2d3748]">{detailItem.quantity}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0ebe2]">
                <div className="text-xs text-[#9a9186]">Reorder Level</div>
                <div className="text-lg font-bold text-[#2d3748]">{detailItem.reorderLevel}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0ebe2]">
                <div className="text-xs text-[#9a9186]">Unit Cost</div>
                <div className="text-lg font-bold text-[#2d3748]">{formatCurrency(detailItem.unitCost)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0ebe2]">
                <div className="text-xs text-[#9a9186]">Location</div>
                <div className="text-lg font-bold text-[#2d3748]">{detailItem.location}</div>
              </div>
            </div>
            <ClayButton variant="ghost" size="sm" onClick={() => setDetailItem(null)} className="w-full px-4 py-2">
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