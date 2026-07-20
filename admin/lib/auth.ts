import 'server-only'
import { redirect } from 'next/navigation'
import { isAdminRole, type Profile, type UserRole } from '@ordi/shared'
import { createClient } from './supabase/server'

export type AdminSession = {
  userId: string
  email: string
  role: UserRole
  name: string
}

/**
 * The single gate for every dashboard page and server action. Middleware only
 * proves *someone* is signed in; this proves they are allowed in here.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, role')
    .eq('id', user.id)
    .maybeSingle<Pick<Profile, 'first_name' | 'last_name' | 'role'>>()

  if (!isAdminRole(profile?.role)) redirect('/login?error=not_admin')

  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ')

  return {
    userId: user.id,
    email: user.email ?? '',
    role: profile!.role,
    name: name || (user.email ?? 'Admin'),
  }
}
