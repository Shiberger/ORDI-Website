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
- **Real e-commerce flows** — product catalog, cart + wishlist (persisted), and a multi-step checkout, all driven by typed product data.
- **Responsive** — desktop gallery layout collapses gracefully into a mobile card list and slide-in menu.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Language | **TypeScript** (`strict: true`) |
| UI | **React 19** |
| Animation | **GSAP 3** + `@gsap/react` (ScrollTrigger, Timeline) |
| Styling | Plain CSS with a custom token system (`.ordi-*`) |
| Hosting | **Vercel** |

### Designed for (roadmap)
Supabase (Auth + Postgres) · Stripe Checkout · Resend transactional email · LINE / Google OAuth · social order channels (LINE, Instagram, Shopee, TikTok).

---

## 🏗 Architecture

```
ORDI-Website/
├── front-end/                 # Next.js app (all npm commands run here)
│   ├── app/                   # App Router pages (Home, Shop, Product, About, Journal, …)
│   │   ├── shop/[slug]/       # Product detail — SSG via generateStaticParams + generateMetadata
│   │   ├── layout.tsx         # Root layout: Nav + Footer + AppProvider
│   │   ├── globals.css        # Full design system
│   │   ├── sitemap.ts / robots.ts
│   ├── components/            # layout/ · product/ · ui/
│   ├── lib/
│   │   ├── data/              # products.ts, journal.ts, ui-strings.ts (typed content)
│   │   ├── context/           # AppContext — cart, wishlist, language, drawer
│   │   └── utils.ts           # cn(), formatPrice(), isDarkHue()
│   └── types/                 # product.ts, order.ts, user.ts
└── back-end/                  # Reserved for future server-side code
```

**Notable engineering decisions:**

- **Server/client split** — product pages use a server-component wrapper for `generateStaticParams` + `generateMetadata`, delegating interactive UI to a `ProductDetail` client component.
- **Per-route metadata** — since interactive pages can't export `metadata`, SEO lives in sibling `layout.tsx` server components.
- **Content as typed data** — the 5-fragrance catalog (N°01–N°05) lives in TypeScript modules, fully typed end-to-end, ready to swap for a CMS or database later.

---

## 🌸 The Collection

| | Fragrance | Family |
|---|---|---|
| N°01 | **GOOD BOY** | Citrus Gourmand · Soft Musk |
| N°02 | **HOT DILF** | Dark Gourmand · Boozy Woody |
| N°03 | **SEA BREEZE** | Floral Woody · Airy |
| N°04 | **DROWNING LOVE** | Woody · Amber · Floral |
| N°05 | **PHIWFON** *(coming soon)* | Atmospheric Musk · Skin Scent |

Each scent is an Eau de Parfum hand-bottled in small batches, offered in 50ml and 12ml.

---

## 🚀 Getting Started

All commands run from the `front-end/` directory.

```bash
cd front-end
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build (static pages prerendered)
npm run start      # serve the production build
npm run lint       # eslint
npm run type-check # tsc --noEmit
```

---

## 📌 Project Status

The site is **live and deployed**. The current build covers the full front-end experience — catalog, bilingual content, animation, cart/wishlist, and a mock checkout flow. Authentication, payments, and email are scoped and ready to integrate as the next phases.

---

*Designed and built as a portfolio piece — an exercise in editorial web design, Next.js architecture, and bilingual content systems.*
