import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function PageShell({ title, subtitle, emoji, backTo = "/pregnancy-dashboard", headerGradient = "linear-gradient(135deg, #FF9A5C 0%, #C850C0 60%, #6C63FF 100%)", headerShadow = "rgba(255,154,92,0.35)", blob1Color = "rgba(255,154,92,0.2)", blob2Color = "rgba(108,99,255,0.2)", children, headerExtra }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "linear-gradient(145deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}>
      {/* Blobs */}
      <div className="fixed -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${blob1Color} 0%, transparent 70%)`, animation: "blobPulse 9s ease-in-out infinite", filter: "blur(2px)" }} />
      <div className="fixed -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${blob2Color} 0%, transparent 70%)`, animation: "blobPulse 12s 3s ease-in-out infinite" }} />

      {/* Header */}
      <div className="relative z-10 overflow-hidden" style={{ background: headerGradient, borderRadius: "0 0 40px 40px", padding: "52px 28px 36px", boxShadow: `0 16px 48px ${headerShadow}, 0 4px 16px rgba(0,0,0,0.3)` }}>
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.07)" }} />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate(backTo)}
          className="mb-5 text-white text-sm font-semibold inline-flex items-center gap-2"
          style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", padding: "7px 16px", borderRadius: "100px", backdropFilter: "blur(10px)", cursor: "pointer" }}>
          ← Back
        </motion.button>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="text-4xl mb-2" style={{ filter: "drop-shadow(0 4px 10px rgba(255,255,255,0.25))" }}>{emoji}</div>
          <h1 className="text-white font-black mb-1" style={{ fontSize: "26px", letterSpacing: "-0.5px" }}>{title}</h1>
          <p className="text-white" style={{ opacity: 0.7, fontSize: "14px" }}>{subtitle}</p>
          {headerExtra}
        </motion.div>
      </div>

      {/* Body */}
      <div className="relative z-10 mx-auto px-5 pb-20" style={{ maxWidth: "600px", paddingTop: "24px" }}>
        {children}
      </div>
    </div>
  );
}
