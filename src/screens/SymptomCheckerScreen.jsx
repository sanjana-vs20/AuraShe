import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const symptoms = ["Fever", "Cough", "Loose Motion", "Crying", "Vomiting", "Rash", "Not Feeding", "Fast Breathing"];

const rules = [
  { match: ["Fast Breathing", "Not Feeding"], level: "emergency", advice: "Go to hospital immediately! These are danger signs." },
  { match: ["Fever", "Not Feeding"], level: "emergency", advice: "High fever with not feeding — visit emergency now." },
  { match: ["Fever", "Fast Breathing"], level: "emergency", advice: "Fever with fast breathing — go to hospital immediately." },
  { match: ["Fever", "Cough", "Loose Motion"], level: "doctor", advice: "Multiple symptoms — visit a doctor today." },
  { match: ["Fever", "Vomiting"], level: "doctor", advice: "Fever with vomiting — consult a doctor soon." },
  { match: ["Loose Motion", "Vomiting"], level: "doctor", advice: "Risk of dehydration — see a doctor." },
  { match: ["Fever"], level: "home", advice: "Mild fever — sponge with lukewarm water, monitor temperature. Visit doctor if fever exceeds 100.4°F." },
  { match: ["Cough"], level: "home", advice: "Mild cough — keep baby upright, ensure hydration. Monitor for 2 days." },
  { match: ["Loose Motion"], level: "home", advice: "Give ORS, continue breastfeeding. Visit doctor if more than 5 times/day." },
  { match: ["Crying"], level: "home", advice: "Check for hunger, wet diaper, or discomfort. Try feeding or gentle rocking." },
  { match: ["Rash"], level: "doctor", advice: "Rash needs examination — visit a doctor." },
  { match: ["Vomiting"], level: "home", advice: "Keep baby upright after feeding. If persistent, see a doctor." },
];

const levelConfig = {
  home:      { icon: "✅", label: "Home Care",  color: "#3CC98A", bg: "rgba(60,201,138,0.12)",  border: "rgba(60,201,138,0.4)" },
  doctor:    { icon: "⚠️", label: "Visit Doctor", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)" },
  emergency: { icon: "🚨", label: "Emergency!",  color: "#FF3B3B", bg: "rgba(255,59,59,0.15)",  border: "rgba(255,59,59,0.5)" },
};

function getResult(selected) {
  if (selected.length === 0) return null;
  for (const rule of rules) {
    if (rule.match.every(s => selected.includes(s))) return { ...levelConfig[rule.level], advice: rule.advice };
  }
  // single symptom fallback
  for (const rule of rules) {
    if (rule.match.length === 1 && selected.includes(rule.match[0])) return { ...levelConfig[rule.level], advice: rule.advice };
  }
  return { ...levelConfig.home, advice: "Monitor your baby closely. If symptoms worsen, consult a doctor." };
}

export default function SymptomCheckerScreen() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  function toggle(s) {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  const result = getResult(selected);

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={{ ...styles.header, background: "linear-gradient(135deg, #FF5C8A 0%, #FF9A5C 100%)" }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>🩺</div>
        <h1 style={styles.headerTitle}>Symptom Checker</h1>
        <p style={styles.headerSub}>Select symptoms to get advice</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
          {symptoms.map(s => {
            const active = selected.includes(s);
            return (
              <button key={s} onClick={() => toggle(s)} style={{
                padding: "10px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
                background: active ? "#FF5C8A" : "rgba(255,255,255,0.07)",
                border: `1px solid ${active ? "#FF5C8A" : "rgba(255,255,255,0.15)"}`,
                color: active ? "#fff" : "rgba(255,255,255,0.6)",
                boxShadow: active ? "0 4px 16px rgba(255,92,138,0.4)" : "none",
                transition: "all 0.2s ease",
                transform: active ? "scale(1.05)" : "scale(1)",
              }}>{s}</button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <button onClick={() => setSelected([])} style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.5)", fontSize: "12px", padding: "6px 16px",
            borderRadius: "100px", cursor: "pointer", marginBottom: "20px",
          }}>✕ Clear all</button>
        )}

        {result && (
          <div style={{
            background: result.bg, border: `1px solid ${result.border}`,
            borderRadius: "24px", padding: "28px 24px",
            boxShadow: `0 16px 48px ${result.color}25`, backdropFilter: "blur(20px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
              <span style={{ fontSize: "40px" }}>{result.icon}</span>
              <p style={{ fontSize: "20px", fontWeight: "800", color: result.color }}>{result.label}</p>
            </div>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.85)", lineHeight: "1.7" }}>{result.advice}</p>
          </div>
        )}

        {selected.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "32px" }}>
            👆 Tap symptoms above to get advice
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,138,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,154,92,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(255,92,138,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
};
