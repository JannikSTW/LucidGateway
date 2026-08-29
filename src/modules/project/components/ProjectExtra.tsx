import { useLiveQuery } from 'dexie-react-hooks'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { listEntries } from '../../../core/db/entries'
import { IconNotes } from '../icons'
import type { Entry } from '../../../core/types'

export function ProjectExtra() {
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const notes = (entries ?? []).filter((e) => e.cat === 'mmm')

  return (
    <>
      <StatLine>
        <StatBox value={0} label="KLIENTEN" />
        <StatBox value={0} label="SITZUNGEN" />
        <StatBox value={0} label="TERMINE" />
      </StatLine>
      <TileGrid>
        <Tile
          icon={<IconNotes />}
          label="Projektnotizen"
          hint={`${notes.length} Notizen`}
          tint="var(--cat-mmm-tint)"
          fg="var(--cat-mmm-fg)"
          to="/journal/mmm"
        />
      </TileGrid>
    </>
  )
}
