import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty } from '../../../core/ui/basics'
import { Chip, Field } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { discipline, useTrainings } from '../db'
import { TrainingRow } from '../components/TrainingRow'

export function DiscScreen() {
  const { disc = 'kraft' } = useParams()
  const d = discipline(disc)
  const list = (useTrainings() ?? []).filter((t) => t.disc === disc)
  const [venue, setVenue] = useState<string | null>(null)
  const navigate = useNavigate()

  const shown = venue ? list.filter((t) => t.venue === venue) : list

  return (
    <Screen zone="ms">
      <ScreenHeader
        eyebrow="Trainingslog"
        title={d.name}
        icon={d.icon}
        tint={d.tint}
        fg={d.color}
        back="/training"
      />
      <Scroll tight>
        <Button
          onClick={() => navigate(disc === 'kraft' ? '/training/kraft/start' : `/training/${disc}/neu`)}
          style={{ marginBottom: 'var(--sp-8)' }}
        >
          + Neue Einheit
        </Button>

        {d.venues && (
          <Field label="Ort">
            <div>
              <Chip on={venue === null} onClick={() => setVenue(null)}>
                Alle
              </Chip>
              {d.venues.map((v) => (
                <Chip key={v} on={venue === v} onClick={() => setVenue(v)}>
                  {v}
                </Chip>
              ))}
            </div>
          </Field>
        )}

        <Eyebrow>Einheiten</Eyebrow>
        <Card rows>
          {shown.length ? (
            shown.map((t) => <TrainingRow key={t.id} training={t} />)
          ) : (
            <Empty>Noch keine Einheiten hier.</Empty>
          )}
        </Card>
      </Scroll>
    </Screen>
  )
}
