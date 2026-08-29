import type { ReactNode } from 'react'
import type { FieldSpec, FieldValues } from '../ui/form/schema'
import type { Entry } from '../types'

/**
 * Sitzungen (Meditation, Breathwork, Imagination, OBE) folgen alle demselben
 * Muster: Timer, Schema-Formular, ein Eintrag am Ende. Die Module beschreiben
 * nur ihre Felder — den Rest übernimmt der Kern.
 */
export interface SessionMethod {
  key: string
  name: string
  sub?: string
  /** Kategorie, in der der Eintrag landet */
  cat: string
  zone: string
  icon: ReactNode
  color: string
  tint: string
  presets: number[]
  safety?: string
  fields: FieldSpec[]
  /** Wohin die Sitzung nach dem Sichern zurückführt */
  back: string
  /** Übersetzt die Formularwerte in die Felder des Eintrags. */
  toEntry: (vals: FieldValues) => Partial<Entry>
}

const methods = new Map<string, SessionMethod>()

export function registerSessionMethod(def: SessionMethod): void {
  methods.set(def.key, def)
}

export function sessionMethod(key: string): SessionMethod | undefined {
  return methods.get(key)
}

export function sessionMethods(): SessionMethod[] {
  return [...methods.values()]
}
