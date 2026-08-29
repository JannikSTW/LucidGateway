export type NetzKind = 'ort' | 'doc' | 'mat' | 'person' | 'org' | 'qual'
export type NetzGroup = 'res' | 'akt' | 'qual'
export type NetzLinkType = 'gehoert' | 'arbeitet' | 'braucht' | 'ersetzt'

export interface NetzItem {
  id?: number
  kind: NetzKind
  name: string
  /** Felder je Art */
  d: Record<string, string>
  next: string
  note: string
}

export interface NetzLink {
  id?: number
  a: number
  b: number
  type: NetzLinkType
}

export type TerminKind = 'Einzelsession' | 'Erstgespräch' | 'Orga' | 'Sonstiges'

export interface Termin {
  id?: number
  title: string
  kind: TerminKind
  cid: number | null
  nid: number | null
  date: string
  time: string
  note: string
  done: boolean
}

export type Big5 = { o: number; c: number; e: number; a: number; s: number }
/** −1 senken · 0 halten · +1 steigern */
export type Big5Dir = { o: number; c: number; e: number; a: number; s: number }

export type AgeGroup = 'unter 14' | '14–17' | '18+'
export type GoalStatus = 'offen' | 'in Arbeit' | 'erreicht'

export interface ClientGoal {
  text: string
  status: GoalStatus
}

export interface Client {
  id?: number
  name: string
  age: AgeGroup
  consent: string | null
  reason: string
  goals: ClientGoal[]
  big5base: Big5
  b5dir: Big5Dir
  since: string
  createdAt: number
}

export interface ClientSession {
  id?: number
  cid: number
  dur: number | null
  mood: string
  focus: string
  topic: string
  talk: string
  train: string
  bridge: string
  self: string
  big5: Big5
  iso: string
  date: string
  createdAt: number
}
