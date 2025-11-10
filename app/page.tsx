// app/page.tsx
"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to AruKab</h1>
      <p className="mb-6">Sign in to access Ask GPT-5 chat.</p>

      <div className="flex gap-3">
        <Link href="/sign-in" className="px-4 py-2 bg-blue-600 text-white rounded">
          Sign In
        </Link>
        <Link href="/sign-up" className="px-4 py-2 bg-green-600 text-white rounded">
          Sign Up
        </Link>
      </div>

      <p className="mt-6 text-sm text-gray-600 max-w-prose">
        After sign-in you'll be able to ask GPT-5 on the <code>/ask-gpt5</code> page.
      </p>
    </main>
  );
}
