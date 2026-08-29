import { useLiveQuery } from 'dexie-react-hooks'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { listEntries } from '../../../core/db/entries'
import { IconDream, IconObe, IconRegisters } from '../icons'
import type { Entry } from '../../../core/types'

/** Statistik und Kacheln des Bereichs „Luzides Träumen“. */
export function DreamExtra() {
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const dreams = (entries ?? []).filter((e) => e.cat === 'ld')
  const obes = (entries ?? []).filter((e) => e.cat === 'obe')
  const lucid = dreams.filter((e) => e.scale >= 2).length

  return (
    <>
      <StatLine>
        <StatBox value={dreams.length} label="TRÄUME" />
        <StatBox value={lucid} label="LUZIDE" />
        <StatBox value={obes.length} label="OBE" />
      </StatLine>
      <TileGrid>
        <Tile
          icon={<IconDream />}
          label="Traumjournal"
          hint="Morgeneintrag"
          tint="var(--cat-ld-tint)"
          fg="var(--cat-ld-fg)"
          to="/journal/ld"
        />
        <Tile
          icon={<IconObe />}
          label="Außerkörperlich"
          hint="Eigener Bereich"
          tint="var(--cat-obe-tint)"
          fg="var(--cat-obe-fg)"
          to="/obe"
        />
        <Tile
          icon={<IconRegisters />}
          label="Traumwelt"
          hint="Karte & Register"
          tint="var(--cat-ld-tint)"
          fg="var(--cat-ld-fg)"
          to="/traumwelt"
        />
      </TileGrid>
    </>
  )
}
