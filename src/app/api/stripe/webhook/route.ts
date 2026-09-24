import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = event.data.object as any;
      const meta = session.metadata!;

      // Create order record
      const { data: order } = await supabase
        .from("orders")
        .insert({
          listing_id: meta.listing_id,
          buyer_id: meta.buyer_id,
          athlete_id: meta.athlete_id,
          status: "paid",
          price_cents: Number(meta.price_cents),
          platform_fee_cents: Number(meta.platform_fee_cents),
          athlete_payout_cents: Number(meta.athlete_payout_cents),
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .select()
        .single();

      // Mark listing as sold
      await supabase
        .from("listings")
        .update({ status: "sold" })
        .eq("id", meta.listing_id);

      // Generate COA
      if (order) {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/coa/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });

        // Trigger Shippo label generation
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/shippo/label`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });
      }

      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("stripe_payment_intent_id", intent.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
