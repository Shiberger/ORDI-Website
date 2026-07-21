import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types/database'
import { slugify } from './utils'

/** Bucket created by migration 0005. Public read, admin-only write. */
export const PRODUCT_IMAGE_BUCKET = 'product-images'

const ALLOWED = ['image/webp', 'image/jpeg', 'image/png', 'image/avif']
const MAX_BYTES = 10 * 1024 * 1024

export type UploadResult = { url: string; path: string }

/**
 * Put a product photograph in Storage and hand back its public URL, which is
 * what `products.image_url` stores.
 *
 * Runs from the browser as the signed-in admin so the bucket policies — not
 * this function — decide whether the write lands. The checks here exist to give
 * a readable message before the round trip, not as a security boundary.
 */
export async function uploadProductImage(
  db: SupabaseClient<Database>,
  productId: string,
  file: File
): Promise<UploadResult> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error(`${file.type || 'That file'} is not an image we accept (webp, jpeg, png, avif).`)
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`That image is ${(file.size / 1048576).toFixed(1)} MB — the limit is 10 MB.`)
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp'
  const stem = slugify(file.name.replace(/\.[^.]+$/, '')) || 'shot'
  // Timestamped so replacing art busts every CDN and next/image cache holding
  // the old URL; the previous file stays until someone deletes it.
  const path = `${slugify(productId) || 'draft'}/${Date.now()}-${stem}.${ext}`

  const { error } = await db.storage.from(PRODUCT_IMAGE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
  })
  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = db.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}
