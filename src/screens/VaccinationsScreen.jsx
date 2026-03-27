import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

// daysFromBirth: [min, max] days after birth when vaccine is due
const schedule = [
  { age: "At Birth (within 24 hrs)", vaccines: ["BCG", "OPV-0", "Hepatitis B (Birth dose)"], daysFromBirth: [0, 1] },
  { age: "6 Weeks (1.5 months)", vaccines: ["Pentavalent-1", "OPV-1", "IPV-1", "Rotavirus-1", "PCV-1"], daysFromBirth: [42, 42] },
  { age: "10 Weeks (2.5 months)", vaccines: ["Pentavalent-2", "OPV-2", "Rotavirus-2"], daysFromBirth: [70, 70] },
  { age: "14 Weeks (3.5 months)", vaccines: ["Pentavalent-3", "OPV-3", "IPV-2", "Rotavirus-3", "PCV-2"], daysFromBirth: [98, 98] },
  { age: "9–12 Months", vaccines: ["MR-1 (Measles-Rubella)", "PCV Booster", "Vitamin A (1st dose)"], daysFromBirth: [273, 365] },
  { age: "16–24 Months", vaccines: ["MR-2", "DPT Booster-1", "OPV Booster", "Vitamin A (2nd dose)"], daysFromBirth: [487, 730] },
  { age: "5–6 Years", vaccines: ["DPT Booster-2"], daysFromBirth: [1825, 2190] },
  { age: "10 Years", vaccines: ["TT (Tetanus)"], daysFromBirth: [3650, 3650] },
  { age: "16 Years", vaccines: ["TT (Tetanus)"], daysFromBirth: [5840, 5840] },
];

function getStatus(daysFromBirth, dob, done) {
  if (done) return "done";
  if (!dob) return "pending";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const birth = new Date(dob);
  birth.setHours(0, 0, 0, 0);
  const daysSinceBirth = Math.floor((today - birth) / 86400000);
  const dueStart = daysFromBirth[0];
  const dueEnd = daysFromBirth[1];

  if (daysSinceBirth > dueEnd) return "overdue";
  if (daysSinceBirth >= dueStart) return "due";
  return "upcoming";
}

function VaccineCard({ item, index, dob, doneMap, onToggle }) {
  const [hovered, setHovered] = useState(false);
  const done = !!doneMap[item.age];
  const status = getStatus(item.daysFromBirth, dob, done);

  const colors = {
    done:     { bg: "rgba(60,201,138,0.12)", border: "rgba(60,201,138,0.4)",  text: "#6ee7b7", badge: "rgba(60,201,138,0.2)",  badgeBorder: "rgba(60,201,138,0.3)",  badgeText: "#6ee7b7" },
    overdue:  { bg: "rgba(255,80,80,0.12)",  border: "rgba(255,80,80,0.45)",  text: "#ff8080", badge: "rgba(255,80,80,0.18)",  badgeBorder: "rgba(255,80,80,0.3)",   badgeText: "#ff8080" },
    due:      { bg: "rgba(255,190,50,0.12)", border: "rgba(255,190,50,0.45)", text: "#ffd166", badge: "rgba(255,190,50,0.18)", badgeBorder: "rgba(255,190,50,0.3)",  badgeText: "#ffd166" },
    upcoming: { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", text: "#fff",   badge: "rgba(255,255,255,0.08)", badgeBorder: "rgba(255,255,255,0.12)", badgeText: "rgba(255,255,255,0.7)" },
    pending:  { bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)", text: "#fff",   badge: "rgba(255,255,255,0.08)", badgeBorder: "rgba(255,255,255,0.12)", badgeText: "rgba(255,255,255,0.7)" },
  };
  const c = colors[status];

  const statusLabel = { done: "✓ Done", overdue: "⚠ Overdue", due: "🔔 Due Now", upcoming: null, pending: null };

  return (
    <div
      className={`fade-up-${(index % 5) + 1}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? c.bg.replace("0.12", "0.18").replace("0.06", "0.1") : c.bg,
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        padding: "20px",
        border: `1px solid ${c.border}`,
        boxShadow: status === "overdue" ? "0 8px 24px rgba(255,80,80,0.2)" : status === "due" ? "0 8px 24px rgba(255,190,50,0.2)" : status === "done" ? "0 8px 24px rgba(60,201,138,0.2)" : "0 4px 16px rgba(0,0,0,0.2)",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "700", color: c.text }}>{item.age}</p>
          {statusLabel[status] && (
            <p style={{ fontSize: "11px", fontWeight: "600", color: c.text, opacity: 0.85, marginTop: "3px" }}>
              {statusLabel[status]}
            </p>
          )}
        </div>
        <button
          onClick={() => onToggle(item.age)}
          style={{
            background: done ? "#3CC98A" : status === "overdue" ? "rgba(255,80,80,0.25)" : "rgba(255,255,255,0.1)",
            border: `1px solid ${done ? "#3CC98A" : c.border}`,
            color: "#fff",
            fontSize: "12px",
            fontWeight: "600",
            padding: "5px 14px",
            borderRadius: "100px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          {done ? "✓ Done" : "Mark Done"}
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {item.vaccines.map(v => (
          <span key={v} style={{
            background: c.badge,
            border: `1px solid ${c.badgeBorder}`,
            color: c.badgeText,
            fontSize: "12px",
            fontWeight: "500",
            padding: "4px 12px",
            borderRadius: "100px",
          }}>{v}</span>
        ))}
      </div>
    </div>
  );
}

export default function VaccinationsScreen() {
  const navigate = useNavigate();
  const [dob, setDob] = useState(() => localStorage.getItem("baby_dob") || "");
  const [dobInput, setDobInput] = useState(dob);
  const [doneMap, setDoneMap] = useState(() => JSON.parse(localStorage.getItem("vaccine_done") || "{}"));

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Fire notifications for due vaccines
  useEffect(() => {
    if (!dob || Notification.permission !== "granted") return;
    schedule.forEach(item => {
      const status = getStatus(item.daysFromBirth, dob, !!doneMap[item.age]);
      if (status === "due") {
        new Notification("💉 Vaccination Due!", {
          body: `${item.age}: ${item.vaccines.join(", ")}`,
          icon: "/favicon.ico",
        });
      }
    });
  }, [dob]);

  function saveDob() {
    if (!dobInput) return;
    setDob(dobInput);
    localStorage.setItem("baby_dob", dobInput);
  }

  function toggleDone(age) {
    const updated = { ...doneMap, [age]: !doneMap[age] };
    if (!updated[age]) delete updated[age];
    setDoneMap(updated);
    localStorage.setItem("vaccine_done", JSON.stringify(updated));
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={{ ...styles.header, background: GRADIENTS.greenHeader }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>💉</div>
        <h1 style={styles.headerTitle}>Vaccinations</h1>
        <p style={styles.headerSub}>Track your newborn's vaccination schedule</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        {/* DOB input */}
        <div style={styles.dobCard}>
          <p style={styles.dobLabel}>🍼 Baby's Date of Birth</p>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="date"
              value={dobInput}
              onChange={e => setDobInput(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              style={styles.dobInput}
            />
            <button onClick={saveDob} style={styles.dobBtn}>Set</button>
          </div>
          {dob && <p style={styles.dobSet}>DOB: {new Date(dob).toLocaleDateString()}</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {schedule.map((item, i) => (
            <VaccineCard key={item.age} item={item} index={i} dob={dob} doneMap={doneMap} onToggle={toggleDone} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(60,201,138,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,160,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(60,201,138,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
  dobCard: { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "20px", marginBottom: "24px", backdropFilter: "blur(20px)" },
  dobLabel: { fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "12px" },
  dobInput: { flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", colorScheme: "dark" },
  dobBtn: { background: GRADIENTS.primary, border: "none", color: "#fff", fontWeight: "700", fontSize: "13px", padding: "10px 20px", borderRadius: "12px", cursor: "pointer" },
  dobSet: { fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "10px" },
};
