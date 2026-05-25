# Project-dev.md — ORDI Development Log

> Track progress phase by phase. Update checkboxes as you complete tasks.
> For architecture decisions and schema, see `CLAUDE.md`.

---

## 📊 Overall Progress

| Phase | Status | Estimated | Description |
|---|---|---|---|
| Phase 0 | 🟢 Done | — | Design prototype (React + CDN) |
| Phase 1 | ⚪ Not started | 4-6 hours | Migrate to Next.js + TypeScript |
| Phase 2 | ⚪ Not started | 3-4 hours | Supabase Auth (Email + Google + LINE) |
| Phase 3 | ⚪ Not started | 2-3 hours | Stripe Checkout integration |
| Phase 4 | ⚪ Not started | 2 hours | Social Order Buttons + Polish + Deploy |

Legend: ⚪ Not started · 🟡 In progress · 🟢 Done · 🔴 Blocked

---

## ✅ Phase 0: Prototype (DONE)

What we already have:
- [x] Full UI design — 9 screens
- [x] Bilingual support (EN/TH)
- [x] Custom design system (CSS tokens)
- [x] Cart + wishlist (in-memory)
- [x] Mock checkout flow
- [x] Mock auth UI
- [x] `<image-slot>` placeholder system

**Files:**
- `frontend/index.html`
- `frontend/app.jsx`, `components.jsx`, `screens-1.jsx`, `screens-2.jsx`
- `frontend/data.js`
- `frontend/styles.css`

---

## 🚧 Phase 1: Migrate to Next.js (4-6 hours)

**Goal:** Convert CDN React prototype to production-ready Next.js app with TypeScript.

### 1.1 — Initial Setup

- [ ] Create new Next.js project: `npx create-next-app@latest ordi-web --typescript --app --no-tailwind --no-src-dir`
- [ ] Move existing `frontend/` files into a `_legacy/` folder for reference
- [ ] Install base dependencies:
  ```bash
  npm install clsx
  npm install -D @types/node
  ```
- [ ] Set up `.env.example` with all required variables (see CLAUDE.md §9)
- [ ] Configure `tsconfig.json`: `strict: true`, path aliases (`@/*` → root)
- [ ] Add Cloudinary or local images to `public/images/`

### 1.2 — Port Styles

- [ ] Copy `frontend/styles.css` → `app/globals.css` (no changes needed)
- [ ] Add font imports to `app/layout.tsx`:
  - Satoshi (via Fontshare)
  - Geist Mono (via Google Fonts using `next/font`)
- [ ] Verify all `.ordi-*` classes render correctly

### 1.3 — Port Data

- [ ] Create `types/product.ts`:
  ```typescript
  export type Product = {
    id: string
    name: string
    number: string
    tagline: { en: string; th: string }
    family: { en: string; th: string }
    story: { en: string; th: string }
    notes: { top: string[]; heart: string[]; base: string[] }
    sizes: { ml: number; price: number }[]
    status: 'available' | 'coming-soon' | 'sold-out'
    hue: string
  }
  ```
- [ ] Create `lib/data/products.ts` — typed product array (from `data.js`)
- [ ] Create `lib/data/journal.ts` — typed journal posts
- [ ] Create `lib/data/ui-strings.ts` — translation dictionaries

### 1.4 — Port Components

- [ ] `components/layout/Nav.tsx` — port from `Nav` in `components.jsx`
- [ ] `components/layout/Footer.tsx`
- [ ] `components/layout/CartDrawer.tsx` ← `'use client'`
- [ ] `components/ui/MonoTag.tsx`
- [ ] `components/ui/SectionHead.tsx`
- [ ] `components/ui/Marquee.tsx`
- [ ] `components/ui/Button.tsx` — extract from inline classes

### 1.5 — Port App Context

- [ ] Create `lib/context/AppContext.tsx` ← `'use client'`
  - Cart state (with localStorage persistence)
  - Wishlist state (with localStorage persistence)
  - Language state (cookie-backed)
  - Drawer open state
- [ ] Wrap in `app/layout.tsx`

### 1.6 — Port Screens to Routes

- [ ] `app/page.tsx` — Home (from `HomeScreen`)
- [ ] `app/shop/page.tsx` — Shop listing (from `ShopScreen`)
- [ ] `app/shop/[slug]/page.tsx` — Product detail (from `ProductScreen`)
  - Use `generateStaticParams` for SSG
  - Use `generateMetadata` for SEO
- [ ] `app/about/page.tsx`
- [ ] `app/journal/page.tsx`
- [ ] `app/membership/page.tsx`
- [ ] `app/cart/page.tsx`
- [ ] `app/checkout/page.tsx` ← `'use client'` (placeholder for Phase 3)
- [ ] `app/account/page.tsx` ← `'use client'` (placeholder for Phase 2)

### 1.7 — Image Migration

- [ ] Place real product photos in `public/images/products/[id]/[size].jpg`
- [ ] Replace `<image-slot>` with `next/image`:
  ```tsx
  <Image
    src={`/images/products/${product.id}/main.jpg`}
    alt={product.name}
    width={720}
    height={900}
    priority={isAboveFold}
  />
  ```
- [ ] (Optional) Set up Cloudinary loader for production

### 1.8 — SEO Setup

- [ ] Configure `app/layout.tsx` metadata defaults
- [ ] Add `app/sitemap.ts` — list all product + journal URLs
- [ ] Add `app/robots.ts`
- [ ] Add OG image generation (`app/opengraph-image.tsx`)
- [ ] Per-product metadata in `app/shop/[slug]/page.tsx`

### 1.9 — Verify

- [ ] Run `npm run dev` — all pages load
- [ ] Run `npm run build` — no TypeScript errors
- [ ] Lighthouse score on homepage: target 95+ for Performance + SEO
- [ ] Test responsive layout at 1280px, 1024px, 768px

**✅ Phase 1 Done When:** All 9 screens render via real URLs, no `window.ORDI_DATA`, no Babel CDN.

---

## 🚧 Phase 2: Supabase Auth (3-4 hours)

**Goal:** Replace mock auth with real authentication (Email + Google + LINE).

### 2.1 — Supabase Project Setup

- [ ] Sign up at supabase.com
- [ ] Create new project: `ordi-production`
- [ ] Copy project URL + anon key to `.env.local`
- [ ] Copy service_role key to `.env.local` (server-side only)

### 2.2 — Run Database Migrations

- [ ] Create `supabase/migrations/0001_initial_schema.sql` (from CLAUDE.md §5)
- [ ] Run in Supabase SQL Editor
- [ ] Verify tables exist: `profiles`, `orders`, `order_items`, `shipping_addresses`, `wishlists`, `newsletter_subscribers`
- [ ] Verify RLS policies active
- [ ] Verify `handle_new_user()` trigger fires

### 2.3 — Install Supabase Packages

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2.4 — Set Up Clients

- [ ] Create `lib/supabase/client.ts` (browser)
- [ ] Create `lib/supabase/server.ts` (RSC + API routes)
- [ ] Create `middleware.ts` (session refresh)
- [ ] Add types: `npm install -D supabase` then `npx supabase gen types typescript --project-id [id] > types/supabase.ts`

### 2.5 — Google OAuth Setup

- [ ] Google Cloud Console → Create OAuth 2.0 Client ID
- [ ] Add authorized redirect URI: `https://[project-ref].supabase.co/auth/v1/callback`
- [ ] Copy Client ID + Secret to Supabase Dashboard → Auth → Providers → Google
- [ ] Enable Google provider in Supabase

### 2.6 — LINE OAuth Setup

- [ ] LINE Developers Console → Create Provider
- [ ] Create new Channel → "LINE Login"
- [ ] Set Callback URL: `https://[project-ref].supabase.co/auth/v1/callback`
- [ ] Required scopes: `profile`, `openid`, `email`
- [ ] Copy Channel ID + Secret to Supabase Dashboard → Auth → Providers → LINE
- [ ] Enable LINE provider

### 2.7 — Auth Pages

- [ ] `app/auth/login/page.tsx`:
  - Email + Password form
  - Google button → `signInWithOAuth({ provider: 'google' })`
  - LINE button → `signInWithOAuth({ provider: 'line' })`
- [ ] `app/auth/register/page.tsx`:
  - Email + Password + Name form
  - Same OAuth buttons
- [ ] `app/auth/callback/route.ts`:
  - Handle `code` query param
  - Exchange for session
  - Redirect to `/account` or original page

### 2.8 — Update Account Page

- [ ] `app/account/page.tsx`:
  - Server Component — read session from `createClient()`
  - If no session → redirect to `/auth/login`
  - Show profile data from `profiles` table
  - Show order history from `orders` table
  - Show wishlist
  - Calculate tier from `member_tiers` view

### 2.9 — Sync Cart on Login

- [ ] Update `AppContext` to merge localStorage cart with DB cart on login
- [ ] Save wishlist additions to DB when authenticated

### 2.10 — Protected Routes

- [ ] Update `middleware.ts`:
  - Protect `/account/*` → redirect to login
  - Protect `/checkout` → allow guest, but encourage login

**✅ Phase 2 Done When:** Real users can sign up, log in via 3 providers, and see their profile/orders.

---

## 🚧 Phase 3: Stripe Checkout (2-3 hours)

**Goal:** Real payment processing via Stripe Checkout.

### 3.1 — Stripe Account Setup

- [ ] Sign up at stripe.com
- [ ] Switch to Test mode
- [ ] Copy publishable + secret keys to `.env.local`
- [ ] Enable Thai Baht (THB) currency

### 3.2 — Install Stripe

```bash
npm install stripe @stripe/stripe-js
```

### 3.3 — Stripe Clients

- [ ] Create `lib/stripe/server.ts`:
  ```typescript
  import Stripe from 'stripe'
  export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  ```
- [ ] Create `lib/stripe/client.ts`:
  ```typescript
  import { loadStripe } from '@stripe/stripe-js'
  export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  ```

### 3.4 — Checkout Session API

- [ ] Create `app/api/checkout/session/route.ts`:
  - Accept `POST` with cart items, email, shipping
  - Generate order ID (`ORDI-${nanoid(5)}`)
  - Insert order + items into Supabase (status: `pending_payment`)
  - Create Stripe Checkout Session (see CLAUDE.md §7)
  - Return session URL
- [ ] Update checkout page to call this API on "Place Order"
- [ ] Redirect to `session.url`

### 3.5 — Webhook Handler

- [ ] Create `app/api/webhooks/stripe/route.ts`:
  - Read raw body (use `request.text()`)
  - Verify signature with `stripe.webhooks.constructEvent()`
  - Handle events:
    - `checkout.session.completed` → update order to `paid`
    - `checkout.session.expired` → update to `cancelled`
    - `charge.refunded` → update to `refunded`
  - Return 200 OK
- [ ] Test locally with Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```
- [ ] Copy webhook signing secret to `.env.local`

### 3.6 — Success + Cancel Pages

- [ ] `app/checkout/success/page.tsx`:
  - Read `session_id` from query
  - Fetch order from Supabase
  - Show order summary + estimated delivery
  - Clear cart
- [ ] `app/checkout/cancelled/page.tsx`:
  - Show "Order cancelled" message
  - Link back to cart

### 3.7 — Email Confirmation

- [ ] Sign up at resend.com
- [ ] Verify sending domain
- [ ] Install: `npm install resend`
- [ ] Create `lib/email/send-order-confirmation.ts`
- [ ] Call from webhook on `checkout.session.completed`
- [ ] Email template (HTML + plain text):
  - Order number
  - Items + prices
  - Shipping address
  - Estimated delivery

### 3.8 — Production Webhook

- [ ] In production: add webhook endpoint in Stripe Dashboard
- [ ] URL: `https://ordi.com/api/webhooks/stripe`
- [ ] Events: `checkout.session.completed`, `checkout.session.expired`, `charge.refunded`
- [ ] Copy production signing secret to Vercel env vars

**✅ Phase 3 Done When:** Test card `4242 4242 4242 4242` completes order, webhook fires, email arrives, order shows in account.

---

## 🚧 Phase 4: Social Buttons + Polish + Deploy (2 hours)

**Goal:** Multi-channel order options + production deployment.

### 4.1 — Social Order Buttons

- [ ] Create `components/product/SocialOrderButtons.tsx` (see CLAUDE.md §8)
- [ ] Add icons (LINE, Instagram, Shopee, TikTok logos as SVG)
- [ ] Pre-fill messages in user's language
- [ ] Add to `ProductScreen` below "Add to Cart"
- [ ] Add to `CheckoutScreen` as alternative section
- [ ] Add small icons in `Footer`

### 4.2 — Newsletter Signup

- [ ] `app/api/newsletter/route.ts` — POST email + lang to Supabase
- [ ] Wire up footer newsletter form
- [ ] Show success/error states

### 4.3 — Waitlist (SKIN SCENT)

- [ ] Create table `waitlist` (email, product_id, lang)
- [ ] `app/api/waitlist/route.ts`
- [ ] Wire up "Notify me" button on coming-soon products

### 4.4 — Analytics

- [ ] Sign up at plausible.io or use Vercel Analytics
- [ ] Add tracking script to `app/layout.tsx`
- [ ] Track key events:
  - `add_to_cart`
  - `begin_checkout`
  - `purchase`
  - `social_order_clicked` (which platform)

### 4.5 — SEO Final Pass

- [ ] Add structured data (JSON-LD) for products
- [ ] Verify OG images render on social shares
- [ ] Submit sitemap to Google Search Console
- [ ] Add `manifest.json` for PWA basics

### 4.6 — Production Deploy

- [ ] Push to GitHub
- [ ] Connect Vercel to GitHub repo
- [ ] Add all env vars to Vercel
- [ ] Deploy to preview → test
- [ ] Promote to production
- [ ] Configure custom domain in Vercel
- [ ] Set up Cloudflare DNS (proxy enabled for CDN)

### 4.7 — Post-Launch Checklist

- [ ] Test checkout end-to-end on production with real card
- [ ] Verify webhook fires in production
- [ ] Verify emails arrive (check spam folder)
- [ ] Verify all OAuth providers work
- [ ] Test on iPhone Safari + Android Chrome
- [ ] Test on slow 3G connection
- [ ] Set up uptime monitoring (UptimeRobot — free)

**✅ Phase 4 Done When:** Site is live at ordi.com, accepting real orders.

---

## 🔮 Future Phases (Not Now)

### Phase 5: Payment Variety
- PromptPay QR (via Opn Payments)
- Thai bank transfer
- Apple Pay / Google Pay

### Phase 6: CMS for Journal
- Sanity or Contentful
- Markdown-driven posts
- Author profiles

### Phase 7: Admin Dashboard
- Order management UI
- Inventory tracking
- Customer profile editor
- Print shipping labels

### Phase 8: Internationalization
- Multi-currency (USD, EUR, JPY)
- Geo-detected pricing
- International shipping calculator (FedEx, DHL)

### Phase 9: Loyalty Features
- Automatic tier upgrades
- Member-only product drops
- Referral codes

---

## 📝 Notes & Decisions Log

### YYYY-MM-DD — Initial planning
- Chose Next.js over Vite SPA → SEO critical for organic discovery
- Chose Supabase over Firebase → SQL preference + LINE OAuth support
- Chose Stripe Checkout over Elements → faster ship + less PCI scope
- Defer PromptPay to Phase 5 → Stripe + Social buttons cover initial customers

### Add new decisions below as you make them
- ...
