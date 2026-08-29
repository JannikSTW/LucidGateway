import { useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button, Card, Empty, Text } from '../../../core/ui/basics'
import { Bar, Legend, Radar } from '../../../core/ui/data'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row } from '../../../core/ui/rows'
import { StatBox, StatLine } from '../../../core/ui/tiles'
import { EntryRow } from '../../../core/ui/EntryRow'
import { listEntries } from '../../../core/db/entries'
import { PROFILE, PROFILE_KEYS, averageProfile } from '../../../core/profile'
import { IconObe } from '../../dream/icons'
import { OBE_MILESTONES, toggleMilestone, useMilestones } from '../db'
import type { Entry } from '../../../core/types'

export function ObeScreen() {
  const entries = useLiveQuery(() => listEntries(), [], [] as Entry[])
  const reached = useMilestones()
  const navigate = useNavigate()

  const sessions = (entries ?? []).filter((e) => e.cat === 'obe')
  const dreams = (entries ?? []).filter((e) => e.cat === 'ld')
  const loosened = sessions.filter((e) => e.scale >= 3).length
  const doneCount = OBE_MILESTONES.filter(([k]) => reached[k]).length

  // Methoden-Bilanz: durchschnittlicher Ablösungsgrad je Methode.
  const byMethod = new Map<string, Entry[]>()
  for (const e of sessions) {
    const m = (e.med?.vals?.methode as string) ?? 'Ohne Angabe'
    byMethod.set(m, [...(byMethod.get(m) ?? []), e])
  }

  const profDream = averageProfile(dreams)
  const profObe = averageProfile(sessions)

  return (
    <Screen zone="obe">
      <ScreenHeader
        eyebrow="Luzides Träumen"
        title="Außerkörperliche Erfahrung"
        icon={<IconObe />}
        tint="var(--cat-obe-tint)"
        fg="var(--cat-obe-fg)"
        back="/kategorie/ld"
      />
      <Scroll tight>
        <StatLine>
          <StatBox value={sessions.length} label="SITZUNGEN" />
          <StatBox value={loosened} label="GELÖST" />
          <StatBox value={`${doneCount}/${OBE_MILESTONES.length}`} label="MEILENSTEINE" />
        </StatLine>

        <Button onClick={() => navigate('/sitzung/obe')} style={{ marginBottom: 'var(--sp-9)' }}>
          + Neue Sitzung
        </Button>

        <Eyebrow>Meilensteine</Eyebrow>
        <Card rows>
          {OBE_MILESTONES.map(([key, label, hint]) => {
            const date = reached[key]
            return (
              <Row
                key={key}
                icon={date ? '✓' : '○'}
                tint={date ? 'var(--cat-obe-tint)' : 'var(--panel2)'}
                fg={date ? 'var(--cat-obe-fg)' : 'var(--mist)'}
                title={label}
                sub={date ? `erreicht am ${date}` : hint}
                wrapTitle
                onClick={() => void toggleMilestone(key, !!date)}
              />
            )
          })}
        </Card>

        <Eyebrow>Methoden — was bei dir wirkt</Eyebrow>
        <Card>
          {byMethod.size ? (
            <>
              {[...byMethod.entries()]
                .sort((a, b) => b[1].length - a[1].length)
                .map(([name, list]) => {
                  const avg = Math.round((list.reduce((s, e) => s + (e.scale || 0), 0) / list.length) * 10) / 10
                  return (
                    <Bar
                      key={name}
                      label={name.split(' /')[0]}
                      value={avg}
                      max={5}
                      labelWidth={112}
                      color="var(--cat-obe)"
                      display={`${avg} · ${list.length}×`}
                    />
                  )
                })}
              <Text small style={{ marginTop: 'var(--sp-4)' }}>
                Durchschnittlicher Ablösungsgrad je Methode und Anzahl der Versuche. Keine Empfehlung — nur deine
                Datenlage.
              </Text>
            </>
          ) : (
            <Empty compact>Noch keine Sitzung erfasst.</Empty>
          )}
        </Card>

        <Eyebrow>Traum ↔ OBE im Vergleich</Eyebrow>
        <Card>
          {profDream || profObe ? (
            <>
              <div style={{ display: 'flex', gap: 'var(--sp-7)', alignItems: 'center' }}>
                <Radar
                  size={92}
                  dims={PROFILE_KEYS}
                  shapes={[
                    ...(profDream
                      ? [
                          {
                            values: profDream as unknown as Record<string, number>,
                            color: 'var(--violet)',
                            fill: 'var(--violet-soft)',
                            dashed: true,
                          },
                        ]
                      : []),
                    ...(profObe
                      ? [
                          {
                            values: profObe as unknown as Record<string, number>,
                            color: 'var(--cat-obe)',
                            fill: 'var(--cat-obe-tint)',
                          },
                        ]
                      : []),
                  ]}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {PROFILE.map(([k, label]) => {
                    const t = profDream ? profDream[k] : null
                    const o = profObe ? profObe[k] : null
                    const delta = t !== null && o !== null ? Math.round((o - t) * 10) / 10 : null
                    return (
                      <Bar
                        key={k}
                        label={label}
                        labelWidth={100}
                        value={o ?? t ?? 0}
                        color={o !== null ? 'var(--cat-obe)' : 'var(--violet)'}
                        display={delta === null ? (o ?? t) : delta > 0 ? `+${delta}` : delta}
                      />
                    )
                  })}
                </div>
              </div>
              <Legend
                items={[
                  { label: 'Träume', color: 'var(--violet)', line: true },
                  { label: 'OBE', color: 'var(--cat-obe)', line: true },
                ]}
              />
              <Text small style={{ marginTop: 'var(--sp-3)' }}>
                Mittelwerte deiner Zustandsprofile. Je stärker die Formen sich unterscheiden, desto eher sind es
                zwei verschiedene Zustände.
              </Text>
            </>
          ) : (
            <Empty compact>Sobald Profile erfasst sind, erscheint hier der Vergleich.</Empty>
          )}
        </Card>

        <Card className="accent">
          <Eyebrow>Haltung</Eyebrow>
          <Text>
            Die App bewertet nicht, was dabei ontologisch passiert. Sie erfasst, wie sich der Zustand anfühlt und
            wodurch er begünstigt wird — und lässt dich vergleichen, ob er sich wirklich vom luziden Traum
            unterscheidet.
          </Text>
        </Card>

        <Eyebrow>Sitzungen</Eyebrow>
        <Card rows>
          {sessions.length ? (
            sessions.map((e) => <EntryRow key={e.id} entry={e} />)
          ) : (
            <Empty compact>Noch keine Sitzung erfasst.</Empty>
          )}
        </Card>
      </Scroll>
    </Screen>
  )
}
