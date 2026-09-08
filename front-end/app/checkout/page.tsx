import { redirect } from 'next/navigation'
import { CHECKOUT_ENABLED } from '@/lib/commerce'
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow'

/**
 * Card payment is off, so the three-step flow is parked. It redirects to the
 * shop rather than straight to Shopee: an on-site page that then offers the
 * Shopee button is less startling than a bookmark that throws the visitor
 * onto another domain.
 */
export default function CheckoutPage() {
  if (!CHECKOUT_ENABLED) redirect('/shop')
  return <CheckoutFlow />
}
