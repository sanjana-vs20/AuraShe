import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { GRADIENTS } from "../theme";

export default function MenopauseScreen() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={{ ...styles.header, background: GRADIENTS.greenHeader }}>
        <button onClick={() => navigate("/")} style={styles.back}>← Back</button>
        <div style={styles.headerEmoji}>🌼</div>
        <h1 style={styles.headerTitle}>Perimenopause</h1>
        <p style={styles.headerSub}>Navigate your transition with confidence</p>
        <div style={styles.headerGlow} />
      </div>

      <div style={styles.body}>
        <div className="fade-up-1">
          <Card accentColor="#3CC98A">
            <p style={{ ...styles.cardLabel, color: "#6ee7b7" }}>📊 Symptom Tracker</p>
            <p style={styles.cardBody}>
              Monitor hot flashes, mood shifts, and sleep patterns to better understand your body.
            </p>
            <div style={{ ...styles.badge, background: "rgba(60,201,138,0.2)", color: "#6ee7b7", border: "1px solid rgba(60,201,138,0.3)" }}>
              ● Tracking active
            </div>
          </Card>
        </div>
        <div className="fade-up-2" style={styles.btnWrap}>
          <Button title="Track Symptoms" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, position: "relative", overflowX: "hidden" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(60,201,138,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0, filter: "blur(2px)" },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,160,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  header: { position: "relative", zIndex: 1, padding: "52px 28px 40px", color: "#fff", borderRadius: "0 0 40px 40px", boxShadow: "0 16px 48px rgba(60,201,138,0.4), 0 4px 16px rgba(0,0,0,0.3)", overflow: "hidden" },
  headerGlow: { position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  back: { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", padding: "7px 16px", borderRadius: "100px", marginBottom: "24px", display: "inline-block", backdropFilter: "blur(10px)", letterSpacing: "0.3px" },
  headerEmoji: { fontSize: "52px", marginBottom: "12px", filter: "drop-shadow(0 4px 12px rgba(255,255,255,0.3))" },
  headerTitle: { fontSize: "30px", fontWeight: "800", marginBottom: "6px", letterSpacing: "-0.5px" },
  headerSub: { fontSize: "15px", opacity: 0.75 },
  body: { position: "relative", zIndex: 1, maxWidth: "520px", margin: "0 auto", padding: "32px 24px 64px" },
  cardLabel: { fontSize: "16px", fontWeight: "700", marginBottom: "12px" },
  cardBody: { fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: "1.75", marginBottom: "18px" },
  badge: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: "600" },
  btnWrap: { marginTop: "24px" },
};
