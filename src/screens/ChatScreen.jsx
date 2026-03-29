import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BOT_NAME = "Aura";

const RULES = [
  { match: ["hi", "hello", "hey", "good morning", "good evening"],
    reply: "Hello! I'm Aura, your personal health assistant. 🌸 Ask me anything about your cycle, symptoms, nutrition, or general wellness." },
  { match: ["period", "menstruation", "cycle", "bleeding", "flow"],
    reply: "Your menstrual cycle typically lasts 21–35 days. Tracking your last period date and cycle length helps predict your next period accurately. 📅 Is there something specific about your cycle you'd like to know?" },
  { match: ["late period", "missed period", "period late", "period delayed"],
    reply: "A late period can be caused by stress, changes in weight, illness, or hormonal shifts. If it's more than 7 days late and you're sexually active, consider a pregnancy test. Consult a doctor if it persists. 🩺" },
  { match: ["irregular period", "irregular cycle", "unpredictable period"],
    reply: "Irregular periods can result from stress, PCOS, thyroid issues, or lifestyle changes. Tracking your cycle consistently over 3 months helps identify patterns. A gynaecologist can provide a proper evaluation. 🌿" },
  { match: ["cramp", "pain", "stomach pain", "abdominal pain", "pelvic pain"],
    reply: "Menstrual cramps are caused by uterine contractions. Try a warm compress on your lower abdomen, stay hydrated, and consider light stretching. If pain is severe or disrupts daily life, consult a doctor. 💊" },
  { match: ["severe pain", "unbearable pain", "extreme cramps", "endometriosis"],
    reply: "Severe menstrual pain may indicate conditions like endometriosis or fibroids. Please consult a gynaecologist for a proper diagnosis. Do not ignore persistent severe pain. 🩺" },
  { match: ["mood swing", "irritable", "irritated", "emotional", "anxious", "anxiety"],
    reply: "Mood changes before or during your period are linked to hormonal fluctuations in oestrogen and progesterone. Regular exercise, adequate sleep, and mindfulness practices can help stabilise mood. 💜" },
  { match: ["sad", "depressed", "low mood", "crying", "feeling down"],
    reply: "Feeling emotionally low around your period is common due to hormonal changes. Be gentle with yourself — rest, connect with loved ones, and consider journaling. If low mood persists beyond your cycle, speak to a healthcare professional. 🌸" },
  { match: ["ovulation", "ovulate", "fertile", "fertility", "fertile window"],
    reply: "Ovulation typically occurs 14 days before your next period. Your fertile window spans 5 days before ovulation through ovulation day. Tracking basal body temperature or cervical mucus can help confirm ovulation. 🥚" },
  { match: ["pms", "premenstrual", "before period", "pre-period"],
    reply: "PMS symptoms — including bloating, mood changes, and fatigue — typically occur 1–2 weeks before your period. Reducing caffeine and sodium, increasing magnesium intake, and regular exercise can help manage symptoms. 🌙" },
  { match: ["food", "eat", "diet", "nutrition", "what to eat", "nutrients"],
    reply: "Nutrition varies by cycle phase:\n• Period: Iron-rich foods (spinach, lentils, dates)\n• Ovulation: Antioxidants (berries, leafy greens)\n• PMS: Magnesium-rich foods (nuts, bananas, dark chocolate)\n• Follicular: Balanced whole foods with lean protein 🥗" },
  { match: ["iron", "anaemia", "anemia", "fatigue", "tired", "exhausted"],
    reply: "During menstruation, iron loss increases. Include iron-rich foods like spinach, lentils, red meat, and fortified cereals. Pair with vitamin C (citrus, bell peppers) to enhance iron absorption. 🥬" },
  { match: ["bloating", "bloated", "water retention", "swollen"],
    reply: "Bloating before or during your period is caused by hormonal changes. Reduce sodium and processed food intake, increase water consumption, and try light physical activity to ease discomfort. 💧" },
  { match: ["sleep", "insomnia", "can't sleep", "rest"],
    reply: "Hormonal fluctuations can disrupt sleep, especially before your period. Maintain a consistent sleep schedule, avoid screens 1 hour before bed, and keep your room cool and dark. 😴" },
  { match: ["exercise", "workout", "gym", "yoga", "walk", "physical activity"],
    reply: "Light to moderate exercise during your period can reduce cramps and improve mood by releasing endorphins. Yoga, walking, and swimming are particularly beneficial. 🏃" },
  { match: ["water", "hydration", "drink", "dehydrated"],
    reply: "Staying well-hydrated is essential throughout your cycle. Aim for 8–10 glasses of water daily. Herbal teas like chamomile or ginger can also help ease cramps and bloating. 💧" },
  { match: ["perimenopause", "menopause", "hot flash", "hot flush", "night sweat"],
    reply: "Perimenopause typically begins in the mid-40s and can cause irregular periods, hot flashes, sleep disturbances, and mood changes. A balanced diet, regular exercise, and medical consultation can help manage symptoms. 🌿" },
  { match: ["pregnant", "pregnancy", "conception", "trying to conceive", "ttc"],
    reply: "If you're trying to conceive, tracking your fertile window (5 days before ovulation + ovulation day) is key. Folic acid supplementation, a balanced diet, and reducing stress support reproductive health. 🌸" },
  { match: ["stress", "stressed", "overwhelmed", "burnout"],
    reply: "Chronic stress can disrupt your hormonal balance and affect your cycle. Prioritise rest, practice deep breathing or meditation, and consider speaking to a counsellor if stress feels unmanageable. 🧘" },
  { match: ["healthy", "wellness", "health tip", "advice", "suggestion"],
    reply: "General wellness tips:\n• Sleep 7–9 hours nightly\n• Exercise regularly (150 min/week)\n• Eat a balanced, whole-food diet\n• Manage stress through mindfulness\n• Schedule regular gynaecological check-ups 🩺" },
  { match: ["thank", "thanks", "thank you", "helpful"],
    reply: "You're welcome! 🌸 Remember, your health matters. Don't hesitate to ask anything else — I'm here to help." },
  { match: ["bye", "goodbye", "see you", "exit"],
    reply: "Take care of yourself! 🌸 Come back anytime you need health guidance. Goodbye!" },
];

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const rule of RULES) {
    if (rule.match.some(kw => lower.includes(kw))) return rule.reply;
  }
  return "I'm not sure about that specific question. For personalised medical advice, please consult a qualified healthcare professional. You can also ask me about your cycle, symptoms, nutrition, or general wellness. 🌸";
}

const SUGGESTIONS = [
  "What should I eat during my period?",
  "How do I track ovulation?",
  "What causes mood swings?",
  "Tips for managing cramps",
  "What is the fertile window?",
];

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm Aura, your personal health assistant. 🌸\nAsk me about your cycle, symptoms, nutrition, or wellness.", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: msg, time: now() }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: getBotReply(msg), time: now() }]);
    }, 800 + Math.random() * 400);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.shell}>
        {/* Header */}
        <div style={s.header}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>← Back</button>
          <div style={s.headerCenter}>
            <div style={s.avatar}>🌸</div>
            <div>
              <p style={s.headerName}>{BOT_NAME}</p>
              <p style={s.headerSub}>Health Assistant</p>
            </div>
          </div>
          <div style={{ width: 64 }} />
        </div>

        {/* Messages */}
        <div style={s.msgList}>
          {messages.map((m, i) => (
            <div key={i} style={{ ...s.msgRow, justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
              {m.from === "bot" && <div style={s.botAvatar}>🌸</div>}
              <div style={{ maxWidth: "75%" }}>
                <div style={m.from === "user" ? s.bubbleUser : s.bubbleBot}>
                  {m.text.split("\n").map((line, j) => (
                    <span key={j}>{line}{j < m.text.split("\n").length - 1 && <br />}</span>
                  ))}
                </div>
                <p style={{ ...s.timeStamp, textAlign: m.from === "user" ? "right" : "left" }}>{m.time}</p>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ ...s.msgRow, justifyContent: "flex-start" }}>
              <div style={s.botAvatar}>🌸</div>
              <div style={s.bubbleBot}>
                <div style={s.typingDots}>
                  <span style={{ ...s.dot, animationDelay: "0s" }} />
                  <span style={{ ...s.dot, animationDelay: "0.2s" }} />
                  <span style={{ ...s.dot, animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div style={s.suggestions}>
          {SUGGESTIONS.map((q, i) => (
            <button key={i} onClick={() => send(q)} style={s.suggestionChip}>{q}</button>
          ))}
        </div>

        {/* Input bar */}
        <div style={s.inputBar}>
          <textarea rows={1} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey} placeholder="Ask about your cycle, symptoms..."
            style={s.textInput} />
          <button onClick={() => send()} style={{ ...s.sendBtn, opacity: input.trim() ? 1 : 0.45 }}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "linear-gradient(145deg,#0f0c29 0%,#302b63 50%,#24243e 100%)", display: "flex", justifyContent: "center", position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-80px", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,92,138,0.22) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },
  blob2: { position: "fixed", bottom: "-80px", left: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle,rgba(108,99,255,0.18) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },
  shell: { position: "relative", zIndex: 1, width: "100%", maxWidth: "480px", display: "flex", flexDirection: "column", height: "100vh" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 16px 16px", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 },
  backBtn: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "8px 14px", borderRadius: "100px", backdropFilter: "blur(10px)" },
  headerCenter: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg,#FF5C8A,#C850C0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 4px 16px rgba(255,92,138,0.4)" },
  headerName: { fontSize: "15px", fontWeight: "700", color: "#fff" },
  headerSub: { fontSize: "11px", color: "rgba(255,255,255,0.45)", fontWeight: "500" },
  msgList: { flex: 1, overflowY: "auto", padding: "20px 16px 8px", display: "flex", flexDirection: "column", gap: "16px" },
  msgRow: { display: "flex", alignItems: "flex-end", gap: "8px" },
  botAvatar: { width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#FF5C8A,#C850C0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 },
  bubbleBot: { background: "rgba(255,255,255,0.09)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", fontSize: "14px", color: "rgba(255,255,255,0.88)", lineHeight: "1.6", fontWeight: "500" },
  bubbleUser: { background: "linear-gradient(135deg,#FF5C8A,#C850C0)", borderRadius: "18px 18px 4px 18px", padding: "12px 16px", fontSize: "14px", color: "#fff", lineHeight: "1.6", fontWeight: "600", boxShadow: "0 4px 16px rgba(255,92,138,0.35)" },
  timeStamp: { fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px", paddingLeft: "4px", paddingRight: "4px" },
  typingDots: { display: "flex", gap: "4px", alignItems: "center", padding: "2px 4px" },
  dot: { width: "7px", height: "7px", borderRadius: "50%", background: "rgba(255,255,255,0.5)", animation: "blobPulse 1.2s ease-in-out infinite" },
  suggestions: { display: "flex", gap: "8px", overflowX: "auto", padding: "10px 16px", flexShrink: 0, scrollbarWidth: "none" },
  suggestionChip: { flexShrink: 0, padding: "8px 14px", borderRadius: "100px", border: "1px solid rgba(255,92,138,0.35)", background: "rgba(255,92,138,0.1)", color: "#FF8FAB", fontSize: "12px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s ease" },
  inputBar: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px 24px", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 },
  textInput: { flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: "1.5", colorScheme: "dark" },
  sendBtn: { width: "44px", height: "44px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg,#FF5C8A,#C850C0)", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 16px rgba(255,92,138,0.4)", transition: "all 0.2s ease" },
};
