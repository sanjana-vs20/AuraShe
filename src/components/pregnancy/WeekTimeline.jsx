import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getBabyData } from "../../utils/pregnancyUtils";
import GlassCard from "./GlassCard";

const TRIMESTER_COLORS = {
  1: { accent: "#FF9A5C", glow: "rgba(255,154,92,0.3)", label: "1st Trimester" },
  2: { accent: "#C850C0", glow: "rgba(200,80,192,0.3)", label: "2nd Trimester" },
  3: { accent: "#6C63FF", glow: "rgba(108,99,255,0.3)", label: "3rd Trimester" },
};

function getTrimester(w) { return w <= 13 ? 1 : w <= 26 ? 2 : 3; }

export default function WeekTimeline({ currentWeek }) {
  const scrollRef = useRef(null);
  const [selected, setSelected] = useState(null);

  // Auto-scroll to current week on mount
  useEffect(() => {
    const el = document.getElementById(`week-${currentWeek}`);
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [currentWeek]);

  const detail = selected ? getBabyData(selected) : null;
  const tc = selected ? TRIMESTER_COLORS[getTrimester(selected)] : null;

  return (
    <div>
      {/* Horizontal scroll strip */}
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-3 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => {
          const t = getTrimester(w);
          const { accent, glow } = TRIMESTER_COLORS[t];
          const isCurrent = w === currentWeek;
          const isPast = w < currentWeek;
          const data = getBabyData(w);
          return (
            <motion.button
              id={`week-${w}`}
              key={w}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(selected === w ? null : w)}
              className="flex-shrink-0 flex flex-col items-center rounded-2xl py-3 px-3 relative"
              style={{
                minWidth: "64px",
                background: isCurrent
                  ? `linear-gradient(135deg, ${accent}, ${accent}99)`
                  : selected === w
                  ? `rgba(255,255,255,0.12)`
                  : isPast
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.04)",
                border: isCurrent
                  ? `1.5px solid ${accent}`
                  : selected === w
                  ? `1.5px solid ${accent}88`
                  : `1px solid rgba(255,255,255,0.08)`,
                boxShadow: isCurrent ? `0 6px 20px ${glow}` : "none",
                cursor: "pointer",
              }}
            >
              {isCurrent && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: accent, color: "#fff", fontSize: "9px", whiteSpace: "nowrap" }}>
                  NOW
                </span>
              )}
              <span style={{ fontSize: "18px", marginBottom: "4px" }}>{data.sizeEmoji}</span>
              <span className="font-bold" style={{ color: isCurrent ? "#fff" : isPast ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)", fontSize: "11px" }}>
                W{w}
              </span>
              {isPast && !isCurrent && (
                <span style={{ color: accent, fontSize: "10px", marginTop: "2px" }}>✓</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Trimester labels */}
      <div className="flex gap-3 mt-2 mb-4 flex-wrap">
        {[1, 2, 3].map((t) => (
          <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: `${TRIMESTER_COLORS[t].accent}20`, color: TRIMESTER_COLORS[t].accent, border: `1px solid ${TRIMESTER_COLORS[t].accent}40` }}>
            {TRIMESTER_COLORS[t].label} (Wk {t === 1 ? "1–13" : t === 2 ? "14–26" : "27–40"})
          </span>
        ))}
      </div>

      {/* Week detail panel */}
      <AnimatePresence>
        {selected && detail && tc && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            style={{ background: `linear-gradient(135deg, ${tc.accent}18, ${tc.accent}06)`, border: `1px solid ${tc.accent}40`, boxShadow: `0 12px 40px ${tc.glow}`, borderRadius: "24px", padding: "28px 24px", marginTop: "16px" }}
          >
            <div className="flex items-start gap-4" style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "36px", flexShrink: 0 }}>{detail.sizeEmoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white" style={{ fontSize: "20px", marginBottom: "4px" }}>Week {selected}</p>
                <p style={{ color: tc.accent, fontSize: "13px", fontWeight: 600 }}>
                  Baby size: {detail.size} · {tc.label}
                </p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "20px", flexShrink: 0, lineHeight: 1 }}>✕</button>
            </div>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "15px", lineHeight: "1.8", marginBottom: "18px" }}>{detail.babyDesc}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {detail.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: `${tc.accent}15`, border: `1px solid ${tc.accent}30`, borderRadius: "12px", padding: "10px 14px" }}>
                  <span style={{ color: tc.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: "1.65" }}>{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
