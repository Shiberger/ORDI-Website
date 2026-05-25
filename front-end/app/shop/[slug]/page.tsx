import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductById, getProductSlugs } from '@/lib/data/products'
import { ProductDetail } from '@/components/product/ProductDetail'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getProductSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductById(slug)
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
  const product = getProductById(slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
