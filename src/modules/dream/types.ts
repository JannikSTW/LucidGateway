/** Die drei Register der Traumwelt. */
export type RegisterKey = 'ort' | 'person' | 'zeichen'

export interface RegItem {
  id?: number
  register: RegisterKey
  name: string
  note: string
}

/** Von Hand gezogene Verknüpfung zwischen zwei Registerelementen. */
export type DreamLinkType = 'ist_teil' | 'fuehrt_zu' | 'begleitet' | 'gegen' | 'verwandelt'

export interface DreamLink {
  id?: number
  a: { reg: RegisterKey; name: string }
  b: { reg: RegisterKey; name: string }
  type: DreamLinkType
}

/** Frei formulierte These über Zusammenhänge. */
export type Confidence = 'Vermutet' | 'Mehrfach gesehen' | 'Ziemlich sicher'

export interface Verbindung {
  id?: number
  text: string
  refs: string[]
  conf: Confidence
  createdAt: number
}

/** Eine Frage für Reality Checks. */
export interface RcCheck {
  id?: number
  text: string
  on: boolean
}
