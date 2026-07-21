import Link from 'next/link'
import type { Metadata } from 'next'
import { listProducts } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/ProductForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'New fragrance' }

export default async function NewProductPage() {
  await requireAdmin()
  const db = await createClient()
  const existing = await listProducts(db)

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">
            <Link href="/products">← Fragrances</Link>
          </p>
          <h1>New fragrance</h1>
          <p>It goes live on the storefront as soon as it is published.</p>
        </div>
      </header>

      <section className="panel">
        <div className="panel__body">
          <ProductForm nextSortOrder={existing.length} />
        </div>
      </section>
    </>
  )
}
