import { useNavigate } from 'react-router-dom'
import { Card, Text } from '../../../core/ui/basics'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Tile, TileGrid } from '../../../core/ui/tiles'
import { useLiveQuery } from 'dexie-react-hooks'
import { DreamMap } from '../components/DreamMap'
import { GlyphBadge } from '../components/glyphs'
import { IconThesis } from '../icons'
import { REGISTERS, REGISTER_KEYS, useDreamWorld, verbindungen } from '../db'
import { plural } from '../../../core/util/text'

export function DreamWorldScreen() {
  const world = useDreamWorld()
  const navigate = useNavigate()
  const theses = useLiveQuery(() => verbindungen().count(), [], 0)

  return (
    <Screen zone="ld">
      <ScreenHeader eyebrow="Luzides Träumen" title="Traumwelt" back="/kategorie/ld" />
      <Scroll tight>
        <Text style={{ marginBottom: 'var(--sp-7)' }}>
          Deine Traumwelt, kartografiert aus dem, was du beim Traumeintrag antippst. Was gemeinsam auftaucht, ist
          auf der Karte verbunden.
        </Text>

        <Card className="mapcard" style={{ marginBottom: 'var(--sp-9)' }}>
          {world && <DreamMap world={world} onOpen={(reg, name) => navigate(`/traumwelt/register/${reg}/${encodeURIComponent(name)}`)} />}
        </Card>

        <TileGrid>
          {REGISTER_KEYS.map((key) => {
            const n = (world?.items ?? []).filter((i) => i.register === key).length
            return (
              <Tile
                key={key}
                icon={<GlyphBadge kind={key} color={REGISTERS[key].color} size={30} />}
                label={REGISTERS[key].label}
                hint={`${n} erfasst`}
                tint="var(--cat-ld-tint)"
                to={`/traumwelt/register/${key}`}
              />
            )
          })}
          <Tile
            icon={<IconThesis />}
            label="Verbindungen"
            hint={plural(theses ?? 0, 'These', 'Thesen')}
            tint="var(--cat-ld-tint)"
            fg="var(--cat-ld-fg)"
            to="/traumwelt/verbindungen"
          />
        </TileGrid>
      </Scroll>
    </Screen>
  )
}
