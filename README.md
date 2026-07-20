# ORDI — Niche Perfume E-Commerce

> **Out of Ordinary, Only Ous** — an editorial, gallery-like storefront for a small Bangkok-based perfume studio.

**🔗 Live demo:** **[ordi-website-skfn.vercel.app](https://ordi-website-skfn.vercel.app/)**

ORDI is a bilingual (English / Thai) brand portfolio and premium order channel for a niche fragrance house. The design language is monochrome, typographic, and quiet — built to feel less like a store and more like a printed lookbook that happens to sell perfume.

---

## ✨ Highlights

- **Editorial design system** — custom CSS tokens (paper/ink palette, Satoshi + Geist Mono type pairing), no UI framework. Every spacing and color value is intentional.
- **Fully bilingual (EN / TH)** — runtime language switching backed by `localStorage`, with all copy living in typed translation dictionaries.
- **GSAP-powered motion** — smooth scrolling and scroll-triggered reveal animations that respect `prefers-reduced-motion`.
- **SEO-first architecture** — static generation, per-route metadata, OpenGraph/Twitter cards, `sitemap.ts`, and `robots.ts`.
- **Real payments** — Stripe Checkout with guest ordering, server-side re-pricing, webhook-driven order state, and Resend confirmation emails.
- **A studio dashboard** — a second Next.js app for orders, fulfilment, sales analytics, and bilingual product/journal editing, with content changes purging the storefront's static pages on demand.
- **Responsive** — desktop gallery layout collapses gracefully into a mobile card list and slide-in menu.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Repo | **npm workspaces** — 2 Next.js apps + 1 shared package |
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** (`strict: true`) |
| UI | **React 19** |
| Animation | **GSAP 3** + `@gsap/react` (ScrollTrigger, Timeline) |
| Styling | Plain CSS with a custom token system (`.ordi-*`) |
| Database | **Supabase** Postgres + Row Level Security |
| Auth | **Supabase Auth** (dashboard today, customer OAuth next) |
| Payments | **Stripe Checkout** (hosted, guest checkout) |
| Email | **Resend** transactional |
| Hosting | **Vercel** — two projects from one repo |

---

## 🏗 Architecture

```
ORDI-Website/                  # npm workspaces root — run every command here
├── front-end/                 # ordi-web · the storefront            :3000
│   ├── app/                   # Home, Shop, Product, Journal, Cart, Checkout
│   │   ├── shop/[slug]/       # SSG + ISR, sourced from Supabase
│   │   └── api/               # checkout session · stripe webhook · revalidate
│   ├── components/            # layout/ · product/ · journal/ · checkout/ · ui/
│   ├── lib/                   # catalog · stripe · email · shipping · context
│   └── types/                 # thin re-exports of @ordi/shared
│
├── admin/                     # ordi-admin · the studio dashboard     :3001
│   ├── app/(dashboard)/       # sales · orders · products · journal
│   ├── components/            # sidebar, editors, stat cards, chart
│   └── lib/                   # supabase SSR clients · auth gate · server actions
│
├── packages/shared/           # @ordi/shared — the contract between the apps
│   └── src/                   # types · queries · mappers · seed · utils
│
└── back-end/                  # ordi-backend
    ├── supabase/migrations/   # schema, RLS, roles
    └── scripts/               # seed.ts · make-admin.ts
```

**Notable engineering decisions:**

- **Two apps, one database.** The dashboard is a separate Next.js app rather
  than an `/admin` route — its code never enters the customer bundle, the two
  deploy independently, and an admin bug can't take the shop down.
- **Shared package ships raw TypeScript.** `@ordi/shared` is consumed through
  `transpilePackages`, so there's no build step and no stale `dist/`.
- **Content lives in Postgres, edited in-house.** Products and journal entries
  moved out of TypeScript modules into Supabase so the studio can add a
  fragrance without a deploy. Storefront pages are statically generated and
  purged on demand when the dashboard saves.
- **Checkout re-prices server-side.** The request body chooses *what* to buy;
  every amount is rebuilt from the database. Shipping is derived from the
  carrier id, never trusted from the client.
- **RLS is the security boundary.** The dashboard uses the anon key so every
  query runs as the signed-in admin. The `service_role` key appears in exactly
  two places: the checkout API and the Stripe webhook.
- **Works before it's provisioned.** With no Supabase credentials the storefront
  falls back to a bundled seed catalogue, so `npm run build` and `npm run dev`
  succeed on a fresh clone.

---

## 🌸 The Collection

| | Fragrance | Family |
|---|---|---|
| N°01 | **GOOD BOY** | Citrus Gourmand · Soft Musk |
| N°02 | **HOT DILF** | Dark Gourmand · Boozy Woody |
| N°03 | **SEA BREEZE** | Floral Woody · Airy |
| N°04 | **DROWNING LOVE** | Woody · Amber · Floral |
| N°05 | **CLOUD FON** *(coming soon)* | Atmospheric Musk · Skin Scent |

Each scent is an Eau de Parfum hand-bottled in small batches, offered in 50ml and 12ml.

---

## 🚀 Getting Started

All commands run from the repository root.

```bash
npm install
npm run dev          # storefront  → http://localhost:3000
npm run dev:admin    # dashboard   → http://localhost:3001
```

```bash
npm run build:all    # build both apps
npm run type-check   # tsc across every workspace
npm run lint         # eslint
```

Without a `.env.local` the storefront runs on its bundled seed catalogue and
checkout is disabled — enough to develop the UI. To wire up the real thing:

```bash
cp front-end/.env.example front-end/.env.local
cp admin/.env.example admin/.env.local

# after creating a Supabase project and running back-end/supabase/migrations/
npm run seed                         # load the catalogue into Postgres
npm run make-admin -- you@email.com  # grant yourself dashboard access
```

The full step-by-step is in **`Project-dev.md` → Setup Runbook**.

---

## 📌 Project Status

The site is **live and deployed**. The storefront, Stripe guest checkout, and the studio dashboard (orders, sales analytics, product and journal editing) are all built and type-checked. Customer accounts with Google / LINE OAuth are the next phase. See `Project-dev.md` for phase-by-phase status.

---

*Designed and built as a portfolio piece — an exercise in editorial web design, Next.js architecture, and bilingual content systems.*
