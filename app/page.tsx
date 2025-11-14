"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();

      // যদি লগইন থাকে → chat page এ পাঠায়
      if (data?.user) {
        router.push("/chat");
      } else {
        // না থাকলে → sign-in page এ পাঠায়
        router.push("/sign-in");
      }
    }

    checkUser();
  }, []);

  return (
    <div className="p-8 text-center">
      <h1>Loading...</h1>
    </div>
  );
}
