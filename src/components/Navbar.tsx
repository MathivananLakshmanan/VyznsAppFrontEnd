import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import logoImg from "../assets/Screenshot 2026-04-10 155741.png";

const links = [
  { label: "Discover",  path: "/dashboard", icon: "🧭" },
  { label: "My Items",  path: "/my-items",  icon: "🗂️" },
  { label: "Trades",    path: "/exchanges", icon: "↔️" },
  { label: "AI Chat",   path: "/ai-chat",   icon: "🤖" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { dark, toggle } = useTheme();
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userName  = localStorage.getItem("userName")  || "User";
  const userId    = localStorage.getItem("userId")    || "—";
  const userEmail = localStorage.getItem("userEmail") || "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cls = (...c: string[]) => c.filter(Boolean).join(" ");

  return (
    <>
      <style>{navCss(dark)}</style>
      <nav className={cls("vn", dark ? "vn-dark" : "vn-light", scrolled ? "vn-scrolled" : "")}>

        <div className="vn-left">
          <div className="vn-brand" onClick={() => navigate("/dashboard")}>
            <img src={logoImg} alt="Vyzns" className="vn-logo" />
          </div>

          <div className="vn-links">
            {links.map(({ label, path, icon }) => {
              const active = pathname === path;
              return (
                <button key={path} className={cls("vn-link", active ? "vn-link-active" : "")} onClick={() => navigate(path)}>
                  <span className="vn-link-icon">{icon}</span>
                  <span>{label}</span>
                  {active && <span className="vn-pip" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="vn-right">
          <button className="vn-icon-btn" onClick={toggle} title="Toggle theme">
            {dark ? "☀️" : "🌙"}
          </button>

          <div className="vn-profile-wrap">
            <button className="vn-profile-btn" onClick={() => setDropOpen(o => !o)}>
              <div className="vn-av">
                {userName.charAt(0).toUpperCase()}
                <span className="vn-av-dot" />
              </div>
              <div className="vn-profile-info">
                <span className="vn-profile-name">{userName}</span>
                <span className="vn-profile-id">#{userId}</span>
              </div>
              <span className={cls("vn-chevron", dropOpen ? "vn-chevron-open" : "")}>⌄</span>
            </button>

            {dropOpen && (
              <div className="vn-drop">
                <div className="vn-drop-top">
                  <div className="vn-drop-av">{userName.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="vn-drop-name">{userName}</p>
                    {userEmail && <p className="vn-drop-email">{userEmail}</p>}
                    <span className="vn-drop-badge">Free Member</span>
                  </div>
                </div>

                <div className="vn-drop-menu">
                  {[
                    { icon: "👤", label: "My Profile",    path: "/profile" },
                    { icon: "🗂️", label: "My Listings",   path: "/my-items" },
                    { icon: "↔️", label: "My Trades",     path: "/exchanges" },
                    { icon: "⚙️", label: "Settings",      path: "/profile" },
                  ].map(({ icon, label, path }) => (
                    <button key={label} className="vn-drop-item" onClick={() => { navigate(path); setDropOpen(false); }}>
                      <span className="vn-drop-item-icon">{icon}</span>
                      <span>{label}</span>
                      <span className="vn-drop-item-arrow">›</span>
                    </button>
                  ))}
                </div>

                <div className="vn-drop-sep" />

                <button className="vn-drop-item" onClick={toggle}>
                  <span className="vn-drop-item-icon">{dark ? "☀️" : "🌙"}</span>
                  <span>{dark ? "Light Mode" : "Dark Mode"}</span>
                  <div className={cls("vn-mini-tog", dark ? "vn-mini-tog-on" : "")}>
                    <span className="vn-mini-thumb" />
                  </div>
                </button>

                <div className="vn-drop-sep" />

                <button className="vn-drop-item vn-drop-danger" onClick={() => { localStorage.clear(); navigate("/login"); }}>
                  <span className="vn-drop-item-icon">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {dropOpen && <div className="vn-backdrop" onClick={() => setDropOpen(false)} />}
    </>
  );
}

const navCss = (dark: boolean) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes vn-drop-in {
    from { opacity:0; transform:translateY(-8px) scale(0.98); }
    to   { opacity:1; transform:translateY(0)    scale(1);    }
  }

  .vn {
    position: sticky; top: 0; z-index: 500;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px; height: 62px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
  }
  .vn-light {
    background: rgba(255,255,255,0.92);
    border-bottom: 1px solid #F0EBF8;
    backdrop-filter: blur(16px);
  }
  .vn-dark {
    background: rgba(14,12,20,0.92);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(16px);
  }
  .vn-scrolled.vn-light { box-shadow: 0 4px 24px rgba(120,80,200,0.10); }
  .vn-scrolled.vn-dark  { box-shadow: 0 4px 24px rgba(0,0,0,0.40); }

  .vn-left  { display:flex; align-items:center; gap:32px; }
  .vn-right { display:flex; align-items:center; gap:10px; }

  .vn-brand { cursor:pointer; display:flex; align-items:center; }
  .vn-logo  { height:36px; width:auto; object-fit:contain; }

  .vn-links { display:flex; gap:2px; }
  .vn-link {
    display:flex; align-items:center; gap:6px;
    padding: 7px 13px; border-radius:10px; border:none; cursor:pointer;
    font-size:13.5px; font-weight:500; font-family:'Plus Jakarta Sans',sans-serif;
    background:transparent; position:relative;
    color: ${dark ? "#9B8EC4" : "#7C6FA0"};
    transition: color 0.18s, background 0.18s;
  }
  .vn-link:hover {
    color: ${dark ? "#E2D9F3" : "#3D1F8D"};
    background: ${dark ? "rgba(167,139,250,0.10)" : "rgba(109,40,217,0.07)"};
  }
  .vn-link-active {
    color: ${dark ? "#C4B5FD" : "#5B21B6"} !important;
    font-weight: 700;
    background: ${dark ? "rgba(167,139,250,0.14)" : "rgba(109,40,217,0.09)"} !important;
  }
  .vn-link-icon { font-size:15px; }
  .vn-pip {
    position:absolute; bottom:5px; left:50%; transform:translateX(-50%);
    width:5px; height:5px; border-radius:50%;
    background: ${dark ? "#A78BFA" : "#7C3AED"};
  }

  .vn-icon-btn {
    width:38px; height:38px; border-radius:10px; border:none; cursor:pointer;
    font-size:17px; display:flex; align-items:center; justify-content:center;
    background: ${dark ? "rgba(167,139,250,0.12)" : "rgba(109,40,217,0.07)"};
    transition: transform 0.2s, background 0.2s;
  }
  .vn-icon-btn:hover { transform:scale(1.12) rotate(12deg); background:${dark ? "rgba(167,139,250,0.22)" : "rgba(109,40,217,0.14)"}; }

  .vn-profile-wrap { position:relative; }
  .vn-profile-btn {
    display:flex; align-items:center; gap:9px; padding:5px 10px 5px 5px;
    border-radius:12px; border:none; cursor:pointer; background:transparent;
    font-family:'Plus Jakarta Sans',sans-serif;
    transition: background 0.18s;
  }
  .vn-profile-btn:hover { background:${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}; }

  .vn-av {
    width:34px; height:34px; border-radius:50%; flex-shrink:0; position:relative;
    background: linear-gradient(135deg, #7C3AED, #DB2777);
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:14px; font-weight:700;
  }
  .vn-av-dot {
    position:absolute; bottom:1px; right:1px;
    width:9px; height:9px; border-radius:50%; background:#22C55E;
    border:2px solid ${dark ? "#0E0C14" : "#fff"};
  }
  .vn-profile-info { display:flex; flex-direction:column; gap:1px; text-align:left; }
  .vn-profile-name { font-size:13px; font-weight:600; color:${dark ? "#EDE9FE" : "#1E1B4B"}; line-height:1.2; }
  .vn-profile-id   { font-size:10px; color:${dark ? "#6B5FA0" : "#9CA3AF"}; line-height:1; }
  .vn-chevron { font-size:16px; color:${dark ? "#6B5FA0" : "#9CA3AF"}; transition:transform 0.22s; line-height:1; }
  .vn-chevron-open { transform:rotate(180deg); }

  /* Dropdown */
  .vn-drop {
    position:absolute; top:calc(100% + 10px); right:0; width:256px;
    border-radius:16px; overflow:hidden; z-index:600;
    animation: vn-drop-in 0.2s cubic-bezier(0.16,1,0.3,1) both;
    background: ${dark ? "#1A1625" : "#FFFFFF"};
    border: 1px solid ${dark ? "rgba(167,139,250,0.18)" : "#EDE9FE"};
    box-shadow: ${dark
      ? "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(167,139,250,0.08)"
      : "0 24px 64px rgba(109,40,217,0.12), 0 4px 16px rgba(0,0,0,0.06)"};
  }
  .vn-drop-top {
    display:flex; gap:12px; align-items:center; padding:16px;
    background: ${dark ? "rgba(167,139,250,0.07)" : "#FAF8FF"};
    border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.05)" : "#EDE9FE"};
  }
  .vn-drop-av {
    width:44px; height:44px; border-radius:12px; flex-shrink:0;
    background:linear-gradient(135deg,#7C3AED,#DB2777);
    color:#fff; display:flex; align-items:center; justify-content:center;
    font-size:18px; font-weight:700;
  }
  .vn-drop-name  { margin:0 0 3px; font-size:14px; font-weight:700; color:${dark ? "#EDE9FE" : "#1E1B4B"}; }
  .vn-drop-email { margin:0 0 5px; font-size:11px; color:${dark ? "#7C6FA0" : "#9CA3AF"}; }
  .vn-drop-badge {
    font-size:10px; font-weight:600; padding:2px 8px; border-radius:999px;
    background:${dark ? "rgba(167,139,250,0.15)" : "#EDE9FE"}; color:${dark ? "#A78BFA" : "#7C3AED"};
  }

  .vn-drop-menu { padding:6px 0; }
  .vn-drop-item {
    display:flex; align-items:center; gap:10px; width:100%;
    padding:10px 16px; border:none; cursor:pointer; background:transparent;
    font-size:13px; font-weight:500; font-family:'Plus Jakarta Sans',sans-serif;
    color:${dark ? "#C4B5FD" : "#4C1D95"};
    transition:background 0.15s;
    text-align:left;
  }
  .vn-drop-item:hover { background:${dark ? "rgba(167,139,250,0.10)" : "#FAF8FF"}; }
  .vn-drop-item-icon  { font-size:16px; width:22px; text-align:center; }
  .vn-drop-item-arrow { margin-left:auto; font-size:18px; opacity:0.35; }
  .vn-drop-danger { color:#F43F5E !important; }
  .vn-drop-danger:hover { background:rgba(244,63,94,0.07) !important; }

  .vn-drop-sep { height:1px; background:${dark ? "rgba(255,255,255,0.05)" : "#EDE9FE"}; margin:4px 0; }

  .vn-mini-tog {
    margin-left:auto; width:34px; height:19px; border-radius:999px; position:relative;
    background:${dark ? "#7C3AED" : "#D1D5DB"}; transition:background 0.3s; flex-shrink:0;
  }
  .vn-mini-tog-on { background:#7C3AED !important; }
  .vn-mini-thumb {
    position:absolute; top:2.5px; width:14px; height:14px; border-radius:50%;
    background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.2);
    transition:transform 0.25s;
    transform:${dark ? "translateX(17px)" : "translateX(2px)"};
  }

  .vn-backdrop { position:fixed; inset:0; z-index:499; }
`;
