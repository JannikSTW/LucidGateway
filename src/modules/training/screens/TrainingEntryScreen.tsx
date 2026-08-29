import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Empty, Text, Toolbar } from '../../../core/ui/basics'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row } from '../../../core/ui/rows'
import { StatBox, StatLine } from '../../../core/ui/tiles'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { discipline, trainings } from '../db'

export function TrainingEntryScreen() {
  const { id } = useParams()
  const training = useLiveQuery(async () => (id ? ((await trainings().get(Number(id))) ?? null) : null), [id])
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  if (training === undefined) return <Screen zone="ms" />
  if (training === null) {
    return (
      <Screen zone="ms">
        <ScreenHeader title="Nicht gefunden" back="/training" />
        <Scroll>
          <Empty>Diese Einheit gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const d = discipline(training.disc)

  const remove = async () => {
    const ok = await dialog.confirm({
      title: 'Einheit löschen?',
      text: `${training.focus} · ${training.date}`,
    })
    if (!ok) return
    await trainings().delete(training.id!)
    toast('Gelöscht')
    navigate(`/training/${training.disc}`)
  }

  return (
    <Screen zone="ms">
      <ScreenHeader
        eyebrow={`${d.name} · ${training.date}${training.venue ? ` · ${training.venue}` : ''}`}
        title={training.focus || d.name}
        icon={d.icon}
        tint={d.tint}
        fg={d.color}
        back={`/training/${training.disc}`}
      />
      <Scroll tight>
        <StatLine>
          <StatBox value={training.dur ?? '–'} label="MINUTEN" color={d.color} />
          <StatBox value={training.rpe ?? '–'} label="RPE" color={d.color} />
          <StatBox
            value={training.disc === 'kraft' ? (training.ex?.length ?? 0) : '–'}
            label={training.disc === 'kraft' ? 'ÜBUNGEN' : '—'}
            color={d.color}
          />
        </StatLine>

        {training.disc === 'kraft' && training.ex?.length ? (
          <>
            <Eyebrow>Übungen</Eyebrow>
            <Card rows>
              {training.ex.map((e, i) => {
                const value =
                  e.t === 'load'
                    ? `${e.kg || '–'} kg × ${e.reps || '–'}`
                    : e.t === 'time'
                      ? `${e.reps || '–'} s${e.kg ? ` +${e.kg} kg` : ''}`
                      : `${e.reps || '–'} Wdh${e.kg ? ` +${e.kg} kg` : ''}`
                return (
                  <Row
                    key={`${e.n}-${i}`}
                    icon={e.done ? '✓' : '○'}
                    tint={e.done ? 'color-mix(in srgb, var(--ok) 16%, transparent)' : 'var(--panel2)'}
                    fg={e.done ? 'var(--ok-fg)' : 'var(--mist)'}
                    title={e.n}
                    sub={`Ziel: ${e.s} × ${e.r}`}
                    right={
                      <span className="sub strong" style={{ fontSize: '12.5px' }}>
                        {value}
                      </span>
                    }
                  />
                )
              })}
            </Card>
          </>
        ) : (
          training.detail && (
            <>
              <Eyebrow>{d.detailLabel}</Eyebrow>
              <Card>
                <Text strong pre>
                  {training.detail}
                </Text>
              </Card>
            </>
          )
        )}

        {training.feel && (
          <>
            <Eyebrow>Wie war&apos;s</Eyebrow>
            <Card>
              <Text strong pre>
                {training.feel}
              </Text>
            </Card>
          </>
        )}

        <Toolbar>
          <button type="button" onClick={() => navigate(`/training/einheit/${training.id}/bearbeiten`)}>
            Bearbeiten
          </button>
          <button type="button" className="del" onClick={() => void remove()}>
            Löschen
          </button>
        </Toolbar>
      </Scroll>
    </Screen>
  )
}
