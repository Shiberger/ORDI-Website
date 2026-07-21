import type { Metadata } from 'next'
import Link from 'next/link'
import {
  createAdminClient,
  formatPrice,
  getOrderByStripeSession,
  hasSupabaseSecretConfig,
} from '@ordi/shared'
import { MonoTag } from '@/components/ui/MonoTag'
import { ClearCartOnMount } from '@/components/checkout/ClearCartOnMount'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ session_id?: string }>

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { session_id } = await searchParams
  const order = session_id ? await loadOrder(session_id) : null

  return (
    <main className="ordi-checkout ordi-checkout--done">
      <ClearCartOnMount />
      <div className="ordi-thanks">
        <MonoTag>{order ? `ORDER · ${order.id}` : 'ORDER RECEIVED'}</MonoTag>
        <h1 className="ordi-display-lg">
          Thank <em>you</em>.
        </h1>

        {order ? (
          <>
            <p>
              {order.status === 'pending_payment'
                ? 'Your payment is being confirmed. This page will show the final receipt once Stripe reports back — refresh in a moment.'
                : "We'll hand-bottle your order in the studio this week. A confirmation is on its way to your inbox."}
            </p>

            <div className="ordi-thanks__items">
              {order.items.map((it, i) => (
                <div className="ordi-summary__row" key={i}>
                  <span>
                    {it.qty} × {it.product_name} · {it.size_ml}ml
                  </span>
                  <span>{formatPrice(it.unit_price * it.qty)} THB</span>
                </div>
              ))}
              <div className="ordi-summary__row">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping_cost)} THB</span>
              </div>
              <div className="ordi-summary__row ordi-summary__row--total">
                <span>Total</span>
                <span>{formatPrice(order.total)} THB</span>
              </div>
            </div>
          </>
        ) : (
          <p>
            Your payment went through. If you do not receive a confirmation email within a
            few minutes, contact us and we will track it down.
          </p>
        )}

        <div className="ordi-thanks__meta">
          <div>
            <MonoTag>EST. ARRIVAL</MonoTag>
            3–5 business days
          </div>
          <div>
            <MonoTag>FROM</MonoTag>Sukhumvit Studio, Bangkok
          </div>
        </div>

        <Link href="/" className="ordi-btn ordi-btn--ghost">
          ← Back to ORDI
        </Link>
      </div>
    </main>
  )
}

/**
 * Read with the service-role key: guest orders have no `user_id`, so RLS would
 * hide them. The Stripe session id is the unguessable capability that proves
 * the visitor just completed this checkout.
 */
async function loadOrder(sessionId: string) {
  if (!hasSupabaseSecretConfig()) return null
  try {
    return await getOrderByStripeSession(createAdminClient(), sessionId)
  } catch (err) {
    console.error('[checkout/success] could not load order', err)
    return null
  }
}
