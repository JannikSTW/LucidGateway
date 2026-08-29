import { useNavigate } from 'react-router-dom'
import { Card, Empty, Toolbar } from '../../../core/ui/basics'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, Chevron } from '../../../core/ui/rows'
import { StatBox, StatLine } from '../../../core/ui/tiles'
import { fmtDate, fromIso } from '../../../core/util/date'
import { NGROUPS, nkind, useNetzwerk } from '../db'
import { NetzBadge } from '../components/NetzGlyph'
import { NetzMap } from '../components/NetzMap'
import type { NetzGroup } from '../types'

export function UmfeldScreen() {
  const net = useNetzwerk()
  const navigate = useNavigate()

  const open = (net?.items ?? []).filter((n) => n.next)
  const dates = (net?.termine ?? [])
    .filter((t) => !t.done && t.nid)
    .sort((a, b) => ((a.date || '9') > (b.date || '9') ? 1 : -1))

  return (
    <Screen zone="mmm">
      <ScreenHeader eyebrow="Mixed Martial Mindset" title="Umfeld" back="/kategorie/mmm" />
      <Scroll tight>
        <StatLine>
          {(Object.keys(NGROUPS) as NetzGroup[]).map((g) => (
            <StatBox
              key={g}
              value={(net?.items ?? []).filter((n) => nkind(n.kind).grp === g).length}
              label={NGROUPS[g].short}
              color={NGROUPS[g].color}
            />
          ))}
        </StatLine>

        <Card className="mapcard" style={{ marginBottom: 'var(--sp-8)' }}>
          {net && <NetzMap net={net} onOpen={(id) => navigate(`/projekt/umfeld/${id}`)} />}
        </Card>

        <Eyebrow>Offene Schritte</Eyebrow>
        {open.length ? (
          <Card rows>
            {open.map((n) => (
              <Row
                key={n.id}
                icon={<NetzBadge kind={n.kind} />}
                bareIcon
                title={n.next}
                sub={`${n.name} · ${nkind(n.kind).label}`}
                right={<Chevron />}
                onClick={() => navigate(`/projekt/umfeld/${n.id}`)}
              />
            ))}
          </Card>
        ) : (
          <Empty compact>Nichts offen — alles im Fluss.</Empty>
        )}

        {dates.length > 0 && (
          <>
            <Eyebrow style={{ marginTop: 'var(--sp-9)' }}>Termine im Umfeld</Eyebrow>
            <Card rows>
              {dates.map((t) => {
                const n = net?.items.find((x) => x.id === t.nid)
                return (
                  <div key={t.id} className="termin">
                    <div className="cal">
                      <b>
                        {t.date ? fromIso(t.date).toLocaleDateString('de-DE', { month: 'short' }).toUpperCase() : '—'}
                      </b>
                      <span>{t.date ? fromIso(t.date).getDate() : '?'}</span>
                    </div>
                    <div className="ti2">
                      <b>{t.title}</b>
                      <span>
                        {t.kind}
                        {n ? ` · ${n.name}` : ''} · {fmtDate(t.date)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </Card>
          </>
        )}

        <Toolbar>
          <button type="button" onClick={() => navigate('/projekt/umfeld/alle')}>
            Alle Elemente
          </button>
          <button type="button" onClick={() => navigate('/projekt/umfeld/neu')}>
            + Anlegen
          </button>
        </Toolbar>
      </Scroll>
    </Screen>
  )
}
