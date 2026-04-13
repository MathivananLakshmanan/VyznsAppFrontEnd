import { useForm } from "react-hook-form";
import { registerUser } from "../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { RegisterRequest } from "../types/auth";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await registerUser(data);
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Left Panel */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={s.brand}>
            <div style={s.brandIcon}>V</div>
            <span style={s.brandName}>Vyzns</span>
          </div>

          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Create your account</h2>
            <p style={s.cardSub}>Join thousands of traders today — it's free</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={s.form}>
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 3, message: "At least 3 characters" },
                })}
                placeholder="John Doe"
                style={s.input}
                className="vyzns-input"
              />
              {errors.name && <p style={s.err}>⚠ {errors.name.message}</p>}
            </div>

            <div style={s.field}>
              <label style={s.label}>Email address</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/, message: "Only Gmail addresses allowed" },
                })}
                placeholder="you@gmail.com"
                style={s.input}
                className="vyzns-input"
              />
              {errors.email && <p style={s.err}>⚠ {errors.email.message}</p>}
            </div>

            <div style={s.field}>
              <label style={s.label}>Password</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                    message: "Min 8 chars with uppercase, number & special character",
                  },
                })}
                type="password"
                placeholder="Create a strong password"
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
              {loading ? <><span style={s.btnSpinner} />Creating account...</> : "Create account →"}
            </button>
          </form>

          <div style={s.divider}><span style={s.dividerText}>or</span></div>

          <p style={s.switchText}>
            Already have an account?{" "}
            <span style={s.switchLink} onClick={() => navigate("/login")}>Sign in</span>
          </p>

          <p style={s.terms}>
            By creating an account you agree to our{" "}
            <span style={s.termsLink}>Terms of Service</span> and{" "}
            <span style={s.termsLink}>Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <h2 style={s.headline}>Start trading<br />in minutes</h2>
          <p style={s.tagline}>List your items, discover what others offer, and make exchanges that benefit everyone.</p>
          <div style={s.steps}>
            {[
              { n: "1", t: "List your item", d: "Add photos, description and set your price in under 2 minutes" },
              { n: "2", t: "Get exchange offers", d: "Other users will offer their items in exchange for yours" },
              { n: "3", t: "Chat & confirm", d: "Discuss details directly and finalize the trade securely" },
            ].map((step) => (
              <div key={step.n} style={s.step}>
                <div style={s.stepNum}>{step.n}</div>
                <div>
                  <p style={s.stepTitle}>{step.t}</p>
                  <p style={s.stepDesc}>{step.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={s.statsRow}>
            {[["10K+", "Active Users"], ["50K+", "Items Listed"], ["98%", "Satisfaction"]].map(([n, l]) => (
              <div key={l} style={s.stat}>
                <p style={s.statNum}>{n}</p>
                <p style={s.statLabel}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin { to { transform:rotate(360deg); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  .vyzns-input { transition: border-color 0.2s, box-shadow 0.2s !important; }
  .vyzns-input:focus { border-color: #5B4FE9 !important; box-shadow: 0 0 0 3px rgba(91,79,233,0.12) !important; outline: none !important; }
  .vyzns-btn:hover { background: #4338CA !important; transform: translateY(-1px) !important; box-shadow: 0 8px 24px rgba(91,79,233,0.3) !important; }
  .vyzns-btn:active { transform: translateY(0) !important; }
`;

const s: Record<string, React.CSSProperties> = {
  page: { display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", flexWrap: "wrap" },

  right: {
    width: "100%", maxWidth: "520px", display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 20px", background: "#F8F7FF",
  },
  card: {
    width: "100%", maxWidth: "420px", background: "#fff",
    borderRadius: "20px", padding: "40px 36px",
    boxShadow: "0 24px 64px rgba(91,79,233,0.10), 0 4px 16px rgba(0,0,0,0.06)",
    animation: "fadeUp 0.5s ease both",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" },
  brandIcon: {
    width: "36px", height: "36px", borderRadius: "9px",
    background: "#5B4FE9", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: 800,
  },
  brandName: { fontSize: "18px", fontWeight: 800, color: "#111827" },
  cardHeader: { marginBottom: "24px" },
  cardTitle: { fontSize: "24px", fontWeight: 800, color: "#111827", marginBottom: "6px" },
  cardSub: { fontSize: "14px", color: "#6B7280" },

  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#374151" },
  input: {
    padding: "11px 14px", borderRadius: "10px",
    border: "1.5px solid #E5E7EB", background: "#fff",
    color: "#111827", fontSize: "14px", outline: "none", width: "100%",
  },
  err: { fontSize: "12px", color: "#EF4444" },
  errorBox: {
    background: "#FEF2F2", border: "1px solid #FECACA",
    borderRadius: "10px", padding: "10px 14px",
    fontSize: "13px", color: "#DC2626", display: "flex", gap: "8px",
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
  switchText: { textAlign: "center", fontSize: "14px", color: "#6B7280", marginBottom: "12px" },
  switchLink: { color: "#5B4FE9", fontWeight: 600, cursor: "pointer" },
  terms: { textAlign: "center", fontSize: "11px", color: "#9CA3AF", lineHeight: 1.6 },
  termsLink: { color: "#5B4FE9", cursor: "pointer" },

  left: {
    flex: 1, minWidth: "300px", background: "linear-gradient(145deg, #5B4FE9 0%, #7C3AED 60%, #4338CA 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "40px 24px", position: "relative", overflow: "hidden",
  },
  leftInner: { maxWidth: "420px", animation: "slideIn 0.6s ease both", position: "relative", zIndex: 1 },
  headline: { fontSize: "40px", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: "16px" },
  tagline: { fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "40px" },
  steps: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" },
  step: { display: "flex", gap: "16px", alignItems: "flex-start" },
  stepNum: {
    width: "32px", height: "32px", borderRadius: "50%",
    background: "rgba(255,255,255,0.2)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: "14px", flexShrink: 0,
  },
  stepTitle: { fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" },
  stepDesc: { fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 },
  statsRow: {
    display: "flex", gap: "0",
    background: "rgba(255,255,255,0.1)", borderRadius: "14px",
    overflow: "hidden",
  },
  stat: {
    flex: 1, padding: "16px", textAlign: "center",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },
  statNum: { fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "2px" },
  statLabel: { fontSize: "11px", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.05em" },
};
