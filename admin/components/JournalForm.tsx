'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type { AdminJournalEntry } from '@ordi/shared'
import { deleteJournalAction, saveJournalAction } from '@/lib/actions/journal'

type Props = {
  /** Undefined when writing a new entry. */
  entry?: AdminJournalEntry
  nextNumber?: string
}

export function JournalForm({ entry, nextNumber }: Props) {
  const router = useRouter()
  const isNew = !entry
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function onSubmit(formData: FormData) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await saveJournalAction(formData)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setSaved(true)
      if (isNew) router.replace(`/journal/${result.id}`)
      else router.refresh()
    })
  }

  function onDelete() {
    if (!entry) return
    if (!confirm(`Delete “${entry.title.en || entry.title.th}”?`)) return

    startTransition(async () => {
      const result = await deleteJournalAction(entry.id, entry.slug)
      if (!result.ok) {
        setError(result.error)
        return
      }
      router.replace('/journal')
    })
  }

  return (
    <form action={onSubmit}>
      {error && <p className="alert">{error}</p>}
      {saved && <p className="alert alert--ok">Saved. The storefront is refreshing.</p>}

      <section className="form-section">
        <h3>Meta</h3>
        {!isNew && <input type="hidden" name="id" value={entry.id} />}

        <div className="field-row field-row--3">
          <label className="field">
            <span>Number</span>
            <input
              name="number"
              defaultValue={entry?.number ?? nextNumber}
              placeholder="JRN.004"
            />
          </label>
          <label className="field">
            <span>Date</span>
            <input name="date" defaultValue={entry?.date} placeholder="2026.07.21" />
          </label>
          <label className="field">
            <span>Read time</span>
            <input
              name="readtime"
              defaultValue={entry?.readtime}
              placeholder="auto from word count"
            />
          </label>
        </div>

        <label className="field">
          <span>URL slug</span>
          <input
            name="slug"
            defaultValue={entry?.slug}
            placeholder="derived from the English title if left blank"
          />
          <small>Becomes /journal/&lt;slug&gt;.</small>
        </label>

        <label className="checkbox">
          <input type="checkbox" name="published" defaultChecked={entry?.published ?? true} />
          <span>Published — visible on the storefront</span>
        </label>
      </section>

      <section className="form-section">
        <h3>English</h3>
        <label className="field">
          <span>Title</span>
          <input name="title_en" defaultValue={entry?.title.en} />
        </label>
        <label className="field">
          <span>Excerpt</span>
          <textarea name="excerpt_en" defaultValue={entry?.excerpt.en} rows={3} />
        </label>
        <label className="field">
          <span>Body — intro</span>
          <textarea name="body_en" defaultValue={entry?.body.en} />
        </label>
        <label className="field">
          <span>Body — full article</span>
          <textarea name="body2_en" defaultValue={entry?.body2?.en} rows={10} />
        </label>
      </section>

      <section className="form-section">
        <h3>ไทย</h3>
        <label className="field">
          <span>หัวข้อ</span>
          <input name="title_th" defaultValue={entry?.title.th} />
        </label>
        <label className="field">
          <span>เกริ่นนำ</span>
          <textarea name="excerpt_th" defaultValue={entry?.excerpt.th} rows={3} />
        </label>
        <label className="field">
          <span>เนื้อหา — บทนำ</span>
          <textarea name="body_th" defaultValue={entry?.body.th} />
        </label>
        <label className="field">
          <span>เนื้อหา — บทความเต็ม</span>
          <textarea name="body2_th" defaultValue={entry?.body2?.th} rows={10} />
        </label>
      </section>

      <div className="form-actions">
        <button className="btn btn--primary" disabled={pending}>
          {pending ? 'Saving…' : isNew ? 'Publish entry' : 'Save changes'}
        </button>
        <div className="spacer" />
        {!isNew && (
          <button
            type="button"
            className="btn btn--danger"
            onClick={onDelete}
            disabled={pending}
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
