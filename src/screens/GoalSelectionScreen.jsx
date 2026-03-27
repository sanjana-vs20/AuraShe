import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, GRADIENTS } from "../theme";

const goals = [
  {
    emoji: "🌸",
    title: "Track Period",
    subtitle: "Log cycles & symptoms",
    accent: "#FF5C8A",
    glow: "rgba(255,92,138,0.35)",
    path: "/period",
    delay: "fade-up-2",
  },
  {
    emoji: "🤰",
    title: "Get Pregnant",
    subtitle: "Fertility & ovulation insights",
    accent: "#6C63FF",
    glow: "rgba(108,99,255,0.35)",
    path: "/pregnant",
    delay: "fade-up-3",
  },
  {
    emoji: "🍼",
    title: "Pregnancy Tracker",
    subtitle: "Week-by-week journey",
    accent: "#FF9A5C",
    glow: "rgba(255,154,92,0.35)",
    path: "/pregnancy-tracker",
    delay: "fade-up-4",
  },
  {
    emoji: "🌼",
    title: "Perimenopause",
    subtitle: "Navigate your transition",
    accent: "#3CC98A",
    glow: "rgba(60,201,138,0.35)",
    path: "/menopause",
    delay: "fade-up-5",
  },
];

function GoalCard({ goal }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`${goal.delay} grad-border`}
      onClick={() => navigate(goal.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(145deg, ${goal.accent}22, ${goal.accent}08)`
          : "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "28px 22px",
        border: `1px solid ${hovered ? goal.accent + "55" : "rgba(255,255,255,0.1)"}`,
        boxShadow: hovered
          ? `0 24px 60px ${goal.glow}, 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)`
          : `0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)`,
        transform: hovered ? "scale(1.05) translateY(-6px)" : "scale(1) translateY(0)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "14px",
        minHeight: "180px",
      }}
    >
      {/* Glowing icon bubble */}
      <div style={{
        width: "58px",
        height: "58px",
        borderRadius: "18px",
        background: `linear-gradient(135deg, ${goal.accent}40, ${goal.accent}15)`,
        border: `1px solid ${goal.accent}40`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "26px",
        boxShadow: hovered ? `0 8px 24px ${goal.glow}` : `0 4px 12px ${goal.accent}30`,
        transition: "box-shadow 0.3s ease",
      }}>
        {goal.emoji}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: "16px",
          fontWeight: "700",
          color: "#fff",
          marginBottom: "5px",
          letterSpacing: "-0.2px",
        }}>
          {goal.title}
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5" }}>
          {goal.subtitle}
        </p>
      </div>

      {/* Gradient arrow chip */}
      <div style={{
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${goal.accent}, ${goal.accent}99)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "15px",
        boxShadow: `0 4px 14px ${goal.glow}`,
        alignSelf: "flex-end",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        transform: hovered ? "translateX(4px) scale(1.1)" : "translateX(0) scale(1)",
      }}>
        →
      </div>
    </div>
  );
}

export default function GoalSelectionScreen() {
  return (
    <div style={styles.page}>
      {/* Deep background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />
      {/* Rotating ring accent */}
      <div style={styles.ring} />

      <div style={styles.container}>
        {/* Brand pill */}
        <div className="fade-up" style={styles.brandPill}>
          <span style={styles.brandDot} />
          AuraShe
        </div>

        {/* Hero heading with gradient text */}
        <h1 className="fade-up-1" style={styles.heading}>
          Welcome to{" "}
          <span style={styles.gradientText}>AuraShe</span>
        </h1>

        <p className="fade-up-1" style={styles.subtitle}>
          Your personalized health companion
          <br />
          <span style={{ fontSize: "14px", opacity: 0.6 }}>Personalized care for every stage of life</span>
        </p>

        {/* 2×2 Goal Grid */}
        <div style={styles.grid}>
          {goals.map((goal) => (
            <GoalCard key={goal.path} goal={goal} />
          ))}
        </div>

        {/* Footer */}
        <p className="fade-up-5" style={styles.footer}>
          🔒 Your data is private &amp; secure
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: GRADIENTS.page,
    overflowX: "hidden",
    position: "relative",
  },
  blob1: {
    position: "fixed",
    top: "-160px",
    right: "-160px",
    width: "520px",
    height: "520px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,92,138,0.28) 0%, rgba(200,80,192,0.12) 50%, transparent 70%)",
    animation: "blobPulse 9s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
    filter: "blur(2px)",
  },
  blob2: {
    position: "fixed",
    bottom: "-140px",
    left: "-140px",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(108,99,255,0.28) 0%, rgba(59,55,204,0.12) 50%, transparent 70%)",
    animation: "blobPulse 12s 3s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
    filter: "blur(2px)",
  },
  blob3: {
    position: "fixed",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(200,80,192,0.12) 0%, transparent 70%)",
    animation: "blobPulse 15s 1s ease-in-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  ring: {
    position: "fixed",
    top: "-200px",
    right: "-200px",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    border: "1px solid rgba(255,92,138,0.08)",
    animation: "rotateSlow 30s linear infinite",
    pointerEvents: "none",
    zIndex: 0,
  },
  container: {
    position: "relative",
    zIndex: 1,
    maxWidth: "560px",
    margin: "0 auto",
    padding: "56px 24px 64px",
  },
  brandPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    background: "rgba(255,92,138,0.15)",
    border: "1px solid rgba(255,92,138,0.3)",
    borderRadius: "100px",
    padding: "6px 16px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#FF8FAB",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    marginBottom: "28px",
    backdropFilter: "blur(8px)",
  },
  brandDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#FF5C8A",
    display: "inline-block",
    boxShadow: "0 0 6px #FF5C8A",
    animation: "glowPulse 2s ease-in-out infinite",
  },
  heading: {
    fontSize: "clamp(34px, 6vw, 48px)",
    fontWeight: "900",
    color: "#fff",
    lineHeight: "1.15",
    letterSpacing: "-1.5px",
    marginBottom: "16px",
  },
  gradientText: {
    background: GRADIENTS.primary,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "inline-block",
  },
  subtitle: {
    fontSize: "17px",
    color: "rgba(255,255,255,0.65)",
    lineHeight: "1.7",
    marginBottom: "44px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "44px",
  },
  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "rgba(255,255,255,0.3)",
  },
};

