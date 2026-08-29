import { useLiveQuery } from 'dexie-react-hooks'
import { table } from '../../core/db/db'
import { entriesTable, listEntries } from '../../core/db/entries'
import { getSetting, setSetting } from '../../core/db/settings'
import type { Entry } from '../../core/types'
import type { DreamLink, RcCheck, RegItem, RegisterKey, Verbindung } from './types'

export const regItems = () => table<RegItem>('regItems')
export const dreamLinks = () => table<DreamLink>('dreamLinks')
export const verbindungen = () => table<Verbindung>('verbindungen')
export const rcChecks = () => table<RcCheck>('rcChecks')

export const REGISTERS: Record<RegisterKey, { label: string; sub: string; color: string }> = {
  ort: { label: 'Orte', sub: 'Wiederkehrende Schauplätze', color: 'var(--reg-ort)' },
  person: { label: 'Gestalten', sub: 'Figuren, die im Traum auftauchen', color: 'var(--reg-person)' },
  zeichen: { label: 'Traumzeichen', sub: 'Deine Luziditäts-Trigger', color: 'var(--reg-zeichen)' },
}

export const REGISTER_KEYS: RegisterKey[] = ['ort', 'person', 'zeichen']

/** Träume und OBEs — beide zahlen auf die Traumwelt ein. */
export function dreamEntries(entries: Entry[]): Entry[] {
  return entries.filter((e) => e.cat === 'ld' || e.cat === 'obe')
}

/**
 * Häufigkeit wird nicht mitgeschrieben, sondern aus den Einträgen abgeleitet.
 * So kann sie beim Bearbeiten oder Löschen nicht auseinanderlaufen.
 */
export function countOf(entries: Entry[], register: RegisterKey, name: string): number {
  return dreamEntries(entries).filter((e) => (e.els?.[register] ?? []).includes(name)).length
}

export function entriesWith(entries: Entry[], register: RegisterKey, name: string): Entry[] {
  return dreamEntries(entries).filter((e) => (e.els?.[register] ?? []).includes(name))
}

export async function addRegItem(register: RegisterKey, name: string): Promise<boolean> {
  const trimmed = name.trim()
  if (!trimmed) return false
  const existing = await regItems().where('register').equals(register).toArray()
  if (existing.some((x) => x.name.toLowerCase() === trimmed.toLowerCase())) return false
  await regItems().add({ register, name: trimmed, note: '' })
  return true
}

/**
 * Umbenennen zieht durch alle Stellen, an denen der Name steht: Einträge,
 * Verknüpfungen, Thesen und der Stützpunkt. Der Name ist die Identität.
 */
export async function renameRegItem(item: RegItem, name: string): Promise<boolean> {
  const trimmed = name.trim()
  if (!trimmed || trimmed === item.name) return false
  const all = await regItems().where('register').equals(item.register).toArray()
  if (all.some((x) => x.id !== item.id && x.name.toLowerCase() === trimmed.toLowerCase())) return false

  await regItems().update(item.id!, { name: trimmed })

  const entries = await entriesTable().toArray()
  for (const e of entries) {
    const names = e.els?.[item.register]
    if (!names?.includes(item.name)) continue
    await entriesTable().update(e.id!, {
      els: { ...e.els, [item.register]: names.map((n) => (n === item.name ? trimmed : n)) },
    })
  }

  const links = await dreamLinks().toArray()
  for (const l of links) {
    if (l.a.name !== item.name && l.b.name !== item.name) continue
    await dreamLinks().update(l.id!, {
      a: l.a.name === item.name ? { ...l.a, name: trimmed } : l.a,
      b: l.b.name === item.name ? { ...l.b, name: trimmed } : l.b,
    })
  }

  const theses = await verbindungen().toArray()
  for (const v of theses) {
    if (!v.refs.includes(item.name)) continue
    await verbindungen().update(v.id!, { refs: v.refs.map((r) => (r === item.name ? trimmed : r)) })
  }

  const anchor = await getAnchor()
  if (anchor?.name === item.name) await setAnchor({ ...anchor, name: trimmed })
  return true
}

export async function removeRegItem(item: RegItem): Promise<void> {
  await regItems().delete(item.id!)
  const links = await dreamLinks().toArray()
  const dead = links.filter((l) => l.a.name === item.name || l.b.name === item.name)
  await dreamLinks().bulkDelete(dead.map((l) => l.id!))
  const anchor = await getAnchor()
  if (anchor?.name === item.name) await setAnchor(null)
}

/* ---------- Stützpunkt ---------- */

export interface Anchor {
  reg: RegisterKey
  name: string
}

export const ANCHOR_KEY = 'dream.anchor'

export function getAnchor(): Promise<Anchor | null> {
  return getSetting<Anchor | null>(ANCHOR_KEY, null)
}

export function setAnchor(a: Anchor | null): Promise<void> {
  return setSetting(ANCHOR_KEY, a)
}

/* ---------- Abfragen für die Bildschirme ---------- */

export interface DreamWorld {
  entries: Entry[]
  items: RegItem[]
  links: DreamLink[]
  anchor: Anchor | null
}

export async function loadDreamWorld(): Promise<DreamWorld> {
  const [entries, items, links, anchor] = await Promise.all([
    listEntries(),
    regItems().toArray(),
    dreamLinks().toArray(),
    getAnchor(),
  ])
  return { entries, items, links, anchor }
}

export function useDreamWorld(): DreamWorld | undefined {
  return useLiveQuery(() => loadDreamWorld(), [])
}

export function useRegItems(): RegItem[] | undefined {
  return useLiveQuery(() => regItems().toArray(), [])
}
