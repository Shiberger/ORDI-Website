import Link from 'next/link'
import type { Metadata } from 'next'
import { formatTHB, listProducts } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Products' }

export default async function ProductsPage() {
  await requireAdmin()
  const db = await createClient()
  const products = await listProducts(db)

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1>Fragrances</h1>
          <p>
            {products.length} product{products.length === 1 ? '' : 's'} ·{' '}
            {products.filter((p) => p.published).length} published
          </p>
        </div>
        <Link href="/products/new" className="btn btn--primary">
          + New fragrance
        </Link>
      </header>

      <section className="panel">
        {products.length === 0 ? (
          <p className="empty">
            No products yet. Run the seed script, or add the first one by hand.
          </p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Sizes</th>
                  <th className="num">From</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span
                        aria-hidden
                        style={{
                          display: 'block',
                          width: 22,
                          height: 22,
                          background: p.hue,
                          border: '1px solid var(--line-strong)',
                        }}
                      />
                    </td>
                    <td>
                      <Link href={`/products/${p.id}`}>{p.name}</Link>
                      <div style={{ color: 'var(--ink-faint)', fontSize: 12 }}>
                        {p.number}
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{p.id}</td>
                    <td>
                      <span className={`badge${p.published ? '' : ' badge--draft'}`}>
                        {p.published ? p.status : 'draft'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                      {p.sizes.map((s) => `${s.ml}ml`).join(' · ') || '—'}
                    </td>
                    <td className="num">
                      {p.sizes.length
                        ? formatTHB(Math.min(...p.sizes.map((s) => s.price)))
                        : '—'}
                    </td>
                    <td className="num">
                      <Link href={`/products/${p.id}`} className="btn btn--sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
