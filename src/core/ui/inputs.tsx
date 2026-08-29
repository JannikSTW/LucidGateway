import type { CSSProperties, ReactNode } from 'react'

export function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label?: ReactNode
  hint?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`field ${className}`.trim()}>
      {label !== undefined && <label>{label}</label>}
      {children}
      {hint !== undefined && <div className="seg-hint">{hint}</div>}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'date' | 'time'
  inputMode?: 'text' | 'numeric' | 'decimal'
}) {
  return (
    <input
      type={type}
      value={value}
      inputMode={inputMode}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
}

export function NumberPair({ children }: { children: ReactNode }) {
  return <div className="numrow">{children}</div>
}

/* ---------- Chips ---------- */

export function Chip({
  children,
  on = false,
  onClick,
  tone,
  style,
}: {
  children: ReactNode
  on?: boolean
  onClick?: () => void
  /** Eigene Farbe (z. B. Rolle oder Verknüpfungsart) */
  tone?: string
  style?: CSSProperties
}) {
  return (
    <button
      type="button"
      className={`chip${on ? ' on' : ''}${tone ? ' tinted' : ''}`}
      style={{ ...(tone ? ({ '--tone': tone } as CSSProperties) : {}), ...style }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

/** Mehrfachauswahl aus einer Liste. */
export function ChipMulti({
  options,
  value,
  onChange,
  extra,
}: {
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
  extra?: ReactNode
}) {
  return (
    <div>
      {options.map((o) => (
        <Chip
          key={o}
          on={value.includes(o)}
          onClick={() => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])}
        >
          {o}
        </Chip>
      ))}
      {extra}
    </div>
  )
}

/** Einfachauswahl; erneutes Antippen hebt die Auswahl auf, wenn `clearable`. */
export function ChipSingle({
  options,
  value,
  onChange,
  clearable = false,
  extra,
  toneOf,
}: {
  options: string[]
  value: string | null
  onChange: (v: string | null) => void
  clearable?: boolean
  extra?: ReactNode
  toneOf?: (option: string) => string | undefined
}) {
  return (
    <div>
      {options.map((o) => (
        <Chip
          key={o}
          on={value === o}
          tone={toneOf?.(o)}
          onClick={() => onChange(clearable && value === o ? null : o)}
        >
          {o}
        </Chip>
      ))}
      {extra}
    </div>
  )
}

/* ---------- Umschalter ---------- */

export function ModeSwitch<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { key: T; label: ReactNode }[]
  value: T
  onChange: (v: T) => void
  style?: CSSProperties
}) {
  return (
    <div className="modeswitch" style={style}>
      {options.map((o) => (
        <button key={o.key} type="button" className={value === o.key ? 'on' : ''} onClick={() => onChange(o.key)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- Gestufte Segmentleiste ---------- */

export function Segmented({
  count,
  value,
  onChange,
  hints,
  labels,
  small = false,
  from = 0,
}: {
  count: number
  value: number | null
  onChange: (v: number) => void
  hints?: string[]
  labels?: string[]
  small?: boolean
  from?: number
}) {
  const items = Array.from({ length: count }, (_, i) => i + from)
  return (
    <>
      <div className={`seg${small ? ' small' : ''}`} style={{ '--cols': count } as CSSProperties}>
        {items.map((v, i) => (
          <button key={v} type="button" className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
            {labels ? labels[i] : v}
          </button>
        ))}
      </div>
      {hints && <div className="seg-hint">{value === null ? '' : hints[value - from]}</div>}
    </>
  )
}

/* ---------- Regler ---------- */

export function SliderRow({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  title,
}: {
  label: ReactNode
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  title?: string
}) {
  return (
    <div className="dimrow" title={title}>
      <label>{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} />
      <output>{value}</output>
    </div>
  )
}

export function RangeRow({
  value,
  onChange,
  left,
  right,
  min = 0,
  max = 10,
}: {
  value: number
  onChange: (v: number) => void
  left: string
  right: string
  min?: number
  max?: number
}) {
  return (
    <>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(+e.target.value)} />
      <div className="slider2">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </>
  )
}

/* ---------- Punktereihe 1–5 ---------- */

export function Dots({
  value,
  onChange,
  count = 5,
}: {
  value: number
  onChange: (v: number) => void
  count?: number
}) {
  return (
    <div className="dots">
      {Array.from({ length: count }, (_, i) => i + 1).map((v) => (
        <button key={v} type="button" className={value >= v ? 'on' : ''} onClick={() => onChange(value === v ? 0 : v)}>
          {v}
        </button>
      ))}
    </div>
  )
}

/* ---------- Schalter ---------- */

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i />
    </label>
  )
}

export function SettingRowUI({
  title,
  sub,
  right,
}: {
  title: ReactNode
  sub?: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="setrow">
      <div className="txt">
        <b>{title}</b>
        {sub !== undefined && <span>{sub}</span>}
      </div>
      {right}
    </div>
  )
}

/* ---------- Aufklapper ---------- */

export function Fold({
  summary,
  children,
  open,
}: {
  summary: ReactNode
  children: ReactNode
  open?: boolean
}) {
  return (
    <details className="fold" open={open}>
      <summary>{summary}</summary>
      <div className="inner">{children}</div>
    </details>
  )
}
