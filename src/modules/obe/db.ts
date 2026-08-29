import { useLiveQuery } from 'dexie-react-hooks'
import { table } from '../../core/db/db'
import { dayLabel } from '../../core/util/date'

export interface Milestone {
  key: string
  date: string | null
}

export const milestones = () => table<Milestone, string>('obeMilestones')

/** Sieben „erste Male“ — Antippen setzt das Datum, kein Fortschrittsbalken. */
export const OBE_MILESTONES: [string, string, string][] = [
  ['vib', 'Vibrationen erlebt', 'Der klassische erste Marker'],
  ['sp', 'Schlafparalyse bewusst durchlaufen', 'Ohne Panik hindurch'],
  ['teil', 'Teilweise gelöst', 'Hand, Arm oder Oberkörper'],
  ['raum', 'Den Raum verlassen', 'Erste vollständige Ablösung'],
  ['stabil', 'Stabil bewegt', 'Länger als ein paar Sekunden'],
  ['rueck', 'Bewusst zurückgekehrt', 'Kontrollierter Abschluss'],
  ['wieder', 'Zweimal in einer Nacht', 'Wiedereinstieg gelungen'],
]

export function useMilestones(): Record<string, string | null> {
  const rows = useLiveQuery(() => milestones().toArray(), [], [] as Milestone[])
  const map: Record<string, string | null> = {}
  for (const r of rows ?? []) map[r.key] = r.date
  return map
}

export async function toggleMilestone(key: string, reached: boolean): Promise<void> {
  if (reached) await milestones().delete(key)
  else await milestones().put({ key, date: dayLabel(new Date()) })
}
