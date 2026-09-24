"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export default function Navbar() {
  const [user, setUser] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setUser(data);
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-white text-2xl tracking-tight hover:text-cobalt transition-colors">
          STORY
          <span className="text-cobalt">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/browse" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            Browse
          </Link>
          <Link href="/browse?filter=drops" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            Drops
          </Link>
          <Link href="/browse?filter=featured" className="text-white/70 hover:text-white text-sm font-medium transition-colors">
            Featured
          </Link>
        </div>

        {/* Auth actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {user.role === "athlete" && (
                <Link
                  href="/dashboard/athlete"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  My Listings
                </Link>
              )}
              {user.role === "fan" && (
                <Link
                  href="/dashboard/fan"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  My Orders
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                Sign out
              </button>
              <Link
                href={`/athlete/${user.username || user.id}`}
                className="w-9 h-9 rounded-full bg-cobalt flex items-center justify-center text-white text-sm font-bold"
              >
                {user.full_name?.[0]?.toUpperCase() || "?"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup/fan"
                className="bg-cobalt text-white text-sm font-semibold px-4 py-2 rounded hover:bg-cobalt-dark transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white mb-1" />
          <div className="w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#080808] border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link href="/browse" className="text-white/70 text-sm">Browse</Link>
          <Link href="/browse?filter=drops" className="text-white/70 text-sm">Drops</Link>
          {user ? (
            <>
              <Link href={user.role === "athlete" ? "/dashboard/athlete" : "/dashboard/fan"} className="text-white/70 text-sm">
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="text-left text-white/50 text-sm">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white/70 text-sm">Log in</Link>
              <Link href="/signup/fan" className="bg-cobalt text-white text-sm font-semibold px-4 py-2 rounded text-center">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
