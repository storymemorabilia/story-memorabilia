import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const supabase = await createClient();

  // Find order by Stripe session (via payment intent lookup)
  let order = null;
  if (session_id) {
    const { data } = await supabase
      .from("orders")
      .select("*, coa:coas(*), listing:listings(title)")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    order = data;
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="font-display text-white text-4xl inline-block mb-12">
          STORY<span className="text-cobalt">.</span>
        </Link>

        <div className="w-20 h-20 rounded-full bg-cobalt flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
            <path d="M2 14L13 25L34 2" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 className="font-display text-white text-4xl mb-4">ORDER CONFIRMED</h1>

        {order?.listing && (
          <p className="text-white/60 mb-2">{order.listing.title}</p>
        )}

        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Your payment is held securely. Once the athlete ships your item and it&apos;s delivered, the funds are released to them.
          Your Certificate of Authenticity is being prepared.
        </p>

        {order?.coa_id && (
          <div className="border border-cobalt/30 bg-cobalt/10 p-4 mb-8">
            <p className="text-cobalt text-xs font-semibold mb-1">YOUR CERTIFICATE OF AUTHENTICITY</p>
            <p className="text-white font-mono text-sm">{order.coa_id}</p>
            <Link
              href={`/verify/${order.coa_id}`}
              className="text-cobalt text-xs hover:underline mt-2 inline-block"
            >
              View certificate →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard/fan"
            className="block w-full bg-cobalt text-white font-semibold py-4 hover:bg-cobalt-dark transition-colors"
          >
            Track Your Order
          </Link>
          <Link
            href="/browse"
            className="block w-full border border-white/20 text-white font-semibold py-4 hover:border-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
