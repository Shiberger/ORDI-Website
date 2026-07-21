import { mapJournalRow, toJournalRow, toPublicJournal } from '../mappers'
import type { AdminJournalEntry, JournalEntry } from '../types/product'
import { unwrap, type DB } from './client'

/** Storefront journal index — newest first. */
export async function getPublishedJournal(db: DB): Promise<JournalEntry[]> {
  const rows = unwrap(
    'getPublishedJournal',
    await db
      .from('journal_entries')
      .select('*')
      .eq('published', true)
      .order('date', { ascending: false })
  )
  return rows.map((r) => toPublicJournal(mapJournalRow(r)))
}

export async function getPublishedJournalBySlug(
  db: DB,
  slug: string
): Promise<JournalEntry | null> {
  const { data, error } = await db
    .from('journal_entries')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle()
  if (error) throw new Error(`getPublishedJournalBySlug(${slug}): ${error.message}`)
  return data ? toPublicJournal(mapJournalRow(data)) : null
}

/** Admin index — includes drafts. */
export async function listJournal(db: DB): Promise<AdminJournalEntry[]> {
  const rows = unwrap(
    'listJournal',
    await db.from('journal_entries').select('*').order('date', { ascending: false })
  )
  return rows.map(mapJournalRow)
}

export async function getJournalEntry(
  db: DB,
  id: string
): Promise<AdminJournalEntry | null> {
  const { data, error } = await db
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`getJournalEntry(${id}): ${error.message}`)
  return data ? mapJournalRow(data) : null
}

export type JournalInput = Pick<
  AdminJournalEntry,
  | 'id'
  | 'slug'
  | 'number'
  | 'date'
  | 'title'
  | 'excerpt'
  | 'body'
  | 'body2'
  | 'readtime'
  | 'published'
>

export async function upsertJournalEntry(db: DB, input: JournalInput): Promise<void> {
  unwrap(
    'upsertJournalEntry',
    await db.from('journal_entries').upsert(toJournalRow(input)).select('id')
  )
}

export async function deleteJournalEntry(db: DB, id: string): Promise<void> {
  unwrap(
    'deleteJournalEntry',
    await db.from('journal_entries').delete().eq('id', id).select('id')
  )
}
