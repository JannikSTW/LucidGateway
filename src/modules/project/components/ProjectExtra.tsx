import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { listEntries } from '../../../core/db/entries'
import { fmtDate } from '../../../core/util/date'
import { plural } from '../../../core/util/text'
import { clientSessions, useClients, useNetzwerk, useTermine } from '../db'
import { IconCalendar, IconClients, IconNetwork, IconNotes } from '../icons'
import type { Entry } from '../../../core/types'
import type { ClientSession } from '../types'

export function ProjectExtra() {
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const sessions = useLiveQuery(() => clientSessions().toArray(), [], [] as ClientSession[])
  const clients = useClients() ?? []
  const dates = useTermine() ?? []
  const net = useNetzwerk()
  const navigate = useNavigate()

  const notes = (entries ?? []).filter((e) => e.cat === 'mmm')
  const open = dates.filter((t) => !t.done)
  const next = open[0]

  return (
    <>
      {next && (
        <button type="button" className="nextup" onClick={() => navigate('/projekt/termine')}>
          <div className="eyebrow">Als Nächstes</div>
          <b>{next.title}</b>
          <span>
            {fmtDate(next.date)}
            {next.time ? ` · ${next.time} Uhr` : ''} · {next.kind}
          </span>
        </button>
      )}

      <StatLine>
        <StatBox value={clients.length} label="KLIENTEN" />
        <StatBox value={sessions?.length ?? 0} label="SITZUNGEN" />
        <StatBox value={open.length} label="TERMINE" />
      </StatLine>

      <TileGrid>
        <Tile
          icon={<IconNetwork />}
          label="Umfeld"
          hint={plural(net?.items.length ?? 0, 'Element', 'Elemente')}
          tint="var(--cat-mmm-tint)"
          fg="var(--cat-mmm-fg)"
          to="/projekt/umfeld"
        />
        <Tile
          icon={<IconNotes />}
          label="Projektnotizen"
          hint={`${notes.length} Notizen`}
          tint="var(--cat-mmm-tint)"
          fg="var(--cat-mmm-fg)"
          to="/journal/mmm"
        />
        <Tile
          icon={<IconCalendar />}
          label="Termine"
          hint={`${open.length} anstehend`}
          tint="var(--cat-mmm-tint)"
          fg="var(--cat-mmm-fg)"
          to="/projekt/termine"
        />
        <Tile
          icon={<IconClients />}
          label="Klienten"
          hint={plural(clients.length, 'Person', 'Personen')}
          tint="var(--cat-mmm-tint)"
          fg="var(--cat-mmm-fg)"
          to="/projekt/klienten"
        />
      </TileGrid>
    </>
  )
}
