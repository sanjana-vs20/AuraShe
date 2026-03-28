import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

export default function PeriodScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("track");
  const [lastDate, setLastDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [result, setResult] = useState(null);
  const [mood, setMood] = useState("");
  const [pain, setPain] = useState("");
  const [flow, setFlow] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [hoveredTab, setHoveredTab] = useState("");
  const [hoveredBtn, setHoveredBtn] = useState("");

  const [pmAge, setPmAge] = useState("");
  const [pmSymptoms, setPmSymptoms] = useState({ irregular: false, moodSwings: false, hotFlashes: false, sleepIssues: false });
  const [pmResult, setPmResult] = useState(null);

  function toggleSymptom(key) {
    setPmSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function checkPerimenopause() {
    if (!pmAge) return;
    const age = Number(pmAge);
    const count = Object.values(pmSymptoms).filter(Boolean).length;
    const likely = age > 40 && count >= 2;
    const possible = (age >= 35 && age <= 40 && count >= 2) || (age > 40 && count === 1);
    setPmResult({ likely, possible, age, count });
  }

  function calculate() {
    if (!lastDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last = new Date(lastDate);
    last.setHours(0, 0, 0, 0);

    // Period end = last period start + duration
    const periodEnd = new Date(last);
    periodEnd.setDate(periodEnd.getDate() + Number(periodDuration));

    // Ongoing only if today is within [lastDate, periodEnd)
    const isOngoing = today >= last && today < periodEnd;

    // Next period = last period start + cycle length
    const next = new Date(last);
    next.setDate(next.getDate() + Number(cycleLength));

    const daysLeft = Math.round((next - today) / (1000 * 60 * 60 * 24));

    const ovulation = new Date(next);
    ovulation.setDate(ovulation.getDate() - 14);
    const fertileStart = new Date(ovulation);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setResult({
      daysLeft,
      isOngoing,
      nextDate: next.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      ovulationDate: fmt(ovulation),
      fertileStart: fmt(fertileStart),
      fertileEnd: fmt(ovulation),
    });
  }

  function saveSymptoms() {
    if (!mood || !pain || !flow) return;
    setSavedData({ mood, pain, flow });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function getInsights(data, daysLeft, isOngoing) {
    const tips = [];
    // Symptom-based
    if (data.pain === "High")      tips.push({ emoji: "💧", text: "Rest and stay hydrated today.",              color: "rgba(255,92,138,0.15)",  border: "rgba(255,92,138,0.3)",  textColor: "#FF8FAB" });
    if (data.pain === "Medium")    tips.push({ emoji: "🛋️", text: "A warm compress may ease cramps.",           color: "rgba(255,154,92,0.15)", border: "rgba(255,154,92,0.3)",  textColor: "#ffb380" });
    if (data.mood === "Sad")       tips.push({ emoji: "💜", text: "Take care of your mental health.",           color: "rgba(108,99,255,0.15)", border: "rgba(108,99,255,0.3)",  textColor: "#a89fff" });
    if (data.mood === "Irritated") tips.push({ emoji: "🧘", text: "Try deep breathing or a short walk.",        color: "rgba(200,80,192,0.15)", border: "rgba(200,80,192,0.3)", textColor: "#d89ef0" });
    if (data.flow === "Heavy")     tips.push({ emoji: "🩸", text: "Consider iron-rich foods today.",             color: "rgba(255,92,138,0.15)",  border: "rgba(255,92,138,0.3)",  textColor: "#FF8FAB" });
    if (data.mood === "Happy" && data.pain === "Low") tips.push({ emoji: "✨", text: "You're feeling great! Keep it up.", color: "rgba(60,201,138,0.15)", border: "rgba(60,201,138,0.3)", textColor: "#6ee7b7" });
    // Cycle-phase-based
    if (isOngoing)                              tips.push({ emoji: "🛌", text: "Rest well and use a heating pad for comfort.",    color: "rgba(220,50,80,0.13)",   border: "rgba(220,50,80,0.3)",   textColor: "#ff8fab" });
    if (!isOngoing && daysLeft <= 3 && daysLeft >= 0) tips.push({ emoji: "📅", text: "Period approaching — stock up on essentials.",  color: "rgba(255,154,92,0.15)", border: "rgba(255,154,92,0.3)",  textColor: "#ffb380" });
    if (!isOngoing && daysLeft > 10 && daysLeft <= 17) tips.push({ emoji: "🥚", text: "You may be near ovulation — fertile window ahead.", color: "rgba(200,80,192,0.15)", border: "rgba(200,80,192,0.3)", textColor: "#d89ef0" });
    if (!isOngoing && daysLeft > 17)            tips.push({ emoji: "💤", text: "Maintain good sleep for hormonal balance.",       color: "rgba(108,99,255,0.15)", border: "rgba(108,99,255,0.3)",  textColor: "#a89fff" });
    return tips;
  }

  function getNutritionGuidance(result) {
    if (!result) return null;
    const { isOngoing, daysLeft } = result;
    if (isOngoing) return {
      phase: "Period Phase",
      phaseColor: "#ff8fab",
      phaseBg: "rgba(220,50,80,0.13)",
      phaseBorder: "rgba(220,50,80,0.3)",
      icon: "🩸",
      items: [
        { emoji: "🥬", label: "Iron-rich foods",        detail: "Spinach, lentils, dates, and fortified cereals to replenish iron loss." },
        { emoji: "🍜", label: "Warm, easy-to-digest foods", detail: "Soups, broths, and cooked grains to ease digestive discomfort." },
        { emoji: "💧", label: "Adequate hydration",       detail: "Maintain fluid intake to reduce bloating and fatigue." },
      ],
    };
    if (!isOngoing && daysLeft > 10 && daysLeft <= 17) return {
      phase: "Ovulation Phase",
      phaseColor: "#d89ef0",
      phaseBg: "rgba(200,80,192,0.13)",
      phaseBorder: "rgba(200,80,192,0.3)",
      icon: "🥚",
      items: [
        { emoji: "🥦", label: "Antioxidant-rich vegetables", detail: "Broccoli, kale, and bell peppers to support hormonal health." },
        { emoji: "🍓", label: "Fresh fruits",               detail: "Berries and citrus fruits for vitamin C and cellular support." },
        { emoji: "🥩", label: "Lean protein sources",       detail: "Eggs, legumes, and lean meats to support energy and tissue repair." },
      ],
    };
    if (!isOngoing && daysLeft >= 0 && daysLeft <= 7) return {
      phase: "PMS Phase",
      phaseColor: "#ffb380",
      phaseBg: "rgba(255,140,50,0.13)",
      phaseBorder: "rgba(255,140,50,0.3)",
      icon: "🌙",
      items: [
        { emoji: "🥜", label: "Magnesium-rich foods",  detail: "Nuts, seeds, dark chocolate, and bananas to reduce cramps and mood swings." },
        { emoji: "💧", label: "Consistent hydration", detail: "Reduce sodium intake and increase water to minimise bloating." },
        { emoji: "🫐", label: "Complex carbohydrates", detail: "Oats and whole grains to stabilise blood sugar and reduce irritability." },
      ],
    };
    return {
      phase: "Follicular Phase",
      phaseColor: "#6ee7b7",
      phaseBg: "rgba(60,201,138,0.1)",
      phaseBorder: "rgba(60,201,138,0.25)",
      icon: "🌱",
      items: [
        { emoji: "🥗", label: "Balanced, varied diet",    detail: "Include whole grains, vegetables, and lean proteins for sustained energy." },
        { emoji: "🧀", label: "Calcium and vitamin D",    detail: "Dairy, fortified plant milks, and sunlight exposure for bone health." },
        { emoji: "🥑", label: "Healthy fats",             detail: "Avocado, nuts, and olive oil to support hormonal synthesis." },
      ],
    };
  }


  const TABS = [
    { id: "track",    label: "Track",    emoji: "🗓️" },
    { id: "symptoms", label: "Symptoms", emoji: "🩺" },
    { id: "insights", label: "Insights", emoji: "💡" },
    { id: "peri",     label: "Peri",     emoji: "🌿" },
  ];

  return (
    <div style={s.page}>
      {/* Ambient blobs */}
      <div style={s.blob1} />
      <div style={s.blob2} />
      <div style={s.blob3} />

      <div style={s.shell}>

        {/* ── Top bar ── */}
        <div className="fade-up" style={s.topBar}>
          <button onClick={() => navigate("/goal")} style={s.backBtn}>← Back</button>
          <span style={s.topTitle}>Period Tracker</span>
          <div style={{ width: 64 }} />
        </div>

        {/* ── HERO ── */}
        <div className="fade-up-1" style={{
          ...s.hero,
          ...(result?.isOngoing
            ? { background: "linear-gradient(135deg,rgba(220,50,80,0.45) 0%,rgba(200,80,192,0.35) 60%,rgba(108,99,255,0.3) 100%)", boxShadow: "0 20px 60px rgba(220,50,80,0.3), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }
            : result && result.daysLeft <= 3 && result.daysLeft >= 0
            ? { background: "linear-gradient(135deg,rgba(255,140,50,0.4) 0%,rgba(200,80,192,0.32) 60%,rgba(108,99,255,0.28) 100%)", boxShadow: "0 20px 60px rgba(255,140,50,0.25), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" }
            : {}),
        }}>
          <div style={s.heroGlow} />
          <div style={s.heroGlow2} />
          <p style={s.heroEyebrow}>
            {result?.isOngoing ? "🩸 Period Status" : "🌸 Next Period"}
          </p>
          {result ? (
            <>
              <p style={s.heroDays}>
                {result.isOngoing ? "Ongoing" : result.daysLeft === 0 ? "Today" : result.daysLeft}
                {!result.isOngoing && result.daysLeft > 0 && <span style={s.heroDaysUnit}> days</span>}
              </p>
              <p style={s.heroDate}>
                {result.isOngoing
                  ? "🩸 Period is ongoing — rest and stay comfortable"
                  : result.daysLeft === 0
                  ? "🌸 Period starts today"
                  : `📅 Next: ${result.nextDate}`}
              </p>
            </>
          ) : (
            <>
              <p style={s.heroDays}>—</p>
              <p style={s.heroDate}>Enter your last period date to predict</p>
            </>
          )}
          <div style={s.heroStats}>
            <div style={s.heroStat}>
              <span style={s.heroStatVal}>{cycleLength}d</span>
              <span style={s.heroStatLabel}>Cycle</span>
            </div>
            <div style={s.heroStatDivider} />
            <div style={s.heroStat}>
              <span style={s.heroStatVal}>
                {result
                  ? result.isOngoing ? "🩸"
                  : result.daysLeft === 0 ? "Today"
                  : `${result.daysLeft}d`
                  : "—"}
              </span>
              <span style={s.heroStatLabel}>Until period</span>
            </div>
            <div style={s.heroStatDivider} />
            <div style={s.heroStat}>
              <span style={s.heroStatVal}>{periodDuration}d</span>
              <span style={s.heroStatLabel}>Duration</span>
            </div>
            <div style={s.heroStatDivider} />
            <div style={s.heroStat}>
              <span style={s.heroStatVal}>{savedData ? { Happy: "😊", Sad: "😢", Irritated: "😡" }[savedData.mood] : "—"}</span>
              <span style={s.heroStatLabel}>Mood</span>
            </div>
          </div>
        </div>

        {/* ── TODAY'S STATUS ── */}
        {result && (
          <div className="fade-up-2" style={{
            ...s.todayStatus,
            ...(result.isOngoing
              ? { background: "rgba(220,50,80,0.13)", border: "1px solid rgba(220,50,80,0.3)" }
              : result.daysLeft <= 3 && result.daysLeft >= 0
              ? { background: "rgba(255,140,50,0.13)", border: "1px solid rgba(255,140,50,0.3)" }
              : { background: "rgba(60,201,138,0.1)", border: "1px solid rgba(60,201,138,0.25)" }),
          }}>
            <span style={s.todayDot}>
              {result.isOngoing ? "🩸" : result.daysLeft <= 3 && result.daysLeft >= 0 ? "⚠️" : "✅"}
            </span>
            <div>
              <p style={s.todayTitle}>Today's Status</p>
              <p style={{
                ...s.todayMsg,
                color: result.isOngoing ? "#ff8fab" : result.daysLeft <= 3 && result.daysLeft >= 0 ? "#ffb380" : "#6ee7b7",
              }}>
                {result.isOngoing
                  ? "Take rest and stay comfortable"
                  : result.daysLeft <= 3 && result.daysLeft >= 0
                  ? "Your period is approaching — be prepared"
                  : "You are in a normal phase"}
              </p>
            </div>
          </div>
        )}

        {/* ── TAB BAR ── */}
        <div className="fade-up-3" style={s.tabBar}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              onMouseEnter={() => setHoveredTab(t.id)}
              onMouseLeave={() => setHoveredTab("")}
              style={{
                ...s.tabBtn,
                ...(activeTab === t.id ? s.tabBtnActive : {}),
                ...(hoveredTab === t.id && activeTab !== t.id ? s.tabBtnHover : {}),
              }}
            >
              <span style={s.tabEmoji}>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div style={s.tabContent}>

          {/* ════ TRACK TAB ════ */}
          {activeTab === "track" && (
            <div key="track" className="card-appear" style={s.tabPane}>

              {/* Inputs — 3 compact fields in one row */}
              <div style={s.inputRow}>
                <div style={s.inputGroup}>
                  <label style={s.inputLabel}>🌸 Last Period</label>
                  <input type="date" value={lastDate}
                    onChange={e => setLastDate(e.target.value)} style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.inputLabel}>🔄 Cycle (days)</label>
                  <input type="number" min={20} max={45} value={cycleLength}
                    onChange={e => setCycleLength(e.target.value)} style={s.input} />
                </div>
                <div style={s.inputGroup}>
                  <label style={s.inputLabel}>🩸 Duration (days)</label>
                  <input type="number" min={1} max={10} value={periodDuration}
                    onChange={e => setPeriodDuration(e.target.value)} style={s.input} />
                </div>
              </div>

              {/* Calculate button */}
              <button
                onClick={calculate}
                onMouseEnter={() => setHoveredBtn("calc")}
                onMouseLeave={() => setHoveredBtn("")}
                style={{ ...s.primaryBtn, ...(hoveredBtn === "calc" ? s.primaryBtnHover : {}) }}
              >
                Calculate Cycle ✨
              </button>

              {/* Results grid */}
              {result && (
                <div style={s.statsGrid}>
                  <div style={{ ...s.statCard, background: "rgba(255,92,138,0.12)", border: "1px solid rgba(255,92,138,0.25)" }}>
                    <span style={s.statCardEmoji}>🌺</span>
                    <span style={{ ...s.statCardVal, color: "#FF8FAB" }}>
                      {result.isOngoing ? "Ongoing" : result.daysLeft === 0 ? "Today" : `${result.daysLeft} days`}
                    </span>
                    <span style={s.statCardLabel}>
                      {result.isOngoing ? "Period is ongoing" : result.daysLeft === 0 ? "Period starts today" : "Until Period"}
                    </span>
                  </div>
                  <div style={{ ...s.statCard, background: "rgba(200,80,192,0.12)", border: "1px solid rgba(200,80,192,0.25)" }}>
                    <span style={s.statCardEmoji}>💜</span>
                    <span style={{ ...s.statCardVal, color: "#d89ef0" }}>{result.ovulationDate}</span>
                    <span style={s.statCardLabel}>Ovulation Day</span>
                  </div>
                  <div style={{ ...s.statCard, ...s.statCardWide, background: "rgba(108,99,255,0.12)", border: "1px solid rgba(108,99,255,0.25)" }}>
                    <span style={s.statCardEmoji}>🌼</span>
                    <span style={{ ...s.statCardVal, color: "#a89fff" }}>{result.fertileStart} → {result.fertileEnd}</span>
                    <span style={s.statCardLabel}>Fertile Window</span>
                  </div>
                </div>
              )}

              {!result && (
                <div style={s.emptyState}>
                  <p style={s.emptyEmoji}>📊</p>
                  <p style={s.emptyText}>Enter your details above and tap Calculate to see your cycle predictions.</p>
                </div>
              )}
            </div>
          )}

          {/* ════ SYMPTOMS TAB ════ */}
          {activeTab === "symptoms" && (
            <div key="symptoms" className="card-appear" style={s.tabPane}>

              {/* Mood */}
              <div style={s.symptomSection}>
                <p style={s.symptomTitle}>😊 Mood</p>
                <div style={s.chipRow}>
                  {[["Happy", "😊"], ["Sad", "😢"], ["Irritated", "😡"]].map(([val, emoji]) => (
                    <button key={val} onClick={() => setMood(val)}
                      style={{ ...s.chip, ...(mood === val ? s.chipPink : {}) }}>
                      {emoji} {val}
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.symDivider} />

              {/* Pain */}
              <div style={s.symptomSection}>
                <p style={s.symptomTitle}>⚡ Pain Level</p>
                <div style={s.chipRow}>
                  {[["Low", "🟢"], ["Medium", "🟡"], ["High", "🔴"]].map(([val, emoji]) => (
                    <button key={val} onClick={() => setPain(val)}
                      style={{ ...s.chip, ...(pain === val ? s.chipPurple : {}) }}>
                      {emoji} {val}
                    </button>
                  ))}
                </div>
              </div>

              <div style={s.symDivider} />

              {/* Flow */}
              <div style={s.symptomSection}>
                <p style={s.symptomTitle}>💧 Flow Type</p>
                <div style={s.chipRow}>
                  {[["Light", "💧"], ["Medium", "💦"], ["Heavy", "🌊"]].map(([val, emoji]) => (
                    <button key={val} onClick={() => setFlow(val)}
                      style={{ ...s.chip, ...(flow === val ? s.chipPink : {}) }}>
                      {emoji} {val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveSymptoms}
                onMouseEnter={() => setHoveredBtn("save")}
                onMouseLeave={() => setHoveredBtn("")}
                style={{ ...s.primaryBtn, marginTop: "20px", ...(hoveredBtn === "save" ? s.primaryBtnHover : {}) }}
              >
                Save Symptoms 💾
              </button>

              {saved && <div style={s.successMsg}>✅ Symptoms saved successfully</div>}

              {/* Saved summary inline */}
              {savedData && (
                <div style={s.savedSummary}>
                  <p style={s.savedSummaryTitle}>📋 Today's Log</p>
                  <div style={s.savedRow}>
                    <span style={s.savedKey}>Mood</span>
                    <span style={s.savedVal}>{{ Happy: "😊", Sad: "😢", Irritated: "😡" }[savedData.mood]} {savedData.mood}</span>
                  </div>
                  <div style={s.savedRow}>
                    <span style={s.savedKey}>Pain</span>
                    <span style={s.savedVal}>{{ Low: "🟢", Medium: "🟡", High: "🔴" }[savedData.pain]} {savedData.pain}</span>
                  </div>
                  <div style={s.savedRow}>
                    <span style={s.savedKey}>Flow</span>
                    <span style={s.savedVal}>{{ Light: "💧", Medium: "💦", Heavy: "🌊" }[savedData.flow]} {savedData.flow}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "insights" && (
            <div key="insights" className="card-appear" style={s.tabPane}>
              {savedData && result ? (
                <>
                  <p style={s.insightsHeading}>✨ Personalized for You</p>
                  {getInsights(savedData, result.daysLeft, result.isOngoing).map((tip, i) => (
                    <div key={i} className="card-appear"
                      style={{ ...s.tipCard, background: tip.color, border: `1px solid ${tip.border}`, animationDelay: `${i * 0.07}s` }}>
                      <span style={s.tipEmoji}>{tip.emoji}</span>
                      <p style={{ ...s.tipText, color: tip.textColor }}>{tip.text}</p>
                    </div>
                  ))}

                  {/* ── Nutrition Guidance ── */}
                  {(() => {
                    const n = getNutritionGuidance(result);
                    return n ? (
                      <div className="card-appear" style={{ ...s.nutriCard, background: n.phaseBg, border: `1px solid ${n.phaseBorder}` }}>
                        <div style={s.nutriHeader}>
                          <span style={s.nutriIcon}>{n.icon}</span>
                          <div>
                            <p style={s.nutriTitle}>🥑 Nutrition Guidance</p>
                            <p style={{ ...s.nutriPhase, color: n.phaseColor }}>{n.phase}</p>
                          </div>
                        </div>
                        <div style={s.nutriDivider} />
                        {n.items.map((item, i) => (
                          <div key={i} style={s.nutriRow}>
                            <span style={s.nutriRowEmoji}>{item.emoji}</span>
                            <div>
                              <p style={{ ...s.nutriRowLabel, color: n.phaseColor }}>{item.label}</p>
                              <p style={s.nutriRowDetail}>{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {getInsights(savedData, result.daysLeft, result.isOngoing).length === 0 && (
                    <div style={s.emptyState}>
                      <p style={s.emptyEmoji}>🌟</p>
                      <p style={s.emptyText}>Everything looks great! No specific tips right now.</p>
                    </div>
                  )}
                </>
              ) : result ? (
                <>
                  {/* Show nutrition even without symptoms */}
                  {(() => {
                    const n = getNutritionGuidance(result);
                    return n ? (
                      <div className="card-appear" style={{ ...s.nutriCard, background: n.phaseBg, border: `1px solid ${n.phaseBorder}` }}>
                        <div style={s.nutriHeader}>
                          <span style={s.nutriIcon}>{n.icon}</span>
                          <div>
                            <p style={s.nutriTitle}>🥑 Nutrition Guidance</p>
                            <p style={{ ...s.nutriPhase, color: n.phaseColor }}>{n.phase}</p>
                          </div>
                        </div>
                        <div style={s.nutriDivider} />
                        {n.items.map((item, i) => (
                          <div key={i} style={s.nutriRow}>
                            <span style={s.nutriRowEmoji}>{item.emoji}</span>
                            <div>
                              <p style={{ ...s.nutriRowLabel, color: n.phaseColor }}>{item.label}</p>
                              <p style={s.nutriRowDetail}>{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}
                  <div style={s.emptyState}>
                    <p style={s.emptyEmoji}>🩺</p>
                    <p style={s.emptyText}>Log your symptoms in the Symptoms tab for personalised health tips.</p>
                  </div>
                </>
              ) : (
                <div style={s.emptyState}>
                  <p style={s.emptyEmoji}>💡</p>
                  <p style={s.emptyText}>Complete the Track tab and log your symptoms to get personalized insights.</p>
                </div>
              )}
            </div>
          )}

          {/* ════ PERIMENOPAUSE TAB ════ */}
          {activeTab === "peri" && (
            <div key="peri" className="card-appear" style={s.tabPane}>

              <div style={s.inputGroup}>
                <label style={s.inputLabel}>🎂 Your Age</label>
                <input type="number" min={25} max={65} placeholder="e.g. 42"
                  value={pmAge} onChange={e => setPmAge(e.target.value)} style={s.input} />
              </div>

              <div style={s.pmSection}>
                <p style={s.symptomTitle}>🩺 Select Your Symptoms</p>
                <div style={s.pmGrid}>
                  {[
                    { key: "irregular",   label: "Irregular Periods", emoji: "📅" },
                    { key: "moodSwings",  label: "Mood Swings",       emoji: "🌊" },
                    { key: "hotFlashes",  label: "Hot Flashes",       emoji: "🔥" },
                    { key: "sleepIssues", label: "Sleep Issues",      emoji: "😴" },
                  ].map(({ key, label, emoji }) => (
                    <button key={key} onClick={() => toggleSymptom(key)}
                      style={{ ...s.pmToggle, ...(pmSymptoms[key] ? s.pmToggleActive : {}) }}>
                      <span style={s.pmToggleEmoji}>{emoji}</span>
                      <span style={s.pmToggleLabel}>{label}</span>
                      {pmSymptoms[key] && <span style={s.pmToggleCheck}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={checkPerimenopause}
                onMouseEnter={() => setHoveredBtn("peri")}
                onMouseLeave={() => setHoveredBtn("")}
                style={{ ...s.primaryBtn, ...(hoveredBtn === "peri" ? s.primaryBtnHover : {}) }}>
                Check Status 🌿
              </button>

              {pmResult && (
                <div className="card-appear" style={{
                  ...s.pmResultCard,
                  ...(pmResult.likely
                    ? { background: "rgba(255,92,138,0.15)", border: "1px solid rgba(255,92,138,0.35)" }
                    : pmResult.possible
                    ? { background: "rgba(255,154,92,0.15)", border: "1px solid rgba(255,154,92,0.35)" }
                    : { background: "rgba(60,201,138,0.12)", border: "1px solid rgba(60,201,138,0.3)" }),
                }}>
                  <p style={s.pmResultEmoji}>{pmResult.likely ? "⚠️" : pmResult.possible ? "🔔" : "✅"}</p>
                  <p style={{ ...s.pmResultTitle, color: pmResult.likely ? "#FF8FAB" : pmResult.possible ? "#ffb380" : "#6ee7b7" }}>
                    {pmResult.likely
                      ? "You may be in perimenopause stage"
                      : pmResult.possible
                      ? "Some signs detected — monitor closely"
                      : "Low likelihood of perimenopause"}
                  </p>
                  <p style={s.pmResultSub}>
                    {pmResult.likely
                      ? `Age ${pmResult.age} with ${pmResult.count} symptoms — consult a doctor for confirmation.`
                      : pmResult.possible
                      ? `Age ${pmResult.age} with ${pmResult.count} symptom(s) — worth discussing with your doctor.`
                      : `Age ${pmResult.age} with ${pmResult.count} symptom(s) — no strong indicators at this time.`}
                  </p>
                </div>
              )}

              <div style={s.pmTipsWrap}>
                <p style={s.insightsHeading}>💚 General Wellness Tips</p>
                {[
                  { emoji: "🥗", text: "Eat a balanced diet rich in calcium and vitamin D.",     color: "rgba(60,201,138,0.12)",  border: "rgba(60,201,138,0.25)",  textColor: "#6ee7b7" },
                  { emoji: "🏃", text: "Regular exercise helps manage mood and hot flashes.",    color: "rgba(108,99,255,0.12)",  border: "rgba(108,99,255,0.25)",  textColor: "#a89fff" },
                  { emoji: "😴", text: "Maintain a consistent sleep schedule for better rest.",  color: "rgba(200,80,192,0.12)",  border: "rgba(200,80,192,0.25)",  textColor: "#d89ef0" },
                  { emoji: "🧘", text: "Mindfulness and yoga can ease stress and mood swings.", color: "rgba(255,154,92,0.12)",  border: "rgba(255,154,92,0.25)",  textColor: "#ffb380" },
                  { emoji: "🩺", text: "Schedule regular check-ups with your gynaecologist.",   color: "rgba(255,92,138,0.12)",  border: "rgba(255,92,138,0.25)",  textColor: "#FF8FAB" },
                ].map((tip, i) => (
                  <div key={i} style={{ ...s.tipCard, background: tip.color, border: `1px solid ${tip.border}` }}>
                    <span style={s.tipEmoji}>{tip.emoji}</span>
                    <p style={{ ...s.tipText, color: tip.textColor }}>{tip.text}</p>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const glass = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "20px",
};

const s = {
  /* ── Page ── */
  page: { minHeight: "100vh", background: "linear-gradient(145deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", position: "relative", overflowX: "hidden", display: "flex", justifyContent: "center" },
  blob1: { position: "fixed", top: "-120px", right: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,92,138,0.28) 0%,transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  blob2: { position: "fixed", bottom: "-100px", left: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle,rgba(108,99,255,0.22) 0%,transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  blob3: { position: "fixed", top: "40%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle,rgba(200,80,192,0.1) 0%,transparent 65%)", pointerEvents: "none", zIndex: 0 },

  /* ── Shell ── */
  shell: { position: "relative", zIndex: 1, width: "100%", maxWidth: "480px", padding: "0 16px 40px", display: "flex", flexDirection: "column", gap: "16px" },

  /* ── Top bar ── */
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "52px", paddingBottom: "4px" },
  backBtn: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "8px 16px", borderRadius: "100px", backdropFilter: "blur(10px)", letterSpacing: "0.3px", transition: "all 0.2s ease" },
  topTitle: { fontSize: "17px", fontWeight: "700", color: "#fff", letterSpacing: "-0.3px" },

  /* ── Hero ── */
  hero: { ...glass, background: "linear-gradient(135deg,rgba(255,92,138,0.35) 0%,rgba(200,80,192,0.3) 50%,rgba(108,99,255,0.3) 100%)", border: "1px solid rgba(255,255,255,0.18)", padding: "28px 24px 22px", position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(255,92,138,0.25), 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" },
  heroGlow: { position: "absolute", top: "-60px", right: "-60px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,92,138,0.2)", filter: "blur(40px)", pointerEvents: "none" },
  heroGlow2: { position: "absolute", bottom: "-40px", left: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(108,99,255,0.2)", filter: "blur(30px)", pointerEvents: "none" },
  heroEyebrow: { fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", letterSpacing: "0.5px", marginBottom: "6px" },
  heroDays: { fontSize: "56px", fontWeight: "900", color: "#fff", lineHeight: 1, letterSpacing: "-2px", marginBottom: "4px" },
  heroDaysUnit: { fontSize: "22px", fontWeight: "600", letterSpacing: "0px" },
  heroDate: { fontSize: "14px", color: "rgba(255,255,255,0.65)", marginBottom: "20px" },
  heroStats: { display: "flex", alignItems: "center", gap: "0", background: "rgba(0,0,0,0.2)", borderRadius: "14px", padding: "12px 0", border: "1px solid rgba(255,255,255,0.08)" },
  heroStat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" },
  heroStatVal: { fontSize: "16px", fontWeight: "800", color: "#fff" },
  heroStatLabel: { fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "500" },
  heroStatDivider: { width: "1px", height: "32px", background: "rgba(255,255,255,0.12)" },

  /* ── Today's Status ── */
  todayStatus: { display: "flex", alignItems: "center", gap: "14px", padding: "14px 18px", borderRadius: "16px", backdropFilter: "blur(12px)" },
  todayDot:    { fontSize: "22px", flexShrink: 0 },
  todayTitle:  { fontSize: "11px", fontWeight: "600", color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px", marginBottom: "3px" },
  todayMsg:    { fontSize: "14px", fontWeight: "700", lineHeight: 1.3 },

  /* ── Tab bar ── */
  tabBar: { display: "flex", gap: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "16px", padding: "5px", border: "1px solid rgba(255,255,255,0.08)" },
  tabBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 8px", borderRadius: "12px", border: "none", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.25s ease", letterSpacing: "0.2px" },
  tabBtnActive: { background: "linear-gradient(135deg,#FF5C8A,#C850C0)", color: "#fff", boxShadow: "0 4px 16px rgba(255,92,138,0.4)" },
  tabBtnHover: { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" },
  tabEmoji: { fontSize: "15px" },

  /* ── Tab content ── */
  tabContent: { flex: 1 },
  tabPane: { display: "flex", flexDirection: "column", gap: "12px" },

  /* ── Track tab ── */
  inputRow: { display: "flex", gap: "12px" },
  inputGroup: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  inputLabel: { fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.55)", letterSpacing: "0.4px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", backdropFilter: "blur(10px)", colorScheme: "dark", transition: "border 0.2s ease" },
  primaryBtn: { width: "100%", padding: "15px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg,#FF5C8A 0%,#C850C0 50%,#6C63FF 100%)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.3px", transition: "all 0.25s ease", boxShadow: "0 8px 24px rgba(255,92,138,0.35)" },
  primaryBtnHover: { transform: "translateY(-2px) scale(1.02)", boxShadow: "0 14px 36px rgba(255,92,138,0.5)" },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  statCard: { borderRadius: "16px", padding: "16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", backdropFilter: "blur(12px)", transition: "transform 0.2s ease" },
  statCardWide: { gridColumn: "1 / -1" },
  statCardEmoji: { fontSize: "22px" },
  statCardVal: { fontSize: "13px", fontWeight: "700", textAlign: "center" },
  statCardLabel: { fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: "500" },

  /* ── Symptoms tab ── */
  symptomSection: { display: "flex", flexDirection: "column", gap: "10px" },
  symptomTitle: { fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.8)" },
  symDivider: { height: "1px", background: "rgba(255,255,255,0.07)" },
  chipRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  chip: { padding: "9px 16px", borderRadius: "100px", fontSize: "13px", fontWeight: "600", cursor: "pointer", border: "1px solid rgba(255,255,255,0.13)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", transition: "all 0.2s ease" },
  chipPink: { background: "rgba(255,92,138,0.22)", border: "1px solid rgba(255,92,138,0.5)", color: "#FF8FAB" },
  chipPurple: { background: "rgba(108,99,255,0.22)", border: "1px solid rgba(108,99,255,0.5)", color: "#a89fff" },
  successMsg: { padding: "13px 16px", borderRadius: "14px", background: "rgba(60,201,138,0.15)", border: "1px solid rgba(60,201,138,0.3)", color: "#6ee7b7", fontSize: "14px", fontWeight: "600", textAlign: "center" },
  savedSummary: { ...glass, padding: "16px 18px", display: "flex", flexDirection: "column", gap: "10px" },
  savedSummaryTitle: { fontSize: "13px", fontWeight: "700", color: "#a89fff", marginBottom: "2px" },
  savedRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  savedKey: { fontSize: "13px", color: "rgba(255,255,255,0.45)", fontWeight: "500" },
  savedVal: { fontSize: "14px", color: "#fff", fontWeight: "700" },

  /* ── Insights tab ── */
  insightsHeading: { fontSize: "15px", fontWeight: "700", color: "rgba(255,255,255,0.7)", marginBottom: "4px" },
  tipCard: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", borderRadius: "16px", backdropFilter: "blur(10px)" },
  tipEmoji: { fontSize: "20px", flexShrink: 0, marginTop: "1px" },
  tipText: { fontSize: "14px", fontWeight: "600", lineHeight: "1.55" },

  /* ── Empty state ── */
  emptyState: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", gap: "12px", opacity: 0.7 },
  emptyEmoji: { fontSize: "40px" },
  emptyText: { fontSize: "14px", color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: "1.6", maxWidth: "260px" },

  /* ── Nutrition Guidance card ── */
  nutriCard:       { borderRadius: "18px", padding: "18px", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: "0" },
  nutriHeader:     { display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" },
  nutriIcon:       { fontSize: "28px", flexShrink: 0 },
  nutriTitle:      { fontSize: "15px", fontWeight: "800", color: "#fff", marginBottom: "2px" },
  nutriPhase:      { fontSize: "12px", fontWeight: "600", letterSpacing: "0.4px" },
  nutriDivider:    { height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "14px" },
  nutriRow:        { display: "flex", alignItems: "flex-start", gap: "12px", paddingBottom: "12px" },
  nutriRowEmoji:   { fontSize: "18px", flexShrink: 0, marginTop: "2px" },
  nutriRowLabel:   { fontSize: "13px", fontWeight: "700", marginBottom: "3px" },
  nutriRowDetail:  { fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.55", fontWeight: "500" },

  /* ── Perimenopause tab ── */
  pmSection:      { display: "flex", flexDirection: "column", gap: "10px" },
  pmGrid:         { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  pmToggle:       { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "14px 10px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)", cursor: "pointer", transition: "all 0.2s ease", backdropFilter: "blur(10px)", position: "relative" },
  pmToggleActive: { background: "rgba(200,80,192,0.22)", border: "1px solid rgba(200,80,192,0.5)", boxShadow: "0 4px 16px rgba(200,80,192,0.2)" },
  pmToggleEmoji:  { fontSize: "22px" },
  pmToggleLabel:  { fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 1.3 },
  pmToggleCheck:  { position: "absolute", top: "8px", right: "10px", fontSize: "12px", fontWeight: "800", color: "#d89ef0" },
  pmResultCard:   { borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", backdropFilter: "blur(12px)", textAlign: "center" },
  pmResultEmoji:  { fontSize: "36px" },
  pmResultTitle:  { fontSize: "15px", fontWeight: "800", lineHeight: 1.3 },
  pmResultSub:    { fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.55 },
  pmTipsWrap:     { display: "flex", flexDirection: "column", gap: "8px" },
};
