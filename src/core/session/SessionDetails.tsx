import { Card } from '../ui/basics'
import { Eyebrow } from '../ui/layout'
import { describeValue } from '../ui/form/schema'
import { sessionMethod } from './registry'
import type { Entry } from '../types'

/** Die gespeicherten Sitzungsfelder in der Eintragsansicht. */
export function SessionDetails({ entry }: { entry: Entry }) {
  if (!entry.med) return null
  const def = sessionMethod(entry.med.method)
  if (!def) return null

  // Fließtexte und eigene Abschnitte stehen weiter unten als eigene Karten —
  // hier nur die kurzen Angaben.
  const rows = def.fields
    .filter((f) => f.t !== 'area' && f.t !== 'custom')
    .map((f) => ({ label: f.label, text: describeValue(f, entry.med!.vals[f.k]) }))
    .filter((r) => r.text)

  return (
    <Card>
      <Eyebrow>{def.name}</Eyebrow>
      <b style={{ fontSize: 15 }}>{entry.med.dur ? `${entry.med.dur} Minuten` : 'Dauer nicht erfasst'}</b>
      {rows.length > 0 && (
        <div style={{ marginTop: 'var(--sp-4)' }}>
          {rows.map((r) => (
            <div key={r.label} className="checkrow" style={{ borderBottom: '1px solid var(--line)' }}>
              <label>{r.label}</label>
              <span className="val">{r.text}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
