import { useState, useRef, useEffect } from "react";
import { aiChat } from "../features/items/itemsApi";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

interface Msg { role: "user" | "ai"; text: string; time: string; }

const SUGGESTIONS = [
  "What items are trending right now?",
  "How do I make a good exchange offer?",
  "Tips for writing a great item description",
  "How does the exchange process work?",
];

export default function AiChat() {
  const { dark } = useTheme();
  const T = dark ? D : L;
  const [messages, setMessages] = useState<Msg[]>([{
    role: "ai",
    text: "Hi! I'm your Vyzns AI assistant 👋\n\nI can help you find the best items to exchange, write better listings, understand how trading works, and much more. What would you like to know?",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(p => [...p, { role: "user", text: msg, time }]);
    setLoading(true);
    try {
      const res = await aiChat(msg);
      setMessages(p => [...p, { role: "ai", text: res.response ?? res.message ?? JSON.stringify(res), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMessages(p => [...p, { role: "ai", text: "Sorry, I couldn't connect to the server. Please try again.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, color: T.text, fontFamily: "'Inter',sans-serif", transition: "background 0.3s,color 0.3s", overflow: "hidden" }}>
      <style>{css}</style>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{ width: 280, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", overflow: "hidden", transition: "background 0.3s,border-color 0.3s" }}>
          {/* AI Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 20, borderBottom: `1px solid ${T.border}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#5B4FE9,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: T.text }}>Vyzns AI</p>
              <p style={{ margin: 0, fontSize: 12, color: "#059669", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#059669" }} />Online
              </p>
            </div>
          </div>

          {/* Suggestions */}
          <div style={{ padding: "16px 16px 8px", borderBottom: `1px solid ${T.border}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>Suggested Questions</p>
            {SUGGESTIONS.map(q => (
              <button key={q} onClick={() => send(q)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.surface2, color: T.text2, fontSize: 12, fontWeight: 500, cursor: "pointer", marginBottom: 6, lineHeight: 1.4, transition: "all 0.15s" }} className="vyzns-sug">
                {q}
              </button>
            ))}
          </div>

          {/* Capabilities */}
          <div style={{ padding: "16px 16px 8px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>What I can help with</p>
            {[["🔍", "Find items"], ["📝", "Write listings"], ["🔄", "Exchange tips"], ["💡", "Market insights"]].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 4px" }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 10, justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "msgIn 0.25s ease both" }}>
                {msg.role === "ai" && (
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#5B4FE9,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
                )}
                <div style={{ background: msg.role === "user" ? "#5B4FE9" : T.surface, color: msg.role === "user" ? "#fff" : T.text, borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "12px 16px", maxWidth: "70%", fontSize: 14, lineHeight: 1.6, border: msg.role === "ai" ? `1px solid ${T.border}` : "none", boxShadow: msg.role === "user" ? "0 4px 12px rgba(91,79,233,0.25)" : dark ? "0 1px 4px rgba(0,0,0,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
                  {msg.text.split("\n").map((line, j) => <span key={j}>{line}{j < msg.text.split("\n").length - 1 && <br />}</span>)}
                  <p style={{ margin: "6px 0 0", fontSize: 10, opacity: 0.5, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, justifyContent: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#5B4FE9,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🤖</div>
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "16px 16px 16px 4px", padding: "14px 18px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 0.2, 0.4].map((d, i) => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: T.text3, display: "inline-block", animation: `blink 1.2s ease-in-out ${d}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "16px 28px 20px", background: T.surface, borderTop: `1px solid ${T.border}`, transition: "background 0.3s,border-color 0.3s" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: T.surface2, border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "10px 10px 10px 16px", transition: "border-color 0.2s" }} className="vyzns-input-wrap">
              <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Ask me anything... (Enter to send)" style={{ flex: 1, background: "none", border: "none", outline: "none", color: T.text, fontSize: 14, resize: "none", lineHeight: 1.5 }} rows={1} />
              <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: loading || !input.trim() ? T.border : "#5B4FE9", color: loading || !input.trim() ? T.text3 : "#fff", cursor: loading || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }} className="vyzns-send">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
              </button>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 11, color: T.text3, textAlign: "center" }}>Shift+Enter for new line · Powered by Ollama</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const L = { bg: "#F8F7FF", surface: "#fff", surface2: "#F3F4F6", border: "#E5E7EB", text: "#111827", text2: "#374151", text3: "#6B7280" };
const D = { bg: "#0F0F13", surface: "#1A1A24", surface2: "#252532", border: "#2E2E3E", text: "#F9FAFB", text2: "#D1D5DB", text3: "#9CA3AF" };

const css = `
  @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:0.2;transform:scale(0.8)}50%{opacity:1;transform:scale(1)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .vyzns-sug:hover{border-color:#5B4FE9!important;color:#5B4FE9!important}
  .vyzns-send:hover{background:#4338CA!important}
  .vyzns-input-wrap:focus-within{border-color:#5B4FE9!important;box-shadow:0 0 0 3px rgba(91,79,233,0.1)!important}
`;
