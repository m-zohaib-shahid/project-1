"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SHOPS, SERVICES } from "@/lib/mockData";
import { ClayButton } from "@/components/ui/clay-button";
import { ClayInput } from "@/components/ui/clay-input";
import { ClayCard } from "@/components/ui/clay-card";

/**
 * Reads `location.search` as an external store so the value can be used
 * during render (no state-update-in-effect). The server snapshot is an empty
 * string, which keeps SSR and hydration consistent.
 */
function subscribeToUrl(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("hashchange", onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("hashchange", onStoreChange);
  };
}

function getUrlSearch() {
  return window.location.search;
}

function getServerUrlSearch() {
  return "";
}

type Step = 1 | 2 | 3 | 4 | 5;

interface SelectedService {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

interface BookingFormState {
  step: Step;
  selectedShopId: string | null;
  selectedServices: SelectedService[];
  selectedDate: string;
  selectedTime: string;
  vehicle: { make: string; model: string; year: string; plateNumber: string };
  customer: { name: string; email: string; password: string };
}

export default function BookingWizard() {
  // The `?shop=` query param pre-selects a shop (e.g. from a shop card).
  // Reading it as an external store keeps it derived from render — no effect.
  const search = useSyncExternalStore(subscribeToUrl, getUrlSearch, getServerUrlSearch);
  const preselectedShopId = useMemo(() => {
    const shopId = new URLSearchParams(search).get("shop");
    return shopId && SHOPS.some((s) => s.id === shopId) ? shopId : null;
  }, [search]);

  const [form, setForm] = useState<BookingFormState>(() => ({
    step: 1,
    selectedShopId: null,
    selectedServices: SERVICES.map(s => ({ id: s.id, name: s.name, price: s.basePrice, selected: false })),
    selectedDate: "", selectedTime: "",
    vehicle: { make: "", model: "", year: "", plateNumber: "" },
    customer: { name: "", email: "", password: "" },
  }));

  // A shop chosen by the user always wins; otherwise fall back to the `?shop=`
  // query param so links from a shop card land on the right selection.
  const effectiveShopId = form.selectedShopId ?? preselectedShopId;
  const effectiveForm: BookingFormState = useMemo(
    () => ({ ...form, selectedShopId: effectiveShopId }),
    [form, effectiveShopId]
  );

  const nextStep = () => setForm(prev => ({ ...prev, step: (prev.step + 1) as Step }));
  const prevStep = () => setForm(prev => ({ ...prev, step: (prev.step - 1) as Step }));

  return (
    <div className="min-h-screen bg-[#f0ebe2]">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="clay-card p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#2d3748] mb-2">Book Your Service</h2>
              <p className="text-[#9a9186]">Simple, transparent booking in 5 steps</p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-[#b8aea5] uppercase tracking-wider mb-1">Step {form.step} of 5</div>
              <div className="text-lg font-bold text-[#2d3748]">{getStepTitle(form.step)}</div>
            </div>
          </div>
          <div className="relative h-2 bg-[#e8e2d4] rounded-full overflow-hidden">
            <div className="h-full bg-electric-blue rounded-full transition-all duration-500" style={{ width: `${(form.step / 5) * 100}%` }} />
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-[#9a9186] uppercase tracking-wider">
            {["Select Shop","Select Services","Date & Time","Vehicle & Account","Confirmation"].map((label, i) => (
              <span key={label} className={i + 1 === form.step ? "text-electric-blue font-bold" : "text-[#b8aea5]"}>{label}</span>
            ))}
          </div>
        </div>
        <div className="clay-card p-6 sm:p-8 min-h-[600px]">{stepContent(effectiveForm, setForm, nextStep, prevStep)}</div>
      </div>
    </div>
  );
}

function getStepTitle(step: Step) {
  const titles: Record<Step, string> = { 1: "Select Shop", 2: "Select Services", 3: "Date & Time", 4: "Vehicle & Account", 5: "Confirmation" };
  return titles[step];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(email: string) {
  return EMAIL_RE.test(email.trim());
}

function isValidYear(year: string) {
  const n = Number(year);
  const currentYear = new Date().getFullYear();
  return Number.isInteger(n) && n >= 1900 && n <= currentYear + 1;
}

type FormErrors = Partial<Record<"vehicleMake" | "vehicleModel" | "vehicleYear" | "plateNumber" | "name" | "email" | "password", string>>;

function validateStep4(f: BookingFormState): FormErrors {
  const errors: FormErrors = {};
  if (!f.vehicle.make.trim()) errors.vehicleMake = "Make is required";
  if (!f.vehicle.model.trim()) errors.vehicleModel = "Model is required";
  if (!isValidYear(f.vehicle.year)) errors.vehicleYear = "Enter a valid year (1900 - " + (new Date().getFullYear() + 1) + ")";
  if (!f.vehicle.plateNumber.trim()) errors.plateNumber = "License plate is required";
  if (!f.customer.name.trim()) errors.name = "Name is required";
  if (!isValidEmail(f.customer.email)) errors.email = "Enter a valid email address";
  if (f.customer.password.length < 8) errors.password = "Password must be at least 8 characters";
  return errors;
}

type FormUpdater = React.Dispatch<React.SetStateAction<BookingFormState>>;

function stepContent(
  form: BookingFormState,
  setForm: FormUpdater,
  nextStep: () => void,
  prevStep: () => void
) {
  switch (form.step) {
    case 1: return <Step1Content form={form} setForm={setForm} nextStep={nextStep} />;
    case 2: return <Step2Content form={form} setForm={setForm} nextStep={nextStep} prevStep={prevStep} />;
    case 3: return <Step3Content form={form} setForm={setForm} nextStep={nextStep} prevStep={prevStep} />;
    case 4: return <Step4Content form={form} setForm={setForm} nextStep={nextStep} prevStep={prevStep} />;
    case 5: return <Step5Content form={form} setForm={setForm} />;
  }
}

function Step1Content({
  form,
  setForm,
  nextStep,
}: {
  form: BookingFormState;
  setForm: FormUpdater;
  nextStep: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SHOPS.map((shop) => {
          const isSelected = form.selectedShopId === shop.id;
          return (
            <button
              key={shop.id}
              onClick={() => setForm(prev => ({ ...prev, selectedShopId: shop.id }))}
              className={`clay-card p-6 cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${isSelected ? "ring-2 ring-electric-blue bg-electric-blue/5" : "hover:bg-[#e8e2d4]"}`}
            >
              <div className="w-16 h-16 rounded-full bg-[#e8e2d4] flex items-center justify-center mb-4 text-[#6b6258]">
                <span className="text-xl">🏪</span>
              </div>
              <h4 className="font-bold text-[#2d3748] mb-1">{shop.name}</h4>
              <p className="text-sm text-[#9a9186] mb-2">{shop.city}</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-yellow-500">★</span>
                <span>{shop.rating}</span>
              </div>
              {shop.isOpen ? (
                <span className="mt-2 text-xs text-emerald-600 font-medium">Open now</span>
              ) : (
                <span className="mt-2 text-xs text-rose-600 font-medium">Closed</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex justify-end">
        <ClayButton variant="primary" onClick={nextStep} disabled={!form.selectedShopId} className="px-8">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </ClayButton>
      </div>
    </div>
  );
}

function Step2Content({
  form,
  setForm,
  nextStep,
  prevStep,
}: {
  form: BookingFormState;
  setForm: FormUpdater;
  nextStep: () => void;
  prevStep: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES.map((service) => {
          const isSelected = form.selectedServices.find(s => s.id === service.id)?.selected || false;
          return (
            <label
              key={service.id}
              className="cursor-pointer"
            >
              <ClayCard padding="md" className={`transition-all duration-200 ${isSelected ? "ring-2 ring-electric-blue bg-electric-blue/5" : "hover:bg-[#e8e2d4]"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[#2d3748]">{service.name}</h4>
                  <span className="text-sm font-medium text-electric-blue">${service.basePrice}</span>
                </div>
                <p className="text-sm text-[#9a9186] mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#b8aea5]">{service.duration} min</span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => setForm(prev => ({
                      ...prev,
                      selectedServices: prev.selectedServices.map(s => s.id === service.id ? { ...s, selected: !s.selected } : s),
                    }))}
                    className="h-5 w-5 text-electric-blue rounded border-[#e2ddd0] cursor-pointer"
                  />
                </div>
              </ClayCard>
            </label>
          );
        })}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <ClayButton variant="ghost" onClick={prevStep} className="px-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </ClayButton>
        <ClayButton variant="primary" onClick={nextStep} disabled={!form.selectedServices.some(s => s.selected)} className="px-8">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </ClayButton>
      </div>
    </div>
  );
}

function Step3Content({
  form,
  setForm,
  nextStep,
  prevStep,
}: {
  form: BookingFormState;
  setForm: FormUpdater;
  nextStep: () => void;
  prevStep: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="date"
              className="clay-input w-full pl-10 pr-4 py-2.5"
              value={form.selectedDate}
              onChange={(e) => setForm(prev => ({ ...prev, selectedDate: e.target.value }))}
              min="2026-10-21"
            />
          </div>
          <p className="text-sm text-[#9a9186]">Select your preferred service date</p>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#4a433a] mb-3">Available Time Slots</h4>
          <div className="grid grid-cols-5 gap-3">
            {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"].map((slot) => {
              const isSelected = form.selectedTime === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setForm(prev => ({ ...prev, selectedTime: slot }))}
                  className={`h-12 rounded-xl flex items-center justify-center font-medium transition-all ${isSelected ? "bg-electric-blue text-[#fdfbf7] shadow-[4px_4px_8px_#1d4ed8]" : "bg-[#f0ebe2] text-[#6b6258] hover:bg-[#e8e2d4]"}`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <ClayButton variant="ghost" onClick={prevStep} className="px-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </ClayButton>
        <ClayButton variant="primary" onClick={nextStep} disabled={!form.selectedDate || !form.selectedTime} className="px-8">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </ClayButton>
      </div>
    </div>
  );
}

function Step4Content({
  form,
  setForm,
  nextStep,
  prevStep,
}: {
  form: BookingFormState;
  setForm: FormUpdater;
  nextStep: () => void;
  prevStep: () => void;
}) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  const handleSubmitStep4 = () => {
    const nextErrors = validateStep4(form);
    setErrors(nextErrors);
    setTouched(true);
    if (Object.keys(nextErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#2d3748] mb-2">Vehicle Details</h3>
        <div className="space-y-3">
          <ClayInput label="Make" value={form.vehicle.make} error={touched ? errors.vehicleMake : undefined} onChange={(e) => setForm(prev => ({ ...prev, vehicle: { ...prev.vehicle, make: e.target.value } }))} />
          <ClayInput label="Model" value={form.vehicle.model} error={touched ? errors.vehicleModel : undefined} onChange={(e) => setForm(prev => ({ ...prev, vehicle: { ...prev.vehicle, model: e.target.value } }))} />
          <ClayInput label="Year" type="number" value={form.vehicle.year} error={touched ? errors.vehicleYear : undefined} helperText="e.g. 2020" onChange={(e) => setForm(prev => ({ ...prev, vehicle: { ...prev.vehicle, year: e.target.value } }))} />
          <ClayInput label="License Plate" value={form.vehicle.plateNumber} error={touched ? errors.plateNumber : undefined} onChange={(e) => setForm(prev => ({ ...prev, vehicle: { ...prev.vehicle, plateNumber: e.target.value } }))} />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#2d3748] mb-2">Account Details</h3>
        <div className="space-y-3">
          <ClayInput label="Full Name" value={form.customer.name} error={touched ? errors.name : undefined} onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, name: e.target.value } }))} />
          <ClayInput label="Email" type="email" value={form.customer.email} error={touched ? errors.email : undefined} onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, email: e.target.value } }))} />
          <ClayInput label="Password" type="password" value={form.customer.password} error={touched ? errors.password : undefined} helperText="At least 8 characters" onChange={(e) => setForm(prev => ({ ...prev, customer: { ...prev.customer, password: e.target.value } }))} />
        </div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <ClayButton variant="ghost" onClick={prevStep} className="px-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </ClayButton>
        <ClayButton variant="primary" onClick={handleSubmitStep4} className="px-8">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </ClayButton>
      </div>
    </div>
  );
}

function Step5Content({
  form,
  setForm,
}: {
  form: BookingFormState;
  setForm: FormUpdater;
}) {
  const selectedShop = SHOPS.find(s => s.id === form.selectedShopId);
  const totalPrice = form.selectedServices
    .filter(s => s.selected)
    .reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_8px_#047857]">
        <span className="text-2xl">✓</span>
      </div>
      <h2 className="text-3xl font-bold text-[#2d3748] mb-2">Booking Confirmed!</h2>
      <p className="text-[#9a9186] mb-8">
        Your appointment has been scheduled. We&apos;ll send a confirmation email to {form.customer.email}.
      </p>
      <div className="clay-card p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="font-bold text-[#2d3748]">{selectedShop?.name}</h4>
            <p className="text-sm text-[#9a9186]">{selectedShop?.address}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#b8aea5]">Vehicle</div>
            <div className="font-medium text-[#2d3748]">{form.vehicle.year} {form.vehicle.make} {form.vehicle.model}</div>
          </div>
        </div>
        <div className="space-y-3 mb-6">
          {form.selectedServices.filter(s => s.selected).map((svc) => (
            <div key={svc.id} className="flex justify-between items-center text-sm">
              <span className="text-[#6b6258]">{svc.name}</span>
              <span className="font-medium text-[#2d3748]">${svc.price}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between items-center text-lg font-bold text-[#2d3748]">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      </div>
      <button onClick={() => setForm(prev => ({ ...prev, step: 1 as Step }))} className="clay-btn w-full py-3 bg-electric-blue text-[#fdfbf7] rounded-xl font-semibold shadow-[4px_4px_8px_#1d4ed8]">
        Book Another
      </button>
    </div>
  );
}

