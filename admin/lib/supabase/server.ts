import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabasePublishableKey, supabaseUrl, type Database } from '@ordi/shared'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Cookie-backed client for Server Components, Route Handlers and Server
 * Actions. Reads and writes run as the signed-in admin, so RLS — not our own
 * code — is what actually enforces access.
 */
export async function createClient(): Promise<SupabaseClient<Database>> {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseUrl()!, supabasePublishableKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Server Components cannot set cookies; middleware refreshes the
          // session instead, so this is safe to swallow.
        }
      },
    },
  })
}
