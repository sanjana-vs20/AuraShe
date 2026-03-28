import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

const sections = [
  {
    emoji: "⚙️",
    title: "App Settings",
    accent: "#6C63FF",
    glow: "rgba(108,99,255,0.35)",
    items: ["Language", "Theme", "Notifications", "App Version"],
  },
  {
    emoji: "📊",
    title: "Graphs and Reports",
    accent: "#FF9A5C",
    glow: "rgba(255,154,92,0.35)",
    items: ["Cycle History Chart", "Ovulation Report", "Symptom Trends", "Export Data"],
  },
  {
    emoji: "🌙",
    title: "Cycle and Ovulation",
    accent: "#FF5C8A",
    glow: "rgba(255,92,138,0.35)",
    items: ["Average Cycle Length", "Period Duration", "Ovulation Window", "Luteal Phase"],
  },
  {
    emoji: "🔔",
    title: "Reminders",
    accent: "#3CC98A",
    glow: "rgba(60,201,138,0.35)",
    items: ["Period Reminder", "Pill Reminder", "Ovulation Alert", "Appointment Reminder"],
  },
  {
    emoji: "🔒",
    title: "Privacy Settings",
    accent: "#C850C0",
    glow: "rgba(200,80,192,0.35)",
    items: ["App Lock / PIN", "Data Sharing", "Delete Account", "Privacy Policy"],
  },
];

function SettingSection({ section }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: "12px" }}>
      <div onClick={() => setOpen(!open)} style={{ ...s.sectionHeader, borderColor: open ? section.accent + "55" : "rgba(255,255,255,0.1)", background: open ? `linear-gradient(145deg, ${section.accent}22, ${section.accent}08)` : "rgba(255,255,255,0.06)" }}>
        <div style={{ ...s.iconBox, background: `linear-gradient(135deg, ${section.accent}40, ${section.accent}15)`, border: `1px solid ${section.accent}40`, boxShadow: `0 4px 12px ${section.accent}30` }}>
          {section.emoji}
        </div>
        <span style={s.sectionTitle}>{section.title}</span>
        <span style={{ ...s.chevron, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </div>

      {open && (
        <div style={s.itemList}>
          {section.items.map((item) => (
            <div key={item} style={s.item}>
              <span style={s.itemText}>{item}</span>
              <span style={{ color: section.accent, fontSize: "13px" }}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      {/* Floating hamburger button */}
      <button onClick={() => setDrawerOpen(true)} style={s.hamburger}>
        <span style={s.line} />
        <span style={s.line} />
        <span style={s.line} />
      </button>

      {/* Drawer overlay */}
      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={s.overlay} />}

      {/* Drawer */}
      <div style={{ ...s.drawer, transform: drawerOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <button onClick={() => setDrawerOpen(false)} style={s.closeBtn}>✕</button>
        <p style={s.drawerBrand}>💜 AuraShe</p>
        {[
          { label: "🏠 Home", path: "/goal" },
          { label: "🌸 Period Tracker", path: "/period" },
          { label: "🤰 Fertility", path: "/fertility" },
          { label: "🍼 Pregnancy", path: "/pregnancy-tracker" },
          { label: "🌼 Newborn", path: "/newborn" },
        ].map((item) => (
          <div key={item.path} onClick={() => { navigate(item.path); setDrawerOpen(false); }} style={s.menuItem}>
            {item.label}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div onClick={() => { navigate("/login"); setDrawerOpen(false); }} style={{ ...s.menuItem, color: "#FF5C8A" }}>
            Sign Out
          </div>
        </div>
      </div>

      {/* Centered content */}
      <div style={s.center}>
        <div style={s.container}>
          <h1 style={s.pageTitle}>⚙️ Settings</h1>
          {sections.map((sec) => (
            <SettingSection key={sec.title} section={sec} />
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: GRADIENTS.page, overflowX: "hidden", position: "relative" },
  blob1: { position: "fixed", top: "-160px", right: "-160px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.25) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
  blob2: { position: "fixed", bottom: "-120px", left: "-120px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,138,0.2) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 },
  hamburger: { position: "fixed", top: "20px", left: "20px", zIndex: 100, width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px", padding: 0 },
  line: { display: "block", width: "22px", height: "2px", borderRadius: "2px", background: "#fff" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 },
  drawer: { position: "fixed", top: 0, left: 0, bottom: 0, width: "260px", background: "rgba(20,16,40,0.97)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.1)", zIndex: 300, display: "flex", flexDirection: "column", padding: "24px 20px", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" },
  closeBtn: { alignSelf: "flex-end", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "18px", cursor: "pointer", marginBottom: "8px" },
  drawerBrand: { fontSize: "20px", fontWeight: "900", color: "#fff", marginBottom: "32px" },
  menuItem: { padding: "14px 8px", fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.85)", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.07)", transition: "color 0.2s" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "36px 20px 48px", position: "relative", zIndex: 1 },
  container: { width: "100%", maxWidth: "520px" },
  pageTitle: { fontSize: "24px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px", marginBottom: "24px" },
  sectionHeader: { display: "flex", alignItems: "center", gap: "14px", padding: "16px", borderRadius: "18px", border: "1px solid", cursor: "pointer", backdropFilter: "blur(12px)", transition: "all 0.25s ease" },
  iconBox: { width: "44px", height: "44px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  sectionTitle: { flex: 1, fontSize: "15px", fontWeight: "700", color: "#fff" },
  chevron: { color: "rgba(255,255,255,0.4)", fontSize: "16px", transition: "transform 0.25s ease" },
  itemList: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", borderRadius: "0 0 18px 18px", overflow: "hidden", marginTop: "-6px" },
  item: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" },
  itemText: { fontSize: "14px", color: "rgba(255,255,255,0.75)" },
};
