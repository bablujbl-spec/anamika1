"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          router.push("/chat"); // লগইন থাকলে
        } else {
          router.push("/sign-in"); // না থাকলে
        }
      } catch (err: unknown) {
        console.error(err);
        router.push("/sign-in");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <h1>Loading...</h1>
      <p>Please wait while we check your session.</p>
    </div>
  );
}
