import type { CSSProperties, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

/** Kachelraster, zwei Spalten. */
export function TileGrid({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="tiles" style={style}>
      {children}
    </div>
  )
}

export function Tile({
  icon,
  label,
  hint,
  to,
  onClick,
  tint,
  fg,
}: {
  icon: ReactNode
  label: ReactNode
  hint?: ReactNode
  to?: string
  onClick?: () => void
  tint?: string
  fg?: string
}) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className="tile"
      style={{ '--tile-tint': tint, '--tile-fg': fg } as CSSProperties}
      onClick={onClick ?? (to ? () => navigate(to) : undefined)}
    >
      <span className="ti">{icon}</span>
      <b>{label}</b>
      <span className="cnt">{hint}</span>
    </button>
  )
}

/** Statistikzeile mit drei Boxen. */
export function StatLine({ children }: { children: ReactNode }) {
  return <div className="statline">{children}</div>
}

export function StatBox({ value, label, color }: { value: ReactNode; label: string; color?: string }) {
  return (
    <div className="statbox">
      <b style={color ? { color } : undefined}>{value}</b>
      <span>{label}</span>
    </div>
  )
}
