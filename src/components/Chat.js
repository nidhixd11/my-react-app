import { useState } from "react";

export default function Chat({ onSend, loading }) {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg) return;
    onSend(msg);
    setText("");
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ flex: 1, padding: "6px 8px" }}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>Send</button>
    </form>
  );
}
