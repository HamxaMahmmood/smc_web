"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SearchableSelect from "@/components/SearchableSelect";

interface MedicineRecord {
  _id?: string;
  generic: string;
  brands: string[];
  packages: string[]; 
}

export default function AddMedicinePage() {
  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
  const [generic, setGeneric] = useState("");
  const [brand, setBrand] = useState("");
  const [pkg, setPkg] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMedicines = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/medicines");
      const json = await res.json();
      if (json.success) setMedicines(json.data);
    } catch {
      // ignore
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const existingGeneric = medicines.find(
    (m) => m.generic.toLowerCase() === generic.trim().toLowerCase()
  );

  const handleAdd = async () => {
    setError("");
    setSuccess("");
    if (!generic.trim()) {
      setError("Generic name is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generic: generic.trim(), brand: brand.trim(), package: pkg.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to add medicine");

      setSuccess(
        brand.trim()
          ? `Saved "${brand.trim()}" under ${generic.trim()}.`
          : `Saved generic "${generic.trim()}".`
      );
      setGeneric(generic.trim());
      setBrand("");
      setPkg("");
      await loadMedicines();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
const handleDeleteBrand = async (generic: string, brand: string) => {
  setError("");
  setSuccess("");
  try {
    const res = await fetch(
      `/api/medicines?generic=${encodeURIComponent(generic)}&brand=${encodeURIComponent(brand)}`,
      { method: "DELETE" }
    );
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to delete");
    setSuccess(`Removed "${brand}" from ${generic}.`);
    await loadMedicines();
  } catch (e: unknown) {
    setError(e instanceof Error ? e.message : "Something went wrong");
  }
};

const handleDeletePackage = async (generic: string, pkg: string) => {
  setError("");
  setSuccess("");
  try {
    const res = await fetch(
      `/api/medicines?generic=${encodeURIComponent(generic)}&package=${encodeURIComponent(pkg)}`,
      { method: "DELETE" }
    );
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to delete");
    setSuccess(`Removed "${pkg}" from ${generic}.`);
    await loadMedicines();
  } catch (e: unknown) {
    setError(e instanceof Error ? e.message : "Something went wrong");
  }
};
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fa" }}>
      <div style={{ background: "#1a3a6b", padding: "14px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px" }}>← Home</Link>
        <h1 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "700" }}>Add Medicine</h1>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 16px" }}>
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
            ✓ {success}
          </div>
        )}

        <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          <h3 style={{ margin: "0 0 18px", color: "#1a3a6b", fontSize: "15px", fontWeight: "700", borderBottom: "2px solid #e8f0fb", paddingBottom: "10px" }}>
            💊 New Generic / Brand
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "8px" }}>
            <div>
              <label style={labelSt}>Generic Name *</label>
              <SearchableSelect
                options={medicines.map((m) => m.generic)}
                value={generic}
                onChange={setGeneric}
                placeholder="e.g. Amoxicillin"
              />
            </div>
            <div>
              <label style={labelSt}>Pakistani Brand Name</label>
              <SearchableSelect
                options={existingGeneric?.brands || []}
                value={brand}
                onChange={setBrand}
                placeholder="e.g. Amoxil"
              />
            </div>
            <div>
              <label style={labelSt}>Package / Strength</label>
              <SearchableSelect
                options={existingGeneric?.packages || []}
                value={pkg}
                onChange={setPkg}
                placeholder="e.g. 125mg/5ml Syrup"
              />
            </div>
          </div>

          {existingGeneric && (
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "6px 0 14px" }}>
              {existingGeneric.brands.length > 0
                ? `Existing brands for ${existingGeneric.generic}: ${existingGeneric.brands.join(", ")}`
                : `${existingGeneric.generic} exists but has no brands yet.`}
            </p>
          )}
          {!existingGeneric && generic.trim() && (
            <p style={{ fontSize: "12px", color: "#1a3a6b", margin: "6px 0 14px" }}>
              This will be added as a new generic medicine.
            </p>
          )}

          <button onClick={handleAdd} disabled={loading} style={addBtn}>
            {loading ? "Saving…" : "+ Add to Database"}
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
          <h3 style={{ margin: "0 0 18px", color: "#1a3a6b", fontSize: "15px", fontWeight: "700", borderBottom: "2px solid #e8f0fb", paddingBottom: "10px" }}>
            📋 Medicine Database {fetching && <span style={{ fontWeight: 400, fontSize: "12px", color: "#9ca3af" }}>(loading…)</span>}
          </h3>
          {medicines.length === 0 && !fetching && (
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>No medicines added yet.</p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {medicines.map((m) => (
              <div key={m.generic} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px 14px" }}>
                <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#1a1a2e" }}>{m.generic}</div>
                <div style={{ marginTop: "5px" }}>
  {m.brands.length > 0 ? (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {m.brands.map((brand) => (
        <span
          key={brand}
          style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            background: "#f0f4fa", border: "1px solid #c8d8f0",
            padding: "2px 6px 2px 10px", borderRadius: "12px",
            fontSize: "12px", color: "#374151",
          }}
        >
          {brand}
          <button
            onClick={() => handleDeleteBrand(m.generic, brand)}
            title={`Remove ${brand}`}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#dc2626", fontSize: "15px", fontWeight: "700",
              lineHeight: 1, padding: "0 2px",
            }}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  
    
  ) : (
    <span style={{ fontSize: "12.5px", color: "#9ca3af" }}>No brands yet</span>
  )}
</div>

{/* Packages */}
                {m.packages && m.packages.length > 0 && (
                  <div style={{ marginTop: "6px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      Strengths / Packages
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {m.packages.map((p) => (
                        <span
                          key={p}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            background: "#f0fdf4", border: "1px solid #bbf7d0",
                            padding: "2px 6px 2px 10px", borderRadius: "12px",
                            fontSize: "12px", color: "#166534",
                          }}
                        >
                          {p}
                          <button
                            onClick={() => handleDeletePackage(m.generic, p)}
                            title={`Remove ${p}`}
                            style={{
                              background: "none", border: "none", cursor: "pointer",
                              color: "#dc2626", fontSize: "15px", fontWeight: "700",
                              lineHeight: 1, padding: "0 2px",
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );
}

const labelSt: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: "700", color: "#374151",
  marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em",
};

const addBtn: React.CSSProperties = {
  padding: "10px 22px", borderRadius: "8px", fontWeight: "600", fontSize: "14px",
  cursor: "pointer", border: "none", background: "#1a3a6b", color: "white",
};