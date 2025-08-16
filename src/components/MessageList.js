import { useEffect, useRef } from "react";

export default function MessageList({ items }) {
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [items]);

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "16px 0", display: "flex", flexDirection: "column", gap: 8, minHeight: 200 }}>
      {items.map((m) => (
        <li key={m.id} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
          <div style={{ padding: "8px 12px", borderRadius: 12, background: m.role === "user" ? "#DCFCE7" : "#E5E7EB", border: "1px solid #d1d5db", whiteSpace: "pre-wrap" }}>
            {m.text}
          </div>
        </li>
      ))}
      <div ref={endRef} />
    </ul>
  );
}
