import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/basics'
import { Label, ScreenHeader, Screen, Scroll } from '../ui/layout'
import { Tile, TileGrid } from '../ui/tiles'
import { mainCategories, quickCaptures } from '../modules/registry'

/**
 * Ein Bildschirm, zwei Absichten (FEATURES §1): Der erhobene Plus-Knopf führt
 * zum Erfassen, das Raster in die Bereiche.
 */
export function PickScreen({ mode = 'capture' }: { mode?: 'capture' | 'browse' }) {
  const navigate = useNavigate()
  const cats = mainCategories()
  const capture = mode === 'capture'

  return (
    <Screen zone="ld">
      <ScreenHeader
        eyebrow={capture ? 'Neuer Eintrag' : 'Übersicht'}
        title={capture ? 'Wofür?' : 'Felder'}
        back="/"
      />
      <Scroll tight>
        {capture &&
          quickCaptures().map((q) => (
            <Card
              key={q.to}
              className="capture-cta"
              onClick={() => navigate(q.to)}
              style={{ marginBottom: 'var(--sp-9)' }}
            >
              <div className="moon">{q.icon}</div>
              <div>
                <b>{q.label}</b>
                <span className="sub">{q.hint}</span>
              </div>
            </Card>
          ))}

        <Label>Kategorien</Label>
        <TileGrid>
          {cats.map((c) => (
            <Tile
              key={c.key}
              icon={c.icon}
              label={c.name}
              hint={capture ? (c.journal ? 'Journaleintrag' : 'Bereich öffnen') : 'Übersicht'}
              tint={c.tint}
              fg={c.fg}
              to={capture && c.journal ? `/journal/${c.key}` : `/kategorie/${c.key}`}
            />
          ))}
        </TileGrid>

        {capture && (
          <p className="sub small" style={{ textAlign: 'center' }}>
            Der Morgeneintrag braucht nur den Inhalt. Alles andere ist einklappbar.
          </p>
        )}
      </Scroll>
    </Screen>
  )
}
