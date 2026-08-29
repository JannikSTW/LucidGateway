import type { ReactNode } from 'react'

/**
 * Formulare entstehen aus Schema-Objekten. Neue Felder kosten dadurch fast
 * nichts, und die Ansicht eines gespeicherten Eintrags kann dieselbe
 * Beschreibung wiederverwenden.
 */
export type FieldSpec =
  | { k: string; t: 'text'; label: string; ph?: string; cls?: string }
  | { k: string; t: 'number'; label: string; ph?: string; cls?: string }
  | { k: string; t: 'area'; label: string; rows?: number; ph?: string; cls?: string }
  | { k: string; t: 'single'; label: string; opts: string[]; cls?: string }
  | { k: string; t: 'multi'; label: string; opts: string[]; cls?: string }
  | { k: string; t: 'scale'; label: string; hints: string[]; cls?: string }
  | { k: string; t: 'range'; label: string; left: string; right: string; cls?: string }
  | { k: string; t: 'ba'; label: string; cls?: string }
  | {
      k: string
      t: 'custom'
      label?: string
      cls?: string
      render: (value: unknown, set: (v: unknown) => void) => ReactNode
      /** Für die Leseansicht; gibt null zurück, wenn das Feld dort nicht auftaucht. */
      describe?: (value: unknown) => string | null
    }

export type FieldValues = Record<string, unknown>

/** Menschenlesbare Fassung eines gespeicherten Wertes. */
export function describeValue(f: FieldSpec, value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null
  if (Array.isArray(value)) return value.length ? value.join(' · ') : null
  switch (f.t) {
    case 'scale':
      return `${value} — ${f.hints[Number(value)] ?? ''}`
    case 'range': {
      const v = Number(value)
      return v < 4 ? `eher ${f.left}` : v > 6 ? `eher ${f.right}` : 'ausgewogen'
    }
    case 'ba': {
      const v = value as { b?: number; a?: number }
      if (!v.b && !v.a) return null
      return `${v.b ?? '–'} → ${v.a ?? '–'}`
    }
    case 'custom':
      return f.describe ? f.describe(value) : null
    default:
      return String(value)
  }
}
