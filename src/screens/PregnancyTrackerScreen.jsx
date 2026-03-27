import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { calcPregnancyWeek, getBabyData } from "../utils/pregnancyUtils";

export default function PregnancyTrackerScreen() {
  const navigate = useNavigate();
  const [lmp, setLmp] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    if (!lmp) { setError("Please select your LMP date."); return; }
    const selected = new Date(lmp);
    const today = new Date();
    if (selected > today) { setError("LMP date cannot be in the future."); return; }
    const diff = Math.floor((today - selected) / (1000 * 60 * 60 * 24));
    if (diff > 280) { setError("LMP date is more than 40 weeks ago."); return; }
    setError("");
    setResult(calcPregnancyWeek(lmp));
  }

  const babyData = result ? getBabyData(result.week) : null;

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(145deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>

      {/* Blobs */}
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,154,92,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", filter: "blur(2px)" }} />
      <div className="fixed -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(247,99,12,0.18) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite" }} />

      {/* Gradient Header */}
      <div className="relative z-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF9A5C 0%, #f7630c 100%)", borderRadius: "0 0 40px 40px", padding: "56px 32px 44px", boxShadow: "0 16px 48px rgba(255,154,92,0.4), 0 4px 16px rgba(0,0,0,0.3)" }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.08)" }} />

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="mb-7 text-white text-sm font-semibold inline-flex items-center gap-2"
          style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", padding: "8px 18px", borderRadius: "100px", backdropFilter: "blur(10px)", cursor: "pointer" }}>
          ← Back
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-6xl mb-4" style={{ filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" }}>🍼</div>
          <h1 className="text-white font-black mb-2" style={{ fontSize: "34px", letterSpacing: "-0.5px", lineHeight: "1.2" }}>
            Pregnancy Tracker
          </h1>
          <p className="text-white" style={{ opacity: 0.78, fontSize: "16px", lineHeight: "1.5" }}>
            Your week-by-week journey
          </p>
        </motion.div>
      </div>

      {/* Body */}
      <div className="relative z-10" style={{ maxWidth: "540px", margin: "0 auto", padding: "36px 24px 72px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* LMP Input Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-3xl"
            style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)", padding: "36px 32px" }}>

            <p className="font-bold" style={{ color: "#ffbe8f", fontSize: "19px", marginBottom: "8px" }}>
              📅 Last Menstrual Period (LMP)
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: "1.65", marginBottom: "28px" }}>
              We'll calculate your current pregnancy week automatically
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="date"
                value={lmp}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => { setLmp(e.target.value); setError(""); setResult(null); }}
                className="w-full text-white font-medium outline-none"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,154,92,0.4)", fontSize: "16px", colorScheme: "dark", borderRadius: "16px", padding: "16px 20px" }}
              />

              {error && (
                <p className="font-medium text-sm leading-relaxed" style={{ color: "#ff8a8a" }}>⚠ {error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 16px 40px rgba(255,154,92,0.55)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCalculate}
                className="w-full font-bold text-white"
                style={{ background: "linear-gradient(135deg, #FF9A5C 0%, #C850C0 50%, #6C63FF 100%)", fontSize: "17px", border: "none", cursor: "pointer", padding: "18px 24px", borderRadius: "16px", boxShadow: "0 8px 24px rgba(255,154,92,0.35)", letterSpacing: "0.3px" }}>
                Calculate My Week ✨
              </motion.button>
            </div>
          </motion.div>

          {/* Static info card */}
          {!result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-3xl"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: "36px 32px" }}>
              <p className="font-bold" style={{ color: "#ffbe8f", fontSize: "19px", marginBottom: "12px" }}>👶 About Pregnancy Tracker</p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", lineHeight: "1.8", marginBottom: "20px" }}>
                Follow your baby's growth and your body's changes every step of the way. Enter your LMP date above to get started.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: "rgba(255,154,92,0.2)", color: "#ffbe8f", border: "1px solid rgba(255,154,92,0.3)" }}>
                ● Journey starts with your date
              </div>
            </motion.div>
          )}

          {/* Result Card */}
          <AnimatePresence>
            {result && babyData && (
              <motion.div key="result"
                style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}>

                {/* Week Hero Card */}
                <div className="rounded-3xl text-center"
                  style={{ background: "linear-gradient(135deg, rgba(255,154,92,0.2), rgba(255,154,92,0.05))", backdropFilter: "blur(20px)", border: "1px solid rgba(255,154,92,0.3)", boxShadow: "0 24px 60px rgba(255,154,92,0.2), inset 0 1px 0 rgba(255,255,255,0.1)", padding: "40px 32px" }}>

                  <div className="text-6xl" style={{ marginBottom: "16px" }}>{babyData.sizeEmoji}</div>
                  <p className="font-black" style={{ color: "#ffbe8f", fontSize: "34px", letterSpacing: "-0.5px", lineHeight: "1.1", marginBottom: "8px" }}>
                    Week {result.week} of 40
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "15px", marginBottom: "4px" }}>
                    {result.days} day{result.days !== 1 ? "s" : ""} into this week
                  </p>

                  {/* Progress bar */}
                  <div className="w-full rounded-full" style={{ height: "7px", background: "rgba(255,255,255,0.1)", margin: "24px 0" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(result.week / 40) * 100}%` }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #FF9A5C, #C850C0)" }} />
                  </div>

                  <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: "24px" }}>
                    <span>Week 1</span>
                    <span className="font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {Math.round((result.week / 40) * 100)}% complete
                    </span>
                    <span>Week 40</span>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-3 justify-center flex-wrap">
                    {[
                      { label: `● Trimester ${result.trimester}`, bg: "rgba(255,154,92,0.2)", color: "#ffbe8f", border: "rgba(255,154,92,0.3)" },
                      { label: `🗓 Due: ${result.dueDate}`, bg: "rgba(108,99,255,0.2)", color: "#a89cff", border: "rgba(108,99,255,0.3)" },
                      { label: `${babyData.sizeEmoji} ${babyData.size}`, bg: "rgba(60,201,138,0.15)", color: "#6ee7b7", border: "rgba(60,201,138,0.3)" },
                    ].map((b) => (
                      <span key={b.label} className="px-4 py-2 rounded-full text-sm font-bold"
                        style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                        {b.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 48px rgba(255,154,92,0.5), 0 4px 12px rgba(108,99,255,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/pregnancy-dashboard", { state: { lmp, result, babyData } })}
                  className="w-full font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #FF9A5C 0%, #C850C0 50%, #6C63FF 100%)", fontSize: "17px", border: "none", cursor: "pointer", padding: "18px 24px", borderRadius: "16px", letterSpacing: "0.4px", boxShadow: "0 8px 24px rgba(255,154,92,0.35), 0 2px 8px rgba(108,99,255,0.2)" }}>
                  View My Journey →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
