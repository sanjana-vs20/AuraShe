import { useState } from "react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "🏠 Home", path: "/goal" },
  { label: "🌸 Period Tracker", path: "/period" },
  { label: "🤰 Fertility", path: "/fertility" },
  { label: "🍼 Pregnancy", path: "/pregnancy-tracker" },
  { label: "🌼 Newborn", path: "/newborn" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={s.bar}>
        <button onClick={() => setOpen(true)} style={s.hamburger}>
          <span style={s.line} />
          <span style={s.line} />
          <span style={s.line} />
        </button>
        <span style={s.brand}>💜 AuraShe</span>
      </div>

      {open && <div onClick={() => setOpen(false)} style={s.overlay} />}

      <div style={{ ...s.drawer, transform: open ? "translateX(0)" : "translateX(-100%)" }}>
        <button onClick={() => setOpen(false)} style={s.closeBtn}>✕</button>
        <p style={s.drawerBrand}>💜 AuraShe</p>
        {menuItems.map((item) => (
          <div key={item.path} onClick={() => { navigate(item.path); setOpen(false); }} style={s.menuItem}>
            {item.label}
          </div>
        ))}
        <div style={{ marginTop: "auto" }}>
          <div onClick={() => { navigate("/settings"); setOpen(false); }} style={{ ...s.menuItem, color: "rgba(255,255,255,0.85)" }}>
            ⚙️ Settings
          </div>
          <div onClick={() => { navigate("/login"); setOpen(false); }} style={{ ...s.menuItem, color: "#FF5C8A" }}>
            Sign Out
          </div>
        </div>
      </div>
    </>
  );
}

const s = {
  bar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", background: "rgba(15,12,30,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  hamburger: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "4px" },
  line: { display: "block", width: "22px", height: "2px", borderRadius: "2px", background: "#fff" },
  brand: { fontSize: "17px", fontWeight: "800", color: "#fff", letterSpacing: "-0.3px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 },
  drawer: { position: "fixed", top: 0, left: 0, bottom: 0, width: "260px", background: "rgba(20,16,40,0.97)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.1)", zIndex: 300, display: "flex", flexDirection: "column", padding: "24px 20px", transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" },
  closeBtn: { alignSelf: "flex-end", background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: "18px", cursor: "pointer", marginBottom: "8px" },
  drawerBrand: { fontSize: "20px", fontWeight: "900", color: "#fff", marginBottom: "32px" },
  menuItem: { padding: "14px 8px", fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.85)", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.07)", transition: "color 0.2s" },
};
