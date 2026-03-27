import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WARNING_SIGNS } from "../../utils/pregnancyUtils";

export default function EmergencySection() {
  const [expanded, setExpanded] = useState(null);

  const severityStyle = {
    critical: { bg: "rgba(255,92,138,0.15)", border: "rgba(255,92,138,0.35)", color: "#FF5C8A", label: "CRITICAL" },
    high:     { bg: "rgba(255,154,92,0.12)", border: "rgba(255,154,92,0.3)",  color: "#FF9A5C", label: "HIGH" },
  };

  return (
    <div className="flex flex-col" style={{ gap: "24px" }}>
      {/* Emergency call banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: "linear-gradient(135deg,rgba(255,92,138,0.2),rgba(255,92,138,0.05))", border: "1px solid rgba(255,92,138,0.35)", boxShadow: "0 8px 32px rgba(255,92,138,0.15)", borderRadius: "24px", padding: "36px 28px", textAlign: "center" }}>
        <p style={{ fontSize: "40px", marginBottom: "12px" }}>🚨</p>
        <p className="font-black text-white" style={{ fontSize: "22px", marginBottom: "8px" }}>Emergency?</p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>
          If you're experiencing a medical emergency, call immediately.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="tel:102"
            style={{ background: "linear-gradient(135deg,#FF5C8A,#C850C0)", textDecoration: "none", boxShadow: "0 6px 20px rgba(255,92,138,0.4)", padding: "14px 24px", borderRadius: "16px", fontWeight: 700, color: "#fff", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            📞 Call 102 (Ambulance)
          </a>
          <a href="tel:108"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", textDecoration: "none", padding: "14px 24px", borderRadius: "16px", fontWeight: 700, color: "#fff", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
            🏥 Call 108 (Emergency)
          </a>
        </div>
      </motion.div>

      {/* Warning signs list */}
      <div>
        <p className="font-bold text-white" style={{ fontSize: "18px", marginBottom: "16px" }}>⚠️ Warning Signs to Watch For</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {WARNING_SIGNS.map((sign, i) => {
            const s = severityStyle[sign.severity];
            const isOpen = expanded === i;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "18px", overflow: "hidden" }}>
                <button onClick={() => setExpanded(isOpen ? null : i)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>{sign.icon}</span>
                  <span style={{ flex: 1, fontWeight: 600, color: "#fff", fontSize: "15px", lineHeight: "1.4" }}>{sign.title}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "100px", background: `${s.color}25`, color: s.color, border: `1px solid ${s.color}40`, flexShrink: 0 }}>
                    {s.label}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginLeft: "4px", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                      style={{ borderTop: `1px solid ${s.border}`, padding: "16px 20px 20px" }}>
                      <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: "1.8", wordBreak: "break-word", whiteSpace: "normal" }}>
                        {sign.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: "13px", lineHeight: "1.65" }}>
        This information is for awareness only. Always consult your healthcare provider for medical advice.
      </p>
    </div>
  );
}
