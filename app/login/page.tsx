"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Incorrect password");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2447 0%, #1a3a6b 60%, #2b5199 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "40px 36px",
        width: "100%",
        maxWidth: "380px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#e8f0fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "28px",
          }}>
            🏥
          </div>
          <h1 style={{ margin: "0 0 6px", color: "#1a3a6b", fontSize: "20px", fontWeight: "700" }}>
            Dr. Zahid Mahmood
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "13.5px" }}>
            Enter password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1.5px solid #c8d8f0",
              borderRadius: "8px",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "14px",
              color: "#1a1a2e",
            }}
          />
          {error && (
            <div style={{
              background: "#fee2e2",
              color: "#dc2626",
              padding: "10px 12px",
              borderRadius: "7px",
              fontSize: "13px",
              marginBottom: "14px",
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: loading || !password ? "#9ca3af" : "#1a3a6b",
              color: "white",
              fontWeight: "600",
              fontSize: "15px",
              cursor: loading || !password ? "default" : "pointer",
            }}
          >
            {loading ? "Checking…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}