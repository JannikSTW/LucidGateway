import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty, Text, Toolbar } from '../../../core/ui/basics'
import { Bar, Legend } from '../../../core/ui/data'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, Chevron, DeleteRowButton } from '../../../core/ui/rows'
import { StatBox, StatLine } from '../../../core/ui/tiles'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { fmtDate } from '../../../core/util/date'
import { plural } from '../../../core/util/text'
import { BIG5, clients, deltaColor, removeClient, useClientSessions, useClients, useTermine } from '../db'
import { Big5Radar } from '../components/Big5Radar'
import type { GoalStatus } from '../types'

const ORDER: GoalStatus[] = ['offen', 'in Arbeit', 'erreicht']

export function ClientScreen() {
  const { id } = useParams()
  const cid = Number(id)
  const client = (useClients() ?? []).find((c) => c.id === cid)
  const sessions = useClientSessions(cid) ?? []
  const dates = useTermine() ?? []
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  if (!client) {
    return (
      <Screen zone="mmm">
        <ScreenHeader title="Klient" back="/projekt/klienten" />
        <Scroll>
          <Empty>Diesen Klienten gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const next = dates.find((t) => !t.done && t.cid === cid && t.date)
  const withBig5 = sessions.filter((s) => s.big5)
  const current = withBig5.length ? withBig5[0].big5 : null

  const cycleGoal = async (index: number) => {
    const goals = [...client.goals]
    const g = goals[index]
    goals[index] = { ...g, status: ORDER[(ORDER.indexOf(g.status) + 1) % ORDER.length] }
    await clients().update(cid, { goals })
  }

  const addGoal = async () => {
    const text = await dialog.text({ title: 'Neues Ziel', placeholder: 'z. B. Nein sagen können' })
    if (!text) return
    await clients().update(cid, { goals: [...client.goals, { text, status: 'offen' }] })
  }

  const delGoal = async (index: number) => {
    const ok = await dialog.confirm({ title: 'Ziel entfernen?', text: client.goals[index].text })
    if (!ok) return
    await clients().update(cid, { goals: client.goals.filter((_, i) => i !== index) })
  }

  const remove = async () => {
    const ok = await dialog.confirm({
      title: 'Klient löschen?',
      text: `${client.name} — alle Protokolle und Ziele werden mitgelöscht.`,
    })
    if (!ok) return
    await removeClient(cid)
    toast('Gelöscht')
    navigate('/projekt/klienten')
  }

  return (
    <Screen zone="mmm">
      <ScreenHeader
        eyebrow="Klient"
        title={client.name}
        icon={<span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{client.name.slice(0, 2).toUpperCase()}</span>}
        tint="var(--cat-mmm-tint)"
        fg="var(--cat-mmm-fg)"
        back="/projekt/klienten"
      />
      <Scroll tight>
        <StatLine>
          <StatBox value={sessions.length} label="SITZUNGEN" />
          <StatBox
            value={`${client.goals.filter((g) => g.status === 'erreicht').length}/${client.goals.length}`}
            label="ZIELE"
          />
          <StatBox value={client.age} label="ALTER" />
        </StatLine>

        <Card>
          {next ? (
            <div
              style={{
                margin: '-2px 0 var(--sp-5)',
                padding: '10px 12px',
                borderRadius: 11,
                background: 'color-mix(in srgb, var(--red) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--red) 35%, transparent)',
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 3 }}>
                Nächster Termin
              </div>
              <b style={{ fontSize: 14 }}>
                {fmtDate(next.date)}
                {next.time ? ` · ${next.time} Uhr` : ''}
              </b>
            </div>
          ) : (
            <Text small style={{ marginBottom: 'var(--sp-4)', color: 'var(--red-fg)' }}>
              Kein Folgetermin geplant
            </Text>
          )}
          <Eyebrow>Anlass</Eyebrow>
          <Text strong pre>
            {client.reason || 'Nicht hinterlegt'}
          </Text>
          <Text small style={{ marginTop: 'var(--sp-4)' }}>
            Seit {client.since}
            {client.consent ? ` · Einverständnis: ${client.consent}` : ''}
          </Text>
        </Card>

        <Card>
          <Eyebrow>Big Five — Verlauf</Eyebrow>
          <div style={{ display: 'flex', gap: 'var(--sp-7)', alignItems: 'center', marginTop: 'var(--sp-2)' }}>
            <Big5Radar current={current} base={client.big5base} size={92} />
            <div style={{ flex: 1, minWidth: 0 }}>
              {BIG5.map(([k, label]) => {
                const b = client.big5base[k]
                const v = current ? current[k] : null
                const delta = v !== null ? v - b : null
                const dir = client.b5dir[k] ?? 0
                const arrow = dir === 1 ? '↑' : dir === -1 ? '↓' : ''
                return (
                  <Bar
                    key={k}
                    labelWidth={100}
                    label={
                      <>
                        {label}
                        {arrow && <span className="dirtag">{arrow}</span>}
                      </>
                    }
                    value={v ?? b}
                    color={v !== null ? 'var(--ok)' : 'var(--red)'}
                    valueColor={deltaColor(delta, dir)}
                    display={delta === null ? (v ?? b) : delta > 0 ? `+${delta}` : delta === 0 ? '±0' : delta}
                  />
                )
              })}
            </div>
          </div>
          <Legend
            items={[
              { label: 'Ausgangsmessung', color: 'var(--red)', line: true },
              { label: withBig5.length ? 'letzte Sitzung' : 'noch keine Sitzung', color: 'var(--ok)', line: true },
            ]}
          />
          <Text small style={{ marginTop: 'var(--sp-3)' }}>
            Kein Wert ist besser — Pfeile zeigen die vereinbarte Richtung. Grün heißt: Bewegung dorthin.
            {withBig5.length ? ` ${plural(withBig5.length, 'Messpunkt', 'Messpunkte')} seit ${client.since}` : ''}
          </Text>
        </Card>

        <Eyebrow>Ziele</Eyebrow>
        <Card rows>
          {client.goals.length ? (
            client.goals.map((g, i) => (
              <Row
                key={`${g.text}-${i}`}
                icon={g.status === 'erreicht' ? '✓' : '○'}
                tint={
                  g.status === 'erreicht'
                    ? 'color-mix(in srgb, var(--ok) 16%, transparent)'
                    : 'var(--cat-mmm-tint)'
                }
                fg={g.status === 'erreicht' ? 'var(--ok-fg)' : 'var(--cat-mmm-fg)'}
                title={g.text}
                sub={g.status}
                wrapTitle
                onClick={() => void cycleGoal(i)}
                right={<DeleteRowButton onClick={() => void delGoal(i)} />}
              />
            ))
          ) : (
            <Empty compact>Noch kein Ziel hinterlegt.</Empty>
          )}
        </Card>
        <Button ghost onClick={() => void addGoal()} style={{ marginBottom: 'var(--sp-8)' }}>
          + Ziel ergänzen
        </Button>

        <Button onClick={() => navigate(`/projekt/klienten/${cid}/sitzung`)} style={{ marginBottom: 'var(--sp-8)' }}>
          + Sitzung protokollieren
        </Button>

        <Eyebrow>Verlauf</Eyebrow>
        {sessions.length ? (
          <Card rows>
            {sessions.map((s) => (
              <Row
                key={s.id}
                icon={<Big5Radar current={s.big5} base={client.big5base} size={40} />}
                bareIcon
                title={s.topic || 'Ohne Thema'}
                sub={`${s.date}${s.dur ? ` · ${s.dur} Min` : ''} · ${s.focus}`}
                right={<Chevron />}
                onClick={() => navigate(`/projekt/protokoll/${s.id}`)}
              />
            ))}
          </Card>
        ) : (
          <Empty>Noch keine Sitzung protokolliert.</Empty>
        )}

        <Toolbar>
          <button type="button" onClick={() => navigate(`/projekt/klienten/${cid}/bearbeiten`)}>
            Stammdaten
          </button>
          <button type="button" className="del" onClick={() => void remove()}>
            Klient löschen
          </button>
        </Toolbar>
      </Scroll>
    </Screen>
  )
}
