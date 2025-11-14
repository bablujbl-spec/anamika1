"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (data?.session) {
          router.replace("/chat");
        } else {
          setChecking(false);
        }
      } catch (err) {
        console.error("Session check failed:", err);
        setChecking(false);
      }
    };
    check();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s?.session) router.replace("/chat");
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe?.();
    };
  }, [router]);

  if (checking) return <div style={{ padding: 24 }}>Checking session…</div>;

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h1>Welcome to Arukab Dashboard</h1>
      <p>It's your intelligent dashboard powered by Next.js & Supabase.</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => router.push("/sign-in")} style={{ padding: "8px 16px" }}>
          Sign in
        </button>
        <button onClick={() => router.push("/chat")} style={{ padding: "8px 16px", marginLeft: 12 }}>
          Open Chat
        </button>
      </div>
    </div>
  );
}
