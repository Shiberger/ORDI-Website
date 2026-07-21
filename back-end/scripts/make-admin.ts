/**
 * Grant dashboard access to an existing Supabase user.
 *
 *   npm run make-admin --workspace=ordi-backend -- you@example.com
 *   npm run make-admin --workspace=ordi-backend -- you@example.com admin
 *
 * The user must have signed up first (Supabase Dashboard → Authentication →
 * Add user, or through the admin login page). Roles: `owner` (default) or
 * `admin`; both pass the dashboard's middleware gate.
 */
import { createAdminClient } from '@ordi/shared'
import { loadEnv, requireSupabaseSecret, targetHost } from './env'

loadEnv()
requireSupabaseSecret()

const email = process.argv[2]
const role = process.argv[3] ?? 'owner'

if (!email) {
  console.error('Usage: npm run make-admin --workspace=ordi-backend -- <email> [owner|admin]')
  process.exit(1)
}
if (role !== 'owner' && role !== 'admin') {
  console.error(`Invalid role "${role}" — expected "owner" or "admin"`)
  process.exit(1)
}

async function main(): Promise<void> {
  const db = createAdminClient()

  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (error) throw new Error(error.message)

  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
  if (!user) {
    console.error(`No Supabase user with email ${email}. Create the account first.`)
    process.exit(1)
  }

  const { error: updateError } = await db
    .from('profiles')
    .update({ role })
    .eq('id', user.id)
  if (updateError) throw new Error(updateError.message)

  console.log(`${email} is now "${role}" on ${targetHost()}.`)
}

main().catch((err: unknown) => {
  console.error('Failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
