import type { EstimateData, CalculatedQuote } from "../lib/types";
import { formatCurrency } from "../lib/calculations";
import { PlenoxLogo } from "./PlenoxLogo";

const COMPANY = {
  name: "PLENOX ENTERPRISES LLP",
  nameHi: "प्लेनोक्स एंटरप्राइजेज़ एलएलपी",
  llpin: "ACX-0404",
  gst: "08ABJFP2658K1ZP",
  email: "vproyalenterprisesllp@gmail.com",
  address1: "V.P New Bustand Arthuna, Tehsils Arthuna",
  address2: "Banswara, Rajasthan – 327032",
  partners: [
    { name: "Vishal Panchal", phone: "+91 96601 81211", designation: "Designated Partner" },
    { name: "Prince Panchal",  phone: "+91 97727 13293", designation: "Designated Partner" },
  ],
};

interface Props {
  data: EstimateData;
  calc: CalculatedQuote;
}

function numWords(n: number): string {
  if (n === 0) return "zero";
  const a = ["","one","two","three","four","five","six","seven","eight","nine",
             "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen",
             "seventeen","eighteen","nineteen"];
  const b = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  const inW = (x: number): string => {
    if (x < 20) return a[x];
    if (x < 100) return b[Math.floor(x/10)] + (x%10 ? " " + a[x%10] : "");
    if (x < 1000) return a[Math.floor(x/100)] + " hundred" + (x%100 ? " " + inW(x%100) : "");
    if (x < 100000) return inW(Math.floor(x/1000)) + " thousand" + (x%1000 ? " " + inW(x%1000) : "");
    if (x < 10000000) return inW(Math.floor(x/100000)) + " lakh" + (x%100000 ? " " + inW(x%100000) : "");
    return inW(Math.floor(x/10000000)) + " crore" + (x%10000000 ? " " + inW(x%10000000) : "");
  };
  return inW(Math.round(n));
}

export function CoverLetter({ data, calc }: Props) {
  const { customer, system } = data;
  const sysType = system.batteryIncluded && system.netMeter ? "Hybrid" : system.batteryIncluded ? "Off-Grid" : "On-Grid";
  const fmtINR = formatCurrency;
  const netWords = numWords(Math.round(calc.netCost));

  return (
    <div className="print-page bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto mt-4 page-break-before">

      {/* Header */}
      <div className="solar-header text-white px-8 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <PlenoxLogo size={38} variant="color" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">{COMPANY.name}</h1>
              <p className="text-orange-100 text-xs">{COMPANY.nameHi}</p>
              <p className="text-orange-200 text-xs">Empowering India with Clean Solar Energy</p>
            </div>
          </div>
          <div className="text-right text-xs text-orange-100">
            <p>LLPIN: {COMPANY.llpin}</p>
            <p>GST: {COMPANY.gst}</p>
            <p className="mt-1">{COMPANY.partners[0].phone} / {COMPANY.partners[1].phone}</p>
            <p>{COMPANY.email}</p>
          </div>
        </div>
      </div>

      <div className="px-10 py-8 text-sm text-gray-800 leading-relaxed">

        {/* Date + Subject */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-gray-500">Date: <span className="font-semibold text-gray-800">{customer.date}</span></p>
            <p className="text-gray-500 mt-0.5">Ref: <span className="font-semibold text-gray-800 font-mono">{customer.quoteNumber}</span></p>
          </div>
          <div className="text-right bg-orange-50 border border-orange-200 rounded-xl px-5 py-3">
            <p className="text-xs text-gray-400 mb-0.5">Letter for</p>
            <p className="font-bold text-gray-800">{customer.name}</p>
            {customer.phone && <p className="text-xs text-gray-500">{customer.phone}</p>}
            {customer.city && <p className="text-xs text-gray-500">{customer.city}, {customer.state}</p>}
          </div>
        </div>

        {/* Subject line */}
        <div className="bg-orange-50 border-l-4 border-orange-500 pl-4 py-2 mb-6 rounded-r-lg">
          <p className="font-bold text-gray-900">
            Subject: Solar {sysType} Power System Proposal – {system.systemCapacityKW} kW for {customer.name || "Your Premises"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            विषय: {system.systemCapacityKW} kW सौर ऊर्जा प्रणाली प्रस्ताव
          </p>
        </div>

        {/* Salutation */}
        <p className="mb-4">
          Dear <span className="font-semibold">{customer.name || "Sir/Madam"}</span>,
        </p>

        {/* Para 1 — Introduction */}
        <p className="mb-4">
          We, <strong>PLENOX ENTERPRISES LLP</strong>, are pleased to submit this solar energy proposal for your
          consideration. As authorised solar energy solution providers in Rajasthan, we offer end-to-end rooftop
          solar installations — from design and supply to installation, commissioning, and after-sales service.
        </p>

        {/* Para 2 — System Proposal */}
        <p className="mb-2 font-semibold text-gray-900">Proposed System Specifications:</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 mb-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">System Type</span>
              <span className="font-semibold">{sysType} Solar — {system.systemCapacityKW} kW</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Solar Panels</span>
              <span className="font-semibold">{system.panelCount} × {system.panelWattage} Wp ({system.panelType})</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Inverter</span>
              <span className="font-semibold">{system.inverterCapacityKW} kW {system.inverterType} – {system.inverterBrand}</span>
            </div>
            {system.batteryIncluded && (
              <div className="flex justify-between border-b border-gray-100 pb-1">
                <span className="text-gray-500">Battery Backup</span>
                <span className="font-semibold">{system.batteryCapacityKWh} kWh – {system.batteryBrand}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Structure</span>
              <span className="font-semibold">{system.structureType} on {system.roofType}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-gray-500">Net Metering</span>
              <span className="font-semibold">{system.netMeter ? "Included (Export to AVVNL Grid)" : "Not applicable"}</span>
            </div>
          </div>
        </div>

        {/* Para 3 — Financial Summary */}
        <p className="mb-2 font-semibold text-gray-900">Financial Summary:</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 mb-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Total Project Cost (incl. GST @{data.pricing.gstPercent}%)</span>
              <span className="font-semibold">{fmtINR(calc.totalBeforeSubsidy)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1 text-green-700">
              <span>PM Surya Ghar Central Subsidy</span>
              <span className="font-bold">– {fmtINR(calc.pmSubsidy)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1 col-span-2 font-bold text-orange-700">
              <span>Net Payable Amount</span>
              <span>{fmtINR(calc.netCost)} ({netWords.charAt(0).toUpperCase() + netWords.slice(1)} only)</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Annual Energy Generation</span>
              <span className="font-semibold">{Math.round(calc.annualGeneration).toLocaleString()} kWh/year</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">Estimated Annual Savings</span>
              <span className="font-semibold text-green-700">{fmtINR(calc.annualSavings)}/year</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-gray-500">Payback Period</span>
              <span className="font-semibold">{calc.paybackYears.toFixed(1)} years</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-gray-500">CO₂ Emission Reduction</span>
              <span className="font-semibold">{calc.co2SavedPerYear.toFixed(2)} tonnes/year</span>
            </div>
          </div>
        </div>

        {/* Para 4 — PM Surya Ghar scheme */}
        <p className="mb-2 font-semibold text-gray-900">PM Surya Ghar: Muft Bijlee Yojana (Govt. Subsidy):</p>
        <p className="mb-4 text-xs text-gray-700 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
          Under the <strong>PM Surya Ghar: Muft Bijlee Yojana</strong> launched by the Government of India
          (Ministry of New &amp; Renewable Energy), residential consumers are eligible for a Central Financial
          Assistance (CFA) of <strong>₹30,000/kW for the first 2 kW</strong> and <strong>₹18,000 for the 3rd kW</strong>,
          capped at <strong>₹78,000</strong> for systems up to 3 kW. For your {system.systemCapacityKW} kW system,
          the applicable subsidy is <strong>{fmtINR(calc.pmSubsidy)}</strong>, bringing your net investment to just{" "}
          <strong>{fmtINR(calc.netCost)}</strong>. Additionally, state-level incentives under RRECL (Rajasthan Renewable
          Energy Corporation Ltd.) may further reduce your cost — please enquire with our team.
        </p>

        {/* Para 5 — Why choose us */}
        <p className="mb-4">
          Our team handles the complete process — site survey, structural design, procurement of quality-certified
          equipment, installation by trained engineers, AVVNL net-meter application, and subsidy documentation.
          We provide a <strong>5-year installation warranty</strong> and ongoing AMC support.
          This quotation is valid for <strong>30 days</strong> from the date above.
        </p>

        <p className="mb-8">
          We look forward to partnering with you on this green energy journey. Please feel free to contact us for
          any clarification or a free site visit at your convenience.
        </p>

        {/* Closing + signatures */}
        <p className="mb-1">Yours sincerely,</p>
        <p className="text-xs text-gray-500 mb-8">For <strong className="text-gray-700">PLENOX ENTERPRISES LLP</strong></p>

        <div className="grid grid-cols-2 gap-10 mt-4">
          {COMPANY.partners.map(p => (
            <div key={p.name} className="border-t-2 border-gray-300 pt-3">
              <p className="font-bold text-gray-800 text-sm">{p.name}</p>
              <p className="text-xs text-gray-500">{p.designation}</p>
              <p className="text-xs text-gray-500">{p.phone}</p>
              <p className="text-xs text-orange-600 mt-1">PLENOX ENTERPRISES LLP</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="solar-header text-white text-center py-3 text-xs">
        <p>{COMPANY.name} | {COMPANY.address1}, {COMPANY.address2} | GST: {COMPANY.gst} | LLPIN: {COMPANY.llpin}</p>
      </div>
    </div>
  );
}
