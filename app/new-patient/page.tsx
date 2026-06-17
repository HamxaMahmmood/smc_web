"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import PrintSlip from "@/components/PrintSlip";

interface Medication {
  drug: string;
  frequency: string;
  dosage: string;
  duration: string;
  instruction: string;
}

interface PatientForm {
  name: string;
  gender: "Male" | "Female" | "Other";
  age: string;
  complaint: string;
  clinicalExamination: string;
  diagnosis: string;
  investigation: string;
  medications: Medication[];
}

const emptyMed = (): Medication => ({
  drug: "",
  frequency: "",
  dosage: "",
  duration: "",
  instruction: "",
});

const initialForm: PatientForm = {
  name: "",
  gender: "Male",
  age: "",
  complaint: "",
  clinicalExamination: "",
  diagnosis: "",
  investigation: "",
  medications: [emptyMed()],
};

type Step = "form" | "preview";

export default function NewPatientPage() {
  const [form, setForm] = useState<PatientForm>(initialForm);
  const [step, setStep] = useState<Step>("form");
  const [saving, setSaving] = useState(false);
  const [savedPatient, setSavedPatient] = useState<(PatientForm & { mrNumber: string; visitDate: Date }) | null>(null);
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  // Field handlers
  const set = (field: keyof PatientForm, val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  const setMed = (i: number, field: keyof Medication, val: string) =>
    setForm((f) => {
      const meds = [...f.medications];
      meds[i] = { ...meds[i], [field]: val };
      return { ...f, medications: meds };
    });

  const addMed = () =>
    setForm((f) => ({ ...f, medications: [...f.medications, emptyMed()] }));

  const removeMed = (i: number) =>
    setForm((f) => ({
      ...f,
      medications: f.medications.filter((_, idx) => idx !== i),
    }));

  const handlePreview = () => {
    if (!form.name.trim() || !form.age) {
      setError("Patient name and age are required.");
      return;
    }
    setError("");
    setStep("preview");
  };

  const handleSaveAndPrint = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: parseInt(form.age),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to save");

      setSavedPatient({ ...form, mrNumber: json.data.mrNumber, visitDate: json.data.visitDate });
      setTimeout(() => window.print(), 200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handlePrintOnly = () => {
    if (!savedPatient) return;
    window.print();
  };

  const handleNew = () => {
    setForm(initialForm);
    setSavedPatient(null);
    setStep("form");
    setError("");
  };

  // ── PREVIEW STEP ──
  if (step === "preview") {
    const displayPatient = savedPatient ?? {
      ...form,
      age: parseInt(form.age) || 0,
      mrNumber: "PREVIEW",
      visitDate: new Date(),
    };

    return (
      <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
        {/* Toolbar */}
        <div
          className="no-print"
          style={{
            background: "#1a3a6b",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setStep("form")}
            style={btnStyle("ghost")}
          >
            ← Back to Form
          </button>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
            Siddique Medical Complex
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            {!savedPatient ? (
              <button
                onClick={handleSaveAndPrint}
                disabled={saving}
                style={btnStyle("primary")}
              >
                {saving ? "Saving…" : "💾 Save & Print"}
              </button>
            ) : (
              <>
                <button onClick={handlePrintOnly} style={btnStyle("primary")}>
                  🖨️ Print Again
                </button>
                <button onClick={handleNew} style={btnStyle("success")}>
                  + New Patient
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="no-print" style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 24px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {savedPatient && (
          <div className="no-print" style={{ background: "#dcfce7", color: "#166534", padding: "10px 24px", fontSize: "14px" }}>
            ✓ Saved — MR# {savedPatient.mrNumber}
          </div>
        )}

        {/* Print preview */}
        <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px" }}>
          <div
            ref={printRef}
            style={{
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <PrintSlip patient={displayPatient as Parameters<typeof PrintSlip>[0]["patient"]} />
          </div>
        </div>
      </div>
    );
  }

  // ── FORM STEP ──
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
      {/* Top nav */}
      <div style={{
        background: "#1a3a6b",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px" }}>
          ← Home
        </Link>
        <h1 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "700" }}>
          New Patient Registration
        </h1>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 16px" }}>
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* Patient Info */}
        <Card title="Patient Information">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            <div style={{ gridColumn: "1 / 3" }}>
              <Label>Full Name *</Label>
              <Input
                value={form.name}
                onChange={(v) => set("name", v)}
                placeholder="e.g. Ahmed Khan"
              />
            </div>
            <div>
              <Label>Age (years) *</Label>
              <Input
                type="number"
                value={form.age}
                onChange={(v) => set("age", v)}
                placeholder="e.g. 7"
              />
            </div>
            <div>
              <Label>Gender</Label>
              <select
                value={form.gender}
                onChange={(e) => set("gender", e.target.value)}
                style={inputStyle}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Clinical */}
        <Card title="Clinical Details">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <Label>Complaint</Label>
              <Textarea
                value={form.complaint}
                onChange={(v) => set("complaint", v)}
                placeholder="e.g. Fever, cough, runny nose for 3 days"
              />
            </div>
            <div>
              <Label>Clinical Examination</Label>
              <Textarea
                value={form.clinicalExamination}
                onChange={(v) => set("clinicalExamination", v)}
                placeholder="e.g. Throat congested, bilateral cervical lymphadenopathy"
              />
            </div>
            <div>
              <Label>Diagnosis</Label>
              <Textarea
                value={form.diagnosis}
                onChange={(v) => set("diagnosis", v)}
                placeholder="e.g. Acute Pharyngotonsillitis"
              />
            </div>
            <div>
              <Label>Investigation</Label>
              <Textarea
                value={form.investigation}
                onChange={(v) => set("investigation", v)}
                placeholder="e.g. CBC — TLC 11,000 with left shift. CRP elevated."
              />
            </div>
          </div>
        </Card>

        {/* Medications */}
        <Card title="Medications">
          {form.medications.map((med, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #c8d8f0",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "12px",
                background: "#f8faff",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontWeight: "600", color: "#1a3a6b", fontSize: "14px" }}>
                  Medicine {i + 1}
                </span>
                {form.medications.length > 1 && (
                  <button
                    onClick={() => removeMed(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc2626",
                      cursor: "pointer",
                      fontSize: "13px",
                      padding: "2px 6px",
                    }}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <Label>Drug Name</Label>
                  <Input value={med.drug} onChange={(v) => setMed(i, "drug", v)} placeholder="e.g. Tab. Augmentin 625mg" />
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Input value={med.frequency} onChange={(v) => setMed(i, "frequency", v)} placeholder="e.g. Twice a day" />
                </div>
                <div>
                  <Label>Dosage</Label>
                  <Input value={med.dosage} onChange={(v) => setMed(i, "dosage", v)} placeholder="e.g. 1 tablet" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                <div>
                  <Label>Duration</Label>
                  <Input value={med.duration} onChange={(v) => setMed(i, "duration", v)} placeholder="e.g. 7 days" />
                </div>
                <div>
                  <Label>Instruction</Label>
                  <Input value={med.instruction} onChange={(v) => setMed(i, "instruction", v)} placeholder="e.g. After meal" />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addMed}
            style={{
              border: "2px dashed #2b5199",
              borderRadius: "8px",
              padding: "10px",
              width: "100%",
              background: "transparent",
              color: "#2b5199",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + Add Medicine
          </button>
        </Card>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button style={btnStyle("ghost-dark")}>Cancel</button>
          </Link>
          <button onClick={handlePreview} style={btnStyle("navy")}>
            Preview & Print →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Small sub-components ──

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "20px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    }}>
      <h3 style={{ margin: "0 0 20px", color: "#1a3a6b", fontSize: "16px", fontWeight: "700", borderBottom: "2px solid #e8f0fb", paddingBottom: "10px" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #c8d8f0",
  borderRadius: "7px",
  fontSize: "14px",
  outline: "none",
  background: "white",
  color: "#1a1a2e",
  transition: "border-color 0.15s",
};

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
    />
  );
}

function Textarea({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
    />
  );
}

function btnStyle(variant: "primary" | "ghost" | "ghost-dark" | "navy" | "success"): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: "9px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    border: "none",
    transition: "opacity 0.15s",
  };
  if (variant === "primary") return { ...base, background: "#ffffff", color: "#1a3a6b" };
  if (variant === "ghost") return { ...base, background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.3)" };
  if (variant === "ghost-dark") return { ...base, background: "white", color: "#6b7280", border: "1.5px solid #d1d5db" };
  if (variant === "navy") return { ...base, background: "#1a3a6b", color: "white" };
  if (variant === "success") return { ...base, background: "#16a34a", color: "white" };
  return base;
}
