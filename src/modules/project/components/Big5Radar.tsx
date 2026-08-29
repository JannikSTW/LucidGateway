import { Radar } from '../../../core/ui/data'
import { BIG5_KEYS } from '../db'
import type { Big5 } from '../types'

/**
 * Ausgangsmessung rot gestrichelt, aktueller Stand grün — die Bewertung
 * geschieht relativ zur vereinbarten Richtung, nicht nach oben oder unten.
 */
export function Big5Radar({ current, base, size = 86 }: { current?: Big5 | null; base?: Big5 | null; size?: number }) {
  if (!current && !base) return null
  return (
    <Radar
      size={size}
      dims={BIG5_KEYS}
      gridColor="color-mix(in srgb, var(--red) 22%, transparent)"
      shapes={[
        ...(base
          ? [
              {
                values: base as unknown as Record<string, number>,
                color: 'var(--red)',
                fill: 'color-mix(in srgb, var(--red) 14%, transparent)',
                dashed: true,
              },
            ]
          : []),
        ...(current
          ? [
              {
                values: current as unknown as Record<string, number>,
                color: 'var(--ok)',
                fill: 'color-mix(in srgb, var(--ok) 22%, transparent)',
              },
            ]
          : []),
      ]}
    />
  )
}
