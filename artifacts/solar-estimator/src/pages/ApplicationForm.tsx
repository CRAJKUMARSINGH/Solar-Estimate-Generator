import { useState, useRef } from "react";

const COMPANY = {
  name: "PLENOX ENTERPRISES LLP",
  gst: "08ABJFP2658K1ZP",
  llpin: "ACX-0404",
  address: "V.P New Bustand Arthuna, Tehsils Arthuna, Banswara, Rajasthan - 327032",
  email: "vproyalenterprisesllp@gmail.com",
  vishal: "+91 96601 81211",
  prince: "+91 97727 13293",
};

interface AppForm {
  applicantName: string;
  fatherName: string;
  dob: string;
  gender: "पुरुष" | "महिला" | "अन्य";
  address: string;
  village: string;
  tehsil: string;
  district: string;
  pincode: string;
  phone: string;
  altPhone: string;
  email: string;
  aadhaar: string;
  panCard: string;
  discomName: string;
  consumerNo: string;
  meterNo: string;
  sanctionedLoad: string;
  monthlyConsumption: string;
  categoryType: "आवासीय" | "व्यावसायिक" | "औद्योगिक";
  connectionType: "सिंगल फेज" | "थ्री फेज";
  systemCapacity: string;
  roofType: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  accountHolder: string;
  date: string;
  applicationNo: string;
}

const docs = [
  { id: "aadhaar", label: "आधार कार्ड (Aadhaar Card)", note: "आगे और पीछे दोनों पृष्ठ" },
  { id: "pan", label: "पैन कार्ड (PAN Card)", note: "स्व-प्रमाणित प्रति" },
  { id: "photo", label: "पासपोर्ट साइज फोटो (Passport Photo)", note: "2 रंगीन फोटो" },
  { id: "electricity", label: "बिजली बिल (Electricity Bill)", note: "पिछले 3 महीनों का बिल" },
  { id: "bank", label: "बैंक पासबुक / रद्द चेक (Bank Passbook / Cancelled Cheque)", note: "खाता संख्या और IFSC कोड सहित" },
  { id: "ownership", label: "भूमि / मकान स्वामित्व प्रमाण (Property Ownership Proof)", note: "रजिस्ट्री / पट्टा / खसरा-खतौनी" },
  { id: "caste", label: "जाति प्रमाण पत्र (Caste Certificate)", note: "यदि SC/ST/OBC हो तो अनिवार्य" },
  { id: "income", label: "आय प्रमाण पत्र (Income Certificate)", note: "BPL हेतु तहसीलदार द्वारा जारी" },
  { id: "consent", label: "सहमति पत्र (Self-Declaration / Consent Form)", note: "हस्ताक्षरित स्व-घोषणा" },
  { id: "noc", label: "NOC / अनापत्ति प्रमाण पत्र", note: "यदि किराए की संपत्ति हो" },
];

const discomList = [
  "JVVNL (Jaipur Vidyut Vitaran Nigam Ltd.)",
  "AVVNL (Ajmer Vidyut Vitaran Nigam Ltd.)",
  "JdVVNL (Jodhpur Vidyut Vitaran Nigam Ltd.)",
  "Other DISCOM",
];

function generateAppNo() {
  const d = new Date();
  const yr = d.getFullYear().toString().slice(2);
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `PEL/PMSG/${yr}${mo}/${rand}`;
}

function todayHindi() {
  return new Date().toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export function ApplicationForm() {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<AppForm>({
    applicantName: "", fatherName: "", dob: "", gender: "पुरुष",
    address: "", village: "", tehsil: "", district: "Banswara", pincode: "",
    phone: "", altPhone: "", email: "",
    aadhaar: "", panCard: "",
    discomName: "AVVNL (Ajmer Vidyut Vitaran Nigam Ltd.)",
    consumerNo: "", meterNo: "",
    sanctionedLoad: "", monthlyConsumption: "",
    categoryType: "आवासीय", connectionType: "सिंगल फेज",
    systemCapacity: "",
    roofType: "RCC छत",
    bankName: "", accountNo: "", ifscCode: "", accountHolder: "",
    date: todayHindi(),
    applicationNo: generateAppNo(),
  });
  const [showPrint, setShowPrint] = useState(false);

  const update = (field: keyof AppForm, val: string) =>
    setForm(f => ({ ...f, [field]: val }));

  const toggleDoc = (id: string) =>
    setCheckedDocs(d => ({ ...d, [id]: !d[id] }));

  const allDocsChecked = docs.every(d => checkedDocs[d.id]);

  const inputCls = "w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const secTitle = "text-sm font-bold text-white bg-orange-500 px-4 py-2 rounded-t-lg -mx-1 mb-3";

  return (
    <div>
      {/* Toolbar */}
      <div className="no-print flex items-center gap-3 mb-5">
        <button onClick={() => window.print()} className="px-5 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
        <span className="text-sm text-gray-500">आवेदन पत्र भरने के बाद प्रिंट करें</span>
      </div>

      <div className="print-page bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 max-w-4xl mx-auto">

        {/* Header */}
        <div className="solar-header text-white px-8 py-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-orange-100 font-semibold uppercase tracking-wider mb-1">Application Form</p>
              <h2 className="text-xl font-black">PM सूर्य घर: मुफ्त बिजली योजना</h2>
              <p className="text-sm text-orange-100 mt-1">PM Surya Ghar: Muft Bijlee Yojana – आवेदन पत्र</p>
              <p className="text-xs text-orange-200 mt-2">(भारत सरकार – नवीन और नवीकरणीय ऊर्जा मंत्रालय)</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-xl px-4 py-3 text-sm">
                <p className="text-xs text-orange-100">Application No.</p>
                <p className="font-bold font-mono">{form.applicationNo}</p>
                <p className="text-xs text-orange-100 mt-1">Date: {form.date}</p>
              </div>
              <p className="text-xs text-orange-100 mt-2">{COMPANY.name}</p>
              <p className="text-xs text-orange-100">GST: {COMPANY.gst}</p>
            </div>
          </div>
        </div>

        {/* Govt scheme info */}
        <div className="bg-amber-50 border-b border-amber-100 px-8 py-3">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>योजना के बारे में:</strong> PM सूर्य घर: मुफ्त बिजली योजना के तहत आवासीय उपभोक्ताओं को
            1 kW तक ₹30,000 और 2 kW तक ₹60,000 तथा 3 kW तक ₹78,000 की केंद्रीय सब्सिडी
            प्राप्त होती है। यह राशि सीधे लाभार्थी के बैंक खाते में DBT के माध्यम से जमा की जाती है।
            आवेदन करने के लिए <strong>pmsuryagharyojana.gov.in</strong> पर पंजीकरण करना अनिवार्य है।
          </p>
        </div>

        <div className="px-8 py-6 space-y-6">

          {/* Section 1: Personal Details */}
          <div>
            <p className={secTitle}>1. व्यक्तिगत विवरण (Personal Details)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>आवेदक का पूरा नाम / Applicant's Full Name *</label>
                <input className={inputCls} placeholder="जैसे: रामेश्वर लाल मीणा" value={form.applicantName}
                  onChange={e => update("applicantName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>पिता / पति का नाम / Father's / Husband's Name *</label>
                <input className={inputCls} placeholder="" value={form.fatherName}
                  onChange={e => update("fatherName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>जन्म तिथि / Date of Birth</label>
                <input className={inputCls} type="date" value={form.dob}
                  onChange={e => update("dob", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>लिंग / Gender</label>
                <select className={inputCls} value={form.gender}
                  onChange={e => update("gender", e.target.value as AppForm["gender"])}>
                  {["पुरुष", "महिला", "अन्य"].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>मोबाइल नंबर / Mobile *</label>
                <input className={inputCls} placeholder="+91 XXXXX XXXXX" value={form.phone}
                  onChange={e => update("phone", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>वैकल्पिक नंबर / Alternate Mobile</label>
                <input className={inputCls} placeholder="" value={form.altPhone}
                  onChange={e => update("altPhone", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>ईमेल / Email</label>
                <input className={inputCls} type="email" placeholder="" value={form.email}
                  onChange={e => update("email", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section 2: Address */}
          <div>
            <p className={secTitle}>2. पता / Address Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>मकान नंबर / गली / मोहल्ला</label>
                <input className={inputCls} placeholder="मकान नं., गली, मोहल्ला / Ward" value={form.address}
                  onChange={e => update("address", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>ग्राम / नगर / Village / Town *</label>
                <input className={inputCls} value={form.village}
                  onChange={e => update("village", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>तहसील / Tehsil</label>
                <input className={inputCls} value={form.tehsil}
                  onChange={e => update("tehsil", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>जिला / District</label>
                <input className={inputCls} value={form.district}
                  onChange={e => update("district", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>पिन कोड / Pincode</label>
                <input className={inputCls} placeholder="327032" value={form.pincode}
                  onChange={e => update("pincode", e.target.value)} />
              </div>
            </div>
          </div>

          {/* Section 3: ID Proof */}
          <div>
            <p className={secTitle}>3. पहचान प्रमाण / Identity Proof</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>आधार संख्या / Aadhaar Number *</label>
                <input className={inputCls} placeholder="XXXX XXXX XXXX" maxLength={14} value={form.aadhaar}
                  onChange={e => update("aadhaar", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>पैन नंबर / PAN Number</label>
                <input className={inputCls} placeholder="ABCDE1234F" maxLength={10} value={form.panCard}
                  onChange={e => update("panCard", e.target.value.toUpperCase())} />
              </div>
            </div>
          </div>

          {/* Section 4: Electricity Connection */}
          <div>
            <p className={secTitle}>4. विद्युत कनेक्शन विवरण / Electricity Connection Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>DISCOM / बिजली वितरण कंपनी *</label>
                <select className={inputCls} value={form.discomName}
                  onChange={e => update("discomName", e.target.value)}>
                  {discomList.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>उपभोक्ता संख्या / Consumer No. *</label>
                <input className={inputCls} placeholder="बिजली बिल पर अंकित नंबर" value={form.consumerNo}
                  onChange={e => update("consumerNo", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>मीटर संख्या / Meter No.</label>
                <input className={inputCls} placeholder="" value={form.meterNo}
                  onChange={e => update("meterNo", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>स्वीकृत भार / Sanctioned Load (kW)</label>
                <input className={inputCls} type="number" placeholder="जैसे: 5" value={form.sanctionedLoad}
                  onChange={e => update("sanctionedLoad", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>औसत मासिक खपत / Avg Monthly Consumption (Units)</label>
                <input className={inputCls} type="number" placeholder="जैसे: 300" value={form.monthlyConsumption}
                  onChange={e => update("monthlyConsumption", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>उपभोक्ता श्रेणी / Category</label>
                <select className={inputCls} value={form.categoryType}
                  onChange={e => update("categoryType", e.target.value as AppForm["categoryType"])}>
                  {["आवासीय", "व्यावसायिक", "औद्योगिक"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>कनेक्शन प्रकार / Connection Type</label>
                <select className={inputCls} value={form.connectionType}
                  onChange={e => update("connectionType", e.target.value as AppForm["connectionType"])}>
                  {["सिंगल फेज", "थ्री फेज"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Proposed System */}
          <div>
            <p className={secTitle}>5. प्रस्तावित सौर संयंत्र विवरण / Proposed Solar System</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>प्रस्तावित क्षमता / Proposed Capacity (kW) *</label>
                <input className={inputCls} type="number" placeholder="जैसे: 3" value={form.systemCapacity}
                  onChange={e => update("systemCapacity", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>छत का प्रकार / Roof Type</label>
                <select className={inputCls} value={form.roofType}
                  onChange={e => update("roofType", e.target.value)}>
                  {["RCC छत", "टिन शेड", "जमीन पर (Ground Mount)", "अन्य"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Subsidy preview */}
            {form.systemCapacity && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-bold text-green-800 mb-2">केंद्रीय सब्सिडी गणना / Central Subsidy Estimate</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {(() => {
                    const kw = parseFloat(form.systemCapacity) || 0;
                    let subsidy = 0;
                    if (kw <= 2) subsidy = kw * 30000;
                    else if (kw <= 3) subsidy = 60000 + (kw - 2) * 18000;
                    else subsidy = 78000;
                    return [
                      ["प्रस्तावित क्षमता", `${kw} kW`],
                      ["अनुमानित सब्सिडी", `₹${subsidy.toLocaleString("en-IN")}`],
                      ["अधिकतम सब्सिडी", "₹78,000"],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-white rounded-lg px-3 py-2 border border-green-100">
                        <p className="text-xs text-gray-500">{l}</p>
                        <p className="text-sm font-bold text-green-700">{v}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Section 6: Bank Details */}
          <div>
            <p className={secTitle}>6. बैंक विवरण / Bank Details (सब्सिडी के लिए / for Subsidy DBT)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>खाताधारक का नाम / Account Holder Name *</label>
                <input className={inputCls} placeholder="जैसा आधार में है" value={form.accountHolder}
                  onChange={e => update("accountHolder", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>बैंक का नाम / Bank Name *</label>
                <input className={inputCls} placeholder="जैसे: State Bank of India" value={form.bankName}
                  onChange={e => update("bankName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>खाता संख्या / Account Number *</label>
                <input className={inputCls} placeholder="" value={form.accountNo}
                  onChange={e => update("accountNo", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>IFSC कोड / IFSC Code *</label>
                <input className={inputCls} placeholder="जैसे: SBIN0001234" value={form.ifscCode}
                  onChange={e => update("ifscCode", e.target.value.toUpperCase())} />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2 font-medium">
              ⚠️ बैंक खाता आधार कार्ड से लिंक होना अनिवार्य है। केवल आवेदक के नाम का खाता ही मान्य होगा।
            </p>
          </div>

          {/* Section 7: Documents Checklist */}
          <div>
            <p className={secTitle}>7. आवश्यक दस्तावेज़ / Required Documents Checklist</p>
            <div className="space-y-2">
              {docs.map(doc => (
                <label key={doc.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors">
                  <input type="checkbox" className="accent-orange-500 mt-0.5 flex-shrink-0"
                    checked={!!checkedDocs[doc.id]} onChange={() => toggleDoc(doc.id)} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{doc.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.note}</p>
                  </div>
                </label>
              ))}
            </div>
            {allDocsChecked && (
              <div className="mt-3 bg-green-50 border border-green-300 rounded-lg px-4 py-3 text-sm text-green-800 font-semibold">
                ✅ सभी आवश्यक दस्तावेज़ उपलब्ध हैं। आवेदन के लिए तैयार।
              </div>
            )}
          </div>

          {/* Declaration */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm font-bold text-blue-800 mb-2">स्व-घोषणा / Self Declaration</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              मैं, <strong>{form.applicantName || "________________"}</strong>, पुत्र/पुत्री/पत्नी <strong>{form.fatherName || "________________"}</strong>,
              निवासी <strong>{[form.village, form.district].filter(Boolean).join(", ") || "________________"}</strong>, 
              सत्यनिष्ठा से घोषित करता/करती हूँ कि ऊपर दी गई सभी जानकारी मेरी जानकारी और विश्वास के अनुसार सत्य और 
              सही है। मुझे ज्ञात है कि किसी भी प्रकार की असत्य जानकारी देने पर आवेदन निरस्त किया जा सकता है और 
              विधिक कार्रवाई की जा सकती है।
            </p>
          </div>

          {/* Signature area */}
          <div className="grid grid-cols-2 gap-8 pt-2">
            <div className="text-center">
              <div className="h-16 border-b border-gray-400 mb-2"></div>
              <p className="text-xs text-gray-600">आवेदक के हस्ताक्षर / Applicant's Signature</p>
              <p className="text-sm font-medium text-gray-700 mt-1">{form.applicantName || "—"}</p>
              <p className="text-xs text-gray-500">दिनांक: {form.date}</p>
            </div>
            <div className="text-center">
              <div className="h-16 border-b border-gray-400 mb-2 flex items-end justify-center pb-2">
                <div className="text-xs text-orange-400 border border-orange-200 rounded px-3 py-1">मुहर / SEAL</div>
              </div>
              <p className="text-xs text-gray-600">विक्रेता / इंस्टॉलर के हस्ताक्षर</p>
              <p className="text-sm font-medium text-gray-700 mt-1">PLENOX ENTERPRISES LLP</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="solar-header text-white text-center py-3 text-xs">
          <p>{COMPANY.name} | Vishal: {COMPANY.vishal} | Prince: {COMPANY.prince}</p>
          <p className="text-orange-100 mt-0.5">GST: {COMPANY.gst} | {COMPANY.address}</p>
        </div>
      </div>
    </div>
  );
}
