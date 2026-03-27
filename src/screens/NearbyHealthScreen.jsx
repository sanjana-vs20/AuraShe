import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const facilities = [
  { type: "PHC", name: "Primary Health Centre", icon: "🏥", accent: "#3B82F6", distance: "1.2 km", phone: "104" },
  { type: "Hospital", name: "Government District Hospital", icon: "🏨", accent: "#6C63FF", distance: "3.5 km", phone: "108" },
  { type: "Anganwadi", name: "Anganwadi Centre", icon: "👶", accent: "#3CC98A", distance: "0.6 km", phone: "1800-180-1104" },
  { type: "Ambulance", name: "Emergency Ambulance", icon: "🚑", accent: "#FF3B3B", distance: "—", phone: "108" },
  { type: "Health Helpline", name: "National Health Helpline", icon: "📞", accent: "#F59E0B", distance: "—", phone: "1800-180-1104" },
];

export default function NearbyHealthScreen() {
  const navigate = useNavigate();
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);

  function handleLocate() {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      () => { setLocating(false); setLocated(true); },
      () => { setLocating(false); setLocated(true); }
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={{ ...styles.header, background: "linear-gradient(135deg, #3B82F6 0%, #6C63FF 100%)" }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>📍</div>
        <h1 style={styles.headerTitle}>Nearby Health Services</h1>
        <p style={styles.headerSub}>Find PHC, hospitals & Anganwadi near you</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        <button onClick={handleLocate} style={{
          width: "100%", padding: "16px", borderRadius: "16px", marginBottom: "24px",
          background: located ? "rgba(60,201,138,0.15)" : "rgba(59,130,246,0.15)",
          border: `1px solid ${located ? "rgba(60,201,138,0.4)" : "rgba(59,130,246,0.4)"}`,
          color: located ? "#6ee7b7" : "#93c5fd", fontSize: "14px", fontWeight: "700",
          cursor: "pointer", transition: "all 0.3s ease",
        }}>
          {locating ? "📡 Locating..." : located ? "✅ Location found" : "📍 Use my location"}
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {facilities.map((f, i) => (
            <div key={i} style={{
              background: `${f.accent}10`, border: `1px solid ${f.accent}30`,
              borderRadius: "20px", padding: "18px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: `0 4px 16px ${f.accent}15`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "50px", height: "50px", borderRadius: "16px", flexShrink: 0,
                  background: `${f.accent}20`, border: `1px solid ${f.accent}40`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px",
                }}>{f.icon}</div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "800", color: "#fff", marginBottom: "3px" }}>{f.name}</p>
                  <p style={{ fontSize: "11px", color: f.accent, fontWeight: "600" }}>{f.distance !== "—" ? `📏 ${f.distance}` : f.type}</p>
                </div>
              </div>
              <a href={`tel:${f.phone}`} style={{
                background: f.accent, border: "none", color: "#fff",
                fontSize: "12px", fontWeight: "700", padding: "8px 14px",
                borderRadius: "100px", cursor: "pointer", textDecoration: "none",
                boxShadow: `0 4px 12px ${f.accent}50`, whiteSpace: "nowrap",
              }}>📞 {f.phone}</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(59,130,246,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
};
