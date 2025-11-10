// app/sign-up/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email });
      if (error) {
        alert(error.message);
      } else {
        alert("Check your email for the sign-up link. Then sign in.");
        router.push("/sign-in");
      }
    } catch (err: any) {
      alert(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <form onSubmit={handleSignUp} className="flex flex-col gap-3 w-full max-w-md">
        <h2 className="text-xl font-semibold">Sign up</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="p-2 border rounded"
        />
        <button type="submit" disabled={loading} className="p-2 bg-green-600 text-white rounded">
          {loading ? "Processing..." : "Sign up"}
        </button>
        <p className="text-sm text-gray-600">We will send an email to complete registration.</p>
      </form>
    </div>
  );
}
