import { mapProductRow, toProductRow, toPublicProduct } from '../mappers'
import type { AdminProduct, Product, ProductSize } from '../types/product'
import { unwrap, type DB } from './client'

const PRODUCT_SELECT = '*, product_sizes(*)'

/** Storefront catalog — published products only, in curated order. */
export async function getPublishedProducts(db: DB): Promise<Product[]> {
  const rows = unwrap(
    'getPublishedProducts',
    await db
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('published', true)
      .order('sort_order', { ascending: true })
  )
  return rows.map((r) => toPublicProduct(mapProductRow(r)))
}

export async function getPublishedProduct(db: DB, id: string): Promise<Product | null> {
  const { data, error } = await db
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .eq('published', true)
    .maybeSingle()
  if (error) throw new Error(`getPublishedProduct(${id}): ${error.message}`)
  return data ? toPublicProduct(mapProductRow(data)) : null
}

/** Admin catalog — includes drafts. */
export async function listProducts(db: DB): Promise<AdminProduct[]> {
  const rows = unwrap(
    'listProducts',
    await db
      .from('products')
      .select(PRODUCT_SELECT)
      .order('sort_order', { ascending: true })
  )
  return rows.map(mapProductRow)
}

export async function getProduct(db: DB, id: string): Promise<AdminProduct | null> {
  const { data, error } = await db
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`getProduct(${id}): ${error.message}`)
  return data ? mapProductRow(data) : null
}

export type ProductInput = Pick<
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
> & { sizes: ProductSize[] }

/**
 * Create or update a product together with its sizes. Sizes are replaced
 * wholesale — the set is tiny (1–3 rows) and this keeps the admin form's
 * "what you see is what is saved" behaviour honest.
 */
export async function upsertProduct(db: DB, input: ProductInput): Promise<void> {
  const { sizes, ...product } = input

  unwrap('upsertProduct', await db.from('products').upsert(toProductRow(product)).select('id'))

  unwrap(
    'upsertProduct/clearSizes',
    await db.from('product_sizes').delete().eq('product_id', product.id).select('id')
  )

  if (sizes.length > 0) {
    unwrap(
      'upsertProduct/insertSizes',
      await db
        .from('product_sizes')
        .insert(
          sizes.map((s, i) => ({
            product_id: product.id,
            ml: s.ml,
            price: s.price,
            sort_order: i,
          }))
        )
        .select('id')
    )
  }
}

export async function deleteProduct(db: DB, id: string): Promise<void> {
  unwrap('deleteProduct', await db.from('products').delete().eq('id', id).select('id'))
}

export async function setProductPublished(
  db: DB,
  id: string,
  published: boolean
): Promise<void> {
  unwrap(
    'setProductPublished',
    await db.from('products').update({ published }).eq('id', id).select('id')
  )
}
