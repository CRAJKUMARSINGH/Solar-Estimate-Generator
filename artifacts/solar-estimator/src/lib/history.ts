import type { EstimateData, CalculatedQuote } from "./types";
import { calculateQuote } from "./calculations";

export interface QuoteHistoryEntry {
  id: string;
  savedAt: string;
  data: EstimateData;
  calc: CalculatedQuote;
}

const STORAGE_KEY = "plenox_quote_history";
const MAX_ENTRIES = 200;

export function loadHistory(): QuoteHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuoteHistoryEntry[];
  } catch {
    return [];
  }
}

export function saveQuote(data: EstimateData): QuoteHistoryEntry {
  const entry: QuoteHistoryEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    savedAt: new Date().toISOString(),
    data,
    calc: calculateQuote(data),
  };
  const existing = loadHistory().filter(e => e.id !== entry.id);
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return entry;
}

export function deleteQuote(id: string): void {
  const updated = loadHistory().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatSavedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
