import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJournalBySlug, getJournalSlugs, journal } from '@/lib/data/journal'
import { JournalArticle } from '@/components/journal/JournalArticle'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return getJournalSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getJournalBySlug(slug)
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
  const entry = getJournalBySlug(slug)
  if (!entry) notFound()
  const related = journal.filter((j) => j.slug !== slug).slice(0, 2)
  return <JournalArticle entry={entry} related={related} />
}
