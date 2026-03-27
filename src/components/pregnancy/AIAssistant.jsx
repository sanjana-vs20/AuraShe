import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CHAT_FAQ } from "../../utils/pregnancyUtils";

const BOT_INTRO = "Hi! I'm AuraBot 💜 — your pregnancy health assistant. I can answer general questions about pregnancy. Remember: I'm not a substitute for professional medical advice. How can I help you today?";

function findAnswer(q) {
  const lower = q.toLowerCase();
  const match = CHAT_FAQ.find((f) =>
    f.q.toLowerCase().split(" ").some((word) => word.length > 3 && lower.includes(word))
  );
  return match
    ? match.a
    : "That's a great question! For specific medical concerns, please consult your healthcare provider. I can help with general pregnancy topics like nutrition, symptoms, exercise, and baby development.";
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([{ from: "bot", text: BOT_INTRO }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text) {
    const q = text || input.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text: findAnswer(q) }]);
    }, 900 + Math.random() * 600);
  }

  return (
    <div className="rounded-3xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(108,99,255,0.3)", boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>

      {/* Chat header */}
      <div className="flex items-center gap-4"
        style={{ background: "linear-gradient(135deg,rgba(108,99,255,0.35),rgba(200,80,192,0.25))", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "22px 24px" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#6C63FF,#C850C0)", boxShadow: "0 4px 16px rgba(108,99,255,0.45)" }}>
          🤖
        </div>
        <div className="flex-1">
          <p className="font-bold text-white" style={{ fontSize: "18px", marginBottom: "3px" }}>AuraBot</p>
          <p style={{ color: "#a89cff", fontSize: "13px" }}>AI Pregnancy Assistant · Always online</p>
        </div>
        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "#3CC98A", boxShadow: "0 0 8px #3CC98A" }} />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: "420px", minHeight: "240px", padding: "20px 20px" }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "78%",
                background: msg.from === "user"
                  ? "linear-gradient(135deg,#FF9A5C,#C850C0)"
                  : "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: "15px",
                lineHeight: "1.75",
                padding: "14px 18px",
                borderRadius: msg.from === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                boxShadow: msg.from === "user" ? "0 4px 14px rgba(255,154,92,0.3)" : "none",
                border: msg.from === "bot" ? "1px solid rgba(255,255,255,0.12)" : "none",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px 20px 20px 4px", padding: "14px 18px", display: "flex", gap: "6px", alignItems: "center" }}>
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a89cff", display: "inline-block" }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick FAQ chips */}
      <div className="flex gap-2 overflow-x-auto" style={{ padding: "0 20px 16px", scrollbarWidth: "none" }}>
        {CHAT_FAQ.slice(0, 5).map((f, i) => (
          <button key={i} onClick={() => send(f.q)}
            className="flex-shrink-0 font-semibold"
            style={{ background: "rgba(108,99,255,0.15)", color: "#a89cff", border: "1px solid rgba(108,99,255,0.3)", cursor: "pointer", whiteSpace: "nowrap", fontSize: "13px", padding: "8px 14px", borderRadius: "100px" }}>
            {f.q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3" style={{ padding: "0 20px 20px" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a pregnancy question..."
          className="flex-1 text-white outline-none"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(108,99,255,0.35)", fontSize: "15px", colorScheme: "dark", borderRadius: "16px", padding: "14px 18px" }} />
        <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => send()}
          style={{ width: "52px", height: "52px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "20px", background: "linear-gradient(135deg,#6C63FF,#C850C0)", border: "none", cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 16px rgba(108,99,255,0.45)" }}>
          ↑
        </motion.button>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: "0 20px 20px" }}>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.28)", fontSize: "12px", lineHeight: "1.6" }}>
          ⚠️ AuraBot provides general information only. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
