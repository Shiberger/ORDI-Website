/**
 * Push the studio's published price list into `product_sizes`.
 *
 *   npm run set-prices --workspace=ordi-backend                  # dev
 *   ORDI_TARGET=prod npm run set-prices --workspace=ordi-backend # live
 *
 * Prices normally move from the dashboard. This script exists for the case the
 * dashboard is bad at: repricing the whole collection at once, from a list
 * somebody can read and check against the shop shelf.
 *
 * Idempotent and narrow — it writes `price` and nothing else, so product copy,
 * imagery and publish state set in the dashboard are never touched. Sizes that
 * do not exist in the database are reported, not created; a missing row means
 * the catalogue and this list disagree about what is sold, and that is a
 * decision, not a silent insert.
 */
import { createAdminClient } from '@ordi/shared'
import { loadEnv, requireSupabaseSecret, targetHost } from './env'

loadEnv()
requireSupabaseSecret()

/** THB, tax inclusive. Last reviewed 2026-09-08. */
const PRICE_LIST: { productId: string; ml: number; price: number }[] = [
  { productId: 'good-boy', ml: 50, price: 1390 },
  { productId: 'good-boy', ml: 12, price: 390 },
  { productId: 'hot-dilf', ml: 50, price: 1390 },
  { productId: 'hot-dilf', ml: 12, price: 390 },
  { productId: 'sea-breeze', ml: 50, price: 1390 },
  { productId: 'sea-breeze', ml: 12, price: 390 },
  { productId: 'drowning-love', ml: 50, price: 1390 },
  { productId: 'drowning-love', ml: 12, price: 390 },
  { productId: 'cloud-fon', ml: 50, price: 1690 },
  { productId: 'cloud-fon', ml: 12, price: 590 },
]

async function main(): Promise<void> {
  const db = createAdminClient()
  console.log(`\nProject: ${targetHost()}\n`)

  const { data: current, error } = await db
    .from('product_sizes')
    .select('id, product_id, ml, price')

  if (error) throw error

  let changed = 0
  let missing = 0

  for (const want of PRICE_LIST) {
    const row = current?.find((r) => r.product_id === want.productId && r.ml === want.ml)
    const label = `${want.productId} ${want.ml}ml`.padEnd(24)

    if (!row) {
      console.log(`  ✗ ${label} not in the catalogue — skipped`)
      missing += 1
      continue
    }

    if (row.price === want.price) {
      console.log(`  · ${label} ${want.price} (unchanged)`)
      continue
    }

    const { error: updateError } = await db
      .from('product_sizes')
      .update({ price: want.price })
      .eq('id', row.id)

    if (updateError) throw updateError

    console.log(`  ✓ ${label} ${row.price} → ${want.price}`)
    changed += 1
  }

  console.log(`\n${changed} price(s) updated, ${missing} missing.`)
  if (changed > 0) {
    console.log(
      'Storefront product pages revalidate hourly — edit and save the product\n' +
        'in the dashboard, or redeploy, to publish the new price immediately.'
    )
  }
}

main().catch((err: unknown) => {
  console.error('\nset-prices failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
