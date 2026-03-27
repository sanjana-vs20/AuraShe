import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", accent = "rgba(255,255,255,0.12)", delay = 0, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className={`rounded-3xl p-5 ${className}`}
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${accent}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
