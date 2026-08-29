import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { listEntries } from '../../../core/db/entries'
import { INNER_METHODS } from '../methods'
import { IconPsyche } from '../icons'
import { plural } from '../../../core/util/text'
import type { Entry } from '../../../core/types'

export function InnerExtra() {
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const navigate = useNavigate()
  const sessions = (entries ?? []).filter((e) => e.cat === 'ai')
  const minutes = sessions.reduce((a, e) => a + (e.med?.dur ?? 0), 0)

  return (
    <>
      <StatLine>
        <StatBox value={sessions.length} label="SITZUNGEN" />
        <StatBox value={minutes} label="MINUTEN" />
        <StatBox value={sessions.length ? Math.round(minutes / sessions.length) : 0} label="Ø DAUER" />
      </StatLine>
      <TileGrid>
        {INNER_METHODS.map((m) => {
          const n = sessions.filter((e) => e.med?.method === m.key).length
          return (
            <Tile
              key={m.key}
              icon={m.icon}
              label={m.key === 'imag' ? 'Aktive Imagination' : m.name}
              hint={plural(n, 'Sitzung', 'Sitzungen')}
              tint={m.tint}
              fg={m.color}
              onClick={() => navigate(`/sitzung/${m.key}`)}
            />
          )
        })}
        <Tile
          icon={<IconPsyche />}
          label="Landkarte"
          hint="Anteile & Beziehungen"
          tint="var(--cat-ai-tint)"
          fg="var(--cat-ai-fg)"
          to="/innenwelt"
        />
      </TileGrid>
    </>
  )
}
