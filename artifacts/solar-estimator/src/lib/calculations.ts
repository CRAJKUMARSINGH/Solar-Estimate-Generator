import type { EstimateData, CalculatedQuote } from "./types";

export function calculateQuote(data: EstimateData): CalculatedQuote {
  const { system, pricing } = data;

  const totalWatts = system.panelWattage * system.panelCount;

  const panelCost = totalWatts * pricing.panelRatePerWatt;
  const inverterCost = pricing.inverterRate;
  const batteryCost = system.batteryIncluded ? pricing.batteryRate * system.batteryCapacityKWh : 0;
  const structureCost = pricing.structureRate * system.systemCapacityKW;
  const cableCost = pricing.cableRate * system.cableLength;
  const acdbCost = system.acdb ? pricing.acdbRate : 0;
  const dcdbCost = system.dcdb ? pricing.dcdbRate : 0;
  const earthingCost = system.earthing ? pricing.earthingRate : 0;
  const lightningCost = system.lightning ? pricing.lightningRate : 0;
  const netMeterCost = system.netMeter ? pricing.netMeterRate : 0;
  const installationCost = system.installation ? pricing.installationRate * system.systemCapacityKW : 0;
  const otherCost = pricing.otherCharges;

  const subTotal = panelCost + inverterCost + batteryCost + structureCost + cableCost +
    acdbCost + dcdbCost + earthingCost + lightningCost + netMeterCost + installationCost + otherCost;

  const gstAmount = subTotal * (pricing.gstPercent / 100);
  const totalBeforeSubsidy = subTotal + gstAmount;

  // PM Surya Ghar Muft Bijlee Yojana subsidy calculation (Central Government)
  // Up to 2 kW: ₹30,000 per kW
  // 2-3 kW: ₹18,000 per kW for additional capacity
  // Above 3 kW: capped at ₹78,000
  const kW = system.systemCapacityKW;
  let pmSubsidy = 0;
  if (kW <= 2) {
    pmSubsidy = kW * 30000;
  } else if (kW <= 3) {
    pmSubsidy = 2 * 30000 + (kW - 2) * 18000;
  } else {
    pmSubsidy = 78000;
  }
  // Subsidy capped at total cost
  pmSubsidy = Math.min(pmSubsidy, totalBeforeSubsidy);

  const netCost = totalBeforeSubsidy - pmSubsidy;

  // Annual generation (assuming Rajasthan: ~5.5 peak sun hours/day)
  const peakSunHours = 5.5;
  const performanceRatio = 0.80;
  const annualGeneration = system.systemCapacityKW * peakSunHours * 365 * performanceRatio;

  // Savings at avg ₹8/unit
  const tariffPerUnit = 8;
  const annualSavings = annualGeneration * tariffPerUnit;

  // Payback in years
  const paybackYears = annualSavings > 0 ? netCost / annualSavings : 0;

  // CO2 saved (0.82 kg CO2 per kWh, India grid emission factor)
  const co2SavedPerYear = (annualGeneration * 0.82) / 1000; // in tonnes

  return {
    panelCost, inverterCost, batteryCost, structureCost, cableCost,
    acdbCost, dcdbCost, earthingCost, lightningCost, netMeterCost,
    installationCost, otherCost, subTotal, gstAmount, totalBeforeSubsidy,
    pmSubsidy, netCost, annualGeneration, annualSavings, paybackYears, co2SavedPerYear
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

export function generateQuoteNumber(): string {
  const now = new Date();
  const yr = now.getFullYear().toString().slice(2);
  const mo = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `PEL/${yr}-${String(Number(yr) + 1)}/${mo}${day}/${rand}`;
}

export function todayString(): string {
  const now = new Date();
  return now.toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });
}

export function recommendPanelCount(capacityKW: number, panelWattage: number): number {
  return Math.ceil((capacityKW * 1000) / panelWattage);
}
