"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// optional — build error আটকাতে prerender বন্ধ করুন
export const dynamic = "force-dynamic";

export default function AskGPTPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // ✅ Step 1: Session check
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        // not logged in → redirect to sign-in
        router.replace("/sign-in");
      } else {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [router]);

  if (!authChecked) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Checking authentication...
      </div>
    );
  }

  // ✅ Step 2: Question handler (mock chat behavior)
  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      // এখানে আপনি নিজের backend বা GPT API কল করবেন
      // এখন demo হিসেবে static উত্তর দিচ্ছি
      await new Promise((r) => setTimeout(r, 1000));
      setAnswer("🤖 GPT says: " + question.split("").reverse().join(""));
    } catch (err: any) {
      setAnswer("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Step 3: UI
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: 20 }}>
      <h2>Ask GPT</h2>
      <textarea
        placeholder="Type your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: 10,
          fontSize: "16px",
          marginBottom: 10,
        }}
      />

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Thinking..." : "Ask GPT"}
      </button>

      {answer && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: 10,
            background: "#fafafa",
          }}
        >
          <b>Answer:</b>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
