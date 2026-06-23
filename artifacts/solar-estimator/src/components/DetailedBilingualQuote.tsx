import type { EstimateData, CalculatedQuote } from "../lib/types";
import { formatCurrency, formatNumber } from "../lib/calculations";
import { LetterheadHeader, LetterheadFooter, COMPANY, GRADIENT } from "./Letterhead";

interface Props {
  data: EstimateData;
  calc: CalculatedQuote;
}

const HSN: Record<string, string> = {
  "Solar Panel": "85414011",
  "Inverter": "85044090",
  "Battery": "85072000",
  "Structure": "73089090",
  "DC/AC Cables": "85446090",
  "ACDB": "85362000",
  "DCDB": "85362000",
  "Earthing": "74199990",
  "Lightning": "85363000",
  "Net Meter": "90281010",
  "Installation": "995461",
  "Other": "999900",
};

export function DetailedBilingualQuote({ data, calc }: Props) {
  const { customer, system, pricing } = data;
  const kw = system.systemCapacityKW;

  const bomRows: {
    srNo: number;
    hsn: string;
    categoryEn: string;
    categoryHi: string;
    spec: string;
    qty: string;
    unit: string;
    rate: string;
    amount: number;
  }[] = [];

  let sr = 1;

  bomRows.push({
    srNo: sr++, hsn: HSN["Solar Panel"],
    categoryEn: `Solar PV Panel – ${system.panelType}`,
    categoryHi: `सौर पीवी पैनल – ${system.panelType}`,
    spec: `${system.panelWattage} Wp, Poly/Mono Crystalline`,
    qty: `${system.panelCount}`, unit: "Nos",
    rate: `₹${pricing.panelRatePerWatt}/Wp`,
    amount: calc.panelCost,
  });

  bomRows.push({
    srNo: sr++, hsn: HSN["Inverter"],
    categoryEn: `${system.inverterType} – ${system.inverterBrand}`,
    categoryHi: `${system.inverterType === "String Inverter" ? "स्ट्रिंग इनवर्टर" : system.inverterType === "Micro Inverter" ? "माइक्रो इनवर्टर" : "हाइब्रिड इनवर्टर"} – ${system.inverterBrand}`,
    spec: `${system.inverterCapacityKW} kW, Grid-Tie`,
    qty: "1", unit: "Set",
    rate: formatCurrency(pricing.inverterRate),
    amount: calc.inverterCost,
  });

  bomRows.push({
    srNo: sr++, hsn: HSN["Structure"],
    categoryEn: `Mounting Structure – ${system.structureType}`,
    categoryHi: `माउंटिंग ढांचा – ${system.structureType === "GI Structure" ? "जीआई संरचना" : system.structureType === "MS Structure" ? "एमएस संरचना" : "एलिवेटेड एमएस संरचना"}`,
    spec: `${system.roofType}, ${kw} kW`,
    qty: `${kw}`, unit: "kW",
    rate: `₹${pricing.structureRate}/kW`,
    amount: calc.structureCost,
  });

  bomRows.push({
    srNo: sr++, hsn: HSN["DC/AC Cables"],
    categoryEn: "DC / AC Cables (Solar Grade)",
    categoryHi: "डीसी/एसी केबल (सोलर ग्रेड)",
    spec: "4 mm² DC + 6 mm² AC",
    qty: `${system.cableLength}`, unit: "Mtr",
    rate: `₹${pricing.cableRate}/m`,
    amount: calc.cableCost,
  });

  if (system.acdb) bomRows.push({
    srNo: sr++, hsn: HSN["ACDB"],
    categoryEn: "ACDB Box (AC Distribution Board)",
    categoryHi: "एसीडीबी बॉक्स",
    spec: "With MCB, Fuse & SPD",
    qty: "1", unit: "Set",
    rate: formatCurrency(pricing.acdbRate),
    amount: calc.acdbCost,
  });

  if (system.dcdb) bomRows.push({
    srNo: sr++, hsn: HSN["DCDB"],
    categoryEn: "DCDB Box (DC Distribution Board)",
    categoryHi: "डीसीडीबी बॉक्स",
    spec: "With Fuse & SPD",
    qty: "1", unit: "Set",
    rate: formatCurrency(pricing.dcdbRate),
    amount: calc.dcdbCost,
  });

  if (system.earthing) bomRows.push({
    srNo: sr++, hsn: HSN["Earthing"],
    categoryEn: "Earthing Kit",
    categoryHi: "अर्थिंग किट (तांबा प्लेट)",
    spec: "Copper Plate Type, IS 3043",
    qty: "2", unit: "Nos",
    rate: formatCurrency(pricing.earthingRate),
    amount: calc.earthingCost,
  });

  if (system.lightning) bomRows.push({
    srNo: sr++, hsn: HSN["Lightning"],
    categoryEn: "Lightning Arrester",
    categoryHi: "लाइटनिंग अरेस्टर",
    spec: "Class C, IEC 61643",
    qty: "1", unit: "Set",
    rate: formatCurrency(pricing.lightningRate),
    amount: calc.lightningCost,
  });

  if (system.netMeter) bomRows.push({
    srNo: sr++, hsn: HSN["Net Meter"],
    categoryEn: "Net Energy Meter",
    categoryHi: "नेट ऊर्जा मीटर (द्विदिशीय)",
    spec: "Bi-directional, as per DISCOM spec",
    qty: "1", unit: "Nos",
    rate: formatCurrency(pricing.netMeterRate),
    amount: calc.netMeterCost,
  });

  if (system.batteryIncluded) bomRows.push({
    srNo: sr++, hsn: HSN["Battery"],
    categoryEn: `Battery Bank – ${system.batteryBrand}`,
    categoryHi: `बैटरी बैंक – ${system.batteryBrand}`,
    spec: `${system.batteryCapacityKWh} kWh`,
    qty: "1", unit: "Set",
    rate: `₹${pricing.batteryRate}/kWh`,
    amount: calc.batteryCost,
  });

  if (system.installation) bomRows.push({
    srNo: sr++, hsn: HSN["Installation"],
    categoryEn: "Installation, Commissioning & Testing",
    categoryHi: "स्थापना, चालूकरण एवं परीक्षण (टर्नकी)",
    spec: `Turnkey, ${kw} kW`,
    qty: `${kw}`, unit: "kW",
    rate: `₹${pricing.installationRate}/kW`,
    amount: calc.installationCost,
  });

  if (calc.otherCost > 0) bomRows.push({
    srNo: sr++, hsn: HSN["Other"],
    categoryEn: "Other / Miscellaneous Charges",
    categoryHi: "अन्य / विविध प्रभार",
    spec: "As applicable",
    qty: "L.S.", unit: "—",
    rate: "—",
    amount: calc.otherCost,
  });

  const slab1 = Math.min(kw, 2) * 30000;
  const slab2 = kw >= 3 ? 18000 : 0;

  return (
    <div className="cover-letter-page print-page bg-white rounded-xl shadow-xl border border-gray-200 max-w-4xl mx-auto mb-8 overflow-hidden">

      {/* ── LETTERHEAD HEADER ── */}
      <LetterheadHeader
        quoteNumber={customer.quoteNumber}
        date={customer.date}
        title="Detailed Solar Quotation"
        titleHi="विस्तृत सौर प्रस्तावना"
      />

      {/* ── DOCUMENT TITLE BAND ── */}
      <div className="text-center py-3 border-b border-gray-200"
        style={{ background: "linear-gradient(90deg,#fff7ed,#fffbeb,#fff7ed)" }}>
        <h2 className="text-base font-black uppercase tracking-widest text-orange-700">
          Solar Power Plant — Detailed Cost Estimate
        </h2>
        <p className="text-sm text-orange-500 font-semibold">
          सौर ऊर्जा संयंत्र — विस्तृत लागत प्रस्तावना
        </p>
      </div>

      {/* ── CUSTOMER + SYSTEM INFO ── */}
      <div className="px-8 py-4 grid grid-cols-2 gap-6 border-b border-gray-100 bg-gray-50/50">
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">ग्राहक / Customer</p>
          <p className="font-bold text-gray-800">{customer.name || "—"}</p>
          {customer.address && <p className="text-xs text-gray-600">{customer.address}</p>}
          <p className="text-xs text-gray-600">{[customer.city, customer.state, customer.pincode].filter(Boolean).join(", ")}</p>
          {customer.phone && <p className="text-xs text-gray-600">मो.: {customer.phone}</p>}
          {customer.email && <p className="text-xs text-gray-600">{customer.email}</p>}
        </div>
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">सिस्टम विनिर्देश / System Specification</p>
          {[
            ["क्षमता / Capacity", `${kw} kWp`],
            ["पैनल / Panels", `${system.panelCount} × ${system.panelWattage} Wp (${system.panelType})`],
            ["इनवर्टर / Inverter", `${system.inverterCapacityKW} kW ${system.inverterBrand}`],
            ["संरचना / Structure", `${system.structureType}`],
            ["छत / Roof", system.roofType],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between text-xs border-b border-gray-100 py-0.5">
              <span className="text-gray-500">{l}</span>
              <span className="font-semibold text-gray-800">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOM TABLE ── */}
      <div className="px-8 py-4">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          सामग्री सूची / Bill of Materials &amp; Scope of Work
        </p>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="text-white text-xs"
              style={{ background: GRADIENT, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
              <th className="px-2 py-2 text-center font-semibold w-6">क्र. / Sr.</th>
              <th className="px-2 py-2 text-center font-semibold w-24">HSN</th>
              <th className="px-2 py-2 text-left font-semibold">
                श्रेणी / Category &amp; विनिर्देश / Spec
              </th>
              <th className="px-2 py-2 text-center font-semibold w-10">मात्रा<br/>Qty</th>
              <th className="px-2 py-2 text-center font-semibold w-10">इकाई<br/>Unit</th>
              <th className="px-2 py-2 text-right font-semibold w-20">दर / Rate</th>
              <th className="px-2 py-2 text-right font-semibold w-24">राशि / Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {bomRows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-orange-50/40"}>
                <td className="px-2 py-1.5 text-center text-gray-400">{row.srNo}</td>
                <td className="px-2 py-1.5 text-center font-mono text-gray-500">{row.hsn}</td>
                <td className="px-2 py-1.5">
                  <p className="font-semibold text-gray-800 leading-tight">{row.categoryEn}</p>
                  <p className="text-gray-500 leading-tight">{row.categoryHi}</p>
                  <p className="text-gray-400 leading-tight italic">{row.spec}</p>
                </td>
                <td className="px-2 py-1.5 text-center text-gray-700">{row.qty}</td>
                <td className="px-2 py-1.5 text-center text-gray-700">{row.unit}</td>
                <td className="px-2 py-1.5 text-right text-gray-600">{row.rate}</td>
                <td className="px-2 py-1.5 text-right font-semibold text-gray-800">{formatCurrency(row.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <td colSpan={6} className="px-2 py-2 text-right text-gray-700 uppercase tracking-wider text-xs">
                उप-कुल / Sub Total (Before GST)
              </td>
              <td className="px-2 py-2 text-right font-mono">{formatCurrency(calc.subTotal)}</td>
            </tr>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td colSpan={6} className="px-2 py-1.5 text-right text-gray-600 text-xs">
                GST @ {pricing.gstPercent}% (Goods &amp; Services Tax)
              </td>
              <td className="px-2 py-1.5 text-right font-mono text-gray-700">{formatCurrency(calc.gstAmount)}</td>
            </tr>
            <tr className="bg-orange-50 border-t-2 border-orange-300 font-bold">
              <td colSpan={6} className="px-2 py-2 text-right text-orange-800 uppercase tracking-wider text-xs">
                कुल / Gross Total (GST सहित / Incl. GST)
              </td>
              <td className="px-2 py-2 text-right font-mono text-orange-800">{formatCurrency(calc.totalBeforeSubsidy)}</td>
            </tr>
            <tr className="bg-green-50 border-t border-green-200 text-green-700">
              <td colSpan={6} className="px-2 py-1.5 text-right text-xs italic">
                Less: PM Surya Ghar Central Subsidy ({kw} kW, DCR modules)
                &nbsp;—&nbsp; कम: पीएम सूर्य घर केंद्रीय सब्सिडी
              </td>
              <td className="px-2 py-1.5 text-right font-mono">−{formatCurrency(calc.pmSubsidy)}</td>
            </tr>
            <tr className="border-t-2 border-orange-500 font-black text-base">
              <td colSpan={6} className="px-2 py-2.5 text-right text-orange-700 uppercase tracking-wider text-sm">
                शुद्ध देय राशि / Net Payable Amount
              </td>
              <td className="px-2 py-2.5 text-right font-mono text-orange-700">{formatCurrency(calc.netCost)}</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-xs text-gray-400 mt-1">
          * सब्सिडी राशि भारत सरकार द्वारा DBT के माध्यम से ग्राहक के बैंक खाते में सीधे जमा की जाएगी।
          Subsidy credited directly to customer's bank account by Government of India via DBT after commissioning.
        </p>
      </div>

      {/* ── PERFORMANCE METRICS GRID ── */}
      <div className="px-8 pb-4">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
          अपेक्षित प्रदर्शन / Expected Performance
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { en: "Annual Generation", hi: "वार्षिक उत्पादन", val: `${formatNumber(calc.annualGeneration, 0)} kWh/yr` },
            { en: "Annual Savings", hi: "वार्षिक बचत", val: formatCurrency(calc.annualSavings) },
            { en: "Payback Period", hi: "पेबैक अवधि", val: `${formatNumber(calc.paybackYears, 1)} वर्ष/yrs` },
            { en: "CO₂ Saved/yr", hi: "CO₂ बचत/वर्ष", val: `${formatNumber(calc.co2SavedPerYear, 2)} टन` },
          ].map(({ en, hi, val }) => (
            <div key={en} className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-center">
              <p className="text-xs text-gray-500 leading-tight">{en}</p>
              <p className="text-xs text-gray-400 leading-tight">{hi}</p>
              <p className="font-bold font-mono text-gray-800 mt-1">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BANK PAYMENT DETAILS ── */}
      <div className="mx-8 mb-4 border border-blue-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2 text-white text-xs font-bold flex items-center gap-2" style={{ background: "#1d4ed8" }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>भुगतान विवरण / Payment Details — Bank Transfer</span>
        </div>
        <div className="px-4 py-3 bg-blue-50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {[
              ["बैंक / Bank", "Bank of Baroda"],
              ["शाखा / Branch", "Garhi Branch"],
              ["IFSC कोड / IFSC Code", "BARB0GARHIX"],
              ["खाता संख्या / Account No.", "123456789012"],
              ["खाताधारक / Account Name", "PLENOX ENTERPRISES LLP"],
              ["खाता प्रकार / Account Type", "Current Account"],
            ].map(([label, value]) => (
              <div key={label} className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-blue-500 leading-tight">{label}</p>
                <p className="font-bold text-blue-900 leading-tight mt-0.5 font-mono">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-600 mt-2">
            ⚠️ कृपया भुगतान के बाद UTR / Transaction ID हमें WhatsApp या Email पर अवश्य भेजें।
            &nbsp;<em>Please share UTR / Transaction ID via WhatsApp or Email after transfer.</em>
          </p>
        </div>
      </div>

      {/* ── PM SURYA GHAR SUBSIDY SLAB BREAKDOWN ── */}
      <div className="mx-8 mb-4 border border-green-300 rounded-xl overflow-hidden" style={{ background: "#f0fdf4" }}>
        <div className="px-4 py-2 text-white text-xs font-bold flex items-center gap-2" style={{ background: "#16a34a" }}>
          <span>☀️</span>
          <span>PM Surya Ghar: Muft Bijlee Yojana — Subsidy Slab Detail</span>
          <span className="font-normal opacity-80">| पीएम सूर्य घर: मुफ्त बिजली योजना — सब्सिडी स्लैब विवरण</span>
        </div>
        <div className="px-4 py-3">
          <div className="grid grid-cols-3 gap-3 mb-2">
            <div className="bg-white rounded-lg p-2.5 border border-green-200 text-center">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                पहले {Math.min(kw, 2)} kW / First {Math.min(kw, 2)} kW
              </p>
              <p className="font-bold text-green-800 font-mono mt-1">₹30,000/kW</p>
              <p className="text-green-700 font-mono text-sm">= {formatCurrency(slab1)}</p>
            </div>
            {kw >= 3 ? (
              <div className="bg-white rounded-lg p-2.5 border border-green-200 text-center">
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">तीसरा kW / 3rd kW</p>
                <p className="font-bold text-green-800 font-mono mt-1">₹18,000/kW</p>
                <p className="text-green-700 font-mono text-sm">= {formatCurrency(slab2)}</p>
              </div>
            ) : (
              <div className="bg-white/50 rounded-lg p-2.5 border border-green-100 text-center opacity-40">
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">3rd kW Slab</p>
                <p className="text-green-600 text-xs mt-1">{kw} kW सिस्टम पर लागू नहीं<br/>N/A for {kw} kW</p>
              </div>
            )}
            <div className="rounded-lg p-2.5 border border-green-600 text-center" style={{ background: "#16a34a" }}>
              <p className="text-xs text-white/80 font-semibold uppercase tracking-wider">कुल सब्सिडी / Total Subsidy</p>
              <p className="font-black text-white font-mono text-xl mt-1">{formatCurrency(calc.pmSubsidy)}</p>
              <p className="text-white/70 text-xs">Central Govt. CFA (DBT)</p>
            </div>
          </div>
          <p className="text-xs text-green-700 leading-relaxed">
            <strong>शर्तें / Conditions:</strong> आवासीय परिसर | Residential premises &nbsp;•&nbsp;
            DCR प्रमाणित मॉड्यूल | DCR certified modules &nbsp;•&nbsp;
            ग्रिड-कनेक्टेड सिस्टम | Grid-connected system &nbsp;•&nbsp;
            DISCOM नेट मीटरिंग | Net metering by DISCOM
          </p>
        </div>
      </div>

      {/* ── TERMS & CONDITIONS (BILINGUAL) ── */}
      <div className="px-8 pb-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          नियम एवं शर्तें / Terms &amp; Conditions
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-xs text-gray-500 leading-relaxed">
          <div className="space-y-1">
            <p><strong>1.</strong> यह प्रस्तावना जारी दिनांक से <strong>30 दिनों</strong> तक वैध है।
              &nbsp;<em>Valid for 30 days from date of issue.</em></p>
            <p><strong>2.</strong> <strong>भुगतान अनुसूची:</strong> 50% अग्रिम, 40% सामग्री वितरण से पूर्व, 10% चालूकरण पर।
              &nbsp;<em>50% advance, 40% pre-delivery, 10% at commissioning.</em></p>
            <p><strong>3.</strong> अग्रिम भुगतान के पश्चात् <strong>7–15 कार्य दिवसों</strong> में स्थापना पूर्ण होगी।
              &nbsp;<em>Installation within 7–15 working days of advance payment.</em></p>
            <p><strong>4.</strong> सभी पैनल पर <strong>25 वर्षीय प्रदर्शन वारंटी</strong>; इनवर्टर वारंटी ब्रांड के अनुसार।
              &nbsp;<em>25-yr panel performance warranty; inverter as per brand.</em></p>
          </div>
          <div className="space-y-1">
            <p><strong>5.</strong> नेट मीटर आवेदन एवं DISCOM शुल्क ग्राहक द्वारा देय होंगे।
              &nbsp;<em>Net meter &amp; DISCOM charges payable by customer.</em></p>
            <p><strong>6.</strong> सब्सिडी राशि एवं समय-सीमा सरकारी योजना की उपलब्धता पर निर्भर।
              &nbsp;<em>Subsidy subject to government scheme availability.</em></p>
            <p><strong>7.</strong> अतिरिक्त सिविल कार्य, यदि आवश्यक, वास्तविक लागत पर अलग से चार्ज होगा।
              &nbsp;<em>Extra civil work charged at actuals, if required.</em></p>
            <p><strong>8.</strong> GST दर परिवर्तन की स्थिति में मूल्य परिवर्तनशील।
              &nbsp;<em>Prices subject to revision on GST rate change.</em></p>
          </div>
        </div>
      </div>

      {/* ── SIGNATURE STRIP ── */}
      <div className="px-8 pb-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="h-14 border-b border-gray-300 mb-2"></div>
            <p className="text-xs font-semibold text-gray-600">ग्राहक के हस्ताक्षर</p>
            <p className="text-xs text-gray-500">Customer Signature</p>
            <p className="text-sm font-medium text-gray-700 mt-1">{customer.name || "________________"}</p>
          </div>
          <div className="text-center">
            <div className="h-14 mb-2 flex items-end justify-center pb-1">
              <div className="text-xs text-orange-500 border border-orange-200 rounded px-4 py-2 font-semibold">
                COMPANY SEAL / मुहर
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-600">कंपनी मुहर</p>
            <p className="text-xs text-gray-500">Company Seal</p>
          </div>
          <div className="text-center">
            <div className="h-14 border-b border-gray-300 mb-2"></div>
            <p className="text-xs font-semibold text-orange-700">अधिकृत हस्ताक्षरकर्ता</p>
            <p className="text-xs text-gray-500">Authorised Signatory</p>
            <p className="text-sm font-bold text-gray-800 mt-1">{COMPANY.signatory}</p>
            <p className="text-xs text-gray-500">{COMPANY.signatoryDesig}</p>
            <p className="text-xs text-gray-600 font-semibold">{COMPANY.name}</p>
          </div>
        </div>
      </div>

      {/* ── LETTERHEAD FOOTER ── */}
      <LetterheadFooter />
    </div>
  );
}
