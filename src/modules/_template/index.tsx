import { registerModule } from '../../core/modules/registry'
import { Card, Empty } from '../../core/ui/basics'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../core/ui/layout'
import { StatBox, StatLine, Tile, TileGrid } from '../../core/ui/tiles'
import { Ic } from '../../core/ui/icons'

/**
 * VORLAGE FÜR NEUE MODULE
 * =======================
 * Ein Modul beschreibt sich vollständig selbst: eigene Tabellen, eigene
 * Kategorien, eigene Wege. Der Kern liest nur diese Beschreibung — deshalb
 * muss für ein neues Modul nie etwas am Kern geändert werden.
 *
 * Aufbau:
 *   src/modules/<name>/
 *     index.tsx      ← Registrierung (diese Datei)
 *     types.ts       ← Datentypen
 *     db.ts          ← Tabellenzugriff und Abfragen
 *     components/    ← Bausteine, die nur dieses Modul braucht
 *     screens/       ← Bildschirme, die in `routes` eingehängt werden
 *
 * Diese Vorlage wird nicht angemeldet. Zum Ausprobieren in
 * src/modules/index.ts aufnehmen.
 */

const Icon = () => (
  <Ic box={32}>
    <circle cx="16" cy="16" r="10" />
    <path d="M16 10v12M10 16h12" />
  </Ic>
)

function BeispielExtra() {
  return (
    <>
      <StatLine>
        <StatBox value={0} label="EINS" />
        <StatBox value={0} label="ZWEI" />
        <StatBox value={0} label="DREI" />
      </StatLine>
      <TileGrid>
        <Tile icon={<Icon />} label="Unterbereich" hint="eigener Weg" to="/beispiel" />
      </TileGrid>
    </>
  )
}

function BeispielScreen() {
  return (
    <Screen zone="ld">
      <ScreenHeader eyebrow="Vorlage" title="Unterbereich" back="/kategorie/beispiel" />
      <Scroll tight>
        <Card>
          <Eyebrow>So funktioniert es</Eyebrow>
          <Empty>Hier stünde der Inhalt des Moduls.</Empty>
        </Card>
      </Scroll>
    </Screen>
  )
}

export function registerTemplateModule() {
  registerModule({
    id: 'beispiel',
    name: 'Beispielmodul',
    tables: { beispielItems: '++id, name' },
    categories: [
      {
        key: 'beispiel',
        name: 'Beispiel',
        short: 'Beispiel',
        color: 'var(--cat-ld)',
        tint: 'var(--cat-ld-tint)',
        fg: 'var(--cat-ld-fg)',
        zone: 'ld',
        icon: <Icon />,
        order: 99,
        journal: {
          b1: { label: 'Beobachtung', ph: 'Was war?' },
          b2: { label: 'Einordnung', ph: 'Was folgt daraus?' },
          scale: { label: 'Wirkung', hints: ['—', 'kaum', 'leicht', 'deutlich', 'stark', 'sehr stark'] },
          tags: ['Marker A', 'Marker B'],
        },
        Extra: BeispielExtra,
      },
    ],
    routes: [{ path: 'beispiel', element: <BeispielScreen /> }],
  })
}
