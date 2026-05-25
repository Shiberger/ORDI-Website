# Project-dev.md — ORDI Development Log

> Track progress phase by phase. Update checkboxes as you complete tasks.
> For architecture decisions and schema, see `CLAUDE.md`.

---

## 📊 Overall Progress

| Phase | Status | Estimated | Description |
|---|---|---|---|
| Phase 0 | 🟢 Done | — | Design prototype (React + CDN) |
| Phase 1 | 🟢 Done | 4-6 hours | Migrate to Next.js + TypeScript |
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

## ✅ Phase 1: Migrate to Next.js (DONE)

**Goal:** Convert CDN React prototype to production-ready Next.js app with TypeScript.

### 1.1 — Initial Setup

- [x] Scaffold Next.js 15 + TypeScript + App Router project (manual setup, not create-next-app)
- [x] Move existing `frontend/` files into a `_legacy/` folder for reference
- [x] Install base dependencies (`clsx`, types)
- [x] Set up `.env.example` with all required variables (see CLAUDE.md §9)
- [x] Configure `tsconfig.json`: `strict: true`, path aliases (`@/*` → root)
- [ ] Add Cloudinary or local images to `public/images/` (deferred to Phase 1.7)

### 1.2 — Port Styles

- [x] Copy `frontend/styles.css` → `app/globals.css` (no changes needed)
- [x] Add font imports to `app/layout.tsx`:
  - Satoshi (via Fontshare)
  - Geist Mono (via `next/font/google`)
- [x] Added `.ordi-slot` placeholder styles for replaced `<image-slot>` web component

### 1.3 — Port Data

- [x] `types/product.ts` — Product, JournalEntry, Lang, Bilingual
- [x] `types/order.ts` — Order, OrderItem, ShippingAddress, CartItem
- [x] `types/user.ts` — Profile, MemberTier
- [x] `lib/data/products.ts` — typed product array
- [x] `lib/data/journal.ts` — typed journal posts
- [x] `lib/data/ui-strings.ts` — translation dictionaries
- [x] `lib/utils.ts` — `cn()`, `formatPrice()`, `isDarkHue()`

### 1.4 — Port Components

- [x] `components/layout/Nav.tsx` — uses `next/link` + `usePathname`
- [x] `components/layout/Footer.tsx`
- [x] `components/layout/CartDrawer.tsx` ← `'use client'`
- [x] `components/ui/MonoTag.tsx`
- [x] `components/ui/SectionHead.tsx`
- [x] `components/ui/Marquee.tsx`
- [x] `components/ui/BottleSlot.tsx` — placeholder for legacy `<image-slot>`
- [x] `components/product/ProductDetail.tsx` — client component split from server page

### 1.5 — Port App Context

- [x] Create `lib/context/AppContext.tsx` ← `'use client'`
  - Cart state (with localStorage persistence)
  - Wishlist state (with localStorage persistence)
  - Language state (localStorage-backed)
  - Drawer open state
- [x] Wrap in `app/layout.tsx`

### 1.6 — Port Screens to Routes

- [x] `app/page.tsx` — Home
- [x] `app/shop/page.tsx` — Shop listing (with filter)
- [x] `app/shop/[slug]/page.tsx` — Product detail (server: SSG + metadata)
  - [x] `generateStaticParams` for SSG (5 products prerendered)
  - [x] `generateMetadata` for SEO
- [x] `app/about/page.tsx`
- [x] `app/journal/page.tsx`
- [x] `app/membership/page.tsx`
- [x] `app/cart/page.tsx`
- [x] `app/checkout/page.tsx` ← `'use client'` (mock 3-step flow, real Stripe in Phase 3)
- [x] `app/account/page.tsx` ← `'use client'` (mock auth, real Supabase in Phase 2)
- [x] `app/not-found.tsx`

### 1.7 — Image Migration

- [x] `components/ui/BottleSlot.tsx` placeholder in place (replaces legacy `<image-slot>`)
- [ ] Place real product photos in `public/images/products/[id]/[size].jpg` *(pending photography)*
- [ ] Replace `BottleSlot` with `next/image` once photos are added
- [ ] (Optional) Set up Cloudinary loader for production

### 1.8 — SEO Setup

- [x] Configure `app/layout.tsx` metadata defaults (OpenGraph, Twitter, title template)
- [x] Add `app/sitemap.ts` — static + product URLs
- [x] Add `app/robots.ts` — disallow `/account`, `/checkout`, `/cart`, `/api`
- [x] Per-route metadata via small server `layout.tsx` files (shop, about, journal, membership)
- [x] Per-product metadata via `generateMetadata` in `app/shop/[slug]/page.tsx`
- [ ] OG image generation (`app/opengraph-image.tsx`) *(deferred; needs hero asset)*

### 1.9 — Verify

- [x] `npm install` — 304 packages, 0 critical issues
- [x] `npm run build` — passes; 18 static pages prerendered (5 product SSG routes)
- [ ] `npm run dev` — manual visual check pending
- [ ] Lighthouse score on homepage: target 95+
- [ ] Test responsive layout at 1280px, 1024px, 768px

### 1.10 — Repo Restructure (post-Phase-1)

- [x] Move all Next.js files from repo root into `front-end/` to separate concerns from future back-end code
- [x] Rename `backend/` → `back-end/` for consistency
- [x] Update `CLAUDE.md` §3 project structure to reflect new layout
- [x] Verify `npm run build` still passes from inside `front-end/`
- [x] `.gitignore` patterns are non-anchored, so no changes needed (still matches `front-end/node_modules`, `front-end/.next`, etc.)

**Working directory note:** all npm commands (`npm install`, `npm run dev`, `npm run build`) must be run from `front-end/`. Use `npm --prefix front-end <cmd>` from repo root if needed.

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

### 2026-05-25 — Phase 1 migration
- Scaffolded Next.js 15 + React 19 + TypeScript manually (not via `create-next-app`) — simpler for this automated migration; produced same output.
- **Locale strategy:** chose client-side language switch via React Context + localStorage (not URL prefix `/th/...`). Reasoning: SEO renders English by default, lang preference is per-user and persists between sessions. Reconsider if Thai-language SEO becomes priority.
- **`<image-slot>` replaced by `BottleSlot`:** A CSS-only placeholder component for now. When real product photography lands, swap this for `next/image` in one place. Sidecar-based upload (legacy) is incompatible with the Vercel runtime and not needed in production.
- **Server vs. client components:** Most pages are `'use client'` because they consume `useApp()` for bilingual text. Product detail uses a server-component wrapper for `generateStaticParams` + `generateMetadata` and delegates UI to a `ProductDetail` client component.
- **Per-route metadata pattern:** Client pages can't export `metadata`, so per-route SEO lives in sibling `layout.tsx` server components (shop/about/journal/membership).

### 2026-05-25 — Repo restructure (front-end / back-end split)
- Moved the entire Next.js app (app/, components/, lib/, public/, types/, _legacy/, package.json, tsconfig.json, next.config.ts, node_modules/, .next/) from the repo root into `front-end/`.
- Renamed `backend/` → `back-end/` for hyphenation consistency. Still empty; reserved for Supabase migrations and any future server-side code (workers, scripts).
- **Why:** future back-end work (SQL migrations, Edge Functions, admin scripts) would otherwise collide with the Next.js app's root files and `node_modules`. Separating them up front keeps each workspace self-contained.
- **Working directory:** all npm commands now run from `front-end/`. Tools that walk up from `cwd` to find `package.json` (lint, formatters, IDE) will work correctly inside that subdirectory.
- Build verified passing from the new location.

### Add new decisions below as you make them
- ...
