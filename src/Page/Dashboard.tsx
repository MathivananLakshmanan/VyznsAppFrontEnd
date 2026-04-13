import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllItems, searchItems, getMyItems, createExchange } from "../features/items/itemsApi";
import type { Item } from "../types/models";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

const COND: Record<string, { label: string; color: string; bg: string; darkBg: string }> = {
  NEW:              { label: "New",     color: "#059669", bg: "#D1FAE5", darkBg: "#064E3B" },
  USED:             { label: "Used",    color: "#D97706", bg: "#FEF3C7", darkBg: "#451A03" },
  DAMAGE:           { label: "Damaged", color: "#DC2626", bg: "#FEE2E2", darkBg: "#450A0A" },
  WOREST_CONDITION: { label: "Poor",    color: "#7C3AED", bg: "#EDE9FE", darkBg: "#2E1065" },
};

export default function Dashboard() {
  const { dark } = useTheme();
  const T = dark ? D : L;
  const [items, setItems] = useState<Item[]>([]);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [offeredItemId, setOfferedItemId] = useState<number | "">("");
  const [exchangeMsg, setExchangeMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [activeCat, setActiveCat] = useState("All");
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    Promise.all([getAllItems(), getMyItems()])
      .then(([all, mine]) => { setItems(all); setMyItems(mine); })
      .finally(() => setLoading(false));
  }, []);

  const cats = ["All", ...Array.from(new Set(items.map(i => i.category).filter(Boolean)))];
  const filtered = activeCat === "All" ? items : items.filter(i => i.category === activeCat);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) { getAllItems().then(setItems); return; }
    setLoading(true);
    searchItems(search).then(setItems).finally(() => setLoading(false));
  };

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExchange = async () => {
    if (!offeredItemId || !selectedItem?.id) return;
    setSubmitting(true);
    try {
      await createExchange({ fromUserId: userId, toUserId: selectedItem.owner!, offeredItemId: Number(offeredItemId), requestedItemId: selectedItem.id, message: exchangeMsg });
      setSelectedItem(null); setOfferedItemId(""); setExchangeMsg("");
      showToast("Exchange request sent!", true);
    } catch { showToast("Failed to send request.", false); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter',sans-serif", transition: "background 0.3s,color 0.3s" }}>
      <style>{css}</style>
      <Navbar />

      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", padding: "12px 20px", borderRadius: 12, border: "1px solid", fontSize: 14, fontWeight: 600, zIndex: 9999, whiteSpace: "nowrap", animation: "toastIn 0.3s ease both", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", background: toast.ok ? (dark ? "#064E3B" : "#ECFDF5") : (dark ? "#450A0A" : "#FEF2F2"), borderColor: toast.ok ? (dark ? "#065F46" : "#A7F3D0") : (dark ? "#7F1D1D" : "#FECACA"), color: toast.ok ? (dark ? "#6EE7B7" : "#065F46") : (dark ? "#FCA5A5" : "#991B1B") }}>
          {toast.ok ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div style={{ background: dark ? "linear-gradient(135deg,#3730A3,#5B21B6)" : "linear-gradient(135deg,#5B4FE9,#7C3AED)", padding: "32px 16px 24px", color: "#fff" }}>
        <div style={{ maxWidth: 640, marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(22px,5vw,32px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>Find your next great exchange</h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 24 }}>Browse {items.length} items listed by real people</p>
          <form onSubmit={handleSearch} style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: dark ? "#1A1A24" : "#fff", borderRadius: 12, padding: "6px 6px 6px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              <span style={{ fontSize: 16, color: "#9CA3AF" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items, categories..." style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: T.text, background: "transparent" }} />
              <button type="submit" style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#5B4FE9", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Search</button>
            </div>
          </form>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[{ n: items.length, l: "Total Items" }, { n: myItems.length, l: "My Listings" }, { n: items.filter(i => i.status === "AVAILABLE").length, l: "Available" }].map(({ n, l }) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{n}</span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category bar */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: T.surface, borderBottom: `1px solid ${T.border}`, overflowX: "auto" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setActiveCat(c)} style={{ padding: "6px 16px", borderRadius: 999, border: `1.5px solid ${activeCat === c ? "#5B4FE9" : T.border}`, background: activeCat === c ? (dark ? "#2A2560" : "#EEF0FF") : T.surface, color: activeCat === c ? "#5B4FE9" : T.text3, fontSize: 13, fontWeight: activeCat === c ? 600 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ padding: "20px 16px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{activeCat === "All" ? "All Listings" : activeCat}</h2>
          <span style={{ fontSize: 12, color: T.text3, background: T.surface2, padding: "3px 10px", borderRadius: 999 }}>{filtered.length} items</span>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div style={{ width: 36, height: 36, border: `3px solid ${T.border}`, borderTop: "3px solid #5B4FE9", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 48, margin: "0 0 12px" }}>🔍</p>
            <p style={{ color: T.text2, fontSize: 16, fontWeight: 500 }}>No items found</p>
            <p style={{ color: T.text3, fontSize: 14 }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {filtered.map((item, i) => {
              const cond = COND[item.condition] ?? { label: item.condition, color: "#6B7280", bg: "#F3F4F6", darkBg: "#1F2937" };
              const isOwn = item.owner === userId;
              return (
                <div key={i} style={{ background: T.surface, borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)", animation: "fadeUp 0.4s ease both", transition: "transform 0.2s,box-shadow 0.2s" }} className="vyzns-card">
                  <div style={{ height: 190, overflow: "hidden", background: T.surface2, position: "relative" }}>
                    {item.image_url ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 44 }}>📦</div>}
                    <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, color: cond.color, background: dark ? cond.darkBg : cond.bg }}>{cond.label}</span>
                      {item.status === "AVAILABLE" && <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, background: dark ? "#064E3B" : "#D1FAE5", color: dark ? "#6EE7B7" : "#065F46" }}>● Available</span>}
                    </div>
                    {isOwn && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(91,79,233,0.85)", color: "#fff", fontSize: 11, fontWeight: 600, textAlign: "center", padding: 5 }}>Your listing</div>}
                  </div>
                  <div style={{ padding: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#5B4FE9", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: "4px 0 6px", lineHeight: 1.3 }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>₹{item.price}</span>
                      {!isOwn ? (
                        <button onClick={() => setSelectedItem(item)} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#5B4FE9", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }} className="vyzns-btn">🔄 Exchange</button>
                      ) : (
                        <span style={{ fontSize: 12, color: T.text3, background: T.surface2, padding: "6px 12px", borderRadius: 8 }}>Your item</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exchange Modal */}
      {selectedItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelectedItem(null)}>
          <div style={{ background: T.surface, borderRadius: 20, padding: "28px 32px", width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.3)", animation: "modalIn 0.25s ease both", border: `1px solid ${T.border}` }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>Request an Exchange</h3>
              <button onClick={() => setSelectedItem(null)} style={{ background: "none", border: "none", fontSize: 18, color: T.text3, cursor: "pointer" }}>✕</button>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>You want this item:</p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", background: T.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {selectedItem.image_url ? <img src={selectedItem.image_url} alt={selectedItem.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 24 }}>📦</span>}
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: T.text }}>{selectedItem.title}</p>
                <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800, color: "#059669" }}>₹{selectedItem.price}</p>
                <p style={{ margin: 0, fontSize: 11, color: T.text3 }}>Owner #{selectedItem.owner}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 13, color: "#5B4FE9", fontWeight: 600, whiteSpace: "nowrap" }}>⇅ In exchange for</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Select one of your items to offer</label>
              {myItems.length === 0 ? (
                <div style={{ background: dark ? "#451A03" : "#FEF3C7", border: `1px solid ${dark ? "#78350F" : "#FDE68A"}`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: dark ? "#FCD34D" : "#92400E" }}>
                  No items listed. <span style={{ color: "#5B4FE9", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/my-items")}>Add one →</span>
                </div>
              ) : (
                <select value={offeredItemId} onChange={e => setOfferedItemId(Number(e.target.value))} style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text, fontSize: 14, outline: "none" }}>
                  <option value="">Choose your item...</option>
                  {myItems.map(m => <option key={m.id} value={m.id}>{m.title} — ₹{m.price}</option>)}
                </select>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.text2, marginBottom: 6 }}>Message <span style={{ color: T.text3, fontWeight: 400 }}>(optional)</span></label>
              <textarea value={exchangeMsg} onChange={e => setExchangeMsg(e.target.value)} placeholder="Hi! I'd love to exchange..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text, fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" }} rows={3} />
            </div>
            <button onClick={handleExchange} disabled={!offeredItemId || submitting} style={{ width: "100%", padding: 13, borderRadius: 12, border: "none", background: !offeredItemId || submitting ? T.border : "#5B4FE9", color: !offeredItemId || submitting ? T.text3 : "#fff", fontWeight: 700, fontSize: 15, cursor: !offeredItemId || submitting ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
              {submitting ? "Sending..." : "Send Exchange Request →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const L = { bg: "#F8F7FF", surface: "#fff", surface2: "#F3F4F6", border: "#E5E7EB", text: "#111827", text2: "#374151", text3: "#6B7280" };
const D = { bg: "#0F0F13", surface: "#1A1A24", surface2: "#252532", border: "#2E2E3E", text: "#F9FAFB", text2: "#D1D5DB", text3: "#9CA3AF" };

const css = `
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
  @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)} }
  .vyzns-card:hover{transform:translateY(-4px)!important;box-shadow:0 16px 48px rgba(91,79,233,0.15)!important}
  .vyzns-btn:hover{background:#4338CA!important;transform:translateY(-1px)!important}
`;
