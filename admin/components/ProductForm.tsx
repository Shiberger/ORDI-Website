'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type { AdminProduct, ProductSize } from '@ordi/shared'
import { deleteProductAction, saveProductAction } from '@/lib/actions/products'
import { ProductImageField } from '@/components/ProductImageField'

type Props = {
  /** Undefined when creating a new fragrance. */
  product?: AdminProduct
  nextSortOrder?: number
}

const BLANK_SIZE: ProductSize = { ml: 50, price: 0 }

export function ProductForm({ product, nextSortOrder = 0 }: Props) {
  const router = useRouter()
  const isNew = !product
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [sizes, setSizes] = useState<ProductSize[]>(
    product?.sizes.length ? product.sizes : [BLANK_SIZE]
  )

  function onSubmit(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveProductAction(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setSaved(true)
      if (isNew) router.replace(`/products/${result.id}`)
      else router.refresh()
    })
  }

  function onDelete() {
    if (!product) return
    if (!confirm(`Delete ${product.name}? This cannot be undone.`)) return

    startTransition(async () => {
      const result = await deleteProductAction(product.id)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.replace('/products')
    })
  }

  return (
    <form action={onSubmit}>
      {error && <p className="alert">{error}</p>}
      {saved && <p className="alert alert--ok">Saved. The storefront is refreshing.</p>}

      <section className="form-section">
        <h3>Identity</h3>
        {!isNew && <input type="hidden" name="id" value={product.id} />}

        <div className="field-row">
          <label className="field">
            <span>Name</span>
            <input name="name" defaultValue={product?.name} required placeholder="GOOD BOY" />
          </label>
          <label className="field">
            <span>Number</span>
            <input name="number" defaultValue={product?.number} placeholder="N°06" />
          </label>
        </div>

        {isNew ? (
          <label className="field">
            <span>URL slug (optional)</span>
            <input name="id" placeholder="derived from the name if left blank" />
            <small>Becomes /shop/&lt;slug&gt; and cannot be changed later.</small>
          </label>
        ) : (
          <label className="field">
            <span>URL</span>
            <input value={`/shop/${product.id}`} readOnly disabled />
          </label>
        )}

        <div className="field-row--3 field-row">
          <label className="field">
            <span>Status</span>
            <select name="status" defaultValue={product?.status ?? 'available'}>
              <option value="available">Available</option>
              <option value="coming-soon">Coming soon</option>
              <option value="sold-out">Sold out</option>
            </select>
          </label>
          <label className="field">
            <span>Bottle hue</span>
            <input name="hue" defaultValue={product?.hue ?? '#EFEAE0'} placeholder="#EFEAE0" />
          </label>
          <label className="field">
            <span>Sort order</span>
            <input
              name="sort_order"
              type="number"
              defaultValue={product?.sort_order ?? nextSortOrder}
            />
          </label>
        </div>

        <ProductImageField
          productId={product?.id ?? ''}
          defaultValue={product?.image_url ?? ''}
        />

        <label className="checkbox">
          <input type="checkbox" name="published" defaultChecked={product?.published ?? true} />
          <span>Published — visible on the storefront</span>
        </label>

        <label className="checkbox">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
          <span>Featured — spotlit on the home page (replaces the current one)</span>
        </label>
      </section>

      <section className="form-section">
        <h3>Sizes &amp; pricing (THB)</h3>
        <div className="sizes-editor">
          {sizes.map((size, i) => (
            <div className="sizes-editor__row" key={i}>
              <label className="field" style={{ marginBottom: 0 }}>
                <span>Size (ml)</span>
                <input
                  name="size_ml"
                  type="number"
                  min={1}
                  defaultValue={size.ml}
                  key={`ml-${i}-${size.ml}`}
                />
              </label>
              <label className="field" style={{ marginBottom: 0 }}>
                <span>Price</span>
                <input
                  name="size_price"
                  type="number"
                  min={0}
                  defaultValue={size.price}
                  key={`price-${i}-${size.price}`}
                />
              </label>
              <button
                type="button"
                className="btn btn--sm btn--danger"
                onClick={() => setSizes((s) => s.filter((_, idx) => idx !== i))}
                disabled={sizes.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn--sm"
          style={{ marginTop: 14 }}
          onClick={() => setSizes((s) => [...s, { ml: 12, price: 0 }])}
        >
          + Add size
        </button>
      </section>

      <section className="form-section">
        <h3>Copy — English</h3>
        <label className="field">
          <span>Tagline</span>
          <input name="tagline_en" defaultValue={product?.tagline.en} />
        </label>
        <label className="field">
          <span>Family</span>
          <input
            name="family_en"
            defaultValue={product?.family.en}
            placeholder="Citrus Gourmand · Soft Musk"
          />
        </label>
        <label className="field">
          <span>Story</span>
          <textarea name="story_en" defaultValue={product?.story.en} />
        </label>
      </section>

      <section className="form-section">
        <h3>Copy — ไทย</h3>
        <label className="field">
          <span>Tagline</span>
          <input name="tagline_th" defaultValue={product?.tagline.th} />
        </label>
        <label className="field">
          <span>Family</span>
          <input name="family_th" defaultValue={product?.family.th} />
        </label>
        <label className="field">
          <span>Story</span>
          <textarea name="story_th" defaultValue={product?.story.th} />
        </label>
      </section>

      <section className="form-section">
        <h3>Notes — comma separated</h3>
        <label className="field">
          <span>Top</span>
          <input name="notes_top" defaultValue={product?.notes.top.join(', ')} />
        </label>
        <label className="field">
          <span>Heart</span>
          <input name="notes_heart" defaultValue={product?.notes.heart.join(', ')} />
        </label>
        <label className="field">
          <span>Base</span>
          <input name="notes_base" defaultValue={product?.notes.base.join(', ')} />
        </label>
      </section>

      <div className="form-actions">
        <button className="btn btn--primary" disabled={pending}>
          {pending ? 'Saving…' : isNew ? 'Create fragrance' : 'Save changes'}
        </button>
        <div className="spacer" />
        {!isNew && (
          <button
            type="button"
            className="btn btn--danger"
            onClick={onDelete}
            disabled={pending}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
