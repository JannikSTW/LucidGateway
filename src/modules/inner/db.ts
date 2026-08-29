import { useLiveQuery } from 'dexie-react-hooks'
import { table } from '../../core/db/db'
import { listEntries } from '../../core/db/entries'
import type { Entry } from '../../core/types'
import type { Part, PartLink, PartLinkType } from './types'

export const parts = () => table<Part>('parts')
export const partLinks = () => table<PartLink>('partLinks')

/** Vorschläge aus IFS — eigene Rollen sind ausdrücklich erwünscht. */
export const ROLE_SUGGEST: [string, string][] = [
  ['Beschützer', 'hält Kontrolle, plant, kritisiert'],
  ['Feuerwehr', 'löscht Schmerz sofort — Ablenkung, Wut, Betäubung'],
  ['Verletzt / Jung', 'trägt alte Verletzung, wird ferngehalten'],
  ['Antreiber', 'treibt an, duldet keine Pause'],
  ['Wächter', 'beobachtet, prüft, warnt'],
]

const ROLE_COLORS = [
  'var(--violet)',
  'var(--amber)',
  'var(--rose)',
  'var(--teal)',
  'var(--sky)',
  '#c9a227',
  '#9ba7c4',
]

/**
 * Jede Rolle bekommt automatisch eine Farbe. Die Reihenfolge ist stabil:
 * erst die Vorschläge, dann die eigenen in alphabetischer Folge.
 */
export function roleOrder(all: Part[]): string[] {
  const suggested = ROLE_SUGGEST.map(([r]) => r)
  const used = [...new Set(all.map((p) => p.profile?.role).filter((r): r is string => !!r))]
  const own = used.filter((r) => !suggested.includes(r)).sort((a, b) => a.localeCompare(b, 'de'))
  return [...suggested, ...own]
}

export function roleColor(role: string | undefined, all: Part[]): string {
  if (!role) return 'var(--mist)'
  const i = roleOrder(all).indexOf(role)
  return ROLE_COLORS[(i < 0 ? 0 : i) % ROLE_COLORS.length]
}

export function distLabel(d: number): string {
  return d <= 2
    ? 'vermischt — sitzt mit am Steuer'
    : d <= 5
      ? 'ansprechbar — lässt sich befragen'
      : d <= 8
        ? 'auf Abstand — meldet sich selten'
        : 'verschlossen — blockt ab'
}

export const partDist = (p: Part): number => p.profile?.dist ?? 10

export const PART_LINK_TYPES: {
  key: PartLinkType
  label: string
  color: string
  hint: string
  directed: boolean
  reverse?: string
}[] = [
  {
    key: 'schuetzt',
    label: 'schützt',
    color: 'var(--teal)',
    hint: 'bewacht einen verletzlichen Anteil',
    directed: true,
    reverse: 'wird geschützt von',
  },
  { key: 'konflikt', label: 'steht im Konflikt mit', color: 'var(--red)', hint: 'zieht in die andere Richtung', directed: false },
  { key: 'zusammen', label: 'arbeitet zusammen mit', color: 'var(--violet)', hint: 'tritt gemeinsam auf', directed: false },
  { key: 'loest', label: 'löst aus', color: 'var(--amber)', hint: 'ruft den anderen auf den Plan', directed: true, reverse: 'wird ausgelöst von' },
]

export const partLinkType = (k: PartLinkType) => PART_LINK_TYPES.find((t) => t.key === k) ?? PART_LINK_TYPES[0]

/** Wie oft ein Anteil aufgetaucht ist — aus den Sitzungen abgeleitet. */
export function partCount(entries: Entry[], name: string): number {
  return entries.filter((e) => (e.parts ?? []).includes(name)).length
}

export function entriesWithPart(entries: Entry[], name: string): Entry[] {
  return entries.filter((e) => (e.parts ?? []).includes(name))
}

export async function addPart(name: string): Promise<boolean> {
  const trimmed = name.trim()
  if (!trimmed) return false
  const all = await parts().toArray()
  if (all.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) return false
  await parts().add({ name: trimmed, note: '', profile: null })
  return true
}

export async function removePart(part: Part): Promise<void> {
  const links = await partLinks().toArray()
  await partLinks().bulkDelete(links.filter((l) => l.a === part.name || l.b === part.name).map((l) => l.id!))
  await parts().delete(part.id!)
}

export interface InnerWorld {
  entries: Entry[]
  parts: Part[]
  links: PartLink[]
}

export async function loadInnerWorld(): Promise<InnerWorld> {
  const [entries, list, links] = await Promise.all([listEntries(), parts().toArray(), partLinks().toArray()])
  return { entries, parts: list, links }
}

export function useInnerWorld(): InnerWorld | undefined {
  return useLiveQuery(() => loadInnerWorld(), [])
}

export function useParts(): Part[] | undefined {
  return useLiveQuery(() => parts().toArray(), [])
}
