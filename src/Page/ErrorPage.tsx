import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  code?: number;
  message?: string;
}

export default function ErrorPage({ code = 404, message }: ErrorPageProps) {
  const navigate = useNavigate();
  const is500 = code >= 500;

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>

      <div style={styles.glowCircle} />

      <h1 style={styles.code}>{code}</h1>

      <p style={styles.title}>
        {message ?? (is500 ? "Server error. Please try again later." : "Page not found")}
      </p>

      {is500 && (
        <div style={styles.badge}>
          <span style={styles.dot} />
          Backend service is currently unavailable
        </div>
      )}

      <button
        style={styles.button}
        onMouseEnter={(e) => Object.assign((e.target as HTMLElement).style, styles.buttonHover)}
        onMouseLeave={(e) => Object.assign((e.target as HTMLElement).style, styles.button)}
        onClick={() => navigate("/login")}
      >
        Go back
      </button>
    </div>
  );
}

const keyframes = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1);    opacity: 0.15; }
    50%       { transform: scale(1.2); opacity: 0.28; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
`;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "16px",
    background: "#0f0f0f",
    color: "#fff",
    overflow: "hidden",
    position: "relative",
  },
  glowCircle: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "radial-gradient(circle, #ff4444 0%, transparent 70%)",
    animation: "pulse 3s ease-in-out infinite",
    pointerEvents: "none",
  },
  code: {
    fontSize: "130px",
    fontWeight: 900,
    margin: 0,
    lineHeight: 1,
    background: "linear-gradient(135deg, #ff4444, #ff8800)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "fadeInDown 0.6s ease forwards, float 3s ease-in-out 0.6s infinite",
    zIndex: 1,
  },
  title: {
    fontSize: "18px",
    color: "#aaa",
    margin: 0,
    animation: "fadeInUp 0.6s ease 0.2s both",
    zIndex: 1,
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#1a1a1a",
    border: "1px solid #ff444433",
    borderRadius: "999px",
    padding: "6px 16px",
    fontSize: "13px",
    color: "#ff6666",
    animation: "fadeInUp 0.6s ease 0.4s both",
    zIndex: 1,
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#ff4444",
    display: "inline-block",
    animation: "blink 1.2s ease-in-out infinite",
  },
  button: {
    marginTop: "8px",
    padding: "10px 28px",
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "transform 0.2s, background 0.2s",
    animation: "fadeInUp 0.6s ease 0.5s both",
    zIndex: 1,
  },
  buttonHover: {
    marginTop: "8px",
    padding: "10px 28px",
    background: "#ff4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transform: "scale(1.05)",
    transition: "transform 0.2s, background 0.2s",
    zIndex: 1,
  },
};
