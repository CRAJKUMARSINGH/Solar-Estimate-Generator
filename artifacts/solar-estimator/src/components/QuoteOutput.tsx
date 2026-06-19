import { useRef } from "react";
import type { EstimateData } from "../lib/types";
import { calculateQuote, formatCurrency, formatNumber } from "../lib/calculations";

const COMPANY = {
  name: "PLENOX ENTERPRISES LLP",
  nameHi: "प्लेनोक्स एंटरप्राइजेज़ एलएलपी",
  tagline: "Empowering India with Clean Solar Energy",
  taglineHi: "स्वच्छ सौर ऊर्जा से भारत को सशक्त बनाना",
  llpin: "ACX-0404",
  gst: "08ABJFP2658K1ZP",
  email: "vproyalenterprisesllp@gmail.com",
  address1: "V.P New Bustand Arthuna, Tehsils Arthuna",
  address2: "Banswara, Rajasthan – 327032",
  address1Hi: "वी.पी. न्यू बस स्टैंड अर्थुना, तहसील अर्थुना",
  address2Hi: "बाँसवाड़ा, राजस्थान – 327032",
  partners: [
    { name: "Vishal Panchal", phone: "+91 96601 81211" },
    { name: "Prince Panchal", phone: "+91 97727 13293" },
  ],
  signatory: "Vishal Panchal",
  signatoryDesig: "Designated Partner / नामित भागीदार",
};

interface Props {
  data: EstimateData;
  onBack: () => void;
}

export function QuoteOutput({ data, onBack }: Props) {
  const printRef = useRef<HTMLDivElement>(null);
  const quote = calculateQuote(data);
  const { customer, system } = data;

  const bomRows: { label: string; labelHi: string; spec: string; qty: string; rate: string; amount: number }[] = [
    {
      label: `Solar Panel – ${system.panelType}`,
      labelHi: `सौर पैनल – ${system.panelType}`,
      spec: `${system.panelWattage} Wp`,
      qty: `${system.panelCount} Nos`,
      rate: `₹${data.pricing.panelRatePerWatt}/Wp`,
      amount: quote.panelCost,
    },
    {
      label: `${system.inverterType} – ${system.inverterBrand}`,
      labelHi: `इनवर्टर – ${system.inverterBrand}`,
      spec: `${system.inverterCapacityKW} kW`,
      qty: "1 Set",
      rate: formatCurrency(data.pricing.inverterRate),
      amount: quote.inverterCost,
    },
    {
      label: `${system.structureType} – ${system.roofType}`,
      labelHi: `संरचना – ${system.roofType}`,
      spec: `${system.systemCapacityKW} kW`,
      qty: `${system.systemCapacityKW} kW`,
      rate: `₹${data.pricing.structureRate}/kW`,
      amount: quote.structureCost,
    },
    {
      label: "DC/AC Cables",
      labelHi: "DC/AC केबल (सौर ग्रेड)",
      spec: "Solar Grade",
      qty: `${system.cableLength} m`,
      rate: `₹${data.pricing.cableRate}/m`,
      amount: quote.cableCost,
    },
    ...(system.acdb ? [{
      label: "ACDB Box", labelHi: "ACDB बॉक्स",
      spec: "With MCB & SPD", qty: "1 Set",
      rate: formatCurrency(data.pricing.acdbRate), amount: quote.acdbCost,
    }] : []),
    ...(system.dcdb ? [{
      label: "DCDB Box", labelHi: "DCDB बॉक्स",
      spec: "With Fuse & SPD", qty: "1 Set",
      rate: formatCurrency(data.pricing.dcdbRate), amount: quote.dcdbCost,
    }] : []),
    ...(system.earthing ? [{
      label: "Earthing Kit", labelHi: "अर्थिंग किट (तांबा प्लेट)",
      spec: "Copper Plate Type", qty: "2 Nos",
      rate: formatCurrency(data.pricing.earthingRate), amount: quote.earthingCost,
    }] : []),
    ...(system.lightning ? [{
      label: "Lightning Arrester", labelHi: "लाइटनिंग अरेस्टर",
      spec: "Class C", qty: "1 Set",
      rate: formatCurrency(data.pricing.lightningRate), amount: quote.lightningCost,
    }] : []),
    ...(system.netMeter ? [{
      label: "Net Meter", labelHi: "नेट मीटर (द्विदिशीय)",
      spec: "Bi-directional", qty: "1 Nos",
      rate: formatCurrency(data.pricing.netMeterRate), amount: quote.netMeterCost,
    }] : []),
    ...(system.batteryIncluded ? [{
      label: `Battery – ${system.batteryBrand}`,
      labelHi: `बैटरी – ${system.batteryBrand}`,
      spec: `${system.batteryCapacityKWh} kWh`, qty: "1 Set",
      rate: `₹${data.pricing.batteryRate}/kWh`, amount: quote.batteryCost,
    }] : []),
    ...(system.installation ? [{
      label: "Installation & Commissioning", labelHi: "स्थापना एवं चालू करना",
      spec: "Turnkey", qty: `${system.systemCapacityKW} kW`,
      rate: `₹${data.pricing.installationRate}/kW`, amount: quote.installationCost,
    }] : []),
    ...(quote.otherCost > 0 ? [{
      label: "Other Charges / Miscellaneous", labelHi: "अन्य प्रभार / विविध",
      spec: "—", qty: "L.S.", rate: "—", amount: quote.otherCost,
    }] : []),
  ];

  const handleWhatsApp = () => {
    const fmtINR = (n: number) =>
      new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

    const msg = [
      `🌞 *Solar Quotation — PLENOX ENTERPRISES LLP*`,
      ``,
      `नमस्ते ${customer.name || "महोदय/महोदया"},`,
      `आपकी सौर ऊर्जा प्रणाली की अनुमानित लागत निम्नानुसार है:`,
      ``,
      `📋 *Quote No.:* ${customer.quoteNumber}`,
      `📅 *Date:* ${customer.date}`,
      ``,
      `⚡ *System Size:* ${system.systemCapacityKW} kW`,
      `🔆 *Panels:* ${system.panelCount} × ${system.panelWattage} Wp (${system.panelType})`,
      `🔌 *Inverter:* ${system.inverterCapacityKW} kW ${system.inverterBrand}`,
      ``,
      `💰 *Total (incl. GST):* ${fmtINR(quote.totalBeforeSubsidy)}`,
      `🏛️ *PM Surya Ghar Subsidy:* – ${fmtINR(quote.pmSubsidy)}`,
      `✅ *Net Payable:* *${fmtINR(quote.netCost)}*`,
      ``,
      `📈 *Annual Savings:* ${fmtINR(quote.annualSavings)}/yr`,
      `⏱️ *Payback Period:* ${quote.paybackYears.toFixed(1)} years`,
      ``,
      `यह कोटेशन 30 दिन तक मान्य है।`,
      `_This quotation is valid for 30 days._`,
      ``,
      `📞 Vishal Panchal: +91 96601 81211`,
      `📞 Prince Panchal: +91 97727 13293`,
      `📧 vproyalenterprisesllp@gmail.com`,
      ``,
      `_PLENOX ENTERPRISES LLP | GST: 08ABJFP2658K1ZP_`,
    ].join("\n");

    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="no-print flex items-center gap-3 mb-5 flex-wrap">
        <button onClick={onBack}
          className="px-4 py-2 text-sm border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors">
          ← Edit / विवरण बदलें
        </button>
        <button onClick={() => window.print()}
          className="px-5 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / PDF
        </button>
        <button onClick={handleWhatsApp}
          className="px-5 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp Share
        </button>
        <span className="text-xs text-gray-400">Opens WhatsApp with ready message</span>
      </div>

      {/* Printable document */}
      <div ref={printRef} className="print-page bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">

        {/* ── HEADER ── */}
        <div className="solar-header text-white px-8 py-5">
          <div className="flex items-start justify-between gap-4">

            {/* Left: Logo + Name + Address */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.5 8.5H20L14.5 12.5L16.5 19L12 15L7.5 19L9.5 12.5L4 8.5H10.5L12 2Z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight leading-tight">{COMPANY.name}</h1>
                  <p className="text-orange-100 text-xs font-semibold">{COMPANY.nameHi}</p>
                  <p className="text-orange-200 text-xs">{COMPANY.tagline} | {COMPANY.taglineHi}</p>
                </div>
              </div>
              {/* 2-row address */}
              <div className="bg-white/15 rounded-lg px-4 py-2 text-xs text-white space-y-0.5 mt-1">
                <p className="font-semibold">{COMPANY.address1} | {COMPANY.address1Hi}</p>
                <p className="font-semibold">{COMPANY.address2} | {COMPANY.address2Hi}</p>
                <p className="text-orange-100">GST: {COMPANY.gst} &nbsp;|&nbsp; LLPIN: {COMPANY.llpin} &nbsp;|&nbsp; {COMPANY.email}</p>
                <p className="text-orange-100">
                  {COMPANY.partners.map(p => `${p.name}: ${p.phone}`).join("  |  ")}
                </p>
              </div>
            </div>

            {/* Right: Quote badge */}
            <div className="text-right flex-shrink-0">
              <div className="bg-white/20 backdrop-blur rounded-xl px-5 py-3 text-center">
                <p className="text-xs text-orange-100 font-semibold uppercase tracking-wider">Quotation / प्रस्तावना</p>
                <p className="text-lg font-black font-mono mt-1">{customer.quoteNumber}</p>
                <p className="text-xs text-orange-100 mt-1">Date / दिनांक: {customer.date}</p>
              </div>
              <div className="mt-2 inline-block bg-green-400/30 text-white text-xs font-bold px-3 py-1 rounded-full border border-green-300/50">
                Valid 30 Days / 30 दिन मान्य
              </div>
            </div>
          </div>
        </div>

        {/* ── CUSTOMER STRIP ── */}
        <div className="bg-orange-50 border-b border-orange-100 px-8 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                ग्राहक / Customer
              </p>
              <p className="text-base font-bold text-gray-800">{customer.name || "—"}</p>
              {customer.address && <p className="text-sm text-gray-600">{customer.address}</p>}
              <p className="text-sm text-gray-600">
                {[customer.city, customer.state, customer.pincode].filter(Boolean).join(", ")}
              </p>
              {customer.phone && <p className="text-sm text-gray-600">मो. / Ph: {customer.phone}</p>}
              {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 font-semibold">सिस्टम क्षमता / Capacity</p>
              <p className="text-3xl font-black text-orange-600">{system.systemCapacityKW} kW</p>
              <p className="text-xs text-gray-500">{system.panelCount} × {system.panelWattage} Wp</p>
            </div>
          </div>
        </div>

        {/* ── SYSTEM OVERVIEW ── */}
        <div className="px-8 py-4 bg-white border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            सिस्टम विवरण / System Overview
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["System Size / क्षमता", `${system.systemCapacityKW} kWp`],
              ["Panels / पैनल", `${system.panelCount} × ${system.panelWattage} Wp (${system.panelType})`],
              ["Inverter / इनवर्टर", `${system.inverterCapacityKW} kW ${system.inverterType} (${system.inverterBrand})`],
              ["Structure / संरचना", `${system.structureType} – ${system.roofType}`],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                <p className="text-xs text-gray-500 leading-tight">{label}</p>
                <p className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── BILL OF MATERIALS ── */}
        <div className="px-8 py-5">
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            सामग्री एवं कार्य विवरण / Bill of Materials &amp; Scope of Work
          </p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-orange-500 text-white text-xs">
                <th className="px-2 py-2 text-left font-semibold rounded-tl-lg w-6">#</th>
                <th className="px-2 py-2 text-left font-semibold">
                  विवरण / Description
                </th>
                <th className="px-2 py-2 text-left font-semibold hidden md:table-cell">Spec</th>
                <th className="px-2 py-2 text-center font-semibold w-16">मात्रा / Qty</th>
                <th className="px-2 py-2 text-right font-semibold w-24">दर / Rate</th>
                <th className="px-2 py-2 text-right font-semibold rounded-tr-lg w-28">राशि / Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bomRows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-orange-50/40"}>
                  <td className="px-2 py-2 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-2 py-2">
                    <p className="font-semibold text-gray-800 text-xs leading-tight">{row.label}</p>
                    <p className="text-gray-500 text-xs leading-tight">{row.labelHi}</p>
                  </td>
                  <td className="px-2 py-2 text-gray-600 text-xs hidden md:table-cell">{row.spec}</td>
                  <td className="px-2 py-2 text-center text-gray-600 text-xs">{row.qty}</td>
                  <td className="px-2 py-2 text-right text-gray-600 text-xs">{row.rate}</td>
                  <td className="px-2 py-2 text-right font-semibold text-gray-800 text-xs">{formatCurrency(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── COST SUMMARY + BENEFITS ── */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Cost */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-700 text-white px-4 py-2 text-xs font-bold">
                लागत सारांश / Cost Summary
              </div>
              <div className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">उप-कुल / Sub Total</span>
                  <span className="font-semibold">{formatCurrency(quote.subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GST @ {data.pricing.gstPercent}%</span>
                  <span className="font-semibold">{formatCurrency(quote.gstAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-gray-800">
                  <span>कुल / Total (GST सहित)</span>
                  <span>{formatCurrency(quote.totalBeforeSubsidy)}</span>
                </div>
                <div className="flex justify-between text-green-700 font-semibold bg-green-50 -mx-4 px-4 py-2 rounded">
                  <span>PM सूर्य घर सब्सिडी / Subsidy</span>
                  <span>– {formatCurrency(quote.pmSubsidy)}</span>
                </div>
                <div className="flex justify-between border-t-2 border-orange-400 pt-2">
                  <span className="text-base font-black text-orange-600">शुद्ध देय / Net Payable</span>
                  <span className="text-base font-black text-orange-600">{formatCurrency(quote.netCost)}</span>
                </div>
                <p className="text-xs text-gray-400">*सब्सिडी सरकार द्वारा सीधे बैंक खाते में / Credited by Govt. to bank</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 rounded-xl border border-green-200 overflow-hidden">
              <div className="bg-green-600 text-white px-4 py-2 text-xs font-bold">
                अपेक्षित लाभ / Expected Benefits
              </div>
              <div className="p-4 space-y-2 text-sm">
                {[
                  ["वार्षिक उत्पादन / Annual Gen.", `${formatNumber(quote.annualGeneration, 0)} kWh/yr`],
                  ["बिजली दर / Tariff (avg)", "₹8 प्रति यूनिट / per unit"],
                  ["वार्षिक बचत / Annual Savings", formatCurrency(quote.annualSavings)],
                  ["पेबैक अवधि / Payback Period", `${formatNumber(quote.paybackYears, 1)} वर्ष / yrs`],
                  ["सिस्टम आयु / Lifespan", "25+ वर्ष / years"],
                  ["CO₂ बचत / CO₂ Saved/yr", `${formatNumber(quote.co2SavedPerYear, 2)} टन / Tonnes`],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-600 text-xs">{label}</span>
                    <span className="font-semibold text-green-800 text-xs text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── PM SURYA GHAR STRIP ── */}
        <div className="mx-8 mb-5 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3 items-start">
            <div className="text-2xl">☀️</div>
            <div>
              <p className="font-bold text-amber-800 text-sm">
                PM Surya Ghar: Muft Bijlee Yojana | PM सूर्य घर: मुफ्त बिजली योजना (केंद्र सरकार)
              </p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                <strong>सब्सिडी:</strong> 0–2 kW: ₹30,000/kW &nbsp;|&nbsp; 2–3 kW: ₹18,000/kW &nbsp;|&nbsp; 3 kW से अधिक: अधिकतम ₹78,000.
                &nbsp;Subsidy is credited directly by Government to the customer's bank account via DBT.
                State subsidy may also be applicable. | राज्य सरकार की अतिरिक्त सब्सिडी भी मिल सकती है।
              </p>
            </div>
          </div>
        </div>

        {/* ── TERMS (BILINGUAL) ── */}
        <div className="px-8 pb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            नियम एवं शर्तें / Terms &amp; Conditions
          </p>
          <div className="text-xs text-gray-500 space-y-1 leading-relaxed">
            <p>1. यह कोटेशन जारी होने की तिथि से <strong>30 दिनों</strong> तक मान्य है। | Valid for <strong>30 days</strong>.</p>
            <p>2. <strong>भुगतान:</strong> 50% अग्रिम, 40% सामग्री वितरण से पहले, 10% चालू होने पर। | 50% advance, 40% before delivery, 10% at commissioning.</p>
            <p>3. अग्रिम भुगतान के बाद <strong>7–15 कार्य दिवसों</strong> में स्थापना पूर्ण होगी। | Installation in <strong>7–15 working days</strong>.</p>
            <p>4. सभी पैनल पर <strong>25 वर्ष का प्रदर्शन वारंटी</strong>। इनवर्टर वारंटी ब्रांड अनुसार। | 25-yr panel warranty; inverter as per brand.</p>
            <p>5. नेट मीटर आवेदन शुल्क एवं DISCOM शुल्क ग्राहक द्वारा देय। | Net meter &amp; DISCOM charges payable by customer.</p>
            <p>6. सब्सिडी राशि एवं समयसीमा सरकारी योजना की उपलब्धता पर निर्भर। | Subsidy subject to govt. scheme availability.</p>
            <p>7. अतिरिक्त सिविल कार्य, यदि आवश्यक, वास्तविक लागत पर अलग से चार्ज होगा।</p>
            <p>8. GST दर परिवर्तन की स्थिति में मूल्य परिवर्तनशील। | Prices subject to GST revision.</p>
          </div>
        </div>

        {/* ── SIGNATURE STRIP ── */}
        <div className="px-8 pb-8 border-t border-gray-100 pt-5">
          <div className="grid grid-cols-3 gap-6">
            {/* Customer */}
            <div className="text-center">
              <div className="h-14 border-b border-gray-300 mb-2"></div>
              <p className="text-xs font-semibold text-gray-600">ग्राहक के हस्ताक्षर</p>
              <p className="text-xs text-gray-500">Customer Signature</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{customer.name || "________________"}</p>
            </div>
            {/* Company seal */}
            <div className="text-center">
              <div className="h-14 mb-2 flex items-end justify-center pb-1">
                <div className="text-xs text-orange-400 border border-orange-200 rounded px-4 py-2 font-semibold">
                  COMPANY SEAL / मुहर
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-600">कंपनी मुहर</p>
              <p className="text-xs text-gray-500">Company Seal</p>
            </div>
            {/* Authorised Signatory */}
            <div className="text-center">
              <div className="h-14 border-b border-gray-300 mb-2"></div>
              <p className="text-xs font-semibold text-orange-700">अधिकृत हस्ताक्षरकर्ता</p>
              <p className="text-xs text-gray-500">Authorised Signatory</p>
              <p className="text-sm font-bold text-gray-800 mt-1">{COMPANY.signatory}</p>
              <p className="text-xs text-gray-500">{COMPANY.signatoryDesig}</p>
              <p className="text-xs text-gray-600 font-semibold">PLENOX ENTERPRISES LLP</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="solar-header text-white text-center py-3 text-xs">
          <p className="font-semibold">{COMPANY.name} | {COMPANY.nameHi}</p>
          <p className="text-orange-100 mt-0.5">
            {COMPANY.address1}, {COMPANY.address2} &nbsp;|&nbsp; GST: {COMPANY.gst} &nbsp;|&nbsp; LLPIN: {COMPANY.llpin}
          </p>
          <p className="text-orange-200 mt-0.5">{COMPANY.email} | Vishal: +91 96601 81211 | Prince: +91 97727 13293</p>
        </div>
      </div>
    </div>
  );
}
