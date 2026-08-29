import { useLiveQuery } from 'dexie-react-hooks'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { listEntries } from '../../../core/db/entries'
import { IconInbox, IconJournal, IconTarget } from '../icons'
import { useThoughts, useZiele } from '../db'
import { plural } from '../../../core/util/text'
import { minutesToHours } from '../../../core/util/date'
import { IconKraft } from '../../training/icons'
import { trainings } from '../../training/db'
import type { Entry } from '../../../core/types'
import type { Training } from '../../training/types'

export function MindSparkExtra() {
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const sessions = useLiveQuery(() => trainings().toArray(), [], [] as Training[])
  const own = (entries ?? []).filter((e) => e.cat === 'ms')
  const minutes = (sessions ?? []).reduce((a, t) => a + (t.dur ?? 0), 0)
  const thoughts = useThoughts() ?? []
  const goals = useZiele() ?? []
  const openGoals = goals.filter((z) => z.status !== 'erreicht' && z.status !== 'los').length

  return (
    <>
      <StatLine>
        <StatBox value={own.length} label="EINTRÄGE" />
        <StatBox value={thoughts.length} label="GEDANKEN" />
        <StatBox value={sessions?.length ?? 0} label="EINHEITEN" />
      </StatLine>
      <TileGrid>
        <Tile
          icon={<IconInbox />}
          label="Gedankenspeicher"
          hint={`${thoughts.length} unsortiert`}
          tint="var(--cat-ms-tint)"
          fg="var(--cat-ms-fg)"
          to="/gedankenspeicher"
        />
        <Tile
          icon={<IconJournal />}
          label="Journal"
          hint="Gedanken & Leben"
          tint="var(--cat-ms-tint)"
          fg="var(--cat-ms-fg)"
          to="/journal/ms"
        />
        <Tile
          icon={<IconKraft />}
          label="Trainingslog"
          hint={`${minutesToHours(minutes)} Stunden`}
          tint="var(--cat-ms-tint)"
          fg="var(--cat-ms-fg)"
          to="/training"
        />
        <Tile
          icon={<IconTarget />}
          label="Ziele"
          hint={plural(openGoals, 'offen', 'offen')}
          tint="var(--cat-ms-tint)"
          fg="var(--cat-ms-fg)"
          to="/ziele"
        />
      </TileGrid>
    </>
  )
}
