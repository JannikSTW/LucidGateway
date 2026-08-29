import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty } from '../ui/basics'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../ui/layout'
import { EntryRow } from '../ui/EntryRow'
import { useCategoryEntries } from '../db/entries'
import { category } from '../modules/registry'

export function CategoryScreen() {
  const { key = '' } = useParams()
  const navigate = useNavigate()
  const cat = category(key)
  const entries = useCategoryEntries(key)

  if (!cat) {
    return (
      <Screen>
        <ScreenHeader title="Unbekannt" back="/" />
        <Scroll>
          <Empty>Diese Kategorie gibt es nicht.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const recent = (entries ?? []).slice(0, 5)
  const Extra = cat.Extra

  return (
    <Screen zone={cat.zone}>
      <ScreenHeader eyebrow="Kategorie" title={cat.name} icon={cat.icon} tint={cat.tint} fg={cat.fg} back="/" />
      <Scroll tight>
        {!Extra && cat.journal && (
          <Button onClick={() => navigate(`/journal/${cat.key}`)} style={{ marginBottom: 'var(--sp-9)' }}>
            + Neuer Eintrag
          </Button>
        )}

        {Extra && <Extra />}

        <Eyebrow>Letzte Einträge</Eyebrow>
        <Card rows>
          {recent.length ? (
            recent.map((e) => <EntryRow key={e.id} entry={e} />)
          ) : (
            <Empty>
              Noch keine Einträge.
              <br />
              Leg den ersten an.
            </Empty>
          )}
        </Card>

        <Button ghost onClick={() => navigate(`/archiv?cat=${cat.key}`)}>
          Alle Einträge im Archiv →
        </Button>
      </Scroll>
    </Screen>
  )
}
