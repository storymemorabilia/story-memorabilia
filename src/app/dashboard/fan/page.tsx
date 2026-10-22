import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";

const STATUS_LABELS: Record<string, { label: string; color: string; style?: React.CSSProperties }> = {
  pending: { label: "Pending", color: "text-ink/40" },
  paid: { label: "Awaiting Shipment", color: "text-signal" },
  shipped: { label: "In Transit", color: "", style: {color:"#0047CC"} },
  delivered: { label: "Delivered", color: "text-green-600" },
  disputed: { label: "Disputed", color: "text-signal" },
  refunded: { label: "Refunded", color: "text-ink/40" },
};

export default async function FanDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || profile.role === "athlete") redirect("/dashboard/athlete");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, listing:listings(title, images, price), athlete:profiles!athlete_id(full_name, username), coa:coas(*)")
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-[#f5f5f5]">
        <div className="bg-[#080808] px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <p className="font-display text-sm tracking-widest mb-2" style={{color:"#0047CC"}}>MY COLLECTION</p>
            <h1 className="font-display text-white text-4xl">{profile.full_name?.toUpperCase() || "MY ORDERS"}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = STATUS_LABELS[order.status] || { label: order.status, color: "text-ink/40" };
                return (
                  <div key={order.id} className="bg-white border border-ink/10 p-6 flex gap-6">
                    {/* Image */}
                    <div className="w-20 h-20 bg-[#f0f0f0] flex-shrink-0">
                      {order.listing?.images?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={order.listing.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-semibold text-ink truncate">{order.listing?.title}</h3>
                        <span className={`text-xs font-semibold whitespace-nowrap ${status.color}`} style={status.style}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-ink/40 text-xs mb-3">
                        From{" "}
                        <Link href={`/athlete/${order.athlete?.username || ""}`} className="hover:underline transition-colors">
                          {order.athlete?.full_name}
                        </Link>
                        {" · "}
                        {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>

                      <div className="flex items-center gap-4">
                        <span className="font-display text-xl" style={{color:"#0047CC"}}>
                          ${(order.price_cents / 100).toFixed(0)}
                        </span>

                        {order.tracking_url && (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs hover:underline" style={{color:"#0047CC"}}
                          >
                            Track package →
                          </a>
                        )}

                        {order.coa_id && (
                          <Link href={`/verify/${order.coa_id}`} className="text-xs text-ink/40 hover:underline transition-colors">
                            View COA ({order.coa_id})
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="font-display text-3xl text-ink/20 mb-6">NO ORDERS YET</p>
              <Link href="/browse" className="text-white font-semibold px-8 py-4 inline-block transition-colors" style={{backgroundColor:"#0047CC"}}>
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
