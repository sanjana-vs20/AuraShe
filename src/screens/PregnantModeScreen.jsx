import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

/* ── utils ── */
const fmt     = d => d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
const fmtFull = d => d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });

function calcCycle(lastDate, cycleLen, periodDur) {
  const today = new Date(); today.setHours(0,0,0,0);
  const last  = new Date(lastDate); last.setHours(0,0,0,0);
  const next  = new Date(last); next.setDate(next.getDate() + +cycleLen);
  const ovul  = new Date(next); ovul.setDate(ovul.getDate() - 14);
  const fStart= new Date(ovul); fStart.setDate(fStart.getDate() - 5);
  const periodEnd = new Date(last); periodEnd.setDate(periodEnd.getDate() + +periodDur);
  const cycleDay  = Math.max(1, Math.round((today - last) / 86400000) + 1);
  return { today, last, next, ovul, fStart, periodEnd, cycleDay,
    daysLeft: Math.round((next - today) / 86400000),
    isOngoing: today >= last && today < periodEnd };
}

function getCycleLabel(len) {
  const n = +len;
  if (n <= 24) return "Short";
  if (n <= 31) return "Normal";
  return "Long";
}

/* ── SVG Ring Chart ── */
function CycleRing({ cycleLen, periodDur, cycleDay, ovulDate }) {
  const cx = 155, cy = 155, R = 112, SW = 22, R2 = 88, SW2 = 8;
  const total = +cycleLen;
  const deg   = days => (days / total) * 360;

  const polar = (d, r) => {
    const rad = ((d - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };

  const arc = (s, e, color, key, glowColor) => {
    const GAP = 3, sd = s + GAP/2, ed = e - GAP/2;
    if (ed <= sd) return null;
    const large = (ed - sd) > 180 ? 1 : 0;
    const [x1,y1] = polar(sd, R), [x2,y2] = polar(ed, R);
    return (
      <g key={key}>
        <path d={`M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2}`}
          fill="none" stroke={glowColor || color} strokeWidth={SW + 10}
          strokeLinecap="round" opacity="0.18" style={{filter:`blur(6px)`}}/>
        <path d={`M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2}`}
          fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round"/>
      </g>
    );
  };

  const innerArc = (s, e, color, key) => {
    const GAP = 4, sd = s + GAP/2, ed = e - GAP/2;
    if (ed <= sd) return null;
    const large = (ed - sd) > 180 ? 1 : 0;
    const [x1,y1] = polar(sd, R2), [x2,y2] = polar(ed, R2);
    return <path key={key} d={`M${x1} ${y1} A${R2} ${R2} 0 ${large} 1 ${x2} ${y2}`}
      fill="none" stroke={color} strokeWidth={SW2} strokeLinecap="round" opacity="0.5"/>;
  };

  const mEnd = deg(+periodDur);
  const fS   = deg(total - 19);
  const oS   = deg(total - 14);
  const oE   = deg(total - 13);

  const segs = [
    [0,    mEnd,  "url(#gPink)",   "#FF5C8A", "#FF5C8A"],
    [mEnd, fS,    "#1e1b3a",       null,      null],
    [fS,   oS,    "url(#gGreen)",  "#3CC98A", "#3CC98A"],
    [oS,   oE,    "url(#gYellow)", "#FBBF24", "#FBBF24"],
    [oE,   360,   "#1e1b3a",       null,      null],
  ];

  const innerSegs = [
    [0,    mEnd,  "#FF5C8A"],
    [fS,   oS,    "#3CC98A"],
    [oS,   oE,    "#FBBF24"],
  ];

  const markerDeg = deg(Math.min(cycleDay - 1, total - 1));
  const [mx, my]  = polar(markerDeg, R);
  const [px, py]  = polar(markerDeg, R);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
      <svg width="310" height="310" viewBox="0 0 310 310">
        <defs>
          <linearGradient id="gPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5C8A"/>
            <stop offset="100%" stopColor="#ff2d6f"/>
          </linearGradient>
          <linearGradient id="gGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3CC98A"/>
            <stop offset="100%" stopColor="#00e5a0"/>
          </linearGradient>
          <linearGradient id="gYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24"/>
            <stop offset="100%" stopColor="#ff9f00"/>
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(108,99,255,0.25)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
          <radialGradient id="markerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0"/>
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={R + 18} fill="none" stroke="rgba(108,99,255,0.08)" strokeWidth={2}/>
        <circle cx={cx} cy={cy} r={R + 30} fill="none" stroke="rgba(108,99,255,0.04)" strokeWidth={1}/>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={SW}/>
        <circle cx={cx} cy={cy} r={R2} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={SW2}/>

        {innerSegs.map(([s,e,c],i) => innerArc(s,e,c,`in${i}`))}
        {segs.map(([s,e,c,,g],i) => arc(s,e,c,i,g))}

        <circle cx={cx} cy={cy} r={R - SW/2 - 4} fill="url(#centerGlow)"/>

        {Array.from({length: Math.floor(total/7)}, (_,i) => {
          const tickDeg = deg(i * 7);
          const [tx1,ty1] = polar(tickDeg, R + SW/2 + 6);
          const [tx2,ty2] = polar(tickDeg, R + SW/2 + 12);
          return <line key={i} x1={tx1} y1={ty1} x2={tx2} y2={ty2}
            stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeLinecap="round"/>;
        })}

        <circle cx={px} cy={py} r={18} fill="url(#markerGlow)"
          style={{animation:"glowPulse 2s ease-in-out infinite"}}/>
        <circle cx={mx} cy={my} r={11} fill="#0f0c29" stroke="#FBBF24" strokeWidth={3}
          style={{filter:"drop-shadow(0 0 8px #FBBF24) drop-shadow(0 0 16px #FBBF2488)"}}/>
        <circle cx={mx} cy={my} r={4} fill="#FBBF24"
          style={{filter:"drop-shadow(0 0 4px #FBBF24)"}}/>

        <circle cx={cx} cy={cy} r={62} fill="rgba(15,12,41,0.7)"
          stroke="rgba(255,255,255,0.07)" strokeWidth={1}/>
        <text x={cx} y={cy-22} textAnchor="middle"
          fill="rgba(255,255,255,0.35)" fontSize="9" fontWeight="800" letterSpacing="3">
          OVULATION
        </text>
        <text x={cx} y={cy+4} textAnchor="middle"
          fill="#fff" fontSize="19" fontWeight="800" letterSpacing="-0.5">
          {ovulDate ? fmt(ovulDate) : "--"}
        </text>
        <text x={cx} y={cy+22} textAnchor="middle"
          fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="600">
          Day {cycleDay}
        </text>
      </svg>

      <div style={{display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center"}}>
        {[["#FF5C8A","Menstrual",`${periodDur}d`],
          ["#3CC98A","Fertile","5d"],
          ["#FBBF24","Ovulation","1d"],
          ["rgba(255,255,255,0.15)","Safe","—"]].map(([c,l,d])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:c,
              boxShadow:c.startsWith("rgba") ? "none" : `0 0 8px ${c}99`}}/>
            <span style={{fontSize:11,color:"rgba(255,255,255,0.55)",fontWeight:600}}>
              {l}&nbsp;<span style={{color:"rgba(255,255,255,0.25)",fontWeight:400}}>{d}</span>
            </span>
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

export default function PregnantModeScreen() {
  const navigate = useNavigate();
  const [lastDate,  setLastDate]  = useState("");
  const [cycleLen,  setCycleLen]  = useState(28);
  const [periodDur, setPeriodDur] = useState(5);
  const [result,    setResult]    = useState(null);

  function calculate() {
    if (!lastDate) return;
    setResult(calcCycle(lastDate, cycleLen, periodDur));
  }

  const label = getCycleLabel(cycleLen);

  return (
    <div style={s.page}>
      <div style={s.blob1}/><div style={s.blob2}/>

      {/* ── Full-width Gradient Header ── */}
      <div style={s.header}>
        <div style={s.headerGlow} />
        <div style={s.headerGlow2} />
        <div style={s.headerInner}>
          <button onClick={() => navigate("/goal")} style={s.backBtn}>← Back</button>
          <div style={s.headerEmoji}>🤰</div>
          <h1 style={s.headerTitle}>Get Pregnant</h1>
          <p style={s.headerSub}>Track fertility &amp; ovulation windows</p>
        </div>
      </div>

      <div style={s.shell}>

        {/* ── 2-col dashboard ── */}
        <div style={s.dashboard}>

          {/* LEFT: Cycle Info */}
          <div style={s.card}>
            <p style={s.cardTitle}>Your Cycle Info</p>

            <div style={s.field}>
              <label style={s.label}>Last Period Date</label>
              <input type="date" value={lastDate}
                onChange={e => setLastDate(e.target.value)} style={s.input}/>
            </div>

            <div style={s.field}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <label style={s.label}>Cycle Length</label>
                <span style={s.sliderBadge}>{cycleLen}d —&nbsp;
                  <span style={{color:"#FBBF24"}}>{label}</span>
                </span>
              </div>
              <input type="range" min={21} max={45} value={cycleLen}
                onChange={e => setCycleLen(e.target.value)} style={s.slider}/>
              <div style={s.sliderRow}>
                <span style={s.sliderTick}>Short<br/><span style={s.sliderSub}>21–24</span></span>
                <span style={{...s.sliderTick,textAlign:"center"}}>Normal<br/><span style={s.sliderSub}>25–31</span></span>
                <span style={{...s.sliderTick,textAlign:"right"}}>Long<br/><span style={s.sliderSub}>32–45</span></span>
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Period Duration (days)</label>
              <input type="number" min={1} max={10} value={periodDur}
                onChange={e => setPeriodDur(e.target.value)} style={s.input}/>
            </div>
          </div>

          {/* RIGHT: Ring chart */}
          <div style={{...s.card, alignItems:"center", justifyContent:"center"}}>
            <CycleRing
              cycleLen={cycleLen}
              periodDur={periodDur}
              cycleDay={result ? result.cycleDay : 1}
              ovulDate={result ? result.ovul : null}
            />
          </div>
        </div>

        {/* ── Calculate button ── */}
        <button onClick={calculate} style={s.calcBtn}>
          ✨ Calculate Fertility Window →
        </button>

        {/* ── 3 Info Cards ── */}
        {result && (
          <div style={s.infoRow}>
            {[
              { icon:"🌿", label:"Fertile Window",
                val:`${fmt(result.fStart)} – ${fmt(result.ovul)}`,
                color:"#3CC98A", bg:"rgba(60,201,138,0.1)", border:"rgba(60,201,138,0.28)" },
              { icon:"🥚", label:"Peak Ovulation",
                val:fmtFull(result.ovul),
                color:"#FBBF24", bg:"rgba(251,191,36,0.1)", border:"rgba(251,191,36,0.28)" },
              { icon:"📅", label:"Next Period",
                val:fmtFull(result.next),
                color:"#FF5C8A", bg:"rgba(255,92,138,0.1)", border:"rgba(255,92,138,0.28)" },
            ].map(c => (
              <div key={c.label} style={{...s.infoCard, background:c.bg, borderColor:c.border}}>
                <span style={{fontSize:20}}>{c.icon}</span>
                <span style={{...s.infoVal, color:c.color}}>{c.val}</span>
                <span style={s.infoLabel}>{c.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Safe Phase Tips ── */}
        <div style={s.card}>
          <p style={s.cardTitle}>🌿 Safe Phase Tips</p>
          <p style={s.cardSub}>Based on your current cycle phase</p>
          <div style={{display:"flex",flexDirection:"column",gap:0,marginTop:8}}>
            {TIPS.map((t,i) => (
              <div key={i} style={{
                ...s.tipRow,
                borderBottom: i < TIPS.length-1 ? "1px solid rgba(255,255,255,0.05)" : "none"
              }}>
                <span style={{fontSize:17}}>{t.icon}</span>
                <span style={s.tipText}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Best Time to Conceive ── */}
        {result && (
          <div style={s.conceiveCard}>
            <p style={s.conceiveEyebrow}>⭐ Best Time to Conceive</p>
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
  background:"rgba(255,255,255,0.05)",
  backdropFilter:"blur(20px)",
  WebkitBackdropFilter:"blur(20px)",
  border:"1px solid rgba(255,255,255,0.09)",
  borderRadius:20,
};

const s = {
  page:  { minHeight:"100vh", background:"linear-gradient(145deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", display:"flex", flexDirection:"column", alignItems:"center", position:"relative", overflowX:"hidden" },
  blob1: { position:"fixed", top:"-100px", right:"-80px", width:340, height:340, borderRadius:"50%", background:"radial-gradient(circle,rgba(108,99,255,0.28) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 },
  blob2: { position:"fixed", bottom:"-80px", left:"-60px", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(60,201,138,0.18) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 },

  /* Header */
  header:      { position:"relative", zIndex:1, overflow:"hidden", width:"100%", background:GRADIENTS.purpleHeader, borderRadius:"0 0 40px 40px", boxShadow:"0 16px 48px rgba(108,99,255,0.45), 0 4px 16px rgba(0,0,0,0.3)", color:"#fff" },
  headerInner: { maxWidth:860, margin:"0 auto", padding:"56px 32px 44px", display:"flex", flexDirection:"column", alignItems:"flex-start", textAlign:"left" },
  headerGlow:  { position:"absolute", top:"-60px", right:"-60px", width:"220px", height:"220px", borderRadius:"50%", background:"rgba(255,255,255,0.08)", pointerEvents:"none" },
  headerGlow2: { position:"absolute", bottom:"-40px", left:"-40px", width:"160px", height:"160px", borderRadius:"50%", background:"rgba(108,99,255,0.2)", filter:"blur(30px)", pointerEvents:"none" },
  backBtn:     { background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.25)", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", padding:"8px 18px", borderRadius:100, marginBottom:28, display:"inline-block", backdropFilter:"blur(10px)", letterSpacing:"0.3px", alignSelf:"flex-start" },
  headerEmoji: { fontSize:56, marginBottom:16, filter:"drop-shadow(0 4px 12px rgba(255,255,255,0.3))", display:"block", textAlign:"left" },
  headerTitle: { fontSize:34, fontWeight:900, marginBottom:8, letterSpacing:"-0.5px", lineHeight:1.2, textAlign:"left" },
  headerSub:   { fontSize:16, opacity:0.78, lineHeight:1.5, textAlign:"left" },

  shell: { position:"relative", zIndex:1, width:"100%", maxWidth:860, padding:"24px 16px 40px", display:"flex", flexDirection:"column", gap:16 },

  /* 2-col */
  dashboard: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },

  card:      { ...glass, padding:20, display:"flex", flexDirection:"column", gap:14 },
  cardTitle: { fontSize:15, fontWeight:700, color:"#fff" },
  cardSub:   { fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:500, marginTop:-8 },

  field:      { display:"flex", flexDirection:"column", gap:7 },
  label:      { fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.45)", letterSpacing:"0.4px" },
  input:      { width:"100%", padding:"11px 14px", borderRadius:13, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.07)", color:"#fff", fontSize:14, outline:"none", boxSizing:"border-box", colorScheme:"dark" },

  slider:      { width:"100%", accentColor:"#6C63FF", cursor:"pointer", margin:"2px 0" },
  sliderBadge: { fontSize:12, fontWeight:700, color:"#fff" },
  sliderRow:   { display:"flex", justifyContent:"space-between" },
  sliderTick:  { fontSize:11, color:"rgba(255,255,255,0.35)", fontWeight:500, lineHeight:1.4 },
  sliderSub:   { fontSize:10, color:"rgba(255,255,255,0.2)" },

  calcBtn: { width:"100%", height:52, borderRadius:16, border:"none", background:"linear-gradient(135deg,#6C63FF 0%,#C850C0 50%,#3CC98A 100%)", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", letterSpacing:"0.3px", boxShadow:"0 8px 24px rgba(108,99,255,0.35)" },

  infoRow:   { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 },
  infoCard:  { borderRadius:16, padding:16, border:"1px solid", display:"flex", flexDirection:"column", alignItems:"center", gap:5, backdropFilter:"blur(12px)" },
  infoVal:   { fontSize:12, fontWeight:700, textAlign:"center", lineHeight:1.4 },
  infoLabel: { fontSize:11, color:"rgba(255,255,255,0.4)", fontWeight:500 },

  tipRow:  { display:"flex", alignItems:"center", gap:10, padding:"9px 0" },
  tipText: { fontSize:13, color:"rgba(255,255,255,0.65)", fontWeight:500 },

  conceiveCard:    { ...glass, padding:24, display:"flex", flexDirection:"column", alignItems:"center", gap:6, background:"rgba(251,191,36,0.07)", borderColor:"rgba(251,191,36,0.22)" },
  conceiveEyebrow: { fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.45)", letterSpacing:"0.5px" },
  conceiveDate:    { fontSize:26, fontWeight:800, color:"#FBBF24", letterSpacing:"-0.5px" },
  concieveSub:     { fontSize:12, color:"rgba(255,255,255,0.35)", fontWeight:500 },
};
