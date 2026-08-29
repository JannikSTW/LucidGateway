import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Empty } from '../../../core/ui/basics'
import { Chip, Field, TextInput } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { templates, useTemplates } from '../db'
import { plural } from '../../../core/util/text'
import type { ExerciseKind, TemplateExercise } from '../types'

const KINDS: [ExerciseKind, string][] = [
  ['bw', 'Eigengewicht'],
  ['load', 'Mit Gewicht'],
  ['time', 'Auf Zeit'],
]

export function TemplatesScreen() {
  const list = useTemplates() ?? []
  const navigate = useNavigate()

  return (
    <Screen zone="ms">
      <ScreenHeader eyebrow="Krafttraining" title="Vorlagen" back="/training/kraft/start" />
      <Scroll tight>
        {list.length ? (
          list.map((t) => (
            <button
              key={t.id}
              type="button"
              className="tplcard"
              onClick={() => navigate(`/training/vorlagen/${t.key}`)}
            >
              <b>{t.name}</b>
              <span>
                {plural(t.ex.length, 'Übung', 'Übungen')} · {t.ex.map((e) => e.n).join(' · ')}
              </span>
            </button>
          ))
        ) : (
          <Empty>Noch keine Vorlage.</Empty>
        )}
        <Button ghost onClick={() => navigate('/training/vorlagen/neu')}>
          + Neue Vorlage
        </Button>
      </Scroll>
    </Screen>
  )
}

export function TemplateEditScreen() {
  const { key = 'neu' } = useParams()
  const isNew = key === 'neu'
  const list = useTemplates()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()
  const [name, setName] = useState('')
  const [ex, setEx] = useState<TemplateExercise[]>([{ n: '', s: 3, r: '', t: 'bw' }])
  const [loaded, setLoaded] = useState(false)

  const existing = list?.find((t) => t.key === key)

  useEffect(() => {
    if (isNew) {
      setLoaded(true)
      return
    }
    if (existing && !loaded) {
      setName(existing.name)
      setEx(existing.ex.map((e) => ({ ...e })))
      setLoaded(true)
    }
  }, [existing, isNew, loaded])

  if (!loaded) return <Screen zone="ms" />

  const patch = (i: number, p: Partial<TemplateExercise>) =>
    setEx((l) => l.map((e, idx) => (idx === i ? { ...e, ...p } : e)))

  const save = async () => {
    if (!name.trim()) {
      toast('Bitte Namen vergeben')
      return
    }
    const cleaned = ex.filter((e) => e.n.trim())
    if (existing) {
      await templates().update(existing.id!, { name: name.trim(), ex: cleaned })
    } else {
      const newKey = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-3)}`
      await templates().add({ key: newKey, name: name.trim(), ex: cleaned })
    }
    toast('Vorlage gespeichert')
    navigate('/training/vorlagen')
  }

  const remove = async () => {
    if (!existing) return navigate('/training/vorlagen')
    const ok = await dialog.confirm({ title: 'Vorlage löschen?', text: existing.name })
    if (!ok) return
    await templates().delete(existing.id!)
    toast('Vorlage gelöscht')
    navigate('/training/vorlagen')
    return undefined
  }

  return (
    <Screen zone="ms">
      <ScreenHeader eyebrow="Vorlage" title={existing ? existing.name : 'Neue Vorlage'} back="/training/vorlagen" />
      <Scroll tight>
        <Field label="Name der Klasse">
          <TextInput value={name} onChange={setName} placeholder="z. B. Push" />
        </Field>

        <Eyebrow>Übungen</Eyebrow>
        <div className="tplhint">
          <span>Übung</span>
          <span>Sätze</span>
          <span>Ziel</span>
          <span />
        </div>
        {ex.map((e, i) => (
          <div key={i}>
            <div className="tplrow">
              <input type="text" value={e.n} placeholder="Übung" onChange={(ev) => patch(i, { n: ev.target.value })} />
              <input
                type="number"
                value={e.s}
                onChange={(ev) => patch(i, { s: Number(ev.target.value) || 0 })}
              />
              <input type="text" value={e.r} placeholder="8–10" onChange={(ev) => patch(i, { r: ev.target.value })} />
              <button
                type="button"
                className="rm"
                onClick={() => setEx((l) => l.filter((_, idx) => idx !== i))}
                aria-label="Übung entfernen"
              >
                ✕
              </button>
            </div>
            <div style={{ margin: '-2px 0 var(--sp-5) 2px' }}>
              {KINDS.map(([k, label]) => (
                <Chip key={k} on={(e.t ?? 'bw') === k} onClick={() => patch(i, { t: k })}>
                  {label}
                </Chip>
              ))}
            </div>
          </div>
        ))}
        <Button
          ghost
          onClick={() => setEx((l) => [...l, { n: '', s: 3, r: '', t: 'bw' }])}
          style={{ marginBottom: 'var(--sp-7)' }}
        >
          + Übung
        </Button>

        <Button onClick={() => void save()}>Vorlage speichern</Button>
        {existing && (
          <Button ghost onClick={() => void remove()} style={{ marginTop: 'var(--sp-4)' }}>
            Vorlage löschen
          </Button>
        )}
      </Scroll>
    </Screen>
  )
}
