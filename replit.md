# Plenox Enterprises LLP — Solar Estimate Generator

A professional solar quotation generator for PLENOX ENTERPRISES LLP. Fill in customer details, system specs, and pricing to produce a print-ready estimate with PM Surya Ghar subsidy calculation.

## Run & Operate

- `pnpm --filter @workspace/solar-estimator run dev` — run the Solar Estimator frontend
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifacts/solar-estimator)
- Styling: Tailwind CSS v4
- No backend required — all calculations are client-side

## Where things live

- `artifacts/solar-estimator/src/lib/types.ts` — all data type definitions
- `artifacts/solar-estimator/src/lib/calculations.ts` — solar calculation logic (subsidy, savings, payback)
- `artifacts/solar-estimator/src/components/EstimateForm.tsx` — 3-tab input form
- `artifacts/solar-estimator/src/components/QuoteOutput.tsx` — printable quotation document

## Company Details (hardcoded in QuoteOutput.tsx)

- **Name:** PLENOX ENTERPRISES LLP
- **LLPIN:** ACX-0404
- **GST:** 08ABJFP2658K1ZP
- **Email:** vproyalenterprisesllp@gmail.com
- **Address:** V.P. New Bus Stand Arthuna, Tehsil- Arthuna, Banswara, Rajasthan – 327032
- **Vishal Panchal:** +91 96601 81211
- **Prince Panchal:** +91 97727 13293

## Features

- Customer info + system specs + pricing tabs
- Auto-calculates panel count from kW + Wattage
- PM Surya Ghar Muft Bijlee Yojana central subsidy (₹30k/kW up to 2kW, ₹18k for 3rd kW, capped at ₹78k)
- Bill of Materials table with all components
- Annual generation, savings, payback period, CO2 saved
- Print/PDF via browser print dialog

## User preferences

- Company: PLENOX ENTERPRISES LLP (ACX-0404, GST 08ABJFP2658K1ZP)
- Partners: Vishal Panchal +91 96601 81211, Prince Panchal +91 97727 13293
- Email: vproyalenterprisesllp@gmail.com
- Solar focus: Rajasthan (5.5 peak sun hours used in calculations)
