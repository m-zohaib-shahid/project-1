"use client";

import { useState } from "react";
import { Clock, Hammer } from "lucide-react";
import { Estimate } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayBadge } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";

interface EstimateCardProps {
  estimate: Estimate;
  onAccept?: () => void;
  onReject?: () => void;
}

export function EstimateCard({ estimate, onAccept, onReject }: EstimateCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <ClayCard className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#2d3748]">Repair Estimate</h3>
          <p className="text-sm text-[#9a9186]">
            Estimate #{estimate.id.slice(-4)} • Valid until{" "}
            {new Date(estimate.validUntil).toLocaleDateString()}
          </p>
        </div>
        <ClayBadge
          variant={
            estimate.status === "ACCEPTED"
              ? "success"
              : estimate.status === "REJECTED"
              ? "danger"
              : "warning"
          }
          className="text-xs"
        >
          {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1).toLowerCase()}
        </ClayBadge>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e2ddd0]">
        <div className="flex items-center bg-[#f0ebe2] px-4 py-3 cursor-pointer hover:bg-[#f0ebe2] transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="font-medium text-[#4a433a]">Line Items</span>
          <div className="ml-auto">
            <span className="text-xs text-[#9a9186]">{estimate.items.length} items</span>
            <svg className={`w-4 h-4 text-[#9a9186] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {isExpanded && (
          <div className="divide-y border-t border-[#e2ddd0]">
            {estimate.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f0ebe2] flex items-center justify-center text-[#6b6258]">
                    {item.type === "PART" ? (
                      <Hammer className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#2d3748]">{item.name}</div>
                    <div className="text-xs text-[#9a9186]">
                      {item.type === "PART" ? "Part" : "Labour"} • Qty: {item.quantity}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#2d3748]">{formatCurrency(item.total)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex justify-between text-lg font-bold text-electric-blue">
          <span>Parts Total</span>
          <span>{formatCurrency(estimate.partsTotal)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-amber-600">
          <span>Labour Total</span>
          <span>{formatCurrency(estimate.labourTotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-[#6b6258]">
          <span>Tax</span>
          <span>{formatCurrency(estimate.tax)}</span>
        </div>
        {estimate.discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-600">
            <span>Discount</span>
            <span>-{formatCurrency(estimate.discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t pt-3 text-lg font-bold text-[#2d3748]">
          <span>Grand Total</span>
          <span>{formatCurrency(estimate.grandTotal)}</span>
        </div>
      </div>

      {estimate.status === "PENDING" && (
        <div className="mt-6 flex gap-3">
          <ClayButton
            variant="success"
            onClick={onAccept}
            className="flex-1"
          >
            Accept Estimate
          </ClayButton>
          <ClayButton
            variant="danger"
            onClick={onReject}
            className="flex-1"
          >
            Reject Estimate
          </ClayButton>
        </div>
      )}
    </ClayCard>
  );
}