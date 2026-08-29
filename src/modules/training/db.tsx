import { useLiveQuery } from 'dexie-react-hooks'
import { table } from '../../core/db/db'
import { IconAus, IconKraft, IconMma, IconMob } from './icons'
import type { DisciplineKey, Template, Training } from './types'
import type { ReactNode } from 'react'

export const trainings = () => table<Training>('trainings')
export const templates = () => table<Template>('templates')

export interface Discipline {
  name: string
  short: string
  icon: ReactNode
  color: string
  tint: string
  venues?: string[]
  focusLabel: string
  focus: string[]
  detailLabel: string
  detailPh: string
}

export const DISCIPLINES: Record<DisciplineKey, Discipline> = {
  kraft: {
    name: 'Kraft & Calisthenics',
    short: 'Kraft',
    icon: <IconKraft />,
    color: 'var(--amber)',
    tint: 'var(--cat-ms-tint)',
    focusLabel: 'Schwerpunkt',
    focus: ['Zug & Grip', 'Druck & Core', 'Beine', 'Skills', 'Griffkraft'],
    detailLabel: 'Übungen',
    detailPh: 'z. B.\nKlimmzüge 4×8\nDips 3×12\nKniebeugen 4×10',
  },
  mma: {
    name: 'MMA-Training',
    short: 'MMA',
    icon: <IconMma />,
    color: '#ec6a5a',
    tint: 'rgba(236, 106, 90, 0.14)',
    venues: ['Jugendhaus', 'German Top Team'],
    focusLabel: 'Schwerpunkt',
    focus: ['Striking', 'Grappling', 'Clinch', 'Sparring', 'Technik', 'Drills'],
    detailLabel: 'Inhalt & Runden',
    detailPh: 'z. B.\n6×3 Min Sparring\nTakedown-Drills\nGuard-Passing',
  },
  mob: {
    name: 'Mobility',
    short: 'Mobility',
    icon: <IconMob />,
    color: '#7fc8a9',
    tint: 'rgba(127, 200, 169, 0.14)',
    focusLabel: 'Bereich',
    focus: ['Hüfte', 'Schulter', 'Wirbelsäule', 'Sprunggelenk', 'Ganzkörper'],
    detailLabel: 'Übungen',
    detailPh: 'z. B.\n90/90 Hüfte\nSchulter-Dislocates\nKatze-Kuh',
  },
  aus: {
    name: 'Ausdauer',
    short: 'Ausdauer',
    icon: <IconAus />,
    color: 'var(--sky)',
    tint: 'rgba(111, 168, 245, 0.14)',
    focusLabel: 'Art',
    focus: ['Laufen', 'Rad', 'Intervalle', 'Seilspringen', 'Schwimmen'],
    detailLabel: 'Umfang',
    detailPh: 'z. B.\n6 km locker\n8×400 m\n45 Min Grundlage',
  },
}

export const DISCIPLINE_KEYS = Object.keys(DISCIPLINES) as DisciplineKey[]

export const discipline = (k: string): Discipline => DISCIPLINES[k as DisciplineKey] ?? DISCIPLINES.kraft

export function useTrainings(): Training[] | undefined {
  return useLiveQuery(async () => {
    const all = await trainings().toArray()
    return all.sort((a, b) => (b.iso === a.iso ? b.createdAt - a.createdAt : b.iso < a.iso ? -1 : 1))
  }, [])
}

export function useTemplates(): Template[] | undefined {
  return useLiveQuery(() => templates().toArray(), [])
}

/** Die letzten erreichten Werte einer Übung — Orientierung ohne Bewertung. */
export function lastFor(list: Training[], name: string): string | null {
  for (const t of list) {
    if (t.disc !== 'kraft' || !t.ex) continue
    const e = t.ex.find((x) => x.n === name && (x.reps || x.kg))
    if (!e) continue
    if (e.t === 'load') return `zuletzt ${e.kg || '–'} kg × ${e.reps || '?'}`
    if (e.t === 'time') return `zuletzt ${e.reps || '?'} s${e.kg ? ` +${e.kg} kg` : ''}`
    return `zuletzt ${e.reps || '?'} Wdh${e.kg ? ` +${e.kg} kg` : ''}`
  }
  return null
}

/** Fünf Vorlagen fürs Balkon-Gym — bearbeitbar, nicht in Stein. */
export const DEFAULT_TEMPLATES: Template[] = [
  {
    key: 'zug',
    name: 'Zug & Grip',
    ex: [
      { n: 'Klimmzüge (streng, Griff rotieren)', s: 5, r: '3–6', t: 'bw' },
      { n: 'Handtuch-Klimmzüge', s: 3, r: '5–8', t: 'bw' },
      { n: 'Einarmiges KH-Rudern', s: 4, r: '8–10 je Seite', t: 'load' },
      { n: 'Hängendes Beinheben (Polster)', s: 3, r: '10–15', t: 'bw' },
      { n: 'Hammer Curls', s: 3, r: '10–12', t: 'load' },
      { n: 'Dead Hang / Handtuchhang', s: 3, r: 'max', t: 'time' },
    ],
  },
  {
    key: 'druck',
    name: 'Druck & Core',
    ex: [
      { n: 'Dips', s: 4, r: '6–10', t: 'bw' },
      { n: 'Liegestütze an Griffen (eng/Archer)', s: 3, r: 'AMRAP-2', t: 'bw' },
      { n: 'KH-Schulterdrücken', s: 3, r: '8–10', t: 'load' },
      { n: 'Ab Wheel Rollouts (Knie)', s: 3, r: '6–10', t: 'bw' },
      { n: 'Sandbag Anti-Rotation halten', s: 3, r: '30–40 s je Seite', t: 'time' },
    ],
  },
  {
    key: 'beine',
    name: 'Beine & Explosivität',
    ex: [
      { n: 'Sandbag Clean & Squat', s: 4, r: '5', t: 'load' },
      { n: 'Bulgarian Split Squat (Fuß aufs Basisrohr)', s: 3, r: '8–10 je Seite', t: 'load' },
      { n: 'Sandbag Shouldering im Wechsel', s: 3, r: '5 je Seite', t: 'load' },
      { n: 'Single-Leg RDL', s: 3, r: '10 je Seite', t: 'load' },
      { n: 'Squat Jumps (explosiv)', s: 3, r: '5', t: 'bw' },
      { n: 'Bear Hug Carry / Halten', s: 3, r: '40 s', t: 'time' },
    ],
  },
  {
    key: 'skills',
    name: 'Skills',
    ex: [
      { n: 'Negative Muscle-Ups', s: 4, r: '3', t: 'bw' },
      { n: 'Archer-Klimmzüge', s: 3, r: '4–6 je Seite', t: 'bw' },
      { n: 'Pike-Liegestütze', s: 3, r: '6–10', t: 'bw' },
      { n: 'L-Sit an den Dipstangen', s: 4, r: 'max', t: 'time' },
      { n: 'Hollow Hold', s: 3, r: '30–45 s', t: 'time' },
    ],
  },
  {
    key: 'grip',
    name: 'Griffkraft',
    ex: [
      { n: 'Dead Hangs', s: 4, r: 'max', t: 'time' },
      { n: 'Handtuchhang', s: 3, r: 'max', t: 'time' },
      { n: 'Farmers Walk (Tasche)', s: 3, r: '40 m', t: 'load' },
      { n: 'Bear Hug Hold', s: 3, r: '45 s', t: 'time' },
    ],
  },
]

export async function seedTemplates(): Promise<void> {
  const count = await templates().count()
  if (count > 0) return
  await templates().bulkAdd(DEFAULT_TEMPLATES.map((t) => ({ ...t, ex: t.ex.map((e) => ({ ...e })) })))
}
