import Link from 'next/link'
import {
  formatDateTime,
  formatTHB,
  getSalesSummary,
  listOrders,
  type OrderStatus,
} from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { StatCard } from '@/components/StatCard'
import { RevenueChart } from '@/components/RevenueChart'
import { StatusBadge } from '@/components/StatusBadge'

export const dynamic = 'force-dynamic'

const WINDOW_DAYS = 30

export default async function DashboardPage() {
  await requireAdmin()
  const db = await createClient()

  const [summary, recent] = await Promise.all([
    getSalesSummary(db, WINDOW_DAYS),
    listOrders(db, { limit: 8 }),
  ])

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p>Sales and order activity for the last {WINDOW_DAYS} days.</p>
        </div>
        <Link href="/orders" className="btn">
          All orders →
        </Link>
      </header>

      <div className="stat-grid">
        <StatCard
          label="Revenue"
          value={formatTHB(summary.revenue)}
          hint={`${summary.orders} paid order${summary.orders === 1 ? '' : 's'}`}
        />
        <StatCard
          label="Average order"
          value={formatTHB(summary.aov)}
          hint={`${summary.units} bottle${summary.units === 1 ? '' : 's'} sold`}
        />
        <StatCard
          label="Awaiting shipment"
          value={String(summary.awaitingShipment)}
          hint="Paid or being processed"
        />
        <StatCard
          label="Unpaid"
          value={String(summary.pendingPayment)}
          hint="Checkout started, not completed"
        />
      </div>

      <RevenueChart daily={summary.daily} days={WINDOW_DAYS} />

      <section className="panel">
        <div className="panel__head">
          <h2>Best sellers</h2>
          <span className="eyebrow" style={{ margin: 0 }}>
            last {WINDOW_DAYS} days
          </span>
        </div>
        {summary.topProducts.length === 0 ? (
          <p className="empty">No sales in this window yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Fragrance</th>
                  <th className="num">Units</th>
                  <th className="num">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {summary.topProducts.map((p) => (
                  <tr key={p.product_id}>
                    <td>{p.product_name}</td>
                    <td className="num">{p.units}</td>
                    <td className="num">{formatTHB(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel__head">
          <h2>Recent orders</h2>
          <Link href="/orders" className="btn btn--sm">
            View all
          </Link>
        </div>
        {recent.orders.length === 0 ? (
          <p className="empty">No orders yet. The first one will show up here.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Placed</th>
                  <th>Status</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td>{order.email}</td>
                    <td>{formatDateTime(order.created_at)}</td>
                    <td>
                      <StatusBadge status={order.status as OrderStatus} />
                    </td>
                    <td className="num">{formatTHB(order.total)}</td>
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
