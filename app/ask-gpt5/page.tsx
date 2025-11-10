// app/ask-gpt5/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AskGPT5Page() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // check current user session
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        // data.user is present when logged in
        if (!mounted) return;
        if (error || !data?.user) {
          // not logged in
          router.push("/sign-in");
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        router.push("/sign-in");
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setReply(null);
    try {
      const res = await fetch("/api/ask-gpt5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      // Try to show AI message text for chat completion responses
      const content = data?.choices?.[0]?.message?.content ?? data?.response ?? JSON.stringify(data);
      setReply(content);
    } catch (err: any) {
      setReply(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Checking login…</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Ask GPT-5</h1>

      <form onSubmit={handleAsk} className="w-full max-w-2xl flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question..."
          className="p-3 border rounded min-h-[120px]"
          required
        />
        <div className="flex gap-3">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {loading ? "Thinking…" : "Ask"}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => { setPrompt(""); setReply(null); }}
          >
            Clear
          </button>
        </div>
      </form>

      {loading && <p className="mt-4">Waiting for response…</p>}
      {reply && (
        <div className="mt-6 w-full max-w-2xl p-4 border rounded whitespace-pre-wrap">
          {reply}
        </div>
      )}
    </div>
  );
}
