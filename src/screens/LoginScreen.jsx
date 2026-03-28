import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GRADIENTS } from "../theme";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    // TODO: connect to auth
    navigate("/goal");
  }

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.container}>
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>💜</div>
          <h1 style={styles.brand}>AuraShe</h1>
          <p style={styles.tagline}>Your women's health companion</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.card}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.sub}>Sign in to continue</p>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btn}>Sign In →</button>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={styles.link}>Register</span>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: GRADIENTS.page, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflowX: "hidden", padding: "24px" },
  blob1: { position: "fixed", top: "-100px", right: "-100px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,92,138,0.25) 0%, transparent 70%)", animation: "blobPulse 9s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  blob2: { position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.2) 0%, transparent 70%)", animation: "blobPulse 12s 2s ease-in-out infinite", pointerEvents: "none", zIndex: 0 },
  container: { position: "relative", zIndex: 1, width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
  logoWrap: { textAlign: "center" },
  logoCircle: { fontSize: "52px", marginBottom: "8px", filter: "drop-shadow(0 4px 16px rgba(255,92,138,0.5))" },
  brand: { fontSize: "32px", fontWeight: "900", color: "#fff", letterSpacing: "-1px", marginBottom: "4px" },
  tagline: { fontSize: "14px", color: "rgba(255,255,255,0.55)" },
  card: { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "28px", padding: "36px 32px", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" },
  title: { fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "4px" },
  sub: { fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "28px" },
  field: { marginBottom: "18px" },
  label: { display: "block", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.6)", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" },
  input: { width: "100%", padding: "14px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box", transition: "border 0.2s" },
  error: { fontSize: "13px", color: "#FF5C8A", marginBottom: "12px", fontWeight: "600" },
  btn: { width: "100%", padding: "15px", borderRadius: "14px", background: "linear-gradient(135deg, #FF5C8A, #6C63FF)", border: "none", color: "#fff", fontSize: "16px", fontWeight: "800", cursor: "pointer", marginTop: "8px", boxShadow: "0 8px 24px rgba(255,92,138,0.4)", letterSpacing: "0.3px" },
  switchText: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "rgba(255,255,255,0.5)" },
  link: { color: "#FF5C8A", fontWeight: "700", cursor: "pointer" },
};
