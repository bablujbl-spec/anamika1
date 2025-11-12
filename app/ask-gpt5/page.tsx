"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Prevent prerendering (if you previously had prerender errors)
export const dynamic = "force-dynamic";

export default function AskGPTPage() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          // not logged in → redirect to sign-in
          router.replace("/sign-in");
          return;
        }

        if (mounted) setAuthChecked(true);
      } catch (err: unknown) {
        // safe error handling (no `any`)
        const message = err instanceof Error ? err.message : String(err);
        console.error("Auth check error:", message);
        router.replace("/sign-in");
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!authChecked) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Checking authentication...
      </div>
    );
  }

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);

    try {
      // Demo response — এখানে আপনার GPT API কল করবেন
      await new Promise((r) => setTimeout(r, 800));
      setAnswer("🤖 Demo answer: " + question.split("").reverse().join(""));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setAnswer("Error: " + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: 20 }}>
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

      <div>
        <button
          onClick={handleAsk}
          disabled={loading}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          {loading ? "Thinking..." : "Ask GPT"}
        </button>
      </div>

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
