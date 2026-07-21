import Link from 'next/link'
import type { Metadata } from 'next'
import { listJournal } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Journal' }

export default async function JournalListPage() {
  await requireAdmin()
  const db = await createClient()
  const entries = await listJournal(db)

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Editorial</p>
          <h1>Journal</h1>
          <p>
            {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} ·{' '}
            {entries.filter((e) => e.published).length} published
          </p>
        </div>
        <Link href="/journal/new" className="btn btn--primary">
          + New entry
        </Link>
      </header>

      <section className="panel">
        {entries.length === 0 ? (
          <p className="empty">No journal entries yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{e.number}</td>
                    <td>
                      <Link href={`/journal/${e.id}`}>{e.title.en || e.title.th}</Link>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{e.slug}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{e.date}</td>
                    <td>
                      <span className={`badge${e.published ? '' : ' badge--draft'}`}>
                        {e.published ? 'published' : 'draft'}
                      </span>
                    </td>
                    <td className="num">
                      <Link href={`/journal/${e.id}`} className="btn btn--sm">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
