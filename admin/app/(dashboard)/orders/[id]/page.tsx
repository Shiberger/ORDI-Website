import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { formatDateTime, formatTHB, getOrder } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/StatusBadge'
import { OrderForm } from '@/components/OrderForm'

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: id }
}

export default async function OrderDetailPage({ params }: { params: Params }) {
  await requireAdmin()
  const { id } = await params

  const db = await createClient()
  const order = await getOrder(db, id)
  if (!order) notFound()

  const address = order.shipping_address

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">
            <Link href="/orders">← Orders</Link>
          </p>
          <h1>{order.id}</h1>
          <p>
            Placed {formatDateTime(order.created_at)} · {order.email}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </header>

      <div className="detail-grid">
        <div>
          <section className="panel">
            <div className="panel__head">
              <h2>Items</h2>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fragrance</th>
                    <th className="num">Qty</th>
                    <th className="num">Unit</th>
                    <th className="num">Line</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, i) => (
                    <tr key={i}>
                      <td>
                        {it.product_name}
                        <span style={{ color: 'var(--ink-faint)' }}> · {it.size_ml}ml</span>
                      </td>
                      <td className="num">{it.qty}</td>
                      <td className="num">{formatTHB(it.unit_price)}</td>
                      <td className="num">{formatTHB(it.unit_price * it.qty)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="num">
                      Subtotal
                    </td>
                    <td className="num">{formatTHB(order.subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="num">
                      Shipping
                    </td>
                    <td className="num">{formatTHB(order.shipping_cost)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="num">
                      <strong>Total</strong>
                    </td>
                    <td className="num">
                      <strong>{formatTHB(order.total)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Shipping address</h2>
            </div>
            <div className="panel__body">
              {address ? (
                <dl className="kv">
                  <div>
                    <dt>Recipient</dt>
                    <dd>
                      {address.first_name} {address.last_name}
                      <br />
                      {address.phone}
                    </dd>
                  </div>
                  <div>
                    <dt>Address</dt>
                    <dd>
                      {address.address}
                      <br />
                      {address.city} {address.postcode}
                      <br />
                      {address.country}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="empty">No address recorded.</p>
              )}
            </div>
          </section>
        </div>

        <div>
          <section className="panel">
            <div className="panel__head">
              <h2>Fulfilment</h2>
            </div>
            <div className="panel__body">
              <OrderForm order={order} />
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Timeline</h2>
            </div>
            <div className="panel__body">
              <div className="timeline">
                <TimelineRow label="Placed" value={order.created_at} />
                <TimelineRow label="Paid" value={order.paid_at} />
                <TimelineRow label="Shipped" value={order.shipped_at} />
                <TimelineRow label="Delivered" value={order.delivered_at} />
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h2>Payment</h2>
            </div>
            <div className="panel__body">
              <dl className="kv">
                <div>
                  <dt>Method</dt>
                  <dd>{order.payment_method ?? '—'}</dd>
                </div>
                <div>
                  <dt>Stripe session</dt>
                  <dd style={{ fontFamily: 'var(--mono)', fontSize: 12, wordBreak: 'break-all' }}>
                    {order.stripe_session_id ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt>Payment intent</dt>
                  <dd style={{ fontFamily: 'var(--mono)', fontSize: 12, wordBreak: 'break-all' }}>
                    {order.stripe_payment_id ?? '—'}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

function TimelineRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="timeline__row">
      <strong>{label}</strong>
      <span>{value ? formatDateTime(value) : '—'}</span>
    </div>
  )
}
