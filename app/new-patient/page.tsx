"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import PrintSlip from "@/components/PrintSlip";
import SearchableSelect from "@/components/SearchableSelect";

// ─────────────────────────────────────────────
// DATA BANKS
// ─────────────────────────────────────────────

const CLINICS = [
  {
    id: "islamabad",
    name: "Islamabad Specialist Clinic Satyana Road, Faisalabad",
    detail: "Reg # PHC R-75672  · Timings: 7:30 PM – 9:30 PM",
  },
  {
    id: "siddique",
    name: "Siddique Executive Clinic Gulistan Colony, Faisalabad",
    detail: "Reg # PHC R-95991  ·  Timings: 5:00 PM – 7:00 PM",
  },
  {
    id: "Online",
    name: "TeleConsultation (Online)",
    detail: "Timings: 5:00 PM – 10:00 PM",
  }
];

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

const GPE_DEFAULT = `Anthropometery: Weight: ______ kg, Height/length: ______ cm, BMI: ______ kg/m², Head Circumference: ______ cm, Mid-Upper Arm Circumference (MUAC): ______ cm.\n
 Vital Signs: Temperature: ______ °F, Pulse Rate: ______ bpm, Respiratory Rate: ______ breaths/min, Blood Pressure: ______ mmHg.`;

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
  "X-Ray (Left Hand & Wrist) for Bone Age","Ultrasound Abdomen","Ultrasound Chest",
  "Pleural fluid examination","Ultrasound KUB",
  "Echocardiography (Echo)","CT Scan Head","MRI Brain",
  "DMSA Scan (Renal)","MCUG (Micturating Cystourethrogram)",
  "Spirometry","Peak Flow Meter","Skin Prick Test (Allergy)",
  "EEG (Electroencephalogram)","Nerve Conduction Study (NCS)",
  "Bone Marrow Aspiration","Lumbar Puncture (CSF Analysis)",
  "Serum 25-OH Vitamin D","Serum Vitamin B12","Serum Folate",
  "Sweat Chloride Test (Cystic Fibrosis)","Stool Reducing Substances",
  "Serum Immunoglobulins (IgG, IgA, IgM)","Antinuclear Antibody (ANA)",
];

interface MedEntry { generic: string; brands: string[]; packages: string[]; }




// ── Frequency ──
const FREQUENCIES: { en: string; ur: string }[] = [
  { en: "Twice a day (BD)", ur: "صبح و شام" },
  { en: "Three times a day (TDS)", ur: "صبح، دوپہر، شام" },
  { en: "Once At night (HS)",          ur: "رات سونے سے پہلے" },
  { en: "Once In the morning",         ur: "ایک بار صبح کے وقت" },
  { en: "Alternate days",         ur: "ایک دن چھوڑ کر" },
  { en: "Stat dose", ur: "صرف ایک ہی دفعہ" },
  { en: "Four times a day (QDS)", ur: "دن میں چار بار" },
  { en: "Every 6 hours",          ur: "ہر ۶ گھنٹے بعد" },
  { en: "Every 8 hours",          ur: "ہر ۸ گھنٹے بعد" },
  { en: "Every 12 hours",         ur: "ہر ۱۲ گھنٹے بعد" },
  { en: "Every 4-6 hours (PRN)",  ur: "ضرورت پر ہر ۴ تا ۶ گھنٹے بعد" },
  { en: "Weekly",                 ur: "ہفتے میں ایک بار" },
  { en: "Monthly", ur: "مہینے میں ایک بار" },

];

// ── Dosage ──
const DOSAGE_AMOUNTS: { en: string; ur: string }[] = [
  { en: "1/4",   ur: "ایک چوتھائی" },

  { en: "1/3",   ur: "ایک تہائی" },

  { en: "1/2",   ur: "آدھا" },
  { en: "1",   ur: "۱" },
  { en: "1.5", ur: "۱.۵" },
  { en: "2",   ur: "۲" },
  { en: "2.5", ur: "۲.۵" },
  { en: "3",   ur: "۳" },
  { en: "4",   ur: "۴" },
  { en: "5",   ur: "۵" },
  { en: "6",   ur: "۶" },
  { en: "7",   ur: "۷" },
  { en: "7.5", ur: "۷.۵" },
  { en: "8",   ur: "۸" },
  { en: "9",   ur: "۹" },
  { en: "10",  ur: "۱۰" },
  { en: "15",  ur: "۱۵" },
];

const DOSAGE_UNITS: { en: string; ur: string }[] = [
  { en: "drop",        ur: "قطرہ" },
  { en: "ml",          ur: "ملی لیٹر" },
  { en: "tablet",      ur: "گولی" },
  { en: "unit",      ur: "یونٹ" },

  { en: "injection",      ur: "انجکشن" },
  { en: "capsule",     ur: "کیپسول" },
  { en: "puff",        ur: "پف" },
  { en: "sachet",      ur: "ساشے" },
  { en: "As directed", ur: "ڈاکٹر کی ہدایت کے مطابق" },
];

// ── Duration ──
const DURATIONS_MED: { en: string; ur: string }[] = [
  { en: "Single dose",       ur: "صرف ایک بار" },
  { en: "1 days",            ur: "۱ دن" },
  { en: "2 days",            ur: "۲ دن" },
  { en: "3 days",            ur: "۳ دن" },
  { en: "4 days",            ur: "۴ دن" },
  { en: "5 days",            ur: "۵ دن" },
  { en: "6 days",            ur: "۶ دن" },
  { en: "7 days",            ur: "۷ دن" },
  { en: "10 days",           ur: "۱۰ دن" },
  { en: "14 days",           ur: "۱۴ دن" },
  { en: "1 month",           ur: "ایک مہینہ" },
  { en: "2 months",          ur: "دو مہینے" },
  { en: "3 months",          ur: "تین مہینے" },
  { en: "Ongoing / chronic", ur: "مسلسل / دائمی" },
  { en: "As needed (PRN)",   ur: "ضرورت پڑنے پر" },
];


const HOME_INSTRUCTIONS = [
  {
    id: "medicine",
    title: "۱. دوا کے بارے میں",
    lines: [
      "دوا ڈاکٹر کی ہدایت کے مطابق مقررہ مقدار اور وقت پر دیں۔",
      "دوا خود سے بند یا تبدیل نہ کریں۔",
      "کھانسی، بخار یا اینٹی بایوٹک ادویات خود سے شروع نہ کریں۔",
      "دوا بچوں کی پہنچ سے دور رکھیں۔",
    ],
  },
  {
    id: "fever",
    title: "۲. بخار کی صورت میں",
    lines: [
      "بچے کو ہلکے کپڑے پہنائیں۔",
      "پانی، دودھ یا ORS مناسب مقدار میں دیں۔",
      "پیراسٹامول صرف تجویز کردہ خوراک میں دیں۔",
      "اگر بخار 3 دن سے زیادہ رہے تو فوراً معائنہ کروائیں۔",
    ],
  },
  {
    id: "emergency",
    title: "۳. فوری طور پر ڈاکٹر سے رابطہ کریں اگر",
    lines: [
      "بچے کو سانس لینے میں دشواری ہو۔",
      "بچہ پانی یا دودھ نہ پی رہا ہو۔",
      "مسلسل قے ہو رہی ہو۔",
      "دورہ (Fits) پڑ جائے۔",
      "بچہ غیر معمولی طور پر غنودہ یا بے ہوش لگے۔",
      "شدید پانی کی کمی کی علامات ہوں۔",
    ],
  },
  {
    id: "diarrhea",
    title: "۴. اسہال (دست) کی صورت میں",
    lines: [
      "ORS بار بار دیں۔",
      "ماں کا دودھ جاری رکھیں۔",
      "زنک ڈاکٹر کے مشورے کے مطابق دیں۔",
      "کولڈ ڈرنکس اور غیر ضروری ادویات سے پرہیز کریں۔",
    ],
  },
  {
    id: "cough",
    title: "۵. کھانسی اور نزلہ",
    lines: [
      "بچے کو مناسب مقدار میں پانی پلائیں۔",
      "ایک سال سے بڑے بچوں کو شہد دیا جا سکتا ہے۔",
      "اینٹی بایوٹک صرف ڈاکٹر کے مشورے سے استعمال کریں۔",
    ],
  },
  {
    id: "diet",
    title: "۶. غذائی ہدایات",
    lines: [
      "۶ ماہ تک صرف ماں کا دودھ دیں۔",
      "۶ ماہ کے بعد دودھ کے ساتھ مناسب گھر کی غذا شروع کریں۔",
      "جنک فوڈ، کولڈ ڈرنکس اور چپس سے پرہیز کریں۔",
      "پھل، سبزیاں اور پروٹین والی غذا استعمال کروائیں۔",
    ],
  },
  {
    id: "vaccination",
    title: "۷. ویکسینیشن",
    lines: [
      "حفاظتی ٹیکے مقررہ وقت پر لگوائیں۔",
      "ویکسین کارڈ ہر وزٹ پر ساتھ لائیں۔",
      "کوئی ویکسین رہ جائے تو ڈاکٹر سے مشورہ کریں۔",
    ],
  },
  {
    id: "followup",
    title: "۸. فالو اپ",
    lines: [
      "اگلی ملاقات مقررہ تاریخ پر ضرور کروائیں۔",
      "تمام لیبارٹری رپورٹس اور سابقہ نسخے ساتھ لائیں۔",
    ],
  },
  {
  id: "follow_up_for_neonates",
  title: "فالو اَپ ہدایات برائے نوزائیدہ",
  lines: [
    "بچے کو صرف ماں کا دودھ پلائیں۔",
    "دن اور رات میں ہر 2–3 گھنٹے بعد یا بچے کی طلب پر دودھ پلائیں۔",
    "چھ ماہ تک پانی، شہد، گھٹی یا کوئی اور غذا نہ دیں۔",
    "روزانہ کم از کم 6 بار پیشاب آنا چاہیے۔",
    "پاخانے کی تعداد مختلف ہو سکتی ہے، اگر بچہ دودھ اچھی طرح پی رہا ہے تو فکر کی ضرورت نہیں۔",
    "ناف کو صاف اور خشک رکھیں۔",
    "ناف پر کوئی دوا، تیل یا پاؤڈر نہ لگائیں۔",
    "اگر ناف سے پیپ، بدبو یا خون آئے تو فوراً ڈاکٹر سے رابطہ کریں۔",
    "موسم کے مطابق کپڑے پہنائیں۔",
    "بچے کا سر ڈھانپ کر رکھیں، خاص طور پر سردی میں۔",
    "بچے کو دھوئیں اور سگریٹ کے دھوئیں سے دور رکھیں۔",
    "پیدائش کے وقت لگنے والے ٹیکے (BCG، OPV، Hepatitis B) یقینی بنائیں۔",
    "اگلے حفاظتی ٹیکوں کی تاریخ یاد رکھیں اور وقت پر ویکسین لگوائیں۔",
  ],
},
];

const ROUTES: { en: string; ur: string }[] = [
  { en: "By mouth (oral)",     ur: "منہ کے ذریعے" },
  { en: "Sublingual",          ur: "زبان کے نیچے" },
  { en: "Per rectum",          ur: "مقعد کے ذریعے" },
  { en: "Intravenous (IV)",    ur: "رگ میں" },
  { en: "Intramuscular (IM)",  ur: "پٹھے میں" },
  { en: "Subcutaneous (SC)",   ur: "جلد کے نیچے" },
  { en: "Intradermal",         ur: "جلد کے اندر" },
  { en: "Inhalation",          ur: "سانس کے ذریعے" },
  { en: "Nebulization",           ur: "دوا کی بھاپ دیں" },
  { en: "Topical",             ur: "جلد پر لگانے کے لیے" },
  { en: "Topical Eye drops",           ur: "آنکھ میں ڈالیں" },
  { en: "Topical Ear drops",           ur: "کان میں ڈالیں" },
  { en: "Intranasal",       ur: "ناک میں ڈالیں" },

];
// ── Instruction ──
const INSTRUCTIONS: { en: string; ur: string }[] = [

  { en: "Apply on all body below neck", ur:"گردن سے نیچے ساری جلد پر لگائیں" },
  { en: "Apply on umbilicus", ur: "ناف پر لگائیں" },
  { en: "Wash the wound",           ur: "زخم کو دھوئیں" },
  { en: "Wash the head",           ur: "سر کو دھوئیں" },
  { en: "Apply on wound",           ur: "زخم پر لگائیں" },
  { en: "Apply on skin",           ur: "جلد پر لگائیں" },
  { en: "Before meal",           ur: "کھانے سے پہلے" },
  { en: "After meal",            ur: "کھانے کے بعد" },
  { en: "With meal",             ur: "کھانے کے ساتھ" },
  { en: "With water",            ur: "پانی کے ساتھ" },
  { en: "With milk",             ur: "دودھ کے ساتھ" },
  { en: "At bedtime",            ur: "سونے سے پہلے" },
  { en: "In the morning",        ur: "صبح کے وقت" },
  { en: "Empty stomach",         ur: "خالی پیٹ" },
  { en: "Dissolve in water",     ur: "پانی میں گھول کر پئیں" },
  { en: "Chew before swallowing",ur: "چبا کر نگلیں" },
  { en: "Swallow whole",         ur: "پوری نگل لیں" },
  { en: "Shake well before use", ur: "استعمال سے پہلے ہلائیں" },
  { en: "Keep refrigerated",     ur: "فریج میں رکھیں" },
];




function urduFor(
  list: { en: string; ur: string }[],
  enVal: string
): string {
  return list.find((x) => x.en === enVal)?.ur ?? "";
}



// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ComplaintEntry { symptom: string; duration: string; }
interface Medication {
  generic: string; brand: string; package: string;
  dosageAmount: string; dosageUnit: string;
  frequency: string; dosage: string; duration: string; instruction: string;
  route: string; routeUrdu: string;
  frequencyUrdu: string; dosageUrdu: string; durationUrdu: string; instructionUrdu: string;
}
interface PatientForm {
  clinic: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  ageValue: string;
  ageUnit: "Year" | "Month" | "Day";
  contact: string;
  address: string;
  complaints: ComplaintEntry[];
  gpe: string;
  systemic: string;
  diagnosis: string[];
  investigation: string[];
  medications: Medication[];
  weight: string;
  homeInstructions: string[];
  followUpDate: string;
  isReturning: boolean;
  returningMrNumber: string;
}

const emptyComplaint = (): ComplaintEntry => ({ symptom: "", duration: "" });
const emptyMed = (): Medication => ({
  generic: "", brand: "", package: "",
  dosageAmount: "", dosageUnit: "",
  frequency: "", dosage: "", duration: "", instruction: "", route: "", routeUrdu: "",
  frequencyUrdu: "", dosageUrdu: "", durationUrdu: "", instructionUrdu: "",
});
const initialForm: PatientForm = {
  clinic: "islamabad",
  name: "", gender: "Male", ageValue: "", ageUnit: "Year",
  contact: "", address: "",
  complaints: [emptyComplaint()],
  gpe: GPE_DEFAULT, systemic: SYSTEMIC_DEFAULT,
  diagnosis: [], investigation: [],
  medications: [emptyMed()],
  weight: "",
  homeInstructions: [],
  followUpDate: "",
  isReturning: false,
  returningMrNumber: "",
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
  const [medicineBank, setMedicineBank] = useState<MedEntry[]>([]);
  const [dbComplaints, setDbComplaints] = useState<string[]>([]);
  const [dbDiagnoses, setDbDiagnoses] = useState<string[]>([]);
  const [dbInvestigations, setDbInvestigations] = useState<string[]>([]);
  const [mrLookupLoading, setMrLookupLoading] = useState(false);
  const [mrLookupError, setMrLookupError] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
useEffect(() => {
  fetch("/api/medicines")
    .then((res) => res.json())
    .then((json) => {
      if (json.success) {
        setMedicineBank(
          json.data.map((m: { generic: string; brands: string[]; packages: string[] }) => ({
            generic: m.generic,
            brands: m.brands,
            packages: m.packages || [],
          }))
        );
      }
    })
    .catch(() => {});
}, []);

  useEffect(() => {
  Promise.all([
    fetch("/api/complaints").then((r) => r.json()),
    fetch("/api/diagnoses").then((r) => r.json()),
    fetch("/api/investigations").then((r) => r.json()),
  ])
    .then(([comp, diag, inv]) => {
      if (comp.success) {
        const names = comp.data.map((c: { name: string }) => c.name);
        setDbComplaints(names.filter((n: string) => !COMPLAINTS.includes(n)));
      }
      if (diag.success) {
        const names = diag.data.map((d: { name: string }) => d.name);
        setDbDiagnoses(names.filter((n: string) => !DIAGNOSES.includes(n)));
      }
      if (inv.success) {
        const names = inv.data.map((i: { name: string }) => i.name);
        setDbInvestigations(names.filter((n: string) => !INVESTIGATIONS.includes(n)));
      }
    })
    .catch(() => {});
}, []);

useEffect(() => {
  if (!savedPatient || !shouldPrint) return;
  const prevTitle = document.title;
  document.title = savedPatient.mrNumber;
  const t = setTimeout(() => {
    window.print();
    setShouldPrint(false);
    setTimeout(() => { document.title = prevTitle; }, 1000);
  }, 300);
  return () => clearTimeout(t);
}, [savedPatient, shouldPrint]);
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
  setForm((f) => {
    const m = [...f.medications];
    m[i] = { ...m[i], generic: val, brand: "" };
    return { ...f, medications: m };
  });
};
const handleDosageChange = (i: number, field: "dosageAmount" | "dosageUnit", val: string) => {
  setForm((f) => {
    const m = [...f.medications];
    const updated = { ...m[i], [field]: val };
    const amount = field === "dosageAmount" ? val : updated.dosageAmount;
    const unit   = field === "dosageUnit"   ? val : updated.dosageUnit;

    if (unit === "As directed") {
      updated.dosage     = "As directed";
      updated.dosageUrdu = "ڈاکٹر کی ہدایت کے مطابق";
    } else {
      const amountUr = DOSAGE_AMOUNTS.find((a) => a.en === amount)?.ur ?? amount;
      const unitUr   = DOSAGE_UNITS.find((u) => u.en === unit)?.ur   ?? unit;
      updated.dosage     = [amount, unit].filter(Boolean).join(" ");
      updated.dosageUrdu = [amountUr, unitUr].filter(Boolean).join(" ");
    }

    m[i] = updated;
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
    mrNumber,
    name: form.name,
    gender: form.gender,
    weight: form.weight,
    age: form.ageValue,
    ageUnit: form.ageUnit,
    clinic: form.clinic,
    contact: form.contact,
    address: form.address,
    complaint: complaintsText,
    clinicalExamination: clinicalExamText,
    diagnosis: form.diagnosis.join(", "),
    investigation: form.investigation.join(", "),
    followUpDate: form.followUpDate,
    homeInstructions: HOME_INSTRUCTIONS
      .filter((h) => form.homeInstructions.includes(h.id))
      .map((h) => ({ title: h.title, lines: h.lines })),
    medications: form.medications.map((m) => ({
      drug: [m.brand, m.generic && `(${m.generic})`, m.package && `— ${m.package}`].filter(Boolean).join(" "),
      frequency: m.frequency, dosage: m.dosage, duration: m.duration, instruction: m.instruction,
       route: m.route, routeUrdu: m.routeUrdu,
      frequencyUrdu: m.frequencyUrdu, dosageUrdu: m.dosageUrdu,
      durationUrdu: m.durationUrdu, instructionUrdu: m.instructionUrdu,
    })),
    visitDate,
  });

  const handlePreview = () => {
    if (!form.name.trim() || !form.ageValue) { setError("Patient name and age are required."); return; }
    setError(""); setStep("preview");
  };

  const handleMrLookup = async () => {
  const mr = form.returningMrNumber.trim();
  if (!mr) return;
  setMrLookupLoading(true);
  setMrLookupError("");
  try {
    const res = await fetch(`/api/patients?mrNumber=${encodeURIComponent(mr)}`);
    const json = await res.json();
    if (!json.success || !json.data) {
      setMrLookupError("MR number not found. Please check and try again.");
      setForm((f) => ({ ...f, isReturning: false }));
      return;
    }
    const p = json.data;
    setForm((f) => ({
      ...f,
      isReturning: true,
      name:     p.name    || f.name,
      gender:   p.gender  || f.gender,
      ageValue: String(p.age ?? f.ageValue),
      ageUnit:  p.ageUnit || f.ageUnit,
      contact:  p.contact || f.contact,
      address:  p.address || f.address,
    }));
  } catch {
    setMrLookupError("Something went wrong. Please try again.");
  } finally {
    setMrLookupLoading(false);
  }
};

  const syncMedicinesToDatabase = async () => {
  const calls = form.medications
    .filter((m) => m.generic.trim())
    .map((m) =>
      fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generic: m.generic.trim(), brand: m.brand.trim() }),
      }).catch(() => null)
    );
  await Promise.allSettled(calls);
};

const syncCustomEntries = async () => {
  const complaintCalls = form.complaints
    .map((c) => c.symptom.trim())
    .filter(Boolean)
    .map((name) =>
      fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }).catch(() => null)
    );

  const diagnosisCalls = form.diagnosis
    .map((d) => d.trim())
    .filter(Boolean)
    .map((name) =>
      fetch("/api/diagnoses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }).catch(() => null)
    );

  const investigationCalls = form.investigation
    .map((i) => i.trim())
    .filter(Boolean)
    .map((name) =>
      fetch("/api/investigations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }).catch(() => null)
    );

  await Promise.allSettled([...complaintCalls, ...diagnosisCalls, ...investigationCalls]);
};

const handleSaveAndPrint = async () => {
    setSaving(true); setError("");
    try {
      await syncMedicinesToDatabase();
      await syncCustomEntries();
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        name: form.name, gender: form.gender,
        ageValue: form.ageValue,
        ageUnit: form.ageUnit,
        clinic: form.clinic,
        contact: form.contact,
        address: form.address,
        weight: form.weight ? Number(form.weight) : undefined,
        ...(form.isReturning && { mrNumber: form.returningMrNumber.trim() }),
        complaint: complaintsText, clinicalExamination: clinicalExamText,
        diagnosis: form.diagnosis.join(", "), investigation: form.investigation.join(", "),
        medications: buildPrintPatient().medications,
}),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");
      setSavedPatient({ mrNumber: json.data.mrNumber, visitDate: json.data.visitDate });
      setShouldPrint(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setSaving(false); }
  };

  const handleNew = () => { 
  setForm(initialForm); 
  setSavedPatient(null); 
  setStep("form"); 
  setError(""); 
  setMrLookupError(""); 
};
  // ── Follow-up display ──
  const followUpDisplay = form.followUpDate
    ? new Date(form.followUpDate + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "";

  // ── PREVIEW ──
  if (step === "preview") {
    const pt = savedPatient
      ? buildPrintPatient(savedPatient.mrNumber, savedPatient.visitDate)
      : buildPrintPatient();

    return (
      <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
        <div className="no-print" style={{ background: "#1a3a6b", padding: "12px 24px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => setStep("form")} style={btn("ghost")}>← Back</button>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Dr. Zahid Mahmood</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            {!savedPatient ? (
  <button onClick={handleSaveAndPrint} disabled={saving} style={btn("white")}>
    {saving ? "Saving…" : "💾 Save & Print"}
  </button>
) : (
  <>
    <button
      onClick={() => {
        const prevTitle = document.title;
        document.title = savedPatient.mrNumber;
        window.print();
        setTimeout(() => { document.title = prevTitle; }, 1000);
      }}
      style={btn("white")}
    >
      🖨️ Print Again
    </button>
    <button onClick={handleNew} style={{ ...btn("white"), background: "#16a34a", color: "white" }}>
      + New Patient
    </button>
  </>
)}
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
        <h1 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "700" }}>New Patient</h1>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px" }}>
        {error && <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>{error}</div>}

        {/* ── Clinic selector ── */}
        <Card title="🏥 Clinic / Establishment">
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {CLINICS.map((c) => (
              <label
                key={c.id}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  padding: "12px 14px", borderRadius: "10px", cursor: "pointer",
                  border: `1.5px solid ${form.clinic === c.id ? "#1a3a6b" : "#c8d8f0"}`,
                  background: form.clinic === c.id ? "#e8f0fb" : "white",
                  transition: "all 0.15s",
                }}
              >
                <input
                  type="radio"
                  name="clinic"
                  value={c.id}
                  checked={form.clinic === c.id}
                  onChange={() => setForm((f) => ({ ...f, clinic: c.id }))}
                  style={{ marginTop: "2px" }}
                />
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a2e" }}>{c.name}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{c.detail}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>

        {/* ── Patient Info ── */}
        <Card title="👤 Patient Information">
          {/* ── Returning Patient Lookup ── */}
<div style={{ marginBottom: "18px", padding: "14px", background: "#f0f4fa", borderRadius: "10px", border: "1px solid #c8d8f0" }}>
  <Label>Returning Patient? Enter Previous MR Number</Label>
  <div style={{ display: "flex", gap: "8px" }}>
    <input
      value={form.returningMrNumber}
      onChange={(e) => setForm((f) => ({ ...f, returningMrNumber: e.target.value, isReturning: false }))}
      onKeyDown={(e) => { if (e.key === "Enter") handleMrLookup(); }}
      placeholder="e.g. 00000042"
      style={{ ...inputSt, flex: 1 }}
    />
    <button
      onClick={handleMrLookup}
      disabled={mrLookupLoading || !form.returningMrNumber.trim()}
      style={{
        padding: "9px 18px", borderRadius: "7px", border: "none", fontWeight: "600",
        fontSize: "13px", cursor: mrLookupLoading || !form.returningMrNumber.trim() ? "default" : "pointer",
        background: mrLookupLoading || !form.returningMrNumber.trim() ? "#9ca3af" : "#1a3a6b",
        color: "white", whiteSpace: "nowrap",
      }}
    >
      {mrLookupLoading ? "Looking up…" : "🔍 Look Up"}
    </button>
    {form.isReturning && (
      <button
        onClick={() => setForm((f) => ({ ...f, isReturning: false, returningMrNumber: "", name: "", gender: "Male", ageValue: "", ageUnit: "Year", contact: "", address: "" }))}
        style={{ padding: "9px 12px", borderRadius: "7px", border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: "600", fontSize: "13px", cursor: "pointer" }}
      >
        ✕ Clear
      </button>
    )}
  </div>
  {mrLookupError && (
    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#dc2626" }}>{mrLookupError}</p>
  )}
  {form.isReturning && (
    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#166534", fontWeight: "600" }}>
      ✓ Returning patient found — visit will be saved under MR# {form.returningMrNumber}
    </p>
  )}
</div>

{/* existing name/age/gender grid follows unchanged */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <Label>Full Name *</Label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Ahmed Khan" style={inputSt} />
            </div>
            <div>
              <Label>Age *</Label>
              <div style={{ display: "flex", gap: "6px" }}>
                <input type="number" min="0" value={form.ageValue} onChange={(e) => setForm((f) => ({ ...f, ageValue: e.target.value }))} placeholder="e.g. 3" style={{ ...inputSt, width: "55%" }} />
                <select value={form.ageUnit} onChange={(e) => setForm((f) => ({ ...f, ageUnit: e.target.value as "Year" | "Month" | "Day" }))} style={{ ...inputSt, width: "45%", padding: "9px 6px" }}>
                  <option>Year</option><option>Month</option><option>Day</option>
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "14px" }}>
             <div>
    <Label>Weight (kg)</Label>
    <input
      type="number" min="0" step="0.1"
      value={form.weight}
      onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
      placeholder="e.g. 14.5"
      style={inputSt}
    />
  </div>  
  <div>
    <Label>Contact Number</Label>
    <input value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} placeholder="e.g. 0301-1234567" style={inputSt} />
  </div>
 
  <div>
    <Label>Address</Label>
    <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="e.g. House 5, Street 3, F-7/2 Islamabad" style={inputSt} />
  </div>
</div>
        </Card>

        {/* ── Complaints ── */}
        <Card title="🤒 Complaints">
          {form.complaints.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "10px", alignItems: "end", marginBottom: "10px" }}>
              <div>
                {i === 0 && <Label>Symptom / Complaint</Label>}
                <SearchableSelect options={[...COMPLAINTS, ...dbComplaints]} value={c.symptom} onChange={(v) => setComplaintField(i, "symptom", v)} placeholder="Search symptom..." />
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

        {/* ── Clinical Examination ── */}
        <Card title="🩺 Clinical Examination">
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ display: "inline-block", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", background: "#e8f0fb", color: "#1a3a6b" }}>GPE</span>
              <div style={{ display: "flex", gap: "6px" }}>
  <button onClick={() => setForm((f) => ({ ...f, gpe: GPE_DEFAULT }))} style={resetBtn}>↺ Reset to default</button>
  <button onClick={() => setForm((f) => ({ ...f, gpe: "" }))} style={{ ...resetBtn, borderColor: "#fca5a5", color: "#dc2626" }}>✕ Clear</button>
</div>
            </div>
            <textarea
              value={form.gpe}
              onChange={(e) => setForm((f) => ({ ...f, gpe: e.target.value }))}
              rows={4}
              style={{ ...inputSt, resize: "vertical", fontFamily: "inherit", lineHeight: "1.6", borderLeft: "3px solid #1a3a6b", borderRadius: "0 7px 7px 0", background: "#f0f4fa" }}
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ display: "inline-block", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", background: "#f5f0fa", color: "#534AB7" }}>Systemic</span>
              <div style={{ display: "flex", gap: "6px" }}>
  <button onClick={() => setForm((f) => ({ ...f, systemic: SYSTEMIC_DEFAULT }))} style={resetBtn}>↺ Reset to default</button>
  <button onClick={() => setForm((f) => ({ ...f, systemic: "" }))} style={{ ...resetBtn, borderColor: "#fca5a5", color: "#dc2626" }}>✕ Clear</button>
</div>
            </div>
            <textarea
              value={form.systemic}
              onChange={(e) => setForm((f) => ({ ...f, systemic: e.target.value }))}
              rows={4}
              style={{ ...inputSt, resize: "vertical", fontFamily: "inherit", lineHeight: "1.6", borderLeft: "3px solid #534AB7", borderRadius: "0 7px 7px 0", background: "#f5f0fa" }}
            />
          </div>
        </Card>

        {/* ── Diagnosis ── */}
        <Card title="🔬 Diagnosis">
<SearchableSelect
  options={[...DIAGNOSES, ...dbDiagnoses].filter((d) => !form.diagnosis.includes(d))}
  value=""
  onChange={(v) => {
    if (v && !form.diagnosis.includes(v)) toggleItem("diagnosis", v);
  }}
  placeholder="Search or type a diagnosis..."
  showAddButton
  clearAfterSelect
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

        {/* ── Investigation ── */}
        <Card title="🧪 Investigation / Tests">
<SearchableSelect
  options={[...INVESTIGATIONS, ...dbInvestigations].filter((inv) => !form.investigation.includes(inv))}
  value=""
  onChange={(v) => {
    if (v && !form.investigation.includes(v)) toggleItem("investigation", v);
  }}
  placeholder="Search or type an investigation..."
  showAddButton
  clearAfterSelect
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

        {/* ── Medications ── */}
        <Card title="💊 Medications">
          {form.medications.map((med, i) => {
            const entry = medicineBank.find((m) => m.generic.toLowerCase() === med.generic.toLowerCase());
            return (
              <div key={i} style={{ border: "1px solid #c8d8f0", borderRadius: "10px", padding: "16px", marginBottom: "14px", background: "#f8faff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span style={{ fontWeight: "700", color: "#1a3a6b", fontSize: "14px" }}>Medicine {i + 1}</span>
                  {form.medications.length > 1 && <button onClick={() => removeMed(i)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>✕ Remove</button>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  
                  <div><Label>Generic Name</Label><SearchableSelect options={medicineBank.map((m) => m.generic)} value={med.generic} onChange={(v) => setMedGeneric(i, v)} placeholder="e.g. Amoxicillin" /></div>
                  <div><Label>Brand Name (Pakistan)</Label><SearchableSelect options={entry?.brands || []} value={med.brand} onChange={(v) => setMed(i, "brand", v)} placeholder="e.g. Amoxil" /></div>
                  <div><Label>Package / Strength</Label><SearchableSelect options={entry?.packages || []} value={med.package} onChange={(v) => setMed(i, "package", v)} placeholder="Type or select a package..." /></div>
                </div>
              {/* English */}
<div style={{ marginBottom: "6px" }}><span style={langBadge("en")}>English</span></div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
  <div>
    <Label>Frequency</Label>
    <SearchableSelect
      options={FREQUENCIES.map((f) => f.en)}
      value={med.frequency}
      onChange={(v) => {
        setMed(i, "frequency", v);
        setMed(i, "frequencyUrdu", urduFor(FREQUENCIES, v));
      }}
      placeholder="Twice a day"
    />
  </div>
 <div>
    <Label>Dosage</Label>
    <div style={{ display: "flex", gap: "5px" }}>
      <div style={{ flex: "0 0 36%" }}>
        <SearchableSelect
          options={DOSAGE_AMOUNTS.map((a) => a.en)}
          value={med.dosageAmount}
          onChange={(v) => handleDosageChange(i, "dosageAmount", v)}
          placeholder="1"
        />
      </div>
      <div style={{ flex: 1 }}>
        <SearchableSelect
          options={DOSAGE_UNITS.map((u) => u.en)}
          value={med.dosageUnit}
          onChange={(v) => handleDosageChange(i, "dosageUnit", v)}
          placeholder="ml"
        />
      </div>
    </div>
  </div>
  <div>
    <Label>Route</Label>
    <SearchableSelect
      options={ROUTES.map((r) => r.en)}
      value={med.route}
      onChange={(v) => {
        setMed(i, "route", v);
        setMed(i, "routeUrdu", urduFor(ROUTES, v));
      }}
      placeholder="By mouth"
    />
  </div>
  <div>
    <Label>Duration</Label>
    <SearchableSelect
      options={DURATIONS_MED.map((d) => d.en)}
      value={med.duration}
      onChange={(v) => {
        setMed(i, "duration", v);
        setMed(i, "durationUrdu", urduFor(DURATIONS_MED, v));
      }}
      placeholder="7 days"
    />
  </div>
  <div>
    <Label>Instruction</Label>
    <SearchableSelect
      options={INSTRUCTIONS.map((ins) => ins.en)}
      value={med.instruction}
      onChange={(v) => {
        setMed(i, "instruction", v);
        setMed(i, "instructionUrdu", urduFor(INSTRUCTIONS, v));
      }}
      placeholder="After meal"
    />
  </div>
  
</div>
                <div style={{ marginBottom: "6px" }}><span style={langBadge("ur")}>اردو</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "10px", background: "#f0f7ff", borderRadius: "8px", padding: "10px" }}>
                  <div><Label>تعداد</Label><input value={med.frequencyUrdu} onChange={(e) => setMed(i, "frequencyUrdu", e.target.value)} placeholder="دن میں دو بار" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                  <div><Label>خوراک</Label><input value={med.dosageUrdu} onChange={(e) => setMed(i, "dosageUrdu", e.target.value)} placeholder="۵ ملی لیٹر" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                  <div><Label>طریقہ</Label><input value={med.routeUrdu} onChange={(e) => setMed(i, "routeUrdu", e.target.value)} placeholder="منہ کے ذریعے" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                  <div><Label>مدت</Label><input value={med.durationUrdu} onChange={(e) => setMed(i, "durationUrdu", e.target.value)} placeholder="۷ دن" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                  <div><Label>ہدایت</Label><input value={med.instructionUrdu} onChange={(e) => setMed(i, "instructionUrdu", e.target.value)} placeholder="کھانے کے بعد" dir="rtl" style={{ ...inputSt, fontFamily: "serif" }} /></div>
                </div>
              </div>
            );
          })}
          <button onClick={addMed} style={addRowBtn}>+ Add Medicine</button>
        </Card>

        {/* ── Follow-up ── */}
        <Card title="📅 Follow-up Visit">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center" }}>
            <div>
              <Label>Next Visit Date</Label>
              <input
                type="date"
                value={form.followUpDate}
                onChange={(e) => setForm((f) => ({ ...f, followUpDate: e.target.value }))}
                min={new Date().toISOString().split("T")[0]}
                style={inputSt}
              />
            </div>
            {followUpDisplay && (
              <div style={{ padding: "10px 14px", border: "1.5px solid #1a3a6b", borderRadius: "8px", background: "#e8f0fb" }}>
                <div style={{ fontSize: "11px", color: "#1a3a6b", fontWeight: "700", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Scheduled</div>
                <div style={{ fontSize: "14px", color: "#1a3a6b", fontWeight: "600" }}>{followUpDisplay}</div>
              </div>
            )}
          </div>
        </Card>
            {/* ── Home Instructions ── */}
        <Card title="📋 گھریلو ہدایات — Home Instructions">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {HOME_INSTRUCTIONS.map((h) => {
              const selected = form.homeInstructions.includes(h.id);
              return (
                <label
                  key={h.id}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
                    border: `1.5px solid ${selected ? "#1a3a6b" : "#c8d8f0"}`,
                    background: selected ? "#e8f0fb" : "white",
                    transition: "all 0.15s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        homeInstructions: selected
                          ? f.homeInstructions.filter((id) => id !== h.id)
                          : [...f.homeInstructions, h.id],
                      }))
                    }
                  />
                  <span style={{
                    fontSize: "13px", fontFamily: "serif", direction: "rtl",
                    color: selected ? "#1a3a6b" : "#374151",
                    fontWeight: selected ? "700" : "400",
                  }}>
                    {h.title}
                  </span>
                </label>
              );
            })}
          </div>
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