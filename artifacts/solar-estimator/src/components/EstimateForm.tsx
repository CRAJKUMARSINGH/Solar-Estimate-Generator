import { useState, useEffect } from "react";
import type { EstimateData } from "../lib/types";
import { INDIAN_STATES, INVERTER_BRANDS } from "../lib/types";
import { generateQuoteNumber, todayString, recommendPanelCount } from "../lib/calculations";

interface Props {
  onGenerate: (data: EstimateData) => void;
}

type TemplateSystemPatch = Partial<EstimateData["system"]>;
type TemplatePricingPatch = Partial<EstimateData["pricing"]>;

interface QuoteTemplate {
  brand: string;
  systemType: "On-Grid" | "Off-Grid" | "Hybrid";
  colorKey: "blue" | "green" | "orange";
  system: TemplateSystemPatch;
  pricing: TemplatePricingPatch;
}

const TEMPLATES: QuoteTemplate[] = [
  // ─── Tata Power Solar ───────────────────────────────────────────────
  {
    brand: "Tata Power Solar", systemType: "On-Grid", colorKey: "blue",
    system: { panelType: "Bifacial TOPCon", panelWattage: 545, inverterType: "String Inverter", inverterBrand: "Tata Power Solar", batteryIncluded: false, batteryCapacityKWh: 0, netMeter: true, lightning: true },
    pricing: { panelRatePerWatt: 32, inverterRate: 38000, batteryRate: 0, installationRate: 5500 },
  },
  {
    brand: "Tata Power Solar", systemType: "Off-Grid", colorKey: "blue",
    system: { panelType: "Bifacial TOPCon", panelWattage: 545, inverterType: "Hybrid Inverter", inverterBrand: "Tata Power Solar", batteryIncluded: true, batteryCapacityKWh: 10, netMeter: false, lightning: true },
    pricing: { panelRatePerWatt: 32, inverterRate: 55000, batteryRate: 14000, installationRate: 6000 },
  },
  {
    brand: "Tata Power Solar", systemType: "Hybrid", colorKey: "blue",
    system: { panelType: "Bifacial TOPCon", panelWattage: 545, inverterType: "Hybrid Inverter", inverterBrand: "Tata Power Solar", batteryIncluded: true, batteryCapacityKWh: 10, netMeter: true, lightning: true },
    pricing: { panelRatePerWatt: 32, inverterRate: 55000, batteryRate: 14000, installationRate: 6000 },
  },
  // ─── Adani Solar ────────────────────────────────────────────────────
  {
    brand: "Adani Solar", systemType: "On-Grid", colorKey: "green",
    system: { panelType: "Mono PERC", panelWattage: 540, inverterType: "String Inverter", inverterBrand: "Adani Solar", batteryIncluded: false, batteryCapacityKWh: 0, netMeter: true, lightning: false },
    pricing: { panelRatePerWatt: 30, inverterRate: 35000, batteryRate: 0, installationRate: 5000 },
  },
  {
    brand: "Adani Solar", systemType: "Off-Grid", colorKey: "green",
    system: { panelType: "Mono PERC", panelWattage: 540, inverterType: "Hybrid Inverter", inverterBrand: "Adani Solar", batteryIncluded: true, batteryCapacityKWh: 10, netMeter: false, lightning: false },
    pricing: { panelRatePerWatt: 30, inverterRate: 48000, batteryRate: 13000, installationRate: 5500 },
  },
  {
    brand: "Adani Solar", systemType: "Hybrid", colorKey: "green",
    system: { panelType: "Mono PERC", panelWattage: 540, inverterType: "Hybrid Inverter", inverterBrand: "Adani Solar", batteryIncluded: true, batteryCapacityKWh: 10, netMeter: true, lightning: false },
    pricing: { panelRatePerWatt: 30, inverterRate: 48000, batteryRate: 13000, installationRate: 5500 },
  },
  // ─── Waaree / Vikram (Other) ─────────────────────────────────────────
  {
    brand: "Waaree / Vikram", systemType: "On-Grid", colorKey: "orange",
    system: { panelType: "Mono PERC", panelWattage: 540, inverterType: "String Inverter", inverterBrand: "Growatt", batteryIncluded: false, batteryCapacityKWh: 0, netMeter: true, lightning: false },
    pricing: { panelRatePerWatt: 28, inverterRate: 32000, batteryRate: 0, installationRate: 5000 },
  },
  {
    brand: "Waaree / Vikram", systemType: "Off-Grid", colorKey: "orange",
    system: { panelType: "Mono PERC", panelWattage: 540, inverterType: "Hybrid Inverter", inverterBrand: "Luminous", batteryIncluded: true, batteryCapacityKWh: 10, netMeter: false, lightning: false },
    pricing: { panelRatePerWatt: 28, inverterRate: 45000, batteryRate: 12000, installationRate: 5000 },
  },
  {
    brand: "Waaree / Vikram", systemType: "Hybrid", colorKey: "orange",
    system: { panelType: "Mono PERC", panelWattage: 540, inverterType: "Hybrid Inverter", inverterBrand: "Deye", batteryIncluded: true, batteryCapacityKWh: 10, netMeter: true, lightning: false },
    pricing: { panelRatePerWatt: 28, inverterRate: 45000, batteryRate: 12000, installationRate: 5000 },
  },
];

const TYPE_ICON: Record<string, string> = { "On-Grid": "⚡", "Off-Grid": "🔋", "Hybrid": "🌐" };
const TYPE_DESC: Record<string, string> = { "On-Grid": "Grid-tied, no battery", "Off-Grid": "Battery backup, no grid", "Hybrid": "Grid + Battery backup" };

const COLOR_STYLES: Record<string, { card: string; badge: string; btn: string }> = {
  blue:   { card: "border-blue-200 hover:border-blue-400 hover:bg-blue-50",   badge: "bg-blue-100 text-blue-700",   btn: "bg-blue-500 hover:bg-blue-600" },
  green:  { card: "border-green-200 hover:border-green-400 hover:bg-green-50", badge: "bg-green-100 text-green-700", btn: "bg-green-500 hover:bg-green-600" },
  orange: { card: "border-orange-200 hover:border-orange-400 hover:bg-orange-50", badge: "bg-orange-100 text-orange-700", btn: "bg-orange-500 hover:bg-orange-600" },
};

const defaultData = (): EstimateData => ({
  customer: {
    name: "",
    address: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
    phone: "",
    email: "",
    date: todayString(),
    quoteNumber: generateQuoteNumber(),
  },
  system: {
    systemCapacityKW: 3,
    panelType: "Mono PERC",
    panelWattage: 540,
    panelCount: 6,
    inverterType: "String Inverter",
    inverterCapacityKW: 3,
    inverterBrand: "Growatt",
    batteryIncluded: false,
    batteryCapacityKWh: 0,
    batteryBrand: "Luminous",
    roofType: "RCC Roof",
    structureType: "GI Structure",
    cableLength: 50,
    acdb: true,
    dcdb: true,
    earthing: true,
    lightning: false,
    netMeter: true,
    installation: true,
  },
  pricing: {
    panelRatePerWatt: 28,
    inverterRate: 35000,
    batteryRate: 12000,
    structureRate: 8000,
    cableRate: 80,
    acdbRate: 3500,
    dcdbRate: 3500,
    earthingRate: 5000,
    lightningRate: 6000,
    netMeterRate: 8000,
    installationRate: 5000,
    otherCharges: 0,
    gstPercent: 12,
  },
});

export function EstimateForm({ onGenerate }: Props) {
  const [data, setData] = useState<EstimateData>(defaultData());
  const [activeTab, setActiveTab] = useState<"customer" | "system" | "pricing">("customer");
  const [showTemplates, setShowTemplates] = useState(true);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const loadTemplate = (t: QuoteTemplate) => {
    const key = `${t.brand}|${t.systemType}`;
    setActiveTemplate(key);
    setData(d => ({
      ...d,
      system: { ...d.system, ...t.system },
      pricing: { ...d.pricing, ...t.pricing },
    }));
    setShowTemplates(false);
    setActiveTab("customer");
  };

  const updateCustomer = (field: keyof EstimateData["customer"], value: string) => {
    setData(d => ({ ...d, customer: { ...d.customer, [field]: value } }));
  };

  const updateSystem = (field: keyof EstimateData["system"], value: string | number | boolean) => {
    setData(d => ({ ...d, system: { ...d.system, [field]: value } }));
  };

  const updatePricing = (field: keyof EstimateData["pricing"], value: number) => {
    setData(d => ({ ...d, pricing: { ...d.pricing, [field]: value } }));
  };

  useEffect(() => {
    const recommended = recommendPanelCount(data.system.systemCapacityKW, data.system.panelWattage);
    setData(d => ({
      ...d,
      system: {
        ...d.system,
        panelCount: recommended,
        inverterCapacityKW: d.system.systemCapacityKW,
      }
    }));
  }, [data.system.systemCapacityKW, data.system.panelWattage]);

  const tabs = [
    { key: "customer", label: "Customer Details" },
    { key: "system", label: "System Specs" },
    { key: "pricing", label: "Pricing" },
  ] as const;

  const inputCls = "w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const sectionTitle = "text-base font-semibold text-orange-700 mb-3 pb-1 border-b border-orange-100";

  const brands = ["Tata Power Solar", "Adani Solar", "Waaree / Vikram"] as const;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">

      {/* Template Selector */}
      <div className="border-b border-orange-100">
        <button
          onClick={() => setShowTemplates(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            📋 Quick Templates — 9 Pre-built Quotations
            {activeTemplate && (
              <span className="text-xs font-normal bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                {activeTemplate.replace("|", " · ")} ✓
              </span>
            )}
          </span>
          <span className="text-orange-400 text-xs">{showTemplates ? "▲ Hide" : "▼ Show"}</span>
        </button>

        {showTemplates && (
          <div className="px-5 pb-5 pt-2 bg-orange-50/40">
            <p className="text-xs text-gray-500 mb-3">Select a brand + system type to pre-fill specs and pricing. You can adjust any value afterwards.</p>
            {brands.map(brand => {
              const brandTemplates = TEMPLATES.filter(t => t.brand === brand);
              const colorKey = brandTemplates[0].colorKey;
              const cs = COLOR_STYLES[colorKey];
              return (
                <div key={brand} className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{brand}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {brandTemplates.map(t => {
                      const key = `${t.brand}|${t.systemType}`;
                      const isActive = activeTemplate === key;
                      return (
                        <button
                          key={key}
                          onClick={() => loadTemplate(t)}
                          className={`relative text-left p-3 rounded-xl border-2 transition-all ${
                            isActive
                              ? `${cs.btn} text-white border-transparent shadow-md`
                              : `bg-white ${cs.card} border`
                          }`}
                        >
                          <div className="text-lg leading-none mb-1">{TYPE_ICON[t.systemType]}</div>
                          <div className={`text-xs font-bold ${isActive ? "text-white" : ""}`}>{t.systemType}</div>
                          <div className={`text-[10px] mt-0.5 ${isActive ? "text-white/80" : "text-gray-500"}`}>{TYPE_DESC[t.systemType]}</div>
                          {isActive && (
                            <span className="absolute top-1.5 right-1.5 text-[10px] bg-white/30 text-white rounded-full px-1.5 py-0.5">✓ Loaded</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tab headers */}
      <div className="flex border-b border-orange-100">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:bg-orange-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Customer Details */}
        {activeTab === "customer" && (
          <div className="space-y-4">
            <p className={sectionTitle}>Customer Information</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Customer Name *</label>
                <input className={inputCls} placeholder="Full Name" value={data.customer.name}
                  onChange={e => updateCustomer("name", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Phone Number *</label>
                <input className={inputCls} placeholder="+91 XXXXX XXXXX" value={data.customer.phone}
                  onChange={e => updateCustomer("phone", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Address</label>
                <input className={inputCls} placeholder="House/Plot No, Street, Locality" value={data.customer.address}
                  onChange={e => updateCustomer("address", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>City / Village</label>
                <input className={inputCls} placeholder="City or Village" value={data.customer.city}
                  onChange={e => updateCustomer("city", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>State</label>
                <select className={inputCls} value={data.customer.state}
                  onChange={e => updateCustomer("state", e.target.value)}>
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Pincode</label>
                <input className={inputCls} placeholder="327032" value={data.customer.pincode}
                  onChange={e => updateCustomer("pincode", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} type="email" placeholder="customer@email.com" value={data.customer.email}
                  onChange={e => updateCustomer("email", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Quote Date</label>
                <input className={inputCls} value={data.customer.date}
                  onChange={e => updateCustomer("date", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Quote Number</label>
                <input className={inputCls} value={data.customer.quoteNumber}
                  onChange={e => updateCustomer("quoteNumber", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* System Specs */}
        {activeTab === "system" && (
          <div className="space-y-5">
            <p className={sectionTitle}>Solar System Specifications</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>System Capacity (kW) *</label>
                <input className={inputCls} type="number" min="0.5" max="50" step="0.5"
                  value={data.system.systemCapacityKW}
                  onChange={e => updateSystem("systemCapacityKW", parseFloat(e.target.value) || 1)} />
              </div>
              <div>
                <label className={labelCls}>Panel Type *</label>
                <select className={inputCls} value={data.system.panelType}
                  onChange={e => updateSystem("panelType", e.target.value as EstimateData["system"]["panelType"])}>
                  {["Mono PERC", "Poly", "Bifacial TOPCon", "HJT"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Panel Wattage (Wp)</label>
                <select className={inputCls} value={data.system.panelWattage}
                  onChange={e => updateSystem("panelWattage", parseInt(e.target.value))}>
                  {[330, 380, 400, 440, 450, 480, 500, 530, 540, 545, 550, 580, 600].map(w => (
                    <option key={w} value={w}>{w} Wp</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>No. of Panels (auto-calculated)</label>
                <input className={inputCls} type="number" min="1" value={data.system.panelCount}
                  onChange={e => updateSystem("panelCount", parseInt(e.target.value) || 1)} />
              </div>
              <div>
                <label className={labelCls}>Inverter Type</label>
                <select className={inputCls} value={data.system.inverterType}
                  onChange={e => updateSystem("inverterType", e.target.value as EstimateData["system"]["inverterType"])}>
                  {["String Inverter", "Micro Inverter", "Hybrid Inverter"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Inverter Brand</label>
                <select className={inputCls} value={data.system.inverterBrand}
                  onChange={e => updateSystem("inverterBrand", e.target.value)}>
                  {INVERTER_BRANDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Roof Type</label>
                <select className={inputCls} value={data.system.roofType}
                  onChange={e => updateSystem("roofType", e.target.value as EstimateData["system"]["roofType"])}>
                  {["RCC Roof", "Tin Shed", "Ground Mount"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Structure Type</label>
                <select className={inputCls} value={data.system.structureType}
                  onChange={e => updateSystem("structureType", e.target.value as EstimateData["system"]["structureType"])}>
                  {["GI Structure", "MS Structure", "Elevated MS Structure"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Cable Length (meters)</label>
                <input className={inputCls} type="number" min="0" value={data.system.cableLength}
                  onChange={e => updateSystem("cableLength", parseInt(e.target.value) || 0)} />
              </div>
            </div>

            {/* Accessories */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Included Accessories</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {([
                  ["acdb", "ACDB Box"],
                  ["dcdb", "DCDB Box"],
                  ["earthing", "Earthing Kit"],
                  ["lightning", "Lightning Arrester"],
                  ["netMeter", "Net Meter"],
                  ["installation", "Installation"],
                ] as const).map(([field, label]) => (
                  <label key={field} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-orange-500"
                      checked={data.system[field] as boolean}
                      onChange={e => updateSystem(field, e.target.checked)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Battery section */}
            <div className="border border-orange-100 rounded-xl p-4 bg-orange-50">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer mb-3">
                <input type="checkbox" className="accent-orange-500"
                  checked={data.system.batteryIncluded}
                  onChange={e => updateSystem("batteryIncluded", e.target.checked)} />
                Include Battery Storage
              </label>
              {data.system.batteryIncluded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Battery Capacity (kWh)</label>
                    <input className={inputCls} type="number" min="1" step="0.5"
                      value={data.system.batteryCapacityKWh || ""}
                      onChange={e => updateSystem("batteryCapacityKWh", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className={labelCls}>Battery Brand</label>
                    <select className={inputCls} value={data.system.batteryBrand}
                      onChange={e => updateSystem("batteryBrand", e.target.value)}>
                      {["Luminous", "Exide", "Okaya", "Su-Kam", "Amaron"].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing */}
        {activeTab === "pricing" && (
          <div className="space-y-4">
            <p className={sectionTitle}>Component Pricing (INR)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["panelRatePerWatt", "Panel Rate (₹/Wp)"],
                ["inverterRate", "Inverter Cost (₹)"],
                ["structureRate", "Structure Rate (₹/kW)"],
                ["cableRate", "Cable Rate (₹/m)"],
                ["acdbRate", "ACDB Box (₹)"],
                ["dcdbRate", "DCDB Box (₹)"],
                ["earthingRate", "Earthing (₹)"],
                ["lightningRate", "Lightning Arrester (₹)"],
                ["netMeterRate", "Net Meter (₹)"],
                ["installationRate", "Installation (₹/kW)"],
                ["otherCharges", "Other Charges (₹)"],
              ].map(([field, label]) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input className={inputCls} type="number" min="0"
                    value={data.pricing[field as keyof EstimateData["pricing"]]}
                    onChange={e => updatePricing(field as keyof EstimateData["pricing"], parseFloat(e.target.value) || 0)} />
                </div>
              ))}
              {data.system.batteryIncluded && (
                <div>
                  <label className={labelCls}>Battery Rate (₹/kWh)</label>
                  <input className={inputCls} type="number" min="0"
                    value={data.pricing.batteryRate}
                    onChange={e => updatePricing("batteryRate", parseFloat(e.target.value) || 0)} />
                </div>
              )}
              <div>
                <label className={labelCls}>GST Rate (%)</label>
                <select className={inputCls} value={data.pricing.gstPercent}
                  onChange={e => updatePricing("gstPercent", parseFloat(e.target.value))}>
                  {[0, 5, 12, 18].map(r => <option key={r} value={r}>{r}%</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation + Generate */}
      <div className="px-6 pb-6 flex justify-between items-center">
        <div className="flex gap-2">
          {activeTab !== "customer" && (
            <button
              onClick={() => setActiveTab(activeTab === "pricing" ? "system" : "customer")}
              className="px-4 py-2 text-sm border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
            >
              Back
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {activeTab !== "pricing" ? (
            <button
              onClick={() => setActiveTab(activeTab === "customer" ? "system" : "pricing")}
              className="px-5 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => onGenerate(data)}
              disabled={!data.customer.name}
              className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
            >
              Generate Estimate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
