# Story Memorabilia — Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL** and **anon key** and **service_role key** from Settings → API
3. Go to SQL Editor → paste the contents of `supabase/schema.sql` → Run
4. Go to Storage → Create these buckets:
   - `listing-images` (Public)
   - `athlete-avatars` (Public)
   - `coa-videos` (Public)
   - `shipping-labels` (Private)

## 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) → Create account
2. Enable **Stripe Connect** (Platform account)
   - Go to Connect → Settings → enable "Standard accounts"
3. Copy your **publishable key** and **secret key** from Dashboard → Developers → API Keys
4. For webhooks: Developers → Webhooks → Add endpoint
   - URL: `https://storymemorabilia.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy the **webhook secret**

## 3. Shippo Setup

1. Go to [goshippo.com](https://goshippo.com) → Create account
2. Settings → API → Copy your **API key**
3. Add your USPS carrier account in Shippo settings

## 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in all values:

```bash
cp .env.local.example .env.local
# Then edit .env.local with your real keys
```

## 5. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

When prompted, add all your env vars from `.env.local`.

Then:
1. Go to [porkbun.com](https://porkbun.com) → storymemorabilia.com → DNS
2. Add a CNAME record: `@` → `cname.vercel-dns.com`
3. In Vercel → Project → Settings → Domains → Add `storymemorabilia.com`

## 6. First Admin Steps

After deploying:
1. Sign up as an athlete at `/signup/athlete`  
2. Go to Supabase → Table Editor → `profiles` → set your `role` to `admin` and `verified` to `true`
3. You can then verify other athletes from the Supabase dashboard

## Routes Summary

| Route | Description |
|---|---|
| `/` | Homepage |
| `/browse` | All listings |
| `/signup/fan` | Fan registration |
| `/signup/athlete` | Athlete application (2-step) |
| `/login` | Sign in |
| `/athlete/[username]` | Athlete profile + feed |
| `/listing/[id]` | Item detail + buy |
| `/dashboard/athlete` | Athlete dashboard (listings + orders) |
| `/dashboard/athlete/new-listing` | Create listing |
| `/dashboard/fan` | Fan order history |
| `/checkout/success` | Post-purchase confirmation |
| `/verify/[coaId]` | Public COA verification page |
| `/api/stripe/checkout` | POST — creates Stripe session |
| `/api/stripe/webhook` | Stripe webhook handler |
| `/api/coa/generate` | POST — generates COA on sale |
| `/api/shippo/label` | POST — creates prepaid shipping label |
