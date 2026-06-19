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

// ─── Dashboard helpers ──────────────────────────────────────────────────────

function buildStats(entries: QuoteHistoryEntry[]) {
  const now = new Date();
  const thisMonth = entries.filter(e => {
    const d = new Date(e.savedAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const thisYear = entries.filter(e => new Date(e.savedAt).getFullYear() === now.getFullYear());

  const sum = (arr: QuoteHistoryEntry[], fn: (e: QuoteHistoryEntry) => number) =>
    arr.reduce((s, e) => s + fn(e), 0);

  const avg = (arr: QuoteHistoryEntry[], fn: (e: QuoteHistoryEntry) => number) =>
    arr.length ? sum(arr, fn) / arr.length : 0;

  // Brand frequency
  const brandCount: Record<string, number> = {};
  entries.forEach(e => {
    const b = e.data.system.inverterBrand;
    brandCount[b] = (brandCount[b] ?? 0) + 1;
  });
  const topBrand = Object.entries(brandCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // System type breakdown (all time)
  const typeCount = { "On-Grid": 0, "Off-Grid": 0, "Hybrid": 0 };
  entries.forEach(e => typeCount[systemTypeLabel(e) as keyof typeof typeCount]++);

  // Last 6 months bar data (quote count + value)
  const months: { label: string; key: string; count: number; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    const bucket = entries.filter(e => e.savedAt.startsWith(key));
    months.push({ label, key, count: bucket.length, value: sum(bucket, e => e.calc.netCost) });
  }

  return {
    month: {
      count: thisMonth.length,
      totalNet: sum(thisMonth, e => e.calc.netCost),
      totalGross: sum(thisMonth, e => e.calc.totalBeforeSubsidy),
      avgKW: avg(thisMonth, e => e.data.system.systemCapacityKW),
      subsidy: sum(thisMonth, e => e.calc.pmSubsidy),
    },
    year: {
      count: thisYear.length,
      totalNet: sum(thisYear, e => e.calc.netCost),
      avgKW: avg(thisYear, e => e.data.system.systemCapacityKW),
    },
    allTime: {
      count: entries.length,
      totalNet: sum(entries, e => e.calc.netCost),
      totalGross: sum(entries, e => e.calc.totalBeforeSubsidy),
      avgKW: avg(entries, e => e.data.system.systemCapacityKW),
      subsidy: sum(entries, e => e.calc.pmSubsidy),
    },
    topBrand,
    typeCount,
    months,
  };
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ────────────────────────────────────────────────────────────────────────────

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
  const stats = buildStats(entries);
  const maxMonthCount = Math.max(...stats.months.map(m => m.count), 1);
  const maxMonthValue = Math.max(...stats.months.map(m => m.value), 1);
  const now = new Date();
  const currentMonthLabel = MONTH_NAMES[now.getMonth()] + " " + now.getFullYear();

  return (
    <div>

      {/* ── Sales Dashboard ───────────────────────────────────────────── */}
      <div className="no-print grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* This Month card */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3">📅 {currentMonthLabel}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.month.count}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Quotes generated</p>
            </div>
            <div>
              <p className="text-2xl font-black text-green-700">{stats.month.count > 0 ? fmtINR(stats.month.totalNet) : "—"}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Total net value</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{stats.month.avgKW > 0 ? stats.month.avgKW.toFixed(1) + " kW" : "—"}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Avg system size</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-700">{stats.month.subsidy > 0 ? fmtINR(stats.month.subsidy) : "—"}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">PM Subsidy applied</p>
            </div>
          </div>
        </div>

        {/* All-time + top brand card */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3">🏆 All Time</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-2xl font-black text-gray-900">{stats.allTime.count}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Total quotes</p>
            </div>
            <div>
              <p className="text-2xl font-black text-green-700">{stats.allTime.count > 0 ? fmtINR(stats.allTime.totalNet) : "—"}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Total net value</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-800">{stats.allTime.avgKW > 0 ? stats.allTime.avgKW.toFixed(1) + " kW" : "—"}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Avg system size</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-700">{stats.topBrand}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Most quoted brand</p>
            </div>
          </div>
          {/* System type split */}
          {stats.allTime.count > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 mb-1.5 font-semibold uppercase">System type split</p>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-1.5">
                {stats.typeCount["On-Grid"] > 0 && (
                  <div className="bg-blue-400 transition-all" style={{ width: `${(stats.typeCount["On-Grid"] / stats.allTime.count) * 100}%` }} />
                )}
                {stats.typeCount["Off-Grid"] > 0 && (
                  <div className="bg-yellow-400 transition-all" style={{ width: `${(stats.typeCount["Off-Grid"] / stats.allTime.count) * 100}%` }} />
                )}
                {stats.typeCount["Hybrid"] > 0 && (
                  <div className="bg-purple-400 transition-all" style={{ width: `${(stats.typeCount["Hybrid"] / stats.allTime.count) * 100}%` }} />
                )}
              </div>
              <div className="flex gap-3 text-[10px] text-gray-500">
                <span><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />On-Grid {stats.typeCount["On-Grid"]}</span>
                <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1" />Off-Grid {stats.typeCount["Off-Grid"]}</span>
                <span><span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1" />Hybrid {stats.typeCount["Hybrid"]}</span>
              </div>
            </div>
          )}
        </div>

        {/* 6-month bar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3">📊 Last 6 Months</p>
          {stats.allTime.count === 0 ? (
            <div className="flex items-center justify-center h-24 text-gray-300 text-sm">No data yet</div>
          ) : (
            <div className="space-y-2">
              {stats.months.map(m => {
                const isCurrentMonth = m.key === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
                const barW = maxMonthCount > 0 ? Math.max((m.count / maxMonthCount) * 100, m.count > 0 ? 5 : 0) : 0;
                return (
                  <div key={m.key} className="flex items-center gap-2">
                    <span className={`text-[10px] w-12 text-right font-medium flex-shrink-0 ${isCurrentMonth ? "text-orange-600" : "text-gray-400"}`}>
                      {m.label}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isCurrentMonth ? "bg-orange-500" : "bg-orange-300"}`}
                        style={{ width: `${barW}%` }}
                      />
                    </div>
                    <span className={`text-[10px] w-5 text-center font-bold flex-shrink-0 ${isCurrentMonth ? "text-orange-600" : "text-gray-500"}`}>
                      {m.count}
                    </span>
                    {m.value > 0 && (
                      <span className="text-[9px] text-gray-400 w-16 text-right flex-shrink-0">
                        {fmtINR(m.value)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {stats.year.count > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
              <span>FY {now.getFullYear()} total:</span>
              <span className="font-bold text-gray-600">{stats.year.count} quotes · {fmtINR(stats.year.totalNet)}</span>
            </div>
          )}
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────────── */}

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
