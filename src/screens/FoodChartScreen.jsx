import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const meals = [
  { key: "morning",    label: "Morning",     icon: "🌅" },
  { key: "midMorning", label: "Mid-Morning", icon: "🌤️" },
  { key: "lunch",      label: "Lunch",       icon: "☀️" },
  { key: "evening",    label: "Evening",     icon: "🌇" },
  { key: "dinner",     label: "Dinner",      icon: "🌙" },
  { key: "note",       label: "Note",        icon: "📝" },
];

const chart = [
  {
    age: "0–6 Months",
    accent: "#6C63FF",
    morning: "Breast milk",
    midMorning: "Breast milk",
    lunch: "Breast milk",
    evening: "Breast milk",
    dinner: "Breast milk",
    note: "Only milk, no water/solids",
  },
  {
    age: "6–8 Months",
    accent: "#FF9A5C",
    morning: "Milk",
    midMorning: "Fruit puree",
    lunch: "Rice + dal mash",
    evening: "Milk",
    dinner: "Veg puree",
    note: "Start small quantities",
  },
  {
    age: "8–10 Months",
    accent: "#FF5C8A",
    morning: "Idli / porridge",
    midMorning: "Fruit mash",
    lunch: "Khichdi",
    evening: "Milk",
    dinner: "Dal + rice mash",
    note: "Add variety slowly",
  },
  {
    age: "10–12 Months",
    accent: "#3CC98A",
    morning: "Upma / idli",
    midMorning: "Fruits",
    lunch: "Rice + sambar",
    evening: "Curd / milk",
    dinner: "Chapati + dal",
    note: "Start finger foods",
  },
  {
    age: "1–2 Years",
    accent: "#F59E0B",
    morning: "Idli / dosa / egg",
    midMorning: "Fruits",
    lunch: "Rice + dal + veg",
    evening: "Milk / snacks",
    dinner: "Chapati + sabzi",
    note: "Family foods",
  },
];

export default function FoodChartScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={{ ...styles.header, background: "linear-gradient(135deg, #FF9A5C 0%, #FF5C8A 100%)" }}>
        <button onClick={() => navigate("/newborn")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>🍽️</div>
        <h1 style={styles.headerTitle}>Baby Food Chart</h1>
        <p style={styles.headerSub}>Age-wise feeding guide · 0 to 2 Years</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        {/* Horizontal scroll wrapper */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, ...styles.stickyCol, minWidth: "72px" }}>Age</th>
                {meals.map(m => (
                  <th key={m.key} style={styles.th}>
                    <span style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>{m.icon}</span>
                    {m.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.map((row, i) => (
                <tr key={row.age} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent" }}>
                  {/* Age cell — sticky */}
                  <td style={{ ...styles.td, ...styles.stickyCol, background: i % 2 === 0 ? "#1a1030" : "#160e2a" }}>
                    <div style={{
                      display: "inline-block",
                      background: `${row.accent}22`,
                      border: `1px solid ${row.accent}55`,
                      color: row.accent,
                      borderRadius: "10px",
                      padding: "5px 8px",
                      fontSize: "11px",
                      fontWeight: "800",
                      whiteSpace: "nowrap",
                    }}>
                      {row.age}
                    </div>
                  </td>

                  {meals.map(m => (
                    <td key={m.key} style={{
                      ...styles.td,
                      color: m.key === "note" ? `${row.accent}cc` : "rgba(255,255,255,0.8)",
                      fontStyle: m.key === "note" ? "italic" : "normal",
                      fontSize: m.key === "note" ? "11px" : "12px",
                    }}>
                      {row[m.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div style={styles.legend}>
          {chart.map(row => (
            <div key={row.age} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: row.accent }} />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{row.age}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,154,92,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,138,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(255,154,92,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, padding: "28px 16px 64px" },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(20px)",
    background: "rgba(255,255,255,0.04)",
    WebkitOverflowScrolling: "touch",
  },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "560px" },
  th: {
    padding: "14px 12px",
    fontSize: "11px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    textAlign: "left",
    whiteSpace: "nowrap",
    background: "rgba(255,255,255,0.05)",
  },
  td: {
    padding: "14px 12px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    verticalAlign: "top",
    lineHeight: "1.5",
    minWidth: "110px",
  },
  stickyCol: {
    position: "sticky",
    left: 0,
    zIndex: 2,
    background: "#160e2a",
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "16px",
    padding: "0 4px",
  },
};
