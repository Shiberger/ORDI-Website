import { mapOrderRow } from '../mappers'
import type { Database } from '../types/database'
import type {
  Carrier,
  Order,
  OrderDetail,
  OrderItem,
  OrderStatus,
  ShippingAddress,
} from '../types/order'
import { unwrap, type DB } from './client'

export type CreateOrderInput = {
  id: string
  user_id?: string | null
  email: string
  items: OrderItem[]
  shipping_address: ShippingAddress
  subtotal: number
  shipping_cost: number
  total: number
  carrier?: Carrier | null
  notes?: string | null
}

/**
 * Insert an order, its line items and its shipping address.
 *
 * Postgres has no multi-table transaction over PostgREST, so on a child-row
 * failure we delete the parent order — `on delete cascade` cleans up whatever
 * children did land. Better a missing order than a half-written one that a
 * webhook could later mark as paid.
 */
export async function createOrder(db: DB, input: CreateOrderInput): Promise<void> {
  unwrap(
    'createOrder',
    await db
      .from('orders')
      .insert({
        id: input.id,
        user_id: input.user_id ?? null,
        email: input.email,
        status: 'pending_payment',
        subtotal: input.subtotal,
        shipping_cost: input.shipping_cost,
        total: input.total,
        currency: 'THB',
        carrier: input.carrier ?? null,
        notes: input.notes ?? null,
      })
      .select('id')
  )

  try {
    unwrap(
      'createOrder/items',
      await db
        .from('order_items')
        .insert(input.items.map((it) => ({ ...it, order_id: input.id })))
        .select('id')
    )
    unwrap(
      'createOrder/address',
      await db
        .from('shipping_addresses')
        .insert({ ...input.shipping_address, order_id: input.id })
        .select('id')
    )
  } catch (err) {
    await db.from('orders').delete().eq('id', input.id)
    throw err
  }
}

export async function attachStripeSession(
  db: DB,
  orderId: string,
  sessionId: string
): Promise<void> {
  unwrap(
    'attachStripeSession',
    await db
      .from('orders')
      .update({ stripe_session_id: sessionId })
      .eq('id', orderId)
      .select('id')
  )
}

export async function getOrder(db: DB, id: string): Promise<OrderDetail | null> {
  const { data, error } = await db
    .from('orders')
    .select('*, order_items(*), shipping_addresses(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`getOrder(${id}): ${error.message}`)
  return data ? mapOrderDetail(data) : null
}

export async function getOrderByStripeSession(
  db: DB,
  sessionId: string
): Promise<OrderDetail | null> {
  const { data, error } = await db
    .from('orders')
    .select('*, order_items(*), shipping_addresses(*)')
    .eq('stripe_session_id', sessionId)
    .maybeSingle()
  if (error) throw new Error(`getOrderByStripeSession: ${error.message}`)
  return data ? mapOrderDetail(data) : null
}

export type ListOrdersOptions = {
  status?: OrderStatus | 'all'
  search?: string
  limit?: number
  offset?: number
}

export type ListOrdersResult = {
  orders: Order[]
  total: number
}

export async function listOrders(
  db: DB,
  options: ListOrdersOptions = {}
): Promise<ListOrdersResult> {
  const limit = options.limit ?? 25
  const offset = options.offset ?? 0

  let query = db
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }
  if (options.search) {
    const term = `%${options.search}%`
    query = query.or(`id.ilike.${term},email.ilike.${term}`)
  }

  const { data, error, count } = await query
  if (error) throw new Error(`listOrders: ${error.message}`)

  return { orders: (data ?? []).map(mapOrderRow), total: count ?? 0 }
}

export type OrderUpdate = {
  status?: OrderStatus
  carrier?: Carrier | null
  tracking_number?: string | null
  notes?: string | null
}

/** Status changes stamp their own timestamp column so the timeline stays real. */
export async function updateOrder(
  db: DB,
  id: string,
  update: OrderUpdate
): Promise<void> {
  const patch: Database['public']['Tables']['orders']['Update'] = { ...update }
  const now = new Date().toISOString()

  if (update.status === 'paid') patch.paid_at = now
  if (update.status === 'shipped') patch.shipped_at = now
  if (update.status === 'delivered') patch.delivered_at = now

  unwrap('updateOrder', await db.from('orders').update(patch).eq('id', id).select('id'))
}

type OrderDetailRow = Parameters<typeof mapOrderRow>[0] & {
  order_items?: (OrderItem & { id: string; order_id: string; created_at: string })[] | null
  shipping_addresses?: (ShippingAddress & { id: string })[] | null
}

function mapOrderDetail(row: OrderDetailRow): OrderDetail {
  const { order_items, shipping_addresses, ...orderRow } = row
  const address = shipping_addresses?.[0]

  return {
    ...mapOrderRow(orderRow),
    items: (order_items ?? []).map((it) => ({
      product_id: it.product_id,
      product_name: it.product_name,
      size_ml: it.size_ml,
      qty: it.qty,
      unit_price: it.unit_price,
    })),
    shipping_address: address
      ? {
          first_name: address.first_name,
          last_name: address.last_name,
          phone: address.phone,
          address: address.address,
          city: address.city,
          postcode: address.postcode,
          country: address.country,
        }
      : null,
  }
}
