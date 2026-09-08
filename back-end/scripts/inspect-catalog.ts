/**
 * Read-only dump of the catalogue a Supabase project is currently serving.
 *
 *   npm run inspect --workspace=ordi-backend
 *   ORDI_TARGET=prod npm run inspect --workspace=ordi-backend
 */
import { createAdminClient } from '@ordi/shared'
import { loadEnv, requireSupabaseSecret, targetHost } from './env'

loadEnv()
requireSupabaseSecret()

async function main(): Promise<void> {
  const db = createAdminClient()
  console.log(`\nProject: ${targetHost()}\n`)

  const { data, error } = await db
    .from('products')
    .select('id, name, number, status, published, featured, sort_order, image_url, product_sizes(ml, price)')
    .order('sort_order')

  if (error) throw error

  for (const p of data ?? []) {
    const sizes = (p.product_sizes ?? [])
      .slice()
      .sort((a, b) => b.ml - a.ml)
      .map((s) => `${s.ml}ml ${s.price}`)
      .join('  ')
    console.log(
      `${p.number}  ${p.name.padEnd(16)} ${p.status.padEnd(12)} ` +
        `pub=${p.published} feat=${p.featured} sort=${p.sort_order}\n` +
        `        sizes: ${sizes}\n` +
        `        image_url: ${p.image_url ?? '—'}`
    )
  }
}

main().catch((err: unknown) => {
  console.error('\nInspect failed:', err instanceof Error ? err.message : err)
  process.exit(1)
})
