"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
const handleLogout = async () => {
  await fetch("/api/logout", { method: "POST" });
  router.push("/login");
};
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2447 0%, #1a3a6b 60%, #2b5199 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      {/* Logo / Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          border: "2px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          fontSize: "32px",
        }}>
          🏥
        </div>
        <h1 style={{
          color: "#ffffff",
          fontSize: "clamp(24px, 5vw, 38px)",
          fontWeight: "800",
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
        }}>
          Welcome Dr. Zahid Mahmood
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", margin: 0 }}>
          MBBS, FCPS · Consultant Paediatrician
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
        width: "100%",
        maxWidth: "600px",
      }}>
        <Link href="/new-patient" style={{ textDecoration: "none" }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "32px 28px",
            cursor: "pointer",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 14px 40px rgba(0,0,0,0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
            <h2 style={{ margin: "0 0 8px", color: "#1a3a6b", fontSize: "20px", fontWeight: "700" }}>
              New Patient
            </h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
              Register a new patient, fill the prescription, and print the slip.
            </p>
          </div>
        </Link>

        <Link href="/search" style={{ textDecoration: "none" }}>
          <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "32px 28px",
            cursor: "pointer",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 14px 40px rgba(0,0,0,0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
            <h2 style={{ margin: "0 0 8px", color: "#1a3a6b", fontSize: "20px", fontWeight: "700" }}>
              Search Records
            </h2>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
              Look up existing patients by name, MR number, or diagnosis.
            </p>
          </div>
        </Link>
        <Link href="/add-medicine" style={{ textDecoration: "none" }}>
  <div style={{
    background: "#ffffff",
    borderRadius: "16px",
    padding: "32px 28px",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
  }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 14px 40px rgba(0,0,0,0.28)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)";
    }}
  >
    <div style={{ fontSize: "36px", marginBottom: "12px" }}>💊</div>
    <h2 style={{ margin: "0 0 8px", color: "#1a3a6b", fontSize: "20px", fontWeight: "700" }}>
      Add Medicine
    </h2>
    <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
      Add a new generic medicine or a Pakistani brand name to the database.
    </p>
  </div>
</Link>
{/* add this anywhere in the JSX, e.g. just before the closing </div> at the bottom */}

      </div>

      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginTop: "48px" }}>
      </p>
      <button
  onClick={handleLogout}
  style={{
    marginTop: "32px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "rgba(255,255,255,0.75)",
    padding: "8px 18px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
  }}
>
  Logout
</button>
    </div>
  );
}
