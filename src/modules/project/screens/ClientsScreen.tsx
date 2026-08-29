import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button, Card, Empty, Notice } from '../../../core/ui/basics'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { BigRow, Chevron } from '../../../core/ui/rows'
import { plural } from '../../../core/util/text'
import { clientSessions, useClients } from '../db'
import type { ClientSession } from '../types'

export function ClientsScreen() {
  const clients = useClients() ?? []
  const sessions = useLiveQuery(() => clientSessions().toArray(), [], [] as ClientSession[])
  const navigate = useNavigate()

  return (
    <Screen zone="mmm">
      <ScreenHeader eyebrow="Mixed Martial Mindset" title="Klienten" back="/kategorie/mmm" />
      <Scroll tight>
        <Notice tone="var(--red)" toneFg="var(--red-fg)">
          Kürzel oder Vorname statt vollem Namen. Festhalten, was <b>beobachtet</b> wurde — nicht, was du über
          jemanden denkst. Alles bleibt lokal auf deinem Gerät.
        </Notice>

        <Button onClick={() => navigate('/projekt/klienten/neu')} style={{ marginBottom: 'var(--sp-8)' }}>
          + Klient anlegen
        </Button>

        {clients.length ? (
          <Card rows>
            {clients.map((c) => {
              const n = (sessions ?? []).filter((s) => s.cid === c.id).length
              const open = (c.goals ?? []).filter((g) => g.status !== 'erreicht').length
              return (
                <BigRow
                  key={c.id}
                  icon={<span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{c.name.slice(0, 2).toUpperCase()}</span>}
                  tint="var(--cat-mmm-tint)"
                  fg="var(--cat-mmm-fg)"
                  title={c.name}
                  sub={`${plural(n, 'Sitzung', 'Sitzungen')} · ${plural(open, 'offenes Ziel', 'offene Ziele')}${
                    c.consent === 'Noch offen' ? ' · Einverständnis offen' : ''
                  }`}
                  right={<Chevron />}
                  onClick={() => navigate(`/projekt/klienten/${c.id}`)}
                />
              )
            })}
          </Card>
        ) : (
          <Empty>Noch keine Klienten angelegt.</Empty>
        )}
      </Scroll>
    </Screen>
  )
}
