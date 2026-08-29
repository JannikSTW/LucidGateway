export interface Thought {
  id?: number
  text: string
  date: string
  iso: string
  createdAt: number
}

export type Horizon = 'leben' | 'mehr' | 'jahr' | 'alltag'
/** „losgelassen“ statt „verworfen“ — bewusst. */
export type ZielStatus = 'offen' | 'dran' | 'erreicht' | 'los'

export interface Ziel {
  id?: number
  t: string
  hor: Horizon
  area: string
  why: string
  next: string
  note: string
  status: ZielStatus
  done: string | null
  createdAt: number
}
