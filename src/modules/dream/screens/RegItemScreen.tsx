import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty, Text, Toolbar } from '../../../core/ui/basics'
import { Field, TextArea } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, DeleteRowButton } from '../../../core/ui/rows'
import { EntryRow } from '../../../core/ui/EntryRow'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { GlyphBadge } from '../components/glyphs'
import { linkColor, linkLabel } from '../components/DreamMap'
import { REGISTERS, countOf, dreamLinks, entriesWith, regItems, removeRegItem, setAnchor, useDreamWorld } from '../db'
import type { RegisterKey } from '../types'

export function RegItemScreen() {
  const { reg = 'zeichen', name = '' } = useParams<{ reg: RegisterKey; name: string }>()
  const key = reg as RegisterKey
  const world = useDreamWorld()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [loaded, setLoaded] = useState(false)

  const item = world?.items.find((i) => i.register === key && i.name === name)

  useEffect(() => {
    if (item && !loaded) {
      setNote(item.note ?? '')
      setLoaded(true)
    }
  }, [item, loaded])

  if (!world) return <Screen zone="ld" />
  if (!item) {
    return (
      <Screen zone="ld">
        <ScreenHeader title="Nicht gefunden" back={`/traumwelt/register/${key}`} />
        <Scroll>
          <Empty>Dieses Element gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const count = countOf(world.entries, key, name)
  const related = entriesWith(world.entries, key, name)
  const isAnchor = world.anchor?.name === name
  const links = world.links
    .filter((l) => l.a.name === name || l.b.name === name)
    .map((l) => ({
      ...l,
      other: l.a.name === name ? l.b : l.a,
      dir: l.a.name === name ? '→' : '←',
    }))

  const saveNote = (v: string) => {
    setNote(v)
    void regItems().update(item.id!, { note: v })
  }

  const toggleAnchor = async () => {
    if (isAnchor) {
      await setAnchor(null)
      toast('Stützpunkt aufgehoben')
    } else {
      await setAnchor({ reg: key, name })
      toast('Stützpunkt gesetzt')
    }
  }

  const remove = async () => {
    const ok = await dialog.confirm({ title: 'Aus dem Register entfernen?', text: name })
    if (!ok) return
    await removeRegItem(item)
    toast('Entfernt')
    navigate(`/traumwelt/register/${key}`)
  }

  const dropLink = async (id: number) => {
    const ok = await dialog.confirm({ title: 'Verknüpfung lösen?', okLabel: 'Lösen' })
    if (!ok) return
    await dreamLinks().delete(id)
    toast('Gelöst')
  }

  return (
    <Screen zone="ld">
      <ScreenHeader
        eyebrow={REGISTERS[key].label}
        title={name}
        icon={<GlyphBadge kind={isAnchor ? 'anchor' : key} color={isAnchor ? 'var(--anchor)' : REGISTERS[key].color} size={24} />}
        tint="var(--cat-ld-tint)"
        back={`/traumwelt/register/${key}`}
      />
      <Scroll tight>
        <Card>
          <Eyebrow>Häufigkeit</Eyebrow>
          <b style={{ fontSize: 15 }}>{count}× erfasst</b>
          <Text style={{ marginTop: 'var(--sp-1)' }}>{related.length} verknüpfte Einträge</Text>
          {isAnchor && (
            <Text small style={{ marginTop: 'var(--sp-4)', color: 'var(--anchor)' }}>
              Stützpunkt der Traumwelt — alles andere ordnet sich nach der Häufigkeit gemeinsamen Auftretens
              darum an.
            </Text>
          )}
        </Card>

        <Field label="Deine Notizen dazu">
          <TextArea
            value={note}
            onChange={saveNote}
            rows={4}
            placeholder="Was fällt dir auf? Wie sieht es aus? Wann taucht es auf?"
          />
        </Field>

        <Eyebrow>Verknüpfungen</Eyebrow>
        <Card rows>
          {links.length ? (
            links.map((l) => (
              <Row
                key={l.id}
                icon={l.dir}
                tint={`color-mix(in srgb, ${linkColor(l.type)} 13%, transparent)`}
                fg={linkColor(l.type)}
                title={l.other.name}
                sub={linkLabel(l.type)}
                onClick={() => navigate(`/traumwelt/register/${l.other.reg}/${encodeURIComponent(l.other.name)}`)}
                right={<DeleteRowButton onClick={() => void dropLink(l.id!)} />}
              />
            ))
          ) : (
            <Empty compact>Noch nichts verknüpft.</Empty>
          )}
        </Card>
        <Button
          ghost
          onClick={() => navigate(`/traumwelt/register/${key}/${encodeURIComponent(name)}/verknuepfen`)}
          style={{ marginBottom: 'var(--sp-9)' }}
        >
          + Verknüpfung
        </Button>

        <Eyebrow>Kommt vor in</Eyebrow>
        <Card rows>
          {related.length ? (
            related.map((e) => <EntryRow key={e.id} entry={e} />)
          ) : (
            <Empty compact>Noch keine Verknüpfung.</Empty>
          )}
        </Card>

        <Toolbar one={key !== 'ort'}>
          {key === 'ort' && (
            <button type="button" className={isAnchor ? 'marked' : ''} onClick={() => void toggleAnchor()}>
              {isAnchor ? 'Stützpunkt aufheben' : 'Als Stützpunkt'}
            </button>
          )}
          <button type="button" className="del" onClick={() => void remove()}>
            Entfernen
          </button>
        </Toolbar>
      </Scroll>
    </Screen>
  )
}
