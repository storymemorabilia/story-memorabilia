import { NextRequest, NextResponse } from "next/server";
import { getStripe, calculateFees } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId, price, title } = await req.json();

  // Fetch listing + athlete Stripe account
  const { data: listing } = await supabase
    .from("listings")
    .select("*, athlete:profiles!athlete_id(id, stripe_account_id, stripe_onboarding_complete)")
    .eq("id", listingId)
    .eq("status", "active")
    .single();

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const { platformFee, athletePayout } = calculateFees(price);

  // Create Stripe Checkout Session
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
            description: "Story Memorabilia — Authenticated item with Certificate of Authenticity",
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: listing.athlete?.stripe_account_id && listing.athlete?.stripe_onboarding_complete
      ? {
          application_fee_amount: platformFee,
          transfer_data: {
            destination: listing.athlete.stripe_account_id,
          },
        }
      : undefined,
    metadata: {
      listing_id: listingId,
      buyer_id: user.id,
      athlete_id: listing.athlete_id,
      price_cents: price.toString(),
      platform_fee_cents: platformFee.toString(),
      athlete_payout_cents: athletePayout.toString(),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/listing/${listingId}`,
  });

  return NextResponse.json({ url: session.url });
}
