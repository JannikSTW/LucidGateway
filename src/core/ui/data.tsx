import type { CSSProperties, ReactNode } from 'react'

/** Wertebalken mit Beschriftung und Zahl. */
export function Bar({
  label,
  value,
  max = 10,
  display,
  color,
  labelWidth,
  valueColor,
}: {
  label: ReactNode
  value: number
  max?: number
  display?: ReactNode
  color?: string
  labelWidth?: number
  valueColor?: string
}) {
  return (
    <div className="statbar" style={labelWidth ? ({ '--label': `${labelWidth}px` } as CSSProperties) : undefined}>
      <label>{label}</label>
      <div className="track">
        <i style={{ width: `${Math.max(0, Math.min(1, value / max)) * 100}%`, background: color }} />
      </div>
      <span className="v" style={valueColor ? { color: valueColor } : undefined}>
        {display ?? value}
      </span>
    </div>
  )
}

export interface RadarShape {
  values: Record<string, number>
  color: string
  fill: string
  dashed?: boolean
}

/**
 * Radar für Zustandsprofil und Big Five — die vierte der vier Landkarten.
 * Sektor = Dimension, Entfernung = Ausprägung.
 */
export function Radar({
  dims,
  shapes,
  size = 86,
  gridColor = 'var(--line)',
}: {
  dims: string[]
  shapes: RadarShape[]
  size?: number
  gridColor?: string
}) {
  const points = (v: Record<string, number>) =>
    dims
      .map((k, i) => {
        const a = ((-90 + (i * 360) / dims.length) * Math.PI) / 180
        const r = 7 + ((v[k] ?? 0) / 10) * 21
        return `${(30 + r * Math.cos(a)).toFixed(1)},${(30 + r * Math.sin(a)).toFixed(1)}`
      })
      .join(' ')

  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ flexShrink: 0 }} aria-hidden="true">
      <circle cx="30" cy="30" r="28" fill="none" stroke={gridColor} strokeWidth=".8" />
      <circle cx="30" cy="30" r="16" fill="none" stroke={gridColor} strokeWidth=".8" />
      {shapes.map((s, i) => (
        <polygon
          key={i}
          points={points(s.values)}
          fill={s.fill}
          stroke={s.color}
          strokeWidth={s.dashed ? 1.2 : 1.5}
          strokeDasharray={s.dashed ? '3 2' : undefined}
        />
      ))}
    </svg>
  )
}

export function Legend({
  items,
  center = false,
}: {
  items: { label: ReactNode; color?: string; glyph?: ReactNode; line?: boolean }[]
  center?: boolean
}) {
  return (
    <div className={`wlegend${center ? ' center' : ''}`}>
      {items.map((it, i) => (
        <span key={i}>
          {it.glyph ?? (
            <i
              style={{
                background: it.color,
                ...(it.line ? { width: 12, height: 2, borderRadius: 0 } : {}),
              }}
            />
          )}
          {it.label}
        </span>
      ))}
    </div>
  )
}

export function MapNote({ children }: { children: ReactNode }) {
  return <p className="maplegend">{children}</p>
}
