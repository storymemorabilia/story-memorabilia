import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BuyButton from "./BuyButton";

const CONDITION_LABELS: Record<string, string> = {
  match_worn: "Match Worn",
  game_used: "Game Used",
  team_issued: "Team Issued",
  signed: "Signed",
  new_signed: "New + Signed",
  new_with_tags: "New w/ Tags",
};

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*, athlete:profiles!athlete_id(*)")
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (!listing) notFound();

  const price = (listing.price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  const athletePayout = ((listing.price * 0.85) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-[#f0f0f0] relative">
                {listing.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink/20 font-display text-2xl">
                    NO IMAGE
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-cobalt text-white text-xs font-semibold px-3 py-1.5">
                    {CONDITION_LABELS[listing.condition] || listing.condition}
                  </span>
                </div>
              </div>
              {listing.images?.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {listing.images.slice(1, 5).map((img: string, i: number) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt="" className="aspect-square object-cover bg-[#f0f0f0]" />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Athlete */}
              {listing.athlete && (
                <Link
                  href={`/athlete/${listing.athlete.username || listing.athlete.id}`}
                  className="flex items-center gap-3 mb-6 group"
                >
                  <div className="w-10 h-10 rounded-full bg-cobalt flex items-center justify-center text-white font-bold text-sm">
                    {listing.athlete.full_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-ink group-hover:text-cobalt transition-colors">
                      {listing.athlete.full_name}
                    </p>
                    <p className="text-ink/40 text-xs">
                      {listing.athlete.sport}
                      {listing.athlete.verified && " · ✓ Story Verified"}
                    </p>
                  </div>
                </Link>
              )}

              <h1 className="font-display text-3xl md:text-4xl text-ink mb-4 leading-tight">{listing.title}</h1>

              {listing.description && (
                <p className="text-ink/60 leading-relaxed mb-6">{listing.description}</p>
              )}

              <div className="border-t border-b border-ink/10 py-6 mb-6">
                <div className="font-display text-4xl text-cobalt mb-1">{price}</div>
                <p className="text-ink/40 text-xs">{athletePayout} goes directly to the athlete</p>
              </div>

              <BuyButton listingId={listing.id} price={listing.price} title={listing.title} />

              {/* Trust signals */}
              <div className="mt-8 space-y-3">
                {[
                  { icon: "🔒", text: "Payment held in escrow until delivery" },
                  { icon: "📜", text: "Certificate of Authenticity included" },
                  { icon: "📦", text: "Prepaid shipping label sent to athlete" },
                  { icon: "✓", text: "Story Vetted Athlete" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-ink/60">
                    <span className="text-base">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
