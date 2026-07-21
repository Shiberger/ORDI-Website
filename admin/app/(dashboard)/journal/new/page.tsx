import Link from 'next/link'
import type { Metadata } from 'next'
import { listJournal } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { JournalForm } from '@/components/JournalForm'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'New entry' }

export default async function NewJournalPage() {
  await requireAdmin()
  const db = await createClient()
  const entries = await listJournal(db)

  // Continue the JRN.00n sequence rather than making the writer look it up.
  const nextNumber = `JRN.${String(entries.length + 1).padStart(3, '0')}`

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">
            <Link href="/journal">← Journal</Link>
          </p>
          <h1>New entry</h1>
          <p>Write in both languages — the storefront switches on the reader&apos;s preference.</p>
        </div>
      </header>

      <section className="panel">
        <div className="panel__body">
          <JournalForm nextNumber={nextNumber} />
        </div>
      </section>
    </>
  )
}
