import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty } from '../../../core/ui/basics'
import { Chip, Field, NumberPair, TextArea, TextInput } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { DeleteRowButton } from '../../../core/ui/rows'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { fmtDate, fromIso } from '../../../core/util/date'
import { termine, useClients, useNetzwerk, useTermine } from '../db'
import type { Termin, TerminKind } from '../types'

const KINDS: TerminKind[] = ['Einzelsession', 'Erstgespräch', 'Orga', 'Sonstiges']

function TerminRow({
  t,
  onToggle,
  onDelete,
  onOpen,
}: {
  t: Termin
  onToggle: () => void
  onDelete: () => void
  onOpen: () => void
}) {
  const d = t.date ? fromIso(t.date) : null
  return (
    <div className={`termin${t.done ? ' past' : ''}`}>
      <div className="cal">
        <b>{d ? d.toLocaleDateString('de-DE', { month: 'short' }).toUpperCase() : '—'}</b>
        <span>{d ? d.getDate() : '?'}</span>
      </div>
      <div
        className="ti2"
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
        onClick={onOpen}
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      >
        <b>{t.title}</b>
        <span>
          {t.kind}
          {t.time ? ` · ${t.time} Uhr` : ''}
        </span>
      </div>
      <button type="button" className="chk" onClick={onToggle} aria-label="Erledigt">
        {t.done ? '✓' : ''}
      </button>
      <DeleteRowButton onClick={onDelete} />
    </div>
  )
}

export function TermineScreen() {
  const list = useTermine() ?? []
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  const open = list.filter((t) => !t.done)
  const done = list.filter((t) => t.done)
  const next = open[0]

  const remove = async (t: Termin) => {
    const ok = await dialog.confirm({ title: 'Termin löschen?', text: t.title })
    if (!ok) return
    await termine().delete(t.id!)
    toast('Gelöscht')
  }

  return (
    <Screen zone="mmm">
      <ScreenHeader eyebrow="Mixed Martial Mindset" title="Termine" back="/kategorie/mmm" />
      <Scroll tight>
        <Button onClick={() => navigate('/projekt/termine/neu')} style={{ marginBottom: 'var(--sp-8)' }}>
          + Termin anlegen
        </Button>

        {next && (
          <div className="nextup">
            <div className="eyebrow">Als Nächstes</div>
            <b>{next.title}</b>
            <span>
              {fmtDate(next.date)}
              {next.time ? ` · ${next.time} Uhr` : ''} · {next.kind}
            </span>
          </div>
        )}

        <Eyebrow>Anstehend</Eyebrow>
        <Card rows>
          {open.length ? (
            open.map((t) => (
              <TerminRow
                key={t.id}
                t={t}
                onToggle={() => void termine().update(t.id!, { done: true })}
                onDelete={() => void remove(t)}
                onOpen={() => navigate(`/projekt/termine/${t.id}/bearbeiten`)}
              />
            ))
          ) : (
            <Empty>Nichts anstehend.</Empty>
          )}
        </Card>

        <Eyebrow style={{ marginTop: 'var(--sp-9)' }}>Erledigt</Eyebrow>
        <Card rows>
          {done.length ? (
            done.map((t) => (
              <TerminRow
                key={t.id}
                t={t}
                onToggle={() => void termine().update(t.id!, { done: false })}
                onDelete={() => void remove(t)}
                onOpen={() => navigate(`/projekt/termine/${t.id}/bearbeiten`)}
              />
            ))
          ) : (
            <Empty compact>Noch nichts erledigt.</Empty>
          )}
        </Card>
      </Scroll>
    </Screen>
  )
}

export function TerminFormScreen() {
  const { id } = useParams()
  const editId = id ? Number(id) : undefined
  const list = useTermine()
  const existing = editId !== undefined ? list?.find((t) => t.id === editId) : undefined
  const navigate = useNavigate()
  const toast = useToast()
  const clients = useClients() ?? []
  const net = useNetzwerk()
  const [kind, setKind] = useState<TerminKind>('Einzelsession')
  const [title, setTitle] = useState('')
  const [cid, setCid] = useState<number | null>(null)
  const [nid, setNid] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [loaded, setLoaded] = useState(editId === undefined)

  useEffect(() => {
    if (loaded || !existing) return
    setKind(existing.kind)
    setTitle(existing.title)
    setCid(existing.cid)
    setNid(existing.nid)
    setDate(existing.date)
    setTime(existing.time)
    setNote(existing.note)
    setLoaded(true)
  }, [existing, loaded])

  const save = async () => {
    if (!title.trim()) {
      toast('Titel fehlt')
      return
    }
    const row = { title: title.trim(), kind, cid, nid, date, time, note: note.trim() }
    if (existing) await termine().update(existing.id!, row)
    else await termine().add({ ...row, done: false })
    toast(existing ? 'Aktualisiert' : 'Termin gesichert')
    navigate('/projekt/termine')
  }

  if (!loaded) return <Screen zone="mmm" />

  return (
    <Screen zone="mmm">
      <ScreenHeader
        eyebrow="Termine"
        title={existing ? 'Termin bearbeiten' : 'Neuer Termin'}
        back="/projekt/termine"
      />
      <Scroll tight>
        <Field label="Art">
          <div>
            {KINDS.map((k) => (
              <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
                {k}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Titel">
          <TextInput value={title} onChange={setTitle} placeholder="z. B. Session mit M." />
        </Field>
        <Field
          label={
            <>
              Bezug <span className="soft">— optional</span>
            </>
          }
        >
          <div className="sub small" style={{ marginBottom: 5 }}>
            Klient
          </div>
          <div style={{ marginBottom: 'var(--sp-4)' }}>
            {clients.length ? (
              clients.map((c) => (
                <Chip key={c.id} on={cid === c.id} onClick={() => setCid(cid === c.id ? null : c.id!)}>
                  {c.name}
                </Chip>
              ))
            ) : (
              <span className="sub small">Noch keine Klienten angelegt.</span>
            )}
          </div>
          <div className="sub small" style={{ marginBottom: 5 }}>
            Umfeld
          </div>
          <div>
            {net?.items.length ? (
              net.items.map((n) => (
                <Chip key={n.id} on={nid === n.id} onClick={() => setNid(nid === n.id ? null : n.id!)}>
                  {n.name}
                </Chip>
              ))
            ) : (
              <span className="sub small">Noch keine Elemente angelegt.</span>
            )}
          </div>
        </Field>
        <Field label="Wann">
          <NumberPair>
            <TextInput type="date" value={date} onChange={setDate} />
            <TextInput type="time" value={time} onChange={setTime} />
          </NumberPair>
        </Field>
        <Field label="Ort / Notiz">
          <TextArea value={note} onChange={setNote} rows={3} placeholder="Wo, mit wem, was vorbereiten?" />
        </Field>
        <Button onClick={() => void save()}>{existing ? 'Änderungen sichern' : 'Termin sichern'}</Button>
      </Scroll>
    </Screen>
  )
}
