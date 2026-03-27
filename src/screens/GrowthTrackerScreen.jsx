import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

// WHO standard ranges [normal_min, normal_max] for weight (kg) by age group
const ageGroups = [
  { label: "At Birth",     weightMin: 2.5,  weightMax: 4.0,  heightMin: 46, heightMax: 54 },
  { label: "1 Month",      weightMin: 3.4,  weightMax: 5.7,  heightMin: 50, heightMax: 58 },
  { label: "2 Months",     weightMin: 4.3,  weightMax: 7.0,  heightMin: 53, heightMax: 62 },
  { label: "3 Months",     weightMin: 5.0,  weightMax: 7.9,  heightMin: 56, heightMax: 65 },
  { label: "4 Months",     weightMin: 5.6,  weightMax: 8.6,  heightMin: 58, heightMax: 68 },
  { label: "6 Months",     weightMin: 6.4,  weightMax: 9.7,  heightMin: 62, heightMax: 72 },
  { label: "9 Months",     weightMin: 7.2,  weightMax: 10.9, heightMin: 67, heightMax: 77 },
  { label: "12 Months",    weightMin: 7.8,  weightMax: 11.8, heightMin: 71, heightMax: 81 },
  { label: "18 Months",    weightMin: 8.8,  weightMax: 13.2, heightMin: 76, heightMax: 87 },
  { label: "24 Months",    weightMin: 9.7,  weightMax: 14.5, heightMin: 81, heightMax: 93 },
];

function getStatus(value, min, max) {
  if (!value) return null;
  const v = parseFloat(value);
  if (v < min) return { label: "⚠️ Underweight / Short", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)" };
  if (v > max) return { label: "⚠️ Above Range", color: "#6C63FF", bg: "rgba(108,99,255,0.12)", border: "rgba(108,99,255,0.4)" };
  return { label: "✅ Normal", color: "#3CC98A", bg: "rgba(60,201,138,0.12)", border: "rgba(60,201,138,0.4)" };
}

function Bar({ value, min, max, unit }) {
  if (!value) return null;
  const v = parseFloat(value);
  const pct = Math.min(100, Math.max(0, ((v - min * 0.7) / (max * 1.3 - min * 0.7)) * 100));
  const normalStart = ((min - min * 0.7) / (max * 1.3 - min * 0.7)) * 100;
  const normalEnd = ((max - min * 0.7) / (max * 1.3 - min * 0.7)) * 100;
  const status = getStatus(value, min, max);

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ position: "relative", height: "10px", borderRadius: "100px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        {/* Normal range highlight */}
        <div style={{ position: "absolute", left: `${normalStart}%`, width: `${normalEnd - normalStart}%`, height: "100%", background: "rgba(60,201,138,0.3)", borderRadius: "100px" }} />
        {/* Value marker */}
        <div style={{ position: "absolute", left: `${pct}%`, top: "-2px", width: "14px", height: "14px", borderRadius: "50%", background: status?.color || "#fff", transform: "translateX(-50%)", boxShadow: `0 0 8px ${status?.color}` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{min} {unit}</span>
        <span style={{ fontSize: "10px", color: "#3CC98A" }}>Normal: {min}–{max} {unit}</span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{max} {unit}</span>
      </div>
    </div>
  );
}

export default function GrowthTrackerScreen() {
  const navigate = useNavigate();
  const [ageIdx, setAgeIdx] = useState(0);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const ag = ageGroups[ageIdx];
  const wStatus = getStatus(weight, ag.weightMin, ag.weightMax);
  const hStatus = getStatus(height, ag.heightMin, ag.heightMax);

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={{ ...styles.header, background: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)" }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>📊</div>
        <h1 style={styles.headerTitle}>Baby Growth Tracker</h1>
        <p style={styles.headerSub}>Track weight & height with WHO standards</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        {/* Age selector */}
        <p style={styles.sectionLabel}>Select Baby's Age</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
          {ageGroups.map((a, i) => (
            <button key={a.label} onClick={() => { setAgeIdx(i); setWeight(""); setHeight(""); }} style={{
              padding: "8px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", cursor: "pointer",
              background: ageIdx === i ? "#10B981" : "rgba(255,255,255,0.07)",
              border: `1px solid ${ageIdx === i ? "#10B981" : "rgba(255,255,255,0.15)"}`,
              color: ageIdx === i ? "#fff" : "rgba(255,255,255,0.55)",
              boxShadow: ageIdx === i ? "0 4px 14px rgba(16,185,129,0.4)" : "none",
              transition: "all 0.2s ease",
            }}>{a.label}</button>
          ))}
        </div>

        {/* Inputs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1 }}>
            <p style={styles.inputLabel}>⚖️ Weight (kg)</p>
            <input type="number" placeholder="e.g. 6.5" value={weight} onChange={e => setWeight(e.target.value)}
              style={styles.input} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={styles.inputLabel}>📏 Height (cm)</p>
            <input type="number" placeholder="e.g. 65" value={height} onChange={e => setHeight(e.target.value)}
              style={styles.input} />
          </div>
        </div>

        {/* Results */}
        {(weight || height) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {weight && wStatus && (
              <div style={{ background: wStatus.bg, border: `1px solid ${wStatus.border}`, borderRadius: "20px", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.6)" }}>Weight</p>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: wStatus.color }}>{wStatus.label}</p>
                </div>
                <p style={{ fontSize: "22px", fontWeight: "900", color: "#fff" }}>{weight} <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>kg</span></p>
                <Bar value={weight} min={ag.weightMin} max={ag.weightMax} unit="kg" />
              </div>
            )}
            {height && hStatus && (
              <div style={{ background: hStatus.bg, border: `1px solid ${hStatus.border}`, borderRadius: "20px", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "700", color: "rgba(255,255,255,0.6)" }}>Height</p>
                  <p style={{ fontSize: "14px", fontWeight: "800", color: hStatus.color }}>{hStatus.label}</p>
                </div>
                <p style={{ fontSize: "22px", fontWeight: "900", color: "#fff" }}>{height} <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>cm</span></p>
                <Bar value={height} min={ag.heightMin} max={ag.heightMax} unit="cm" />
              </div>
            )}

            {/* Legend */}
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "4px" }}>
              {[["#3CC98A", "Normal"], ["#F59E0B", "Underweight"], ["#6C63FF", "Above range"]].map(([c, l]) => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!weight && !height && (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "14px", marginTop: "16px" }}>
            👆 Enter weight or height to see results
          </p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(16,185,129,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
  sectionLabel: { fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" },
  inputLabel: { fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.5)", marginBottom: "8px" },
  input: { width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "14px", padding: "12px 14px", color: "#fff", fontSize: "16px", outline: "none", boxSizing: "border-box" },
};
