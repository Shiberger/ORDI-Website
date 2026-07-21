# Project-dev.md — ORDI Development Log

> Track progress phase by phase. Update checkboxes as you complete tasks.
> For architecture decisions and schema, see `CLAUDE.md`.

---

## 📊 Overall Progress

| Phase | Status | Description |
|---|---|---|
| Phase 0 | 🟢 Done | Design prototype (React + CDN) |
| Phase 1 | 🟢 Done | Migrate to Next.js + TypeScript |
| Phase 2 | 🟢 Done | Monorepo + Supabase schema + content in DB — **live** |
| Phase 3 | 🟢 Code done · ⚪ Not provisioned | Stripe guest checkout + webhook + email |
| Phase 4 | 🟢 Done | Admin dashboard (orders, sales, products, journal) — **live** |
| Phase 5 | ⚪ Not started | Customer accounts (Email + Google + LINE) |
| Phase 6 | ⚪ Not started | Social order buttons + newsletter + analytics |
| Phase 7 | ⚪ Not started | Production deploy (2 Vercel projects + domains) |

Legend: ⚪ Not started · 🟡 In progress · 🟢 Done · 🔴 Blocked

> **"Code done · not provisioned"** means every file exists and both apps build,
> but no Supabase / Stripe / Resend account has been created yet. Until the env
> vars are filled in, the storefront serves the bundled seed catalogue and
> checkout returns 503. See **Setup Runbook** below.

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

## ✅ Phase 2: Monorepo + Supabase content layer (CODE DONE)

**Goal:** One database behind two apps, with products and journal entries
editable instead of hard-coded.

### 2.1 — Repo restructure
- [x] npm workspaces root: `front-end`, `admin`, `back-end`, `packages/*`
- [x] `packages/shared` (`@ordi/shared`) — domain types, DB types, mappers, queries, seed data, utils
- [x] `front-end/types/*` reduced to re-exports so `@/types/...` imports still work
- [x] `transpilePackages: ['@ordi/shared']` in both apps — no build step for the package

### 2.2 — Migrations
- [x] `0001_core_schema.sql` — profiles (+`role`), orders, order_items, shipping_addresses, wishlists, newsletter, `member_tiers` view, `is_admin()`, signup trigger
- [x] `0002_content_schema.sql` — products, product_sizes, journal_entries + RLS
- [x] Run both in the Supabase SQL Editor — project `vbinuvnkhvedwsyvkwdz`, all 9 tables + RLS verified

### 2.3 — Content moved out of TypeScript
- [x] `lib/data/products.ts` + `journal.ts` → `packages/shared/src/seed/`
- [x] `lib/data/catalog.ts` reads Supabase, falls back to seed when unconfigured
- [x] Root layout fetches the catalogue once and passes it through `AppProvider`
- [x] Every client view reads `useApp().products` / `.journal` instead of importing arrays
- [x] `sitemap.ts` now includes journal URLs
- [x] `products.image_url` column + `getProductImage()` fallback chain
- [x] `npm run seed` — 5 products (10 sizes) + 4 journal entries live in Postgres

**✅ Done when:** the shop renders from Postgres and the seed script is idempotent.

---

## ✅ Phase 3: Stripe guest checkout (CODE DONE)

**Goal:** Take real money without requiring an account.

- [x] `lib/stripe/server.ts` — lazily constructed client
- [x] `lib/shipping.ts` — server-authoritative carrier rates
- [x] `POST /api/checkout/session` — re-prices every line from the DB, creates the order, returns the Stripe URL
- [x] `POST /api/webhooks/stripe` — signature verification + `completed` / `expired` / `refunded`
- [x] Idempotency guard: paid transition only applies to `pending_payment` rows
- [x] `/checkout` rewritten — contact → shipping → review, real redirect, cancel banner
- [x] `/checkout/success` — receipt read by Stripe session id, clears the cart
- [x] Resend confirmation email (HTML + plain text), non-fatal on failure
- [x] `POST /api/revalidate` — bearer-token ISR purge for the dashboard
- [ ] End-to-end test with `4242 4242 4242 4242` *(needs an account)*
- [ ] Production webhook endpoint + signing secret

**✅ Done when:** the test card completes an order, the webhook flips it to paid,
and the receipt email arrives.

---

## ✅ Phase 4: Admin Dashboard (CODE DONE)

**Goal:** Run the shop without touching code or the Supabase table editor.

### 4.1 — App + auth
- [x] `admin/` workspace, own Next.js app on port 3001
- [x] Supabase Auth email + password login
- [x] `middleware.ts` — session refresh, anonymous → `/login`
- [x] `requireAdmin()` — `profiles.role` must be `admin` or `owner`
- [x] Anon key only; RLS is the enforcement boundary
- [x] `npm run create-admin -- <email> [owner|admin]` — creates the auth user *and* sets the role
- [x] `npm run make-admin -- <email>` — promotes an existing user
- [x] Owner account created; sign-in, `requireAdmin()`, and admin RLS write verified

### 4.2 — Dashboard
- [x] 30-day revenue, AOV, units sold, unpaid + unshipped counts
- [x] Daily revenue bar chart (CSS only, no chart library)
- [x] Best sellers by revenue
- [x] Recent orders table

### 4.3 — Orders
- [x] Filter by status, search by order id / email, pagination
- [x] Detail: line items, totals, shipping address, Stripe ids, timeline
- [x] Fulfilment form: status, carrier, tracking number, internal note
- [x] Status changes stamp `paid_at` / `shipped_at` / `delivered_at`

### 4.4 — Content
- [x] Products: list, create, edit, delete, publish toggle, sort order
- [x] Bilingual copy, notes, hue, image URL, dynamic per-size pricing rows
- [x] Journal: list, create, edit, delete, publish toggle, auto read-time
- [x] Every save pings the storefront's `/api/revalidate`

### 4.5 — Still open
- [ ] Image upload to Supabase Storage (today: paste a URL)
- [ ] CSV export of orders
- [ ] Printable shipping labels
- [ ] Customer list view

**✅ Done when:** a new fragrance added in the dashboard appears on ordibkk.com
without a deploy.

---

## 🚧 Phase 5: Customer accounts (NOT STARTED)

Guest checkout ships first, so this is now optional rather than blocking.

- [ ] Google OAuth — Cloud Console client + Supabase provider
- [ ] LINE OAuth — LINE Developers channel + Supabase provider
- [ ] `/auth/login`, `/auth/register`, `/auth/callback`
- [ ] Storefront `middleware.ts` protecting `/account/*`
- [ ] Real `/account` — profile, orders, wishlist, tier from `member_tiers`
- [ ] Back-fill guest orders onto accounts by matching email
- [ ] Merge localStorage cart + wishlist into the DB on sign-in

---

## 🚧 Phase 6: Social buttons + polish (NOT STARTED)

- [ ] `SocialOrderButtons.tsx` (LINE / Instagram / Shopee / TikTok)
- [ ] Newsletter signup → `newsletter_subscribers`
- [ ] Waitlist for coming-soon fragrances
- [ ] Analytics + `add_to_cart` / `begin_checkout` / `purchase` events
- [ ] JSON-LD product structured data, OG images, `manifest.json`

---

## 🚧 Phase 7: Production deploy (NOT STARTED)

- [ ] Vercel project 1 — root `front-end/` → ordibkk.com
- [ ] Vercel project 2 — root `admin/` → admin.ordibkk.com
- [ ] Env vars in both (same `REVALIDATE_SECRET`)
- [ ] Stripe production webhook
- [ ] Cloudflare DNS
- [ ] Post-launch: real card test, OAuth check, mobile Safari + Chrome, uptime monitor

---

## 🧭 Setup Runbook — from zero to a working shop

Run in order. Each step is a prerequisite for the next.

### 1–2. Supabase + admin access

**→ Full click-by-click walkthrough: [`back-end/supabase/SETUP.md`](back-end/supabase/SETUP.md)**

Short version:
1. Project Settings → API Keys → copy the **secret key** into
   `front-end/.env.local` as `SUPABASE_SECRET_KEY`
2. SQL Editor → run `0001_core_schema.sql`, then `0002_content_schema.sql`
   (both are idempotent — safe to re-run)
3. `npm run seed`
4. Authentication → Users → Add user (auto-confirm on)
5. `npm run make-admin -- you@email.com`
6. `npm run dev:admin` → http://localhost:3001 → sign in

`.env.local` for both apps already exists with the project URL, publishable key
and a shared `REVALIDATE_SECRET`. Only the secret key is missing.

### 3. Stripe
1. stripe.com → account → stay in **Test mode**
2. Developers → API keys → copy secret + publishable into `front-end/.env.local`
3. `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`
5. `npm run dev` → add to cart → checkout → `4242 4242 4242 4242`
6. Confirm the order flips to **paid** in the dashboard

### 4. Resend (optional)
1. resend.com → verify a sending domain
2. `RESEND_API_KEY` + `RESEND_FROM_EMAIL` into `front-end/.env.local`

Until steps 1 and 3 are done: the storefront serves the seed catalogue and
`/api/checkout/session` returns 503 with a clear message. Nothing crashes.

---

## 🔮 Future Phases (Not Now)

### Payment variety
- PromptPay QR — now just a Stripe Dashboard toggle, no code change
- Thai bank transfer (manual reconciliation)
- Apple Pay / Google Pay — also Dashboard-side

### Dashboard v2
- Image upload to Supabase Storage
- Inventory / batch tracking (300-bottle runs)
- Customer profile editor + CSV export
- Printable shipping labels

### Internationalization
- Multi-currency (USD, EUR, JPY)
- Geo-detected pricing
- International shipping calculator (FedEx, DHL)

### Loyalty features
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

### 2026-07-21 — Payment + Admin Dashboard build

**Repo → npm workspaces monorepo.** The dashboard is a second Next.js app in
`admin/`, not a route group in the storefront. Reasons: dashboard code never
enters the customer bundle, the two deploy independently to different domains,
and an admin bug cannot take the shop down. Shared code lives in
`packages/shared` (`@ordi/shared`) and is consumed as raw TypeScript via
`transpilePackages` — no build step, no `dist/` to stale out. Turborepo was
skipped; plain npm workspaces is enough for four packages.

**Content moved from TypeScript modules into Postgres.** "เพิ่มลดน้ำหอม /
เพิ่มข่าวสาร" is not possible while products are a hard-coded array. Bilingual
fields are paired `_en`/`_th` columns rather than jsonb so the admin form maps
1:1 to columns. Sizes are a separate `product_sizes` table because prices change
independently of copy.

**The old arrays became seed data, not dead code.** `packages/shared/src/seed/`
feeds `npm run seed` *and* acts as the storefront's fallback when Supabase env
vars are missing — so `npm run build` and `npm run dev` work before any account
exists. That property is what let the whole thing be written and verified
without provisioning anything.

**Guest checkout before customer accounts.** Reordered from the original plan:
customer auth is not a prerequisite for taking money, and Google/LINE console
setup is the slowest part of the project. Orders record the buyer's email so
they can be back-filled onto accounts later.

**Checkout re-prices server-side.** `/api/checkout/session` reads the catalogue
from the DB and rebuilds every line item; the request body only chooses *what*
to buy. Shipping is recomputed from the carrier id. The client cannot influence
any amount.

**Webhook idempotency via a status guard**, not a processed-events table: the
paid transition carries `.eq('status', 'pending_payment')`, so a duplicate or
out-of-order delivery is a no-op. Email failures are swallowed — a non-2xx makes
Stripe retry the entire handler.

**Dashboard uses the anon key, never service_role.** Every query runs as the
signed-in admin so RLS is the real boundary. `is_admin()` is SECURITY DEFINER
to avoid recursing through `profiles` RLS. service_role is used in exactly two
places: the checkout API and the Stripe webhook.

**Content edits reach the storefront via on-demand ISR.** Product/journal pages
are `revalidate = 3600`; each dashboard save also POSTs to
`/api/revalidate` with a shared bearer secret. The ping is non-fatal — the row
is already saved and the hourly revalidate is the backstop.

**Cart is cleared on `/checkout/success`, not on redirect to Stripe** — an
abandoned payment must leave the cart intact.

**No charting library.** The dashboard chart is ~30 CSS divs. Not worth a
dependency.
