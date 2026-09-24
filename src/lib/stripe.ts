import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
      apiVersion: "2026-08-26.dahlia" as const,
    });
  }
  return _stripe;
}

// Convenience export — use getStripe() in API routes
export const stripe = {
  get checkout() { return getStripe().checkout; },
  get paymentIntents() { return getStripe().paymentIntents; },
  get webhooks() { return getStripe().webhooks; },
  get accounts() { return getStripe().accounts; },
};

export const PLATFORM_FEE_PERCENT = Number(process.env.NEXT_PUBLIC_PLATFORM_FEE_PERCENT) || 15;

export function calculateFees(priceInCents: number) {
  const platformFee = Math.round(priceInCents * (PLATFORM_FEE_PERCENT / 100));
  const stripeProcessingFee = Math.round(priceInCents * 0.029 + 30); // 2.9% + 30¢
  const athletePayout = priceInCents - platformFee - stripeProcessingFee;
  return { platformFee, stripeProcessingFee, athletePayout };
}
