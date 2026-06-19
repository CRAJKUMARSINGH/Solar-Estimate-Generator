export interface CustomerInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  date: string;
  quoteNumber: string;
}

export interface SystemSpec {
  systemCapacityKW: number;
  panelType: "Mono PERC" | "Poly" | "Bifacial TOPCon" | "HJT";
  panelWattage: number;
  panelCount: number;
  inverterType: "String Inverter" | "Micro Inverter" | "Hybrid Inverter";
  inverterCapacityKW: number;
  inverterBrand: string;
  batteryIncluded: boolean;
  batteryCapacityKWh: number;
  batteryBrand: string;
  roofType: "RCC Roof" | "Tin Shed" | "Ground Mount";
  structureType: "GI Structure" | "MS Structure" | "Elevated MS Structure";
  cableLength: number;
  acdb: boolean;
  dcdb: boolean;
  earthing: boolean;
  lightning: boolean;
  netMeter: boolean;
  installation: boolean;
}

export interface PricingInfo {
  panelRatePerWatt: number;
  inverterRate: number;
  batteryRate: number;
  structureRate: number;
  cableRate: number;
  acdbRate: number;
  dcdbRate: number;
  earthingRate: number;
  lightningRate: number;
  netMeterRate: number;
  installationRate: number;
  otherCharges: number;
  gstPercent: number;
}

export interface EstimateData {
  customer: CustomerInfo;
  system: SystemSpec;
  pricing: PricingInfo;
}

export interface CalculatedQuote {
  panelCost: number;
  inverterCost: number;
  batteryCost: number;
  structureCost: number;
  cableCost: number;
  acdbCost: number;
  dcdbCost: number;
  earthingCost: number;
  lightningCost: number;
  netMeterCost: number;
  installationCost: number;
  otherCost: number;
  subTotal: number;
  gstAmount: number;
  totalBeforeSubsidy: number;
  pmSubsidy: number;
  netCost: number;
  annualGeneration: number;
  annualSavings: number;
  paybackYears: number;
  co2SavedPerYear: number;
}

export const PANEL_BRANDS: Record<string, string> = {
  "Mono PERC": "Adani / Waaree / Vikram",
  "Poly": "Luminous / Su-Kam",
  "Bifacial TOPCon": "Waaree / Adani TOPCon",
  "HJT": "REC / Panasonic HJT",
};

export const INVERTER_BRANDS = [
  "Growatt", "Solis", "Sofar", "SMA", "Fronius", "Delta", "Havells", "Goodwe", "Deye"
];

export const BATTERY_BRANDS = [
  "Luminous", "Exide", "Okaya", "Su-Kam", "Amaron"
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh"
];
