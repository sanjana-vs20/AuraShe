import { useState } from "react";
import { GRADIENTS } from "../theme";

export default function Button({ title, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: GRADIENTS.primary,
        backgroundSize: "200% 200%",
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "700",
        letterSpacing: "0.5px",
        padding: "16px 30px",
        borderRadius: "20px",
        border: "none",
        cursor: "pointer",
        display: "block",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "scale(1.03) translateY(-2px)" : "scale(1) translateY(0)",
        boxShadow: hovered
          ? "0 16px 40px rgba(255,92,138,0.55), 0 4px 12px rgba(108,99,255,0.3)"
          : "0 8px 24px rgba(255,92,138,0.35), 0 2px 8px rgba(108,99,255,0.2)",
      }}
    >
      {/* Shine sweep on hover */}
      <span style={{
        position: "absolute",
        top: 0, left: hovered ? "120%" : "-60%",
        width: "50%", height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
        transform: "skewX(-20deg)",
        transition: "left 0.5s ease",
        pointerEvents: "none",
      }} />
      {title}
    </button>
  );
}
