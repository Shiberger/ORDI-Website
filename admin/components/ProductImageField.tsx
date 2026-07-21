'use client'

import { useRef, useState } from 'react'
import { uploadProductImage } from '@ordi/shared'
import { createClient } from '@/lib/supabase/client'

type Props = {
  /** Empty while creating — uploads land under `draft/` until the id exists. */
  productId: string
  defaultValue: string
}

/**
 * The `image_url` field, with an uploader in front of it. The file goes browser
 * → Supabase Storage directly rather than through the server action, because a
 * server action would have to carry the whole image through a Next request body.
 * The form still submits nothing but a URL string.
 */
export function ProductImageField({ productId, defaultValue }: Props) {
  const [url, setUrl] = useState(defaultValue)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function onPick(file: File | undefined) {
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      const result = await uploadProductImage(createClient(), productId, file)
      setUrl(result.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="field">
      <span>Product image</span>

      {url && (
        <div className="image-field__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Current product photograph" />
          <button type="button" className="btn btn--sm" onClick={() => setUrl('')}>
            Remove
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/webp,image/jpeg,image/png,image/avif"
        disabled={busy}
        onChange={(e) => void onPick(e.target.files?.[0])}
      />

      <input
        name="image_url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="…or paste a URL. Blank uses the bundled studio art."
      />

      {busy && <small>Uploading…</small>}
      {error && <small className="image-field__error">{error}</small>}
      {!busy && !error && (
        <small>
          WebP or JPEG, up to 10 MB. Large files are resized by the storefront on
          delivery, so upload the best copy you have.
        </small>
      )}
    </div>
  )
}
