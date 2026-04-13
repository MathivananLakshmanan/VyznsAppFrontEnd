import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getMyItems, createItem, deleteItem } from "../features/items/itemsApi";
import type { Item } from "../types/models";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

const STATUS_COLORS: Record<string, { color: string; bg: string; darkBg: string }> = {
  AVAILABLE:    { color: "#059669", bg: "#D1FAE5", darkBg: "#064E3B" },
  OUT_OF_STOCK: { color: "#D97706", bg: "#FEF3C7", darkBg: "#451A03" },
  RESERVED:     { color: "#2563EB", bg: "#DBEAFE", darkBg: "#1E3A5F" },
  SOLD:         { color: "#6B7280", bg: "#F3F4F6", darkBg: "#1F2937" },
};

export default function MyItems() {
  const { dark } = useTheme();
  const T = dark ? D : L;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Item>();

  const load = () => { setLoading(true); getMyItems().then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const onSubmit = async (data: Item) => {
    setSubmitting(true);
    try { await createItem(data); reset(); setShowForm(false); load(); }
    finally { setSubmitting(false); }
  };

  const inp: React.CSSProperties = { padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text, fontSize: 14, outline: "none", width: "100%", transition: "border-color 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Inter',sans-serif", transition: "background 0.3s,color 0.3s" }}>
      <style>{css}</style>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: T.text, marginBottom: 4 }}>My Listings</h1>
            <p style={{ fontSize: 14, color: T.text3 }}>{items.length} item{items.length !== 1 ? "s" : ""} listed</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px 20px", borderRadius: 10, border: showForm ? `1.5px solid ${T.border}` : "none", background: showForm ? T.surface : "#5B4FE9", color: showForm ? T.text2 : "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.15s" }}>
            {showForm ? "✕ Cancel" : "+ List New Item"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={{ background: T.surface, borderRadius: 16, padding: 28, border: `1px solid ${T.border}`, marginBottom: 28, boxShadow: dark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.06)", animation: "slideDown 0.3s ease both" }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, marginBottom: 20 }}>List a New Item</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  { key: "title", label: "Title *", placeholder: "e.g. iPhone 13 Pro", type: "text" },
                  { key: "category", label: "Category *", placeholder: "e.g. Electronics", type: "text" },
                  { key: "price", label: "Price (₹) *", placeholder: "0", type: "number" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>{label}</label>
                    <input {...register(key as any, { required: true })} placeholder={placeholder} type={type} style={inp} className="vyzns-inp" />
                    {(errors as any)[key] && <p style={{ fontSize: 12, color: "#EF4444" }}>Required</p>}
                  </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>Condition *</label>
                  <select {...register("condition", { required: true })} style={{ ...inp, appearance: "auto" }} className="vyzns-inp">
                    <option value="">Select condition</option>
                    <option value="NEW">New — Never used</option>
                    <option value="USED">Used — Good condition</option>
                    <option value="DAMAGE">Damaged — Has issues</option>
                    <option value="WOREST_CONDITION">Poor — Needs repair</option>
                  </select>
                  {errors.condition && <p style={{ fontSize: 12, color: "#EF4444" }}>Required</p>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>Image URL <span style={{ color: T.text3, fontWeight: 400 }}>(optional)</span></label>
                  <input {...register("image_url")} placeholder="https://..." style={inp} className="vyzns-inp" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>Description *</label>
                  <textarea {...register("description", { required: true })} placeholder="Describe your item..." style={{ ...inp, resize: "vertical", minHeight: 80 }} rows={3} className="vyzns-inp" />
                  {errors.description && <p style={{ fontSize: 12, color: "#EF4444" }}>Required</p>}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} style={{ padding: "10px 20px", borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface, color: T.text2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: submitting ? T.border : "#5B4FE9", color: submitting ? T.text3 : "#fff", fontWeight: 600, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.15s" }}>
                  {submitting ? "Listing..." : "List Item →"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div style={{ width: 36, height: 36, border: `3px solid ${T.border}`, borderTop: "3px solid #5B4FE9", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /></div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 56, margin: "0 0 16px" }}>📦</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>No items listed yet</h3>
            <p style={{ color: T.text3, fontSize: 14, marginBottom: 20 }}>Start by listing your first item</p>
            <button onClick={() => setShowForm(true)} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#5B4FE9", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>+ List Your First Item</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {items.map((item, i) => {
              const st = STATUS_COLORS[item.status ?? "AVAILABLE"] ?? STATUS_COLORS.AVAILABLE;
              return (
                <div key={i} style={{ background: T.surface, borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)", animation: "fadeUp 0.4s ease both", transition: "transform 0.2s,box-shadow 0.2s" }} className="vyzns-card">
                  <div style={{ height: 180, overflow: "hidden", background: T.surface2, position: "relative" }}>
                    {item.image_url ? <img src={item.image_url} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 40 }}>📦</div>}
                    <span style={{ position: "absolute", top: 10, right: 10, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, color: st.color, background: dark ? st.darkBg : st.bg }}>{item.status}</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#5B4FE9", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, margin: "4px 0 6px" }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: T.text3, lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                      <span style={{ fontSize: 20, fontWeight: 800, color: "#059669" }}>₹{item.price}</span>
                      <button onClick={() => setDeleteId(item.id!)} style={{ padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.surface, color: T.text3, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }} className="vyzns-del">🗑 Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDeleteId(null)}>
          <div style={{ background: T.surface, borderRadius: 20, padding: 32, textAlign: "center", maxWidth: 360, width: "90%", border: `1px solid ${T.border}`, boxShadow: "0 24px 64px rgba(0,0,0,0.3)", animation: "modalIn 0.25s ease both" }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: 40, margin: "0 0 12px" }}>🗑</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>Remove this item?</h3>
            <p style={{ color: T.text3, fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: 10, borderRadius: 10, border: `1.5px solid ${T.border}`, background: T.surface, color: T.text2, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { deleteItem(deleteId).then(() => { setDeleteId(null); load(); }); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: "#EF4444", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const L = { bg: "#F8F7FF", surface: "#fff", surface2: "#F3F4F6", border: "#E5E7EB", text: "#111827", text2: "#374151", text3: "#6B7280" };
const D = { bg: "#0F0F13", surface: "#1A1A24", surface2: "#252532", border: "#2E2E3E", text: "#F9FAFB", text2: "#D1D5DB", text3: "#9CA3AF" };

const css = `
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes modalIn{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
  .vyzns-card:hover{transform:translateY(-3px)!important;box-shadow:0 12px 32px rgba(91,79,233,0.15)!important}
  .vyzns-inp:focus{border-color:#5B4FE9!important;box-shadow:0 0 0 3px rgba(91,79,233,0.1)!important;outline:none!important}
  .vyzns-del:hover{background:#FEE2E2!important;color:#DC2626!important;border-color:#FECACA!important}
`;
