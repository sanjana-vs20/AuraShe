import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const signs = [
  { icon: "💨", text: "Fast or difficult breathing" },
  { icon: "🌡️", text: "High fever (above 100.4°F / 38°C)" },
  { icon: "🍼", text: "Not feeding / refusing milk" },
  { icon: "😴", text: "Unusually drowsy or hard to wake" },
  { icon: "💙", text: "Bluish lips or fingertips" },
  { icon: "🤮", text: "Persistent vomiting" },
  { icon: "💧", text: "Sunken fontanelle (soft spot)" },
  { icon: "😭", text: "High-pitched or weak cry" },
  { icon: "🫀", text: "Fits / seizures / body stiffness" },
  { icon: "🩸", text: "Blood in stool or urine" },
];

export default function EmergencySignsScreen() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(false);

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={{ ...styles.header, background: "linear-gradient(135deg, #FF3B3B 0%, #FF5C8A 100%)" }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>🚨</div>
        <h1 style={styles.headerTitle}>Emergency Warning Signs</h1>
        <p style={styles.headerSub}>Know when to act immediately</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        {/* One-tap emergency button */}
        <button
          onClick={() => setAlert(a => !a)}
          style={{
            width: "100%", padding: "20px", borderRadius: "20px", marginBottom: "24px",
            background: alert ? "rgba(255,59,59,0.25)" : "rgba(255,59,59,0.15)",
            border: `2px solid ${alert ? "#FF3B3B" : "rgba(255,59,59,0.4)"}`,
            color: "#FF3B3B", fontSize: "18px", fontWeight: "800", cursor: "pointer",
            boxShadow: alert ? "0 0 32px rgba(255,59,59,0.5)" : "0 4px 20px rgba(255,59,59,0.2)",
            transition: "all 0.3s ease", letterSpacing: "0.3px",
          }}
        >
          🚨 Is this serious?
        </button>

        {alert && (
          <div style={{
            background: "rgba(255,59,59,0.15)", border: "2px solid rgba(255,59,59,0.5)",
            borderRadius: "20px", padding: "20px 24px", marginBottom: "24px",
            boxShadow: "0 8px 32px rgba(255,59,59,0.3)",
          }}>
            <p style={{ fontSize: "18px", fontWeight: "800", color: "#FF3B3B", marginBottom: "8px" }}>⚠️ Go to hospital immediately!</p>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>
              If your baby shows any of the signs below, do not wait. Rush to the nearest government hospital or emergency room right away.
            </p>
          </div>
        )}

        <p style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px" }}>Danger Signs</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {signs.map((s, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "14px",
              background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.2)",
              borderRadius: "16px", padding: "14px 18px",
            }}>
              <span style={{ fontSize: "24px", flexShrink: 0 }}>{s.icon}</span>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", fontWeight: "500" }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,59,59,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,138,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(255,59,59,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
};
