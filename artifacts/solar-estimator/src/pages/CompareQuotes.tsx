import { useState } from "react";
import { calculateQuote, formatCurrency, todayString } from "../lib/calculations";
import type { EstimateData, CalculatedQuote } from "../lib/types";
import { PlenoxLogo } from "../components/PlenoxLogo";

const COMPANY = {
  name: "PLENOX ENTERPRISES LLP",
  llpin: "ACX-0404",
  gst: "08ABJFP2658K1ZP",
  address: "V.P New Bustand Arthuna, Banswara, Rajasthan – 327032",
  vishal: "+91 96601 81211",
  prince: "+91 97727 13293",
};

type SystemType = "On-Grid" | "Off-Grid" | "Hybrid";

interface BrandConfig {
  brand: string;
  color: string;
  headerBg: string;
  panelType: EstimateData["system"]["panelType"];
  panelWattage: number;
  inverterType: EstimateData["system"]["inverterType"];
  inverterBrand: string;
  batteryBrand: string;
  panelRatePerWatt: number;
  inverterRateOnGrid: number;
  inverterRateHybrid: number;
  batteryRate: number;
  installationRate: number;
}

const BRANDS: BrandConfig[] = [
  {
    brand: "Tata Power Solar",
    color: "#1d4ed8",
    headerBg: "bg-blue-600",
    panelType: "Bifacial TOPCon",
    panelWattage: 545,
    inverterType: "String Inverter",
    inverterBrand: "Tata Power Solar",
    batteryBrand: "Tata Power",
    panelRatePerWatt: 32,
    inverterRateOnGrid: 38000,
    inverterRateHybrid: 55000,
    batteryRate: 14000,
    installationRate: 5500,
  },
  {
    brand: "Adani Solar",
    color: "#15803d",
    headerBg: "bg-green-700",
    panelType: "Mono PERC",
    panelWattage: 540,
    inverterType: "String Inverter",
    inverterBrand: "Adani Solar",
    batteryBrand: "Adani Energy",
    panelRatePerWatt: 30,
    inverterRateOnGrid: 35000,
    inverterRateHybrid: 48000,
    batteryRate: 13000,
    installationRate: 5000,
  },
  {
    brand: "Waaree / Vikram",
    color: "#c2410c",
    headerBg: "bg-orange-600",
    panelType: "Mono PERC",
    panelWattage: 540,
    inverterType: "String Inverter",
    inverterBrand: "Growatt",
    batteryBrand: "Luminous",
    panelRatePerWatt: 28,
    inverterRateOnGrid: 32000,
    inverterRateHybrid: 45000,
    batteryRate: 12000,
    installationRate: 5000,
  },
];

function buildEstimateData(brand: BrandConfig, kW: number, sysType: SystemType, customerName: string): EstimateData {
  const isOffGrid = sysType === "Off-Grid";
  const isHybrid = sysType === "Hybrid";
  const hasBattery = isOffGrid || isHybrid;
  const hasNetMeter = sysType !== "Off-Grid";
  const inverterType: EstimateData["system"]["inverterType"] = hasBattery ? "Hybrid Inverter" : "String Inverter";
  const batteryKWh = hasBattery ? kW * 2 : 0; // 2 kWh per kW system size
  const inverterRate = hasBattery ? brand.inverterRateHybrid : brand.inverterRateOnGrid;
  const panelCount = Math.ceil((kW * 1000) / brand.panelWattage);

  return {
    customer: {
      name: customerName || "Comparative Quote",
      address: "", city: "", state: "Rajasthan", pincode: "", phone: "", email: "",
      date: todayString(),
      quoteNumber: `PEL/CMP/${new Date().getFullYear()}`,
    },
    system: {
      systemCapacityKW: kW,
      panelType: brand.panelType,
      panelWattage: brand.panelWattage,
      panelCount,
      inverterType,
      inverterCapacityKW: kW,
      inverterBrand: brand.inverterBrand,
      batteryIncluded: hasBattery,
      batteryCapacityKWh: batteryKWh,
      batteryBrand: brand.batteryBrand,
      roofType: "RCC Roof",
      structureType: "GI Structure",
      cableLength: 50,
      acdb: true,
      dcdb: true,
      earthing: true,
      lightning: false,
      netMeter: hasNetMeter,
      installation: true,
    },
    pricing: {
      panelRatePerWatt: brand.panelRatePerWatt,
      inverterRate,
      batteryRate: brand.batteryRate,
      structureRate: 8000,
      cableRate: 80,
      acdbRate: 3500,
      dcdbRate: 3500,
      earthingRate: 5000,
      lightningRate: 6000,
      netMeterRate: hasNetMeter ? 8000 : 0,
      installationRate: brand.installationRate,
      otherCharges: 0,
      gstPercent: 12,
    },
  };
}

const SYS_TYPE_ICON: Record<SystemType, string> = { "On-Grid": "⚡", "Off-Grid": "🔋", "Hybrid": "🌐" };
const SYS_TYPE_DESC: Record<SystemType, string> = {
  "On-Grid": "Grid-tied, exports surplus to grid, eligible for net metering",
  "Off-Grid": "Independent of grid, battery backup powers loads at night",
  "Hybrid": "Grid-tied + battery backup, maximum reliability & savings",
};

const KW_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 10];

export function CompareQuotes() {
  const [kW, setKW] = useState(3);
  const [sysType, setSysType] = useState<SystemType>("On-Grid");
  const [customerName, setCustomerName] = useState("");
  const [showResult, setShowResult] = useState(false);

  const quotes: { brand: BrandConfig; data: EstimateData; calc: CalculatedQuote }[] =
    BRANDS.map(b => {
      const data = buildEstimateData(b, kW, sysType, customerName);
      return { brand: b, data, calc: calculateQuote(data) };
    });

  const lowest = Math.min(...quotes.map(q => q.calc.netCost));

  const rows: { label: string; values: (q: typeof quotes[0]) => string; highlight?: boolean }[] = [
    { label: "Panel Type", values: q => q.data.system.panelType },
    { label: "Panel Wattage", values: q => `${q.data.system.panelWattage} Wp` },
    { label: "No. of Panels", values: q => `${q.data.system.panelCount} Nos` },
    { label: "Inverter", values: q => `${q.data.system.inverterCapacityKW} kW ${q.data.system.inverterType}` },
    { label: "Inverter Brand", values: q => q.data.system.inverterBrand },
    { label: "Battery", values: q => q.data.system.batteryIncluded ? `${q.data.system.batteryCapacityKWh} kWh` : "Not included" },
    { label: "Net Meter", values: q => q.data.system.netMeter ? "Included" : "Not applicable" },
    { label: "Panel Cost", values: q => formatCurrency(q.calc.panelCost) },
    { label: "Inverter Cost", values: q => formatCurrency(q.calc.inverterCost) },
    { label: "Battery Cost", values: q => q.calc.batteryCost > 0 ? formatCurrency(q.calc.batteryCost) : "—" },
    { label: "Structure + BOS", values: q => formatCurrency(q.calc.structureCost + q.calc.cableCost + q.calc.acdbCost + q.calc.dcdbCost + q.calc.earthingCost) },
    { label: "Installation", values: q => formatCurrency(q.calc.installationCost) },
    { label: "Sub Total", values: q => formatCurrency(q.calc.subTotal) },
    { label: `GST (${quotes[0].data.pricing.gstPercent}%)`, values: q => formatCurrency(q.calc.gstAmount) },
    { label: "Total (incl. GST)", values: q => formatCurrency(q.calc.totalBeforeSubsidy), highlight: true },
    { label: "PM Surya Ghar Subsidy", values: q => `– ${formatCurrency(q.calc.pmSubsidy)}` },
    { label: "Net Payable ✅", values: q => formatCurrency(q.calc.netCost), highlight: true },
    { label: "Cost per kW (net)", values: q => formatCurrency(q.calc.netCost / kW) },
    { label: "Annual Generation", values: q => `${q.calc.annualGeneration.toFixed(0)} kWh` },
    { label: "Annual Savings", values: q => `${formatCurrency(q.calc.annualSavings)}/yr` },
    { label: "Payback Period", values: q => `${q.calc.paybackYears.toFixed(1)} years` },
    { label: "CO₂ Saved/Year", values: q => `${q.calc.co2SavedPerYear.toFixed(2)} tonnes` },
  ];

  return (
    <div>
      {/* Control panel */}
      <div className="no-print bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">Configure Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* System capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Capacity (kW)</label>
            <div className="flex flex-wrap gap-2">
              {KW_OPTIONS.map(k => (
                <button key={k} onClick={() => setKW(k)}
                  className={`px-3 py-1.5 text-sm rounded-lg border font-semibold transition-all ${
                    kW === k ? "bg-orange-500 text-white border-orange-500" : "border-orange-200 text-orange-700 hover:bg-orange-50"
                  }`}>
                  {k} kW
                </button>
              ))}
            </div>
          </div>
          {/* System type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">System Type</label>
            <div className="flex flex-col gap-2">
              {(["On-Grid", "Off-Grid", "Hybrid"] as SystemType[]).map(t => (
                <button key={t} onClick={() => setSysType(t)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                    sysType === t ? "bg-orange-500 text-white border-orange-500" : "border-orange-200 text-gray-700 hover:bg-orange-50"
                  }`}>
                  <span>{SYS_TYPE_ICON[t]}</span>
                  <div>
                    <span className="font-semibold">{t}</span>
                    <span className={`block text-[10px] leading-tight ${sysType === t ? "text-orange-100" : "text-gray-400"}`}>
                      {SYS_TYPE_DESC[t].split(",")[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Customer name + generate */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name (optional)</label>
              <input
                className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. Ramesh Kumar"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowResult(true)}
                className="flex-1 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors">
                ⚖️ Compare Now
              </button>
              {showResult && (
                <button onClick={() => window.print()}
                  className="px-4 py-2.5 bg-gray-700 text-white rounded-xl text-sm hover:bg-gray-800 transition-colors font-semibold flex items-center gap-1">
                  🖨️ Print
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison sheet */}
      {showResult && (
        <div className="print-page bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-5xl mx-auto">

          {/* Print header */}
          <div className="solar-header text-white px-8 py-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <PlenoxLogo size={30} variant="color" />
                  </div>
                  <h1 className="text-xl font-black tracking-tight">{COMPANY.name}</h1>
                </div>
                <p className="text-orange-100 text-xs mt-0.5">LLPIN: {COMPANY.llpin} | GST: {COMPANY.gst}</p>
                <p className="text-orange-100 text-xs">{COMPANY.address}</p>
              </div>
              <div className="text-right text-xs text-orange-100">
                <p>Vishal Panchal: {COMPANY.vishal}</p>
                <p>Prince Panchal: {COMPANY.prince}</p>
                <p className="mt-1">{todayString()}</p>
              </div>
            </div>
          </div>

          {/* Title bar */}
          <div className="bg-orange-50 border-b border-orange-100 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-gray-800">
                  {SYS_TYPE_ICON[sysType]} Brand Comparison — {kW} kW {sysType} Solar System
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {customerName && <span className="font-semibold text-gray-700">For: {customerName} &nbsp;|&nbsp; </span>}
                  {SYS_TYPE_DESC[sysType]} &nbsp;|&nbsp; GST @ 12% | PM Surya Ghar Subsidy Applied
                </p>
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left px-5 py-3 bg-gray-50 border-b border-r border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider w-[220px]">
                    Specification
                  </th>
                  {quotes.map(({ brand, calc }) => (
                    <th key={brand.brand} className={`px-4 py-3 text-center border-b border-r border-gray-200 ${brand.headerBg} text-white`}>
                      <div className="font-black text-sm">{brand.brand}</div>
                      <div className="text-[11px] font-normal opacity-80 mt-0.5">
                        Net: {formatCurrency(calc.netCost)}
                        {calc.netCost === lowest && (
                          <span className="ml-1 bg-yellow-400 text-yellow-900 rounded-full px-1.5 py-0.5 text-[9px] font-bold">★ BEST</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                    <td className={`px-5 py-2.5 text-xs font-semibold border-r border-b border-gray-100 ${
                      row.highlight ? "text-gray-900 bg-orange-50 font-bold" : "text-gray-600"
                    }`}>
                      {row.label}
                    </td>
                    {quotes.map(q => {
                      const val = row.values(q);
                      const isLowest = row.label === "Net Payable ✅" && q.calc.netCost === lowest;
                      return (
                        <td key={q.brand.brand}
                          className={`px-4 py-2.5 text-center text-xs border-r border-b border-gray-100 ${
                            row.highlight ? "font-bold text-gray-900 bg-orange-50" : "text-gray-700"
                          } ${isLowest ? "text-green-700" : ""}`}>
                          {val}
                          {isLowest && <span className="ml-1 text-[10px]">★</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary recommendation bar */}
          <div className="px-8 py-5 bg-orange-50 border-t border-orange-100">
            <div className="grid grid-cols-3 gap-4">
              {quotes.map(({ brand, calc }) => (
                <div key={brand.brand}
                  className={`rounded-xl p-4 border-2 ${calc.netCost === lowest ? "border-green-400 bg-white shadow-md" : "border-gray-200 bg-white"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">{brand.brand}</span>
                    {calc.netCost === lowest && (
                      <span className="text-[10px] bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-bold">★ Lowest Cost</span>
                    )}
                  </div>
                  <div className="text-lg font-black text-gray-900">{formatCurrency(calc.netCost)}</div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    Subsidy: {formatCurrency(calc.pmSubsidy)} | Payback: {calc.paybackYears.toFixed(1)} yrs
                  </div>
                  <div className="mt-2 text-[11px] text-gray-600 leading-relaxed">
                    {brand.panelType} {brand.panelWattage}Wp × {Math.ceil((kW * 1000) / brand.panelWattage)} panels
                    {(sysType === "Off-Grid" || sysType === "Hybrid") && ` + ${kW * 2} kWh battery`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-gray-200 text-center">
            <p className="text-[11px] text-gray-400">
              This comparison is indicative. Final price subject to site survey, current market rates & applicable state subsidies.
              All prices include 12% GST. PM Surya Ghar central subsidy applied (max ₹78,000 for on-grid systems ≤3 kW).
            </p>
            <p className="text-[11px] text-gray-500 mt-1 font-semibold">
              {COMPANY.name} — {COMPANY.vishal} / {COMPANY.prince}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
