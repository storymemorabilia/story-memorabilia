"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Get role and redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "athlete") {
      router.push("/dashboard/athlete");
    } else {
      router.push("/browse");
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-white text-4xl block mb-12 transition-colors">
          STORY<span style={{color:"#0047CC"}}>.</span>
        </Link>

        <h1 className="font-display text-white text-3xl mb-8">SIGN IN</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-signal text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-4 transition-colors disabled:opacity-50 mt-4"
            style={{backgroundColor:"#0047CC"}}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 flex justify-between text-sm">
          <span className="text-white/40">No account?</span>
          <div className="flex gap-4">
            <Link href="/signup/fan" className="hover:underline" style={{color:"#0047CC"}}>Join as Fan</Link>
            <Link href="/signup/athlete" className="hover:underline" style={{color:"#0047CC"}}>Join as Athlete</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
