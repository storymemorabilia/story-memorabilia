import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";

const CONDITION_LABELS: Record<string, string> = {
  match_worn: "Match Worn",
  game_used: "Game Used",
  team_issued: "Team Issued",
  signed: "Signed",
  new_signed: "New + Signed",
  new_with_tags: "New w/ Tags",
};

export default async function AthleteDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || profile.role !== "athlete") redirect("/browse");

  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .eq("athlete_id", user.id)
    .order("created_at", { ascending: false });

  const { data: orders } = await supabase
    .from("orders")
    .select("*, listing:listings(title, images)")
    .eq("athlete_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const totalSales = orders
    ?.filter((o) => ["paid", "shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.athlete_payout_cents, 0) || 0;

  const pendingShipments = orders?.filter((o) => o.status === "paid").length || 0;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#f5f5f5]">
        {/* Header */}
        <div className="bg-[#080808] px-4 py-12">
          <div className="max-w-7xl mx-auto flex items-end justify-between">
            <div>
              <p className="font-display text-sm tracking-widest mb-2" style={{color:"#0047CC"}}>ATHLETE DASHBOARD</p>
              <h1 className="font-display text-white text-4xl">{profile.full_name?.toUpperCase()}</h1>
              {!profile.verified && (
                <p className="text-signal text-sm mt-2">⚠ Pending Story verification — listings won&apos;t appear until verified</p>
              )}
              {!profile.stripe_onboarding_complete && profile.verified && (
                <Link href="/api/stripe/connect" className="text-sm mt-2 inline-block hover:underline" style={{color:"#0047CC"}}>
                  → Set up Stripe to receive payments
                </Link>
              )}
            </div>
            <div className="flex gap-8 text-right">
              <div>
                <div className="font-display text-3xl" style={{color:"#0047CC"}}>${(totalSales / 100).toFixed(0)}</div>
                <div className="text-white/40 text-xs">Total Earned</div>
              </div>
              <div>
                <div className="font-display text-3xl" style={{color:"#0047CC"}}>{pendingShipments}</div>
                <div className="text-white/40 text-xs">To Ship</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Listings */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl">MY LISTINGS</h2>
                <Link href="/dashboard/athlete/new-listing" className="text-white font-semibold px-4 py-2 text-sm transition-colors" style={{backgroundColor:"#0047CC"}}>
                  + New Listing
                </Link>
              </div>

              {listings && listings.length > 0 ? (
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <div key={listing.id} className="bg-white border border-ink/10 p-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#f0f0f0] flex-shrink-0">
                        {listing.images?.[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink text-sm truncate">{listing.title}</p>
                        <p className="text-ink/40 text-xs">{CONDITION_LABELS[listing.condition]}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-display text-xl" style={{color:"#0047CC"}}>${(listing.price / 100).toFixed(0)}</div>
                        <div className={`text-xs font-semibold ${
                          listing.status === "active" ? "text-green-600" :
                          listing.status === "sold" ? "text-ink/40" :
                          "text-ink/40"
                        }`}>
                          {listing.status.toUpperCase()}
                        </div>
                      </div>
                      <Link href={`/dashboard/athlete/listing/${listing.id}`} className="text-xs hover:underline ml-2" style={{color:"#0047CC"}}>
                        Edit
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-ink/10 p-12 text-center">
                  <p className="text-ink/30 font-display text-2xl mb-4">NO LISTINGS YET</p>
                  <Link href="/dashboard/athlete/new-listing" className="text-white font-semibold px-6 py-3 inline-block transition-colors" style={{backgroundColor:"#0047CC"}}>
                    Create Your First Listing
                  </Link>
                </div>
              )}
            </div>

            {/* Orders to ship */}
            <div>
              <h2 className="font-display text-2xl mb-6">ORDERS TO SHIP</h2>
              {orders?.filter((o) => o.status === "paid").length ? (
                <div className="space-y-3">
                  {orders.filter((o) => o.status === "paid").map((order) => (
                    <div key={order.id} className="bg-white border border-signal/30 p-4">
                      <p className="font-semibold text-sm text-ink mb-1">{order.listing?.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-signal text-xs font-semibold">NEEDS LABEL</span>
                        <span className="font-display" style={{color:"#0047CC"}}>${(order.athlete_payout_cents / 100).toFixed(0)}</span>
                      </div>
                      {order.shipping_label_url && (
                        <a
                          href={order.shipping_label_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block w-full text-white text-xs font-semibold py-2 text-center transition-colors" style={{backgroundColor:"#0047CC"}}
                        >
                          Download Prepaid Label
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-ink/10 p-8 text-center">
                  <p className="text-ink/30 text-sm">No pending shipments.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
