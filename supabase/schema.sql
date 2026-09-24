-- Story Memorabilia — Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  role text not null check (role in ('athlete', 'fan', 'admin')) default 'fan',
  full_name text,
  username text unique,
  avatar_url text,
  bio text,
  sport text,
  team text,
  country text,
  instagram_handle text,
  tiktok_handle text,
  stripe_account_id text,
  stripe_onboarding_complete boolean default false,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'role', 'fan'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── LISTINGS ───────────────────────────────────────────────────────────────
create table public.listings (
  id uuid default uuid_generate_v4() primary key,
  athlete_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price integer not null check (price > 0), -- cents
  condition text not null check (condition in ('match_worn','game_used','team_issued','signed','new_signed','new_with_tags')),
  category text not null,
  sport text,
  images text[] default '{}',
  status text not null default 'draft' check (status in ('draft','active','sold','archived')),
  featured boolean default false,
  limited_drop boolean default false,
  drop_at timestamptz,
  created_at timestamptz default now()
);

-- ─── ORDERS ─────────────────────────────────────────────────────────────────
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) not null,
  buyer_id uuid references public.profiles(id) not null,
  athlete_id uuid references public.profiles(id) not null,
  status text not null default 'pending' check (status in ('pending','paid','shipped','delivered','disputed','refunded')),
  price_cents integer not null,
  platform_fee_cents integer not null,
  athlete_payout_cents integer not null,
  stripe_payment_intent_id text unique,
  stripe_transfer_id text,
  shippo_transaction_id text,
  tracking_number text,
  tracking_url text,
  shipping_label_url text,
  coa_id text,
  -- Buyer shipping address (snapshot at time of order)
  shipping_name text,
  shipping_line1 text,
  shipping_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_zip text,
  shipping_country text default 'US',
  created_at timestamptz default now()
);

-- ─── CERTIFICATES OF AUTHENTICITY ───────────────────────────────────────────
create table public.coas (
  id text primary key, -- STR-YYYY-NNNNN-XX
  order_id uuid references public.orders(id) unique not null,
  listing_id uuid references public.listings(id) not null,
  athlete_id uuid references public.profiles(id) not null,
  athlete_video_url text,
  issued_at timestamptz default now(),
  verified boolean default true
);

-- ─── ATHLETE UPDATES (feed posts) ───────────────────────────────────────────
create table public.athlete_updates (
  id uuid default uuid_generate_v4() primary key,
  athlete_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

-- ─── PROMO CODES ────────────────────────────────────────────────────────────
create table public.promo_codes (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  type text not null check (type in ('percent', 'fixed')),
  value integer not null, -- percent 0-100 or cents
  max_uses integer,
  uses integer default 0,
  expires_at timestamptz,
  active boolean default true,
  athlete_id uuid references public.profiles(id), -- null = platform-wide
  created_at timestamptz default now()
);

-- ─── FEATURED ITEMS (homepage admin) ────────────────────────────────────────
create table public.featured_slots (
  id uuid default uuid_generate_v4() primary key,
  listing_id uuid references public.listings(id) on delete cascade,
  athlete_id uuid references public.profiles(id) on delete cascade,
  slot_type text not null check (slot_type in ('hero', 'drop', 'athlete_spotlight', 'editorial')),
  position integer default 0,
  active boolean default true,
  starts_at timestamptz default now(),
  ends_at timestamptz
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.orders enable row level security;
alter table public.coas enable row level security;
alter table public.athlete_updates enable row level security;
alter table public.promo_codes enable row level security;

-- Profiles: public read, own write
create policy "profiles_public_read" on public.profiles for select using (true);
create policy "profiles_own_update" on public.profiles for update using (auth.uid() = id);

-- Listings: public read active, athlete manages own
create policy "listings_public_read" on public.listings for select using (status = 'active' or athlete_id = auth.uid());
create policy "listings_athlete_insert" on public.listings for insert with check (athlete_id = auth.uid());
create policy "listings_athlete_update" on public.listings for update using (athlete_id = auth.uid());

-- Orders: buyer or athlete can see their orders
create policy "orders_own_read" on public.orders for select using (buyer_id = auth.uid() or athlete_id = auth.uid());

-- COAs: public read (for verification)
create policy "coas_public_read" on public.coas for select using (true);

-- Athlete updates: public read, athlete insert own
create policy "updates_public_read" on public.athlete_updates for select using (true);
create policy "updates_athlete_insert" on public.athlete_updates for insert with check (athlete_id = auth.uid());

-- Storage buckets (run separately in Storage settings)
-- listing-images: public
-- athlete-avatars: public
-- coa-videos: public
-- shipping-labels: private (authenticated only)
