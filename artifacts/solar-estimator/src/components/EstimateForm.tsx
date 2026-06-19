import { useState, useEffect } from "react";
import type { EstimateData } from "../lib/types";
import { INDIAN_STATES, INVERTER_BRANDS } from "../lib/types";
import { generateQuoteNumber, todayString, recommendPanelCount } from "../lib/calculations";

interface Props {
  onGenerate: (data: EstimateData) => void;
}

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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
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
