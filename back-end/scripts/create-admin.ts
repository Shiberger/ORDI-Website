/**
 * Create a Supabase Auth user and grant it dashboard access, in one step.
 *
 *   npm run create-admin -- you@example.com
 *   npm run create-admin -- you@example.com admin
 *
 * Replaces the Dashboard → Authentication → Users → Add user flow. The account
 * is created pre-confirmed, and a strong password is generated and printed
 * once — change it after the first sign-in.
 *
 * Safe to re-run: an existing account is promoted rather than recreated, and
 * its password is left alone.
 */
import { randomBytes } from 'node:crypto'
import { createAdminClient } from '@ordi/shared'
import { loadEnv, requireSupabaseSecret, targetHost } from './env'

loadEnv()
requireSupabaseSecret()

const email = process.argv[2]
const role = process.argv[3] ?? 'owner'

if (!email || !email.includes('@')) {
  console.error('Usage: npm run create-admin -- <email> [owner|admin]')
  process.exit(1)
}
if (role !== 'owner' && role !== 'admin') {
  console.error(`Invalid role "${role}" — expected "owner" or "admin"`)
  process.exit(1)
}

/** 24 chars of url-safe entropy — long enough that rotation is optional. */
function generatePassword(): string {
  return randomBytes(18).toString('base64url')
}

async function main(): Promise<void> {
  const db = createAdminClient()

  const { data: existing, error: listError } = await db.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (listError) throw new Error(listError.message)

  let userId = existing.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )?.id
  let password: string | null = null

  if (userId) {
    console.log(`Account ${email} already exists — promoting it.`)
  } else {
    password = generatePassword()
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // no inbox round-trip for a studio account
    })
    if (error) throw new Error(error.message)
    userId = data.user.id
    console.log(`Created account ${email}`)
  }

  // The handle_new_user trigger inserts the profile row; on a brand-new user
  // that write may land a moment after createUser returns.
  let updated = false
  for (let attempt = 0; attempt < 5 && !updated; attempt++) {
    const { data, error } = await db
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select('id')

    if (error) throw new Error(error.message)
    if (data && data.length > 0) {
      updated = true
      break
    }
    await new Promise((r) => setTimeout(r, 400))
  }

  if (!updated) {
    // Trigger never fired — write the profile ourselves rather than leaving
    // an account that can sign in but not get past requireAdmin().
    const { error } = await db.from('profiles').insert({ id: userId, role })
    if (error) throw new Error(`Could not create profile row: ${error.message}`)
    console.log('(profile row created manually — the signup trigger did not fire)')
  }

  console.log(`\nProject:  ${targetHost()}`)
  console.log(`Role:     ${role}`)
  console.log(`Email:    ${email}`)
  if (password) {
    console.log(`Password: ${password}`)
    console.log('\n⚠  Shown once. Save it now, and change it after signing in.')
  } else {
    console.log('Password: unchanged')
  }
  console.log('\nSign in at http://localhost:3001')
}

main().catch((err: unknown) => {
  console.error('\nFailed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
