'use server'

import { revalidatePath } from 'next/cache'
import {
  deleteProduct,
  setProductPublished,
  slugify,
  upsertProduct,
  type ProductSize,
  type ProductStatus,
} from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidateStorefront } from '@/lib/revalidate'

export type ActionResult = { ok: true; id: string } | { ok: false; error: string }

const STATUSES: readonly ProductStatus[] = ['available', 'coming-soon', 'sold-out']

export async function saveProductAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const name = str(formData, 'name')
  if (!name) return { ok: false, error: 'Name is required.' }

  // The id doubles as the storefront slug, so it is fixed once created.
  const id = str(formData, 'id') || slugify(name)
  if (!id) return { ok: false, error: 'Could not derive a URL slug from that name.' }

  const status = str(formData, 'status') as ProductStatus
  if (!STATUSES.includes(status)) return { ok: false, error: 'Invalid status.' }

  const sizes = parseSizes(formData)
  if ('error' in sizes) return { ok: false, error: sizes.error }
  if (sizes.value.length === 0) {
    return { ok: false, error: 'Add at least one size and price.' }
  }

  try {
    const db = await createClient()
    await upsertProduct(db, {
      id,
      name,
      number: str(formData, 'number'),
      tagline: { en: str(formData, 'tagline_en'), th: str(formData, 'tagline_th') },
      family: { en: str(formData, 'family_en'), th: str(formData, 'family_th') },
      story: { en: str(formData, 'story_en'), th: str(formData, 'story_th') },
      notes: {
        top: list(formData, 'notes_top'),
        heart: list(formData, 'notes_heart'),
        base: list(formData, 'notes_base'),
      },
      status,
      hue: str(formData, 'hue') || '#EFEAE0',
      image_url: str(formData, 'image_url') || null,
      published: formData.get('published') === 'on',
      sort_order: Number(formData.get('sort_order')) || 0,
      sizes: sizes.value,
    })
  } catch (err) {
    console.error('[products] save failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Save failed.' }
  }

  revalidatePath('/products')
  revalidatePath(`/products/${id}`)
  await revalidateStorefront(['/', '/shop', `/shop/${id}`])

  return { ok: true, id }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin()

  try {
    const db = await createClient()
    await deleteProduct(db, id)
  } catch (err) {
    console.error('[products] delete failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Delete failed.' }
  }

  revalidatePath('/products')
  await revalidateStorefront(['/', '/shop', `/shop/${id}`])
  return { ok: true, id }
}

export async function toggleProductPublishedAction(
  id: string,
  published: boolean
): Promise<ActionResult> {
  await requireAdmin()

  try {
    const db = await createClient()
    await setProductPublished(db, id, published)
  } catch (err) {
    console.error('[products] publish toggle failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Update failed.' }
  }

  revalidatePath('/products')
  await revalidateStorefront(['/', '/shop', `/shop/${id}`])
  return { ok: true, id }
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

/** Comma-separated note lists, e.g. "Yuzu, Bergamot". */
function list(formData: FormData, key: string): string[] {
  return str(formData, key)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

type SizesResult = { value: ProductSize[] } | { error: string }

function parseSizes(formData: FormData): SizesResult {
  const mls = formData.getAll('size_ml')
  const prices = formData.getAll('size_price')
  const sizes: ProductSize[] = []
  const seen = new Set<number>()

  for (let i = 0; i < mls.length; i++) {
    const ml = Number(mls[i])
    const price = Number(prices[i])

    // Blank rows are how the form says "removed".
    if (!mls[i] && !prices[i]) continue

    if (!Number.isFinite(ml) || ml <= 0) return { error: `Invalid size "${mls[i]}".` }
    if (!Number.isFinite(price) || price < 0) {
      return { error: `Invalid price for ${ml}ml.` }
    }
    if (seen.has(ml)) return { error: `Duplicate ${ml}ml size.` }

    seen.add(ml)
    sizes.push({ ml: Math.round(ml), price: Math.round(price) })
  }

  return { value: sizes }
}
