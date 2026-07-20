import type { MetadataRoute } from 'next'
import { getJournal, getProducts } from '@/lib/data/catalog'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticRoutes = ['', '/shop', '/about', '/journal', '/membership']
  const [products, journal] = await Promise.all([getProducts(), getJournal()])

  return [
    ...staticRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/shop/${p.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...journal.map((j) => ({
      url: `${SITE_URL}/journal/${j.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
