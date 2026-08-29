import { useLiveQuery } from 'dexie-react-hooks'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { listEntries } from '../../../core/db/entries'
import { IconDream, IconGate, IconObe, IconRegisters } from '../icons'
import { IconEye } from '../../../core/ui/icons'
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
        <Tile
          icon={<IconEye />}
          label="Reality Checks"
          hint="Erinnerungen"
          tint="var(--cat-ld-tint)"
          fg="var(--cat-ld-fg)"
          to="/reality-checks"
        />
        <Tile
          icon={<IconGate />}
          label="Dream Adventures"
          hint="Skill-Tree 2024"
          tint="rgba(95, 212, 138, 0.14)"
          fg="var(--chalk-green)"
          to="/adventures"
        />
      </TileGrid>
    </>
  )
}
