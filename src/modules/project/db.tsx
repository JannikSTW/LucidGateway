import { useLiveQuery } from 'dexie-react-hooks'
import type { ReactNode } from 'react'
import { table } from '../../core/db/db'
import type { Big5, Client, ClientSession, NetzGroup, NetzItem, NetzKind, NetzLink, Termin } from './types'

export const netz = () => table<NetzItem>('netz')
export const netzLinks = () => table<NetzLink>('netzLinks')
export const termine = () => table<Termin>('termine')
export const clients = () => table<Client>('clients')
export const clientSessions = () => table<ClientSession>('clientSessions')

/** Sechs Arten in drei Gruppen — ein Objekttyp, viele Ausprägungen. */
export interface KindDef {
  label: string
  plural: string
  grp: NetzGroup
  color: string
  glyph: ReactNode
  fields: [string, string, string][]
}

export const NKINDS: Record<NetzKind, KindDef> = {
  ort: {
    label: 'Ort / Raum',
    plural: 'Orte & Räume',
    grp: 'res',
    color: 'var(--amber-fg)',
    glyph: (
      <>
        <path
          d="M0 6 C0 6 5.6 0.6 5.6 -2.4 A5.6 5.6 0 1 0 -5.6 -2.4 C-5.6 0.6 0 6 0 6 Z"
          fill="none"
          strokeWidth="1.3"
        />
        <circle cx="0" cy="-2.4" r="1.8" fill="none" strokeWidth="1.2" />
      </>
    ),
    fields: [
      ['verfueg', 'Verfügbarkeit', 'z. B. Di + Do abends'],
      ['kosten', 'Kosten', ''],
      ['kapa', 'Kapazität', ''],
    ],
  },
  doc: {
    label: 'Dokument',
    plural: 'Dokumente',
    grp: 'res',
    color: '#e8b87a',
    glyph: (
      <>
        <path d="M-4 -6 L2.4 -6 L4.6 -3.6 L4.6 6 L-4 6 Z" fill="none" strokeWidth="1.3" />
        <path d="M-1.6 -2 H2M-1.6 1 H2M-1.6 4 H0.6" strokeWidth="1.1" />
      </>
    ),
    fields: [
      ['art', 'Art', 'Konzept, Vertrag, Formular …'],
      ['stand', 'Stand', 'z. B. Entwurf v2'],
      ['ablage', 'Ablageort', ''],
    ],
  },
  mat: {
    label: 'Material',
    plural: 'Material',
    grp: 'res',
    color: '#d9a868',
    glyph: (
      <>
        <path d="M-5.5 -2.5 L0 -5.5 L5.5 -2.5 L5.5 3.5 L0 6.5 L-5.5 3.5 Z" fill="none" strokeWidth="1.3" />
        <path d="M-5.5 -2.5 L0 0.5 L5.5 -2.5M0 0.5 V6.5" strokeWidth="1.1" />
      </>
    ),
    fields: [
      ['bestand', 'Bestand', ''],
      ['zustand', 'Zustand', ''],
      ['lager', 'Lagerort', ''],
    ],
  },
  person: {
    label: 'Person',
    plural: 'Personen',
    grp: 'akt',
    color: 'var(--sky-fg)',
    glyph: (
      <>
        <circle cx="0" cy="-3.4" r="2.1" fill="none" strokeWidth="1.3" />
        <path d="M-4.4 5.2 C-4.4 1.6 -2.4 -0.2 0 -0.2 C2.4 -0.2 4.4 1.6 4.4 5.2" fill="none" strokeWidth="1.3" />
      </>
    ),
    fields: [
      ['funktion', 'Funktion', 'z. B. Leitung Jugendhaus'],
      ['org', 'Organisation', ''],
      ['kontakt', 'Kontakt', 'Telefon oder Mail'],
    ],
  },
  org: {
    label: 'Institution',
    plural: 'Institutionen',
    grp: 'akt',
    color: '#7fb0e8',
    glyph: (
      <>
        <path d="M-6 5.5 L-6 -1 L0 -5 L6 -1 L6 5.5 Z" fill="none" strokeWidth="1.3" />
        <path d="M-2.4 5.5 L-2.4 1.4 L2.4 1.4 L2.4 5.5" fill="none" strokeWidth="1.2" />
      </>
    ),
    fields: [
      ['ansprech', 'Ansprechpartner', ''],
      ['zustaendig', 'Zuständig für', ''],
      ['kontakt', 'Kontakt', ''],
    ],
  },
  qual: {
    label: 'Qualifikation',
    plural: 'Qualifikationen',
    grp: 'qual',
    color: 'var(--rose-fg)',
    glyph: (
      <>
        <circle cx="0" cy="-1.6" r="3.6" fill="none" strokeWidth="1.3" />
        <path d="M-2.4 1.6 L-3.4 6.2 L0 4.4 L3.4 6.2 L2.4 1.6" fill="none" strokeWidth="1.3" />
      </>
    ),
    fields: [
      ['anbieter', 'Anbieter', ''],
      ['stand', 'Stand', 'geplant / laufend / abgeschlossen'],
      ['gueltig', 'Gültig bis', ''],
    ],
  },
}

export const NGROUPS: Record<NetzGroup, { label: string; short: string; color: string; deg: number }> = {
  res: { label: 'Ressourcen', short: 'RESSOURCEN', color: 'var(--amber-fg)', deg: -90 },
  akt: { label: 'Institutionen & Personen', short: 'AKTEURE', color: 'var(--sky-fg)', deg: 30 },
  qual: { label: 'Qualifikationen', short: 'QUALIFIKATIONEN', color: 'var(--rose-fg)', deg: 150 },
}

export const NETZ_LINK_TYPES: [string, string][] = [
  ['gehoert', 'gehört zu'],
  ['arbeitet', 'arbeitet bei'],
  ['braucht', 'braucht'],
  ['ersetzt', 'Alternative zu'],
]

export const nkind = (k: string): KindDef => NKINDS[k as NetzKind] ?? NKINDS.person
export const ngroup = (k: string) => NGROUPS[nkind(k).grp]
export const netzLinkLabel = (k: string) => NETZ_LINK_TYPES.find(([key]) => key === k)?.[1] ?? k

/** Big Five — kein Wert ist besser als ein anderer. */
export const BIG5: [keyof Big5, string, string][] = [
  ['o', 'Offenheit', 'Neugier, Ausprobieren'],
  ['c', 'Gewissenhaftigkeit', 'Struktur, Dranbleiben'],
  ['e', 'Extraversion', 'Kontakt, Ausdruck'],
  ['a', 'Verträglichkeit', 'Kooperation, Rücksicht'],
  ['s', 'Emot. Stabilität', 'Ruhe unter Belastung'],
]

export const BIG5_KEYS = BIG5.map(([k]) => k)
export const emptyBig5 = (): Big5 => ({ o: 5, c: 5, e: 5, a: 5, s: 5 })

/** Bewertet eine Veränderung relativ zur vereinbarten Richtung. */
export function deltaColor(delta: number | null, dir: number): string {
  if (delta === null || dir === 0 || delta === 0) return 'var(--mist)'
  return (delta > 0 ? 1 : -1) === dir ? 'var(--ok-fg)' : 'var(--red-fg)'
}

export interface Netzwerk {
  items: NetzItem[]
  links: NetzLink[]
  termine: Termin[]
}

export async function loadNetzwerk(): Promise<Netzwerk> {
  const [items, links, dates] = await Promise.all([netz().toArray(), netzLinks().toArray(), termine().toArray()])
  return { items, links, termine: dates }
}

export function useNetzwerk(): Netzwerk | undefined {
  return useLiveQuery(() => loadNetzwerk(), [])
}

export const degreeOf = (links: NetzLink[], id: number) => links.filter((l) => l.a === id || l.b === id).length

export function useTermine(): Termin[] | undefined {
  return useLiveQuery(async () => {
    const all = await termine().toArray()
    return all.sort((a, b) => (a.date || '9') > (b.date || '9') ? 1 : -1)
  }, [])
}

export function useClients(): Client[] | undefined {
  return useLiveQuery(async () => (await clients().toArray()).sort((a, b) => b.createdAt - a.createdAt), [])
}

export function useClientSessions(cid: number | undefined): ClientSession[] | undefined {
  return useLiveQuery(
    async () =>
      cid === undefined
        ? []
        : (await clientSessions().where('cid').equals(cid).toArray()).sort((a, b) => b.createdAt - a.createdAt),
    [cid],
  )
}

export async function removeNetzItem(id: number): Promise<void> {
  const links = await netzLinks().toArray()
  await netzLinks().bulkDelete(links.filter((l) => l.a === id || l.b === id).map((l) => l.id!))
  const dates = await termine().where('nid').equals(id).toArray()
  for (const t of dates) await termine().update(t.id!, { nid: null })
  await netz().delete(id)
}

export async function removeClient(id: number): Promise<void> {
  const sessions = await clientSessions().where('cid').equals(id).toArray()
  await clientSessions().bulkDelete(sessions.map((s) => s.id!))
  const dates = await termine().where('cid').equals(id).toArray()
  for (const t of dates) await termine().update(t.id!, { cid: null })
  await clients().delete(id)
}
