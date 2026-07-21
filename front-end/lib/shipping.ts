import type { Carrier } from '@/types/order'

/**
 * Shipping is a flat rate per carrier. Kept server-authoritative: the checkout
 * API recomputes it from the carrier id rather than trusting a posted number.
 */
export const SHIPPING_RATES: Record<Carrier, number> = {
  'thai-post': 50,
  kerry: 80,
  pickup: 0,
}

export const CARRIERS = Object.keys(SHIPPING_RATES) as Carrier[]

export function isCarrier(value: unknown): value is Carrier {
  return typeof value === 'string' && value in SHIPPING_RATES
}

export function shippingCostFor(carrier: Carrier): number {
  return SHIPPING_RATES[carrier]
}
