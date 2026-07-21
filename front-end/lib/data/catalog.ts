import 'server-only'
import { cache } from 'react'
import {
  createPublicClient,
  getPublishedJournal,
  getPublishedProducts,
  hasSupabasePublicConfig,
  seedJournal,
  seedProducts,
  type JournalEntry,
  type Product,
} from '@ordi/shared'

/**
 * Content lives in Supabase and is edited from the admin dashboard.
 *
 * Before the Supabase project exists — and if a read ever fails at build time —
 * we fall back to the bundled seed catalogue so the storefront still renders.
 * A silent empty shop would be much worse than slightly stale copy.
 */
/** Deduped per request; ISR handles the cross-request caching. */
export const getProducts = cache(async (): Promise<Product[]> => {
  if (!hasSupabasePublicConfig()) return seedProducts

  try {
    const products = await getPublishedProducts(createPublicClient())
    return products.length > 0 ? products : seedProducts
  } catch (err) {
    console.error('[catalog] falling back to seed products:', err)
    return seedProducts
  }
})

export const getJournal = cache(async (): Promise<JournalEntry[]> => {
  if (!hasSupabasePublicConfig()) return seedJournal

  try {
    const entries = await getPublishedJournal(createPublicClient())
    return entries.length > 0 ? entries : seedJournal
  } catch (err) {
    console.error('[catalog] falling back to seed journal:', err)
    return seedJournal
  }
})

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts()
  return products.find((p) => p.id === id)
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await getProducts()
  return products.map((p) => p.id)
}

export async function getJournalBySlug(slug: string): Promise<JournalEntry | undefined> {
  const entries = await getJournal()
  return entries.find((j) => j.slug === slug)
}

export async function getJournalSlugs(): Promise<string[]> {
  const entries = await getJournal()
  return entries.map((j) => j.slug)
}
