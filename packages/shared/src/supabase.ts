import { createClient } from '@supabase/supabase-js'
import { supabasePublishableKey, supabaseSecretKey, supabaseUrl } from './env'
import type { Database } from './types/database'
import type { DB } from './queries/client'

/**
 * Secret-key client. Bypasses RLS — **server only**.
 * Used by the Stripe webhook and the checkout API, both of which write rows
 * that no signed-in user owns.
 */
export function createAdminClient(): DB {
  const url = supabaseUrl()
  const key = supabaseSecretKey()

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY — check .env.local'
    )
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Publishable-key client with no cookie handling — safe for build-time and ISR
 * reads of public content (products, journal), which RLS already allows anon.
 */
export function createPublicClient(): DB {
  const url = supabaseUrl()
  const key = supabasePublishableKey()

  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — check .env.local'
    )
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
