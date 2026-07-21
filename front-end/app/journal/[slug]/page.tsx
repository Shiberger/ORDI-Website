import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJournal, getJournalBySlug, getJournalSlugs } from '@/lib/data/catalog'
import { JournalArticle } from '@/components/journal/JournalArticle'

type Params = { slug: string }

export const revalidate = 3600
export const dynamicParams = true

export async function generateStaticParams(): Promise<Params[]> {
  const slugs = await getJournalSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = await getJournalBySlug(slug)
  if (!entry) return {}
  return {
    title: `${entry.title.en} — Journal`,
    description: entry.excerpt.en,
    openGraph: {
      title: `${entry.title.en} — ORDI Journal`,
      description: entry.excerpt.en,
    },
  }
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const entry = await getJournalBySlug(slug)
  if (!entry) notFound()
  const entries = await getJournal()
  const related = entries.filter((j) => j.slug !== slug).slice(0, 2)
  return <JournalArticle entry={entry} related={related} />
}
