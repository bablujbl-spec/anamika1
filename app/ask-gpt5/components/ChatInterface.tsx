import { useState } from "react";

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ text: string; from: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, from: "user" } as const;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // GPT API call
    try {
      const res = await fetch("/api/ask-gpt5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.reply, from: "bot" }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Error sending message.", from: "bot" }]);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ minHeight: 200, border: "1px solid #ccc", padding: 8, borderRadius: 6 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.from === "user" ? "right" : "left", margin: 4 }}>
            <span
              style={{
                padding: 6,
                borderRadius: 6,
                background: m.from === "user" ? "#2563eb" : "#eee",
                color: m.from === "user" ? "#fff" : "#000",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
