export type UserRole = "athlete" | "fan" | "admin";

export type ItemCondition = "match_worn" | "game_used" | "team_issued" | "signed" | "new_signed" | "new_with_tags";

export type ListingStatus = "draft" | "active" | "sold" | "archived";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "disputed" | "refunded";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  sport?: string;
  team?: string;
  country?: string;
  instagram_handle?: string;
  tiktok_handle?: string;
  stripe_account_id?: string; // Stripe Connect account for athletes
  stripe_onboarding_complete?: boolean;
  verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  athlete_id: string;
  title: string;
  description: string;
  price: number; // in cents
  condition: ItemCondition;
  category: string;
  sport?: string;
  images: string[]; // URLs
  status: ListingStatus;
  featured: boolean;
  limited_drop: boolean;
  drop_at?: string; // ISO timestamp for timed drops
  created_at: string;
  athlete?: Profile;
}

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  athlete_id: string;
  status: OrderStatus;
  price_cents: number;
  platform_fee_cents: number;
  athlete_payout_cents: number;
  stripe_payment_intent_id: string;
  stripe_transfer_id?: string;
  shippo_transaction_id?: string;
  tracking_number?: string;
  tracking_url?: string;
  shipping_label_url?: string;
  coa_id?: string;
  created_at: string;
  listing?: Listing;
  buyer?: Profile;
  athlete?: Profile;
}

export interface COA {
  id: string; // format: STR-YYYY-NNNNN-XX
  order_id: string;
  listing_id: string;
  athlete_id: string;
  athlete_video_url?: string;
  issued_at: string;
  verified: boolean;
}
