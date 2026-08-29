import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty, Text, Toolbar } from '../../../core/ui/basics'
import { Chip, Field, Segmented, TextArea, TextInput } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, Chevron } from '../../../core/ui/rows'
import { StatBox, StatLine } from '../../../core/ui/tiles'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { dayLabel } from '../../../core/util/date'
import { STATUS_GLYPH, ZAREAS, ZHOR, ZSTAT, ziele, zhor, zstat, useZiele } from '../db'
import type { Horizon, Ziel, ZielStatus } from '../types'

const FILTERS: [string, string][] = [
  ['aktiv', 'Aktiv'],
  ['alle', 'Alle'],
  ['erreicht', 'Erreicht'],
  ['los', 'Losgelassen'],
]

export function ZieleScreen() {
  const list = useZiele() ?? []
  const [filter, setFilter] = useState('aktiv')
  const navigate = useNavigate()

  const active = list.filter((z) => z.status === 'offen' || z.status === 'dran')
  const north = list.filter((z) => z.hor === 'leben' && z.status !== 'los')

  let shown = list.filter((z) => z.hor !== 'leben')
  if (filter === 'aktiv') shown = shown.filter((z) => z.status === 'offen' || z.status === 'dran')
  else if (filter === 'erreicht') shown = shown.filter((z) => z.status === 'erreicht')
  else if (filter === 'los') shown = shown.filter((z) => z.status === 'los')

  const sections = ZHOR.filter(([k]) => k !== 'leben')
    .map(([k, label, hint, color]) => ({ k, label, hint, color, items: shown.filter((z) => z.hor === k) }))
    .filter((s) => s.items.length)

  return (
    <Screen zone="ms">
      <ScreenHeader eyebrow="MindSpark" title="Ziele" back="/kategorie/ms" />
      <Scroll tight>
        <StatLine>
          <StatBox value={active.length} label="AKTIV" />
          <StatBox value={list.filter((z) => z.status === 'dran').length} label="DRAN" color="var(--amber)" />
          <StatBox value={list.filter((z) => z.status === 'erreicht').length} label="ERREICHT" color="var(--ok)" />
        </StatLine>

        {north.length > 0 && (
          <>
            <Eyebrow>Nordstern</Eyebrow>
            {north.map((z) => (
              <Card
                key={z.id}
                onClick={() => navigate(`/ziele/${z.id}`)}
                style={{
                  borderColor: 'color-mix(in srgb, var(--rose) 40%, transparent)',
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--rose) 10%, transparent), transparent)',
                }}
              >
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1.4 }}>{z.t}</p>
                {z.why && (
                  <Text style={{ marginTop: 'var(--sp-3)', fontSize: '12.5px' }}>{z.why}</Text>
                )}
              </Card>
            ))}
          </>
        )}

        <div style={{ margin: 'var(--sp-1) 0 var(--sp-4)' }}>
          {FILTERS.map(([k, label]) => (
            <Chip key={k} on={filter === k} onClick={() => setFilter(k)}>
              {label}
            </Chip>
          ))}
        </div>

        {sections.length ? (
          sections.map((s) => (
            <div key={s.k}>
              <Eyebrow style={{ marginTop: 'var(--sp-8)', color: s.color }}>{s.label}</Eyebrow>
              <Text small style={{ marginBottom: 'var(--sp-3)' }}>
                {s.hint}
              </Text>
              <Card rows>
                {s.items.map((z) => {
                  const st = zstat(z.status)
                  return (
                    <Row
                      key={z.id}
                      icon={STATUS_GLYPH[z.status]}
                      tint={`color-mix(in srgb, ${st[2]} 13%, transparent)`}
                      fg={st[2]}
                      title={z.t}
                      titleStyle={z.status === 'erreicht' ? { opacity: 0.65 } : undefined}
                      sub={[z.area, z.next, z.done].filter(Boolean).join(' · ')}
                      right={<Chevron />}
                      onClick={() => navigate(`/ziele/${z.id}`)}
                    />
                  )
                })}
              </Card>
            </div>
          ))
        ) : (
          <Empty>Nichts in dieser Auswahl.</Empty>
        )}

        <Button onClick={() => navigate('/ziele/neu')} style={{ marginTop: 'var(--sp-6)' }}>
          + Ziel anlegen
        </Button>
      </Scroll>
    </Screen>
  )
}

export function ZielScreen() {
  const { id } = useParams()
  const list = useZiele()
  const z = list?.find((x) => x.id === Number(id))
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  if (!list) return <Screen zone="ms" />
  if (!z) {
    return (
      <Screen zone="ms">
        <ScreenHeader title="Nicht gefunden" back="/ziele" />
        <Scroll>
          <Empty>Dieses Ziel gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const setStatus = async (status: ZielStatus) => {
    const patch: Partial<Ziel> = { status }
    if (status === 'erreicht' && !z.done) patch.done = dayLabel(new Date())
    if (status !== 'erreicht') patch.done = null
    await ziele().update(z.id!, patch)
    if (status === 'erreicht') toast('Erreicht — schön.')
  }

  const remove = async () => {
    const ok = await dialog.confirm({ title: 'Ziel löschen?', text: z.t })
    if (!ok) return
    await ziele().delete(z.id!)
    toast('Gelöscht')
    navigate('/ziele')
  }

  return (
    <Screen zone="ms">
      <ScreenHeader eyebrow={`${zhor(z.hor)[1]} · ${z.area}`} title={z.t} back="/ziele" />
      <Scroll tight>
        <Card>
          <Eyebrow>Status</Eyebrow>
          <div className="seg small" style={{ ['--cols' as string]: 4, marginTop: 'var(--sp-2)' }}>
            {ZSTAT.map(([k, label]) => (
              <button key={k} type="button" className={k === z.status ? 'on' : ''} onClick={() => void setStatus(k)}>
                {label}
              </button>
            ))}
          </div>
          {z.done && (
            <Text small style={{ marginTop: 'var(--sp-4)' }}>
              Erreicht am {z.done}
            </Text>
          )}
        </Card>

        {z.why && (
          <Card>
            <Eyebrow>Warum</Eyebrow>
            <Text strong pre>
              {z.why}
            </Text>
          </Card>
        )}
        {z.next && (
          <Card style={{ borderColor: 'color-mix(in srgb, var(--amber) 40%, transparent)' }}>
            <Eyebrow>Nächster Schritt</Eyebrow>
            <Text strong>{z.next}</Text>
          </Card>
        )}
        {z.note && (
          <Card>
            <Eyebrow>Notizen</Eyebrow>
            <Text strong pre>
              {z.note}
            </Text>
          </Card>
        )}

        <Toolbar>
          <button type="button" onClick={() => navigate(`/ziele/${z.id}/bearbeiten`)}>
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

export function ZielFormScreen() {
  const { id } = useParams()
  const editing = id ? Number(id) : undefined
  const list = useZiele()
  const navigate = useNavigate()
  const toast = useToast()

  const [t, setT] = useState('')
  const [hor, setHor] = useState<Horizon>('jahr')
  const [area, setArea] = useState('Sonstiges')
  const [why, setWhy] = useState('')
  const [next, setNext] = useState('')
  const [note, setNote] = useState('')
  const [loaded, setLoaded] = useState(false)

  const existing = editing !== undefined ? list?.find((z) => z.id === editing) : undefined

  useEffect(() => {
    if (editing === undefined) {
      setLoaded(true)
      return
    }
    if (existing && !loaded) {
      setT(existing.t)
      setHor(existing.hor)
      setArea(existing.area)
      setWhy(existing.why)
      setNext(existing.next)
      setNote(existing.note)
      setLoaded(true)
    }
  }, [existing, editing, loaded])

  if (!loaded) return <Screen zone="ms" />

  const save = async () => {
    if (!t.trim()) {
      toast('Ziel fehlt')
      return
    }
    const row = { t: t.trim(), hor, area, why: why.trim(), next: next.trim(), note: note.trim() }
    if (existing) {
      await ziele().update(existing.id!, row)
      toast('Aktualisiert')
      navigate(`/ziele/${existing.id}`)
    } else {
      const newId = await ziele().add({ ...row, status: 'offen', done: null, createdAt: Date.now() })
      toast('Angelegt')
      navigate(`/ziele/${newId}`)
    }
  }

  const horIndex = ZHOR.findIndex(([k]) => k === hor)

  return (
    <Screen zone="ms">
      <ScreenHeader eyebrow={existing ? 'Bearbeiten' : 'Neues Ziel'} title="Ziel" back={existing ? `/ziele/${existing.id}` : '/ziele'} />
      <Scroll tight>
        <Field label="Ziel">
          <TextInput value={t} onChange={setT} placeholder="Wie sieht es aus, wenn du es erreicht hast?" />
        </Field>

        <Field label="Zeithorizont" hint={zhor(hor)[2]}>
          <Segmented
            count={4}
            small
            value={horIndex}
            labels={ZHOR.map(([, label]) => label)}
            onChange={(i) => setHor(ZHOR[i][0])}
          />
        </Field>

        <Field label="Lebensbereich">
          <div>
            {ZAREAS.map((a) => (
              <Chip key={a} on={area === a} onClick={() => setArea(a)}>
                {a}
              </Chip>
            ))}
          </div>
        </Field>

        <Field
          label={
            <>
              Warum <span className="soft">— wofür ist das gut?</span>
            </>
          }
        >
          <TextArea value={why} onChange={setWhy} rows={3} placeholder="Der Grund trägt länger als das Ziel." />
        </Field>
        <Field label="Nächster Schritt">
          <TextInput value={next} onChange={setNext} placeholder="Das Kleinste, was du tun kannst" />
        </Field>
        <Field label="Notizen">
          <TextArea value={note} onChange={setNote} rows={3} placeholder="Optional" />
        </Field>

        <Button onClick={() => void save()}>Sichern</Button>
      </Scroll>
    </Screen>
  )
}
