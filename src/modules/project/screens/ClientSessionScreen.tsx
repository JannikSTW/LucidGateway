import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../core/ui/basics'
import { Chip, Field, NumberPair, SliderRow, TextArea, TextInput } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useToast } from '../../../core/ui/toast'
import { dayLabel, isoOf } from '../../../core/util/date'
import { useLiveQuery } from 'dexie-react-hooks'
import { BIG5, clientSessions, emptyBig5, useClients } from '../db'
import type { Big5 } from '../types'

const FOCUS = ['Fitness', 'Technik', 'Koordination']

/**
 * Vier Abschnitte: Beratung (grün) · Kampfsport (rot) · Big Five · Abschluss.
 * Der Übertrag ist das Kernstück — was auf der Matte sichtbar wurde und mit
 * dem Thema zusammenhängt.
 */
export function ClientSessionScreen({ mode = 'new' }: { mode?: 'new' | 'edit' }) {
  // Zwei Wege hierher: neue Sitzung eines Klienten (:id ist der Klient) oder
  // ein bestehendes Protokoll bearbeiten (:id ist das Protokoll).
  const { id } = useParams()
  const editing = mode === 'edit'
  const existing = useLiveQuery(
    async () => (editing && id ? ((await clientSessions().get(Number(id))) ?? null) : null),
    [editing, id],
  )
  const cid = editing ? (existing?.cid ?? 0) : Number(id)
  const client = (useClients() ?? []).find((c) => c.id === cid)
  const navigate = useNavigate()
  const toast = useToast()

  const [dur, setDur] = useState('')
  const [mood, setMood] = useState('')
  const [topic, setTopic] = useState('')
  const [talk, setTalk] = useState('')
  const [focus, setFocus] = useState('Fitness')
  const [train, setTrain] = useState('')
  const [big5, setBig5] = useState<Big5>(emptyBig5())
  const [bridge, setBridge] = useState('')
  const [self, setSelf] = useState('')
  const [loaded, setLoaded] = useState(!editing)

  useEffect(() => {
    if (loaded || !existing) return
    setDur(existing.dur === null ? '' : String(existing.dur))
    setMood(existing.mood)
    setTopic(existing.topic)
    setTalk(existing.talk)
    setFocus(existing.focus)
    setTrain(existing.train)
    setBig5(existing.big5)
    setBridge(existing.bridge)
    setSelf(existing.self)
    setLoaded(true)
  }, [existing, loaded])

  const save = async () => {
    const now = new Date()
    const row = {
      dur: dur ? Number(dur) : null,
      mood: mood.trim(),
      focus,
      topic: topic.trim(),
      talk: talk.trim(),
      train: train.trim(),
      bridge: bridge.trim(),
      self: self.trim(),
      big5,
    }
    if (existing) {
      await clientSessions().update(existing.id!, row)
      toast('Aktualisiert')
      navigate(`/projekt/protokoll/${existing.id}`)
      return
    }
    await clientSessions().add({
      cid,
      dur: dur ? Number(dur) : null,
      mood: mood.trim(),
      focus,
      topic: topic.trim(),
      talk: talk.trim(),
      train: train.trim(),
      bridge: bridge.trim(),
      self: self.trim(),
      big5,
      iso: isoOf(now),
      date: dayLabel(now),
      createdAt: now.getTime(),
    })
    toast('Protokoll gesichert')
    navigate(`/projekt/klienten/${cid}`)
  }

  if (!loaded) return <Screen zone="mmm" />

  return (
    <Screen zone="mmm">
      <ScreenHeader
        eyebrow={client?.name ?? 'Klient'}
        title={existing ? 'Protokoll bearbeiten' : 'Protokoll'}
        back={existing ? `/projekt/protokoll/${existing.id}` : `/projekt/klienten/${cid}`}
      />
      <Scroll tight>
        <Eyebrow className="eb-talk">Beratung</Eyebrow>
        <Field label="Dauer & Verfassung bei Ankunft" className="f-talk">
          <NumberPair>
            <TextInput type="number" inputMode="numeric" value={dur} onChange={setDur} placeholder="Minuten" />
            <TextInput value={mood} onChange={setMood} placeholder="Wie kam er/sie an?" />
          </NumberPair>
        </Field>
        <Field label="Thema der Sitzung" className="f-talk">
          <TextInput value={topic} onChange={setTopic} placeholder="Worum ging es?" />
        </Field>
        <Field label="Gespräch" className="f-talk">
          <TextArea
            value={talk}
            onChange={setTalk}
            rows={7}
            placeholder={'Verlauf, Ressourcen, Fortschritt.\nEigene Worte des Klienten sparsam und dann wörtlich.'}
          />
        </Field>

        <Eyebrow className="eb-train" style={{ marginTop: 'var(--sp-10)' }}>
          Kampfsport
        </Eyebrow>
        <Field label="Schwerpunkt" className="f-train">
          <div>
            {FOCUS.map((f) => (
              <Chip key={f} on={focus === f} onClick={() => setFocus(f)}>
                {f}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Training & Beobachtung" className="f-train">
          <TextArea
            value={train}
            onChange={setTrain}
            rows={7}
            placeholder={'Was wurde gemacht — und was war dabei sichtbar?\nBesonders: Verhalten unter Druck.'}
          />
        </Field>

        <Eyebrow style={{ marginTop: 'var(--sp-10)' }}>Big Five</Eyebrow>
        <div className="field">
          {BIG5.map(([k, label, hint]) => (
            <SliderRow
              key={k}
              label={label}
              title={hint}
              value={big5[k]}
              onChange={(v) => setBig5((s) => ({ ...s, [k]: v }))}
            />
          ))}
        </div>

        <Eyebrow className="eb-end" style={{ marginTop: 'var(--sp-10)' }}>
          Abschluss
        </Eyebrow>
        <Field label="Übertrag & Vereinbarung" className="f-end">
          <TextArea
            value={bridge}
            onChange={setBridge}
            rows={5}
            placeholder={'Verbindung zwischen Matte und Gespräch.\nUnd was bis zum nächsten Mal vereinbart ist.'}
          />
        </Field>
        <Field
          label={
            <>
              Für mich <span className="soft">— eigene Rolle, was ich anders machen würde</span>
            </>
          }
          className="f-end"
        >
          <TextArea value={self} onChange={setSelf} rows={3} placeholder="Nur für dich." />
        </Field>

        <Button onClick={() => void save()}>{existing ? 'Änderungen sichern' : 'Protokoll sichern'}</Button>
      </Scroll>
    </Screen>
  )
}
