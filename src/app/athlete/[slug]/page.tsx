import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingCard from "@/components/listing/ListingCard";
import type { Listing } from "@/types";

export default async function AthleteProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Try username first, then ID
  const { data: athlete } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.eq.${slug},id.eq.${slug}`)
    .eq("role", "athlete")
    .single();

  if (!athlete) notFound();

  // Get active listings
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("athlete_id", athlete.id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Get recent updates
  const { data: updates } = await supabase
    .from("athlete_updates")
    .select("*")
    .eq("athlete_id", athlete.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Profile header */}
        <div className="bg-[#080808] py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
              {/* Avatar */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-cobalt flex items-center justify-center text-white font-bold text-5xl flex-shrink-0">
                {athlete.full_name?.[0]?.toUpperCase() || "?"}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="font-display text-white text-4xl md:text-6xl">{athlete.full_name?.toUpperCase()}</h1>
                  {athlete.verified && (
                    <span className="bg-cobalt text-white text-xs font-semibold px-2 py-1 self-center">VERIFIED</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-white/50 text-sm mb-4">
                  {athlete.sport && <span>{athlete.sport}</span>}
                  {athlete.team && <span>· {athlete.team}</span>}
                  {athlete.country && <span>· {athlete.country}</span>}
                </div>
                {athlete.bio && (
                  <p className="text-white/60 max-w-xl leading-relaxed">{athlete.bio}</p>
                )}
                {athlete.instagram_handle && (
                  <a
                    href={`https://instagram.com/${athlete.instagram_handle.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mt-4 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    {athlete.instagram_handle}
                  </a>
                )}
              </div>

              <div className="text-right">
                <div className="font-display text-cobalt text-5xl">{listings?.length || 0}</div>
                <div className="text-white/40 text-sm">active listings</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Listings */}
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl text-ink mb-6">AVAILABLE NOW</h2>
              {listings && listings.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {(listings as Listing[]).map((listing) => (
                    <ListingCard key={listing.id} listing={{ ...listing, athlete }} />
                  ))}
                </div>
              ) : (
                <div className="border border-ink/10 p-12 text-center">
                  <p className="text-ink/30 text-sm">No listings yet.</p>
                </div>
              )}
            </div>

            {/* Updates feed */}
            <div>
              <h2 className="font-display text-2xl text-ink mb-6">UPDATES</h2>
              {updates && updates.length > 0 ? (
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.id} className="border border-ink/10 p-4">
                      {update.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={update.image_url} alt="" className="w-full aspect-video object-cover mb-3" />
                      )}
                      <p className="text-ink/70 text-sm leading-relaxed">{update.content}</p>
                      <p className="text-ink/30 text-xs mt-2">
                        {new Date(update.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-ink/10 p-8 text-center">
                  <p className="text-ink/30 text-sm">No updates yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
