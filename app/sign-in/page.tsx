// app/sign-in/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // যদি এই import error দেখাও, বদলে relative path লিখো: ../../lib/supabaseClient

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"magic" | "password">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle magic-link callback (process session from URL fragment)
  useEffect(() => {
    const processUrl = async () => {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (error) {
          // not fatal — show console so you can debug
          console.warn("getSessionFromUrl:", error.message);
        }
        if (data?.session) {
          // session set -> go to chat
          router.replace("/chat");
        }
      } catch (err) {
        console.error("Error handling magic link:", err);
      }
    };

    // Only run on client
    processUrl();
  }, [router]);

  const sendMagicLink = async () => {
    setErrorMessage(null);
    if (!email) return setErrorMessage("Please enter an email address.");
    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/sign-in`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      setLoading(false);
      if (error) return setErrorMessage(error.message);
      alert("Magic link sent — check your email and open the link.");
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Failed to send magic link.");
    }
  };

  const signInWithPassword = async () => {
    setErrorMessage(null);
    if (!email || !password) return setErrorMessage("Email and password are required.");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      if (data?.session) {
        router.replace("/chat");
      } else {
        // sometimes sign-in returns no session (email confirmation required)
        setErrorMessage("Signed in but no active session. Maybe confirm your email or try magic link.");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err?.message || "Sign-in failed.");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720 }}>
      <h1>Sign in</h1>
      <p style={{ color: "#555" }}>Choose magic link (recommended) or password sign-in.</p>

      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 12 }}>
          <input type="radio" checked={mode === "magic"} onChange={() => setMode("magic")} /> Magic link
        </label>
        <label>
          <input type="radio" checked={mode === "password"} onChange={() => setMode("password")} /> Password
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          type="email"
          style={{ padding: 8, width: "100%", boxSizing: "border-box" }}
        />
      </div>

      {mode === "password" && (
        <div style={{ marginBottom: 8 }}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            style={{ padding: 8, width: "100%", boxSizing: "border-box" }}
          />
        </div>
      )}

      {errorMessage && <div style={{ color: "crimson", marginBottom: 8 }}>{errorMessage}</div>}

      <div style={{ display: "flex", gap: 8 }}>
        {mode === "magic" ? (
          <button onClick={sendMagicLink} disabled={loading}>
            {loading ? "Sending..." : "Send magic link"}
          </button>
        ) : (
          <button onClick={signInWithPassword} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        )}

        <button
          onClick={() => {
            // quick navigation helper
            router.push("/chat");
          }}
        >
          Open Chat (if already signed in)
        </button>
      </div>

      <hr style={{ margin: "18px 0" }} />

      <div style={{ fontSize: 13, color: "#555" }}>
        <p>Checklist if things don't work:</p>
        <ol>
          <li>Supabase Dashboard → Authentication → Users → check user exists.</li>
          <li>Supabase Dashboard → Auth → Settings → Site URL and Redirect URLs include <code>{window?.location?.origin}</code> and <code>{window?.location?.origin}/sign-in</code>.</li>
          <li>Vercel env vars: <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set.</li>
        </ol>
      </div>
    </div>
  );
}
