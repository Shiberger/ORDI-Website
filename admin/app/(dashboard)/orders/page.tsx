import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ORDER_STATUSES,
  formatDateTime,
  formatTHB,
  listOrders,
  type OrderStatus,
} from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/StatusBadge'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Orders' }

const PAGE_SIZE = 25

type SearchParams = Promise<{ status?: string; q?: string; page?: string }>

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  await requireAdmin()
  const params = await searchParams

  const status = ORDER_STATUSES.includes(params.status as OrderStatus)
    ? (params.status as OrderStatus)
    : 'all'
  const search = params.q?.trim() ?? ''
  const page = Math.max(1, Number(params.page) || 1)

  const db = await createClient()
  const { orders, total } = await listOrders(db, {
    status,
    search: search || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Fulfilment</p>
          <h1>Orders</h1>
          <p>
            {total} order{total === 1 ? '' : 's'}
            {status !== 'all' ? ` · ${status.replace('_', ' ')}` : ''}
            {search ? ` · matching “${search}”` : ''}
          </p>
        </div>
      </header>

      <form className="filters" method="get">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Order ID or email…"
        />
        <select name="status" defaultValue={status}>
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <button className="btn btn--sm">Filter</button>
        {(search || status !== 'all') && (
          <Link href="/orders" className="btn btn--sm">
            Reset
          </Link>
        )}
      </form>

      <section className="panel">
        {orders.length === 0 ? (
          <p className="empty">Nothing matches these filters.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Placed</th>
                  <th>Status</th>
                  <th>Tracking</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{order.email}</td>
                    <td>{formatDateTime(order.created_at)}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                      {order.tracking_number ?? '—'}
                    </td>
                    <td className="num">{formatTHB(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pages > 1 && (
        <div className="pager">
          {page > 1 && (
            <Link
              className="btn btn--sm"
              href={buildHref({ status, search, page: page - 1 })}
            >
              ← Prev
            </Link>
          )}
          <span>
            Page {page} / {pages}
          </span>
          {page < pages && (
            <Link
              className="btn btn--sm"
              href={buildHref({ status, search, page: page + 1 })}
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </>
  )
}

function buildHref({
  status,
  search,
  page,
}: {
  status: string
  search: string
  page: number
}): string {
  const qs = new URLSearchParams()
  if (status !== 'all') qs.set('status', status)
  if (search) qs.set('q', search)
  if (page > 1) qs.set('page', String(page))
  const query = qs.toString()
  return query ? `/orders?${query}` : '/orders'
}
