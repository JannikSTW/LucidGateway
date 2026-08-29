import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../core/ui/basics'
import { Chip, Field, NumberPair, TextArea, TextInput } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useToast } from '../../../core/ui/toast'
import { dayLabel, isoOf } from '../../../core/util/date'
import { discipline, trainings } from '../db'
import type { DisciplineKey } from '../types'

/** Einheit ohne Vorlage — für MMA, Mobility und Ausdauer. */
export function TrainFormScreen() {
  const { disc = 'mma' } = useParams()
  const d = discipline(disc)
  const navigate = useNavigate()
  const toast = useToast()
  const [venue, setVenue] = useState<string | null>(d.venues?.[0] ?? null)
  const [focus, setFocus] = useState<string | null>(null)
  const [dur, setDur] = useState('')
  const [rpe, setRpe] = useState('')
  const [detail, setDetail] = useState('')
  const [feel, setFeel] = useState('')

  const save = async () => {
    const now = new Date()
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

  return (
    <Screen zone="ms">
      <ScreenHeader
        eyebrow={d.name}
        title="Neue Einheit"
        icon={d.icon}
        tint={d.tint}
        fg={d.color}
        back={`/training/${disc}`}
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
        <Button onClick={() => void save()}>Einheit sichern</Button>
      </Scroll>
    </Screen>
  )
}
