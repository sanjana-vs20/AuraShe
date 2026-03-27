import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getBabyData, calcPregnancyWeek } from "../utils/pregnancyUtils";
import WeekTimeline from "../components/pregnancy/WeekTimeline";
import SymptomTracker from "../components/pregnancy/SymptomTracker";
import RemindersManager from "../components/pregnancy/RemindersManager";
import NutritionGuide from "../components/pregnancy/NutritionGuide";
import AIAssistant from "../components/pregnancy/AIAssistant";
import EmergencySection from "../components/pregnancy/EmergencySection";

const TABS = [
  { key: "overview",  label: "Overview",  emoji: "🏠" },
  { key: "timeline",  label: "Timeline",  emoji: "📅" },
  { key: "symptoms",  label: "Symptoms",  emoji: "📋" },
  { key: "reminders", label: "Reminders", emoji: "🔔" },
  { key: "nutrition", label: "Nutrition", emoji: "🥗" },
  { key: "assistant", label: "AuraBot",   emoji: "🤖" },
  { key: "emergency", label: "Emergency", emoji: "🚨" },
];

const cardAnim = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" } }),
};

const STORAGE_NAME = "aurashe_username";

/* ── Reusable section card ── */
function SectionCard({ icon, iconBg, iconBorder, title, titleColor, subtitle, children, delay = 0 }) {
  return (
    <motion.div custom={delay} variants={cardAnim} initial="hidden" animate="visible"
      className="rounded-3xl"
      style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: `1px solid ${iconBorder}`, boxShadow: "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07)", padding: "36px 32px" }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: iconBg, border: `1px solid ${iconBorder}` }}>
          {icon}
        </div>
        <div>
          <p className="font-bold leading-tight" style={{ color: titleColor, fontSize: "19px" }}>{title}</p>
          <p className="mt-1" style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default function PregnancyDashboard() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const lmp      = state?.lmp;
  const result   = state?.result || (lmp ? calcPregnancyWeek(lmp) : null);
  const babyData = result ? getBabyData(result.week) : null;

  const [activeTab, setActiveTab] = useState("overview");
  const [userName, setUserName]   = useState(() => localStorage.getItem(STORAGE_NAME) || "");
  const [editName, setEditName]   = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  function saveName() {
    localStorage.setItem(STORAGE_NAME, nameInput.trim());
    setUserName(nameInput.trim());
    setEditName(false);
  }

  if (!result || !babyData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-5"
        style={{ background: "linear-gradient(145deg,#0f0c29 0%,#302b63 50%,#24243e 100%)" }}>
        <p className="text-white text-xl font-bold">No pregnancy data found.</p>
        <button onClick={() => navigate("/pregnancy-tracker")}
          className="px-8 py-4 rounded-2xl font-bold text-white text-base"
          style={{ background: "linear-gradient(135deg,#FF9A5C,#6C63FF)", border: "none", cursor: "pointer" }}>
          ← Go Back
        </button>
      </div>
    );
  }

  const progressPct = Math.round((result.week / 40) * 100);
  const greeting    = userName ? `Hi ${userName} 👋` : "Welcome back 👋";

  return (
    <div className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(145deg,#0f0c29 0%,#302b63 50%,#24243e 100%)" }}>

      {/* Blobs */}
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(255,154,92,0.2) 0%,transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", filter: "blur(2px)" }} />
      <div className="fixed -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(108,99,255,0.2) 0%,transparent 70%)", animation: "blobPulse 12s 3s ease-in-out infinite" }} />

      {/* Header */}
      <div className="relative z-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#FF9A5C 0%,#C850C0 60%,#6C63FF 100%)", borderRadius: "0 0 40px 40px", padding: "52px 28px 36px", boxShadow: "0 16px 48px rgba(255,154,92,0.35),0 4px 16px rgba(0,0,0,0.3)" }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.07)" }} />

        <div className="flex items-center justify-between mb-5">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/pregnancy-tracker")}
            className="text-white text-sm font-semibold inline-flex items-center gap-2"
            style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", padding: "8px 16px", borderRadius: "100px", backdropFilter: "blur(10px)", cursor: "pointer" }}>
            ← Back
          </motion.button>

          {editName ? (
            <div className="flex items-center gap-2">
              <input value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                placeholder="Your name"
                className="rounded-xl px-3 py-2 text-white text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", width: "130px", colorScheme: "dark" }} />
              <button onClick={saveName}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "20px" }}>✓</button>
            </div>
          ) : (
            <button onClick={() => setEditName(true)}
              className="text-white text-sm font-semibold flex items-center gap-1.5"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", padding: "7px 14px", borderRadius: "100px", cursor: "pointer" }}>
              ✏️ {userName || "Set name"}
            </button>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="text-white mb-1" style={{ fontSize: "14px", opacity: 0.75, letterSpacing: "0.2px" }}>{greeting}</p>
          <h1 className="text-white font-black mb-2" style={{ fontSize: "30px", letterSpacing: "-0.5px", lineHeight: "1.2" }}>
            You're in Week {result.week} 💜
          </h1>
          <p className="text-white" style={{ opacity: 0.7, fontSize: "14px", lineHeight: "1.5" }}>
            Due: {result.dueDate} · Trimester {result.trimester} · {progressPct}% complete
          </p>
        </motion.div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 z-20"
        style={{ background: "rgba(15,12,41,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px" }}>
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex flex-col items-center gap-1 font-bold transition-all"
              style={{
                background: activeTab === tab.key ? "linear-gradient(135deg,#FF9A5C,#C850C0)" : "rgba(255,255,255,0.07)",
                color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.5)",
                border: activeTab === tab.key ? "none" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: activeTab === tab.key ? "0 6px 18px rgba(255,154,92,0.35)" : "none",
                cursor: "pointer",
                fontSize: "11px", padding: "10px 4px", borderRadius: "12px",
              }}>
              <span style={{ fontSize: "18px" }}>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="relative z-10 w-full flex justify-center px-5 pb-28" style={{ paddingTop: "36px" }}>
        <div className="w-full" style={{ maxWidth: "760px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>

              {/* ── OVERVIEW ── */}
              {activeTab === "overview" && (
                <div className="flex flex-col gap-6">

                  {/* Progress ring */}
                  <motion.div custom={0} variants={cardAnim} initial="hidden" animate="visible"
                    className="rounded-3xl"
                    style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,154,92,0.25)", boxShadow: "0 8px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)", padding: "40px 36px", textAlign: "center" }}>
                    <div className="flex justify-center mb-4">
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                        <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#rg)" strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - progressPct / 100) }}
                          transform="rotate(-90 60 60)"
                          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }} />
                        <defs>
                          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#FF9A5C" /><stop offset="100%" stopColor="#C850C0" />
                          </linearGradient>
                        </defs>
                        <text x="60" y="56" textAnchor="middle" fill="white" fontSize="18" fontWeight="800">{result.week}</text>
                        <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="10">of 40 wks</text>
                      </svg>
                    </div>
                    <p className="font-black mb-2" style={{ color: "#ffbe8f", fontSize: "24px", lineHeight: "1.2" }}>
                      {babyData.sizeEmoji} Size of a {babyData.size}
                    </p>
                    <p className="mb-1" style={{ color: "rgba(255,255,255,0.45)", fontSize: "15px" }}>
                      {result.days} day{result.days !== 1 ? "s" : ""} into week {result.week} · {progressPct}% complete
                    </p>
                    <div className="w-full rounded-full mt-5 mb-2" style={{ height: "6px", background: "rgba(255,255,255,0.08)" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#FF9A5C,#C850C0)" }} />
                    </div>
                    <div className="flex gap-3 justify-center flex-wrap mt-4">
                      {[
                        { label: `Trimester ${result.trimester}`, bg: "rgba(255,154,92,0.2)", color: "#ffbe8f", border: "rgba(255,154,92,0.3)" },
                        { label: `Due: ${result.dueDate}`, bg: "rgba(108,99,255,0.2)", color: "#a89cff", border: "rgba(108,99,255,0.3)" },
                      ].map((b) => (
                        <span key={b.label} className="px-4 py-2 rounded-full text-sm font-bold"
                          style={{ background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Baby development */}
                  <SectionCard delay={1} icon="👶" iconBg="rgba(255,154,92,0.2)" iconBorder="rgba(255,154,92,0.25)"
                    title="Baby Development" titleColor="#ffbe8f" subtitle={`Week ${result.week} milestones`}>
                    <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "16px", lineHeight: "1.9" }}>{babyData.babyDesc}</p>
                  </SectionCard>

                  {/* Mother body */}
                  <SectionCard delay={2} icon="🌸" iconBg="rgba(200,80,192,0.2)" iconBorder="rgba(200,80,192,0.25)"
                    title="Your Body This Week" titleColor="#e879f9" subtitle="What to expect">
                    <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "16px", lineHeight: "1.9" }}>{babyData.motherDesc}</p>
                  </SectionCard>

                  {/* Health tips */}
                  <SectionCard delay={3} icon="💡" iconBg="rgba(60,201,138,0.2)" iconBorder="rgba(60,201,138,0.25)"
                    title="Health Tips" titleColor="#6ee7b7" subtitle={`For week ${result.week}`}>
                    <div className="flex flex-col gap-4">
                      {babyData.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-4 rounded-2xl px-5 py-4"
                          style={{ background: "rgba(60,201,138,0.08)", border: "1px solid rgba(60,201,138,0.15)" }}>
                          <span style={{ color: "#6ee7b7", fontSize: "16px", flexShrink: 0, marginTop: "2px" }}>✓</span>
                          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "15px", lineHeight: "1.75" }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  {/* Quick nav */}
                  <motion.div custom={4} variants={cardAnim} initial="hidden" animate="visible"
                    className="grid grid-cols-3 gap-4">
                    {[
                      { tab: "timeline",  emoji: "📅", label: "Timeline",  color: "#FF9A5C" },
                      { tab: "symptoms",  emoji: "📋", label: "Symptoms",  color: "#C850C0" },
                      { tab: "nutrition", emoji: "🥗", label: "Nutrition", color: "#3CC98A" },
                    ].map((item) => (
                      <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                        className="rounded-2xl flex flex-col items-center gap-3"
                        style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, cursor: "pointer", padding: "24px 16px" }}>
                        <span style={{ fontSize: "30px" }}>{item.emoji}</span>
                        <span className="font-bold" style={{ color: item.color, fontSize: "14px" }}>{item.label}</span>
                      </button>
                    ))}
                  </motion.div>

                  {/* Update LMP */}
                  <motion.button custom={5} variants={cardAnim} initial="hidden" animate="visible"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/pregnancy-tracker")}
                    className="w-full font-bold text-white rounded-2xl"
                    style={{ background: "linear-gradient(135deg,#FF9A5C 0%,#C850C0 50%,#6C63FF 100%)", fontSize: "16px", border: "none", cursor: "pointer", padding: "17px 24px", boxShadow: "0 8px 24px rgba(255,154,92,0.3)", letterSpacing: "0.3px" }}>
                    🔄 Update LMP Date
                  </motion.button>
                </div>
              )}

              {/* ── TIMELINE ── */}
              {activeTab === "timeline" && (
                <div className="rounded-3xl"
                  style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,154,92,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", padding: "36px 32px" }}>
                  <p className="font-bold text-white mb-2" style={{ fontSize: "22px" }}>📅 Week-by-Week Journey</p>
                  <p className="mb-7" style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>Tap any week to see details</p>
                  <WeekTimeline currentWeek={result.week} />
                </div>
              )}

              {/* ── SYMPTOMS ── */}
              {activeTab === "symptoms" && <SymptomTracker />}

              {/* ── REMINDERS ── */}
              {activeTab === "reminders" && (
                <div className="rounded-3xl"
                  style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,154,92,0.2)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", padding: "36px 32px" }}>
                  <RemindersManager />
                </div>
              )}

              {/* ── NUTRITION ── */}
              {activeTab === "nutrition" && <NutritionGuide trimester={result.trimester} />}

              {/* ── AI ASSISTANT ── */}
              {activeTab === "assistant" && <AIAssistant />}

              {/* ── EMERGENCY ── */}
              {activeTab === "emergency" && <EmergencySection />}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
