import { REVENUE_STATUSES, type OrderStatus } from '../types/order'
import { unwrap, type DB } from './client'

export type DailyRevenue = {
  /** ISO date, `YYYY-MM-DD` */
  date: string
  revenue: number
  orders: number
}

export type TopProduct = {
  product_id: string
  product_name: string
  units: number
  revenue: number
}

export type SalesSummary = {
  revenue: number
  orders: number
  units: number
  /** Average order value, rounded to whole THB. */
  aov: number
  pendingPayment: number
  awaitingShipment: number
  daily: DailyRevenue[]
  topProducts: TopProduct[]
  statusCounts: Record<OrderStatus, number>
}

/**
 * One round trip for the whole dashboard. The catalogue is five products and
 * order volume is low-to-medium by design, so aggregating in JS is cheaper
 * than maintaining SQL views we'd have to migrate on every schema tweak.
 * Revisit if orders ever pass ~10k rows in a window.
 */
export async function getSalesSummary(db: DB, days = 30): Promise<SalesSummary> {
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - (days - 1))
  since.setUTCHours(0, 0, 0, 0)

  const orders = unwrap(
    'getSalesSummary/orders',
    await db
      .from('orders')
      .select('id, status, total, created_at, paid_at, order_items(product_id, product_name, qty, unit_price)')
      .gte('created_at', since.toISOString())
  )

  const statusCounts = emptyStatusCounts()
  const dailyMap = new Map<string, DailyRevenue>()
  const productMap = new Map<string, TopProduct>()

  let revenue = 0
  let paidOrders = 0
  let units = 0

  for (const order of orders) {
    const status = order.status as OrderStatus
    statusCounts[status] = (statusCounts[status] ?? 0) + 1

    if (!REVENUE_STATUSES.includes(status)) continue

    revenue += order.total
    paidOrders += 1

    const day = (order.paid_at ?? order.created_at).slice(0, 10)
    const bucket = dailyMap.get(day) ?? { date: day, revenue: 0, orders: 0 }
    bucket.revenue += order.total
    bucket.orders += 1
    dailyMap.set(day, bucket)

    for (const item of order.order_items ?? []) {
      units += item.qty
      const entry = productMap.get(item.product_id) ?? {
        product_id: item.product_id,
        product_name: item.product_name,
        units: 0,
        revenue: 0,
      }
      entry.units += item.qty
      entry.revenue += item.qty * item.unit_price
      productMap.set(item.product_id, entry)
    }
  }

  return {
    revenue,
    orders: paidOrders,
    units,
    aov: paidOrders > 0 ? Math.round(revenue / paidOrders) : 0,
    pendingPayment: statusCounts.pending_payment,
    awaitingShipment: statusCounts.paid + statusCounts.processing,
    daily: fillDays(dailyMap, since, days),
    topProducts: [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    statusCounts,
  }
}

function emptyStatusCounts(): Record<OrderStatus, number> {
  return {
    pending_payment: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
  }
}

/** Zero-fill gaps so the chart has one bar per day rather than a ragged axis. */
function fillDays(
  map: Map<string, DailyRevenue>,
  since: Date,
  days: number
): DailyRevenue[] {
  const out: DailyRevenue[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setUTCDate(since.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    out.push(map.get(key) ?? { date: key, revenue: 0, orders: 0 })
  }
  return out
}
