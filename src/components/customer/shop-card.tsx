"use client";

import { Star, Phone } from "lucide-react";
import Image from "next/image";
import { Shop } from "@/lib/mockData";
import Link from "next/link";
import { ClayBadge } from "@/components/ui/clay-badge";
import { ClayCard } from "@/components/ui/clay-card";

export interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <ClayCard className="group hover:shadow-clay-card transition-shadow duration-300 cursor-pointer">
      <div className="relative h-48 overflow-hidden rounded-2xl">
        <Image
          src={shop.image}
          alt={shop.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2 py-1 rounded-lg shadow-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
          <span className="text-sm font-bold text-slate-800">{shop.rating}</span>
        </div>
        {!shop.isOpen && (
          <div className="absolute bottom-3 left-3 bg-rose-accent/90 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm">
            Closed
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{shop.name}</h3>
            <p className="text-sm text-slate-500">{shop.address}, {shop.city}</p>
          </div>
          <ClayBadge variant={shop.isOpen ? "success" : "danger"} className="text-xs">
            {shop.isOpen ? "Open" : "Closed"}
          </ClayBadge>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
          <Phone className="h-4 w-4" />
          <a
            href={`tel:${shop.phone.replace(/[^\d+]/g, "")}`}
            className="hover:text-electric-blue hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {shop.phone}
          </a>
        </div>
        <div className="flex gap-2 mb-4">
          {shop.services.slice(0, 3).map((service) => (
            <span key={service} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">
              {service}
            </span>
          ))}
        </div>
        <Link
          href={`/book?shop=${encodeURIComponent(shop.id)}`}
          className="block w-full py-2.5 bg-electric-blue text-white rounded-xl font-semibold shadow-clay-button hover:shadow-[6px_6px_12px_rgba(163,177,198,0.4)] transition-all active:translate-y-[2px] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.2)] text-center"
        >
          Book Now
        </Link>
      </div>
    </ClayCard>
  );
}