export type Lang = 'en' | 'th'

export type Bilingual = { en: string; th: string }

export type ProductStatus = 'available' | 'coming-soon' | 'sold-out'

export type ProductSize = {
  ml: number
  price: number
}

export type ProductNotes = {
  top: string[]
  heart: string[]
  base: string[]
}

/**
 * The shape consumed by every storefront view. Rows from `products` +
 * `product_sizes` are folded into this by `mapProductRow()` so UI code never
 * has to know about the relational layout.
 */
export type Product = {
  id: string
  name: string
  number: string
  tagline: Bilingual
  family: Bilingual
  story: Bilingual
  notes: ProductNotes
  sizes: ProductSize[]
  status: ProductStatus
  hue: string
  /** Remote/uploaded art. Null falls back to the bundled photography. */
  image_url: string | null
  /** Spotlit above the collection grid on the home page. At most one is true. */
  featured: boolean
}

/** Product plus the editorial fields only the admin dashboard cares about. */
export type AdminProduct = Product & {
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type JournalEntry = {
  id: string
  slug: string
  number: string
  date: string
  title: Bilingual
  excerpt: Bilingual
  body: Bilingual
  body2?: Bilingual
  readtime: string
}

export type AdminJournalEntry = JournalEntry & {
  published: boolean
  created_at: string
  updated_at: string
}
