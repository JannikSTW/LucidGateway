import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../core/ui/basics'
import { Chip, Field, NumberPair, TextArea, TextInput } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useToast } from '../../../core/ui/toast'
import { dayLabel, isoOf } from '../../../core/util/date'
import { discipline, trainings, useTrainings } from '../db'
import type { DisciplineKey } from '../types'

/** Einheit ohne Vorlage — für MMA, Mobility und Ausdauer. */
export function TrainFormScreen({ editId }: { editId?: number }) {
  const params = useParams()
  const existing = (useTrainings() ?? []).find((t) => t.id === editId)
  const disc = editId !== undefined ? (existing?.disc ?? 'mma') : (params.disc ?? 'mma')
  const d = discipline(disc)
  const navigate = useNavigate()
  const toast = useToast()
  const [venue, setVenue] = useState<string | null>(d.venues?.[0] ?? null)
  const [focus, setFocus] = useState<string | null>(null)
  const [dur, setDur] = useState('')
  const [rpe, setRpe] = useState('')
  const [detail, setDetail] = useState('')
  const [feel, setFeel] = useState('')
  const [loaded, setLoaded] = useState(editId === undefined)

  useEffect(() => {
    if (loaded || !existing) return
    setVenue(existing.venue)
    setFocus(existing.focus)
    setDur(existing.dur === null ? '' : String(existing.dur))
    setRpe(existing.rpe === null ? '' : String(existing.rpe))
    setDetail(existing.detail)
    setFeel(existing.feel)
    setLoaded(true)
  }, [existing, loaded])

  const save = async () => {
    const now = new Date()
    if (existing) {
      await trainings().update(existing.id!, {
        venue: d.venues ? venue : null,
        focus: focus ?? d.name,
        dur: dur ? Number(dur) : null,
        rpe: rpe ? Number(rpe) : null,
        detail: detail.trim(),
        feel: feel.trim(),
      })
      toast('Aktualisiert')
      navigate(`/training/einheit/${existing.id}`)
      return
    }
    await trainings().add({
      disc: disc as DisciplineKey,
      venue: d.venues ? venue : null,
      focus: focus ?? d.name,
      dur: dur ? Number(dur) : null,
      rpe: rpe ? Number(rpe) : null,
      detail: detail.trim(),
      feel: feel.trim(),
      iso: isoOf(now),
      date: dayLabel(now),
      createdAt: now.getTime(),
    })
    toast('Einheit gesichert')
    navigate(`/training/${disc}`)
  }

  if (!loaded) return <Screen zone="ms" />

  return (
    <Screen zone="ms">
      <ScreenHeader
        eyebrow={d.name}
        title={existing ? 'Einheit bearbeiten' : 'Neue Einheit'}
        icon={d.icon}
        tint={d.tint}
        fg={d.color}
        back={existing ? `/training/einheit/${existing.id}` : `/training/${disc}`}
      />
      <Scroll tight>
        {d.venues && (
          <Field label="Ort">
            <div>
              {d.venues.map((v) => (
                <Chip key={v} on={venue === v} onClick={() => setVenue(v)}>
                  {v}
                </Chip>
              ))}
            </div>
          </Field>
        )}
        <Field label={d.focusLabel}>
          <div>
            {d.focus.map((f) => (
              <Chip key={f} on={focus === f} onClick={() => setFocus(focus === f ? null : f)}>
                {f}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Dauer & Intensität">
          <NumberPair>
            <TextInput type="number" inputMode="numeric" value={dur} onChange={setDur} placeholder="Minuten" />
            <TextInput type="number" inputMode="numeric" value={rpe} onChange={setRpe} placeholder="RPE 1–10" />
          </NumberPair>
        </Field>
        <Field label={d.detailLabel}>
          <TextArea value={detail} onChange={setDetail} rows={6} placeholder={d.detailPh} />
        </Field>
        <Field
          label={
            <>
              Wie war&apos;s? <span className="soft">— kurz, in einem Satz</span>
            </>
          }
        >
          <TextArea value={feel} onChange={setFeel} rows={3} placeholder="Energie, Technik, Kopf …" />
        </Field>
        <Button onClick={() => void save()}>{existing ? 'Änderungen sichern' : 'Einheit sichern'}</Button>
      </Scroll>
    </Screen>
  )
}
