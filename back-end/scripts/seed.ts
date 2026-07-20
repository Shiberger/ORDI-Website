/**
 * Push the original hand-written catalogue into Supabase.
 *
 *   npm run seed --workspace=ordi-backend
 *
 * Idempotent: products and journal entries are upserted by primary key, so
 * re-running overwrites the seeded rows and leaves anything you added in the
 * admin dashboard alone.
 */
import {
  createAdminClient,
  seedJournal,
  seedProducts,
  upsertJournalEntry,
  upsertProduct,
} from '@ordi/shared'
import { loadEnv, requireSupabaseSecret, targetHost } from './env'

loadEnv()
requireSupabaseSecret()

async function main(): Promise<void> {
  const db = createAdminClient()

  console.log(`\nProject:  ${targetHost()}`)
  console.log(`\nSeeding ${seedProducts.length} products…`)
  for (const [index, product] of seedProducts.entries()) {
    await upsertProduct(db, {
      ...product,
      published: true,
      sort_order: index,
      sizes: product.sizes,
    })
    console.log(`  ✓ ${product.number}  ${product.name}`)
  }

  console.log(`\nSeeding ${seedJournal.length} journal entries…`)
  for (const entry of seedJournal) {
    await upsertJournalEntry(db, { ...entry, published: true })
    console.log(`  ✓ ${entry.number}  ${entry.title.en.slice(0, 48)}`)
  }

  console.log('\nDone.')
}

main().catch((err: unknown) => {
  console.error('\nSeed failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
