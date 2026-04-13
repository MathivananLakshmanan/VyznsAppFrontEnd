import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profile() {
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const userName  = localStorage.getItem("userName")  || "User";
  const userId    = localStorage.getItem("userId")    || "—";
  const userEmail = localStorage.getItem("userEmail") || "—";
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { icon: "📦", label: "Items Listed",   value: "—",   color: "#5B4FE9" },
    { icon: "🔄", label: "Exchanges",      value: "—",   color: "#7C3AED" },
    { icon: "⭐", label: "Rating",         value: "New", color: "#F59E0B" },
    { icon: "✅", label: "Verified",       value: "No",  color: "#10B981" },
  ];

  const quickActions = [
    { icon: "🏪", label: "Browse Items",     sub: "Explore marketplace",  path: "/dashboard",  color: "#5B4FE9" },
    { icon: "📦", label: "My Listings",      sub: "Manage your items",    path: "/my-items",   color: "#7C3AED" },
    { icon: "🔄", label: "My Exchanges",     sub: "Track your trades",    path: "/exchanges",  color: "#EC4899" },
    { icon: "✨", label: "Ask AI Assistant", sub: "Get smart help",       path: "/ai-chat",    color: "#F59E0B" },
  ];

  return (
    <div className={`profile-page ${dark ? "dark" : "light"}`}>
      <style>{css}</style>
      <div className="mesh-bg">
        <div className="mesh-orb orb1" />
        <div className="mesh-orb orb2" />
        <div className="mesh-orb orb3" />
      </div>
      <Navbar />

      <div className="profile-main">

        {/* ── Profile Hero Card ── */}
        <div className="glass-card profile-hero">
          <div className="hero-cover">
            <div className="cover-shimmer" />
            <div className="cover-pattern" />
          </div>

          <div className="hero-body">
            <div className="avatar-section">
              <div className="big-avatar">
                <span>{userName.charAt(0).toUpperCase()}</span>
                <div className="big-avatar-ring" />
                <div className="online-dot" />
              </div>
            </div>

            <div className="hero-info">
              <div className="hero-name-row">
                <h2 className="hero-name">{userName}</h2>
                <span className="verified-badge">✦ Member</span>
              </div>
              <p className="hero-sub">Vyzns Marketplace · Since 2026</p>
              <div className="hero-chips">
                <span className="chip chip-id">
                  <span className="chip-icon">🆔</span>
                  User #{userId}
                  <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copyId}>
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </span>
                {userEmail !== "—" && (
                  <span className="chip">
                    <span className="chip-icon">✉</span>
                    {userEmail}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            {stats.map(({ icon, label, value, color }) => (
              <div key={label} className="stat-item">
                <div className="stat-icon-wrap" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <span className="stat-icon">{icon}</span>
                </div>
                <span className="stat-value" style={{ color }}>{value}</span>
                <span className="stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-grid">

          {/* ── Preferences Card ── */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon" style={{ background: "rgba(91,79,233,0.15)" }}>⚙️</div>
              <h3 className="card-title">Preferences</h3>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <p className="setting-label">Dark Mode</p>
                <p className="setting-desc">Switch between light & dark theme</p>
              </div>
              <button className={`toggle-switch ${dark ? "on" : ""}`} onClick={toggle}>
                <span className="toggle-thumb" />
              </button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <p className="setting-label">Notifications</p>
                <p className="setting-desc">Exchange requests and messages</p>
              </div>
              <span className="soon-badge">Soon</span>
            </div>

            <div className="setting-row no-border">
              <div className="setting-info">
                <p className="setting-label">Language</p>
                <p className="setting-desc">English (default)</p>
              </div>
              <span className="soon-badge">Soon</span>
            </div>
          </div>

          {/* ── Account Card ── */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon" style={{ background: "rgba(124,58,237,0.15)" }}>👤</div>
              <h3 className="card-title">Account Details</h3>
            </div>

            {[
              { label: "Full Name",     value: userName },
              { label: "User ID",       value: `#${userId}` },
              { label: "Email",         value: userEmail },
              { label: "Member Since",  value: "2026" },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className={`info-row ${i === arr.length - 1 ? "no-border" : ""}`}>
                <span className="info-label">{label}</span>
                <span className="info-value">{value}</span>
              </div>
            ))}

            <div className="account-actions">
              <button className="btn-primary">✏️ Edit Profile</button>
              <button
                className="btn-danger"
                onClick={() => { localStorage.clear(); navigate("/login"); }}
              >
                🚪 Sign Out
              </button>
            </div>
          </div>

          {/* ── Quick Actions Card ── */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-header-icon" style={{ background: "rgba(236,72,153,0.15)" }}>🚀</div>
              <h3 className="card-title">Quick Actions</h3>
            </div>

            {quickActions.map(({ icon, label, sub, path, color }) => (
              <div key={path} className="quick-link" onClick={() => navigate(path)}>
                <div className="quick-icon-wrap" style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                  <span style={{ fontSize: "18px" }}>{icon}</span>
                </div>
                <div className="quick-text">
                  <span className="quick-label">{label}</span>
                  <span className="quick-sub">{sub}</span>
                </div>
                <div className="quick-arrow" style={{ color }}>›</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.05)} }
  @keyframes shimmer  { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  @keyframes ringPulse{ 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }

  *, *::before, *::after { box-sizing: border-box; }

  .profile-page {
    min-height:100vh; font-family:'Sora',sans-serif;
    transition:background 0.4s,color 0.4s; position:relative; overflow-x:hidden;
  }
  .profile-page.light { background:#F0EEFF; color:#111827; }
  .profile-page.dark  { background:#0A0A0F; color:#F9FAFB; }

  /* Mesh background */
  .mesh-bg { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
  .mesh-orb {
    position:absolute; border-radius:50%; filter:blur(80px); opacity:0.35;
    animation:orbFloat 8s ease-in-out infinite;
  }
  .orb1 { width:500px;height:500px; background:radial-gradient(circle,#5B4FE9,transparent); top:-100px;left:-100px; animation-delay:0s; }
  .orb2 { width:400px;height:400px; background:radial-gradient(circle,#7C3AED,transparent); bottom:-80px;right:-80px; animation-delay:3s; }
  .orb3 { width:300px;height:300px; background:radial-gradient(circle,#EC4899,transparent); top:40%;left:50%; animation-delay:5s; }

  .profile-main {
    position:relative; z-index:1;
    max-width:980px; margin:0 auto; padding:32px 24px 80px;
  }

  /* Glass Card */
  .glass-card {
    border-radius:20px; overflow:hidden; margin-bottom:20px;
    animation:fadeUp 0.5s ease both;
    transition:transform 0.3s,box-shadow 0.3s;
  }
  .profile-page.light .glass-card {
    background:rgba(255,255,255,0.75);
    border:1px solid rgba(91,79,233,0.12);
    box-shadow:0 8px 32px rgba(91,79,233,0.08), 0 1px 0 rgba(255,255,255,0.8) inset;
    backdrop-filter:blur(20px);
  }
  .profile-page.dark .glass-card {
    background:rgba(26,26,36,0.7);
    border:1px solid rgba(91,79,233,0.2);
    box-shadow:0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset;
    backdrop-filter:blur(20px);
  }
  .glass-card:hover { transform:translateY(-2px); }
  .profile-page.light .glass-card:hover { box-shadow:0 16px 48px rgba(91,79,233,0.14); }
  .profile-page.dark  .glass-card:hover { box-shadow:0 16px 48px rgba(91,79,233,0.2); }

  /* Profile Hero */
  .profile-hero { animation-delay:0s; }
  .hero-cover {
    height:120px; position:relative; overflow:hidden;
    background:linear-gradient(135deg,#5B4FE9 0%,#7C3AED 40%,#EC4899 70%,#F59E0B 100%);
  }
  .cover-shimmer {
    position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
    animation:shimmer 3s ease-in-out infinite;
  }
  .cover-pattern {
    position:absolute; inset:0; opacity:0.1;
    background-image:radial-gradient(circle at 20% 50%,#fff 1px,transparent 1px),
                     radial-gradient(circle at 80% 20%,#fff 1px,transparent 1px),
                     radial-gradient(circle at 60% 80%,#fff 1px,transparent 1px);
    background-size:40px 40px;
  }

  .hero-body {
    display:flex; align-items:flex-end; gap:20px;
    padding:0 28px 24px; margin-top:-48px;
  }
  .avatar-section { flex-shrink:0; }
  .big-avatar {
    width:90px; height:90px; border-radius:50%; position:relative;
    background:linear-gradient(135deg,#5B4FE9,#7C3AED,#EC4899);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:36px; font-weight:800;
    border:4px solid;
  }
  .profile-page.light .big-avatar { border-color:#fff; box-shadow:0 8px 24px rgba(91,79,233,0.3); }
  .profile-page.dark  .big-avatar { border-color:#0A0A0F; box-shadow:0 8px 24px rgba(91,79,233,0.4); }
  .big-avatar-ring {
    position:absolute; inset:-6px; border-radius:50%;
    border:2px solid transparent;
    background:linear-gradient(135deg,#5B4FE9,#EC4899) border-box;
    -webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:destination-out; mask-composite:exclude;
    animation:ringPulse 3s ease-in-out infinite;
  }
  .online-dot {
    position:absolute; bottom:4px; right:4px;
    width:16px; height:16px; border-radius:50%; background:#10B981;
    border:3px solid;
  }
  .profile-page.light .online-dot { border-color:#fff; }
  .profile-page.dark  .online-dot { border-color:#0A0A0F; }

  .hero-info { flex:1; padding-top:52px; }
  .hero-name-row { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
  .hero-name { font-size:24px; font-weight:800; margin:0; }
  .verified-badge {
    font-size:11px; font-weight:600; padding:3px 10px; border-radius:999px;
    background:linear-gradient(135deg,#5B4FE9,#7C3AED); color:#fff; letter-spacing:0.04em;
  }
  .hero-sub { font-size:13px; margin:0 0 12px; }
  .profile-page.light .hero-sub { color:#6B7280; }
  .profile-page.dark  .hero-sub { color:#9CA3AF; }

  .hero-chips { display:flex; flex-wrap:wrap; gap:8px; }
  .chip {
    display:inline-flex; align-items:center; gap:6px;
    font-size:12px; font-weight:500; padding:5px 12px; border-radius:999px;
  }
  .profile-page.light .chip { background:rgba(91,79,233,0.08); color:#374151; border:1px solid rgba(91,79,233,0.15); }
  .profile-page.dark  .chip { background:rgba(91,79,233,0.12); color:#D1D5DB; border:1px solid rgba(91,79,233,0.2); }
  .chip-icon { font-size:13px; }
  .copy-btn {
    margin-left:4px; padding:2px 8px; border-radius:6px; border:none; cursor:pointer;
    font-size:11px; font-weight:600; font-family:'Sora',sans-serif;
    background:rgba(91,79,233,0.15); color:#5B4FE9; transition:all 0.2s;
  }
  .copy-btn:hover { background:#5B4FE9; color:#fff; }
  .copy-btn.copied { background:#10B981; color:#fff; }

  /* Stats */
  .stats-row {
    display:grid; grid-template-columns:repeat(4,1fr);
    padding:20px 28px;
  }
  .profile-page.light .stats-row { border-top:1px solid rgba(91,79,233,0.1); }
  .profile-page.dark  .stats-row { border-top:1px solid rgba(91,79,233,0.15); }
  .stat-item { display:flex; flex-direction:column; align-items:center; gap:6px; padding:8px; }
  .stat-icon-wrap {
    width:40px; height:40px; border-radius:12px;
    display:flex; align-items:center; justify-content:center; font-size:18px;
    transition:transform 0.2s;
  }
  .stat-item:hover .stat-icon-wrap { transform:scale(1.1) rotate(-5deg); }
  .stat-value { font-size:20px; font-weight:800; }
  .stat-label { font-size:11px; font-weight:500; text-align:center; }
  .profile-page.light .stat-label { color:#6B7280; }
  .profile-page.dark  .stat-label { color:#9CA3AF; }

  /* Grid */
  .profile-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; }
  @media(max-width:900px) { .profile-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .profile-grid { grid-template-columns:1fr; } .stats-row { grid-template-columns:repeat(2,1fr); } }

  /* Card Header */
  .card-header { display:flex; align-items:center; gap:12px; padding:20px 20px 16px; }
  .card-header-icon {
    width:36px; height:36px; border-radius:10px;
    display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;
  }
  .card-title { font-size:15px; font-weight:700; margin:0; }

  /* Settings */
  .setting-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 20px;
  }
  .profile-page.light .setting-row { border-bottom:1px solid rgba(0,0,0,0.05); }
  .profile-page.dark  .setting-row { border-bottom:1px solid rgba(255,255,255,0.05); }
  .setting-row.no-border { border-bottom:none; }
  .setting-info { flex:1; }
  .setting-label { font-size:13px; font-weight:600; margin:0 0 2px; }
  .setting-desc { font-size:12px; margin:0; }
  .profile-page.light .setting-desc { color:#9CA3AF; }
  .profile-page.dark  .setting-desc { color:#6B7280; }

  .toggle-switch {
    width:46px; height:26px; border-radius:999px; border:none; cursor:pointer; position:relative;
    background:#E5E7EB; transition:background 0.3s; flex-shrink:0;
  }
  .toggle-switch.on { background:linear-gradient(135deg,#5B4FE9,#7C3AED); }
  .toggle-thumb {
    position:absolute; top:3px; width:20px; height:20px; border-radius:50%;
    background:#fff; box-shadow:0 2px 6px rgba(0,0,0,0.2); transition:transform 0.3s;
    transform:translateX(3px);
  }
  .toggle-switch.on .toggle-thumb { transform:translateX(23px); }

  .soon-badge {
    font-size:11px; font-weight:600; padding:3px 10px; border-radius:999px;
    background:rgba(245,158,11,0.12); color:#F59E0B; border:1px solid rgba(245,158,11,0.25);
  }

  /* Account Info */
  .info-row {
    display:flex; justify-content:space-between; align-items:center; padding:12px 20px;
  }
  .profile-page.light .info-row { border-bottom:1px solid rgba(0,0,0,0.05); }
  .profile-page.dark  .info-row { border-bottom:1px solid rgba(255,255,255,0.05); }
  .info-row.no-border { border-bottom:none; }
  .info-label { font-size:12px; font-weight:500; }
  .profile-page.light .info-label { color:#9CA3AF; }
  .profile-page.dark  .info-label { color:#6B7280; }
  .info-value { font-size:13px; font-weight:600; }

  .account-actions { display:flex; gap:10px; padding:16px 20px 20px; }
  .btn-primary {
    flex:1; padding:10px; border-radius:10px; border:none; cursor:pointer;
    background:linear-gradient(135deg,#5B4FE9,#7C3AED); color:#fff;
    font-size:13px; font-weight:600; font-family:'Sora',sans-serif;
    transition:all 0.2s; box-shadow:0 4px 12px rgba(91,79,233,0.3);
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(91,79,233,0.4); }
  .btn-danger {
    flex:1; padding:10px; border-radius:10px; cursor:pointer;
    background:transparent; color:#EF4444;
    font-size:13px; font-weight:600; font-family:'Sora',sans-serif;
    transition:all 0.2s; border:1.5px solid rgba(239,68,68,0.3);
  }
  .btn-danger:hover { background:rgba(239,68,68,0.08); border-color:#EF4444; transform:translateY(-1px); }

  /* Quick Actions */
  .quick-link {
    display:flex; align-items:center; gap:14px; padding:14px 20px; cursor:pointer;
    transition:background 0.2s;
  }
  .profile-page.light .quick-link { border-bottom:1px solid rgba(0,0,0,0.05); }
  .profile-page.dark  .quick-link { border-bottom:1px solid rgba(255,255,255,0.05); }
  .quick-link:last-child { border-bottom:none; }
  .quick-link:hover { background:rgba(91,79,233,0.06); }
  .quick-icon-wrap {
    width:40px; height:40px; border-radius:12px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    transition:transform 0.2s;
  }
  .quick-link:hover .quick-icon-wrap { transform:scale(1.1) rotate(-5deg); }
  .quick-text { flex:1; display:flex; flex-direction:column; gap:2px; }
  .quick-label { font-size:13px; font-weight:600; }
  .quick-sub { font-size:11px; }
  .profile-page.light .quick-sub { color:#9CA3AF; }
  .profile-page.dark  .quick-sub { color:#6B7280; }
  .quick-arrow { font-size:22px; font-weight:300; transition:transform 0.2s; }
  .quick-link:hover .quick-arrow { transform:translateX(4px); }
`;
