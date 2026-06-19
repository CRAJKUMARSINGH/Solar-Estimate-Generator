import { useState, useRef } from "react";
import { PlenoxLogo } from "../components/PlenoxLogo";

const COMPANY = {
  name: "PLENOX ENTERPRISES LLP",
  gst: "08ABJFP2658K1ZP",
  llpin: "ACX-0404",
  address: "V.P. New Bus Stand Arthuna, Tehsil- Arthuna, Banswara, Rajasthan - 327032",
  email: "vproyalenterprisesllp@gmail.com",
  vishal: "+91 96601 81211",
  prince: "+91 97727 13293",
  state: "Rajasthan",
  stateCode: "08",
};

interface LineItem {
  id: string;
  description: string;
  hsnCode: string;
  unit: string;
  qty: number;
  rate: number;
}

interface BillData {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  billType: "Tax Invoice" | "Proforma Invoice" | "Receipt";
  supplyType: "Intra-State (CGST+SGST)" | "Inter-State (IGST)";
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerPincode: string;
  customerPhone: string;
  customerGST: string;
  poNumber: string;
  paymentTerms: string;
  gstPercent: number;
  items: LineItem[];
  remarks: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  accountHolder: string;
  amountPaid: number;
}

const PRESET_ITEMS: { description: string; hsnCode: string; unit: string }[] = [
  { description: "Solar PV Module (Mono PERC / Bifacial TOPCon)", hsnCode: "85414011", unit: "Nos" },
  { description: "Solar Grid-Tie String Inverter", hsnCode: "85044090", unit: "Nos" },
  { description: "Hybrid Inverter with MPPT Charge Controller", hsnCode: "85044090", unit: "Nos" },
  { description: "GI Mounting Structure (Rooftop)", hsnCode: "73089090", unit: "Set" },
  { description: "DC Cable (Solar Grade 4 sq.mm)", hsnCode: "85444290", unit: "Mtr" },
  { description: "AC Cable (Copper 6 sq.mm)", hsnCode: "85444290", unit: "Mtr" },
  { description: "ACDB Box with MCB & SPD", hsnCode: "85369090", unit: "Set" },
  { description: "DCDB Box with Fuse Holder & SPD", hsnCode: "85369090", unit: "Set" },
  { description: "Earthing Kit (Copper Plate)", hsnCode: "85359000", unit: "Set" },
  { description: "Lightning Arrester", hsnCode: "85359000", unit: "Nos" },
  { description: "Net Meter (Bi-directional)", hsnCode: "90281010", unit: "Nos" },
  { description: "Solar Li-ion / VRLA Battery", hsnCode: "85072000", unit: "Nos" },
  { description: "Conduit Pipe & Fittings", hsnCode: "39172100", unit: "Mtr" },
  { description: "Installation & Commissioning Charges", hsnCode: "998714", unit: "kW" },
  { description: "Transportation & Handling Charges", hsnCode: "996511", unit: "L.S." },
  { description: "Annual Maintenance Contract (AMC)", hsnCode: "998719", unit: "Year" },
  { description: "Project Documentation & Liaison", hsnCode: "998314", unit: "L.S." },
];

function genInvoiceNo() {
  const d = new Date();
  const yr = d.getFullYear().toString().slice(2);
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `PEL/INV/${yr}-${String(Number(yr) + 1)}/${mo}/${rand}`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function dueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split("T")[0];
}

function newItem(): LineItem {
  return { id: Math.random().toString(36).slice(2), description: "", hsnCode: "", unit: "Nos", qty: 1, rate: 0 };
}

function mkRow(description: string, hsnCode: string, unit: string, qty: number, rate: number): LineItem {
  return { id: Math.random().toString(36).slice(2), description, hsnCode, unit, qty, rate };
}

function standardBOM(): LineItem[] {
  return [
    mkRow("Solar PV Module – Mono PERC / Bifacial TOPCon",  "85414011", "Nos",  6,   28000),
    mkRow("Solar Grid-Tie String Inverter",                  "85044090", "Nos",  1,   35000),
    mkRow("GI Mounting Structure (Rooftop – RCC)",           "73089090", "Set",  3,    8000),
    mkRow("DC Cable – Solar Grade 4 sq.mm (Red/Black)",      "85444290", "Mtr", 30,      80),
    mkRow("AC Cable – Copper 6 sq.mm",                       "85444290", "Mtr", 20,     100),
    mkRow("ACDB Box with MCB & SPD",                         "85369090", "Set",  1,    3500),
    mkRow("DCDB Box with Fuse Holder & SPD",                 "85369090", "Set",  1,    3500),
    mkRow("Earthing Kit – Copper Plate Type",                "85359000", "Set",  2,    5000),
    mkRow("Lightning Arrester – Class C",                    "85359000", "Nos",  1,    6000),
    mkRow("Net Meter – Bi-directional",                      "90281010", "Nos",  1,    8000),
    mkRow("Conduit Pipe, MC4 Connectors & Accessories",      "39172100", "L.S.", 1,    2000),
    mkRow("Installation & Commissioning Charges",            "998714",   "kW",   3,    5000),
    mkRow("Transportation & Handling Charges",               "996511",   "L.S.", 1,    2000),
  ];
}

export function BillInvoice() {
  const [bill, setBill] = useState<BillData>({
    invoiceNo: genInvoiceNo(),
    invoiceDate: today(),
    dueDate: dueDate(),
    billType: "Tax Invoice",
    supplyType: "Intra-State (CGST+SGST)",
    customerName: "",
    customerAddress: "",
    customerCity: "",
    customerState: "Rajasthan",
    customerPincode: "",
    customerPhone: "",
    customerGST: "",
    poNumber: "",
    paymentTerms: "Net 30 Days",
    gstPercent: 12,
    items: standardBOM(),
    remarks: "",
    bankName: "Bank of Baroda",
    accountNo: "123456789012",
    ifscCode: "BARB0GARHIX",
    accountHolder: COMPANY.name,
    amountPaid: 0,
  });

  const updateBill = (field: keyof BillData, val: string | number) =>
    setBill(b => ({ ...b, [field]: val }));

  const updateItem = (id: string, field: keyof LineItem, val: string | number) =>
    setBill(b => ({
      ...b,
      items: b.items.map(it => it.id === id ? { ...it, [field]: val } : it)
    }));

  const addItem = () => setBill(b => ({ ...b, items: [...b.items, newItem()] }));
  const removeItem = (id: string) => setBill(b => ({ ...b, items: b.items.filter(it => it.id !== id) }));

  const addPreset = (preset: typeof PRESET_ITEMS[0]) => {
    setBill(b => ({
      ...b,
      items: [...b.items, { ...newItem(), ...preset }]
    }));
  };

  // Calculations
  const subTotal = bill.items.reduce((sum, it) => sum + it.qty * it.rate, 0);
  const gstAmount = subTotal * (bill.gstPercent / 100);
  const totalAmount = subTotal + gstAmount;
  const balanceDue = totalAmount - bill.amountPaid;
  const isIntra = bill.supplyType.includes("Intra");
  const cgstSgst = gstAmount / 2;

  const inputCls = "w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  const fmtINR = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
  const numToWords = (n: number): string => {
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const inWords = (num: number): string => {
      if (num === 0) return "";
      if (num < 20) return a[num] + " ";
      if (num < 100) return b[Math.floor(num / 10)] + " " + a[num % 10] + " ";
      if (num < 1000) return a[Math.floor(num / 100)] + " Hundred " + inWords(num % 100);
      if (num < 100000) return inWords(Math.floor(num / 1000)) + "Thousand " + inWords(num % 1000);
      if (num < 10000000) return inWords(Math.floor(num / 100000)) + "Lakh " + inWords(num % 100000);
      return inWords(Math.floor(num / 10000000)) + "Crore " + inWords(num % 10000000);
    };
    const rupees = Math.floor(n);
    const paise = Math.round((n - rupees) * 100);
    let result = inWords(rupees).trim() + " Rupees";
    if (paise > 0) result += " and " + inWords(paise).trim() + " Paise";
    return result + " Only";
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="no-print flex items-center gap-3 mb-5 flex-wrap">
        <button onClick={() => window.print()} className="px-5 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
        <select className="text-sm border border-orange-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
          value={bill.billType}
          onChange={e => updateBill("billType", e.target.value)}>
          {["Tax Invoice", "Proforma Invoice", "Receipt"].map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="text-sm border border-orange-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
          value={bill.supplyType}
          onChange={e => updateBill("supplyType", e.target.value)}>
          {["Intra-State (CGST+SGST)", "Inter-State (IGST)"].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* Quick-add preset items bar */}
      <div className="no-print mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Add Solar Items:</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_ITEMS.slice(0, 10).map(p => (
            <button key={p.description} onClick={() => addPreset(p)}
              className="text-xs px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-orange-700 hover:bg-orange-100 transition-colors">
              + {p.description.split("(")[0].trim()}
            </button>
          ))}
        </div>
      </div>

      <div className="print-page bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">

        {/* Invoice Header */}
        <div className="solar-header text-white px-8 py-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <PlenoxLogo size={30} variant="color" />
                </div>
                <div>
                  <h1 className="text-xl font-black">{COMPANY.name}</h1>
                  <p className="text-orange-100 text-xs">Solar Energy Solutions</p>
                </div>
              </div>
              <div className="text-xs text-orange-100 space-y-0.5 mt-1">
                <p>{COMPANY.address}</p>
                <p>GST: {COMPANY.gst} | LLPIN: {COMPANY.llpin}</p>
                <p>{COMPANY.email} | {COMPANY.vishal} / {COMPANY.prince}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black">{bill.billType.toUpperCase()}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex gap-6 justify-between">
                    <span className="text-orange-200">Invoice No.</span>
                    <span className="font-bold font-mono text-white text-xs">{bill.invoiceNo}</span>
                  </div>
                  <div className="no-print flex gap-4 justify-between items-center">
                    <span className="text-orange-200 text-xs">Invoice No.</span>
                    <input className="text-xs bg-white/20 border border-white/30 rounded px-2 py-1 w-40 text-white placeholder-orange-200 focus:outline-none"
                      value={bill.invoiceNo} onChange={e => updateBill("invoiceNo", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice meta */}
        <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className={labelCls}>Invoice Date</p>
              <input className={inputCls} type="date" value={bill.invoiceDate} onChange={e => updateBill("invoiceDate", e.target.value)} />
            </div>
            <div>
              <p className={labelCls}>Due Date</p>
              <input className={inputCls} type="date" value={bill.dueDate} onChange={e => updateBill("dueDate", e.target.value)} />
            </div>
            <div>
              <p className={labelCls}>PO / Ref. Number</p>
              <input className={inputCls} placeholder="Optional" value={bill.poNumber} onChange={e => updateBill("poNumber", e.target.value)} />
            </div>
            <div>
              <p className={labelCls}>Payment Terms</p>
              <select className={inputCls} value={bill.paymentTerms} onChange={e => updateBill("paymentTerms", e.target.value)}>
                {["Immediate", "Net 7 Days", "Net 15 Days", "Net 30 Days", "50% Advance"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Billing details */}
        <div className="px-8 py-5 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100">
          {/* Supplier */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">From (Supplier)</p>
            <p className="font-bold text-gray-800">{COMPANY.name}</p>
            <p className="text-xs text-gray-600 mt-1">{COMPANY.address}</p>
            <p className="text-xs text-gray-600 mt-1">GSTIN: {COMPANY.gst}</p>
            <p className="text-xs text-gray-600">State: {COMPANY.state} | Code: {COMPANY.stateCode}</p>
          </div>
          {/* Buyer */}
          <div className="border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To (Customer)</p>
            <div className="space-y-2">
              <input className={inputCls} placeholder="Customer / Firm Name *" value={bill.customerName} onChange={e => updateBill("customerName", e.target.value)} />
              <input className={inputCls} placeholder="Address" value={bill.customerAddress} onChange={e => updateBill("customerAddress", e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} placeholder="City" value={bill.customerCity} onChange={e => updateBill("customerCity", e.target.value)} />
                <input className={inputCls} placeholder="State" value={bill.customerState} onChange={e => updateBill("customerState", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className={inputCls} placeholder="Pincode" value={bill.customerPincode} onChange={e => updateBill("customerPincode", e.target.value)} />
                <input className={inputCls} placeholder="Phone" value={bill.customerPhone} onChange={e => updateBill("customerPhone", e.target.value)} />
              </div>
              <input className={inputCls} placeholder="GSTIN (if registered)" value={bill.customerGST} onChange={e => updateBill("customerGST", e.target.value.toUpperCase())} />
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="px-8 py-5">
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Items / Services</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-2 py-2 text-left w-6">#</th>
                  <th className="px-2 py-2 text-left min-w-[200px]">Description</th>
                  <th className="px-2 py-2 text-center w-24">HSN/SAC</th>
                  <th className="px-2 py-2 text-center w-16">Unit</th>
                  <th className="px-2 py-2 text-center w-16">Qty</th>
                  <th className="px-2 py-2 text-right w-24">Rate (₹)</th>
                  <th className="px-2 py-2 text-right w-28">Amount (₹)</th>
                  <th className="px-2 py-2 w-8 no-print"></th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-orange-50/30"}>
                    <td className="px-2 py-1.5 text-gray-400">{idx + 1}</td>
                    <td className="px-2 py-1.5">
                      <div className="print-only text-sm font-medium text-gray-800">{item.description}</div>
                      <div className="no-print">
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-orange-400"
                          placeholder="Item description" value={item.description}
                          onChange={e => updateItem(item.id, "description", e.target.value)} />
                      </div>
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="print-only text-center text-gray-600">{item.hsnCode}</div>
                      <div className="no-print">
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-orange-400"
                          placeholder="HSN" value={item.hsnCode}
                          onChange={e => updateItem(item.id, "hsnCode", e.target.value)} />
                      </div>
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="print-only text-center text-gray-600">{item.unit}</div>
                      <div className="no-print">
                        <select className="w-full border border-gray-200 rounded px-1 py-1 text-xs focus:outline-none"
                          value={item.unit} onChange={e => updateItem(item.id, "unit", e.target.value)}>
                          {["Nos", "Set", "kW", "Mtr", "kWh", "L.S.", "Year", "Job"].map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="print-only text-center">{item.qty}</div>
                      <div className="no-print">
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-orange-400"
                          type="number" min="0" step="0.01" value={item.qty}
                          onChange={e => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)} />
                      </div>
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="print-only text-right">{item.rate.toLocaleString("en-IN")}</div>
                      <div className="no-print">
                        <input className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-right focus:outline-none focus:border-orange-400"
                          type="number" min="0" step="0.01" value={item.rate}
                          onChange={e => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)} />
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-right font-semibold text-gray-800">
                      {(item.qty * item.rate).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-2 py-1.5 no-print">
                      <button onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add row button */}
          <div className="no-print mt-3 flex gap-2 flex-wrap">
            <button onClick={addItem}
              className="text-sm px-4 py-2 border border-dashed border-orange-300 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors">
              + Add Row
            </button>
            <button onClick={() => setBill(b => ({ ...b, items: standardBOM() }))}
              className="text-sm px-4 py-2 border border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
              ↺ Reset to Standard Solar BOM
            </button>
          </div>
        </div>

        {/* Tax Calculation + Summary */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax breakdown */}
            <div>
              {/* GST rate selector */}
              <div className="no-print mb-3 flex items-center gap-3">
                <label className="text-xs font-medium text-gray-600">GST Rate:</label>
                <select className="text-sm border border-orange-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none"
                  value={bill.gstPercent}
                  onChange={e => updateBill("gstPercent", parseFloat(e.target.value))}>
                  {[0, 5, 12, 18].map(r => <option key={r} value={r}>{r}% GST</option>)}
                </select>
              </div>
              {/* Tax summary table */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-700 text-white">
                      <th className="px-3 py-2 text-left">Taxable Value</th>
                      {isIntra ? (
                        <>
                          <th className="px-3 py-2 text-right">CGST ({bill.gstPercent / 2}%)</th>
                          <th className="px-3 py-2 text-right">SGST ({bill.gstPercent / 2}%)</th>
                        </>
                      ) : (
                        <th className="px-3 py-2 text-right">IGST ({bill.gstPercent}%)</th>
                      )}
                      <th className="px-3 py-2 text-right">Total Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2">{fmtINR(subTotal)}</td>
                      {isIntra ? (
                        <>
                          <td className="px-3 py-2 text-right">{fmtINR(cgstSgst)}</td>
                          <td className="px-3 py-2 text-right">{fmtINR(cgstSgst)}</td>
                        </>
                      ) : (
                        <td className="px-3 py-2 text-right">{fmtINR(gstAmount)}</td>
                      )}
                      <td className="px-3 py-2 text-right font-bold">{fmtINR(gstAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Amount in words */}
              <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Amount Chargeable (in words):</p>
                <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                  INR {numToWords(totalAmount)}
                </p>
              </div>

              {/* Remarks */}
              <div className="mt-3">
                <label className={labelCls}>Remarks / Notes</label>
                <textarea className={inputCls + " resize-none"} rows={2} placeholder="Any additional notes..."
                  value={bill.remarks} onChange={e => updateBill("remarks", e.target.value)} />
              </div>
            </div>

            {/* Amount summary */}
            <div>
              <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-700 text-white px-4 py-2 text-sm font-bold">Invoice Summary</div>
                <div className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-semibold">{fmtINR(subTotal)}</span>
                  </div>
                  {isIntra ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CGST @ {bill.gstPercent / 2}%</span>
                        <span>{fmtINR(cgstSgst)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SGST @ {bill.gstPercent / 2}%</span>
                        <span>{fmtINR(cgstSgst)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">IGST @ {bill.gstPercent}%</span>
                      <span>{fmtINR(gstAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-black text-gray-800">
                    <span>Total Amount</span>
                    <span>{fmtINR(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Received</span>
                    <input className="w-32 border border-gray-200 rounded px-2 py-1 text-sm text-right focus:outline-none focus:border-orange-400"
                      type="number" min="0" step="100"
                      value={bill.amountPaid} onChange={e => updateBill("amountPaid", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className={`flex justify-between border-t-2 pt-2 ${balanceDue > 0 ? "border-red-400 text-red-600" : "border-green-400 text-green-600"}`}>
                    <span className="font-black">Balance Due</span>
                    <span className="font-black text-base">{fmtINR(balanceDue)}</span>
                  </div>
                </div>
              </div>

              {/* Bank details */}
              <div className="mt-3 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bank Account Details</p>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Account Holder</label>
                      <input className={inputCls} value={bill.accountHolder} onChange={e => updateBill("accountHolder", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>Bank Name</label>
                      <input className={inputCls} value={bill.bankName} onChange={e => updateBill("bankName", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelCls}>Account No.</label>
                      <input className={inputCls} value={bill.accountNo} onChange={e => updateBill("accountNo", e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls}>IFSC Code</label>
                      <input className={inputCls} value={bill.ifscCode} onChange={e => updateBill("ifscCode", e.target.value.toUpperCase())} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="px-8 pb-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Terms & Conditions</p>
          <ol className="text-xs text-gray-500 space-y-0.5 leading-relaxed list-decimal list-inside">
            <li>Payment should be made by NEFT / RTGS / Cheque in favour of <strong>PLENOX ENTERPRISES LLP</strong>.</li>
            <li>Goods once sold will not be taken back. Subject to Banswara, Rajasthan jurisdiction.</li>
            <li>This is a computer-generated invoice and does not require a physical signature unless specified.</li>
            <li>GST Input Tax Credit (ITC) can be claimed by registered dealers against this invoice.</li>
            <li>Any discrepancy in this invoice should be reported within 7 days of receipt.</li>
          </ol>
        </div>

        {/* Signature */}
        <div className="px-8 pb-8 border-t border-gray-100 pt-5">
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="h-12 border-b border-gray-300 mb-2"></div>
              <p className="text-xs text-gray-500">Received by / Customer Signature</p>
            </div>
            <div className="text-center">
              <div className="h-12 mb-2 flex items-end justify-center pb-2">
                <div className="text-xs text-orange-400 border border-orange-200 rounded px-3 py-1">COMPANY SEAL</div>
              </div>
              <p className="text-xs text-gray-500">For PLENOX ENTERPRISES LLP</p>
              <p className="text-sm font-medium text-gray-700">Authorized Signatory</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="solar-header text-white text-center py-3 text-xs">
          <p>{COMPANY.name} | {COMPANY.email} | {COMPANY.vishal} | {COMPANY.prince}</p>
          <p className="text-orange-100 mt-0.5">GSTIN: {COMPANY.gst} | LLPIN: {COMPANY.llpin}</p>
        </div>
      </div>
    </div>
  );
}
