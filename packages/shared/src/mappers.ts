import type { Database } from './types/database'
import type {
  AdminJournalEntry,
  AdminProduct,
  JournalEntry,
  Product,
  ProductStatus,
} from './types/product'
import type { Carrier, Order, OrderStatus, PaymentMethod } from './types/order'
import type { Profile, UserRole } from './types/user'

type Row<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type ProductRowWithSizes = Row<'products'> & {
  product_sizes: Row<'product_sizes'>[] | null
}

/**
 * Fold a `products` row plus its joined `product_sizes` into the flat, bilingual
 * `Product` shape the storefront components already expect.
 */
export function mapProductRow(row: ProductRowWithSizes): AdminProduct {
  const sizes = [...(row.product_sizes ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order || b.ml - a.ml)
    .map((s) => ({ ml: s.ml, price: s.price }))

  return {
    id: row.id,
    name: row.name,
    number: row.number,
    tagline: { en: row.tagline_en, th: row.tagline_th },
    family: { en: row.family_en, th: row.family_th },
    story: { en: row.story_en, th: row.story_th },
    notes: {
      top: row.notes_top ?? [],
      heart: row.notes_heart ?? [],
      base: row.notes_base ?? [],
    },
    sizes,
    status: row.status as ProductStatus,
    hue: row.hue,
    image_url: row.image_url,
    published: row.published,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

/** Inverse of `mapProductRow` — used by the admin editor when saving. */
export function toProductRow(
  product: Pick<
    AdminProduct,
    | 'id'
    | 'name'
    | 'number'
    | 'tagline'
    | 'family'
    | 'story'
    | 'notes'
    | 'status'
    | 'hue'
    | 'image_url'
    | 'published'
    | 'sort_order'
  >
): Database['public']['Tables']['products']['Insert'] {
  return {
    id: product.id,
    name: product.name,
    number: product.number,
    tagline_en: product.tagline.en,
    tagline_th: product.tagline.th,
    family_en: product.family.en,
    family_th: product.family.th,
    story_en: product.story.en,
    story_th: product.story.th,
    notes_top: product.notes.top,
    notes_heart: product.notes.heart,
    notes_base: product.notes.base,
    status: product.status,
    hue: product.hue,
    image_url: product.image_url,
    published: product.published,
    sort_order: product.sort_order,
  }
}

export function mapJournalRow(row: Row<'journal_entries'>): AdminJournalEntry {
  const entry: AdminJournalEntry = {
    id: row.id,
    slug: row.slug,
    number: row.number,
    date: row.date,
    title: { en: row.title_en, th: row.title_th },
    excerpt: { en: row.excerpt_en, th: row.excerpt_th },
    body: { en: row.body_en, th: row.body_th },
    readtime: row.readtime,
    published: row.published,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
  if (row.body2_en || row.body2_th) {
    entry.body2 = { en: row.body2_en ?? '', th: row.body2_th ?? '' }
  }
  return entry
}

export function toJournalRow(
  entry: Pick<
    AdminJournalEntry,
    | 'id'
    | 'slug'
    | 'number'
    | 'date'
    | 'title'
    | 'excerpt'
    | 'body'
    | 'body2'
    | 'readtime'
    | 'published'
  >
): Database['public']['Tables']['journal_entries']['Insert'] {
  return {
    id: entry.id,
    slug: entry.slug,
    number: entry.number,
    date: entry.date,
    title_en: entry.title.en,
    title_th: entry.title.th,
    excerpt_en: entry.excerpt.en,
    excerpt_th: entry.excerpt.th,
    body_en: entry.body.en,
    body_th: entry.body.th,
    body2_en: entry.body2?.en ?? null,
    body2_th: entry.body2?.th ?? null,
    readtime: entry.readtime,
    published: entry.published,
  }
}

export function mapOrderRow(row: Row<'orders'>): Order {
  return {
    ...row,
    status: row.status as OrderStatus,
    payment_method: row.payment_method as PaymentMethod | null,
    carrier: row.carrier as Carrier | null,
  }
}

export function mapProfileRow(row: Row<'profiles'>): Profile {
  return {
    ...row,
    preferred_lang: row.preferred_lang === 'th' ? 'th' : 'en',
    role: row.role as UserRole,
  }
}

/** Strip admin-only fields so storefront props stay lean. */
export function toPublicProduct(p: AdminProduct): Product {
  const { published: _p, sort_order: _s, created_at: _c, updated_at: _u, ...rest } = p
  return rest
}

export function toPublicJournal(j: AdminJournalEntry): JournalEntry {
  const { published: _p, created_at: _c, updated_at: _u, ...rest } = j
  return rest
}
