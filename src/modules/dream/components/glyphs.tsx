import type { ReactNode } from 'react'
import type { RegisterKey } from '../types'

/**
 * Symbole der Traumwelt-Karte, gezeichnet um den Nullpunkt: Bergsilhouette
 * für Orte, Silhouette für Gestalten, Mondsichel für Traumzeichen — und das
 * Haus für den Stützpunkt.
 */
export type GlyphKind = RegisterKey | 'anchor'

export function GlyphPath({ kind }: { kind: GlyphKind }): ReactNode {
  switch (kind) {
    case 'ort':
      return <path d="M-7 4.2 L-2.4 -2.6 L0.6 1.2 L4 -3.8 L7.4 4.2 Z" fill="none" strokeWidth="1.3" />
    case 'person':
      return (
        <>
          <circle cx="0" cy="-3.4" r="2.1" fill="none" strokeWidth="1.3" />
          <path
            d="M-4.4 5.2 C-4.4 1.6 -2.4 -0.2 0 -0.2 C2.4 -0.2 4.4 1.6 4.4 5.2"
            fill="none"
            strokeWidth="1.3"
          />
        </>
      )
    case 'zeichen':
      return (
        <path d="M2.4 -5.4 A5.4 5.4 0 1 0 2.4 5.4 A4.2 4.2 0 1 1 2.4 -5.4 Z" fill="none" strokeWidth="1.3" />
      )
    case 'anchor':
      return (
        <>
          <path d="M-7 1.4 L0 -5.4 L7 1.4" fill="none" strokeWidth="1.6" />
          <path d="M-5 0.6 L-5 6.4 L5 6.4 L5 0.6" fill="none" strokeWidth="1.6" />
          <path d="M-1.6 6.4 L-1.6 2.4 L1.6 2.4 L1.6 6.4" fill="none" strokeWidth="1.3" />
        </>
      )
  }
}

export function Glyph({
  kind,
  x = 0,
  y = 0,
  scale = 1,
  color,
}: {
  kind: GlyphKind
  x?: number
  y?: number
  scale?: number
  color: string
}) {
  return (
    <g
      transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${scale.toFixed(2)})`}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <GlyphPath kind={kind} />
    </g>
  )
}

/** Kleines Symbol für Listen und Legenden. */
export function GlyphBadge({ kind, color, size = 18 }: { kind: GlyphKind; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-8 -8 16 16" aria-hidden="true">
      <Glyph kind={kind} color={color} />
    </svg>
  )
}
