import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProduct } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/ProductForm'

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: id }
}

export default async function EditProductPage({ params }: { params: Params }) {
  await requireAdmin()
  const { id } = await params

  const db = await createClient()
  const product = await getProduct(db, id)
  if (!product) notFound()

  const storefront = process.env.STOREFRONT_URL

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">
            <Link href="/products">← Fragrances</Link>
          </p>
          <h1>{product.name}</h1>
          <p>
            {product.number} · /shop/{product.id}
          </p>
        </div>
        {storefront && product.published && (
          <a
            className="btn"
            href={`${storefront.replace(/\/$/, '')}/shop/${product.id}`}
            target="_blank"
            rel="noreferrer"
          >
            View on site ↗
          </a>
        )}
      </header>

      <section className="panel">
        <div className="panel__body">
          <ProductForm product={product} />
        </div>
      </section>
    </>
  )
}
