import { NextResponse } from 'next/server'
import {
  attachStripeSession,
  createAdminClient,
  createOrder,
  generateOrderId,
  hasSupabaseSecretConfig,
  type OrderItem,
  type ShippingAddress,
} from '@ordi/shared'
import { getProducts } from '@/lib/data/catalog'
import { getStripe, isStripeConfigured } from '@/lib/stripe/server'
import { isCarrier, shippingCostFor } from '@/lib/shipping'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type RequestBody = {
  items?: { id?: unknown; size?: unknown; qty?: unknown }[]
  email?: unknown
  carrier?: unknown
  shipping_address?: Partial<Record<keyof ShippingAddress, unknown>>
  notes?: unknown
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_QTY_PER_LINE = 20

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return bad('Payments are not configured yet.', 503)
  }
  if (!hasSupabaseSecretConfig()) {
    return bad('Order storage is not configured yet.', 503)
  }

  let body: RequestBody
  try {
    body = (await request.json()) as RequestBody
  } catch {
    return bad('Invalid JSON body.')
  }

  const email = str(body.email).toLowerCase()
  if (!EMAIL_RE.test(email)) return bad('A valid email address is required.')

  if (!isCarrier(body.carrier)) return bad('Unknown shipping carrier.')
  const carrier = body.carrier
  const shippingCost = shippingCostFor(carrier)

  const address = normalizeAddress(body.shipping_address, carrier)
  if ('error' in address) return bad(address.error)

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return bad('Your cart is empty.')
  }

  // Prices come from the catalogue, never from the request. A tampered client
  // can pick which products to buy but not what they cost.
  const catalog = await getProducts()
  const items: OrderItem[] = []

  for (const raw of body.items) {
    const id = str(raw.id)
    const size = Number(raw.size)
    const qty = Math.floor(Number(raw.qty))

    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_LINE) {
      return bad(`Invalid quantity for "${id}".`)
    }

    const product = catalog.find((p) => p.id === id)
    if (!product) return bad(`Unknown product "${id}".`)
    if (product.status !== 'available') return bad(`${product.name} is not available.`)

    const variant = product.sizes.find((s) => s.ml === size)
    if (!variant) return bad(`${product.name} has no ${size}ml size.`)

    items.push({
      product_id: product.id,
      product_name: product.name,
      size_ml: variant.ml,
      qty,
      unit_price: variant.price,
    })
  }

  const subtotal = items.reduce((sum, it) => sum + it.unit_price * it.qty, 0)
  const total = subtotal + shippingCost

  const orderId = generateOrderId()
  const db = createAdminClient()

  try {
    await createOrder(db, {
      id: orderId,
      email,
      items,
      shipping_address: address.value,
      subtotal,
      shipping_cost: shippingCost,
      total,
      carrier,
      notes: str(body.notes) || null,
    })
  } catch (err) {
    console.error('[checkout] failed to create order', err)
    return bad('Could not create your order. Please try again.', 500)
  }

  const origin = new URL(request.url).origin

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      client_reference_id: orderId,
      metadata: { order_id: orderId },
      // Payment methods come from the Stripe Dashboard (card, PromptPay, …)
      // so enabling a new one never requires a code change.
      line_items: [
        ...items.map((it) => ({
          price_data: {
            currency: 'thb',
            unit_amount: it.unit_price * 100, // Stripe works in satang
            product_data: { name: `${it.product_name} — ${it.size_ml}ml` },
          },
          quantity: it.qty,
        })),
        ...(shippingCost > 0
          ? [
              {
                price_data: {
                  currency: 'thb' as const,
                  unit_amount: shippingCost * 100,
                  product_data: { name: `Shipping — ${carrier}` },
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=1`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    })

    if (!session.url) throw new Error('Stripe returned a session without a URL')

    await attachStripeSession(db, orderId, session.id)

    return NextResponse.json({ url: session.url, order_id: orderId })
  } catch (err) {
    console.error('[checkout] stripe session failed', err)
    // The order row would otherwise sit in pending_payment forever.
    await db.from('orders').update({ status: 'cancelled' }).eq('id', orderId)
    return bad('Could not reach the payment provider. Please try again.', 502)
  }
}

type AddressResult = { value: ShippingAddress } | { error: string }

function normalizeAddress(
  input: RequestBody['shipping_address'],
  carrier: string
): AddressResult {
  const first_name = str(input?.first_name)
  const last_name = str(input?.last_name)
  const phone = str(input?.phone)
  const address = str(input?.address)
  const city = str(input?.city)
  const postcode = str(input?.postcode)
  const country = str(input?.country) || 'TH'

  if (!first_name || !last_name) return { error: 'Please enter your full name.' }
  if (!phone) return { error: 'A phone number is required for delivery.' }

  // Studio pickup needs no street address.
  if (carrier !== 'pickup' && (!address || !city || !postcode)) {
    return { error: 'Please complete your shipping address.' }
  }

  return {
    value: {
      first_name,
      last_name,
      phone,
      address: address || 'Studio pickup',
      city: city || 'Bangkok',
      postcode: postcode || '-',
      country,
    },
  }
}
