"use client";

import React from "react";

interface Medication {
  drug: string;
  frequency: string;
  dosage: string;
  duration: string;
  instruction: string;
}

interface PrintSlipProps {
  patient: {
    name: string;
    gender: string;
    age: number;
    mrNumber: string;
    complaint: string;
    clinicalExamination: string;
    diagnosis: string;
    investigation: string;
    medications: Medication[];
    visitDate?: string | Date;
  };
}

export default function PrintSlip({ patient }: PrintSlipProps) {
  const now = patient.visitDate ? new Date(patient.visitDate) : new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      id="print-slip"
      className="bg-white text-black font-serif"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "8mm 12mm",
        fontFamily: "Georgia, serif",
        fontSize: "11pt",
        lineHeight: "1.4",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "3px solid #1a3a6b",
          paddingBottom: "6mm",
          marginBottom: "4mm",
        }}
      >
        <h1
          style={{
            fontSize: "26pt",
            fontWeight: "bold",
            color: "#1a3a6b",
            textAlign: "center",
            letterSpacing: "0.04em",
            margin: 0,
          }}
        >
          Siddique Medical Complex
        </h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "9pt",
            color: "#555",
            margin: "2mm 0 0 0",
          }}
        >
          Professional Medical Care
        </p>

        {/* Doctor Info Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4mm",
            borderTop: "1px solid #ccc",
            paddingTop: "3mm",
          }}
        >
          <div>
            <p style={{ fontWeight: "bold", fontSize: "12pt", margin: 0 }}>
              Dr. Zahid Mahmood
            </p>
            <p style={{ fontSize: "9pt", color: "#444", margin: "1mm 0 0 0" }}>
              MBBS, FCPS
            </p>
            <p style={{ fontSize: "9pt", color: "#444", margin: 0 }}>
              Consultant Paediatrician
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "9pt", color: "#444", margin: 0 }}>
              PMDC Reg. No: ___________
            </p>
          </div>
        </div>
      </div>

      {/* Patient Info Bar */}
      <div
        style={{
          background: "#f0f4fa",
          border: "1px solid #c8d8f0",
          borderRadius: "3mm",
          padding: "3mm 5mm",
          marginBottom: "5mm",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2mm",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "11pt" }}>
          {patient.name}
        </span>
        <span style={{ fontSize: "10pt" }}>
          {patient.gender} | {patient.age} Y
        </span>
        <span style={{ fontSize: "10pt" }}>
          <strong>MR#:</strong> {patient.mrNumber}
        </span>
        <span style={{ fontSize: "9pt", color: "#555" }}>
          {dateStr} — {timeStr}
        </span>
      </div>

      {/* Clinical Sections */}
      <div style={{ marginBottom: "4mm" }}>
        {patient.complaint && (
          <Section label="Complaint" value={patient.complaint} />
        )}
        {patient.clinicalExamination && (
          <Section
            label="Clinical Examination"
            value={patient.clinicalExamination}
          />
        )}
        {patient.diagnosis && (
          <Section label="Diagnosis" value={patient.diagnosis} />
        )}
        {patient.investigation && (
          <Section label="Investigation" value={patient.investigation} />
        )}
      </div>

      {/* Medication Table */}
      {patient.medications && patient.medications.length > 0 && (
        <div style={{ marginTop: "5mm" }}>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "11pt",
              marginBottom: "2mm",
              borderBottom: "1px solid #1a3a6b",
              paddingBottom: "1mm",
              color: "#1a3a6b",
            }}
          >
            Medication
          </p>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10pt",
            }}
          >
            <thead>
              <tr style={{ background: "#1a3a6b", color: "white" }}>
                <th style={thStyle}>Sr.</th>
                <th style={thStyle}>Drug</th>
                <th style={thStyle}>Frequency</th>
                <th style={thStyle}>Dosage</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Instruction</th>
              </tr>
            </thead>
            <tbody>
              {patient.medications.map((med, i) => (
                <tr
                  key={i}
                  style={{ background: i % 2 === 0 ? "#f9fbff" : "white" }}
                >
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: "600" }}>{med.drug}</td>
                  <td style={tdStyle}>{med.frequency}</td>
                  <td style={tdStyle}>{med.dosage}</td>
                  <td style={tdStyle}>{med.duration}</td>
                  <td style={tdStyle}>{med.instruction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "12mm",
          borderTop: "1px solid #ccc",
          paddingTop: "4mm",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9pt",
          color: "#777",
        }}
      >
        <span>Siddique Medical Complex</span>
        <span>Follow-up as advised by doctor</span>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, borderTop: "1px solid #000", paddingTop: "2mm", marginTop: "8mm", width: "40mm", fontSize: "8pt" }}>
            Doctor&apos;s Signature
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "3mm" }}>
      <span style={{ fontWeight: "bold", color: "#1a3a6b" }}>{label}: </span>
      <span>{value}</span>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "2mm 3mm",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "9.5pt",
  border: "1px solid #1a3a6b",
};

const tdStyle: React.CSSProperties = {
  padding: "2mm 3mm",
  border: "1px solid #dde4f0",
  verticalAlign: "top",
};
