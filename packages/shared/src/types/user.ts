import type { Lang } from './product'

export type UserRole = 'customer' | 'admin' | 'owner'

export type Profile = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  preferred_lang: Lang
  is_invited: boolean
  role: UserRole
  created_at: string
  updated_at: string
}

export type MemberTier = 'ordinary' | 'ous' | 'out_of_ordinary'

/** Roles allowed through the admin dashboard's middleware gate. */
export const ADMIN_ROLES: readonly UserRole[] = ['admin', 'owner'] as const

export function isAdminRole(role: string | null | undefined): boolean {
  return role === 'admin' || role === 'owner'
}
