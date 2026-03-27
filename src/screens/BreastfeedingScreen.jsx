import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const sections = [
  {
    icon: "🤱", title: "Correct Feeding Positions", accent: "#EC4899",
    items: [
      "Cradle hold — baby's head in crook of your arm",
      "Cross-cradle hold — good for newborns",
      "Football hold — good after C-section",
      "Side-lying position — for night feeds",
      "Baby's tummy should face your tummy",
      "Ensure baby's mouth covers the areola, not just nipple",
    ],
  },
  {
    icon: "⏰", title: "How Often to Feed", accent: "#F59E0B",
    items: [
      "Newborn: every 2–3 hours (8–12 times/day)",
      "Feed on demand — watch for hunger cues",
      "Hunger cues: rooting, sucking fingers, crying",
      "Each feed: 10–20 minutes per breast",
      "Let baby finish one breast before switching",
      "Night feeds are important for milk supply",
    ],
  },
  {
    icon: "🥗", title: "Mother's Diet & Recovery", accent: "#3CC98A",
    items: [
      "Drink plenty of water (8–10 glasses/day)",
      "Eat iron-rich foods: spinach, lentils, eggs",
      "Include calcium: milk, curd, ragi",
      "Eat galactagogues: fenugreek, oats, garlic",
      "Avoid alcohol, smoking, excess caffeine",
      "Rest whenever baby sleeps",
      "Gentle walks after 2–4 weeks post-delivery",
    ],
  },
  {
    icon: "💊", title: "Common Issues & Solutions", accent: "#6C63FF",
    items: [
      "Sore nipples — check latch, use lanolin cream",
      "Engorgement — feed frequently, warm compress",
      "Low milk supply — feed more often, stay hydrated",
      "Mastitis — continue feeding, see doctor if fever",
      "Baby not latching — consult lactation expert",
    ],
  },
];

function Section({ s, index }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div style={{
      background: `${s.accent}10`, border: `1px solid ${s.accent}${open ? "45" : "25"}`,
      borderRadius: "20px", overflow: "hidden", transition: "all 0.3s ease",
      boxShadow: open ? `0 8px 28px ${s.accent}20` : "none",
    }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "26px" }}>{s.icon}</span>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>{s.title}</p>
        </div>
        <span style={{ color: s.accent, fontSize: "16px", transition: "transform 0.3s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: "0 20px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ height: "1px", background: `${s.accent}25`, marginBottom: "8px" }} />
          {s.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: s.accent, flexShrink: 0, marginTop: "2px" }}>✦</span>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BreastfeedingScreen() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={{ ...styles.header, background: "linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)" }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>🤱</div>
        <h1 style={styles.headerTitle}>Breastfeeding & Mother Care</h1>
        <p style={styles.headerSub}>Guide for feeding & recovery</p>
        <div style={styles.headerGlow} />
      </div>
      <div style={styles.body}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sections.map((s, i) => <Section key={s.title} s={s} index={i} />)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(236,72,153,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "28px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
};
