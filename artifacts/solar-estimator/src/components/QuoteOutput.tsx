import { useRef } from "react";
import type { EstimateData } from "../lib/types";
import { calculateQuote, formatCurrency, formatNumber } from "../lib/calculations";

const COMPANY = {
  name: "PLENOX ENTERPRISES LLP",
  tagline: "Empowering India with Clean Solar Energy",
  llpin: "ACX-0404",
  gst: "08ABJFP2658K1ZP",
  email: "vproyalenterprisesllp@gmail.com",
  address: "V.P New Bustand Arthuna, Tehsils Arthuna, Banswara, Rajasthan - 327032",
  partners: [
    { name: "Vishal Panchal", phone: "+91 96601 81211" },
    { name: "Prince Panchal", phone: "+91 97727 13293" },
  ],
};

interface Props {
  data: EstimateData;
  onBack: () => void;
}

export function QuoteOutput({ data, onBack }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const quote = calculateQuote(data);
  const { customer, system } = data;

  const handlePrint = () => {
    window.print();
  };

  const bomRows: { label: string; spec: string; qty: string; rate: string; amount: number }[] = [
    {
      label: `Solar Panel – ${system.panelType}`,
      spec: `${system.panelWattage} Wp`,
      qty: `${system.panelCount} Nos`,
      rate: `₹${data.pricing.panelRatePerWatt}/Wp`,
      amount: quote.panelCost,
    },
    {
      label: `${system.inverterType} – ${system.inverterBrand}`,
      spec: `${system.inverterCapacityKW} kW`,
      qty: "1 Set",
      rate: formatCurrency(data.pricing.inverterRate),
      amount: quote.inverterCost,
    },
    {
      label: `${system.structureType} – ${system.roofType}`,
      spec: `${system.systemCapacityKW} kW`,
      qty: `${system.systemCapacityKW} kW`,
      rate: `₹${data.pricing.structureRate}/kW`,
      amount: quote.structureCost,
    },
    {
      label: "DC/AC Cables",
      spec: "Solar Grade",
      qty: `${system.cableLength} m`,
      rate: `₹${data.pricing.cableRate}/m`,
      amount: quote.cableCost,
    },
    ...(system.acdb ? [{
      label: "ACDB Box",
      spec: "With MCB & SPD",
      qty: "1 Set",
      rate: formatCurrency(data.pricing.acdbRate),
      amount: quote.acdbCost,
    }] : []),
    ...(system.dcdb ? [{
      label: "DCDB Box",
      spec: "With Fuse & SPD",
      qty: "1 Set",
      rate: formatCurrency(data.pricing.dcdbRate),
      amount: quote.dcdbCost,
    }] : []),
    ...(system.earthing ? [{
      label: "Earthing Kit",
      spec: "Copper Plate Type",
      qty: "2 Nos",
      rate: formatCurrency(data.pricing.earthingRate),
      amount: quote.earthingCost,
    }] : []),
    ...(system.lightning ? [{
      label: "Lightning Arrester",
      spec: "Class C",
      qty: "1 Set",
      rate: formatCurrency(data.pricing.lightningRate),
      amount: quote.lightningCost,
    }] : []),
    ...(system.netMeter ? [{
      label: "Net Meter",
      spec: "Bi-directional",
      qty: "1 Nos",
      rate: formatCurrency(data.pricing.netMeterRate),
      amount: quote.netMeterCost,
    }] : []),
    ...(system.batteryIncluded ? [{
      label: `Battery – ${system.batteryBrand}`,
      spec: `${system.batteryCapacityKWh} kWh`,
      qty: "1 Set",
      rate: `₹${data.pricing.batteryRate}/kWh`,
      amount: quote.batteryCost,
    }] : []),
    ...(system.installation ? [{
      label: "Installation & Commissioning",
      spec: "Turnkey",
      qty: `${system.systemCapacityKW} kW`,
      rate: `₹${data.pricing.installationRate}/kW`,
      amount: quote.installationCost,
    }] : []),
    ...(quote.otherCost > 0 ? [{
      label: "Other Charges / Miscellaneous",
      spec: "—",
      qty: "L.S.",
      rate: "—",
      amount: quote.otherCost,
    }] : []),
  ];

  return (
    <div>
      {/* Toolbar - hidden on print */}
      <div className="no-print flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
        >
          Edit Details
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save as PDF
        </button>
        <span className="text-sm text-gray-500">Use browser Print dialog to save as PDF</span>
      </div>

      {/* The printable quote document */}
      <div ref={printRef} className="print-page bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">

        {/* Header */}
        <div className="solar-header text-white px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.5 8.5H20L14.5 12.5L16.5 19L12 15L7.5 19L9.5 12.5L4 8.5H10.5L12 2Z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">{COMPANY.name}</h1>
                  <p className="text-orange-100 text-sm">{COMPANY.tagline}</p>
                </div>
              </div>
              <div className="text-xs text-orange-100 mt-2 space-y-0.5">
                <p>{COMPANY.address}</p>
                <p>GST: {COMPANY.gst} &nbsp;|&nbsp; LLPIN: {COMPANY.llpin}</p>
                <p>Email: {COMPANY.email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur rounded-xl px-5 py-3">
                <p className="text-xs text-orange-100 font-medium uppercase tracking-wider mb-1">Quotation</p>
                <p className="text-lg font-bold font-mono">{customer.quoteNumber}</p>
                <p className="text-xs text-orange-100 mt-1">Date: {customer.date}</p>
              </div>
              <div className="mt-3 text-xs text-orange-100 space-y-0.5">
                {COMPANY.partners.map(p => (
                  <p key={p.name}>{p.name}: {p.phone}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer details strip */}
        <div className="bg-orange-50 border-b border-orange-100 px-8 py-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Bill To / Customer</p>
              <p className="text-base font-bold text-gray-800">{customer.name || "—"}</p>
              {customer.address && <p className="text-sm text-gray-600">{customer.address}</p>}
              <p className="text-sm text-gray-600">
                {[customer.city, customer.state, customer.pincode].filter(Boolean).join(", ")}
              </p>
              {customer.phone && <p className="text-sm text-gray-600">Ph: {customer.phone}</p>}
              {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
            </div>
            <div className="text-right">
              <div className="inline-block bg-green-100 text-green-800 text-xs font-bold px-4 py-2 rounded-full border border-green-200">
                Valid for 30 days
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p className="font-semibold">System Capacity</p>
                <p className="text-2xl font-black text-orange-600">{system.systemCapacityKW} kW</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Summary badges */}
        <div className="px-8 py-4 bg-white border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">System Overview</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["System Size", `${system.systemCapacityKW} kWp`],
              ["Solar Panels", `${system.panelCount} × ${system.panelWattage} Wp (${system.panelType})`],
              ["Inverter", `${system.inverterCapacityKW} kW ${system.inverterType} (${system.inverterBrand})`],
              ["Structure", `${system.structureType} on ${system.roofType}`],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bill of Materials */}
        <div className="px-8 py-5">
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Bill of Materials & Scope of Work</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="px-3 py-2 text-left font-semibold rounded-tl-lg">#</th>
                <th className="px-3 py-2 text-left font-semibold">Item / Description</th>
                <th className="px-3 py-2 text-left font-semibold">Specification</th>
                <th className="px-3 py-2 text-center font-semibold">Qty</th>
                <th className="px-3 py-2 text-right font-semibold">Unit Rate</th>
                <th className="px-3 py-2 text-right font-semibold rounded-tr-lg">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bomRows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-orange-50/40"}>
                  <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-800">{row.label}</td>
                  <td className="px-3 py-2 text-gray-600">{row.spec}</td>
                  <td className="px-3 py-2 text-center text-gray-600">{row.qty}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{row.rate}</td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-800">{formatCurrency(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cost Summary */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost breakdown */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-700 text-white px-4 py-2 text-sm font-bold">Cost Summary</div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total (before GST)</span>
                  <span className="font-semibold">{formatCurrency(quote.subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST @ {data.pricing.gstPercent}%</span>
                  <span className="font-semibold">{formatCurrency(quote.gstAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-800">
                  <span>Total (incl. GST)</span>
                  <span>{formatCurrency(quote.totalBeforeSubsidy)}</span>
                </div>
                <div className="flex justify-between text-green-700 font-semibold bg-green-50 -mx-4 px-4 py-2 rounded">
                  <span>PM Surya Ghar Subsidy</span>
                  <span>- {formatCurrency(quote.pmSubsidy)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-orange-400 pt-2">
                  <span className="text-base font-black text-orange-600">Net Payable</span>
                  <span className="text-base font-black text-orange-600">{formatCurrency(quote.netCost)}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">*Subsidy credited by Govt. Directly to your bank account</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl border border-green-200 overflow-hidden">
              <div className="bg-green-600 text-white px-4 py-2 text-sm font-bold">Expected Benefits</div>
              <div className="p-4 space-y-2 text-sm">
                {[
                  ["Annual Generation", `${formatNumber(quote.annualGeneration, 0)} kWh/year`],
                  ["Electricity Rate (Avg)", "₹8 per unit"],
                  ["Annual Savings", formatCurrency(quote.annualSavings)],
                  ["Payback Period", `${formatNumber(quote.paybackYears, 1)} years`],
                  ["System Lifespan", "25+ years"],
                  ["CO₂ Saved / Year", `${formatNumber(quote.co2SavedPerYear, 2)} Tonnes`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-green-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PM Surya Ghar info strip */}
        <div className="mx-8 mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3 items-start">
            <div className="text-2xl">☀️</div>
            <div>
              <p className="font-bold text-amber-800 text-sm">PM Surya Ghar: Muft Bijlee Yojana (Central Govt. Subsidy)</p>
              <p className="text-xs text-amber-700 mt-1">
                Central subsidy: ₹30,000/kW up to 2 kW | ₹18,000/kW from 2–3 kW | Capped at ₹78,000 above 3 kW.
                Subsidy is credited directly by the Government to the customer's bank account.
                State government may provide additional subsidy subject to eligibility.
              </p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="px-8 pb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Terms & Conditions</p>
          <div className="text-xs text-gray-500 space-y-1 leading-relaxed">
            <p>1. This quotation is valid for <strong>30 days</strong> from the date of issue.</p>
            <p>2. <strong>Payment Terms:</strong> 50% advance with order, 40% before delivery, 10% at commissioning.</p>
            <p>3. Installation will be completed within <strong>7–15 working days</strong> after advance payment.</p>
            <p>4. All panels carry <strong>25-year linear performance warranty</strong>. Inverter warranty as per brand (typically 5 years).</p>
            <p>5. Net meter application charges and electricity department fees, if any, are payable by the customer.</p>
            <p>6. Subsidy amount and processing timeline depend on government scheme availability and DISCOM approval.</p>
            <p>7. Civil/structural modification work, if required, will be charged extra on actuals.</p>
            <p>8. Prices are subject to change in case of GST rate revision by the Government.</p>
          </div>
        </div>

        {/* Signature strip */}
        <div className="px-8 pb-8 border-t border-gray-100 pt-5">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-12 border-b border-gray-300 mb-2"></div>
              <p className="text-xs text-gray-500">Customer Signature</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{customer.name || "________________"}</p>
            </div>
            <div className="text-center">
              <div className="h-12 border-b border-gray-300 mb-2"></div>
              <p className="text-xs text-gray-500">Prepared by</p>
              <p className="text-sm font-medium text-gray-700 mt-1">Plenox Enterprises LLP</p>
            </div>
            <div className="text-center">
              <div className="h-12 mb-2 flex items-end justify-center pb-2">
                <div className="text-xs text-orange-400 border border-orange-200 rounded px-3 py-1">COMPANY SEAL</div>
              </div>
              <p className="text-xs text-gray-500">Authorized Signatory</p>
              <p className="text-sm font-medium text-gray-700 mt-1">Designated Partner</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="solar-header text-white text-center py-3 text-xs">
          <p>{COMPANY.name} | {COMPANY.email} | Vishal: +91 96601 81211 | Prince: +91 97727 13293</p>
          <p className="text-orange-100 mt-0.5">GST: {COMPANY.gst} | LLPIN: {COMPANY.llpin}</p>
        </div>
      </div>
    </div>
  );
}
