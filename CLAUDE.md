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
| Repo | npm workspaces | Two apps + one shared package, no Turborepo overhead |
| Framework | Next.js 15 (App Router) | SSG for SEO, file routing, API routes |
| Language | TypeScript | Type safety for products, orders, schemas |
| Styling | Plain CSS (existing tokens) | Already designed, no Tailwind needed |
| Database | Supabase PostgreSQL | Free tier, RLS, integrated auth |
| Auth | Supabase Auth | Admins now; customer OAuth in Phase 5 |
| Payment | Stripe Checkout (hosted) | International cards, no PCI burden |
| CMS | The `admin/` dashboard | Products + journal live in Postgres, edited in-house |
| Images | next/image + Supabase Storage | Brand art ships in the bundle as WebP; product shots upload from the dashboard |
| Email | Resend (transactional) | Good Thai deliverability |
| Hosting | Vercel (4 projects) | prod + dev of each app, from one repo |
| Domain | Vercel Registrar | Bought where it is served — no DNS records to keep in sync |

### What we are NOT using (yet)
- ❌ Bank transfer (PromptPay is a Stripe Dashboard toggle when wanted)
- ❌ Kerry / Thai Post API integration (manual labels for now)
- ❌ Sanity or other third-party CMS (the admin dashboard replaces it)
- ❌ Inventory management (manual stock tracking)
- ❌ Customer accounts / OAuth (Phase 5 — guest checkout ships first)
- ❌ Tailwind / shadcn (existing CSS works)
- ❌ Turborepo (plain npm workspaces is enough at this size)

---

## 3. Project Structure

An npm workspaces monorepo with four workspaces: two deployable Next.js apps
(`front-end/` storefront, `admin/` dashboard), one shared library
(`packages/shared/`) holding the domain types and every Supabase query, and
`back-end/` for SQL migrations and operational scripts. Both apps talk to the
same Supabase project; `@ordi/shared` is the only code they have in common.

```
ORDI-Website/                     # npm workspaces root — run every command from here
├── front-end/                    # ordi-web · storefront (port 3000)
│   ├── app/
│   │   ├── page.tsx              # Home
│   │   ├── shop/
│   │   │   ├── page.tsx          # Shop listing
│   │   │   ├── layout.tsx        # Per-route metadata
│   │   │   └── [slug]/page.tsx   # Product detail (SSG + ISR from Supabase)
│   │   ├── about/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── journal/[slug]/page.tsx
│   │   ├── membership/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx             # 3-step flow → Stripe Checkout
│   │   ├── checkout/success/page.tsx     # Post-payment receipt
│   │   ├── account/page.tsx              # Mock until Phase 5 (customer auth)
│   │   ├── api/
│   │   │   ├── checkout/session/route.ts # Creates order + Stripe session
│   │   │   ├── webhooks/stripe/route.ts  # paid / expired / refunded
│   │   │   └── revalidate/route.ts       # Called by the admin dashboard
│   │   ├── layout.tsx            # Root layout — fetches the catalogue
│   │   ├── globals.css
│   │   ├── sitemap.ts / robots.ts / not-found.tsx
│   │
│   ├── components/
│   │   ├── layout/               # Nav, Footer, CartDrawer, MobileMenu
│   │   ├── product/              # ProductDetail
│   │   ├── journal/              # JournalArticle
│   │   ├── checkout/             # ClearCartOnMount
│   │   └── ui/                   # MonoTag, SectionHead, Marquee, BottleSlot
│   │
│   ├── lib/
│   │   ├── stripe/server.ts      # Lazy Stripe client
│   │   ├── email/                # Resend order confirmation
│   │   ├── data/catalog.ts       # Supabase reads + seed fallback
│   │   ├── data/ui-strings.ts    # EN/TH dictionaries
│   │   ├── data/product-images.ts
│   │   ├── context/AppContext.tsx
│   │   ├── shipping.ts           # Server-authoritative carrier rates
│   │   └── utils.ts
│   │
│   ├── types/                    # Thin re-exports of @ordi/shared
│   └── _legacy/                  # Frozen Phase 0 prototype
│
├── admin/                        # ordi-admin · dashboard (port 3001)
│   ├── app/
│   │   ├── login/page.tsx        # Email + password (Supabase Auth)
│   │   ├── auth/signout/route.ts
│   │   └── (dashboard)/
│   │       ├── layout.tsx        # requireAdmin() gate + sidebar
│   │       ├── page.tsx          # Sales stats, chart, best sellers
│   │       ├── orders/           # List, filters, detail, fulfilment
│   │       ├── products/         # List, create, edit, delete
│   │       └── journal/          # List, create, edit, delete
│   ├── components/               # Sidebar, forms, StatCard, RevenueChart
│   ├── lib/
│   │   ├── supabase/             # Cookie-backed SSR clients
│   │   ├── auth.ts               # requireAdmin()
│   │   ├── actions/              # Server actions (orders, products, journal)
│   │   └── revalidate.ts         # Pings the storefront after a content edit
│   └── middleware.ts             # Session refresh + anonymous redirect
│
├── packages/shared/              # @ordi/shared · the contract between the apps
│   └── src/
│       ├── types/                # product, order, user, database
│       ├── queries/              # products, journal, orders, stats
│       ├── seed/                 # Original catalogue (seed + offline fallback)
│       ├── mappers.ts            # DB rows ⇄ domain types
│       ├── supabase.ts           # createAdminClient / createPublicClient
│       └── utils.ts              # formatPrice, generateOrderId, slugify…
│
├── back-end/                     # ordi-backend · SQL + operational scripts
│   ├── supabase/migrations/      # 0001_core_schema, 0002_content_schema
│   └── scripts/                  # seed.ts, make-admin.ts
│
├── package.json                  # Workspaces + top-level scripts
├── CLAUDE.md / Project-dev.md / README.md
└── .gitignore
```

**Working directory note:** this is an npm workspaces monorepo. Run everything
from the repo root:

| Command | What it does |
|---|---|
| `npm install` | Installs all workspaces |
| `npm run dev` | Storefront on :3000 |
| `npm run dev:admin` | Dashboard on :3001 |
| `npm run build:all` | Builds both apps |
| `npm run type-check` | tsc across every workspace |
| `npm run seed` | Pushes the seed catalogue into Supabase |
| `npm run make-admin -- you@email.com` | Grants dashboard access |

`@ordi/shared` ships raw TypeScript and is compiled by each app through
`transpilePackages` — there is no build step to remember.

---

## 4. Routing Map

### Storefront — `front-end/` (ordibkk.com)

| URL | Purpose | Render |
|---|---|---|
| `/` | Home | SSG |
| `/shop` | Product listing | SSG |
| `/shop/[slug]` | Product detail | SSG + ISR (1h, on-demand) |
| `/about` | Brand story | SSG |
| `/journal` | Journal index | SSG |
| `/journal/[slug]` | Journal post | SSG + ISR (1h, on-demand) |
| `/membership` | Tier overview | SSG |
| `/cart` | Cart page | CSR |
| `/checkout` | 3-step checkout → Stripe | CSR |
| `/checkout/success` | Post-payment receipt | SSR (dynamic) |
| `/account` | Member dashboard | CSR (mock until Phase 5) |
| `/api/checkout/session` | Creates the order + Stripe session | Route handler |
| `/api/webhooks/stripe` | Payment lifecycle | Route handler |
| `/api/revalidate` | Bearer-token ISR purge | Route handler |

### Dashboard — `admin/` (admin.ordibkk.com)

| URL | Purpose |
|---|---|
| `/login` | Email + password sign-in |
| `/` | Revenue, AOV, unshipped count, 30-day chart, best sellers |
| `/orders` | Filter by status, search by id/email, paginated |
| `/orders/[id]` | Items, address, timeline, status + tracking editor |
| `/products` | Catalogue list with publish state |
| `/products/new`, `/products/[id]` | Bilingual editor with sizes/pricing |
| `/journal` | Entry list |
| `/journal/new`, `/journal/[id]` | Bilingual article editor |

Every dashboard route below `(dashboard)/` runs `requireAdmin()`; middleware
additionally bounces anonymous visitors to `/login`.

### Locale Strategy
- Default locale: `en`, secondary `th`
- Client-side switch via React Context + localStorage (no URL prefix)
- UI chrome lives in `lib/data/ui-strings.ts`; product and journal copy is
  stored bilingually in Supabase and edited from the dashboard

---

## 5. Database Schema (Supabase)

**Source of truth: `back-end/supabase/migrations/`.** Run them in order in the
Supabase SQL Editor (or `supabase db push`). Do not hand-edit tables in the
Dashboard — add a migration instead.

| Migration | Contents |
|---|---|
| `0001_core_schema.sql` | `profiles` (with `role`), `orders`, `order_items`, `shipping_addresses`, `wishlists`, `newsletter_subscribers`, `member_tiers` view, `is_admin()`, signup trigger |
| `0002_content_schema.sql` | `products`, `product_sizes`, `journal_entries` + their RLS |
| `0003_product_featured.sql` | `products.featured` — the home-page spotlight flag |
| `0004_cloud_fon_launch.sql` | Data only — N°05 goes on sale, hue follows its art |
| `0005_product_image_storage.sql` | `product-images` bucket + its storage policies |

### Content tables

Product and journal copy used to live in `front-end/lib/data/*.ts`. It now lives
in Postgres so the dashboard can edit it. Bilingual fields are stored as paired
`_en` / `_th` columns (not jsonb) so admin forms map 1:1 to columns. Sizes are a
separate `product_sizes` table — a product's prices change independently of its
copy.

`packages/shared/src/seed/` still holds the original catalogue. It is used by
`npm run seed`, and as the storefront's fallback when Supabase env vars are
absent, so `npm run build` works before the project exists.

### Roles

`profiles.role` is one of `customer` (default) · `admin` · `owner`. The
`is_admin()` SECURITY DEFINER function backs every admin RLS policy — defined
that way so the lookup is not itself subject to `profiles` RLS, which would
recurse.

Grant access with:

```bash
npm run make-admin -- you@email.com          # owner
npm run make-admin -- teammate@email.com admin
```

The user must already exist in Supabase Auth.

### Who writes what

| Table | Anon read | Customer | Admin | service_role |
|---|---|---|---|---|
| `products` / `product_sizes` / `journal_entries` | published rows | — | full | full |
| `orders` / `order_items` / `shipping_addresses` | — | own rows (read) | full | insert + update |
| `profiles` | — | own row | read all, update all | full |
| `wishlists` | — | own rows | — | full |

Orders have **no INSERT policy** on purpose: only the checkout API and the
Stripe webhook write them, both using the service_role key. No browser client
can forge an order.

---

## 6. Authentication Flow

### Current state

| Who | Method | Status |
|---|---|---|
| Shoppers | **Guest checkout** — email only, no account | Live |
| Studio staff | Supabase Auth email + password, gated on `profiles.role` | Live |
| Shoppers | Email/password + Google + LINE OAuth | Phase 5 (not built) |

Guest checkout came first on purpose: it unblocks revenue without waiting on
Google Cloud and LINE Developers console setup. Orders store the buyer's email,
so when customer accounts land they can be back-filled by matching on it.

### Dashboard auth

```
middleware.ts        refreshes the session cookie; anonymous → /login
(dashboard)/layout   requireAdmin() → profiles.role must be admin|owner
Server actions       call requireAdmin() again — never trust the layout alone
RLS policies         is_admin() is the real enforcement boundary
```

`admin/lib/supabase/server.ts` uses `@supabase/ssr` with the **anon** key, so
every dashboard query runs as that admin and RLS applies. A compromised
dashboard session cannot exceed what its role allows.

### Phase 5 — customer accounts (planned)

**Google OAuth:** Google Cloud Console → OAuth 2.0 Client → redirect URI
`https://[project].supabase.co/auth/v1/callback` → Client ID + Secret into the
Supabase Dashboard.

**LINE OAuth:** LINE Developers Console → Provider + LINE Login channel → same
callback URL → scopes `profile`, `openid`, `email` → Channel ID + Secret into
Supabase.

Then: `/auth/login`, `/auth/register`, `/auth/callback`, a storefront
`middleware.ts` protecting `/account/*`, and cart/wishlist sync on sign-in.

---

## 7. Payment Flow (Stripe Checkout)

### Why Stripe Checkout (not Elements)
Hosted page = zero PCI scope, built-in fraud checks, automatic 3D Secure,
mobile-optimised, receipt emails included.

### Order lifecycle

```
1. Shopper completes /checkout (contact → shipping → review)
2. POST /api/checkout/session
     a. Re-prices every line from the catalogue — the request body only
        chooses *what* to buy, never *what it costs*
     b. Recomputes shipping from the carrier id (lib/shipping.ts)
     c. Generates ORDI-#####, inserts order + items + address
        (status: pending_payment)
     d. Creates the Stripe Checkout Session, stores stripe_session_id
     e. Returns { url }
3. Browser redirects to Stripe
4. Stripe → /checkout/success?session_id=…   (cart cleared here, not before)
5. Stripe → POST /api/webhooks/stripe
     checkout.session.completed → paid + paid_at + payment intent → Resend email
     checkout.session.expired   → cancelled
     charge.refunded            → refunded
```

### Rules that matter

- **Never trust posted prices.** The API rebuilds every line item from
  Supabase and rejects unknown or unavailable products.
- **The status guard is a `.eq('status', 'pending_payment')` on the update**, so
  a duplicate or out-of-order webhook delivery cannot re-transition a shipped
  order back to paid.
- **Email failures never fail the webhook.** A non-2xx makes Stripe retry the
  whole handler; a missed receipt is not worth that.
- **Payment methods come from the Stripe Dashboard**, not code. Enabling
  PromptPay is a Dashboard toggle, no deploy.
- If Stripe session creation fails, the just-created order is marked
  `cancelled` rather than left pending forever.

### Local webhook testing

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the whsec_… it prints into front-end/.env.local
stripe trigger checkout.session.completed
```

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### Production webhook

Stripe Dashboard → Developers → Webhooks → `https://ordibkk.com/api/webhooks/stripe`
with `checkout.session.completed`, `checkout.session.expired`,
`charge.refunded`. Copy the signing secret into Vercel env vars.

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

### Where each environment lives

Four Vercel projects, two Supabase projects. The split is deliberate: the
production database is only ever reachable from things named `ordi-web` /
`ordi-admin`, so "which environment am I looking at" is answerable from the URL
alone rather than by auditing env vars.

| Vercel project | Root | URL | Supabase | Stripe |
|---|---|---|---|---|
| `ordi-web` | `front-end/` | ordibkk.com | ordi-website (prod) | test until launch |
| `ordi-admin` | `admin/` | admin.ordibkk.com | ordi-website (prod) | — |
| `ordi-dev-web` | `front-end/` | ordi-dev-web.vercel.app | ordi-dev | test |
| `ordi-dev-admin` | `admin/` | ordi-dev-admin.vercel.app | ordi-dev | — |

`REVALIDATE_SECRET` is different per environment on purpose — a dev dashboard
must not be able to purge the production storefront's cache.

Vercel marks Production env vars **sensitive** by default, so `vercel env pull`
returns them empty. That is expected; it does not mean the value is missing.
Add them with `vercel env add KEY production --value …` — piping the value to
stdin silently stores an empty string.

`ordi-website-skfn` is the frozen Phase 0 demo. It has no env vars, runs off the
seed catalogue, and has been disconnected from GitHub so it never rebuilds.

### Local files

Two `.env.local` files, one per app. Templates live beside them as
`.env.example`. Never commit either.

### `front-end/.env.local`

```bash
# Supabase — falls back to the seed catalogue when absent
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx        # server-only; required for checkout

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Resend — optional; emails are skipped when unset
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=orders@ordibkk.com

# Shared with the dashboard — openssl rand -hex 32
REVALIDATE_SECRET=

# Social (Phase 6)
NEXT_PUBLIC_LINE_OA_ID=@ordi
NEXT_PUBLIC_INSTAGRAM_HANDLE=ordi.atelier
NEXT_PUBLIC_SHOPEE_SHOP=ordi
NEXT_PUBLIC_TIKTOK_HANDLE=ordi

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### `admin/.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

STOREFRONT_URL=http://localhost:3000
REVALIDATE_SECRET=                      # must match the storefront exactly
```

The dashboard deliberately has **no** service_role key: it reads and writes as
the signed-in admin so RLS — not application code — is what enforces access.

`back-end/` scripts reuse whichever `.env.local` they find first
(`back-end/` → `front-end/` → repo root).

---

## 10. Admin Dashboard

A second Next.js app in `admin/`, deployed as its own Vercel project pointed at
`admin.ordibkk.com`. It shares the Supabase project and `@ordi/shared` with the
storefront, and nothing else — dashboard code never ships in the customer
bundle.

### What it does

| Area | Capability |
|---|---|
| Dashboard | 30-day revenue, AOV, units, unpaid + unshipped counts, daily bar chart, best sellers |
| Orders | Filter by status, search by id/email, paginate; open an order to see items, address, payment ids and timeline |
| Fulfilment | Change status, set carrier + tracking number, leave an internal note |
| Products | Create, edit, delete; bilingual copy, notes, hue, image upload, publish toggle, featured toggle, sort order, per-size pricing |
| Journal | Create, edit, delete; bilingual title/excerpt/body, slug, publish toggle, auto read-time |

### Content → storefront propagation

Storefront product and journal pages are statically generated with
`revalidate = 3600`. On every save the dashboard also calls
`POST {STOREFRONT_URL}/api/revalidate` with a bearer `REVALIDATE_SECRET` and the
affected paths, so edits appear immediately instead of within the hour.

The call is deliberately **non-fatal**: the row is already committed and the
hourly revalidate is the backstop, so a failed ping logs and moves on rather
than turning a successful save into an error.

### Where images live

Two homes, split by who changes them — not by file type:

| Art | Home | Why |
|---|---|---|
| Brand + editorial (hero, journal, campaign plates) | `front-end/assets/**` as WebP, imported statically | Changes only with the design. Static imports give `next/image` build-time dimensions and a blur placeholder for free |
| Product photography | `product-images` bucket in Supabase Storage → `products.image_url` | The studio replaces a bottle shot from the dashboard without a deploy |

Uploads go browser → Storage directly (`uploadProductImage()` in `@ordi/shared`),
never through a server action, so an image never travels in a Next request body.
The bucket policies in migration 0005 are the access boundary.

`getProductImage()` prefers `image_url` and falls back to the bundled art, so a
fragrance with no upload still renders. Keep bundled art as WebP — the repo
carried 35 MB of PNG before the conversion and now carries 4 MB.

### Writing new dashboard features

- Server actions live in `admin/lib/actions/` and **must** call `requireAdmin()`
  first — the layout gate is not enough on its own.
- Query helpers belong in `packages/shared/src/queries/`, taking a
  `SupabaseClient<Database>` argument so both apps can reuse them.
- Never add `SUPABASE_SERVICE_ROLE_KEY` to the admin app. If a query needs it,
  that is a signal the RLS policy is wrong.

### Local development

```bash
npm run dev         # storefront  :3000
npm run dev:admin   # dashboard   :3001
```

---

## 11. Coding Conventions

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

## 12. Design Tokens (Existing — DO NOT CHANGE)

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

## 13. Migration Notes from Prototype

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

## 14. Quick Reference Links

- Supabase Docs: https://supabase.com/docs
- Next.js App Router: https://nextjs.org/docs/app
- Stripe Checkout: https://docs.stripe.com/payments/checkout
- LINE Login: https://developers.line.biz/en/docs/line-login/
- Resend + Next.js: https://resend.com/docs/send-with-nextjs
