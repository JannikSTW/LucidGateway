import { useLiveQuery } from 'dexie-react-hooks'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { listEntries } from '../../../core/db/entries'
import { IconJournal } from '../icons'
import type { Entry } from '../../../core/types'

export function MindSparkExtra() {
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const own = (entries ?? []).filter((e) => e.cat === 'ms')

  return (
    <>
      <StatLine>
        <StatBox value={own.length} label="EINTRÄGE" />
        <StatBox value={0} label="GEDANKEN" />
        <StatBox value={0} label="EINHEITEN" />
      </StatLine>
      <TileGrid>
        <Tile
          icon={<IconJournal />}
          label="Journal"
          hint="Gedanken & Leben"
          tint="var(--cat-ms-tint)"
          fg="var(--cat-ms-fg)"
          to="/journal/ms"
        />
      </TileGrid>
    </>
  )
}
