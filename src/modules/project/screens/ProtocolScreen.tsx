import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Empty, Text, Toolbar } from '../../../core/ui/basics'
import { Bar } from '../../../core/ui/data'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { BIG5, clientSessions, useClients } from '../db'
import { Big5Radar } from '../components/Big5Radar'
import type { ReactNode } from 'react'

function Block({ title, cls, rows }: { title: string; cls: string; rows: [string, ReactNode][] }) {
  const filled = rows.filter(([, v]) => v && String(v).trim())
  if (!filled.length) return null
  return (
    <>
      <Eyebrow className={cls} style={{ marginTop: 'var(--sp-2)' }}>
        {title}
      </Eyebrow>
      <Card>
        {filled.map(([label, value]) => (
          <div key={label} style={{ marginBottom: 'var(--sp-5)' }}>
            <div className="eyebrow" style={{ marginBottom: 'var(--sp-1)' }}>
              {label}
            </div>
            <Text strong pre>
              {value}
            </Text>
          </div>
        ))}
      </Card>
    </>
  )
}

export function ProtocolScreen() {
  const { id } = useParams()
  const session = useLiveQuery(async () => (id ? ((await clientSessions().get(Number(id))) ?? null) : null), [id])
  const client = (useClients() ?? []).find((c) => c.id === session?.cid)
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  if (session === undefined) return <Screen zone="mmm" />
  if (session === null) {
    return (
      <Screen zone="mmm">
        <ScreenHeader title="Nicht gefunden" back="/projekt/klienten" />
        <Scroll>
          <Empty>Dieses Protokoll gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const remove = async () => {
    const ok = await dialog.confirm({ title: 'Protokoll löschen?', text: session.topic || 'Sitzung' })
    if (!ok) return
    await clientSessions().delete(session.id!)
    toast('Gelöscht')
    navigate(`/projekt/klienten/${session.cid}`)
  }

  return (
    <Screen zone="mmm">
      <ScreenHeader
        eyebrow={`${client ? `${client.name} · ` : ''}${session.date}${session.dur ? ` · ${session.dur} Min` : ''}`}
        title={session.topic || 'Sitzung'}
        back={`/projekt/klienten/${session.cid}`}
      />
      <Scroll tight>
        <Block
          title="Beratung"
          cls="eb-talk"
          rows={[
            ['Verfassung bei Ankunft', session.mood],
            ['Thema', session.topic],
            ['Gespräch', session.talk],
          ]}
        />
        <Block
          title="Kampfsport"
          cls="eb-train"
          rows={[
            ['Schwerpunkt', session.focus],
            ['Training & Beobachtung', session.train],
          ]}
        />

        {session.big5 && (
          <>
            <Eyebrow style={{ marginTop: 'var(--sp-2)' }}>Big Five</Eyebrow>
            <Card>
              <div style={{ display: 'flex', gap: 'var(--sp-7)', alignItems: 'center' }}>
                <Big5Radar current={session.big5} base={client?.big5base} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {BIG5.map(([k, label]) => (
                    <Bar
                      key={k}
                      labelWidth={92}
                      label={label}
                      value={session.big5[k] ?? 0}
                      color="var(--ok)"
                      display={
                        <>
                          {session.big5[k] ?? 0}
                          {client && <span style={{ color: 'var(--mist)' }}>/{client.big5base[k]}</span>}
                        </>
                      }
                    />
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}

        <Block
          title="Abschluss"
          cls="eb-end"
          rows={[
            ['Übertrag & Vereinbarung', session.bridge],
            ['Für mich', session.self],
          ]}
        />

        <Toolbar>
          <button type="button" onClick={() => navigate(`/projekt/protokoll/${session.id}/bearbeiten`)}>
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
