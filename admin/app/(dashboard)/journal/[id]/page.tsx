import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getJournalEntry } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { JournalForm } from '@/components/JournalForm'

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  return { title: id }
}

export default async function EditJournalPage({ params }: { params: Params }) {
  await requireAdmin()
  const { id } = await params

  const db = await createClient()
  const entry = await getJournalEntry(db, id)
  if (!entry) notFound()

  const storefront = process.env.STOREFRONT_URL

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">
            <Link href="/journal">← Journal</Link>
          </p>
          <h1>{entry.title.en || entry.title.th}</h1>
          <p>
            {entry.number} · {entry.date} · /journal/{entry.slug}
          </p>
        </div>
        {storefront && entry.published && (
          <a
            className="btn"
            href={`${storefront.replace(/\/$/, '')}/journal/${entry.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            View on site ↗
          </a>
        )}
      </header>

      <section className="panel">
        <div className="panel__body">
          <JournalForm entry={entry} />
        </div>
      </section>
    </>
  )
}
