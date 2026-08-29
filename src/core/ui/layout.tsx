import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Ein Bildschirm. `zone` färbt Knöpfe, Chips und Regler im ganzen Teilbaum um —
 * ohne dass eine einzelne Komponente eine Farbe kennt.
 */
export function Screen({
  zone,
  children,
  className = '',
}: {
  zone?: string
  children?: ReactNode
  className?: string
}) {
  return <div className={`screen ${zone ? `zone-${zone}` : ''} ${className}`.trim()}>{children}</div>
}

export function Scroll({ children, tight = false }: { children: ReactNode; tight?: boolean }) {
  return <div className={`scroll${tight ? ' tight' : ''}`}>{children}</div>
}

export function ScreenHeader({
  eyebrow,
  title,
  icon,
  tint,
  fg,
  back,
  titleClass = 'display',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  icon?: ReactNode
  tint?: string
  fg?: string
  /** Ziel des Zurück-Pfeils. Fehlt es, geht es einen Schritt in der Historie zurück. */
  back?: string | (() => void)
  titleClass?: string
}) {
  const navigate = useNavigate()
  const goBack = () => {
    if (typeof back === 'function') back()
    else if (typeof back === 'string') navigate(back)
    else navigate(-1)
  }
  return (
    <div className="hdr">
      <button className="back" onClick={goBack} aria-label="Zurück">
        ←
      </button>
      {icon && (
        <div className="hicon" style={{ background: tint, color: fg }}>
          {icon}
        </div>
      )}
      <div className="htxt">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h2 className={titleClass}>{title}</h2>
      </div>
    </div>
  )
}

/** Kopf ohne Zurück-Pfeil (Dashboard, Archiv, Einstellungen). */
export function PageTitle({ eyebrow, title }: { eyebrow?: ReactNode; title: ReactNode }) {
  return (
    <>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h1 className="display" style={{ marginBottom: 'var(--sp-6)' }}>
        {title}
      </h1>
    </>
  )
}

export function Eyebrow({ children, className = '', style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`eyebrow ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

export function Label({ children }: { children: ReactNode }) {
  return <div className="hub-label">{children}</div>
}
