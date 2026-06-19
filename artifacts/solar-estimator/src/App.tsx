import { useState } from "react";
import { EstimateForm } from "./components/EstimateForm";
import { QuoteOutput } from "./components/QuoteOutput";
import { ApplicationForm } from "./pages/ApplicationForm";
import { BillInvoice } from "./pages/BillInvoice";
import type { EstimateData } from "./lib/types";

type Tab = "estimate" | "application" | "invoice";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("estimate");
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);

  const tabs: { key: Tab; label: string; icon: string; sublabel: string }[] = [
    { key: "estimate", label: "Solar Estimate", icon: "☀️", sublabel: "Quotation Generator" },
    { key: "application", label: "आवेदन पत्र", icon: "📋", sublabel: "Application Form (Hindi)" },
    { key: "invoice", label: "Bill / Invoice", icon: "🧾", sublabel: "GST Tax Invoice" },
  ];

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    if (tab !== "estimate") setEstimateData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Top nav */}
      <header className="no-print solar-header text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.5 8.5H20L14.5 12.5L16.5 19L12 15L7.5 19L9.5 12.5L4 8.5H10.5L12 2Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">PLENOX ENTERPRISES LLP</h1>
              <p className="text-orange-100 text-xs">Solar Energy Solutions | Banswara, Rajasthan</p>
            </div>
          </div>
          <div className="text-right text-xs text-orange-100 hidden md:block">
            <p>vproyalenterprisesllp@gmail.com</p>
            <p>GST: 08ABJFP2658K1ZP</p>
          </div>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="no-print bg-white border-b border-orange-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => switchTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-orange-500 text-orange-600 bg-orange-50"
                    : "border-transparent text-gray-500 hover:text-orange-500 hover:bg-orange-50/50"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:block">
                  <span className="block leading-tight">{tab.label}</span>
                  <span className="text-xs font-normal text-gray-400 block leading-tight">{tab.sublabel}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* === SOLAR ESTIMATE === */}
        {activeTab === "estimate" && (
          <>
            {!estimateData ? (
              <div>
                <div className="no-print text-center mb-8">
                  <h2 className="text-3xl font-black text-gray-800 mb-2">Solar Quotation Generator</h2>
                  <p className="text-gray-500 text-base max-w-xl mx-auto">
                    Fill in customer and system details to generate a professional, print-ready solar estimate
                    with PM Surya Ghar subsidy calculation.
                  </p>
                </div>
                <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: "⚡", title: "Instant Calculation", desc: "Auto-calculates system size, panel count, and total project cost" },
                    { icon: "🏛️", title: "PM Surya Ghar Subsidy", desc: "Automatically applies central govt. subsidy (up to ₹78,000)" },
                    { icon: "🖨️", title: "Print-Ready Quote", desc: "Professional PDF-quality quotation with your company branding" },
                  ].map(c => (
                    <div key={c.title} className="bg-white rounded-xl border border-orange-100 shadow-sm px-5 py-4 flex gap-4 items-start">
                      <span className="text-2xl">{c.icon}</span>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{c.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <EstimateForm onGenerate={setEstimateData} />
              </div>
            ) : (
              <QuoteOutput data={estimateData} onBack={() => setEstimateData(null)} />
            )}
          </>
        )}

        {/* === APPLICATION FORM (Hindi) === */}
        {activeTab === "application" && (
          <div>
            <div className="no-print text-center mb-6">
              <h2 className="text-2xl font-black text-gray-800 mb-1">PM सूर्य घर: मुफ्त बिजली योजना</h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                ग्राहक का आवेदन पत्र भरें। सभी आवश्यक दस्तावेजों की जांच करें, फिर प्रिंट/PDF करें।
              </p>
            </div>
            <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { icon: "🗂️", title: "Documents Checklist", desc: "10 documents checklist with Hindi guidance" },
                { icon: "💰", title: "Subsidy Calculator", desc: "Live central subsidy preview as you type capacity" },
                { icon: "🖨️", title: "Print-Ready Form", desc: "Professional bilingual application printout" },
              ].map(c => (
                <div key={c.title} className="bg-white rounded-xl border border-orange-100 shadow-sm px-5 py-4 flex gap-4 items-start">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <ApplicationForm />
          </div>
        )}

        {/* === BILL / INVOICE === */}
        {activeTab === "invoice" && (
          <div>
            <div className="no-print text-center mb-6">
              <h2 className="text-2xl font-black text-gray-800 mb-1">GST Tax Invoice Generator</h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                Raise Tax Invoices, Proforma Invoices, or Receipts with full HSN codes and GST breakdown.
              </p>
            </div>
            <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { icon: "📦", title: "Solar HSN Codes", desc: "Pre-loaded with solar equipment HSN/SAC codes" },
                { icon: "🧮", title: "CGST + SGST / IGST", desc: "Auto-split GST for intra-state & inter-state supply" },
                { icon: "📑", title: "Tax Invoice / Proforma", desc: "Switch between invoice types in one click" },
              ].map(c => (
                <div key={c.title} className="bg-white rounded-xl border border-orange-100 shadow-sm px-5 py-4 flex gap-4 items-start">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <BillInvoice />
          </div>
        )}

      </main>

      <footer className="no-print text-center py-6 text-xs text-gray-400 border-t border-orange-100 mt-8">
        <p>PLENOX ENTERPRISES LLP &nbsp;|&nbsp; LLPIN: ACX-0404 &nbsp;|&nbsp; GST: 08ABJFP2658K1ZP</p>
        <p className="mt-1">V.P New Bustand Arthuna, Banswara, Rajasthan - 327032</p>
      </footer>
    </div>
  );
}
