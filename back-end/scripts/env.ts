import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '../..')

/**
 * Which Supabase project a script talks to.
 *
 *   npm run seed                      → dev   (front-end/.env.local)
 *   ORDI_TARGET=prod npm run seed     → live  (back-end/.env.production.local)
 *
 * Defaulting to dev is the safety property that matters: running a script by
 * reflex must never touch real orders. Production requires opting in with an
 * env var you have to type on purpose.
 */
const DEV_CANDIDATES = [
  resolve(repoRoot, 'back-end/.env.local'),
  resolve(repoRoot, 'front-end/.env.local'),
  resolve(repoRoot, '.env.local'),
]

const PROD_FILE = resolve(repoRoot, 'back-end/.env.production.local')

export function loadEnv(): void {
  const target = process.env.ORDI_TARGET === 'prod' ? 'prod' : 'dev'

  if (target === 'prod') {
    if (!existsSync(PROD_FILE)) {
      console.error(
        `ORDI_TARGET=prod but ${PROD_FILE.replace(repoRoot + '/', '')} does not exist.\n` +
          'Create it with the production project\'s NEXT_PUBLIC_SUPABASE_URL and\n' +
          'SUPABASE_SECRET_KEY. See back-end/supabase/SETUP.md.'
      )
      process.exit(1)
    }
    config({ path: PROD_FILE })
    console.log('\n\x1b[41m\x1b[97m  TARGET: PRODUCTION  \x1b[0m')
    console.log(`env loaded from ${PROD_FILE.replace(repoRoot + '/', '')}\n`)
    return
  }

  const found = DEV_CANDIDATES.find(existsSync)
  if (!found) {
    console.error('No .env.local found. Looked in:')
    for (const c of DEV_CANDIDATES) console.error(`  ${c}`)
    process.exit(1)
  }
  config({ path: found })
  console.log(`env loaded from ${found.replace(repoRoot + '/', '')} (dev)`)
}

/** The project host the loaded credentials point at, for confirmation output. */
export function targetHost(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return url ? new URL(url).hostname.replace('.supabase.co', '') : 'unknown'
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing ${name} — add it to your .env.local`)
    process.exit(1)
  }
  return value
}

/**
 * Scripts write with the secret key, which bypasses RLS. Accepts either key
 * generation: `sb_secret_…` (current) or a legacy `service_role` JWT.
 */
export function requireSupabaseSecret(): void {
  requireEnv('NEXT_PUBLIC_SUPABASE_URL')

  if (!process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      'Missing SUPABASE_SECRET_KEY — copy the secret key from\n' +
        '  Supabase → Project Settings → API Keys → Secret keys\n' +
        'and add it to your .env.local'
    )
    process.exit(1)
  }
}
