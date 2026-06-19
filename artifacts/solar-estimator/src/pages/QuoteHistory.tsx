import { useState, useCallback } from "react";
import { loadHistory, deleteQuote, clearHistory, formatSavedAt } from "../lib/history";
import type { QuoteHistoryEntry } from "../lib/history";
import type { EstimateData } from "../lib/types";
import { formatCurrency } from "../lib/calculations";

interface Props {
  onLoadQuote: (data: EstimateData) => void;
}

const SYS_BADGE: Record<string, { bg: string; text: string }> = {
  "String Inverter": { bg: "bg-blue-100", text: "text-blue-700" },
  "Hybrid Inverter": { bg: "bg-purple-100", text: "text-purple-700" },
  "Micro Inverter":  { bg: "bg-green-100", text: "text-green-700" },
};

function systemTypeLabel(entry: QuoteHistoryEntry): string {
  const { batteryIncluded, netMeter, inverterType } = entry.data.system;
  if (inverterType === "Hybrid Inverter" && batteryIncluded && netMeter) return "Hybrid";
  if (batteryIncluded && !netMeter) return "Off-Grid";
  return "On-Grid";
}

export function QuoteHistory({ onLoadQuote }: Props) {
  const [entries, setEntries] = useState<QuoteHistoryEntry[]>(() => loadHistory());
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = useCallback(() => setEntries(loadHistory()), []);

  const handleDelete = (id: string) => {
    deleteQuote(id);
    setConfirmDelete(null);
    refresh();
  };

  const handleClearAll = () => {
    clearHistory();
    setConfirmClear(false);
    refresh();
  };

  const filtered = entries.filter(e => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.data.customer.name.toLowerCase().includes(q) ||
      e.data.customer.phone.includes(q) ||
      e.data.customer.city.toLowerCase().includes(q) ||
      e.data.customer.quoteNumber.toLowerCase().includes(q) ||
      e.data.system.inverterBrand.toLowerCase().includes(q)
    );
  });

  const fmtINR = (n: number) => formatCurrency(n);

  return (
    <div>
      {/* Toolbar */}
      <div className="no-print bg-white rounded-2xl shadow-lg border border-orange-100 p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="w-full pl-9 pr-4 py-2 border border-orange-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Search by name, phone, city, quote no., brand…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <span className="text-sm text-gray-500">{filtered.length} of {entries.length} quotes</span>
          {entries.length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600 font-medium">Delete all {entries.length} quotes?</span>
                <button onClick={handleClearAll} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-bold hover:bg-red-700">Yes, delete all</button>
                <button onClick={() => setConfirmClear(false)} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)}
                className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                🗑 Clear All
              </button>
            )
          )}
        </div>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-orange-100 shadow-sm">
          <div className="text-5xl mb-4">📂</div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No saved quotes yet</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Every quote you generate on the Solar Estimate tab is automatically saved here.
            Go generate your first quote!
          </p>
        </div>
      )}

      {/* No results */}
      {entries.length > 0 && filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-orange-100 shadow-sm">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-sm">No quotes match "<span className="font-semibold">{search}</span>"</p>
          <button onClick={() => setSearch("")} className="mt-3 text-xs text-orange-600 underline">Clear search</button>
        </div>
      )}

      {/* Quote cards */}
      <div className="space-y-3">
        {filtered.map(entry => {
          const { customer, system } = entry.data;
          const { calc } = entry;
          const sysType = systemTypeLabel(entry);
          const sysTypeBadge = sysType === "On-Grid" ? "bg-blue-100 text-blue-700" : sysType === "Off-Grid" ? "bg-yellow-100 text-yellow-700" : "bg-purple-100 text-purple-700";
          const inverterStyle = SYS_BADGE[system.inverterType] ?? { bg: "bg-gray-100", text: "text-gray-700" };
          const isExpanded = expandedId === entry.id;

          return (
            <div key={entry.id} className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden transition-all">
              {/* Main row */}
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-orange-50/30 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}>
                {/* Left: customer info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800 text-sm truncate">{customer.name || "Unnamed Customer"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${sysTypeBadge}`}>{sysType}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${inverterStyle.bg} ${inverterStyle.text}`}>
                      {system.systemCapacityKW} kW
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                    {customer.phone && <span>📞 {customer.phone}</span>}
                    {customer.city && <span>📍 {customer.city}</span>}
                    <span className="font-mono text-orange-500">{customer.quoteNumber}</span>
                  </div>
                </div>

                {/* Middle: system */}
                <div className="hidden md:block text-xs text-gray-500 text-center min-w-[130px]">
                  <div className="font-semibold text-gray-700">{system.panelCount} × {system.panelWattage}Wp</div>
                  <div>{system.inverterBrand}</div>
                </div>

                {/* Right: pricing */}
                <div className="text-right min-w-[110px]">
                  <div className="text-sm font-black text-gray-900">{fmtINR(calc.netCost)}</div>
                  <div className="text-[10px] text-green-600">– {fmtINR(calc.pmSubsidy)} subsidy</div>
                </div>

                {/* Date + actions */}
                <div className="text-right min-w-[90px] hidden sm:block">
                  <div className="text-[10px] text-gray-400">{formatSavedAt(entry.savedAt)}</div>
                </div>

                <div className="text-gray-400 text-sm">{isExpanded ? "▲" : "▼"}</div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-orange-100 px-5 py-4 bg-orange-50/30">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-4">
                    <div>
                      <p className="text-gray-400 mb-0.5">Customer</p>
                      <p className="font-semibold text-gray-800">{customer.name}</p>
                      <p className="text-gray-500">{customer.phone}</p>
                      <p className="text-gray-500">{[customer.address, customer.city, customer.state].filter(Boolean).join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">System</p>
                      <p className="font-semibold text-gray-800">{system.systemCapacityKW} kW {sysType}</p>
                      <p className="text-gray-500">{system.panelCount} × {system.panelWattage}Wp {system.panelType}</p>
                      <p className="text-gray-500">{system.inverterCapacityKW} kW {system.inverterType} – {system.inverterBrand}</p>
                      {system.batteryIncluded && <p className="text-gray-500">🔋 {system.batteryCapacityKWh} kWh battery</p>}
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Financials</p>
                      <p className="font-semibold text-gray-800">Total: {fmtINR(calc.totalBeforeSubsidy)}</p>
                      <p className="text-gray-500">Subsidy: – {fmtINR(calc.pmSubsidy)}</p>
                      <p className="font-bold text-orange-700">Net: {fmtINR(calc.netCost)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-0.5">Savings</p>
                      <p className="font-semibold text-gray-800">{fmtINR(calc.annualSavings)}/yr</p>
                      <p className="text-gray-500">Payback: {calc.paybackYears.toFixed(1)} yrs</p>
                      <p className="text-gray-500">{calc.co2SavedPerYear.toFixed(2)} t CO₂/yr</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => onLoadQuote(entry.data)}
                      className="px-4 py-2 bg-orange-500 text-white text-xs rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center gap-1.5">
                      ↗ Load & View Quote
                    </button>
                    {confirmDelete === entry.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600 font-medium">Delete this quote?</span>
                        <button onClick={() => handleDelete(entry.id)} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-bold hover:bg-red-700">Yes</button>
                        <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-50">No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(entry.id)}
                        className="px-3 py-2 border border-red-200 text-red-500 text-xs rounded-xl hover:bg-red-50 transition-colors">
                        🗑 Delete
                      </button>
                    )}
                    <span className="text-[10px] text-gray-400 self-center ml-auto">Saved: {formatSavedAt(entry.savedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
