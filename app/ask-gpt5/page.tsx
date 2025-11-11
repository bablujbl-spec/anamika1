"use client";

import { useState } from "react";

export default function AskGPT5Page() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setAnswer(null);

    try {
      const res = await fetch("/api/ask-gpt5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Failed to get response from API");

      const data: { answer: string } = await res.json();
      setAnswer(data.answer);
    } catch (_err: unknown) {
      setAnswer("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Ask GPT-5</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          className="w-full p-3 border rounded mb-4"
          rows={4}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded text-left">
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
