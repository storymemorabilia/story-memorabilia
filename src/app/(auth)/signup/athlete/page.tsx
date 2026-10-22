"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const SPORTS = [
  "Football", "Basketball", "Soccer", "Baseball", "Tennis", "Swimming",
  "Track & Field", "Wrestling", "Volleyball", "Cycling", "Gymnastics",
  "Boxing", "Lacrosse", "Hockey", "Rugby", "Golf", "Skiing", "Surfing",
  "MMA / Combat Sports", "Other",
];

export default function AthleteSignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", email: "", password: "",
    sport: "", team: "", country: "US",
    instagram: "", bio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // Create auth user with athlete role
    const { data, error: signupError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { role: "athlete", full_name: form.fullName },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Update profile with athlete details
      await supabase.from("profiles").update({
        full_name: form.fullName,
        sport: form.sport,
        team: form.team,
        country: form.country,
        instagram_handle: form.instagram,
        bio: form.bio,
        verified: false, // admin must verify
      }).eq("id", data.user.id);
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="font-display text-white text-4xl mb-8">STORY<span style={{color:"#0047CC"}}>.</span></div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor:"#0047CC"}}>
            <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
              <path d="M2 11L10 19L26 2" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="font-display text-white text-3xl mb-4">APPLICATION RECEIVED</h2>
          <p className="text-white/60 leading-relaxed mb-8">
            We review every athlete personally. You&apos;ll hear from us within 48 hours once your profile is verified and you&apos;re cleared to list.
          </p>
          <Link href="/" className="text-white font-semibold px-8 py-3 inline-block transition-colors" style={{backgroundColor:"#0047CC"}}>
            Back to Story
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        <Link href="/" className="font-display text-white text-4xl block mb-12">
          STORY<span style={{color:"#0047CC"}}>.</span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={step >= 1 ? {backgroundColor:"#0047CC",color:"white"} : {backgroundColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"}}>1</div>
          <div className="flex-1 h-px" style={{backgroundColor: step >= 2 ? "#0047CC" : "rgba(255,255,255,0.1)"}} />
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={step >= 2 ? {backgroundColor:"#0047CC",color:"white"} : {backgroundColor:"rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"}}>2</div>
        </div>

        <h1 className="font-display text-white text-3xl mb-2">
          {step === 1 ? "YOUR ACCOUNT" : "YOUR STORY"}
        </h1>
        <p className="text-white/50 mb-8 text-sm">
          {step === 1 ? "Create your login credentials." : "Tell fans who you are."}
        </p>

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={8}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full text-white font-semibold py-4 transition-colors mt-4" style={{backgroundColor:"#0047CC"}}>
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Sport</label>
                <select
                  value={form.sport}
                  onChange={(e) => setForm({ ...form, sport: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none"
                >
                  <option value="">Select your sport</option>
                  {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Team / Club (optional)</label>
                <input
                  type="text"
                  value={form.team}
                  onChange={(e) => setForm({ ...form, team: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none"
                  placeholder="e.g. Portland Trail Blazers, Team USA"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Instagram Handle (optional)</label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none"
                  placeholder="@yourusername"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">Your Story (optional)</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none resize-none"
                  placeholder="Tell fans who you are and what you compete in…"
                />
              </div>

              {error && <p className="text-signal text-sm">{error}</p>}

              <div className="flex gap-3 mt-4">
                <button type="button" onClick={() => setStep(1)} className="px-6 py-4 border border-white/20 text-white/60 hover:text-white transition-colors">
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 text-white font-semibold py-4 transition-colors disabled:opacity-50" style={{backgroundColor:"#0047CC"}}
                >
                  {loading ? "Submitting…" : "Apply to Story"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-white/40 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="hover:underline" style={{color:"#0047CC"}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
