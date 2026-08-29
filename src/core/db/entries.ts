import { useLiveQuery } from 'dexie-react-hooks'
import { table } from './db'
import { notifyEntryDeleted, rollUp } from '../modules/registry'
import { dayLabel, isoOf } from '../util/date'
import { deleteImage } from './images'
import type { Entry } from '../types'

export const entriesTable = () => table<Entry>('entries')

export type EntryDraft = Omit<Entry, 'id' | 'date' | 'iso' | 'createdAt'> &
  Partial<Pick<Entry, 'date' | 'iso' | 'createdAt'>>

export function emptyEntry(cat: string): EntryDraft {
  return {
    cat,
    title: '',
    b1: '',
    b2: '',
    scale: 0,
    tags: [],
    paper: false,
    scans: [],
    els: {},
    prof: null,
    parts: [],
    med: null,
  }
}

export async function createEntry(draft: EntryDraft): Promise<number> {
  const now = new Date()
  const row: Entry = {
    ...draft,
    date: draft.date ?? dayLabel(now),
    iso: draft.iso ?? isoOf(now),
    createdAt: draft.createdAt ?? now.getTime(),
  }
  return (await entriesTable().add(row)) as number
}

export async function updateEntry(id: number, patch: Partial<Entry>): Promise<void> {
  await entriesTable().update(id, patch)
}

export async function deleteEntry(id: number): Promise<void> {
  const entry = await entriesTable().get(id)
  if (!entry) return
  for (const imageId of entry.scans ?? []) await deleteImage(imageId)
  await entriesTable().delete(id)
  await notifyEntryDeleted(entry)
}

/** Alle Einträge, neueste zuerst. */
export async function listEntries(): Promise<Entry[]> {
  const all = await entriesTable().toArray()
  return all.sort((a, b) => (b.iso === a.iso ? b.createdAt - a.createdAt : b.iso < a.iso ? -1 : 1))
}

export function useEntries(): Entry[] | undefined {
  return useLiveQuery(() => listEntries(), [])
}

export function useEntry(id: number | undefined): Entry | undefined | null {
  return useLiveQuery(async () => (id === undefined ? null : ((await entriesTable().get(id)) ?? null)), [id])
}

/** Einträge einer Kategorie inklusive ihrer Unterkategorien. */
export function inCategory(entries: Entry[], key: string): Entry[] {
  return entries.filter((e) => e.cat === key || rollUp(e.cat) === key)
}

export function useCategoryEntries(key: string): Entry[] | undefined {
  return useLiveQuery(async () => inCategory(await listEntries(), key), [key])
}
