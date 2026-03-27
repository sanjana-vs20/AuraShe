import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const tiles = [
  { emoji: "📍", label: "Nearby Health",          accent: "#3B82F6", path: "/nearby-health" },
  { emoji: "💉", label: "Vaccinations",            accent: "#3CC98A", path: "/vaccinations" },
  { emoji: "📊", label: "Growth Tracker",          accent: "#10B981", path: "/growth-tracker" },
  { emoji: "🤱", label: "Breastfeeding",           accent: "#EC4899", path: "/breastfeeding" },
  { emoji: "🍽️", label: "Food Chart",             accent: "#FF9A5C", path: "/food-chart" },
  { emoji: "💡", label: "Tips",                    accent: "#6C63FF", path: "/baby-tips" },
];

function Tile({ tile }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => navigate(tile.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${tile.accent}22` : `${tile.accent}12`,
        border: `1px solid ${hovered ? tile.accent + "60" : tile.accent + "30"}`,
        borderRadius: "22px",
        padding: "28px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "scale(1.06) translateY(-4px)" : "scale(1)",
        boxShadow: hovered ? `0 12px 32px ${tile.accent}35` : `0 4px 14px rgba(0,0,0,0.2)`,
        backdropFilter: "blur(20px)",
        aspectRatio: "1",
      }}
    >
      <div style={{
        width: "68px", height: "68px", borderRadius: "20px",
        background: `${tile.accent}25`, border: `1px solid ${tile.accent}45`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "34px",
        boxShadow: hovered ? `0 6px 18px ${tile.accent}40` : "none",
        transition: "box-shadow 0.25s ease",
      }}>
        {tile.emoji}
      </div>
      <p style={{
        fontSize: "14px", fontWeight: "700", color: "#fff",
        textAlign: "center", lineHeight: "1.3",
      }}>{tile.label}</p>
    </div>
  );
}

export default function NewbornScreen() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={{ ...styles.header, background: GRADIENTS.greenHeader }}>
        <button onClick={() => navigate("/")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>🌼</div>
        <h1 style={styles.headerTitle}>New Born Baby</h1>
        <p style={styles.headerSub}>Track your newborn's growth</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        <div style={styles.grid}>
          {tiles.map(t => <Tile key={t.path} tile={t} />)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(60,201,138,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,160,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(60,201,138,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
};
