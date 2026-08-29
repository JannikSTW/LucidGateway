export interface PartProfile {
  role: string
  /** Abstand zum Selbst, 0 = vermischt … 10 = verschlossen */
  dist: number
  does: string
  protects: string
  trigger: string
  body: string
  age: string
}

export interface Part {
  id?: number
  name: string
  note: string
  profile: PartProfile | null
}

export type PartLinkType = 'schuetzt' | 'konflikt' | 'zusammen' | 'loest'

export interface PartLink {
  id?: number
  a: string
  b: string
  type: PartLinkType
}
