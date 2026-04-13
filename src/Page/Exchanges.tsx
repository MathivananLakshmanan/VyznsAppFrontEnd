import { useEffect, useRef, useState } from "react";
import { getUserExchanges, getChatHistory, sendMessage } from "../features/items/itemsApi";
import type { Exchange, Message } from "../types/models";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

const STATUS: Record<string, { color: string; bg: string; darkBg: string; label: string }> = {
  PENDING:    { color: "#D97706", bg: "#FEF3C7", darkBg: "#451A03", label: "Pending" },
  PROCESSING: { color: "#2563EB", bg: "#DBEAFE", darkBg: "#1E3A5F", label: "Processing" },
  SHIPPED:    { color: "#059669", bg: "#D1FAE5", darkBg: "#064E3B", label: "Shipped" },
  DELIVERED:  { color: "#5B4FE9", bg: "#EEF0FF", darkBg: "#2A2560", label: "Delivered" },
};

export default function Exchanges() {
  const { dark } = useTheme();
  const T = dark ? D : L;
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Exchange | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [sending, setSending] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userId = Number(localStorage.getItem("userId"));
  const getName = (ex: any) => {
    const from = ex.fromUser?.id ?? ex.fromUserId;
    const to = ex.toUser?.id ?? ex.toUserId;
    const offeredId = ex.offeredItem?.id ?? ex.offeredItemId;
    const requestedId = ex.requestedItem?.id ?? ex.requestedItemId;
    return { from, to, offeredId, requestedId };
  };

  useEffect(() => {
    const load = () => { if (!userId) return; getUserExchanges(userId).then(setExchanges).finally(() => setLoading(false)); };
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!active?.id) return;
    const load = () => { setMsgLoading(true); getChatHistory(active.id!).then(setMessages).finally(() => setMsgLoading(false)); };
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [active]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    const text = msgInput.trim();
    if (!text || !active?.id || sending) return;
    setSending(true); setMsgInput("");
    try { await sendMessage({ exchangeId: active.id, senderId: userId, message: text, read: false }); getChatHistory(active.id).then(setMessages); }
    finally { setSending(false); }
  };

  const pill = (status: string) => {
    const st = STATUS[status] ?? STATUS.PENDING;
    return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999, color: st.color, background: dark ? st.darkBg : st.bg }}>{st.label}</span>;
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.text, fontFamily: "'Inter',sans-serif", transition: "background 0.3s,color 0.3s", overflow: "hidden" }}>
      <style>{css}</style>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel */}
        <div style={{ width: 360, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden", transition: "background 0.3s,border-color 0.3s" }}>
          <div style={{ padding: "18px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 2px" }}>Exchanges</h2>
            <p style={{ fontSize: 12, color: T.text3, margin: 0 }}>{exchanges.length} total · <span style={{ color: "#059669", animation: "pulse 2s ease-in-out infinite" }}>● Live</span></p>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div style={{ width: 28, height: 28, border: `3px solid ${T.border}`, borderTop: "3px solid #5B4FE9", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /></div>
            ) : exchanges.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 16px" }}>
                <p style={{ fontSize: 40, margin: "0 0 10px" }}>🔄</p>
                <p style={{ fontWeight: 600, color: T.text, marginBottom: 4 }}>No exchanges yet</p>
                <p style={{ fontSize: 13, color: T.text3 }}>Browse items and send a request</p>
              </div>
            ) : exchanges.map((ex, i) => {
              const isActive = active?.id === ex.id;
              const { from, to, offeredId, requestedId } = getName(ex);
              const isMe = from === userId;
              return (
                <div key={i} onClick={() => { setActive(ex); setMessages([]); }} style={{ background: isActive ? (dark ? "#2A2560" : "#F8F7FF") : T.surface, border: `1.5px solid ${isActive ? "#5B4FE9" : T.border}`, borderRadius: 12, padding: 14, marginBottom: 8, cursor: "pointer", transition: "all 0.15s", boxShadow: isActive ? "0 4px 16px rgba(91,79,233,0.15)" : "none" }} className="vyzns-ex">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 12, background: T.surface2, padding: "3px 8px", borderRadius: 6, color: T.text2, fontWeight: 500 }}>📦 #{offeredId ?? "?"}</span>
                      <span style={{ fontSize: 14, color: "#5B4FE9", fontWeight: 700 }}>⇄</span>
                      <span style={{ fontSize: 12, background: T.surface2, padding: "3px 8px", borderRadius: 6, color: T.text2, fontWeight: 500 }}>📦 #{requestedId ?? "?"}</span>
                    </div>
                    {pill(ex.status ?? "PENDING")}
                  </div>
                  <p style={{ fontSize: 12, color: T.text3, margin: "0 0 4px" }}>{isMe ? "You" : `User #${from}`} → {to === userId ? "You" : `User #${to}`}</p>
                  {ex.message && <p style={{ fontSize: 12, color: "#5B4FE9", fontStyle: "italic", margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{ex.message}"</p>}
                  <p style={{ fontSize: 11, color: T.text3, margin: 0, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>{isActive ? "💬 Chatting now" : "💬 Click to open chat"}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg, transition: "background 0.3s" }}>
          {!active ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: dark ? "#2A2560" : "#EEF0FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 16 }}>💬</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 8 }}>Select an exchange to chat</h3>
              <p style={{ fontSize: 14, color: T.text3, marginBottom: 20 }}>Messages sync automatically every 3 seconds</p>
              {["Real-time messaging", "Auto-refresh every 3s", "Read receipts"].map(f => (
                <p key={f} style={{ fontSize: 13, color: "#059669", fontWeight: 500, margin: "3px 0" }}>✓ {f}</p>
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Chat header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", background: T.surface, borderBottom: `1px solid ${T.border}`, transition: "background 0.3s,border-color 0.3s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#5B4FE9,#7C3AED)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700 }}>
                    {(active as any).fromUser?.id === userId || (active as any).fromUserId === userId ? (localStorage.getItem("userName") || "U").charAt(0).toUpperCase() : `#${(active as any).fromUser?.id ?? (active as any).fromUserId}`}
                  </div>
                  <div>
                    <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: T.text }}>Exchange #{active.id}</p>
                    <p style={{ margin: 0, fontSize: 12, color: T.text3 }}>Item #{(active as any).offeredItem?.id ?? active.offeredItemId ?? "?"} ⇄ Item #{(active as any).requestedItem?.id ?? active.requestedItemId ?? "?"}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {pill(active.status ?? "PENDING")}
                  <button onClick={() => setActive(null)} style={{ background: "none", border: "none", fontSize: 16, color: T.text3, cursor: "pointer", padding: "4px 8px", borderRadius: 6 }}>✕</button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {msgLoading && messages.length === 0 && <div style={{ textAlign: "center", padding: 20 }}><div style={{ width: 28, height: 28, border: `3px solid ${T.border}`, borderTop: "3px solid #5B4FE9", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }} /></div>}
                {!msgLoading && messages.length === 0 && (
                  <div style={{ textAlign: "center", margin: "auto" }}>
                    <p style={{ fontSize: 32, margin: "0 0 8px" }}>👋</p>
                    <p style={{ color: T.text3, fontSize: 14 }}>No messages yet — say hello!</p>
                  </div>
                )}
                {messages.map((msg: any, i) => {
                  const isMe = msg.sender?.id === userId || msg.senderId === userId;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: isMe ? "flex-end" : "flex-start", animation: "msgIn 0.2s ease both" }}>
                      {!isMe && <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.surface2, color: T.text2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{String(msg.sender?.id ?? "?").charAt(0)}</div>}
                      <div style={{ background: isMe ? "#5B4FE9" : T.surface, color: isMe ? "#fff" : T.text, borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "10px 14px", maxWidth: "65%", border: isMe ? "none" : `1px solid ${T.border}`, boxShadow: isMe ? "0 4px 12px rgba(91,79,233,0.25)" : dark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
                        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{msg.message}</p>
                        <p style={{ margin: "4px 0 0", fontSize: 10, opacity: 0.6, textAlign: isMe ? "right" : "left" }}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                          {isMe && <span style={{ marginLeft: 6, color: msg.read ? "#A5B4FC" : "rgba(255,255,255,0.5)" }}>{msg.read ? "✓✓" : "✓"}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", padding: "14px 20px", background: T.surface, borderTop: `1px solid ${T.border}`, transition: "background 0.3s,border-color 0.3s" }}>
                <textarea value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message... (Enter to send)" style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text, fontSize: 14, outline: "none", resize: "none", lineHeight: 1.5, transition: "border-color 0.2s" }} rows={1} className="vyzns-msg" />
                <button onClick={handleSend} disabled={sending || !msgInput.trim()} style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: sending || !msgInput.trim() ? T.border : "#5B4FE9", color: sending || !msgInput.trim() ? T.text3 : "#fff", cursor: sending || !msgInput.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const L = { bg: "#F8F7FF", surface: "#fff", surface2: "#F3F4F6", border: "#E5E7EB", text: "#111827", text2: "#374151", text3: "#6B7280" };
const D = { bg: "#0F0F13", surface: "#1A1A24", surface2: "#252532", border: "#2E2E3E", text: "#F9FAFB", text2: "#D1D5DB", text3: "#9CA3AF" };

const css = `
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .vyzns-ex:hover{border-color:#5B4FE9!important}
  .vyzns-msg:focus{border-color:#5B4FE9!important;outline:none!important;box-shadow:0 0 0 3px rgba(91,79,233,0.1)!important}
`;
