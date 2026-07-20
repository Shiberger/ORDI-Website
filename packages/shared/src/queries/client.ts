import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

/** Every query helper in this package takes one of these. */
export type DB = SupabaseClient<Database>

export class SupabaseQueryError extends Error {
  readonly code: string | undefined
  readonly details: string | undefined

  constructor(context: string, error: PostgrestError) {
    super(`${context}: ${error.message}`)
    this.name = 'SupabaseQueryError'
    this.code = error.code
    this.details = error.details
  }
}

/** Throw on a Postgrest error, otherwise hand back the data. */
export function unwrap<T>(
  context: string,
  result: { data: T | null; error: PostgrestError | null }
): T {
  if (result.error) throw new SupabaseQueryError(context, result.error)
  return result.data as T
}
