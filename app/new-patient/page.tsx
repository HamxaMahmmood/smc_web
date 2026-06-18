"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import PrintSlip from "@/components/PrintSlip";
import SearchableSelect from "@/components/SearchableSelect";

// ─────────────────────────────────────────────
// DATA BANKS
// ─────────────────────────────────────────────

const COMPLAINTS = [
  "Fever","High-grade fever","Low-grade fever","Fever with chills","Fever with rigors",
  "Cough","Dry cough","Productive cough","Whooping cough","Croup cough (barking)",
  "Runny nose (rhinorrhea)","Nasal congestion","Sneezing","Sore throat","Throat pain",
  "Ear pain (otalgia)","Ear discharge","Difficulty hearing","Redness of eyes (conjunctivitis)","Eye discharge",
  "Shortness of breath","Difficulty breathing","Wheezing","Fast breathing (tachypnea)","Noisy breathing (stridor)",
  "Vomiting","Nausea","Diarrhea","Bloody diarrhea","Loose motions",
  "Abdominal pain","Abdominal distension","Constipation","Blood in stool","Rectal bleeding",
  "Loss of appetite","Poor feeding (infant)","Failure to thrive","Weight loss","Excessive crying (infant)",
  "Rash","Skin rash","Itching (pruritus)","Jaundice (yellowish discoloration)","Pallor (paleness)",
  "Headache","Seizures","Convulsions","Altered consciousness","Lethargy / drowsiness",
  "Neck stiffness","Irritability","Excessive thirst (polydipsia)","Frequent urination (polyuria)","Bedwetting (enuresis)",
  "Burning micturition (UTI symptoms)","Swelling of face","Swelling of limbs (edema)","Joint pain","Limping",
  "Sore mouth / oral ulcers","Swollen lymph nodes","Tooth pain","Dental caries","Epistaxis (nosebleed)",
  "Hair loss","Delayed milestones","Behavioral problems","Sleep disturbance","Nocturnal enuresis",
];

const DURATIONS = [
  "1 day","2 days","3 days","4 days","5 days","6 days",
  "1 week","2 weeks","3 weeks","1 month","2 months","3 months",
  "Since birth","Intermittent","Chronic / recurrent",
];

const GPE_DEFAULT = `Child is conscious, alert, well hydrated and cooperative. Weight ___ kg, height ___ cm, OFC ___ cm. Vitals stable. No pallor, icterus, cyanosis, clubbing, lymphadenopathy or edema. No dysmorphic features. Growth and development appropriate for age.`;

const SYSTEMIC_DEFAULT = `Respiratory, cardiovascular, abdominal, and neurological examinations are unremarkable. No focal neurological deficit. No organomegaly. No evidence of respiratory distress or cardiac failure.`;

const DIAGNOSES = [
  "Acute Upper Respiratory Tract Infection (URTI)",
  "Acute Lower Respiratory Tract Infection (LRTI)",
  "Community Acquired Pneumonia (CAP)",
  "Bronchiolitis","Bronchial Asthma","Reactive Airway Disease (RAD)",
  "Croup (Laryngotracheobronchitis)","Pertussis (Whooping Cough)",
  "Pulmonary Tuberculosis","Pleural Effusion",
  "Acute Otitis Media (AOM)","Otitis Media with Effusion (OME)",
  "Acute Tonsillitis","Acute Pharyngotonsillitis","Peritonsillar Abscess",
  "Allergic Rhinitis","Sinusitis","Adenoid Hypertrophy",
  "Acute Gastroenteritis (AGE)","Viral Gastroenteritis","Bacterial Gastroenteritis",
  "Acute Diarrhea","Persistent Diarrhea","Dysentery",
  "Gastroesophageal Reflux Disease (GERD)","Acute Appendicitis",
  "Constipation","Intussusception","Intestinal Obstruction",
  "Celiac Disease","Irritable Bowel Syndrome (IBS)","Hepatitis A","Hepatitis B","Hepatitis C",
  "Typhoid Fever (Enteric Fever)","Dengue Fever","Dengue Hemorrhagic Fever",
  "Malaria","Measles","Chickenpox (Varicella)","Mumps","Rubella",
  "Infectious Mononucleosis","Bacterial Meningitis","Viral Meningitis",
  "Sepsis / Septicemia","Neonatal Sepsis","Urinary Tract Infection (UTI)",
  "Febrile Seizures","Epilepsy","Cerebral Palsy","Encephalitis",
  "Developmental Delay","Autism Spectrum Disorder (ASD)","ADHD",
  "Iron Deficiency Anemia","Severe Acute Malnutrition (SAM)","Moderate Acute Malnutrition (MAM)",
  "Vitamin D Deficiency / Rickets","Vitamin A Deficiency","Protein Energy Malnutrition",
  "Obesity","Type 1 Diabetes Mellitus","Hypothyroidism",
  "Urticaria","Atopic Dermatitis (Eczema)",
  "Scabies","Impetigo","Tinea Capitis","Cellulitis","Abscess",
  "Nephrotic Syndrome","Nephritic Syndrome","Acute Glomerulonephritis",
  "Vesicoureteral Reflux (VUR)",
  "Congenital Heart Disease (CHD)","Ventricular Septal Defect (VSD)",
  "Atrial Septal Defect (ASD)","Patent Ductus Arteriosus (PDA)","Rheumatic Fever",
  "Febrile Illness (Unspecified)","Viral Fever","Anemia","Thalassemia",
  "Sickle Cell Disease","Kawasaki Disease","Henoch-Schonlein Purpura (HSP)",
  "Foreign Body Aspiration","Failure to Thrive",
];

const INVESTIGATIONS = [
  "Complete Blood Count (CBC)","CBC with Differential","Blood Culture and Sensitivity",
  "Erythrocyte Sedimentation Rate (ESR)","C-Reactive Protein (CRP)",
  "Blood Glucose (Random)","Blood Glucose (Fasting)","HbA1c",
  "Serum Electrolytes (Na, K, Cl, HCO3)","Serum Calcium","Serum Phosphorus",
  "Liver Function Tests (LFTs)","Serum Bilirubin (Total & Direct)",
  "Renal Function Tests (RFTs)","Serum Creatinine","Blood Urea Nitrogen (BUN)",
  "Serum Albumin","Serum Total Protein","Serum Iron / TIBC / Ferritin",
  "Thyroid Function Tests (TSH, T3, T4)","Prothrombin Time (PT)","APTT",
  "Widal Test (Typhoid)","Blood Film for Malaria Parasite","Dengue NS1 Antigen",
  "Dengue IgM / IgG","Hepatitis B Surface Antigen (HBsAg)",
  "Anti-HCV Antibody","HIV Screening","Throat Swab C/S","Urine C/S",
  "Pus C/S","Mantoux (PPD) Test","TB GeneXpert (Sputum/BAL)",
  "ASO Titre (Anti-Streptolysin O)",
  "Urine Routine Examination (Urinalysis)","Urine Culture and Sensitivity",
  "Stool Routine Examination","Stool Culture","Stool for Ova & Parasites","Stool for Occult Blood",
  "24-hour Urine Protein",
  "Chest X-Ray (CXR) PA view","Abdominal X-Ray (Erect & Supine)",
  "X-Ray (Left Hand & Wrist) for Bone Age","Ultrasound Chest", "Pleural fluid examination","Ultrasound KUB",
  "Echocardiography (Echo)","CT Scan Head","MRI Brain",
  "DMSA Scan (Renal)","MCUG (Micturating Cystourethrogram)",
  "Spirometry","Peak Flow Meter","Skin Prick Test (Allergy)",
  "EEG (Electroencephalogram)","Nerve Conduction Study (NCS)",
  "Bone Marrow Aspiration","Lumbar Puncture (CSF Analysis)",
  "Serum 25-OH Vitamin D","Serum Vitamin B12","Serum Folate",
  "Sweat Chloride Test (Cystic Fibrosis)","Stool Reducing Substances",
  "Serum Immunoglobulins (IgG, IgA, IgM)","Antinuclear Antibody (ANA)",
];

interface MedEntry {
  generic: string;
  brands: string[];
  packages: string[];
}

const MEDICINES: MedEntry[] = [
  { generic: "Amoxicillin", brands: ["Amoxil", "Wymox", "Ospamox", "Flemoxin"], packages: ["125mg/5ml Syrup (60ml)", "250mg/5ml Syrup (60ml)", "250mg Capsule", "500mg Capsule"] },
  { generic: "Amoxicillin + Clavulanic Acid", brands: ["Augmentin", "Calamox", "Amclav", "Fixamox-CV"], packages: ["228mg/5ml Syrup (70ml)", "457mg/5ml Syrup (70ml)", "375mg Tablet", "625mg Tablet"] },
  { generic: "Cefixime", brands: ["Cefspan", "Cefiget", "Cefim", "Suprax", "Fixef"], packages: ["50mg/5ml Syrup (30ml)", "100mg/5ml Syrup (30ml)", "200mg Tablet", "400mg Capsule"] },
  { generic: "Azithromycin", brands: ["Azithrox", "Zithromax", "Azimax", "Zetro", "Azee"], packages: ["200mg/5ml Syrup (15ml)", "200mg/5ml Syrup (30ml)", "250mg Tablet", "500mg Tablet"] },
  { generic: "Clarithromycin", brands: ["Klaricid", "Rithmo", "Neo-Klar", "Clariwin"], packages: ["125mg/5ml Syrup (60ml)", "250mg/5ml Syrup (60ml)", "250mg Tablet", "500mg Tablet"] },
  { generic: "Co-Trimoxazole (TMP-SMX)", brands: ["Bactrim", "Septran", "Cotrim"], packages: ["Pediatric Syrup (60ml)", "480mg Tablet (Double Strength)"] },
  { generic: "Metronidazole", brands: ["Flagyl", "Metrozine", "Metris"], packages: ["200mg/5ml Syrup (60ml)", "200mg Tablet", "400mg Tablet"] },
  { generic: "Cefuroxime", brands: ["Zinnat", "Cefurox", "Xetil"], packages: ["125mg/5ml Syrup (50ml)", "250mg Tablet", "500mg Tablet"] },
  { generic: "Cefpodoxime", brands: ["Cepodem", "Vantin", "Podofix"], packages: ["50mg/5ml Syrup (30ml)", "100mg Tablet", "200mg Tablet"] },
  { generic: "Cephalexin", brands: ["Ceporex", "Keflex", "Ospexin"], packages: ["125mg/5ml Syrup (60ml)", "250mg/5ml Syrup (60ml)", "250mg Capsule", "500mg Capsule"] },
  { generic: "Ampicillin + Cloxacillin", brands: ["Ampiclox", "Cloxamp"], packages: ["125mg/5ml Syrup (60ml)", "250mg Capsule", "500mg Capsule"] },
  { generic: "Erythromycin", brands: ["Erythrocin", "Eritop", "Ery-Tab"], packages: ["125mg/5ml Syrup (60ml)", "250mg Tablet", "500mg Tablet"] },
  { generic: "Paracetamol", brands: ["Panadol", "Calpol", "Tempra", "Febrex", "Provas"], packages: ["80mg Drops (15ml)", "120mg/5ml Syrup (60ml)", "160mg/5ml Syrup (60ml)", "250mg/5ml Syrup (100ml)", "125mg Suppository", "250mg Tablet", "500mg Tablet"] },
  { generic: "Ibuprofen", brands: ["Brufen", "Nurofen", "Advil", "Calprofen"], packages: ["100mg/5ml Syrup (60ml)", "200mg/5ml Syrup (60ml)", "200mg Tablet", "400mg Tablet"] },
  { generic: "Mefenamic Acid", brands: ["Ponstan", "Mefeget", "Meftal"], packages: ["50mg/5ml Syrup (60ml)", "250mg Capsule", "500mg Tablet"] },
  { generic: "Chlorpheniramine Maleate (CPM)", brands: ["Piriton", "Histapan", "Chlor-Trimeton"], packages: ["2mg/5ml Syrup (60ml)", "4mg Tablet"] },
  { generic: "Cetirizine", brands: ["Zyrtec", "Cetizin", "Reactine", "Allercet"], packages: ["5mg/5ml Syrup (60ml)", "10mg Tablet"] },
  { generic: "Loratadine", brands: ["Claritin", "Loratab", "Clarityn"], packages: ["5mg/5ml Syrup (60ml)", "10mg Tablet"] },
  { generic: "Levocetirizine", brands: ["Xyzal", "Levocet", "Allerkid"], packages: ["2.5mg/5ml Syrup (60ml)", "5mg Tablet"] },
  { generic: "Fexofenadine", brands: ["Allegra", "Fexet", "Fexo"], packages: ["30mg/5ml Syrup (60ml)", "120mg Tablet", "180mg Tablet"] },
  { generic: "Montelukast", brands: ["Singulair", "Monteget", "Montecon", "Montair"], packages: ["4mg Chewable Tablet", "5mg Chewable Tablet", "10mg Tablet"] },
  { generic: "Salbutamol", brands: ["Ventolin", "Asthalin", "Salbuvent"], packages: ["2mg/5ml Syrup (60ml)", "2mg Tablet", "4mg Tablet", "100mcg Inhaler (200 doses)", "Nebulization Solution 2.5ml"] },
  { generic: "Budesonide (Nebulization)", brands: ["Pulmicort", "Budes"], packages: ["0.25mg/2ml Nebulization", "0.5mg/2ml Nebulization"] },
  { generic: "Fluticasone + Salmeterol Inhaler", brands: ["Seretide", "Fixovent", "Advair"], packages: ["50/25mcg Inhaler", "125/25mcg Inhaler", "250/25mcg Inhaler"] },
  { generic: "Beclomethasone Inhaler", brands: ["Beclate", "Becloforte", "Qvar"], packages: ["50mcg Inhaler (200 doses)", "100mcg Inhaler (200 doses)"] },
  { generic: "Ambroxol", brands: ["Mucosolvan", "Ambril", "Mucohexin"], packages: ["15mg/5ml Syrup (60ml)", "30mg Tablet"] },
  { generic: "Bromhexine", brands: ["Bisolvon", "Bromex"], packages: ["4mg/5ml Syrup (60ml)", "8mg Tablet"] },
  { generic: "Oral Rehydration Salts (ORS)", brands: ["ORS WHO Formula", "Glucolyte", "Rehidrat"], packages: ["Sachet (in 200ml water)", "Sachet (in 1L water)"] },
  { generic: "Zinc Sulfate", brands: ["Zevit", "Zincovit", "Solvazinc"], packages: ["10mg/5ml Syrup (60ml)", "10mg Dispersible Tablet", "20mg Dispersible Tablet"] },
  { generic: "Domperidone", brands: ["Motilium", "Dompil", "Cinet"], packages: ["5mg/5ml Syrup (60ml)", "10mg Tablet"] },
  { generic: "Ondansetron", brands: ["Zofran", "Anset", "Emeset"], packages: ["4mg/5ml Syrup (50ml)", "4mg Tablet", "8mg Tablet"] },
  { generic: "Omeprazole", brands: ["Omez", "Losec", "Prilosec"], packages: ["10mg Capsule", "20mg Capsule", "40mg Tablet"] },
  { generic: "Ranitidine", brands: ["Zantac", "Rantac"], packages: ["75mg/5ml Syrup (60ml)", "150mg Tablet"] },
  { generic: "Lactulose", brands: ["Duphalac", "Lactihep"], packages: ["3.35g/5ml Solution (200ml)", "3.35g/5ml Solution (300ml)"] },
  { generic: "Dicyclomine", brands: ["Merbentyl", "Spasmogon"], packages: ["10mg/5ml Syrup (60ml)", "10mg Tablet", "20mg Tablet"] },
  { generic: "Metoclopramide", brands: ["Maxolon", "Plasil"], packages: ["5mg/5ml Syrup (60ml)", "10mg Tablet"] },
  { generic: "Prednisolone", brands: ["Pred", "Deltacortril", "Predone"], packages: ["5mg/5ml Syrup (60ml)", "5mg Tablet", "10mg Tablet", "25mg Tablet"] },
  { generic: "Dexamethasone", brands: ["Decadron", "Dexona", "Fortecortin"], packages: ["0.5mg/5ml Syrup", "0.5mg Tablet", "4mg Injection"] },
  { generic: "Albendazole", brands: ["Zentel", "Alben", "Eskazole"], packages: ["200mg/5ml Syrup (10ml)", "400mg Chewable Tablet"] },
  { generic: "Mebendazole", brands: ["Vermox", "Sqworm", "Meben"], packages: ["100mg/5ml Syrup (30ml)", "100mg Tablet", "500mg Tablet"] },
  { generic: "Pyrantel Pamoate", brands: ["Combantrin", "Antiminth"], packages: ["50mg/ml Syrup (15ml)", "250mg Tablet"] },
  { generic: "Vitamin D3", brands: ["D-Vit", "D-Sol", "Vitafol-D"], packages: ["400 IU Drops", "800 IU Drops", "1000 IU Tablet", "50,000 IU Capsule"] },
  { generic: "Iron (Ferrous Sulfate)", brands: ["Ferodan", "Ferose", "Fer-In-Sol","Iberet"], packages: ["15mg/ml Drops (50ml)", "25mg/5ml Syrup (100ml)", "325mg Tablet"] },
  { generic: "Calcium + Vitamin D", brands: ["CAC-1000", "Calcivit-D", "Sandocal"], packages: ["Sachet", "Chewable Tablet", "500mg+200IU Tablet"] },
  { generic: "Multivitamin Drops", brands: ["Vidaylin", "Polyviflor", "Abidec", "Vitago"], packages: ["Oral Drops (15ml)", "Oral Drops (30ml)"] },
  { generic: "Folic Acid", brands: ["Folvite", "Folic-5"], packages: ["5mg Tablet", "15mg/5ml Syrup (60ml)"] },
  { generic: "Phenobarbitone", brands: ["Luminal", "Gardenal"], packages: ["15mg/5ml Syrup (60ml)", "30mg Tablet", "60mg Tablet"] },
  { generic: "Sodium Valproate", brands: ["Epilim", "Valparin", "Depakine"], packages: ["200mg/5ml Syrup (300ml)", "200mg Tablet", "500mg Tablet"] },
  { generic: "Levetiracetam", brands: ["Keppra", "Levepsy", "Levitam"], packages: ["100mg/ml Solution (300ml)", "250mg Tablet", "500mg Tablet"] },
  { generic: "Diazepam", brands: ["Valium", "Stesolid", "Diapam"], packages: ["5mg/2.5ml Rectal Gel", "5mg/ml Injection", "5mg Tablet"] },
  { generic: "Chloroquine", brands: ["Aralen", "Avloclor"], packages: ["50mg/5ml Syrup (60ml)", "150mg Tablet"] },
  { generic: "Artemether + Lumefantrine", brands: ["Coartem", "Riamet"], packages: ["20mg/120mg Tablet"] },
];

const FREQUENCIES = [
  "Once a day (OD)","Twice a day (BD)","Three times a day (TDS)","Four times a day (QDS)",
  "Every 6 hours","Every 8 hours","Every 12 hours","Every 4-6 hours (PRN)",
  "At night (HS)","In the morning","Alternate days","Weekly",
];

const DOSAGES = [
  "1 ml","2 ml","2.5 ml","3 ml","4 ml","5 ml","7.5 ml","10 ml","15 ml",
  "Half tablet (½)","One tablet (1)","Two tablets (2)",
  "One capsule","Two capsules","1 puff","2 puffs","One sachet","As directed",
];

const DURATIONS_MED = [
  "3 days","5 days","7 days","10 days","14 days",
  "1 month","2 months","3 months","Ongoing / chronic","As needed (PRN)","Single dose",
];

const INSTRUCTIONS = [
  "Before meal","After meal","With meal","With water","With milk",
  "At bedtime","In the morning","Empty stomach",
  "Dissolve in water","Chew before swallowing","Swallow whole",
  "Shake well before use","Keep refrigerated",
];

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ComplaintEntry { symptom: string; duration: string; }

interface Medication {
  generic: string; brand: string; package: string;
  frequency: string; dosage: string; duration: string; instruction: string;
  frequencyUrdu: string; dosageUrdu: string; durationUrdu: string; instructionUrdu: string;
}

interface PatientForm {
  name: string;
  gender: "Male" | "Female" | "Other";
  ageValue: string;
  ageUnit: "Years" | "Months";
  complaints: ComplaintEntry[];
  gpe: string;
  systemic: string;
  diagnosis: string[];
  investigation: string[];
  medications: Medication[];
}

const emptyComplaint = (): ComplaintEntry => ({ symptom: "", duration: "" });
const emptyMed = (): Medication => ({
  generic: "", brand: "", package: "",
  frequency: "", dosage: "", duration: "", instruction: "",
  frequencyUrdu: "", dosageUrdu: "", durationUrdu: "", instructionUrdu: "",
});

const initialForm: PatientForm = {
  name: "", gender: "Male", ageValue: "", ageUnit: "Years",
  complaints: [emptyComplaint()],
  gpe: GPE_DEFAULT, systemic: SYSTEMIC_DEFAULT,
  diagnosis: [], investigation: [],
  medications: [emptyMed()],
};

type Step = "form" | "preview";

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function NewPatientPage() {
  const [form, setForm] = useState<PatientForm>(initialForm);
  const [step, setStep] = useState<Step>("form");
  const [saving, setSaving] = useState(false);
  const [savedPatient, setSavedPatient] = useState<{ mrNumber: string; visitDate: Date } | null>(null);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const setComplaintField = (i: number, field: keyof ComplaintEntry, val: string) =>
    setForm((f) => { const c = [...f.complaints]; c[i] = { ...c[i], [field]: val }; return { ...f, complaints: c }; });
  const addComplaint = () => setForm((f) => ({ ...f, complaints: [...f.complaints, emptyComplaint()] }));
  const removeComplaint = (i: number) => setForm((f) => ({ ...f, complaints: f.complaints.filter((_, idx) => idx !== i) }));

  const toggleItem = (field: "diagnosis" | "investigation", val: string) =>
    setForm((f) => {
      const arr = f[field];
      return { ...f, [field]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });

  const setMed = (i: number, field: keyof Medication, val: string) =>
    setForm((f) => { const m = [...f.medications]; m[i] = { ...m[i], [field]: val }; return { ...f, medications: m }; });

  const setMedGeneric = (i: number, val: string) => {
    const entry = MEDICINES.find((m) => m.generic === val);
    setForm((f) => {
      const m = [...f.medications];
      m[i] = { ...m[i], generic: val, brand: entry?.brands[0] || "", package: entry?.packages[0] || "" };
      return { ...f, medications: m };
    });
  };

  const addMed = () => setForm((f) => ({ ...f, medications: [...f.medications, emptyMed()] }));
  const removeMed = (i: number) => setForm((f) => ({ ...f, medications: f.medications.filter((_, idx) => idx !== i) }));

  const complaintsText = form.complaints
    .filter((c) => c.symptom)
    .map((c) => c.duration ? `${c.symptom} for ${c.duration}` : c.symptom)
    .join(", ");

  const clinicalExamText = [
    form.gpe ? `GPE: ${form.gpe}` : "",
    form.systemic ? `Systemic: ${form.systemic}` : "",
  ].filter(Boolean).join("\n\n");

  const buildPrintPatient = (mrNumber = "PREVIEW", visitDate: Date | string = new Date()) => ({
    name: form.name,
    gender: form.gender,
    age: form.ageUnit === "Months" ? parseInt(form.ageValue) / 12 : parseInt(form.ageValue),
    mrNumber,
    complaint: complaintsText,
    clinicalExamination: clinicalExamText,
    diagnosis: form.diagnosis.join(", "),
    investigation: form.investigation.join(", "),
    medications: form.medications.map((m) => ({
      drug: [m.brand, m.generic && `(${m.generic})`, m.package && `— ${m.package}`].filter(Boolean).join(" "),
      frequency: m.frequency, dosage: m.dosage, duration: m.duration, instruction: m.instruction,
      frequencyUrdu: m.frequencyUrdu, dosageUrdu: m.dosageUrdu,
      durationUrdu: m.durationUrdu, instructionUrdu: m.instructionUrdu,
    })),
    visitDate,
  });

  const handlePreview = () => {
    if (!form.name.trim() || !form.ageValue) { setError("Patient name and age are required."); return; }
    setError(""); setStep("preview");
  };

  const handleSaveAndPrint = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, gender: form.gender,
          age: form.ageUnit === "Months" ? Math.ceil(parseInt(form.ageValue) / 12) : parseInt(form.ageValue),
          complaint: complaintsText, clinicalExamination: clinicalExamText,
          diagnosis: form.diagnosis.join(", "), investigation: form.investigation.join(", "),
          medications: buildPrintPatient().medications,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
      setSavedPatient({ mrNumber: json.data.mrNumber, visitDate: json.data.visitDate });
      setTimeout(() => window.print(), 200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setSaving(false); }
  };

  const handleNew = () => { setForm(initialForm); setSavedPatient(null); setStep("form"); setError(""); };

  // ── PREVIEW ──
  if (step === "preview") {
    const pt = savedPatient
      ? buildPrintPatient(savedPatient.mrNumber, savedPatient.visitDate)
      : buildPrintPatient();

    return (
      <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
        <div className="no-print" style={{ background: "#1a3a6b", padding: "12px 24px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => setStep("form")} style={btn("ghost")}>← Back</button>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Siddique Medical Complex</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            {!savedPatient
              ? <button onClick={handleSaveAndPrint} disabled={saving} style={btn("white")}>{saving ? "Saving…" : "💾 Save & Print"}</button>
              : <><button onClick={() => window.print()} style={btn("white")}>🖨️ Print Again</button><button onClick={handleNew} style={btn("green")}>+ New Patient</button></>
            }
          </div>
        </div>
        {error && <div className="no-print" style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 24px", fontSize: "14px" }}>{error}</div>}
        {savedPatient && <div className="no-print" style={{ background: "#dcfce7", color: "#166534", padding: "10px 24px", fontSize: "14px" }}>✓ Saved — MR# {savedPatient.mrNumber}</div>}
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px" }}>
          <div ref={printRef} style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)", borderRadius: "4px", overflow: "hidden" }}>
            <PrintSlip patient={pt as unknown as Parameters<typeof PrintSlip>[0]["patient"]} />
          </div>
        </div>
      </div>
    );
  }

  // ── FORM ──
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
      <div style={{ background: "#1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px" }}>← Home</Link>
        <h1 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "700" }}>New Patient Registration</h1>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px" }}>
        {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}

        {/* Patient Info */}
        <Card title="👤 Patient Information">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px", alignItems: "end" }}>
            <div>
              <Label>Full Name *</Label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Ahmed Khan" style={inputSt} />
            </div>
            <div>
              <Label>Age *</Label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input type="number" min="0" value={form.ageValue} onChange={(e) => setForm((f) => ({ ...f, ageValue: e.target.value }))} placeholder="e.g. 3" style={{ ...inputSt, width: "60%" }} />
                <select value={form.ageUnit} onChange={(e) => setForm((f) => ({ ...f, ageUnit: e.target.value as "Years" | "Months" }))} style={{ ...inputSt, width: "40%", padding: "9px 6px" }}>
                  <option>Years</option><option>Months</option>
                </select>
              </div>
            </div>
            <div>
              <Label>Gender</Label>
              <select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as "Male" | "Female" | "Other" }))} style={inputSt}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Complaints */}
        <Card title="🤒 Complaints">
          {form.complaints.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "10px", alignItems: "end", marginBottom: "10px" }}>
              <div>
                {i === 0 && <Label>Symptom / Complaint</Label>}
                <SearchableSelect options={COMPLAINTS} value={c.symptom} onChange={(v) => setComplaintField(i, "symptom", v)} placeholder="Search symptom..." />
              </div>
              <div>
                {i === 0 && <Label>Duration</Label>}
                <SearchableSelect options={DURATIONS} value={c.duration} onChange={(v) => setComplaintField(i, "duration", v)} placeholder="Duration..." />
              </div>
              <div>
                {i === 0 && <Label>&nbsp;</Label>}
                {form.complaints.length > 1
                  ? <button onClick={() => removeComplaint(i)} style={{ border: "none", background: "#fee2e2", color: "#dc2626", borderRadius: "7px", padding: "9px 12px", cursor: "pointer", fontWeight: "600" }}>✕</button>
                  : <div style={{ width: "40px" }} />}
              </div>
            </div>
          ))}
          <button onClick={addComplaint} style={addRowBtn}>+ Add Symptom</button>
        </Card>

        {/* Clinical Examination */}
        <Card title="🩺 Clinical Examination">
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <Label>General Physical Examination (GPE)</Label>
              <button onClick={() => setForm((f) => ({ ...f, gpe: GPE_DEFAULT }))} style={resetBtn}>↺ Reset to default</button>
            </div>
            <textarea value={form.gpe} onChange={(e) => setForm((f) => ({ ...f, gpe: e.target.value }))} rows={4} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit", lineHeight: "1.6" }} />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <Label>Systemic Examination</Label>
              <button onClick={() => setForm((f) => ({ ...f, systemic: SYSTEMIC_DEFAULT }))} style={resetBtn}>↺ Reset to default</button>
            </div>
            <textarea value={form.systemic} onChange={(e) => setForm((f) => ({ ...f, systemic: e.target.value }))} rows={4} style={{ ...inputSt, resize: "vertical", fontFamily: "inherit", lineHeight: "1.6" }} />
          </div>
        </Card>

        {/* Diagnosis */}
        <Card title="🔬 Diagnosis">
          <SearchableSelect
            options={DIAGNOSES.filter((d) => !form.diagnosis.includes(d))}
            value=""
            onChange={(v) => { if (v && DIAGNOSES.includes(v) && !form.diagnosis.includes(v)) { toggleItem("diagnosis", v); } }}
            placeholder="Search and select diagnosis..."
          />
          {form.diagnosis.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
              {form.diagnosis.map((d) => (
                <span key={d} style={tagStyle("#dbeafe", "#1d4ed8")}>
                  {d} <button onClick={() => toggleItem("diagnosis", d)} style={tagX}>×</button>
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Investigation */}
        <Card title="🧪 Investigation / Tests">
          <SearchableSelect
            options={INVESTIGATIONS.filter((inv) => !form.investigation.includes(inv))}
            value=""
            onChange={(v) => { if (v && INVESTIGATIONS.includes(v) && !form.investigation.includes(v)) { toggleItem("investigation", v); } }}
            placeholder="Search and select investigation..."
          />
          {form.investigation.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
              {form.investigation.map((inv) => (
                <span key={inv} style={tagStyle("#d1fae5", "#065f46")}>
                  {inv} <button onClick={() => toggleItem("investigation", inv)} style={tagX}>×</button>
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* Medications */}
        <Card title="💊 Medications">
          {form.medications.map((med, i) => {
            const entry = MEDICINES.find((m) => m.generic === med.generic);
            const brandOpts = entry?.brands || [];
            const packageOpts = entry?.packages || [];
            return (
              <div key={i} style={{ border: "1px solid #c8d8f0", borderRadius: "10px", padding: "16px", marginBottom: "14px", background: "#f8faff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontWeight: "700", color: "#1a3a6b", fontSize: "14px" }}>Medicine {i + 1}</span>
                  {form.medications.length > 1 && <button onClick={() => removeMed(i)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>✕ Remove</button>}
                </div>

                {/* Generic / Brand / Package */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <Label>Generic Name</Label>
                    <SearchableSelect options={MEDICINES.map((m) => m.generic)} value={med.generic} onChange={(v) => setMedGeneric(i, v)} placeholder="e.g. Amoxicillin" />
                  </div>
                  <div>
                    <Label>Brand Name (Pakistan)</Label>
                    <SearchableSelect options={brandOpts} value={med.brand} onChange={(v) => setMed(i, "brand", v)} placeholder="e.g. Amoxil" />
                  </div>
                  <div>
                    <Label>Package / Strength</Label>
                    <SearchableSelect options={packageOpts} value={med.package} onChange={(v) => setMed(i, "package", v)} placeholder="e.g. 125mg/5ml Syrup" />
                  </div>
                </div>

                {/* English */}
                <div style={{ marginBottom: "6px" }}><span style={langBadge("en")}>English</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                  <div><Label>Frequency</Label><SearchableSelect options={FREQUENCIES} value={med.frequency} onChange={(v) => setMed(i, "frequency", v)} placeholder="e.g. Twice a day" /></div>
                  <div><Label>Dosage</Label><SearchableSelect options={DOSAGES} value={med.dosage} onChange={(v) => setMed(i, "dosage", v)} placeholder="e.g. 5 ml" /></div>
                  <div><Label>Duration</Label><SearchableSelect options={DURATIONS_MED} value={med.duration} onChange={(v) => setMed(i, "duration", v)} placeholder="e.g. 7 days" /></div>
                  <div><Label>Instruction</Label><SearchableSelect options={INSTRUCTIONS} value={med.instruction} onChange={(v) => setMed(i, "instruction", v)} placeholder="e.g. After meal" /></div>
                </div>

                {/* Urdu */}
                <div style={{ marginBottom: "6px" }}><span style={langBadge("ur")}>اردو</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", background: "#f0f7ff", borderRadius: "8px", padding: "10px" }}>
                  <div><Label>تعداد</Label><input value={med.frequencyUrdu} onChange={(e) => setMed(i, "frequencyUrdu", e.target.value)} placeholder="دن میں دو بار" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                  <div><Label>خوراک</Label><input value={med.dosageUrdu} onChange={(e) => setMed(i, "dosageUrdu", e.target.value)} placeholder="۵ ملی لیٹر" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                  <div><Label>مدت</Label><input value={med.durationUrdu} onChange={(e) => setMed(i, "durationUrdu", e.target.value)} placeholder="۷ دن" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                  <div><Label>ہدایت</Label><input value={med.instructionUrdu} onChange={(e) => setMed(i, "instructionUrdu", e.target.value)} placeholder="کھانے کے بعد" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                </div>
              </div>
            );
          })}
          <button onClick={addMed} style={addRowBtn}>+ Add Medicine</button>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
          <Link href="/" style={{ textDecoration: "none" }}><button style={btn("light")}>Cancel</button></Link>
          <button onClick={handlePreview} style={btn("navy")}>Preview & Print →</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
      <h3 style={{ margin: "0 0 18px", color: "#1a3a6b", fontSize: "15px", fontWeight: "700", borderBottom: "2px solid #e8f0fb", paddingBottom: "10px" }}>{title}</h3>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#374151", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{children}</label>;
}

const inputSt: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1.5px solid #c8d8f0", borderRadius: "7px", fontSize: "14px", outline: "none", background: "white", color: "#1a1a2e", boxSizing: "border-box" };
const addRowBtn: React.CSSProperties = { border: "2px dashed #2b5199", borderRadius: "8px", padding: "10px", width: "100%", background: "transparent", color: "#2b5199", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
const resetBtn: React.CSSProperties = { background: "none", border: "1px solid #c8d8f0", borderRadius: "5px", padding: "3px 10px", fontSize: "11px", color: "#6b7280", cursor: "pointer" };
const tagX: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontWeight: "700", marginLeft: "4px", fontSize: "14px", lineHeight: "1", padding: 0 };

function tagStyle(bg: string, color: string): React.CSSProperties {
  return { display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", background: bg, color };
}
function langBadge(lang: "en" | "ur"): React.CSSProperties {
  return { display: "inline-block", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", background: lang === "en" ? "#dbeafe" : "#fef9c3", color: lang === "en" ? "#1d4ed8" : "#854d0e" };
}
function btn(v: "ghost" | "white" | "green" | "navy" | "light"): React.CSSProperties {
  const base: React.CSSProperties = { padding: "9px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none" };
  if (v === "ghost") return { ...base, background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.3)" };
  if (v === "white") return { ...base, background: "#ffffff", color: "#1a3a6b" };
  if (v === "green") return { ...base, background: "#16a34a", color: "white" };
  if (v === "navy") return { ...base, background: "#1a3a6b", color: "white" };
  if (v === "light") return { ...base, background: "white", color: "#6b7280", border: "1.5px solid #d1d5db" };
  return base;
}