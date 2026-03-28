//update pregnancy tracker ui
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import Card from "../components/Card";
import { GRADIENTS } from "../theme";

const TRIMESTER_COLORS = {
  1: "#FF9A5C",
  2: "#6C63FF",
  3: "#3CC98A",
};

const WEEKS = Array.from({ length: 40 }, (_, i) => {
  const w = i + 1;
  const trimester = w <= 13 ? 1 : w <= 26 ? 2 : 3;
  const sizes = [0.1,0.2,0.3,0.5,0.7,1,1.2,1.5,2,3,4,5.5,7,9,11,14,17,20,24,28,33,38,44,50,55,60,65,68,71,74,77,80,83,86,88,90,92,94,96,100];
  const milestones = {
    4: "❤️ Heart beating",
    8: "🧠 Brain forming",
    12: "👣 Fingers & toes",
    16: "👂 Can hear sounds",
    20: "🦷 Teeth buds form",
    24: "👁️ Eyes can open",
    28: "🫁 Lungs developing",
    32: "🧒 Gaining weight fast",
    36: "💪 Almost ready!",
    40: "🎉 Full term!",
  };
  return { week: w, trimester, size: sizes[i], milestone: milestones[w] || null };
});

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "rgba(20,18,50,0.95)",
      border: `1px solid ${TRIMESTER_COLORS[d.trimester]}55`,
      borderRadius: "14px",
      padding: "12px 16px",
      boxShadow: `0 8px 32px ${TRIMESTER_COLORS[d.trimester]}40`,
    }}>
      <p style={{ color: TRIMESTER_COLORS[d.trimester], fontWeight: "700", fontSize: "13px", marginBottom: "4px" }}>
        Week {d.week}
      </p>
      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
        Baby size: {d.size}% of full term
      </p>
      {d.milestone && (
        <p style={{ color: "#fff", fontSize: "12px", marginTop: "4px" }}>{d.milestone}</p>
      )}
    </div>
  );
};

export default function PregnancyTrackerScreen() {
  const navigate = useNavigate();
  const [dueDate, setDueDate] = useState("");
  const [currentWeek, setCurrentWeek] = useState(null);
  const [activeWeek, setActiveWeek] = useState(null);

  const handleTrack = () => {
    if (!dueDate) return;
    const due = new Date(dueDate);
    const today = new Date();
    const msLeft = due - today;
    const weeksLeft = Math.ceil(msLeft / (7 * 24 * 60 * 60 * 1000));
    const week = Math.max(1, Math.min(40, 40 - weeksLeft));
    setCurrentWeek(week);
    setActiveWeek(week);
  };

  const selected = WEEKS.find((w) => w.week === (activeWeek || currentWeek));
  const trimesterLabel = ["", "First Trimester", "Second Trimester", "Third Trimester"];

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Header */}
      <div style={{ ...styles.header, background: GRADIENTS.orangeHeader }}>
        <button onClick={() => navigate("/")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>🍼</div>
        <h1 style={styles.headerTitle}>Pregnancy Tracker</h1>
        <p style={styles.headerSub}>Your week-by-week journey</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>

        {/* Due Date Input */}
        <div className="fade-up-1">
          <Card accentColor="#FF9A5C">
            <p style={{ ...styles.cardLabel, color: "#ffbe8f" }}>📅 Enter Your Due Date</p>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleTrack} style={styles.trackBtn}>
              Track My Journey →
            </button>
          </Card>
        </div>

        {currentWeek && (
          <>
            {/* Current Week Summary */}
            <div className="fade-up-1">
              <Card accentColor={TRIMESTER_COLORS[selected?.trimester]}>
                <div style={styles.weekSummary}>
                  <div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
                      {trimesterLabel[selected?.trimester]}
                    </p>
                    <p style={{ fontSize: "36px", fontWeight: "900", color: "#fff", lineHeight: 1 }}>
                      Week {currentWeek}
                    </p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
                      of 40 weeks
                    </p>
                  </div>
                  <div style={styles.progressRing}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7" />
                      <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={TRIMESTER_COLORS[selected?.trimester]}
                        strokeWidth="7"
                        strokeDasharray={`${(currentWeek / 40) * 213.6} 213.6`}
                        strokeLinecap="round"
                        transform="rotate(-90 40 40)"
                        style={{ filter: `drop-shadow(0 0 6px ${TRIMESTER_COLORS[selected?.trimester]})` }}
                      />
                      <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800">
                        {Math.round((currentWeek / 40) * 100)}%
                      </text>
                    </svg>
                  </div>
                </div>
                {selected?.milestone && (
                  <div style={{ ...styles.badge, background: `${TRIMESTER_COLORS[selected.trimester]}25`, color: TRIMESTER_COLORS[selected.trimester], border: `1px solid ${TRIMESTER_COLORS[selected.trimester]}40`, marginTop: "14px" }}>
                    {selected.milestone}
                  </div>
                )}
              </Card>
            </div>

            {/* Growth Chart */}
            <div className="fade-up-2">
              <Card accentColor="#FF9A5C">
                <p style={{ ...styles.cardLabel, color: "#ffbe8f" }}>📈 Baby Growth Chart</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>
                  Tap any point to explore that week
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={WEEKS} onClick={(e) => e?.activePayload && setActiveWeek(e.activePayload[0].payload.week)}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#FF9A5C" />
                        <stop offset="50%" stopColor="#6C63FF" />
                        <stop offset="100%" stopColor="#3CC98A" />
                      </linearGradient>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF9A5C" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#6C63FF" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Weeks", position: "insideBottom", offset: -2, fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine x={currentWeek} stroke="#FF9A5C" strokeDasharray="4 3" strokeWidth={2} label={{ value: "You", fill: "#FF9A5C", fontSize: 11, fontWeight: "700" }} />
                    <Area type="monotone" dataKey="size" stroke="url(#growthGrad)" strokeWidth={3} fill="url(#areaGrad)" dot={false} activeDot={{ r: 6, fill: "#FF9A5C", stroke: "#fff", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Trimester Progress Bars */}
            <div className="fade-up-3">
              <Card accentColor="#FF9A5C">
                <p style={{ ...styles.cardLabel, color: "#ffbe8f" }}>🗓️ Trimester Progress</p>
                {[
                  { label: "First Trimester", range: [1, 13], color: "#FF9A5C" },
                  { label: "Second Trimester", range: [14, 26], color: "#6C63FF" },
                  { label: "Third Trimester", range: [27, 40], color: "#3CC98A" },
                ].map(({ label, range, color }) => {
                  const progress = Math.min(100, Math.max(0, ((currentWeek - range[0]) / (range[1] - range[0])) * 100));
                  const done = currentWeek > range[1];
                  return (
                    <div key={label} style={{ marginBottom: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", color: done ? color : "rgba(255,255,255,0.6)", fontWeight: done ? "700" : "400" }}>{label}</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                          {done ? "✓ Complete" : currentWeek >= range[0] ? `Week ${currentWeek}` : "Upcoming"}
                        </span>
                      </div>
                      <div style={{ height: "8px", borderRadius: "100px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%",
                          width: `${done ? 100 : progress}%`,
                          borderRadius: "100px",
                          background: color,
                          boxShadow: `0 0 10px ${color}80`,
                          transition: "width 0.8s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* Week Explorer */}
            {activeWeek && activeWeek !== currentWeek && (
              <div className="fade-up-1">
                <Card accentColor={TRIMESTER_COLORS[WEEKS[activeWeek - 1].trimester]}>
                  <p style={{ ...styles.cardLabel, color: TRIMESTER_COLORS[WEEKS[activeWeek - 1].trimester] }}>
                    🔍 Week {activeWeek} Preview
                  </p>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: "1.7" }}>
                    {trimesterLabel[WEEKS[activeWeek - 1].trimester]} · Baby growth at {WEEKS[activeWeek - 1].size}% of full term
                  </p>
                  {WEEKS[activeWeek - 1].milestone && (
                    <div style={{ ...styles.badge, background: `${TRIMESTER_COLORS[WEEKS[activeWeek - 1].trimester]}25`, color: TRIMESTER_COLORS[WEEKS[activeWeek - 1].trimester], border: `1px solid ${TRIMESTER_COLORS[WEEKS[activeWeek - 1].trimester]}40`, marginTop: "12px" }}>
                      {WEEKS[activeWeek - 1].milestone}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,154,92,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(247,99,12,0.18) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "48px 16px 36px", color: "#fff", borderRadius: "0 0 36px 36px", boxShadow: "0 16px 48px rgba(255,154,92,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, width: "100%", padding: "24px 16px 80px", boxSizing: "border-box" },
  cardLabel: { fontSize: "16px", fontWeight: "700", marginBottom: "16px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid rgba(255,154,92,0.4)", background: "rgba(255,154,92,0.12)", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box", colorScheme: "dark", marginBottom: "14px" },
  trackBtn: { width: "100%", padding: "13px", borderRadius: "14px", background: GRADIENTS.orangeHeader, border: "none", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.3px" },
  weekSummary: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  progressRing: { flexShrink: 0 },
  badge: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "600" },
};
