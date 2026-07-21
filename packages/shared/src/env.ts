/**
 * Supabase credentials, resolved in one place.
 *
 * Supabase replaced the legacy JWT keys (`anon` / `service_role`) with
 * `sb_publishable_…` / `sb_secret_…`. We read the new names first and fall back
 * to the old ones, so a project on either generation works without a code
 * change.
 *
 * The `process.env.X` references below are written out in full on purpose:
 * Next.js inlines `NEXT_PUBLIC_*` literals at build time and cannot follow a
 * dynamic lookup.
 */

export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || undefined
}

/** Browser-safe key. Subject to RLS as the `anon` role. */
export function supabasePublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    undefined
  )
}

/** Server-only key. Bypasses RLS — never expose it to a browser bundle. */
export function supabaseSecretKey(): string | undefined {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    undefined
  )
}

/** True when public reads (products, journal) can hit the database. */
export function hasSupabasePublicConfig(): boolean {
  return Boolean(supabaseUrl() && supabasePublishableKey())
}

/** True when privileged writes (orders, webhooks) are possible. */
export function hasSupabaseSecretConfig(): boolean {
  return Boolean(supabaseUrl() && supabaseSecretKey())
}
