import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ── helpers ── */
const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtFull = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function calcCycle(lastDate, cycleLen, periodDur) {
  const today = new Date(); today.setHours(0,0,0,0);
  const last  = new Date(lastDate); last.setHours(0,0,0,0);
  const next  = new Date(last); next.setDate(next.getDate() + +cycleLen);
  const ovul  = new Date(next); ovul.setDate(ovul.getDate() - 14);
  const fStart= new Date(ovul); fStart.setDate(fStart.getDate() - 5);
  const periodEnd = new Date(last); periodEnd.setDate(periodEnd.getDate() + +periodDur);
  const cycleDay  = Math.round((today - last) / 86400000) + 1;
  const daysLeft  = Math.round((next - today) / 86400000);
  return { today, last, next, ovul, fStart, periodEnd, cycleDay, daysLeft,
    isOngoing: today >= last && today < periodEnd };
}

function getCycleLabel(len) {
  const n = +len;
  if (n <= 24) return "Short";
  if (n <= 31) return "Normal";
  return "Long";
}

/* ── SVG ring chart ── */
function CycleRing({ cycleLen, periodDur, cycleDay }) {
  const cx = 150, cy = 150, R = 110, stroke = 28;
  const total = +cycleLen;
  const toAngle = days => (days / total) * 360;
  const polar = (deg, r) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const arc = (startDeg, endDeg, color, key) => {
    const gap = 2;
    const s = startDeg + gap / 2;
    const e = endDeg   - gap / 2;
    const large = (e - s) > 180 ? 1 : 0;
    const [x1,y1] = polar(s, R);
    const [x2,y2] = polar(e, R);
    return (
      <path key={key}
        d={`M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" />
    );
  };

  const menstrualEnd  = toAngle(+periodDur);
  const fertileStart  = toAngle(total - 14 - 5);
  const ovulStart     = toAngle(total - 14);
  const ovulEnd       = toAngle(total - 13);
  const safeEnd       = 360;

  const segments = [
    { s: 0,            e: menstrualEnd,  color: "#FF5C8A", label: "Menstrual", days: `${periodDur}d` },
    { s: menstrualEnd, e: fertileStart,  color: "#374151", label: "Safe",      days: `${Math.round(total-14-5-periodDur)}d` },
    { s: fertileStart, e: ovulStart,     color: "#3CC98A", label: "Fertile",   days: "5d" },
    { s: ovulStart,    e: ovulEnd,       color: "#FBBF24", label: "Ovulation", days: "1d" },
    { s: ovulEnd,      e: safeEnd,       color: "#374151", label: "Safe",      days: `${Math.round(total - (total-13))}d` },
  ];

  const markerDeg = toAngle(Math.min(cycleDay - 1, total - 1));
  const [mx, my] = polar(markerDeg, R);

  // ovulation date label
  const ovulDeg = toAngle(total - 14);
  const [ox, oy] = polar(ovulDeg, R + 26);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* track */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        {segments.map((seg,i) => arc(seg.s, seg.e, seg.color, i))}
        {/* current day marker */}
        <circle cx={mx} cy={my} r={10} fill="#fff" stroke="#FBBF24" strokeWidth={3}
          style={{ filter:"drop-shadow(0 0 6px #FBBF24)" }} />
        {/* center text */}
        <text x={cx} y={cy-22} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="600" letterSpacing="2">OVULATION</text>
        <text x={cx} y={cy+4}  textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">{fmt(new Date(new Date().setDate(new Date().getDate() + (total - 14 - (cycleDay-1)))))}</text>
        <text x={cx} y={cy+24} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="500">Day {cycleDay}</text>
      </svg>
      {/* legend */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
        {[["#FF5C8A","Menstrual",`${periodDur}d`],["#3CC98A","Fertile","5d"],["#FBBF24","Ovulation","1d"],["#374151","Safe","—"]].map(([c,l,d])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:c }} />
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>{l} <span style={{color:"rgba(255,255,255,0.3)"}}>{d}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TIPS = [
  { icon:"🏋️", text:"Great time for workouts — energy is high" },
  { icon:"🥗", text:"Focus on balanced nutrition" },
  { icon:"📓", text:"Track mood and symptoms daily" },
  { icon:"💧", text:"Stay hydrated and maintain sleep" },
  { icon:"🧘", text:"Mindfulness helps hormonal balance" },
];

export default function FertilityTrackerScreen() {
  const navigate = useNavigate();
  const [lastDate,   setLastDate]   = useState("");
  const [cycleLen,   setCycleLen]   = useState(28);
  const [periodDur,  setPeriodDur]  = useState(5);
  const [result,     setResult]     = useState(null);

  function calculate() {
    if (!lastDate) return;
    setResult(calcCycle(lastDate, cycleLen, periodDur));
  }

  const label = getCycleLabel(cycleLen);

  return (
    <div style={s.page}>
      {/* ambient blobs */}
      <div style={s.blob1}/><div style={s.blob2}/>

      <div style={s.shell}>

        {/* top bar */}
        <div style={s.topBar}>
          <button onClick={() => navigate("/")} style={s.backBtn}>← Back</button>
          <span style={s.topTitle}>Fertility Tracker</span>
          <div style={{width:64}}/>
        </div>

        {/* ── MAIN DASHBOARD: 2-col ── */}
        <div className="fertility-dashboard" style={s.dashboard}>

          {/* LEFT: Cycle Info */}
          <div style={s.card}>
            <p style={s.cardTitle}>Your Cycle Info</p>

            {/* last period */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Last Period Date</label>
              <input type="date" value={lastDate}
                onChange={e => setLastDate(e.target.value)} style={s.input} />
            </div>

            {/* cycle length slider */}
            <div style={s.fieldGroup}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label style={s.label}>Cycle Length</label>
                <span style={s.sliderVal}>{cycleLen}d — <span style={{color:"#FBBF24"}}>{label}</span></span>
              </div>
              <input type="range" min={21} max={45} value={cycleLen}
                onChange={e => setCycleLen(e.target.value)} style={s.slider} />
              <div style={s.sliderLabels}>
                <span>Short<br/><span style={s.sliderSub}>21–24</span></span>
                <span style={{textAlign:"center"}}>Normal<br/><span style={s.sliderSub}>25–31</span></span>
                <span style={{textAlign:"right"}}>Long<br/><span style={s.sliderSub}>32–45</span></span>
              </div>
            </div>

            {/* period duration */}
            <div style={s.fieldGroup}>
              <label style={s.label}>Period Duration</label>
              <input type="number" min={1} max={10} value={periodDur}
                onChange={e => setPeriodDur(e.target.value)} style={s.input} />
            </div>
          </div>

          {/* RIGHT: Ring chart */}
          <div style={{ ...s.card, alignItems:"center", justifyContent:"center" }}>
            <CycleRing
              cycleLen={cycleLen}
              periodDur={periodDur}
              cycleDay={result ? result.cycleDay : 1}
            />
          </div>
        </div>

        {/* ── Calculate button ── */}
        <button onClick={calculate} style={s.calcBtn}>
          ✨ Calculate Fertility Window →
        </button>

        {/* ── Info Cards ── */}
        {result && (
          <div className="fertility-info-row" style={s.infoRow}>
            {[
              { icon:"🌿", label:"Fertile Window",  val:`${fmt(result.fStart)} – ${fmt(result.ovul)}`,  color:"#3CC98A", bg:"rgba(60,201,138,0.12)", border:"rgba(60,201,138,0.3)" },
              { icon:"🥚", label:"Peak Ovulation",  val:fmtFull(result.ovul),                           color:"#FBBF24", bg:"rgba(251,191,36,0.12)",  border:"rgba(251,191,36,0.3)"  },
              { icon:"📅", label:"Next Period",     val:fmtFull(result.next),                           color:"#FF5C8A", bg:"rgba(255,92,138,0.12)",  border:"rgba(255,92,138,0.3)"  },
            ].map(c => (
              <div key={c.label} style={{ ...s.infoCard, background:c.bg, borderColor:c.border }}>
                <span style={{ fontSize:22 }}>{c.icon}</span>
                <span style={{ ...s.infoCardVal, color:c.color }}>{c.val}</span>
                <span style={s.infoCardLabel}>{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Safe Phase Tips ── */}
        <div style={s.card}>
          <p style={s.cardTitle}>🌿 Safe Phase Tips</p>
          <p style={s.cardSub}>Based on your current cycle phase</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:10 }}>
            {TIPS.map((t,i) => (
              <div key={i} style={s.tipRow}>
                <span style={{ fontSize:18 }}>{t.icon}</span>
                <span style={s.tipText}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Best Time to Conceive ── */}
        {result && (
          <div style={s.conceiveCard}>
            <p style={s.conceiveLabel}>⭐ Best Time to Conceive</p>
            <p style={s.conceiveDate}>{fmt(result.fStart)} – {fmtFull(result.ovul)}</p>
            <p style={s.concieveSub}>Your fertile window — highest chance of conception</p>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── styles ── */
const glass = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 20,
};

const s = {
  page: { minHeight:"100vh", background:"linear-gradient(145deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", display:"flex", justifyContent:"center", position:"relative", overflowX:"hidden" },
  blob1: { position:"fixed", top:"-100px", right:"-80px", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,92,138,0.25) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 },
  blob2: { position:"fixed", bottom:"-80px", left:"-60px", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(108,99,255,0.2) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 },

  shell: { position:"relative", zIndex:1, width:"100%", maxWidth:900, padding:"0 16px 40px", display:"flex", flexDirection:"column", gap:16 },

  topBar: { display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:52, paddingBottom:4 },
  backBtn: { background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.18)", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", padding:"8px 16px", borderRadius:100, backdropFilter:"blur(10px)" },
  topTitle: { fontSize:17, fontWeight:700, color:"#fff", letterSpacing:"-0.3px" },

  /* 2-col dashboard */
  dashboard: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },

  card: { ...glass, padding:20, display:"flex", flexDirection:"column", gap:14 },
  cardTitle: { fontSize:15, fontWeight:700, color:"#fff", marginBottom:2 },
  cardSub:   { fontSize:12, color:"rgba(255,255,255,0.45)", fontWeight:500, marginTop:-8 },

  fieldGroup: { display:"flex", flexDirection:"column", gap:6 },
  label: { fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)", letterSpacing:"0.4px" },
  input: { width:"100%", padding:"11px 14px", borderRadius:14, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.07)", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", colorScheme:"dark" },

  slider: { width:"100%", accentColor:"#FF5C8A", cursor:"pointer" },
  sliderVal: { fontSize:13, fontWeight:700, color:"#fff" },
  sliderLabels: { display:"flex", justifyContent:"space-between", fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:500 },
  sliderSub: { fontSize:10, color:"rgba(255,255,255,0.25)" },

  /* calculate button */
  calcBtn: { width:"100%", height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#FF5C8A 0%,#C850C0 50%,#6C63FF 100%)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", letterSpacing:"0.3px", boxShadow:"0 8px 24px rgba(255,92,138,0.35)" },

  /* info cards row */
  infoRow: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 },
  infoCard: { borderRadius:16, padding:16, border:"1px solid", display:"flex", flexDirection:"column", alignItems:"center", gap:6, backdropFilter:"blur(12px)" },
  infoCardVal: { fontSize:13, fontWeight:700, textAlign:"center" },
  infoCardLabel: { fontSize:11, color:"rgba(255,255,255,0.45)", fontWeight:500 },

  /* tips */
  tipRow: { display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" },
  tipText: { fontSize:13, color:"rgba(255,255,255,0.7)", fontWeight:500 },

  /* conceive card */
  conceiveCard: { ...glass, padding:24, display:"flex", flexDirection:"column", alignItems:"center", gap:6, background:"rgba(251,191,36,0.08)", borderColor:"rgba(251,191,36,0.25)" },
  conceiveLabel: { fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.5)", letterSpacing:"0.5px" },
  conceiveDate:  { fontSize:26, fontWeight:800, color:"#FBBF24", letterSpacing:"-0.5px" },
  concieveSub:   { fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:500 },
};
