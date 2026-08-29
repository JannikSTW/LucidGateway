import type { CSSProperties, ReactNode } from 'react'

export function Card({
  children,
  rows = false,
  onClick,
  className = '',
  style,
}: {
  children: ReactNode
  /** Enge Innenabstände für Listenzeilen */
  rows?: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
}) {
  const cls = `card${rows ? ' rows' : ''}${onClick ? ' tap' : ''} ${className}`.trim()
  if (onClick) {
    return (
      <button type="button" className={cls} style={style} onClick={onClick}>
        {children}
      </button>
    )
  }
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  )
}

export function Button({
  children,
  onClick,
  ghost = false,
  zoned = false,
  type = 'button',
  style,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  ghost?: boolean
  zoned?: boolean
  type?: 'button' | 'submit'
  style?: CSSProperties
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      className={`btn${ghost ? ' ghost' : ''}${zoned ? ' zoned' : ''}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function Empty({ children, compact = false }: { children: ReactNode; compact?: boolean }) {
  return <div className={`empty${compact ? ' compact' : ''}`}>{children}</div>
}

export function Pill({ children, paper = false, style }: { children: ReactNode; paper?: boolean; style?: CSSProperties }) {
  return <span className={`pill${paper ? ' paper' : ''}`} style={style}>{children}</span>
}

export function Toolbar({
  children,
  one = false,
  three = false,
}: {
  children: ReactNode
  one?: boolean
  three?: boolean
}) {
  return <div className={`toolbar${one ? ' one' : ''}${three ? ' three' : ''}`}>{children}</div>
}

/** Hinweiskasten für Grenzen und Sicherheit. */
export function Notice({
  children,
  tone,
  toneFg,
}: {
  children: ReactNode
  tone?: string
  toneFg?: string
}) {
  return (
    <div className="safety" style={{ '--tone': tone, '--tone-fg': toneFg } as CSSProperties}>
      {children}
    </div>
  )
}

export function Text({
  children,
  strong = false,
  small = false,
  pre = false,
  style,
}: {
  children: ReactNode
  strong?: boolean
  small?: boolean
  pre?: boolean
  style?: CSSProperties
}) {
  return (
    <p className={`sub${strong ? ' strong' : ''}${small ? ' small' : ''}${pre ? ' pre' : ''}`} style={style}>
      {children}
    </p>
  )
}
