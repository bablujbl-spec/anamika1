// app/chat/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; // যদি এই পাথ কাজ না করে, পরিবর্তন করে relative path ব্যবহার করো
import ChatInterface from "@/components/ChatInterface"; // যদি alias না থাকে, উদাহরণ: ../../components/ChatInterface

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        if (!data?.session) {
          // no session -> redirect to sign-in
          router.replace("/sign-in");
          return;
        }
        setSession(data.session);
        setLoading(false);
      } catch (err) {
        console.error("Session check failed:", err);
        if (mounted) {
          router.replace("/sign-in");
        }
      }
    };

    checkSession();

    // listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s?.session ?? null);
      if (!s?.session) {
        router.replace("/sign-in");
      }
    });

    return () => {
      mounted = false;
      // unsubscribe listener safely
      try {
        listener?.subscription.unsubscribe?.();
      } catch (e) {
        // older supabase client shape fallback
        try {
          (listener as any)?.unsubscribe?.();
        } catch {}
      }
    };
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Loading chat…</h2>
        <p style={{ color: "#666" }}>Checking your session — please wait.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Arukab — আপনার সহানুভূতিশীল কথাবার্তা</h1>
      <div style={{ marginTop: 12 }}>
        <ChatInterface session={session} />
      </div>
    </div>
  );
}
