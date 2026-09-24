"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FanSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { role: "fan", full_name: form.fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/browse");
  };

  return (
    <div className="min-h-screen bg-cobalt flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-white text-4xl block mb-12">
          STORY<span className="text-white/60">.</span>
        </Link>

        <h1 className="font-display text-white text-3xl mb-2">JOIN AS A FAN</h1>
        <p className="text-white/60 mb-8 text-sm">Own a piece of the story.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
              className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-white/60 text-xs uppercase tracking-wider block mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white transition-colors placeholder:text-white/30"
              placeholder="Min 8 characters"
            />
          </div>

          {error && <p className="text-white bg-white/10 p-3 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-cobalt font-semibold py-4 hover:bg-white/90 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? "Creating account…" : "Create Fan Account"}
          </button>
        </form>

        <p className="mt-6 text-white/50 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-white underline">Sign in</Link>
        </p>
        <p className="mt-3 text-white/50 text-sm">
          Are you an athlete?{" "}
          <Link href="/signup/athlete" className="text-white underline">Apply here</Link>
        </p>
      </div>
    </div>
  );
}
