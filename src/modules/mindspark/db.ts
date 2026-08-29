import { useLiveQuery } from 'dexie-react-hooks'
import { table } from '../../core/db/db'
import type { Horizon, Thought, Ziel, ZielStatus } from './types'

export const thoughts = () => table<Thought>('thoughts')
export const ziele = () => table<Ziel>('ziele')

export const ZHOR: [Horizon, string, string, string][] = [
  ['leben', 'Lebensziel', 'Richtung, kein Datum', 'var(--rose-fg)'],
  ['mehr', 'Mehrjährig', 'zwei bis fünf Jahre', 'var(--violet-fg)'],
  ['jahr', 'Dieses Jahr', 'überschaubar, aber nicht klein', 'var(--sky-fg)'],
  ['alltag', 'Alltag', 'Woche oder Monat', 'var(--amber-fg)'],
]

export const ZSTAT: [ZielStatus, string, string][] = [
  ['offen', 'offen', 'var(--mist)'],
  ['dran', 'dran', 'var(--amber)'],
  ['erreicht', 'erreicht', 'var(--ok)'],
  ['los', 'losgelassen', '#6e7480'],
]

export const ZAREAS = [
  'Beruf & IT',
  'Coaching-Projekt',
  'Körper & Training',
  'Innenwelt',
  'Beziehung',
  'Finanzen',
  'Sonstiges',
]

export const zhor = (k: string) => ZHOR.find(([key]) => key === k) ?? ZHOR[3]
export const zstat = (k: string) => ZSTAT.find(([key]) => key === k) ?? ZSTAT[0]

export const STATUS_GLYPH: Record<ZielStatus, string> = {
  offen: '○',
  dran: '▸',
  erreicht: '✓',
  los: '–',
}

export function useThoughts(): Thought[] | undefined {
  return useLiveQuery(async () => (await thoughts().toArray()).sort((a, b) => b.createdAt - a.createdAt), [])
}

export function useZiele(): Ziel[] | undefined {
  return useLiveQuery(async () => (await ziele().toArray()).sort((a, b) => a.createdAt - b.createdAt), [])
}
