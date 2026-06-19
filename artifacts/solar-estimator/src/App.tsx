import { useState } from "react";
import { EstimateForm } from "./components/EstimateForm";
import { QuoteOutput } from "./components/QuoteOutput";
import type { EstimateData } from "./lib/types";

export default function App() {
  const [estimateData, setEstimateData] = useState<EstimateData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Top nav */}
      <header className="no-print solar-header text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.5 8.5H20L14.5 12.5L16.5 19L12 15L7.5 19L9.5 12.5L4 8.5H10.5L12 2Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-none">PLENOX ENTERPRISES LLP</h1>
              <p className="text-orange-100 text-xs">Solar Estimate Generator</p>
            </div>
          </div>
          <div className="text-right text-xs text-orange-100">
            <p>vproyalenterprisesllp@gmail.com</p>
            <p>GST: 08ABJFP2658K1ZP</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!estimateData ? (
          <div>
            {/* Hero text */}
            <div className="no-print text-center mb-8">
              <h2 className="text-3xl font-black text-gray-800 mb-2">
                Solar Quotation Generator
              </h2>
              <p className="text-gray-500 text-base max-w-xl mx-auto">
                Fill in customer and system details to generate a professional, print-ready solar estimate with PM Surya Ghar subsidy calculation.
              </p>
            </div>

            {/* Info cards */}
            <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: "⚡",
                  title: "Instant Calculation",
                  desc: "Auto-calculates system size, panel count, and total project cost",
                },
                {
                  icon: "🏛️",
                  title: "PM Surya Ghar Subsidy",
                  desc: "Automatically applies central govt. subsidy (up to ₹78,000)",
                },
                {
                  icon: "🖨️",
                  title: "Print-Ready Quote",
                  desc: "Professional PDF-quality quotation with your company branding",
                },
              ].map(card => (
                <div key={card.title} className="bg-white rounded-xl border border-orange-100 shadow-sm px-5 py-4 flex gap-4 items-start">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{card.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <EstimateForm onGenerate={setEstimateData} />
          </div>
        ) : (
          <QuoteOutput data={estimateData} onBack={() => setEstimateData(null)} />
        )}
      </main>

      <footer className="no-print text-center py-6 text-xs text-gray-400 border-t border-orange-100 mt-8">
        <p>PLENOX ENTERPRISES LLP &nbsp;|&nbsp; LLPIN: ACX-0404 &nbsp;|&nbsp; GST: 08ABJFP2658K1ZP</p>
        <p className="mt-1">V.P New Bustand Arthuna, Banswara, Rajasthan - 327032</p>
      </footer>
    </div>
  );
}
