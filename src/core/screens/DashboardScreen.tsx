import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { Card } from '../ui/basics'
import { Eyebrow, Label, PageTitle, Screen, Scroll } from '../ui/layout'
import { Legend } from '../ui/data'
import { Tile, TileGrid } from '../ui/tiles'
import { IconArchiveBig } from '../ui/icons'
import { useToast } from '../ui/toast'
import { listEntries } from '../db/entries'
import { allTools, collectDayMarkers, mainCategories, rollUp } from '../modules/registry'
import { WEEKDAYS, rollingWeek, todayIso } from '../util/date'
import { plural } from '../util/text'
import type { DayMarker, Entry } from '../types'

export function DashboardScreen() {
  const navigate = useNavigate()
  const toast = useToast()
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const markers = useLiveQuery(() => collectDayMarkers(), [], [] as DayMarker[])
  const cats = mainCategories()
  const week = rollingWeek()
  const today = todayIso()

  const activity = new Map<string, { done: Set<string>; planned: Set<string>; labels: string[] }>()
  const bucket = (iso: string) => {
    let b = activity.get(iso)
    if (!b) {
      b = { done: new Set(), planned: new Set(), labels: [] }
      activity.set(iso, b)
    }
    return b
  }
  for (const e of entries ?? []) {
    const b = bucket(e.iso)
    b.done.add(rollUp(e.cat))
    b.labels.push(e.title || 'Eintrag')
  }
  for (const m of markers ?? []) {
    const b = bucket(m.iso)
    if (m.planned) b.planned.add(m.cat)
    else b.done.add(m.cat)
    b.labels.push(m.label)
  }

  const dayInfo = (iso: string, label: string) => {
    const b = activity.get(iso)
    toast(b && b.labels.length ? `${label} ${[...new Set(b.labels)].join(' · ')}` : `${label} nichts erfasst`)
  }

  const countOf = (key: string) => (entries ?? []).filter((e) => rollUp(e.cat) === key).length

  return (
    <Screen zone="ld">
      <Scroll>
        <PageTitle eyebrow="Persönliches Forschungsjournal" title="Lucid Gateway" />

        <Card style={{ marginBottom: 'var(--sp-9)' }}>
          <Eyebrow>Diese Woche</Eyebrow>
          <div className="week">
            {week.map(({ iso, date, offset }) => {
              const b = activity.get(iso)
              const future = offset > 0
              const planned = (b?.planned.size ?? 0) > 0
              return (
                <button
                  key={iso}
                  type="button"
                  className={`wcol${iso === today ? ' today' : ''}${future ? ' fut' : ''}${
                    planned && future ? ' plan' : ''
                  }`}
                  onClick={() => dayInfo(iso, `${WEEKDAYS[date.getDay()]} ${date.getDate()}.`)}
                >
                  <b>{WEEKDAYS[date.getDay()]}</b>
                  <div className="wsegs">
                    {cats.map((c) => {
                      const on = b?.done.has(c.key)
                      const pl = !on && b?.planned.has(c.key)
                      return (
                        <i
                          key={c.key}
                          className={`${on ? 'on' : ''}${pl ? ' plan' : ''}`.trim()}
                          style={on ? { background: c.fg, color: c.fg } : undefined}
                        />
                      )
                    })}
                  </div>
                  <span className="dnum">{date.getDate()}.</span>
                </button>
              )
            })}
          </div>
          <Legend
            items={[
              ...cats.map((c) => ({ label: c.short, color: c.fg })),
              {
                label: 'geplant',
                glyph: <i style={{ background: 'transparent', boxShadow: 'inset 0 0 0 1.5px var(--red)' }} />,
              },
            ]}
          />
        </Card>

        <Label>Kategorien</Label>
        <TileGrid>
          {cats.map((c) => {
            const n = countOf(c.key)
            return (
              <Tile
                key={c.key}
                icon={c.icon}
                label={c.name}
                hint={c.tileHint ? c.tileHint(n) : plural(n, 'Eintrag', 'Einträge')}
                tint={c.tint}
                fg={c.fg}
                to={`/kategorie/${c.key}`}
              />
            )
          })}
        </TileGrid>

        <Label>Werkzeuge</Label>
        <TileGrid>
          <Tile
            icon={<IconArchiveBig />}
            label="Archiv"
            hint={plural(entries?.length ?? 0, 'Eintrag', 'Einträge')}
            tint="var(--cat-ms-tint)"
            fg="var(--amber-fg)"
            onClick={() => navigate('/archiv')}
          />
          {allTools().map((t) => (
            <ToolTileView key={t.id} id={t.id} />
          ))}
        </TileGrid>
      </Scroll>
    </Screen>
  )
}

/** Werkzeugkachel eines Moduls — der Hinweistext darf aus der Datenbank kommen. */
function ToolTileView({ id }: { id: string }) {
  const tool = allTools().find((t) => t.id === id)
  const hint = useLiveQuery(async () => (tool?.hint ? await tool.hint() : ''), [id], '')
  if (!tool) return null
  return <Tile icon={tool.icon} label={tool.label} hint={hint} tint={tool.tint} fg={tool.fg} to={tool.to} />
}
