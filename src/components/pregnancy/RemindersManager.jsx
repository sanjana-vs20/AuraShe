import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_REMINDERS } from "../../utils/pregnancyUtils";

const STORAGE_KEY = "aurashe_reminders";

export default function RemindersManager() {
  const [reminders, setReminders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_REMINDERS; }
    catch { return DEFAULT_REMINDERS; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ icon: "💊", title: "", time: "08:00", days: "Daily" });
  const [editId, setEditId]     = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  function toggle(id) {
    setReminders((r) => r.map((x) => x.id === id ? { ...x, active: !x.active } : x));
  }
  function deleteReminder(id) {
    setReminders((r) => r.filter((x) => x.id !== id));
  }
  function openEdit(r) {
    setForm({ icon: r.icon, title: r.title, time: r.time, days: r.days });
    setEditId(r.id);
    setShowForm(true);
  }
  function saveForm() {
    if (!form.title.trim()) return;
    if (editId) {
      setReminders((r) => r.map((x) => x.id === editId ? { ...x, ...form } : x));
    } else {
      setReminders((r) => [...r, { id: Date.now(), ...form, active: true }]);
    }
    setShowForm(false);
    setEditId(null);
    setForm({ icon: "💊", title: "", time: "08:00", days: "Daily" });
  }

  const ICONS       = ["💊", "💧", "🏥", "🧘", "🩺", "🥗", "😴", "🚶", "📋", "❤️"];
  const DAY_OPTIONS = ["Daily", "Mon, Wed, Fri", "Weekdays", "Weekends", "Weekly", "As scheduled"];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-white mb-1" style={{ fontSize: "18px" }}>🔔 Reminders</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
            {reminders.filter(r => r.active).length} active reminder{reminders.filter(r => r.active).length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setShowForm(true); setEditId(null); setForm({ icon: "💊", title: "", time: "08:00", days: "Daily" }); }}
          className="px-5 py-2.5 rounded-2xl text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#FF9A5C,#C850C0)", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(255,154,92,0.3)" }}>
          + Add
        </motion.button>
      </div>

      {/* Add / Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            className="rounded-3xl"
            style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,154,92,0.3)", padding: "32px 28px" }}>
            <p className="font-bold text-white mb-5" style={{ fontSize: "16px" }}>
              {editId ? "✏️ Edit Reminder" : "➕ New Reminder"}
            </p>

            {/* Icon picker */}
            <p className="mb-2" style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "0.8px", textTransform: "uppercase" }}>
              Choose icon
            </p>
            <div className="flex gap-2 flex-wrap mb-5">
              {ICONS.map((ic) => (
                <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center"
                  style={{ background: form.icon === ic ? "rgba(255,154,92,0.3)" : "rgba(255,255,255,0.06)", border: form.icon === ic ? "1.5px solid #FF9A5C" : "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                  {ic}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Reminder title..."
                className="w-full rounded-2xl px-5 py-4 text-white font-medium outline-none"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,154,92,0.3)", fontSize: "15px", colorScheme: "dark" }} />

              <div className="flex gap-3">
                <input type="time" value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))}
                  className="flex-1 rounded-2xl px-5 py-4 text-white font-medium outline-none"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "15px", colorScheme: "dark" }} />
                <select value={form.days} onChange={(e) => setForm(f => ({ ...f, days: e.target.value }))}
                  className="flex-1 rounded-2xl px-5 py-4 text-white font-medium outline-none"
                  style={{ background: "rgba(30,20,60,0.95)", border: "1px solid rgba(255,255,255,0.12)", fontSize: "14px", colorScheme: "dark", cursor: "pointer" }}>
                  {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button onClick={() => { setShowForm(false); setEditId(null); }}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
                  Cancel
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={saveForm}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#FF9A5C,#6C63FF)", border: "none", cursor: "pointer" }}>
                  {editId ? "Update" : "Add Reminder"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder list */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {reminders.map((r) => (
            <motion.div key={r.id}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
              style={{
                display: "flex", alignItems: "center", gap: "16px",
                borderRadius: "18px", padding: "18px 20px",
                background: r.active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                border: r.active ? "1px solid rgba(255,154,92,0.25)" : "1px solid rgba(255,255,255,0.07)",
              }}>
              <span style={{ fontSize: "28px", flexShrink: 0 }}>{r.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: r.active ? "#fff" : "rgba(255,255,255,0.4)", fontSize: "16px", fontWeight: 600, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.title}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", whiteSpace: "nowrap" }}>{r.time} · {r.days}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                <button onClick={() => openEdit(r)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "17px" }}>✏️</button>
                <button onClick={() => deleteReminder(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: "17px" }}>🗑️</button>
                <button onClick={() => toggle(r.id)}
                  style={{ position: "relative", width: "48px", height: "26px", borderRadius: "100px", background: r.active ? "linear-gradient(135deg,#FF9A5C,#C850C0)" : "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  <span style={{ position: "absolute", top: "5px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.2s", left: r.active ? "27px" : "5px" }} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {reminders.length === 0 && (
          <p className="text-center py-8" style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px" }}>
            No reminders yet. Tap + Add to create one!
          </p>
        )}
      </div>
    </div>
  );
}
