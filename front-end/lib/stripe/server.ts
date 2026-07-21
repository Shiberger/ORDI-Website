import 'server-only'
import Stripe from 'stripe'

let cached: Stripe | null = null

/** Lazily constructed so a missing key only breaks checkout, never the build. */
export function getStripe(): Stripe {
  if (cached) return cached

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Missing STRIPE_SECRET_KEY — check .env.local')

  // No apiVersion override: the SDK pins the version it was built against, so
  // upgrading the package is the single place an API bump happens.
  cached = new Stripe(key)
  return cached
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
