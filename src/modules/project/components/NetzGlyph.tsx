import { nkind } from '../db'

/** Symbol einer Umfeld-Art, gezeichnet um den Nullpunkt. */
export function NetzGlyph({
  kind,
  x = 0,
  y = 0,
  scale = 1,
  color,
}: {
  kind: string
  x?: number
  y?: number
  scale?: number
  color?: string
}) {
  const k = nkind(kind)
  return (
    <g
      transform={`translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${scale.toFixed(2)})`}
      stroke={color ?? k.color}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {k.glyph}
    </g>
  )
}

export function NetzBadge({ kind, size = 18, color }: { kind: string; size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="-8 -8 16 16" aria-hidden="true">
      <NetzGlyph kind={kind} color={color} />
    </svg>
  )
}
