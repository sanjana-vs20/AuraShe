import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SYMPTOMS = [
  { key: "nausea",   label: "Nausea",    emoji: "🤢", color: "#FF9A5C" },
  { key: "fatigue",  label: "Fatigue",   emoji: "😴", color: "#C850C0" },
  { key: "mood",     label: "Mood",      emoji: "😊", color: "#6C63FF" },
  { key: "sleep",    label: "Sleep",     emoji: "🌙", color: "#3CC98A" },
  { key: "appetite", label: "Appetite",  emoji: "🍽️", color: "#FF5C8A" },
  { key: "pain",     label: "Back Pain", emoji: "💢", color: "#a89cff" },
];

const LEVELS = [
  { value: 1, label: "None",     color: "#3CC98A" },
  { value: 2, label: "Mild",     color: "#FF9A5C" },
  { value: 3, label: "Moderate", color: "#C850C0" },
  { value: 4, label: "Severe",   color: "#FF5C8A" },
];

const STORAGE_KEY = "aurashe_symptoms";
const todayKey = () => new Date().toISOString().split("T")[0];

export default function SymptomTracker() {
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
  });
  const [today, setToday] = useState(() => logs[todayKey()] || {});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  function setLevel(key, val) {
    setToday((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }

  function saveLog() {
    setLogs((prev) => ({ ...prev, [todayKey()]: today }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key   = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const entry = logs[key] || {};
    const avg   = SYMPTOMS.reduce((s, sym) => s + (entry[sym.key] || 0), 0) / SYMPTOMS.length;
    return { key, label, avg: Math.round(avg * 10) / 10 };
  });

  return (
    <div className="flex flex-col gap-8">

      {/* Today's log card */}
      <div className="rounded-3xl"
        style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,154,92,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", padding: "36px 32px" }}>

        <div className="flex items-start justify-between mb-7">
          <div>
            <p className="font-bold text-white mb-1" style={{ fontSize: "20px" }}>📋 Today's Symptoms</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={saveLog}
            className="px-5 py-2.5 rounded-2xl text-sm font-bold text-white flex-shrink-0"
            style={{ background: saved ? "linear-gradient(135deg,#3CC98A,#0ea5a0)" : "linear-gradient(135deg,#FF9A5C,#C850C0)", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(255,154,92,0.3)" }}>
            {saved ? "✓ Saved!" : "Save Log"}
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {SYMPTOMS.map((sym) => (
            <div key={sym.key} className="rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", padding: "20px" }}>
              <p className="font-semibold mb-4" style={{ color: sym.color, fontSize: "15px" }}>
                {sym.emoji} {sym.label}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map((lv) => (
                  <button key={lv.value} onClick={() => setLevel(sym.key, lv.value)}
                    className="py-3 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: today[sym.key] === lv.value ? lv.color : "rgba(255,255,255,0.06)",
                      color: today[sym.key] === lv.value ? "#fff" : "rgba(255,255,255,0.35)",
                      border: today[sym.key] === lv.value ? `1px solid ${lv.color}` : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer",
                    }}>
                    {lv.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-day trend chart */}
      <div className="rounded-3xl"
        style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(108,99,255,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", padding: "36px 32px" }}>
        <p className="font-bold text-white mb-2" style={{ fontSize: "20px" }}>📈 7-Day Symptom Trend</p>
        <p className="mb-7" style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
          Average severity across all symptoms
        </p>
        <div className="flex items-end gap-3" style={{ height: "140px" }}>
          {last7.map((day, i) => (
            <div key={day.key} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: day.avg > 0 ? `${(day.avg / 4) * 112}px` : "6px" }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
                className="w-full rounded-xl"
                style={{ background: day.avg > 0 ? "linear-gradient(180deg,#C850C0,#6C63FF)" : "rgba(255,255,255,0.08)", minHeight: "5px" }} />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>{day.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-4 flex-wrap">
          {LEVELS.map((lv) => (
            <span key={lv.value} className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px" }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: lv.color }} />
              {lv.label}
            </span>
          ))}
        </div>
      </div>

      {/* Past logs */}
      {Object.keys(logs).length > 0 && (
        <div className="rounded-3xl"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", padding: "36px 32px" }}>
          <p className="font-bold text-white mb-6" style={{ fontSize: "20px" }}>🗂 Past Logs</p>
          <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: "220px" }}>
            {Object.entries(logs).sort((a, b) => b[0].localeCompare(a[0])).map(([date, entry]) => (
              <div key={date} className="flex items-center justify-between rounded-2xl px-5 py-3.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", fontWeight: 500 }}>
                  {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <div className="flex gap-2.5">
                  {SYMPTOMS.map((sym) => entry[sym.key] ? (
                    <span key={sym.key}
                      title={`${sym.label}: ${LEVELS.find(l => l.value === entry[sym.key])?.label}`}
                      style={{ fontSize: "16px", opacity: entry[sym.key] > 2 ? 1 : 0.45 }}>
                      {sym.emoji}
                    </span>
                  ) : null)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
