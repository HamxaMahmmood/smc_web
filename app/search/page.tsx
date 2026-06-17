"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import PrintSlip from "@/components/PrintSlip";

interface Medication {
  drug: string;
  frequency: string;
  dosage: string;
  duration: string;
  instruction: string;
}

interface Patient {
  _id: string;
  name: string;
  gender: string;
  age: number;
  mrNumber: string;
  complaint: string;
  clinicalExamination: string;
  diagnosis: string;
  investigation: string;
  medications: Medication[];
  visitDate: string;
  createdAt: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.data || []);
      setSearched(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 400);
  };

  const handlePrint = () => window.print();

  // Detail view
  if (selected) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
        <div
          className="no-print"
          style={{
            background: "#1a3a6b",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setSelected(null)}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              borderRadius: "7px",
              padding: "7px 16px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            ← Back to Search
          </button>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", flex: 1 }}>
            {selected.name} — MR# {selected.mrNumber}
          </span>
          <button
            onClick={handlePrint}
            style={{
              background: "#ffffff",
              border: "none",
              color: "#1a3a6b",
              borderRadius: "7px",
              padding: "7px 18px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            🖨️ Print
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px" }}>
          <div style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)", borderRadius: "4px", overflow: "hidden" }}>
            <PrintSlip patient={selected} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
      {/* Nav */}
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
          Search Patient Records
        </h1>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 16px" }}>
        {/* Search box */}
        <div style={{
          background: "white",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "18px",
              pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search by name, MR number, or diagnosis…"
              autoFocus
              style={{
                width: "100%",
                padding: "13px 16px 13px 46px",
                border: "2px solid #c8d8f0",
                borderRadius: "10px",
                fontSize: "16px",
                outline: "none",
                color: "#1a1a2e",
                transition: "border-color 0.15s",
              }}
            />
          </div>
          <p style={{ margin: "10px 0 0", fontSize: "12px", color: "#9ca3af" }}>
            Results update as you type. Search is case-insensitive.
          </p>
        </div>

        {/* Results */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", fontSize: "15px" }}>
            Searching…
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "48px",
            textAlign: "center",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📂</div>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "15px" }}>
              No records found for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
              {results.length} record{results.length !== 1 ? "s" : ""} found
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {results.map((p) => (
                <div
                  key={p._id}
                  onClick={() => setSelected(p)}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "18px 20px",
                    cursor: "pointer",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                    border: "1.5px solid transparent",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "#2b5199";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 6px rgba(0,0,0,0.07)";
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: "700", fontSize: "15px", color: "#1a1a2e" }}>
                      {p.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                      {p.gender} · {p.age}Y ·{" "}
                      {p.diagnosis || <em>No diagnosis recorded</em>}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ margin: "0 0 3px", fontWeight: "700", fontSize: "13px", color: "#1a3a6b" }}>
                      MR# {p.mrNumber}
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                      {new Date(p.visitDate || p.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!searched && !loading && (
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "48px",
            textAlign: "center",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗂️</div>
            <p style={{ color: "#6b7280", margin: 0, fontSize: "15px" }}>
              Type a name, MR number, or diagnosis to start searching.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
