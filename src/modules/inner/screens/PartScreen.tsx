import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty, Text, Toolbar } from '../../../core/ui/basics'
import { Bar } from '../../../core/ui/data'
import { Field, TextArea } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, DeleteRowButton } from '../../../core/ui/rows'
import { EntryRow } from '../../../core/ui/EntryRow'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import {
  distLabel,
  entriesWithPart,
  partCount,
  partDist,
  partLinks,
  partLinkType,
  parts,
  removePart,
  renamePart,
  roleColor,
  useInnerWorld,
} from '../db'

export function PartScreen() {
  const { name = '' } = useParams()
  const world = useInnerWorld()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [loaded, setLoaded] = useState(false)

  const part = world?.parts.find((p) => p.name === name)

  useEffect(() => {
    if (part && !loaded) {
      setNote(part.note ?? '')
      setLoaded(true)
    }
  }, [part, loaded])

  if (!world) return <Screen zone="ai" />
  if (!part) {
    return (
      <Screen zone="ai">
        <ScreenHeader title="Nicht gefunden" back="/innenwelt" />
        <Scroll>
          <Empty>Diesen Anteil gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const color = roleColor(part.profile?.role, world.parts)
  const count = partCount(world.entries, name)
  const related = entriesWithPart(world.entries, name)
  const links = world.links
    .filter((l) => l.a === name || l.b === name)
    .map((l) => ({ ...l, other: l.a === name ? l.b : l.a, outgoing: l.a === name }))

  const saveNote = (v: string) => {
    setNote(v)
    void parts().update(part.id!, { note: v })
  }

  const rename = async () => {
    const next = await dialog.text({ title: 'Anteil umbenennen', value: name, okLabel: 'Umbenennen' })
    if (!next) return
    if (await renamePart(part, next)) {
      toast('Umbenannt')
      navigate(`/innenwelt/anteil/${encodeURIComponent(next.trim())}`, { replace: true })
    } else {
      toast('Name schon vergeben')
    }
  }

  const remove = async () => {
    const ok = await dialog.confirm({ title: 'Anteil löschen?', text: name })
    if (!ok) return
    await removePart(part)
    toast('Gelöscht')
    navigate('/innenwelt')
  }

  const dropLink = async (id: number) => {
    const ok = await dialog.confirm({ title: 'Beziehung lösen?', okLabel: 'Lösen' })
    if (!ok) return
    await partLinks().delete(id)
    toast('Gelöst')
  }

  return (
    <Screen zone="ai">
      <ScreenHeader
        eyebrow={part.profile ? part.profile.role || 'Ohne Rolle' : 'Noch nicht profiliert'}
        title={name}
        icon="◍"
        tint={`color-mix(in srgb, ${color} 13%, transparent)`}
        fg={color}
        back="/innenwelt"
      />
      <Scroll tight>
        <Card>
          {part.profile ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: 'var(--sp-4)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: color, display: 'block' }} />
                <b style={{ fontSize: 15 }}>{part.profile.role || 'Ohne Rolle'}</b>
              </div>
              <Bar label="Abstand" value={partDist(part)} color={color} labelWidth={104} />
              <Text small style={{ marginBottom: 'var(--sp-4)' }}>
                {distLabel(partDist(part))}
              </Text>
              {part.profile.does && (
                <Text>
                  <b style={{ color: 'var(--paper)' }}>Tut:</b> {part.profile.does}
                </Text>
              )}
              {part.profile.protects && (
                <Text style={{ marginTop: 'var(--sp-2)' }}>
                  <b style={{ color: 'var(--paper)' }}>Schützt vor:</b> {part.profile.protects}
                </Text>
              )}
              {part.profile.trigger && (
                <Text style={{ marginTop: 'var(--sp-2)' }}>
                  <b style={{ color: 'var(--paper)' }}>Auslöser:</b> {part.profile.trigger}
                </Text>
              )}
              {(part.profile.body || part.profile.age) && (
                <Text style={{ marginTop: 'var(--sp-2)' }}>
                  {[part.profile.body, part.profile.age].filter(Boolean).join(' · ')}
                </Text>
              )}
              <Text small style={{ marginTop: 'var(--sp-4)' }}>
                {count}× aufgetaucht · {related.length} Sitzungen
              </Text>
            </>
          ) : (
            <>
              <Eyebrow>Noch offen</Eyebrow>
              <Text>
                {count}× aufgetaucht. Profiliere ihn, sobald du eine Ahnung hast, welche Rolle er übernimmt.
              </Text>
            </>
          )}
        </Card>

        <Field label="Notizen">
          <TextArea value={note} onChange={saveNote} rows={4} placeholder="Was fällt dir auf? Wie meldet er sich?" />
        </Field>

        <Eyebrow>Beziehungen</Eyebrow>
        <Card rows>
          {links.length ? (
            links.map((l) => {
              const t = partLinkType(l.type)
              return (
                <Row
                  key={l.id}
                  icon={t.directed ? (l.outgoing ? '→' : '←') : '↔'}
                  tint={`color-mix(in srgb, ${t.color} 13%, transparent)`}
                  fg={t.color}
                  title={l.other}
                  sub={t.directed && !l.outgoing ? (t.reverse ?? t.label) : t.label}
                  subStyle={{ color: t.color }}
                  onClick={() => navigate(`/innenwelt/anteil/${encodeURIComponent(l.other)}`)}
                  right={<DeleteRowButton onClick={() => void dropLink(l.id!)} />}
                />
              )
            })
          ) : (
            <Empty compact>Noch keine Beziehung erfasst.</Empty>
          )}
        </Card>
        <Button
          ghost
          onClick={() => navigate(`/innenwelt/anteil/${encodeURIComponent(name)}/beziehung`)}
          style={{ marginBottom: 'var(--sp-9)' }}
        >
          + Beziehung
        </Button>

        <Eyebrow>Gezeigt in</Eyebrow>
        <Card rows>
          {related.length ? (
            related.map((e) => <EntryRow key={e.id} entry={e} />)
          ) : (
            <Empty compact>Noch keine Sitzung verknüpft.</Empty>
          )}
        </Card>

        <Toolbar three>
          <button type="button" onClick={() => navigate(`/innenwelt/anteil/${encodeURIComponent(name)}/profil`)}>
            Profil
          </button>
          <button type="button" onClick={() => void rename()}>
            Umbenennen
          </button>
          <button type="button" className="del" onClick={() => void remove()}>
            Löschen
          </button>
        </Toolbar>
      </Scroll>
    </Screen>
  )
}
