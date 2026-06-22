import { PlenoxLogo } from "./PlenoxLogo";

export const COMPANY = {
  name: "PLENOX ENTERPRISES LLP",
  nameHi: "प्लेनोक्स एंटरप्राइजेज़ एलएलपी",
  tagline: "Empowering India with Clean Solar Energy",
  taglineHi: "स्वच्छ सौर ऊर्जा से भारत को सशक्त बनाना",
  llpin: "ACX-0404",
  gst: "08ABJFP2658K1ZP",
  email: "vproyalenterprisesllp@gmail.com",
  address1: "V.P. New Bus Stand Arthuna, Tehsil- Arthuna",
  address2: "Banswara, Rajasthan – 327032",
  address1Hi: "वी.पी. न्यू बस स्टैंड अर्थुना, तहसील अर्थुना",
  address2Hi: "बाँसवाड़ा, राजस्थान – 327032",
  vishal: "+91 96601 81211",
  prince: "+91 97727 13293",
  signatory: "Vishal Panchal",
  signatoryDesig: "Designated Partner / नामित भागीदार",
};

export const GRADIENT = "linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f59e0b 100%)";

interface HeaderProps {
  quoteNumber?: string;
  date?: string;
  title?: string;
  titleHi?: string;
}

export function LetterheadHeader({ quoteNumber, date, title, titleHi }: HeaderProps) {
  return (
    <div
      style={{ background: GRADIENT, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      className="text-white px-8 py-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white/40"
              style={{ background: "rgba(255,255,255,0.18)" }}>
              <PlenoxLogo size={40} variant="white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-tight">{COMPANY.name}</h1>
              <p className="text-orange-100 text-xs font-semibold">{COMPANY.nameHi}</p>
              <p className="text-orange-200 text-xs">{COMPANY.tagline} | {COMPANY.taglineHi}</p>
            </div>
          </div>
          <div className="rounded-lg px-4 py-2 text-xs text-white space-y-0.5 mt-1"
            style={{ background: "rgba(255,255,255,0.15)" }}>
            <p className="font-semibold">{COMPANY.address1} | {COMPANY.address1Hi}</p>
            <p className="font-semibold">{COMPANY.address2} | {COMPANY.address2Hi}</p>
            <p className="text-orange-100">GST: {COMPANY.gst} &nbsp;|&nbsp; LLPIN: {COMPANY.llpin} &nbsp;|&nbsp; {COMPANY.email}</p>
            <p className="text-orange-100">Vishal Panchal: {COMPANY.vishal} &nbsp;|&nbsp; Prince Panchal: {COMPANY.prince}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="rounded-xl px-5 py-3 text-center" style={{ background: "rgba(255,255,255,0.2)" }}>
            <p className="text-xs text-orange-100 font-semibold uppercase tracking-wider">{title ?? "Quotation / प्रस्तावना"}</p>
            {titleHi && <p className="text-xs text-orange-200 mt-0.5">{titleHi}</p>}
            {quoteNumber && <p className="text-lg font-black font-mono mt-1">{quoteNumber}</p>}
            {date && <p className="text-xs text-orange-100 mt-1">Date / दिनांक: {date}</p>}
          </div>
          {quoteNumber && (
            <div className="mt-2 inline-block text-white text-xs font-bold px-3 py-1 rounded-full border border-green-300/50"
              style={{ background: "rgba(74,222,128,0.3)" }}>
              Valid 30 Days / 30 दिन मान्य
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LetterheadFooter() {
  return (
    <div
      style={{ background: GRADIENT, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      className="text-white text-center py-3 text-xs"
    >
      <p className="font-semibold">{COMPANY.name} | {COMPANY.nameHi}</p>
      <p className="text-orange-100 mt-0.5">
        {COMPANY.address1}, {COMPANY.address2} &nbsp;|&nbsp; GST: {COMPANY.gst} &nbsp;|&nbsp; LLPIN: {COMPANY.llpin}
      </p>
      <p className="text-orange-200 mt-0.5">
        {COMPANY.email} &nbsp;|&nbsp; Vishal: {COMPANY.vishal} &nbsp;|&nbsp; Prince: {COMPANY.prince}
      </p>
    </div>
  );
}
