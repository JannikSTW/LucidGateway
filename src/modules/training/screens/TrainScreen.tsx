import { useNavigate } from 'react-router-dom'
import { Card, Empty, Text } from '../../../core/ui/basics'
import { Legend } from '../../../core/ui/data'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { StatBox, StatLine, Tile, TileGrid } from '../../../core/ui/tiles'
import { WEEKDAYS, minutesToHours, rollingWeek, todayIso } from '../../../core/util/date'
import { plural } from '../../../core/util/text'
import { DISCIPLINES, DISCIPLINE_KEYS, useTrainings } from '../db'
import { TrainingRow } from '../components/TrainingRow'
import { IconMindSpark } from '../../mindspark/icons'

export function TrainScreen() {
  const list = useTrainings() ?? []
  const navigate = useNavigate()
  const minutes = list.reduce((a, t) => a + (t.dur ?? 0), 0)
  const rpeValues = list.filter((t) => t.rpe)
  const avgRpe = rpeValues.length
    ? Math.round((rpeValues.reduce((a, t) => a + (t.rpe ?? 0), 0) / rpeValues.length) * 10) / 10
    : 0
  const today = todayIso()

  return (
    <Screen zone="ms">
      <ScreenHeader
        eyebrow="MindSpark"
        title="Trainingslog"
        icon={<IconMindSpark />}
        tint="var(--cat-ms-tint)"
        fg="var(--cat-ms-fg)"
        back="/kategorie/ms"
      />
      <Scroll tight>
        <Text style={{ marginBottom: 'var(--sp-7)' }}>
          Nur dein eigenes Training. Coaching-Einheiten und alles andere aus der Wachwelt gehören ins
          MindSpark-Journal.
        </Text>

        <StatLine>
          <StatBox value={list.length} label="EINHEITEN" />
          <StatBox value={minutesToHours(minutes)} label="STUNDEN" />
          <StatBox value={avgRpe || '–'} label="Ø RPE" />
        </StatLine>

        <Card style={{ marginBottom: 'var(--sp-9)' }}>
          <Eyebrow>Diese Woche</Eyebrow>
          <div className="week">
            {rollingWeek().map(({ iso, date, offset }) => {
              const day = list.filter((t) => t.iso === iso)
              const color = day.length ? DISCIPLINES[day[0].disc].color : null
              return (
                <div key={iso} className={`wcol${iso === today ? ' today' : ''}${offset > 0 ? ' fut' : ''}`}>
                  <b>{WEEKDAYS[date.getDay()]}</b>
                  <div className="wsegs one">
                    <i className={color ? 'on' : ''} style={color ? { background: color, color } : undefined} />
                    {day.length > 1 && <span className="more">+{day.length - 1}</span>}
                  </div>
                  <span className="dnum">{date.getDate()}.</span>
                </div>
              )
            })}
          </div>
          <Legend items={DISCIPLINE_KEYS.map((k) => ({ label: DISCIPLINES[k].short, color: DISCIPLINES[k].color }))} />
        </Card>

        <Eyebrow>Disziplinen</Eyebrow>
        <TileGrid>
          {DISCIPLINE_KEYS.map((k) => {
            const d = DISCIPLINES[k]
            const n = list.filter((t) => t.disc === k).length
            return (
              <Tile
                key={k}
                icon={d.icon}
                label={d.short}
                hint={plural(n, 'Einheit', 'Einheiten')}
                tint={d.tint}
                fg={d.color}
                onClick={() => navigate(`/training/${k}`)}
              />
            )
          })}
        </TileGrid>

        <Eyebrow>Letzte Einheiten</Eyebrow>
        <Card rows>
          {list.length ? (
            list.slice(0, 4).map((t) => <TrainingRow key={t.id} training={t} />)
          ) : (
            <Empty>Noch keine Einheiten.</Empty>
          )}
        </Card>
      </Scroll>
    </Screen>
  )
}
