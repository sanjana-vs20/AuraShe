import { useState } from "react";

export default function Card({ children, onClick, style, accentColor }) {
  const [hovered, setHovered] = useState(false);
  const accent = accentColor || "#FF5C8A";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="grad-border"
      style={{
        background: hovered
          ? "rgba(255,255,255,0.13)"
          : "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "28px 28px",
        margin: "0",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.15)"}`,
        boxShadow: hovered
          ? `0 24px 60px ${accent}30, 0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
        transform: hovered ? "scale(1.025) translateY(-4px)" : "scale(1) translateY(0)",
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
