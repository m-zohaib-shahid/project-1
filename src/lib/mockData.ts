export type Role = "SA" | "TECHNICIAN" | "PARTS" | "QC" | "OWNER";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  shopId: string;
  avatar?: string;
};
export type Shop = {
  id: string;
  name: string;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  phone: string;
  services: string[];
  image: string;
  isOpen: boolean;
};
export type Service = {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  duration: number;
  description: string;
};
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  vin?: string;
};
export type BookingStatus =
  | "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "WAITING_PARTS"
  | "QC" | "READY_FOR_PICKUP" | "COMPLETED" | "CANCELLED" | "REJECTED";
export type Booking = {
  id: string;
  customerId: string;
  shopId: string;
  vehicleId: string;
  serviceIds: string[];
  status: BookingStatus;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
  estimateId?: string;
  totalAmount?: number;
  notes?: string;
  technicianId?: string;
  qcResult?: "PASSED" | "FAILED" | null;
  qcNotes?: string;
};
export type Estimate = {
  id: string;
  bookingId: string;
  items: EstimateItem[];
  partsTotal: number;
  labourTotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  validUntil: string;
};
export type EstimateItem = {
  id: string;
  name: string;
  type: "PART" | "LABOUR";
  quantity: number;
  unitCost: number;
  total: number;
};
export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitCost: number;
  location: string;
};
export type JobCard = {
  id: string;
  bookingId: string;
  vehicle: Vehicle;
  services: Service[];
  status: BookingStatus;
  assignedTechnicianId?: string;
  partsAssigned: string[];
  partsNeeded: string[];
  inspectionNotes?: string;
};

// Shops
export const SHOPS: Shop[] = [
  {
    id: "shop-1",
    name: "Precision Auto Care",
    address: "1248 Industrial Parkway",
    city: "Austin",
    rating: 4.9,
    reviewCount: 128,
    phone: "(512) 555-0142",
    services: ["Oil Change", "Brake Service", "Engine Diagnostics", "Tire Rotation", "Transmission Service"],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
    isOpen: true,
  },
  {
    id: "shop-2",
    name: "Elite Motors Workshop",
    address: "3821 Commerce Drive",
    city: "Dallas",
    rating: 4.7,
    reviewCount: 94,
    phone: "(214) 555-0188",
    services: ["Oil Change", "Brake Service", "AC Service", "Battery Replacement", "Alignment"],
    image: "https://images.unsplash.com/photo-1552514537-93a9d4c86006?w=400&h=300&fit=crop",
    isOpen: true,
  },
  {
    id: "shop-3",
    name: "Rapid Fit Garage",
    address: "765 Service Lane",
    city: "Houston",
    rating: 4.5,
    reviewCount: 76,
    phone: "(713) 555-0231",
    services: ["Oil Change", "Tire Rotation", "Brake Service", "Check Engine Light", "Suspension Repair"],
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    isOpen: false,
  },
];

// Services
export const SERVICES: Service[] = [
  { id: "svc-1", name: "Oil Change", category: "Maintenance", basePrice: 49.99, duration: 30, description: "Full synthetic oil change with filter replacement and multi-point inspection." },
  { id: "svc-2", name: "Brake Service", category: "Brakes", basePrice: 149.99, duration: 60, description: "Brake pad replacement, rotor resurfacing, and brake system inspection." },
  { id: "svc-3", name: "Check Engine Light Diagnostic", category: "Diagnostics", basePrice: 89.99, duration: 45, description: "Computer diagnostic scan to identify check engine light issues." },
  { id: "svc-4", name: "Tire Rotation", category: "Tires", basePrice: 29.99, duration: 20, description: "Tire rotation, pressure check, and tread wear inspection." },
  { id: "svc-5", name: "Transmission Service", category: "Transmission", basePrice: 199.99, duration: 90, description: "Transmission fluid flush, filter replacement, and system inspection." },
  { id: "svc-6", name: "AC Service", category: "Climate", basePrice: 129.99, duration: 60, description: "AC recharge, leak check, and climate system performance test." },
  { id: "svc-7", name: "Battery Replacement", category: "Electrical", basePrice: 79.99, duration: 30, description: "Battery testing, replacement, and electrical system check." },
  { id: "svc-8", name: "Wheel Alignment", category: "Suspension", basePrice: 99.99, duration: 45, description: "Computerized wheel alignment and suspension component inspection." },
];

// Users (Staff)
export const STAFF: User[] = [
  { id: "staff-1", name: "Marcus Chen", email: "marcus@bayflow.com", role: "SA", shopId: "shop-1" },
  { id: "staff-2", name: "Sarah Rodriguez", email: "sarah@bayflow.com", role: "TECHNICIAN", shopId: "shop-1" },
  { id: "staff-3", name: "David Okonkwo", email: "david@bayflow.com", role: "TECHNICIAN", shopId: "shop-1" },
  { id: "staff-4", name: "Lisa Park", email: "lisa@bayflow.com", role: "PARTS", shopId: "shop-1" },
  { id: "staff-5", name: "James Wilson", email: "james@bayflow.com", role: "QC", shopId: "shop-1" },
  { id: "staff-6", name: "Elena Torres", email: "elena@bayflow.com", role: "OWNER", shopId: "shop-1" },
];

// Current user (mock auth)
export const CURRENT_USER: User = STAFF[0];

// Vehicles
export const VEHICLES: Vehicle[] = [
  { id: "veh-1", make: "Toyota", model: "Camry", year: 2019, plateNumber: "ABC-1234", vin: "1HGCM82633A123456" },
  { id: "veh-2", make: "Honda", model: "Civic", year: 2020, plateNumber: "XYZ-5678" },
  { id: "veh-3", make: "Ford", model: "F-150", year: 2021, plateNumber: "TRK-9012" },
  { id: "veh-4", make: "Tesla", model: "Model 3", year: 2022, plateNumber: "EV-3344" },
  { id: "veh-5", make: "Chevrolet", model: "Malibu", year: 2018, plateNumber: "CHV-7788" },
];

// Bookings
export const BOOKINGS: Booking[] = [
  {
    id: "bk-001",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-1",
    serviceIds: ["svc-1", "svc-4"],
    status: "PENDING",
    scheduledAt: "2026-10-21T09:00:00",
    createdAt: "2026-10-20T08:30:00",
    updatedAt: "2026-10-20T08:30:00",
    notes: "Customer reports slight vibration at highway speeds.",
  },
  {
    id: "bk-002",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-2",
    serviceIds: ["svc-2"],
    status: "CONFIRMED",
    scheduledAt: "2026-10-21T11:00:00",
    createdAt: "2026-10-20T09:15:00",
    updatedAt: "2026-10-20T10:00:00",
    technicianId: "staff-2",
    notes: "Brake squealing when stopping.",
  },
  {
    id: "bk-003",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-3",
    serviceIds: ["svc-3"],
    status: "IN_PROGRESS",
    scheduledAt: "2026-10-20T14:00:00",
    createdAt: "2026-10-20T10:00:00",
    updatedAt: "2026-10-20T14:30:00",
    technicianId: "staff-3",
    notes: "Check engine light on, code P0420.",
  },
  {
    id: "bk-004",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-4",
    serviceIds: ["svc-1"],
    status: "WAITING_PARTS",
    scheduledAt: "2026-10-19T10:00:00",
    createdAt: "2026-10-19T08:00:00",
    updatedAt: "2026-10-20T11:00:00",
    technicianId: "staff-2",
    notes: "Oil change, waiting on oil filter.",
  },
  {
    id: "bk-005",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-5",
    serviceIds: ["svc-5"],
    status: "QC",
    scheduledAt: "2026-10-18T09:00:00",
    createdAt: "2026-10-17T09:00:00",
    updatedAt: "2026-10-20T09:00:00",
    technicianId: "staff-3",
    notes: "Transmission service completed, awaiting QC.",
  },
  {
    id: "bk-006",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-1",
    serviceIds: ["svc-6"],
    status: "READY_FOR_PICKUP",
    scheduledAt: "2026-10-18T11:00:00",
    createdAt: "2026-10-17T14:00:00",
    updatedAt: "2026-10-20T10:00:00",
    technicianId: "staff-2",
    totalAmount: 149.99,
    notes: "AC service completed, ready for pickup.",
  },
  {
    id: "bk-007",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-2",
    serviceIds: ["svc-7"],
    status: "COMPLETED",
    scheduledAt: "2026-10-15T10:00:00",
    createdAt: "2026-10-14T09:00:00",
    updatedAt: "2026-10-16T12:00:00",
    technicianId: "staff-3",
    totalAmount: 109.99,
    notes: "Battery replacement completed.",
  },
  {
    id: "bk-008",
    customerId: "cust-1",
    shopId: "shop-1",
    vehicleId: "veh-3",
    serviceIds: ["svc-8"],
    status: "CANCELLED",
    scheduledAt: "2026-10-14T09:00:00",
    createdAt: "2026-10-13T08:00:00",
    updatedAt: "2026-10-14T07:00:00",
    notes: "Customer cancelled due to scheduling conflict.",
  },
];

// Estimates
export const ESTIMATES: Estimate[] = [
  {
    id: "est-001",
    bookingId: "bk-003",
    items: [
      { id: "ei-1", name: "Catalytic Converter Gasket", type: "PART", quantity: 1, unitCost: 45.00, total: 45.00 },
      { id: "ei-2", name: "O2 Sensor", type: "PART", quantity: 1, unitCost: 89.99, total: 89.99 },
      { id: "ei-3", name: "Diagnostic Labour", type: "LABOUR", quantity: 1.5, unitCost: 95.00, total: 142.50 },
    ],
    partsTotal: 134.99,
    labourTotal: 142.50,
    tax: 22.37,
    discount: 0,
    grandTotal: 299.86,
    status: "PENDING",
    createdAt: "2026-10-20T15:00:00",
    validUntil: "2026-10-22T15:00:00",
  },
  {
    id: "est-002",
    bookingId: "bk-002",
    items: [
      { id: "ei-4", name: "Front Brake Pads (Ceramic)", type: "PART", quantity: 1, unitCost: 65.00, total: 65.00 },
      { id: "ei-5", name: "Brake Labour", type: "LABOUR", quantity: 1, unitCost: 95.00, total: 95.00 },
    ],
    partsTotal: 65.00,
    labourTotal: 95.00,
    tax: 12.75,
    discount: 10.00,
    grandTotal: 162.75,
    status: "ACCEPTED",
    createdAt: "2026-10-20T10:30:00",
    validUntil: "2026-10-22T10:30:00",
  },
];

// Inventory
export const INVENTORY: InventoryItem[] = [
  { id: "inv-1", sku: "OIL-001", name: "5W-30 Synthetic Oil (5qt)", category: "Fluids", quantity: 24, reorderLevel: 10, unitCost: 28.99, location: "Aisle A-1" },
  { id: "inv-2", sku: "FIL-002", name: "Oil Filter - Toyota Camry", category: "Filters", quantity: 3, reorderLevel: 8, unitCost: 12.50, location: "Aisle B-2" },
  { id: "inv-3", sku: "BRK-003", name: "Ceramic Brake Pads - Front", category: "Brakes", quantity: 12, reorderLevel: 5, unitCost: 65.00, location: "Aisle C-1" },
  { id: "inv-4", sku: "BRK-004", name: "Brake Rotors - Front Pair", category: "Brakes", quantity: 0, reorderLevel: 4, unitCost: 89.99, location: "Aisle C-2" },
  { id: "inv-5", sku: "BAT-005", name: "Automotive Battery 12V", category: "Electrical", quantity: 8, reorderLevel: 3, unitCost: 119.99, location: "Aisle D-1" },
  { id: "inv-6", sku: "TIR-006", name: "All-Season Tire 205/55R16", category: "Tires", quantity: 6, reorderLevel: 4, unitCost: 129.99, location: "Aisle E-1" },
  { id: "inv-7", sku: "SEN-007", name: "Oxygen Sensor", category: "Sensors", quantity: 2, reorderLevel: 5, unitCost: 89.99, location: "Aisle F-1" },
];

// Job cards for technicians
export const JOB_CARDS: JobCard[] = [
  {
    id: "jc-001",
    bookingId: "bk-003",
    vehicle: VEHICLES[2],
    services: [SERVICES[2]],
    status: "IN_PROGRESS",
    assignedTechnicianId: "staff-3",
    partsAssigned: [],
    partsNeeded: ["inv-7"],
    inspectionNotes: "P0420 code confirmed. Catalyst efficiency below threshold.",
  },
  {
    id: "jc-002",
    bookingId: "bk-004",
    vehicle: VEHICLES[3],
    services: [SERVICES[0]],
    status: "WAITING_PARTS",
    assignedTechnicianId: "staff-2",
    partsAssigned: ["inv-1"],
    partsNeeded: ["inv-2"],
    inspectionNotes: "Oil change ready, waiting on oil filter delivery.",
  },
  {
    id: "jc-003",
    bookingId: "bk-005",
    vehicle: VEHICLES[4],
    services: [SERVICES[4]],
    status: "QC",
    assignedTechnicianId: "staff-3",
    partsAssigned: [],
    partsNeeded: [],
    inspectionNotes: "Transmission service completed. Fluid level and condition verified.",
  },
];

// Helper getters
export function getShopById(id: string) {
  return SHOPS.find((s) => s.id === id);
}
export function getServiceById(id: string) {
  return SERVICES.find((s) => s.id === id);
}
export function getServicesByIds(ids: string[]): Service[] {
  return ids
    .map((id) => getServiceById(id))
    .filter((s): s is Service => s !== undefined);
}
export function getBookingById(id: string) {
  return BOOKINGS.find((b) => b.id === id);
}
export function getEstimateByBookingId(bookingId: string) {
  return ESTIMATES.find((e) => e.bookingId === bookingId);
}
export function getVehicleById(id: string) {
  return VEHICLES.find((v) => v.id === id);
}
export function getStaffById(id: string) {
  return STAFF.find((s) => s.id === id);
}
export function getInventoryById(id: string) {
  return INVENTORY.find((i) => i.id === id);
}
export function getJobCardByBookingId(bookingId: string) {
  return JOB_CARDS.find((j) => j.bookingId === bookingId);
}

// Status helpers
export const STATUS_LABELS: Record<BookingStatus, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800 border-blue-200" },
  WAITING_PARTS: { label: "Waiting Parts", color: "bg-amber-100 text-amber-800 border-amber-200" },
  QC: { label: "Quality Check", color: "bg-purple-100 text-purple-800 border-purple-200" },
  READY_FOR_PICKUP: { label: "Ready for Pickup", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  COMPLETED: { label: "Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-100 text-rose-800 border-rose-200" },
  REJECTED: { label: "Rejected", color: "bg-rose-100 text-rose-800 border-rose-200" },
};

// Timeline steps for live tracker
export const BOOKING_TIMELINE_STEPS = [
  { key: "PENDING", label: "Booked", description: "Appointment confirmed" },
  { key: "CONFIRMED", label: "Confirmed", description: "Shop confirmed appointment" },
  { key: "IN_PROGRESS", label: "In Repair", description: "Technician working on vehicle" },
  { key: "QC", label: "Quality Check", description: "Final inspection in progress" },
  { key: "READY_FOR_PICKUP", label: "Ready", description: "Vehicle ready for pickup" },
  { key: "COMPLETED", label: "Completed", description: "Service complete" },
] as const;