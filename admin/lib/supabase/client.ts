'use client'

import { createBrowserClient } from '@supabase/ssr'
import { supabasePublishableKey, supabaseUrl, type Database } from '@ordi/shared'

/** Browser client — only the login form needs it. */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl()!, supabasePublishableKey()!)
}
