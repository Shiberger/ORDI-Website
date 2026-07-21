import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { createAdminClient, getOrder } from '@ordi/shared'
import { getStripe } from '@/lib/stripe/server'
import { sendOrderConfirmation } from '@/lib/email/send-order-confirmation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  // Signature verification needs the raw body, so read text and never JSON.
  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret)
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    await handleEvent(event)
  } catch (err) {
    // A 500 makes Stripe retry, which is what we want for transient DB errors.
    console.error(`[webhook] handler failed for ${event.type}`, err)
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  const db = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const orderId = orderIdOf(session)
      if (!orderId) return

      // Guard against out-of-order or duplicated deliveries: only a still
      // pending order may transition to paid.
      const { error } = await db
        .from('orders')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          stripe_payment_id:
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
          payment_method: 'card',
        })
        .eq('id', orderId)
        .eq('status', 'pending_payment')
      if (error) throw new Error(error.message)

      const order = await getOrder(db, orderId)
      if (order && order.status === 'paid') await sendOrderConfirmation(order)
      return
    }

    case 'checkout.session.expired': {
      const orderId = orderIdOf(event.data.object)
      if (!orderId) return
      const { error } = await db
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('status', 'pending_payment')
      if (error) throw new Error(error.message)
      return
    }

    case 'charge.refunded': {
      const charge = event.data.object
      const paymentIntentId =
        typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id
      if (!paymentIntentId) return

      const { error } = await db
        .from('orders')
        .update({ status: 'refunded' })
        .eq('stripe_payment_id', paymentIntentId)
      if (error) throw new Error(error.message)
      return
    }

    default:
      // Everything else is intentionally ignored.
      return
  }
}

function orderIdOf(session: Stripe.Checkout.Session): string | null {
  return session.metadata?.order_id ?? session.client_reference_id ?? null
}
