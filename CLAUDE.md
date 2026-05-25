# CLAUDE.md — ORDI Project Reference

> This file is the source of truth for the ORDI e-commerce project.
> Claude Code should read this first before making any changes.
> For phase-by-phase progress, see `Project-dev.md`.

---

## 1. Project Overview

**ORDI** (Out of Ordinary Only Ous) is a niche perfume e-commerce website for a small Bangkok-based perfume studio.

### Business Context
- **Primary audience:** International customers (English) + Thai customers (secondary)
- **Order volume expectation:** Low-to-medium — most orders flow through TikTok Shop / Shopee
- **Web role:** Brand portfolio + premium order channel for direct customers
- **Tone:** Editorial, gallery-like, monochrome, quiet confidence

### Product Range
- 5 fragrances (N°01–N°05), each in 50ml and 12ml sizes
- All Eau de Parfum (18% concentration)
- Hand-bottled in small batches of 300
- Price range: 690 THB (12ml) — 2,190 THB (50ml)

---

## 2. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG for SEO, file routing, API routes |
| Language | TypeScript | Type safety for products, orders, schemas |
| Styling | Plain CSS (existing tokens) | Already designed, no Tailwind needed |
| Database | Supabase PostgreSQL | Free tier, RLS, integrated auth |
| Auth | Supabase Auth | Email/Password + Google + LINE OAuth |
| Payment | Stripe Checkout (hosted) | International cards, no PCI burden |
| Images | next/image + Cloudinary | Auto WebP, lazy loading |
| Email | Resend (transactional) | Good Thai deliverability |
| Hosting | Vercel | Zero-config Next.js, free tier |
| Domain | Cloudflare Registrar | DNS + CDN + DDoS in one place |

### What we are NOT using (yet)
- ❌ PromptPay / Bank Transfer (future phase)
- ❌ Kerry / Thai Post API integration (manual labels for now)
- ❌ Sanity or other CMS (data lives in TypeScript modules)
- ❌ Inventory management (manual stock tracking)
- ❌ Tailwind / shadcn (existing CSS works)

---

## 3. Project Structure

The repo is split into two top-level workspaces: `front-end/` (Next.js app) and `back-end/` (reserved for any future server-side service — Supabase migrations, scripts, etc.). The Next.js app is self-contained inside `front-end/` — that's where you run `npm install`, `npm run dev`, and `npm run build`.

```
ORDI-Website/
├── front-end/                    # Next.js app (this is where all npm commands run)
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Home
│   │   ├── shop/
│   │   │   ├── page.tsx          # Shop listing
│   │   │   ├── layout.tsx        # Per-route metadata
│   │   │   └── [slug]/page.tsx   # Product detail (SSG)
│   │   ├── about/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── membership/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── checkout/success/page.tsx
│   │   ├── account/page.tsx
│   │   ├── account/orders/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── callback/route.ts # OAuth callback (Phase 2)
│   │   ├── api/
│   │   │   ├── checkout/session/route.ts   # Stripe Checkout (Phase 3)
│   │   │   ├── webhooks/stripe/route.ts    # Stripe webhook (Phase 3)
│   │   │   └── newsletter/route.ts         # (Phase 4)
│   │   ├── layout.tsx            # Root layout (Nav + Footer + AppProvider)
│   │   ├── globals.css           # All styles
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── layout/               # Nav, Footer, CartDrawer
│   │   ├── product/              # ProductDetail, SocialOrderButtons (Phase 4)
│   │   └── ui/                   # MonoTag, SectionHead, Marquee, BottleSlot
│   │
│   ├── lib/
│   │   ├── supabase/             # client.ts / server.ts / middleware (Phase 2)
│   │   ├── stripe/               # client.ts / server.ts (Phase 3)
│   │   ├── data/                 # products.ts, journal.ts, ui-strings.ts
│   │   ├── context/AppContext.tsx
│   │   └── utils.ts              # cn(), formatPrice(), isDarkHue()
│   │
│   ├── types/                    # product.ts, order.ts, user.ts
│   ├── public/images/products/   # Product photography
│   ├── _legacy/                  # Frozen Phase 0 React + CDN prototype
│   │
│   ├── middleware.ts             # Next.js middleware (Supabase session, Phase 2)
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.local                # NEVER commit
│   └── .env.example              # Template for env vars
│
├── back-end/                     # Reserved for future server-side code
│   └── supabase/                 # SQL migrations (added in Phase 2)
│
├── CLAUDE.md                     # This file
├── Project-dev.md                # Phase tracking
├── README.md
└── .gitignore
```

**Working directory note:** `package.json` lives at `front-end/package.json`. Always run npm commands from inside `front-end/` (or use `npm --prefix front-end <cmd>` from the repo root).

---

## 4. Routing Map

| URL | Purpose | Render |
|---|---|---|
| `/` | Home | SSG |
| `/shop` | Product listing | SSG |
| `/shop/[slug]` | Product detail (e.g. `/shop/good-boy`) | SSG |
| `/about` | Brand story | SSG |
| `/journal` | Journal index | SSG |
| `/journal/[slug]` | Journal post (Phase 2) | SSG |
| `/membership` | Tier overview | SSG |
| `/cart` | Cart page | CSR |
| `/checkout` | Checkout flow | SSR |
| `/checkout/success` | Post-payment | SSR |
| `/account` | Member dashboard | SSR (auth required) |
| `/account/orders` | Order history | SSR (auth required) |
| `/auth/login` | Sign in | CSR |
| `/auth/register` | Sign up | CSR |

### Locale Strategy
- Default locale: `en`
- Secondary: `th`
- Use `next-intl` or URL prefix `/th/...` (decide in Phase 1)
- All content strings live in `lib/data/ui-strings.ts`

---

## 5. Database Schema (Supabase)

```sql
-- ============================================================
-- USER PROFILES (extends auth.users)
-- ============================================================
create table profiles (
  id              uuid primary key references auth.users on delete cascade,
  first_name      text,
  last_name       text,
  phone           text,
  preferred_lang  text default 'en' check (preferred_lang in ('en', 'th')),
  is_invited      boolean default false,  -- "Out of Ordinary" tier
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- ORDERS
-- ============================================================
create table orders (
  id                text primary key,           -- e.g. "ORDI-48201"
  user_id           uuid references auth.users on delete set null,
  email             text not null,              -- guest checkout support
  status            text not null default 'pending_payment'
                    check (status in ('pending_payment', 'paid', 'processing',
                                       'shipped', 'delivered', 'cancelled', 'refunded')),
  stripe_session_id text unique,
  stripe_payment_id text,
  payment_method    text,                       -- 'card' | 'promptpay' | 'transfer'
  subtotal          integer not null,           -- THB, no decimals
  shipping_cost     integer not null default 0,
  total             integer not null,
  currency          text not null default 'THB',
  carrier           text,                       -- 'thai-post' | 'kerry' | 'pickup'
  tracking_number   text,
  notes             text,
  created_at        timestamptz default now(),
  paid_at           timestamptz,
  shipped_at        timestamptz,
  delivered_at      timestamptz
);

alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);

create index orders_user_id_idx on orders(user_id);
create index orders_status_idx on orders(status);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    text not null references orders on delete cascade,
  product_id  text not null,                    -- 'good-boy', 'hot-dilf', etc.
  product_name text not null,                   -- snapshot at order time
  size_ml     integer not null,
  qty         integer not null check (qty > 0),
  unit_price  integer not null,
  created_at  timestamptz default now()
);

create index order_items_order_id_idx on order_items(order_id);

-- ============================================================
-- SHIPPING ADDRESSES
-- ============================================================
create table shipping_addresses (
  id          uuid primary key default gen_random_uuid(),
  order_id    text not null references orders on delete cascade,
  first_name  text not null,
  last_name   text not null,
  phone       text not null,
  address     text not null,
  city        text not null,
  postcode    text not null,
  country     text not null default 'TH',
  created_at  timestamptz default now()
);

-- ============================================================
-- WISHLIST
-- ============================================================
create table wishlists (
  user_id     uuid references auth.users on delete cascade,
  product_id  text not null,
  created_at  timestamptz default now(),
  primary key (user_id, product_id)
);

alter table wishlists enable row level security;

create policy "Users manage own wishlist"
  on wishlists for all using (auth.uid() = user_id);

-- ============================================================
-- NEWSLETTER
-- ============================================================
create table newsletter_subscribers (
  email          text primary key,
  lang           text default 'en' check (lang in ('en', 'th')),
  subscribed_at  timestamptz default now(),
  active         boolean default true
);

-- ============================================================
-- MEMBER TIER (computed view)
-- ============================================================
create view member_tiers as
select
  p.id as user_id,
  p.is_invited,
  count(o.id) filter (where o.status in ('paid', 'processing', 'shipped', 'delivered')) as completed_orders,
  case
    when p.is_invited then 'out_of_ordinary'
    when count(o.id) filter (where o.status in ('paid', 'processing', 'shipped', 'delivered')) >= 3 then 'ous'
    else 'ordinary'
  end as tier
from profiles p
left join orders o on o.user_id = p.id
group by p.id, p.is_invited;
```

---

## 6. Authentication Flow

### Providers
1. **Email + Password** — Supabase native
2. **Google OAuth** — via Supabase
3. **LINE OAuth** — via Supabase (LINE Login channel)

### Setup Requirements

**Google OAuth:**
- Google Cloud Console → Create OAuth 2.0 Client
- Authorized redirect URI: `https://[project].supabase.co/auth/v1/callback`
- Add Client ID + Secret to Supabase Dashboard

**LINE OAuth:**
- LINE Developers Console → Create Provider + Channel (LINE Login)
- Callback URL: `https://[project].supabase.co/auth/v1/callback`
- Add Channel ID + Secret to Supabase Dashboard

### Session Management
- Use `@supabase/ssr` for Next.js (server + client cookies)
- Middleware checks session on every request
- Protected routes: `/account/*`, `/checkout/*`
- Redirect to `/auth/login?redirect_to=/account` if unauthenticated

### File Pattern
```typescript
// lib/supabase/server.ts — for RSC and API routes
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(toSet) { toSet.forEach(c => cookieStore.set(c.name, c.value, c.options)) }
      }
    }
  )
}
```

---

## 7. Payment Flow (Stripe Checkout)

### Why Stripe Checkout (not Elements)
- Hosted page = zero PCI scope for us
- Built-in fraud protection
- Auto-handles 3D Secure
- Mobile-optimized
- Receipt emails included

### Order Creation Flow
```
1. User fills checkout form → clicks "Place Order"
2. Frontend POST /api/checkout/session
   Body: { items, email, shipping_address, carrier }
3. API Route:
   a. Generate order ID (e.g. "ORDI-48201")
   b. Insert order to Supabase (status: 'pending_payment')
   c. Insert order_items + shipping_address
   d. Create Stripe Checkout Session
   e. Return session URL
4. Frontend redirects to Stripe Checkout
5. User completes payment
6. Stripe redirects to /checkout/success?session_id=...
7. (Async) Stripe webhook → /api/webhooks/stripe
   a. Verify signature
   b. Update order status to 'paid'
   c. Set paid_at timestamp
   d. Send confirmation email via Resend
```

### Stripe Session Config
```typescript
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  payment_method_types: ['card'],
  line_items: items.map(it => ({
    price_data: {
      currency: 'thb',
      product_data: { name: it.product_name },
      unit_amount: it.unit_price * 100,  // Stripe uses smallest unit
    },
    quantity: it.qty,
  })),
  customer_email: email,
  metadata: { order_id: orderId },
  success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${origin}/checkout?cancelled=true`,
  shipping_address_collection: { allowed_countries: ['TH', 'US', 'GB', 'JP', 'SG'] },
})
```

### Webhook Security
- Verify `stripe-signature` header against `STRIPE_WEBHOOK_SECRET`
- Handle these events:
  - `checkout.session.completed` → mark order paid
  - `checkout.session.expired` → mark order cancelled
  - `charge.refunded` → mark order refunded

---

## 8. Social Order Buttons

For customers who prefer not to use Stripe (Thai customers especially), every Product page and Checkout shows alternative channels.

### Component Spec
```typescript
// components/product/SocialOrderButtons.tsx
type Props = {
  product: Product
  size: number  // ml
  lang: 'en' | 'th'
}

// Pre-filled messages per platform
const messages = {
  line: (p, size, lang) => `https://line.me/R/ti/p/@ordi?msg=${encodeURIComponent(
    lang === 'th'
      ? `สวัสดีค่ะ สนใจ ${p.name} ขนาด ${size}ml ค่ะ`
      : `Hi, I'm interested in ${p.name} ${size}ml`
  )}`,

  instagram: () => `https://ig.me/m/ordi.atelier`,

  shopee: (p) => `https://shopee.co.th/ordi/product/${p.shopeeId}`,

  tiktok: () => `https://www.tiktok.com/@ordi/shop`,
}
```

### Placement
- Product detail page: below "Add to Cart"
- Checkout page: as alternative section "Prefer to order via chat?"
- Footer: small icons

---

## 9. Environment Variables

```bash
# .env.local — NEVER commit

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx  # server-only, bypass RLS

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Resend (email)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=orders@ordi.com

# Social
NEXT_PUBLIC_LINE_OA_ID=@ordi
NEXT_PUBLIC_INSTAGRAM_HANDLE=ordi.atelier
NEXT_PUBLIC_SHOPEE_SHOP=ordi
NEXT_PUBLIC_TIKTOK_HANDLE=ordi

# Site
NEXT_PUBLIC_SITE_URL=https://ordi.com
```

---

## 10. Coding Conventions

### TypeScript
- `strict: true` in tsconfig
- All exports typed explicitly
- No `any` — use `unknown` if truly unknown
- Prefer `type` over `interface` (composability)

### Components
- Server Components by default (no `'use client'` unless interactive)
- Co-locate types with components
- One component per file, named export
- File name = component name (PascalCase)

### Data Fetching
- Server Components: fetch directly from Supabase
- Client Components: API routes only
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client

### Styling
- Keep existing CSS classes (`.ordi-*` prefix)
- New styles go in `globals.css` with same naming convention
- No CSS modules, no Tailwind

### State Management
- React Context for cart/wishlist/language (existing pattern)
- Persist cart to `localStorage` (Phase 1 addition)
- Sync to DB after login (Phase 2)

### Error Handling
- API routes return `{ error: string }` with appropriate status
- Use `try/catch` in all server actions
- Show user-friendly errors via toast (Phase 2)

---

## 11. Design Tokens (Existing — DO NOT CHANGE)

```css
:root {
  --paper: #F5F2EC;
  --paper-2: #EDE9E0;
  --ink: #0A0A0A;
  --ink-soft: rgba(10, 10, 10, 0.6);
  --display: "Satoshi", system-ui, sans-serif;
  --mono: "Geist Mono", ui-monospace, monospace;
  --container: 1380px;
  --gutter-x: 56px;
  --section-y: 140px;
}
```

These tokens are sacred — preserved from the design prototype.

---

## 12. Migration Notes from Prototype

The frontend in `/frontend/` is a working React + CDN prototype.
When migrating to Next.js, preserve:

✅ All component logic in `components.jsx`, `screens-1.jsx`, `screens-2.jsx`
✅ All CSS in `styles.css` → move to `app/globals.css`
✅ Bilingual data structure in `data.js` → port to `lib/data/`
✅ AppContext pattern → adapt for Next.js (Client Component)

Replace:
- `<image-slot>` → `next/image`
- Custom `screen` routing → file-based routing
- Babel-in-browser → Next.js build
- `window.ORDI_DATA` → typed imports from `lib/data/`

---

## 13. Quick Reference Links

- Supabase Docs: https://supabase.com/docs
- Next.js App Router: https://nextjs.org/docs/app
- Stripe Checkout: https://docs.stripe.com/payments/checkout
- LINE Login: https://developers.line.biz/en/docs/line-login/
- Resend + Next.js: https://resend.com/docs/send-with-nextjs
