import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'

/** Anklickbarer Bereich, der andere Knöpfe enthalten darf (z. B. „Löschen“). */
function tapProps(onClick?: () => void) {
  if (!onClick) return {}
  return {
    role: 'button',
    tabIndex: 0,
    onClick,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onClick()
      }
    },
  }
}

/**
 * Die Zeile mit Icon, Text und Pfeil — der meistbenutzte Baustein der App.
 */
export function Row({
  icon,
  title,
  sub,
  right,
  onClick,
  tint,
  fg,
  wrapTitle = false,
  bareIcon = false,
  titleStyle,
  subStyle,
}: {
  icon?: ReactNode
  title: ReactNode
  sub?: ReactNode
  right?: ReactNode
  onClick?: () => void
  tint?: string
  fg?: string
  wrapTitle?: boolean
  bareIcon?: boolean
  titleStyle?: CSSProperties
  subStyle?: CSSProperties
}) {
  return (
    <div className={`entry${onClick ? '' : ' static'}`} {...tapProps(onClick)}>
      {icon !== undefined && (
        <span className={`ei${bareIcon ? ' bare' : ''}`} style={{ background: tint, color: fg }}>
          {icon}
        </span>
      )}
      <div className="et">
        <b className={wrapTitle ? 'wrap' : undefined} style={titleStyle}>
          {title}
        </b>
        {sub !== undefined && <span style={subStyle}>{sub}</span>}
      </div>
      {right}
    </div>
  )
}

export function Chevron() {
  return <span className="chev">›</span>
}

/** Größere Zeile mit 44er-Icon (Disziplinen, Klienten). */
export function BigRow({
  icon,
  title,
  sub,
  right,
  onClick,
  tint,
  fg,
}: {
  icon: ReactNode
  title: ReactNode
  sub?: ReactNode
  right?: ReactNode
  onClick?: () => void
  tint?: string
  fg?: string
}) {
  return (
    <div className="disc" {...tapProps(onClick)}>
      <span className="di" style={{ background: tint, color: fg }}>
        {icon}
      </span>
      <div className="dt">
        <b>{title}</b>
        {sub !== undefined && <span>{sub}</span>}
      </div>
      {right}
    </div>
  )
}

export function DeleteRowButton({ onClick, glyph = '✕', label = 'Entfernen' }: { onClick: () => void; glyph?: string; label?: string }) {
  return (
    <button
      type="button"
      className="rowdel"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={label}
    >
      {glyph}
    </button>
  )
}
