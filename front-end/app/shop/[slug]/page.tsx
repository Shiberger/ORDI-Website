import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById, getProductSlugs } from '@/lib/data/catalog'
import { ProductDetail } from '@/components/product/ProductDetail'

type Params = { slug: string }

// Products added in the admin dashboard appear without a redeploy: pages are
// prerendered from the DB at build time, then revalidated on demand by
// /api/revalidate (hourly as a safety net).
export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductById(slug)
  if (!product) return {}
  return {
    title: `${product.name} ${product.number}`,
    description: product.tagline.en,
    openGraph: {
      title: `${product.name} ${product.number} — ORDI`,
      description: product.tagline.en,
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const product = await getProductById(slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
