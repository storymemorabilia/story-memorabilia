import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ListingCard from "@/components/listing/ListingCard";
import type { Listing } from "@/types";

const CATEGORIES = ["All", "Jerseys", "Shoes", "Signed Photos", "Equipment", "Cards", "Other"];
const SPORTS_FILTER = ["All Sports", "Football", "Basketball", "Soccer", "Baseball", "Tennis", "Swimming", "Track & Field", "Other"];
const CONDITIONS = ["All", "Match Worn", "Game Used", "Team Issued", "Signed", "New + Signed"];

interface SearchParams {
  category?: string;
  sport?: string;
  condition?: string;
  filter?: string;
  q?: string;
}

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("listings")
    .select("*, athlete:profiles!athlete_id(id, full_name, username, sport, verified)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(48);

  if (params.filter === "drops") {
    query = query.eq("limited_drop", true);
  }
  if (params.filter === "featured") {
    query = query.eq("featured", true);
  }
  if (params.q) {
    query = query.ilike("title", `%${params.q}%`);
  }

  const { data: listings } = await query;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen">
        {/* Header */}
        <div className="bg-[#080808] px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-white text-5xl md:text-7xl mb-4">
              {params.filter === "drops" ? "LIMITED DROPS" : params.filter === "featured" ? "FEATURED" : "BROWSE"}
            </h1>
            {/* Search */}
            <form method="get" className="flex gap-2 max-w-lg">
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search athletes, items…"
                className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-cobalt placeholder:text-white/30 text-sm"
              />
              <button type="submit" className="bg-cobalt text-white px-6 py-3 font-semibold text-sm hover:bg-cobalt-dark transition-colors">
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-ink/10 sticky top-16 bg-white z-40">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
            <div className="flex gap-1 py-3">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href={`/browse?category=${cat.toLowerCase().replace(/ /g, "-")}`}
                  className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 transition-colors ${
                    (params.category === cat.toLowerCase().replace(/ /g, "-") || (!params.category && cat === "All"))
                      ? "bg-cobalt text-white"
                      : "text-ink/50 hover:text-ink"
                  }`}
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {listings && listings.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(listings as Listing[]).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-display text-3xl text-ink/20 mb-4">NO ITEMS YET</p>
              <p className="text-ink/40 text-sm">Athletes are listing their gear now. Check back soon.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
