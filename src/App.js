import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [debug, setDebug] = useState(""); // <-- will show backend error text

  async function sendMessage() {
    if (!message.trim()) return;

    try {
      // Use a relative path; your Next/CRA proxy/rewrite should forward to the backend
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      // Backend always returns JSON (200) with { reply, error? }
      const data = await res.json();

      // Show the real error text if the backend sent one
      setDebug(data.error || "");

      // Show the reply (AI text or Echo fallback)
      setReply(data.reply || "");

    } catch (err) {
      setDebug("");
      setReply(`Error: ${err.message}`);
    }
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", color: "#fff", background: "#111", minHeight: "100vh" }}>
      <h2>Chat with Backend</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={{ padding: "8px", width: "320px" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 14px" }}>
          Send
        </button>
      </div>

      {reply && (
        <p style={{ marginTop: "0.5rem" }}>
          <strong>Reply:</strong> {reply}
        </p>
      )}

      {debug && (
        <p style={{ marginTop: "0.25rem", color: "#ff9b9b" }}>
          <strong>(debug)</strong> {debug}
        </p>
      )}
    </div>
  );
}
