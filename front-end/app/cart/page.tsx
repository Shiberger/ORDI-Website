import { redirect } from 'next/navigation'
import { CHECKOUT_ENABLED } from '@/lib/commerce'
import { CartView } from '@/components/cart/CartView'

/**
 * The cart is withdrawn while orders go through Shopee. Redirecting rather
 * than deleting the route keeps every existing link and bookmark landing
 * somewhere sensible, and restores the real page the moment
 * `CHECKOUT_ENABLED` flips back.
 */
export default function CartPage() {
  if (!CHECKOUT_ENABLED) redirect('/shop')
  return <CartView />
}
