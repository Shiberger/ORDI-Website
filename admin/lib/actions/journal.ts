'use server'

import { revalidatePath } from 'next/cache'
import { deleteJournalEntry, slugify, upsertJournalEntry } from '@ordi/shared'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { revalidateStorefront } from '@/lib/revalidate'

export type ActionResult = { ok: true; id: string } | { ok: false; error: string }

export async function saveJournalAction(formData: FormData): Promise<ActionResult> {
  await requireAdmin()

  const titleEn = str(formData, 'title_en')
  const titleTh = str(formData, 'title_th')
  if (!titleEn && !titleTh) return { ok: false, error: 'A title is required.' }

  const slug = str(formData, 'slug') || slugify(titleEn || titleTh)
  if (!slug) return { ok: false, error: 'Could not derive a URL slug from that title.' }

  // Existing entries keep their id; new ones get one derived from the slug.
  const id = str(formData, 'id') || slug
  const bodyEn = str(formData, 'body_en')
  const bodyTh = str(formData, 'body_th')
  const body2En = str(formData, 'body2_en')
  const body2Th = str(formData, 'body2_th')

  try {
    const db = await createClient()
    await upsertJournalEntry(db, {
      id,
      slug,
      number: str(formData, 'number'),
      date: str(formData, 'date') || new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      title: { en: titleEn, th: titleTh },
      excerpt: { en: str(formData, 'excerpt_en'), th: str(formData, 'excerpt_th') },
      body: { en: bodyEn, th: bodyTh },
      body2: body2En || body2Th ? { en: body2En, th: body2Th } : undefined,
      readtime: str(formData, 'readtime') || estimateReadtime(bodyEn + bodyTh + body2En),
      published: formData.get('published') === 'on',
    })
  } catch (err) {
    console.error('[journal] save failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Save failed.' }
  }

  revalidatePath('/journal')
  revalidatePath(`/journal/${id}`)
  await revalidateStorefront(['/', '/journal', `/journal/${slug}`])

  return { ok: true, id }
}

export async function deleteJournalAction(
  id: string,
  slug: string
): Promise<ActionResult> {
  await requireAdmin()

  try {
    const db = await createClient()
    await deleteJournalEntry(db, id)
  } catch (err) {
    console.error('[journal] delete failed', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Delete failed.' }
  }

  revalidatePath('/journal')
  await revalidateStorefront(['/', '/journal', `/journal/${slug}`])
  return { ok: true, id }
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

/** ~220 words per minute, floored at one. */
function estimateReadtime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 220))} min`
}
