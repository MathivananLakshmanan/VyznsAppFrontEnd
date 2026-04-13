import { useForm } from "react-hook-form";
import { loginUser } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { LoginRequest } from "../types/auth";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", String(res.id));
      localStorage.setItem("userName", res.name);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Left Panel */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.brand}>
            <div style={s.brandIcon}>V</div>
            <span style={s.brandName}>Vyzns</span>
          </div>
          <h1 style={s.headline}>Trade smarter.<br />Connect better.</h1>
          <p style={s.tagline}>The marketplace where your unused items find new homes — and you discover things you love.</p>
          <div style={s.features}>
            {["🔄 Exchange items with real people", "💬 Chat directly with traders", "🤖 AI-powered recommendations", "⭐ Trusted community ratings"].map((f, i) => (
              <div key={i} style={s.feature}>{f}</div>
            ))}
          </div>
          <div style={s.testimonial}>
            <div style={s.testimonialAvatar}>R</div>
            <div>
              <p style={s.testimonialText}>"Found my dream camera by trading my old laptop. Vyzns made it effortless."</p>
              <p style={s.testimonialAuthor}>Ravi K. · Verified Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Welcome back</h2>
            <p style={s.cardSub}>Sign in to continue trading</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                })}
                placeholder="you@example.com"
                style={s.input}
                className="vyzns-input"
              />
              {errors.email && <p style={s.err}>⚠ {errors.email.message}</p>}
            </div>

            <div style={s.field}>
              <div style={s.labelRow}>
                <label style={s.label}>Password</label>
              </div>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Enter your password"
                style={s.input}
                className="vyzns-input"
              />
              {errors.password && <p style={s.err}>⚠ {errors.password.message}</p>}
            </div>

            {error && (
              <div style={s.errorBox}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={loading ? s.btnLoading : s.btn} className={loading ? "" : "vyzns-btn"}>
              {loading ? <><span style={s.btnSpinner} />Signing in...</> : "Sign in →"}
            </button>
          </form>

          <div style={s.divider}><span style={s.dividerText}>or</span></div>

          <p style={s.switchText}>
            Don't have an account?{" "}
            <span style={s.switchLink} onClick={() => navigate("/register")}>Create one free</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const css = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }

  .vyzns-input {
    transition: border-color 0.2s, box-shadow 0.2s !important;
  }
  .vyzns-input:focus {
    border-color: #5B4FE9 !important;
    box-shadow: 0 0 0 3px rgba(91,79,233,0.12) !important;
    outline: none !important;
  }
  .vyzns-btn:hover {
    background: #4338CA !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 8px 24px rgba(91,79,233,0.3) !important;
  }
  .vyzns-btn:active { transform: translateY(0) !important; }
`;

const s: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },

  left: {
    flex: 1, background: "linear-gradient(145deg, #5B4FE9 0%, #7C3AED 50%, #4338CA 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "60px 48px", position: "relative", overflow: "hidden",
  },
  leftInner: { maxWidth: "440px", animation: "slideIn 0.6s ease both", position: "relative", zIndex: 1 },
  brand: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" },
  brandIcon: {
    width: "40px", height: "40px", borderRadius: "10px",
    background: "rgba(255,255,255,0.2)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px", fontWeight: 800,
  },
  brandName: { fontSize: "20px", fontWeight: 800, color: "#fff" },
  headline: { fontSize: "42px", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "16px" },
  tagline: { fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "36px" },
  features: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" },
  feature: {
    fontSize: "14px", color: "rgba(255,255,255,0.9)",
    background: "rgba(255,255,255,0.1)", borderRadius: "10px",
    padding: "10px 16px", backdropFilter: "blur(8px)",
  },
  testimonial: {
    display: "flex", gap: "14px", alignItems: "flex-start",
    background: "rgba(255,255,255,0.1)", borderRadius: "14px",
    padding: "16px", backdropFilter: "blur(8px)",
  },
  testimonialAvatar: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "rgba(255,255,255,0.3)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: "16px", flexShrink: 0,
  },
  testimonialText: { fontSize: "13px", color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: "6px" },
  testimonialAuthor: { fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: 500 },

  right: {
    width: "480px", display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 32px", background: "#F8F7FF",
  },
  card: {
    width: "100%", maxWidth: "400px",
    background: "#fff", borderRadius: "20px",
    padding: "40px 36px",
    boxShadow: "0 24px 64px rgba(91,79,233,0.10), 0 4px 16px rgba(0,0,0,0.06)",
    animation: "fadeUp 0.5s ease both",
  },
  cardHeader: { marginBottom: "28px" },
  cardTitle: { fontSize: "26px", fontWeight: 800, color: "#111827", marginBottom: "6px" },
  cardSub: { fontSize: "14px", color: "#6B7280" },

  form: { display: "flex", flexDirection: "column", gap: "18px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: "13px", fontWeight: 600, color: "#374151" },
  input: {
    padding: "11px 14px", borderRadius: "10px",
    border: "1.5px solid #E5E7EB", background: "#fff",
    color: "#111827", fontSize: "14px", outline: "none", width: "100%",
  },
  err: { fontSize: "12px", color: "#EF4444", marginTop: "2px" },
  errorBox: {
    background: "#FEF2F2", border: "1px solid #FECACA",
    borderRadius: "10px", padding: "10px 14px",
    fontSize: "13px", color: "#DC2626", display: "flex", gap: "8px", alignItems: "center",
  },
  btn: {
    padding: "13px", borderRadius: "10px", border: "none",
    background: "#5B4FE9", color: "#fff",
    fontWeight: 700, fontSize: "15px", cursor: "pointer",
    transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  },
  btnLoading: {
    padding: "13px", borderRadius: "10px", border: "none",
    background: "#9CA3AF", color: "#fff",
    fontWeight: 700, fontSize: "15px", cursor: "not-allowed",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  },
  btnSpinner: {
    width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  divider: { position: "relative", textAlign: "center", margin: "20px 0", borderTop: "1px solid #E5E7EB" },
  dividerText: {
    position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)",
    background: "#fff", padding: "0 12px", fontSize: "12px", color: "#9CA3AF",
  },
  switchText: { textAlign: "center", fontSize: "14px", color: "#6B7280" },
  switchLink: { color: "#5B4FE9", fontWeight: 600, cursor: "pointer" },
};
