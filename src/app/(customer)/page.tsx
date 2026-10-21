"use client";

import { useRef, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { SHOPS, SERVICES } from "@/lib/mockData";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayInput } from "@/components/ui/clay-input";
import { ClayCard } from "@/components/ui/clay-card";
import { ShopCard } from "@/components/customer/shop-card";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [showAllServices, setShowAllServices] = useState(false);
  const listingsRef = useRef<HTMLDivElement>(null);

  const cities = ["all", "Austin", "Dallas", "Houston"];
  const featuredServices = showAllServices ? SERVICES : SERVICES.slice(0, 4);

  const filteredShops = SHOPS.filter((shop) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      shop.name.toLowerCase().includes(query) ||
      shop.city.toLowerCase().includes(query) ||
      shop.services.some((s) => s.toLowerCase().includes(query));
    const matchesCity = cityFilter === "all" || shop.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-electric-blue/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now serving Austin, Dallas & Houston
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
              Keep Your Car Running <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-blue-500">Smoothly.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto">
              Find the best auto repair shops near you. Book services, track repairs in real-time,
              and manage estimates — all from one app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <ClayInput
                  placeholder="Search shops, services, or cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex-1 max-w-md">
                <select
                  className="clay-input w-full px-4 py-2.5 text-slate-900 cursor-pointer"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                >
                  <option value="all">All Cities</option>
                  {cities.slice(1).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <ClayButton variant="primary" size="lg" className="w-full sm:w-auto" onClick={scrollToListings}>
                Find a Shop <ChevronRight className="ml-2 h-4 w-4" />
              </ClayButton>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Services */}
      <div className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Popular Services</h2>
              <p className="text-slate-500">Everything your vehicle needs</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAllServices((prev) => !prev)}
              className="text-sm font-medium text-electric-blue hover:underline"
            >
              {showAllServices ? "Show fewer services" : "View all services"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ClayCard key={service.id} padding="sm" className="text-center group">
                <div className="w-12 h-12 bg-electric-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-electric-blue group-hover:text-white transition-colors">
                  <span className="text-lg">{getServiceIcon(service.category)}</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">{service.name}</h4>
                <p className="text-sm text-slate-500 mb-3">{service.description}</p>
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-900">${service.basePrice}</span>
                  <span className="text-xs text-slate-400">• {service.duration} min</span>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </div>

      {/* Shop Listings */}
      <div className="py-16" ref={listingsRef}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Repair Shops</h2>
              <p className="text-slate-500">Find a trusted shop near you</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCityFilter("all");
                scrollToListings();
              }}
              className="text-sm font-medium text-electric-blue hover:underline"
            >
              See all {SHOPS.length} shops
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
          {filteredShops.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No shops found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getServiceIcon(category: string) {
  const icons: Record<string, string> = {
    Maintenance: "🛢️",
    Brakes: "🛑",
    Diagnostics: "🔧",
    Tires: "🛞",
    Transmission: "⚙️",
    Climate: "❄️",
    Electrical: "🔋",
    Suspension: "🔩",
  };
  return icons[category] || "🔧";
}