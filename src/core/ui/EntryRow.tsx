import { useNavigate } from 'react-router-dom'
import { Row, Chevron } from './rows'
import { Pill } from './basics'
import { Radar } from './data'
import { PROFILE_KEYS } from '../profile'
import { category } from '../modules/registry'
import type { Entry } from '../types'

/** Eine Eintragszeile — überall gleich, egal aus welcher Liste sie kommt. */
export function EntryRow({ entry, chevron = false }: { entry: Entry; chevron?: boolean }) {
  const navigate = useNavigate()
  const cat = category(entry.cat)
  if (!cat) return null

  const icon = entry.prof ? (
    <Radar
      dims={PROFILE_KEYS}
      shapes={[{ values: entry.prof as unknown as Record<string, number>, color: cat.color, fill: cat.tint }]}
      size={36}
    />
  ) : (
    cat.icon
  )

  return (
    <Row
      icon={icon}
      bareIcon={!!entry.prof}
      tint={entry.prof ? undefined : cat.tint}
      fg={entry.prof ? undefined : cat.fg}
      title={entry.title || 'Ohne Titel'}
      sub={`${entry.date} · ${cat.short}`}
      onClick={() => navigate(`/eintrag/${entry.id}`)}
      right={
        <>
          {entry.paper && <Pill paper>Scan</Pill>}
          {entry.med ? (
            <Pill style={{ background: cat.tint, color: cat.fg, borderColor: 'transparent' }}>
              {entry.med.dur ? `${entry.med.dur} Min` : '—'}
            </Pill>
          ) : (
            cat.journal && <Pill>{`${cat.journal.scale.label.slice(0, 1)}${entry.scale}`}</Pill>
          )}
          {chevron && <Chevron />}
        </>
      }
    />
  )
}
