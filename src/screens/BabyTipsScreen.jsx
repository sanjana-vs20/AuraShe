import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const tips = [
  {
    icon: "☀️",
    title: "Morning Sunlight (Sun Bath)",
    accent: "#F59E0B",
    points: [
      "Give 5–15 minutes of early morning sunlight (before 9 AM)",
      "Helps in Vitamin D → strong bones",
      "Keep baby lightly clothed",
    ],
    warning: "Avoid harsh sunlight",
  },
  {
    icon: "🧴",
    title: "Oil Massage (Oiling)",
    accent: "#FF9A5C",
    points: [
      "Use coconut oil / baby oil",
      "Massage gently before bath",
      "Better sleep 😴, strong muscles 💪, improves bonding ❤️",
    ],
    warning: "Don't press too hard",
  },
  {
    icon: "🛁",
    title: "Daily Bathing",
    accent: "#6C63FF",
    points: [
      "Use lukewarm water",
      "Bathe once daily",
      "Clean folds (neck, thighs)",
      "Dry properly to avoid rashes",
    ],
    warning: "Avoid very hot water",
  },
  {
    icon: "👶",
    title: "Clean Cord Care (Newborn)",
    accent: "#3CC98A",
    points: [
      "Keep umbilical cord clean & dry",
      "No oil or powder on cord",
      "Falls off in 1–2 weeks",
    ],
    warning: null,
  },
  {
    icon: "🧼",
    title: "Hygiene & Cleanliness",
    accent: "#FF5C8A",
    points: [
      "Wash hands before touching baby",
      "Keep clothes & bedding clean",
      "Use mosquito net 🦟",
    ],
    warning: null,
  },
  {
    icon: "🍼",
    title: "Feeding Tips",
    accent: "#F59E0B",
    points: [
      "Feed every 2–3 hours",
      "Burp baby after feeding",
      "Watch for hunger signs (crying, sucking fingers)",
    ],
    warning: null,
  },
  {
    icon: "😴",
    title: "Sleep Care",
    accent: "#6C63FF",
    points: [
      "Always make baby sleep on back",
      "Use firm mattress",
      "Avoid pillows for newborn",
    ],
    warning: null,
  },
  {
    icon: "👕",
    title: "Dressing the Baby",
    accent: "#FF9A5C",
    points: [
      "Dress according to weather 🌡️",
      "Use soft cotton clothes",
      "Not too tight or too loose",
    ],
    warning: null,
  },
  {
    icon: "💩",
    title: "Diaper & Skin Care",
    accent: "#3CC98A",
    points: [
      "Change diaper frequently",
      "Keep area dry",
      "Give diaper-free time",
    ],
    warning: null,
  },
  {
    icon: "❤️",
    title: "Talk & Bond with Baby",
    accent: "#FF5C8A",
    points: [
      "Talk, sing, smile 😊",
      "Helps brain development",
      "Builds emotional bonding",
    ],
    warning: null,
  },
];

export default function BabyTipsScreen() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const tip = tips[active];

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={{ ...styles.header, background: "linear-gradient(135deg, #6C63FF 0%, #FF5C8A 100%)" }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>💡</div>
        <h1 style={styles.headerTitle}>Baby Care Tips</h1>
        <p style={styles.headerSub}>Essential tips for your newborn's health</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        {/* Horizontal pill selector */}
        <div style={styles.pillRow}>
          {tips.map((t, i) => (
            <button
              key={t.title}
              onClick={() => setActive(i)}
              style={{
                ...styles.pill,
                background: active === i ? t.accent : "rgba(255,255,255,0.07)",
                border: `1px solid ${active === i ? t.accent : "rgba(255,255,255,0.12)"}`,
                color: active === i ? "#fff" : "rgba(255,255,255,0.5)",
                boxShadow: active === i ? `0 4px 16px ${t.accent}55` : "none",
                transform: active === i ? "scale(1.08)" : "scale(1)",
              }}
            >
              {t.icon}
            </button>
          ))}
        </div>

        {/* Active tip card */}
        <div style={{
          background: `${tip.accent}12`,
          border: `1px solid ${tip.accent}45`,
          borderRadius: "24px",
          padding: "28px 24px",
          boxShadow: `0 16px 48px ${tip.accent}25`,
          backdropFilter: "blur(20px)",
          transition: "all 0.3s ease",
        }}>
          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "22px", flexShrink: 0,
              background: `${tip.accent}25`, border: `1px solid ${tip.accent}50`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px",
              boxShadow: `0 6px 20px ${tip.accent}35`,
            }}>
              {tip.icon}
            </div>
            <div>
              <p style={{ fontSize: "11px", color: tip.accent, fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>Tip {active + 1} of {tips.length}</p>
              <p style={{ fontSize: "17px", fontWeight: "800", color: "#fff", lineHeight: "1.3" }}>{tip.title}</p>
            </div>
          </div>

          {/* Points */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: tip.warning ? "16px" : 0 }}>
            {tip.points.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start",
                background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "12px 14px" }}>
                <span style={{ color: tip.accent, fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>✦</span>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: "1.6" }}>{p}</p>
              </div>
            ))}
          </div>

          {/* Warning */}
          {tip.warning && (
            <div style={{
              display: "flex", gap: "10px", alignItems: "flex-start",
              background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.3)",
              borderRadius: "12px", padding: "12px 14px",
            }}>
              <span style={{ fontSize: "15px", flexShrink: 0 }}>❌</span>
              <p style={{ fontSize: "13px", color: "#ff8080", lineHeight: "1.5" }}>{tip.warning}</p>
            </div>
          )}
        </div>

        {/* Prev / Next navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", gap: "12px" }}>
          <button
            onClick={() => setActive(a => Math.max(0, a - 1))}
            disabled={active === 0}
            style={{
              ...styles.navBtn,
              opacity: active === 0 ? 0.3 : 1,
              background: `${tip.accent}22`,
              border: `1px solid ${tip.accent}40`,
              color: tip.accent,
            }}
          >← Prev</button>
          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", alignSelf: "center" }}>{active + 1} / {tips.length}</span>
          <button
            onClick={() => setActive(a => Math.min(tips.length - 1, a + 1))}
            disabled={active === tips.length - 1}
            style={{
              ...styles.navBtn,
              opacity: active === tips.length - 1 ? 0.3 : 1,
              background: `${tip.accent}22`,
              border: `1px solid ${tip.accent}40`,
              color: tip.accent,
            }}
          >Next →</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,138,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(108,99,255,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
  pillRow: { display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "16px", marginBottom: "8px", scrollbarWidth: "none", msOverflowStyle: "none" },
  pill: { width: "62px", height: "62px", borderRadius: "18px", fontSize: "30px", cursor: "pointer", flexShrink: 0, transition: "all 0.25s ease", display: "flex", alignItems: "center", justifyContent: "center" },
  navBtn: { flex: 1, padding: "12px", borderRadius: "14px", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s ease" },
};
