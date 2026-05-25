# ORDI — Project Structure & Architecture

## 1. Current State (Prototype)

### Tech Stack
| Layer | Current |
|---|---|
| Runtime | Static HTML served from disk / any file server |
| Framework | React 18 via CDN (unpkg), JSX transpiled in-browser by Babel standalone |
| Styling | Single `styles.css` — custom design tokens, no utility framework |
| Data | `data.js` — hardcoded `window.ORDI_DATA` global (products, UI strings, journal) |
| Routing | Custom `screen` state + `switch` in `app.jsx` (no URL updates, no browser history) |
| State | React Context (`AppContext`) — cart, wishlist, language, screen |
| Images | Custom `<image-slot>` web component (placeholder system for editorial photos) |
| i18n | Inline bilingual objects in data (`{ en: "...", th: "..." }`) |

### What's Already Designed (UI-complete Screens)
- **Home** — hero poster, marquee, collection grid, SKIN SCENT tease, press quotes, journal preview
- **Shop** — filterable product table (all / in-stock / coming-soon)
- **Product detail** — olfactive pyramid, size selector, wishlist, companion products
- **Cart** — drawer (slide-in) + full cart page
- **Checkout** — 3-step flow: Contact → Shipping → Payment
  - Carriers: Thai Post (฿50), Kerry Express (฿80), studio pickup (free)
  - Payment methods: credit/debit card, PromptPay QR, bank transfer (SCB, Kasikorn)
- **About** — studio story, values, process timeline, founders
- **Journal** — editorial feature + archive list
- **Account** — sign-in/sign-up, member dashboard (orders, wishlist, tier progress, address)
- **Membership** — 3-tier system (Ordinary → Ous → Out of Ordinary)

### Prototype Limitations (Gaps Before Launch)
- Cart and wishlist are lost on page reload (no persistence)
- No real URLs — browser Back button doesn't work, pages aren't shareable or indexable
- No server — checkout flow submits to nothing
- No payment processing
- No inventory tracking (status is hardcoded)
- No order management or admin panel
- No email notifications (order confirmation, shipping updates)
- No actual authentication
- Babel standalone (~8 MB) parsed on every load — unacceptable for production
- No image optimization or lazy loading

---

## 2. Frontend Framework Recommendation

### Should you migrate from CDN React?

**Yes — before launch, not after.** The current CDN + Babel-standalone setup is excellent for rapid prototyping (zero build tooling, instant edits) but has hard limits in production:

| Issue | Impact |
|---|---|
| Babel in browser | ~8 MB parse cost on first load; no caching advantage |
| No bundler | No tree-shaking, code splitting, or asset hashing |
| No SSR/SSG | Product and journal pages won't be indexed by Google — fatal for a brand building organic discovery |
| No real routing | URLs don't exist; links can't be shared; browser history broken |
| No image pipeline | No WebP conversion, lazy loading, or `srcset` |

### Recommended: Next.js (App Router)

Next.js is the right choice specifically because ORDI is a content-and-commerce brand:

- **SSG for product pages** (`/shop/good-boy`, `/shop/hot-dilf`) — crawlable, fast, no server cost
- **SSR for cart/checkout** — always fresh, no stale data
- **API Routes** — lightweight backend endpoints in the same repo (order creation, webhook handling)
- **`next/image`** — automatic WebP, lazy loading, blur placeholders for editorial bottle photography
- **Built-in routing** — file-based, handles `/th/shop` locale prefix cleanly
- **Incremental Static Regeneration** — journal posts rebuild without a full deploy

The existing React components (`Nav`, `Footer`, `CartDrawer`, `ProductScreen`, etc.) are standard React and port to Next.js with minimal changes — mostly renaming files and adding `"use client"` where needed.

**Alternative: Vite + React SPA** — simpler DX, but loses SSR/SEO. Not recommended for a brand whose growth depends on organic search ("niche perfume Bangkok", "ORDI good boy fragrance").

---

## 3. Backend Architecture

### Recommended Stack (Pragmatic for a 2-person Studio)

```
┌──────────────────────────────────────────────────────────┐
│  Next.js (App Router)                                    │
│  ├── /app/(storefront)   — SSG product + shop pages      │
│  ├── /app/journal        — SSG journal posts             │
│  ├── /app/account        — SSR member dashboard          │
│  ├── /app/checkout       — SSR checkout flow             │
│  └── /app/api            — API routes (orders, webhooks) │
└───────────────────┬──────────────────────────────────────┘
                    │
        ┌───────────┴──────────────┐
        │                          │
   Supabase                   Opn Payments (Omise)
   (PostgreSQL + Auth          (PromptPay QR, cards,
    + Storage + Realtime)       bank transfer for TH)
        │
   ┌────┴──────────────────┐
   │  Sanity (optional CMS) │
   │  for Journal posts     │
   └───────────────────────┘
```

#### Why Supabase?
- PostgreSQL with a generous free tier — right for a brand starting out
- Built-in auth (email/password, Google OAuth, LINE OAuth — both already in the UI)
- Row-level security handles member-only data cleanly
- Realtime subscriptions for order status updates (future)
- Storage bucket for product images

#### Why Opn Payments (formerly Omise)?
- Best Thai payment gateway for PromptPay QR, bank transfer (SCB, Kasikorn), and international cards
- Well-documented Node.js SDK
- Webhooks for async payment confirmation (critical for PromptPay — customer pays, webhook triggers order fulfillment)
- Handles Thai VAT receipts

---

## 4. Data Models

### Products
```sql
products (
  id          text PRIMARY KEY,       -- "good-boy"
  name        text,                   -- "GOOD BOY"
  number      text,                   -- "N°01"
  status      text,                   -- "available" | "coming-soon" | "sold-out"
  hue         text,                   -- brand color swatch "#EFEAE0"
  tagline_en  text,
  tagline_th  text,
  family_en   text,
  family_th   text,
  story_en    text,
  story_th    text,
  notes_top   text[],
  notes_heart text[],
  notes_base  text[],
  created_at  timestamptz
)

product_sizes (
  id          uuid PRIMARY KEY,
  product_id  text REFERENCES products,
  ml          int,                    -- 50 | 12
  price       int,                    -- THB, no decimals
  stock       int DEFAULT 0
)
```

### Orders
```sql
orders (
  id              text PRIMARY KEY,   -- "ORDI-48201"
  user_id         uuid REFERENCES auth.users,
  email           text,               -- guest checkout support
  status          text,               -- "pending_payment" | "paid" | "processing" | "shipped" | "delivered"
  carrier         text,               -- "thai-post" | "kerry" | "pickup"
  shipping_cost   int,
  payment_method  text,               -- "card" | "promptpay" | "transfer"
  payment_ref     text,               -- Opn charge ID
  total           int,
  currency        text DEFAULT 'THB',
  tracking_number text,
  created_at      timestamptz,
  shipped_at      timestamptz
)

order_items (
  id          uuid PRIMARY KEY,
  order_id    text REFERENCES orders,
  product_id  text REFERENCES products,
  size_ml     int,
  qty         int,
  unit_price  int
)

shipping_addresses (
  id          uuid PRIMARY KEY,
  order_id    text REFERENCES orders,
  first_name  text,
  last_name   text,
  phone       text,
  address     text,
  district    text,
  province    text,
  postcode    text,
  country     text DEFAULT 'TH'
)
```

### Members & Membership Tiers
```sql
-- Supabase auth.users handles identity

profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users,
  first_name      text,
  last_name       text,
  phone           text,
  preferred_lang  text DEFAULT 'en',
  created_at      timestamptz
)

-- Tier is computed, not stored: count completed orders
-- Ordinary:        0+ orders
-- Ous:             3+ orders
-- Out of Ordinary: invited by admin (boolean flag)

member_tiers (
  user_id         uuid PRIMARY KEY REFERENCES auth.users,
  is_invited      bool DEFAULT false,   -- "Out of Ordinary" gating
  updated_at      timestamptz
)
```

### Wishlist & Newsletter
```sql
wishlists (
  user_id     uuid REFERENCES auth.users,
  product_id  text REFERENCES products,
  PRIMARY KEY (user_id, product_id)
)

newsletter_subscribers (
  email       text PRIMARY KEY,
  lang        text DEFAULT 'en',
  subscribed_at timestamptz,
  active      bool DEFAULT true
)
```

### Journal (if not using a CMS)
```sql
journal_posts (
  id          text PRIMARY KEY,       -- "j01"
  number      text,                   -- "JRN.001"
  published_at date,
  title_en    text,
  title_th    text,
  excerpt_en  text,
  excerpt_th  text,
  body_en     text,                   -- markdown or HTML
  body_th     text,
  read_minutes int,
  cover_image text                    -- Supabase Storage URL
)
```

---

## 5. API Endpoints (Next.js API Routes)

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/cart/sync` | Merge guest cart into user cart on sign-in |
| `POST` | `/api/orders` | Create order, initiate payment charge |
| `POST` | `/api/orders/[id]/confirm` | Called by Opn webhook on payment success |
| `GET` | `/api/orders/[id]` | Poll order status (for PromptPay pending state) |
| `POST` | `/api/newsletter` | Subscribe email |
| `POST` | `/api/waitlist` | Notify-me for coming-soon products |
| `GET` | `/api/products` | Revalidation endpoint for ISR |

---

## 6. Thai-Specific Integrations

| Concern | Solution |
|---|---|
| PromptPay QR | Opn Payments — generates QR, webhook confirms payment |
| Bank transfer | Manual confirmation OR Opn's bank transfer charge type |
| Kerry Express | Kerry API for tracking number generation and webhook |
| Thai Post | EMS API (or manual label printing for small volumes) |
| VAT 7% | Compute at order level; Opn supports Thai tax receipt |
| Address format | Province / District / Sub-district / Postcode (standard TH) |
| LINE Login | `next-auth` with LINE provider — already shown in UI |
| Currency | THB only for now; Stripe or Opn for future USD/international |

---

## 7. Migration Path (Prototype → Production)

1. **Init Next.js project** — copy existing component files into `app/` and `components/`
2. **Add `"use client"`** to interactive components (`CartDrawer`, `ProductScreen`, etc.)
3. **Move `data.js`** to a Supabase seed + typed TypeScript module
4. **Implement real routing** — file-based pages replace the `switch` in `app.jsx`
5. **Connect Supabase auth** — replace the mock `setSigned(true)` sign-in
6. **Integrate Opn Payments** — checkout step 3 now creates a real charge
7. **Set up webhooks** — Opn → `/api/orders/[id]/confirm` → update order status → send email
8. **Admin view** — simplest option: Supabase Studio dashboard for order management; build a `/admin` route later

---

## 8. Hosting

| Service | Role |
|---|---|
| Vercel | Next.js hosting — zero-config, serverless functions, preview deploys |
| Supabase | Database, auth, file storage |
| Cloudflare | DNS, CDN, DDoS protection |
| Brevo (Sendinblue) | Transactional email (order confirmations, shipping updates) — good TH deliverability |

---

## 9. What to Keep From the Current Prototype

- All component logic and layout — it's production-quality UI code
- The bilingual data structure (`{ en, th }`) — maps cleanly to DB columns
- The `useApp()` context pattern — becomes a Zustand store or React Context with server hydration
- The CSS design tokens in `styles.css` — move as-is into `globals.css`
- The tweaks panel — useful to keep in dev/staging as a design QA tool, strip from prod build
- The `image-slot` web component — replace with `next/image` and real photography
