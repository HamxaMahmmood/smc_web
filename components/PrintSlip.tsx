"use client";

import React from "react";

interface Medication {
  drug: string;
  frequency: string;
  dosage: string;
  duration: string;
  instruction: string;
  frequencyUrdu?: string;
  dosageUrdu?: string;
  durationUrdu?: string;
  instructionUrdu?: string;
}

interface PrintSlipProps {
  patient: {
    name: string;
    gender: string;
    age: number | string;
    ageUnit?: string;
    mrNumber: string;
    complaint: string;
    clinicalExamination: string;
    diagnosis: string;
    investigation: string;
    medications: Medication[];
    visitDate?: string | Date;
    clinic?: string;
    contact?: string;
    address?: string;
    weight?: number | string;
    homeInstructions?: { title: string; lines: string[] }[];
    followUpDate?: string;
  };
}

const CLINICS: Record<string, { name: string; detail: string; phone: string }> = {
  islamabad: {
    name: "Islamabad Specialist Clinic (IDC) Satyana Road, Faisalabad",
    detail: "Reg # PHC R-75672  ·   Timings: 7:30 PM – 9:30 PM (Monday to Friday)" ,
    phone: "041-8712828 , 03438530064",
  },
  siddique: {
    name: "Siddique Executive Clinic (Hospital) Gulistan Colony, Faisalabad",
    detail: "Reg # PHC R-95991  ·  Timings: 5:00 PM – 7:00 PM (Monday to Saturday) " ,
    phone: "041 8848024",
  },
};

export default function PrintSlip({ patient }: PrintSlipProps) {
  const now = patient.visitDate ? new Date(patient.visitDate) : new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  const clinic = patient.clinic ? CLINICS[patient.clinic] : CLINICS.islamabad;

  // Parse complaint into numbered list
  const complaintLines = patient.complaint
    ? patient.complaint.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Parse GPE and Systemic from combined string
  let gpeText = "";
  let systemicText = "";
  if (patient.clinicalExamination) {
    const gpeMatch = patient.clinicalExamination.match(/GPE:\s*([\s\S]*?)(?:\n\nSystemic:|$)/);
    const sysMatch = patient.clinicalExamination.match(/Systemic:\s*([\s\S]*?)$/);
    gpeText = gpeMatch ? gpeMatch[1].trim() : patient.clinicalExamination;
    systemicText = sysMatch ? sysMatch[1].trim() : "";
  }

  // Format follow-up date
  let followUpDisplay = "";
  if (patient.followUpDate) {
    const fd = new Date(patient.followUpDate + "T00:00:00");
    followUpDisplay = fd.toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
  }

  return (
    <div
      id="print-slip"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "8mm 12mm",
        fontFamily: "Georgia, serif",
        fontSize: "11pt",
        lineHeight: "1.4",
        background: "white",
        color: "black",
      }}
    >
      {/* ── Header ── */}
      <div style={{ borderBottom: "3px solid #1a3a6b", paddingBottom: "6mm", marginBottom: "4mm" }}>
        <h1 style={{ fontSize: "22pt", fontWeight: "bold", color: "#1a3a6b", textAlign: "center", letterSpacing: "0.03em", margin: 0 }}>
          Prof. Dr. Zahid Mahmood
        </h1>
        <p style={{ textAlign: "center", fontSize: "9pt", color: "#444", margin: "1.5mm 0 0" }}>
          MBBS, FCPS &nbsp;·&nbsp; Consultant Paediatrician
        </p>
        <p style={{ textAlign: "center",fontFamily: "Times New Roman", fontSize: "9pt", color: "#444", margin: "1.5mm 0 0" }}>
          0333-6507982 &nbsp;·&nbsp; 0312-6507982
        </p>

        <div style={{ borderTop: "1px solid #ccc", marginTop: "4mm", paddingTop: "3mm", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontWeight: "bold",fontFamily: "Times New Roman", fontSize: "10pt", margin: 0, color: "#1a3a6b" }}>
              {clinic.name}
            </p>
            <p style={{ fontSize: "8.5pt",fontFamily: "Times New Roman", color: "#555", margin: "1mm 0 0" }}>
              {clinic.detail}
            </p>
            <p>
              <span style={{ fontSize: "8.5pt", fontFamily: "Times New Roman", color: "#444" }}>Phone: {clinic.phone}</span>
            </p>
           <p>VOC: ✔</p> 
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "8.5pt", fontFamily: "Times New Roman", color: "#444", margin: 0 }}>PMDC Reg. No: 28355-P</p>
          </div>
        </div>
      </div>

      {/* ── Patient Info Bar ── */}
      <div style={{
        background: "#f0f4fa", border: "1px solid #c8d8f0", borderRadius: "3mm",
        padding: "3mm 5mm", marginBottom: "5mm", display: "flex",
        flexWrap: "wrap", gap: "3mm", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontWeight: "bold", fontSize: "11pt" }}>{patient.name}</span>
        <span style={{ fontSize: "10pt", fontFamily: "Times New Roman" }}>
          {patient.gender} | {patient.age} {patient.ageUnit} old
          {patient.weight ? ` | Wt: ${patient.weight} kg` : ""}
        </span>
        {patient.contact && <span style={{ fontSize: "9.5pt", fontFamily: "Times New Roman" }}>📞 {patient.contact}</span>}
        {patient.address && <span style={{ fontSize: "9pt", fontFamily: "Times New Roman", color: "#444" }}>📍 {patient.address}</span>}
        <span style={{ fontSize: "10pt", fontFamily: "Times New Roman" }}><strong>MR#:</strong> {patient.mrNumber}</span>
        <span style={{ fontSize: "9pt", fontFamily: "Times New Roman", color: "#555" }}><strong>Date & time: </strong>{dateStr} — {timeStr}</span>
      </div>

     {/* ── Complaint | Diagnosis | Investigation — 3-col row ── */}
      <div style={{ display: "flex", gap: "4mm", marginBottom: "4mm", alignItems: "flex-start" }}>

        {/* Complaint */}
        {complaintLines.length > 0 && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: "bold", color: "#1a3a6b", fontSize: "10pt", borderBottom: "1px solid #c8d8f0", paddingBottom: "1mm", marginBottom: "1.5mm" }}>
              Complaint:
            </div>
            {complaintLines.map((line, i) => (
              <div key={i} style={{ fontSize: "9.5pt", marginBottom: "0.5mm" }}>
                {complaintLines.length === 1 ? line : `${i + 1}. ${line}`}
              </div>
            ))}
          </div>
        )}

        {/* Diagnosis */}
        {patient.diagnosis && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: "bold", color: "#1a3a6b", fontSize: "10pt", borderBottom: "1px solid #c8d8f0", paddingBottom: "1mm", marginBottom: "1.5mm" }}>
              Diagnosis:
            </div>
            {patient.diagnosis.split(",").map((d) => d.trim()).filter(Boolean).map((d, i, arr) => (
              <div key={i} style={{ fontSize: "9.5pt", marginBottom: "0.5mm" }}>
                {arr.length === 1 ? d : `${i + 1}. ${d}`}
              </div>
            ))}
          </div>
        )}

        {/* Investigation */}
        {patient.investigation && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: "bold", color: "#1a3a6b", fontSize: "10pt", borderBottom: "1px solid #c8d8f0", paddingBottom: "1mm", marginBottom: "1.5mm" }}>
              Investigation Advised:
            </div>
            {patient.investigation.split(",").map((inv) => inv.trim()).filter(Boolean).map((inv, i, arr) => (
              <div key={i} style={{ fontSize: "9.5pt", marginBottom: "0.5mm" }}>
                {arr.length === 1 ? inv : `${i + 1}. ${inv}`}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ── Clinical Examination ── */}
      {(gpeText || systemicText) && (
        <div style={{ marginBottom: "4mm" }}>
          <span style={{ fontWeight: "bold", color: "#1a3a6b", fontSize: "10.5pt" }}>Clinical Examination:</span>
          {gpeText && (
            <div style={{
              background: "#f0f4fa", borderLeft: "3px solid #1a3a6b",
              padding: "2mm 4mm", margin: "2mm 0", borderRadius: "0 2mm 2mm 0",
            }}>
              <span style={{ fontWeight: "bold", color: "#1a3a6b", fontSize: "9pt" }}>GPE: </span>
              <span style={{ fontSize: "9.5pt" }}>{gpeText}</span>
            </div>
          )}
          {systemicText && (
            <div style={{
              background: "#f5f0fa", borderLeft: "3px solid #534AB7",
              padding: "2mm 4mm", margin: "2mm 0", borderRadius: "0 2mm 2mm 0",
            }}>
              <span style={{ fontWeight: "bold", color: "#534AB7", fontSize: "9pt" }}>Systemic: </span>
              <span style={{ fontSize: "9.5pt" }}>{systemicText}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Medication Table ── */}
      {patient.medications && patient.medications.length > 0 && (
        <div style={{ marginTop: "5mm" }}>
          <p style={{ fontWeight: "bold", fontSize: "11pt", marginBottom: "2mm", borderBottom: "1px solid #1a3a6b", paddingBottom: "1mm", color: "#1a3a6b" }}>
            Medication
          </p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10pt" }}>
            <thead>
              <tr style={{ background: "#1a3a6b", color: "white" }}>
                {["Sr.", "Drug", "Frequency", "Dosage", "Duration", "Instruction"].map((h) => (
                  <th key={h} style={{ padding: "2mm 3mm", textAlign: "left", fontWeight: "bold", fontSize: "9.5pt", border: "1px solid #1a3a6b" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patient.medications.map((med, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#f9fbff" : "white" }}>
                  <td style={tdS}>{i + 1}</td>
                  <td style={{ ...tdS, fontWeight: "600" }}>{med.drug}</td>
                  <td style={tdS}><BiCell en={med.frequency} ur={med.frequencyUrdu} /></td>
                  <td style={tdS}><BiCell en={med.dosage} ur={med.dosageUrdu} /></td>
                  <td style={tdS}><BiCell en={med.duration} ur={med.durationUrdu} /></td>
                  <td style={tdS}><BiCell en={med.instruction} ur={med.instructionUrdu} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Follow-up ── */}
      {followUpDisplay && (
        <div style={{ marginTop: "6mm", display: "inline-flex", alignItems: "center", gap: "6mm", border: "1px solid #1a3a6b", borderRadius: "3mm", padding: "2.5mm 5mm" }}>
          <span style={{ fontSize: "10pt", color: "#1a3a6b" }}>📅</span>
          <span style={{ fontWeight: "bold", color: "#1a3a6b", fontSize: "10pt" }}>Follow-up visit: (دوبارہ معائنہ کروانے کی تاریخ)</span>
          <span style={{ fontSize: "10pt", fontFamily: "Times New Roman" }}>{followUpDisplay}</span>
        </div>
      )}
      {/* ── Home Instructions ── */}
      {patient.homeInstructions && patient.homeInstructions.length > 0 && (
        <div style={{ marginTop: "6mm", borderTop: "2px dashed #c8d8f0", paddingTop: "4mm" }}>
          <p style={{
            fontWeight: "bold", fontSize: "10.5pt", color: "#1a3a6b",
            marginBottom: "3mm", direction: "rtl", textAlign: "right",
            fontFamily: "'Noto Nastaliq Urdu', serif",
          }}>
            بچوں کے والدین کے لیے اہم ہدایات
          </p>
          <div style={{ direction: "rtl", columns: patient.homeInstructions.length > 3 ? 2 : 1, columnGap: "6mm" }}>
            {patient.homeInstructions.map((section, i) => (
              <div key={i} style={{ marginBottom: "3mm", breakInside: "avoid" }}>
                <div style={{
                  fontWeight: "bold", fontSize: "9.5pt", color: "#1a3a6b",
                  marginBottom: "1mm", fontFamily: "'Noto Nastaliq Urdu', serif",
                }}>
                  {section.title}
                </div>
                <ul style={{ margin: 0, paddingRight: "4mm", paddingLeft: 0 }}>
                  {section.lines.map((line, j) => (
                    <li key={j} style={{
                      fontSize: "8.5pt", marginBottom: "0.5mm",
                      fontFamily: "'Noto Nastaliq Urdu', serif",
                    }}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p style={{
            fontSize: "8pt", color: "#555", marginTop: "2mm",
            direction: "rtl", textAlign: "right",
            fontFamily: "'Noto Nastaliq Urdu', serif",
          }}>
            ⚠️ نوٹ: کسی بھی ہنگامی صورت حال میں قریبی ایمرجنسی یا اپنے معالج سے فوری رابطہ کریں۔
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      
    </div>
  );
}

function BiCell({ en, ur }: { en: string; ur?: string }) {
  return (
    <div>
      <div>{en}</div>
      {ur && ur.trim() && (
        <div style={{ fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: "9pt", color: "#333", marginTop: "1mm", direction: "rtl", textAlign: "right" }}>
          {ur}
        </div>
      )}
    </div>
  );
}

const tdS: React.CSSProperties = {
  padding: "2mm 3mm",
  border: "1px solid #dde4f0",
  verticalAlign: "top",
};