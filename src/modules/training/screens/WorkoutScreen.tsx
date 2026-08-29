import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty, Text } from '../../../core/ui/basics'
import { Field, NumberPair, TextArea, TextInput } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { dayLabel, isoOf } from '../../../core/util/date'
import { DISCIPLINES, lastFor, templates, trainings, useTrainings } from '../db'
import type { DoneExercise } from '../types'

/** Beim Durchführen wird die Vorlage kopiert — spätere Änderungen wirken nicht rückwirkend. */
export function WorkoutScreen({ editId }: { editId?: number }) {
  const { key } = useParams()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()
  const history = useTrainings() ?? []
  const d = DISCIPLINES.kraft

  const existing = editId !== undefined ? history.find((t) => t.id === editId) : undefined
  const [name, setName] = useState('Freies Training')
  const [ex, setEx] = useState<DoneExercise[]>([])
  const [ready, setReady] = useState(false)
  const [dur, setDur] = useState('')
  const [rpe, setRpe] = useState('')
  const [feel, setFeel] = useState('')

  useEffect(() => {
    let alive = true
    const load = async () => {
      if (editId !== undefined) {
        if (!existing) return
        if (!alive) return
        setName(existing.focus)
        setEx((existing.ex ?? []).map((e) => ({ ...e })))
        setDur(existing.dur === null ? '' : String(existing.dur))
        setRpe(existing.rpe === null ? '' : String(existing.rpe))
        setFeel(existing.feel)
        setReady(true)
        return
      }
      if (!key || key === 'frei') {
        if (alive) {
          setName('Freies Training')
          setEx([])
          setReady(true)
        }
        return
      }
      const tpl = (await templates().toArray()).find((t) => t.key === key)
      if (!alive) return
      setName(tpl?.name ?? 'Freies Training')
      setEx((tpl?.ex ?? []).map((e) => ({ ...e, kg: '', reps: '', done: false, skip: false })))
      setReady(true)
    }
    void load()
    return () => {
      alive = false
    }
  }, [key, editId, existing])

  const patch = (i: number, p: Partial<DoneExercise>) =>
    setEx((list) => list.map((e, idx) => (idx === i ? { ...e, ...p } : e)))

  const addExercise = async () => {
    const n = await dialog.text({ title: 'Übung ergänzen', placeholder: 'Name der Übung' })
    if (!n) return
    setEx((list) => [...list, { n, s: 3, r: 'frei', t: 'bw', kg: '', reps: '', done: false, skip: false }])
    toast('Art lässt sich in der Vorlage festlegen')
  }

  const save = async () => {
    const now = new Date()
    const kept = ex.filter((e) => !e.skip)
    const done = kept.filter((e) => e.done)
    const detail = done
      .map((e) => {
        if (e.t === 'load') return `${e.n} ${e.kg || ''} kg × ${e.reps || ''}`.replace(/\s+/g, ' ').trim()
        if (e.t === 'time') return `${e.n} ${e.reps || ''} s${e.kg ? ` +${e.kg} kg` : ''}`.trim()
        return `${e.n} ${e.reps || ''} Wdh${e.kg ? ` +${e.kg} kg` : ''}`.trim()
      })
      .join('\n')
    if (existing) {
      await trainings().update(existing.id!, {
        focus: name,
        dur: dur ? Number(dur) : null,
        rpe: rpe ? Number(rpe) : null,
        ex: kept,
        detail,
        feel: feel.trim(),
      })
      toast('Aktualisiert')
      navigate(`/training/einheit/${existing.id}`)
      return
    }
    await trainings().add({
      disc: 'kraft',
      venue: null,
      focus: name,
      template: key && key !== 'frei' ? key : null,
      dur: dur ? Number(dur) : null,
      rpe: rpe ? Number(rpe) : null,
      ex: kept,
      detail,
      feel: feel.trim(),
      iso: isoOf(now),
      date: dayLabel(now),
      createdAt: now.getTime(),
    })
    toast(done.length ? `${done.length} Übungen gesichert` : 'Einheit gesichert')
    navigate('/training/kraft')
  }

  if (!ready) return <Screen zone="ms" />

  return (
    <Screen zone="ms">
      <ScreenHeader
        eyebrow="Krafttraining"
        title={name}
        icon={d.icon}
        tint={d.tint}
        fg={d.color}
        back={existing ? `/training/einheit/${existing.id}` : '/training/kraft/start'}
      />
      <Scroll tight>
        <Text small style={{ marginBottom: 'var(--sp-7)' }}>
          {existing
            ? 'Diese Einheit ist eine Kopie der Vorlage von damals — Änderungen hier bleiben bei ihr.'
            : 'Kopie der Vorlage — Änderungen hier wirken sich nicht auf die Vorlage aus. Übungen kannst du überspringen oder ergänzen.'}
        </Text>

        <Card rows>
          {ex.length ? (
            ex.map((e, i) => {
              const last = lastFor(history, e.n)
              const fields: { key: 'kg' | 'reps'; ph: string; numeric: boolean }[] =
                e.t === 'load'
                  ? [
                      { key: 'kg', ph: 'kg', numeric: true },
                      { key: 'reps', ph: 'Wdh', numeric: false },
                    ]
                  : e.t === 'time'
                    ? [
                        { key: 'reps', ph: 'Sek.', numeric: true },
                        { key: 'kg', ph: '+kg', numeric: true },
                      ]
                    : [
                        { key: 'reps', ph: 'Wdh', numeric: false },
                        { key: 'kg', ph: '+kg', numeric: true },
                      ]
              return (
                <div key={`${e.n}-${i}`} className={`exrow${e.skip ? ' skipped' : ''}`}>
                  <div className="exhead">
                    <div>
                      <b>{e.n}</b>
                      <span className="target">
                        {e.s} × {e.r}
                      </span>
                      {last && <span className="last"> · {last}</span>}
                    </div>
                    <button
                      type="button"
                      className="exskip"
                      onClick={() => patch(i, { skip: !e.skip })}
                      title="überspringen"
                    >
                      {e.skip ? '↺' : '✕'}
                    </button>
                  </div>
                  <div className="exin">
                    {fields.map((f) => (
                      <input
                        key={f.key}
                        type={f.numeric ? 'number' : 'text'}
                        inputMode="decimal"
                        placeholder={f.ph}
                        value={e[f.key]}
                        onChange={(ev) => patch(i, { [f.key]: ev.target.value })}
                      />
                    ))}
                    <button
                      type="button"
                      className={`exdone${e.done ? ' on' : ''}`}
                      onClick={() => patch(i, { done: !e.done })}
                      aria-label="erledigt"
                    >
                      ✓
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <Empty>Noch keine Übung — unten ergänzen.</Empty>
          )}
        </Card>

        <Button ghost onClick={() => void addExercise()} style={{ marginBottom: 'var(--sp-9)' }}>
          + Übung ergänzen
        </Button>

        <Field label="Dauer & Intensität">
          <NumberPair>
            <TextInput type="number" inputMode="numeric" value={dur} onChange={setDur} placeholder="Minuten" />
            <TextInput type="number" inputMode="numeric" value={rpe} onChange={setRpe} placeholder="RPE 1–10" />
          </NumberPair>
        </Field>
        <Field label="Wie war's?">
          <TextArea value={feel} onChange={setFeel} rows={3} placeholder="Energie, Technik, Kopf …" />
        </Field>
        <Button onClick={() => void save()}>{existing ? 'Änderungen sichern' : 'Einheit sichern'}</Button>
      </Scroll>
    </Screen>
  )
}
