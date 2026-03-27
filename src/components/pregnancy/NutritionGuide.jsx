import { useState } from "react";
import { motion } from "framer-motion";
import { getNutritionData } from "../../utils/pregnancyUtils";

export default function NutritionGuide({ trimester }) {
  const [tab, setTab] = useState("eat");
  const data = getNutritionData(trimester);

  const tabs = [
    { key: "eat",       label: "✅ Eat",       color: "#3CC98A", glow: "rgba(60,201,138,0.35)"  },
    { key: "avoid",     label: "🚫 Avoid",     color: "#FF5C8A", glow: "rgba(255,92,138,0.35)"  },
    { key: "hydration", label: "💧 Hydration", color: "#6C63FF", glow: "rgba(108,99,255,0.35)"  },
  ];

  const activeTab = tabs.find((t) => t.key === tab);

  return (
    <div className="w-full" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* ── Card ── */}
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${data.color}35`,
            boxShadow: `0 16px 48px rgba(0,0,0,0.25), 0 4px 16px ${data.color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
          }}
        >
          {/* ── Card header ── */}
          <div
            style={{
              padding: "32px 28px",
              display: "flex", alignItems: "center", gap: "20px",
              background: `linear-gradient(135deg, ${data.color}18, ${data.color}06)`,
              borderBottom: `1px solid ${data.color}20`,
            }}
          >
            {/* Icon bubble */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: `${data.color}25`,
                border: `1.5px solid ${data.color}45`,
                boxShadow: `0 6px 20px ${data.color}30`,
              }}
            >
              🥗
            </div>

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-white" style={{ fontSize: "22px", letterSpacing: "-0.4px", lineHeight: "1.2", marginBottom: "6px" }}>
                Nutrition Guide
              </h2>
              <p
                className="font-semibold mt-0.5"
                style={{ color: data.color, fontSize: "13px", letterSpacing: "0.3px" }}
              >
                {data.label} · Personalized for you
              </p>
            </div>

            {/* Trimester badge */}
            <span
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: `${data.color}20`,
                color: data.color,
                border: `1px solid ${data.color}40`,
              }}
            >
              T{trimester}
            </span>
          </div>

          {/* ── Tab switcher ── */}
          <div style={{ padding: "24px 28px 8px" }}>
            <div
              className="flex gap-2 p-1.5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex-1 py-3.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: tab === t.key ? t.color : "transparent",
                    color: tab === t.key ? "#fff" : "rgba(255,255,255,0.4)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: tab === t.key ? `0 4px 14px ${t.glow}` : "none",
                    letterSpacing: "0.2px",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Tab content ── */}
          <div style={{ padding: "20px 28px 32px" }}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="space-y-4"
            >
              {/* Hydration tab */}
              {tab === "hydration" && (
                <div>
                  <div className="rounded-2xl" style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.22)", padding: "20px 20px", marginBottom: "16px" }}>
                    <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: "1.85", whiteSpace: "normal", wordBreak: "break-word" }}>
                      {data.hydration}
                    </p>
                  </div>

                  {/* Drink chips */}
                  <p
                    className="font-semibold mb-3"
                    style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", letterSpacing: "0.8px", textTransform: "uppercase" }}
                  >
                    Good choices
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { label: "💧 Water",         bg: "rgba(108,99,255,0.18)", color: "#a89cff" },
                      { label: "🍵 Herbal Tea",     bg: "rgba(60,201,138,0.15)", color: "#6ee7b7" },
                      { label: "🥥 Coconut Water",  bg: "rgba(255,154,92,0.15)", color: "#ffbe8f" },
                      { label: "🍋 Lemon Water",    bg: "rgba(255,92,138,0.12)", color: "#ff8fab" },
                    ].map((item) => (
                      <span
                        key={item.label}
                        className="px-4 py-2 rounded-full font-semibold"
                        style={{
                          background: item.bg,
                          color: item.color,
                          border: `1px solid ${item.color}40`,
                          fontSize: "13px",
                        }}
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Eat / Avoid tabs */}
              {tab !== "hydration" && data[tab].map((item, i) => {
                const isEat   = tab === "eat";
                const itemBg  = isEat ? "rgba(60,201,138,0.08)"  : "rgba(255,92,138,0.08)";
                const itemBdr = isEat ? "rgba(60,201,138,0.18)"  : "rgba(255,92,138,0.18)";
                const hoverBg = isEat ? "rgba(60,201,138,0.15)"  : "rgba(255,92,138,0.15)";
                const iconClr = isEat ? "#3CC98A"                : "#FF5C8A";

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055, duration: 0.3 }}
                    className="group flex items-start gap-4 rounded-2xl cursor-default"
                    style={{
                      background: itemBg,
                      border: `1px solid ${itemBdr}`,
                      padding: "16px 20px",
                      transition: "background 0.2s ease, box-shadow 0.2s ease",
                    }}
                    whileHover={{
                      backgroundColor: hoverBg,
                      boxShadow: `0 4px 16px ${iconClr}20`,
                      x: 3,
                    }}
                  >
                    {/* Check / Cross icon */}
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
                      style={{ background: `${iconClr}20`, border: `1px solid ${iconClr}35`, color: iconClr, marginTop: "2px" }}
                    >
                      {isEat ? "✓" : "✕"}
                    </div>

                    <p className="flex-1" style={{ color: "rgba(255,255,255,0.88)", fontSize: "15px", lineHeight: "1.75", wordBreak: "break-word", whiteSpace: "normal" }}>
                      {item}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── Info footer ── */}
        <p
          className="text-center"
          style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", lineHeight: "1.6" }}
        >
          🩺 Dietary needs vary. Always consult your healthcare provider for personalized advice.
        </p>
      </div>
  );
}
