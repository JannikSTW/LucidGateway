import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Notice, Text } from '../../../core/ui/basics'
import { Chip, Field, SliderRow, TextArea, TextInput } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useToast } from '../../../core/ui/toast'
import { BIG5, clients, emptyBig5, useClients } from '../db'
import type { AgeGroup, Big5, Big5Dir } from '../types'

const AGES: AgeGroup[] = ['unter 14', '14–17', '18+']

export function ClientFormScreen() {
  const { id } = useParams()
  const editing = id ? Number(id) : undefined
  const list = useClients()
  const navigate = useNavigate()
  const toast = useToast()

  const [name, setName] = useState('')
  const [age, setAge] = useState<AgeGroup>('18+')
  const [consent, setConsent] = useState('Noch offen')
  const [reason, setReason] = useState('')
  const [goal, setGoal] = useState('')
  const [base, setBase] = useState<Big5>(emptyBig5())
  const [dir, setDir] = useState<Big5Dir>({ o: 0, c: 0, e: 0, a: 0, s: 0 })
  const [loaded, setLoaded] = useState(false)

  const existing = editing !== undefined ? list?.find((c) => c.id === editing) : undefined

  useEffect(() => {
    if (editing === undefined) {
      setLoaded(true)
      return
    }
    if (existing && !loaded) {
      setName(existing.name)
      setAge(existing.age)
      setConsent(existing.consent ?? 'Noch offen')
      setReason(existing.reason)
      setBase(existing.big5base)
      setDir(existing.b5dir)
      setLoaded(true)
    }
  }, [existing, editing, loaded])

  if (!loaded) return <Screen zone="mmm" />

  const minor = age !== '18+'

  const save = async () => {
    if (!name.trim()) {
      toast('Kürzel fehlt')
      return
    }
    if (existing) {
      await clients().update(existing.id!, {
        name: name.trim(),
        age,
        consent: minor ? consent : null,
        reason: reason.trim(),
        big5base: base,
        b5dir: dir,
      })
      toast('Aktualisiert')
      navigate(`/projekt/klienten/${existing.id}`)
      return
    }
    const newId = await clients().add({
      name: name.trim(),
      age,
      consent: minor ? consent : null,
      reason: reason.trim(),
      goals: goal.trim() ? [{ text: goal.trim(), status: 'offen' }] : [],
      big5base: base,
      b5dir: dir,
      since: new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }),
      createdAt: Date.now(),
    })
    toast('Klient angelegt')
    navigate(`/projekt/klienten/${newId}`)
  }

  return (
    <Screen zone="mmm">
      <ScreenHeader
        eyebrow="Klienten"
        title={existing ? 'Stammdaten' : 'Neuer Klient'}
        back={existing ? `/projekt/klienten/${existing.id}` : '/projekt/klienten'}
      />
      <Scroll tight>
        <Field label="Kürzel oder Vorname">
          <TextInput value={name} onChange={setName} placeholder="z. B. M. oder Malik" />
        </Field>

        <Field label="Altersgruppe">
          <div>
            {AGES.map((a) => (
              <Chip key={a} on={age === a} onClick={() => setAge(a)}>
                {a}
              </Chip>
            ))}
          </div>
        </Field>

        {minor && (
          <>
            <Notice tone="var(--red)" toneFg="var(--red-fg)">
              Minderjährig: Einverständnis der Erziehungsberechtigten sollte vorliegen, bevor du Notizen führst.
            </Notice>
            <Field label="Einverständnis">
              <div>
                {['Liegt vor', 'Noch offen'].map((c) => (
                  <Chip key={c} on={consent === c} onClick={() => setConsent(c)}>
                    {c}
                  </Chip>
                ))}
              </div>
            </Field>
          </>
        )}

        <Field
          label={
            <>
              Anlass <span className="soft">— warum ist die Person da?</span>
            </>
          }
        >
          <TextArea value={reason} onChange={setReason} rows={3} placeholder="In eigenen Worten, kurz." />
        </Field>

        {!existing && (
          <Field
            label={
              <>
                Erstes Ziel <span className="soft">— optional</span>
              </>
            }
          >
            <TextInput value={goal} onChange={setGoal} placeholder="z. B. Ruhig bleiben, wenn es eng wird" />
          </Field>
        )}

        <Eyebrow style={{ marginTop: 'var(--sp-9)' }}>Big Five — Ausgangsmessung</Eyebrow>
        <Text small style={{ marginBottom: 'var(--sp-6)' }}>
          Dein Eindruck beim Erstgespräch. Referenzlinie für alle späteren Sitzungen.
        </Text>
        <div className="field">
          {BIG5.map(([k, label, hint]) => (
            <SliderRow
              key={k}
              label={label}
              title={hint}
              value={base[k]}
              onChange={(v) => setBase((s) => ({ ...s, [k]: v }))}
            />
          ))}
        </div>

        <Eyebrow>Richtung</Eyebrow>
        <Text small style={{ marginBottom: 'var(--sp-6)' }}>
          Kein Wert ist besser als ein anderer. Lege gemeinsam mit dem Klienten fest, wohin es gehen soll — oder
          lass es bei „halten“.
        </Text>
        <div className="field">
          {BIG5.map(([k, label, hint]) => (
            <div className="dirrow" key={k}>
              <div className="dl">
                <b>{label}</b>
                <span>{hint}</span>
              </div>
              <div className="dirpick">
                {[
                  [-1, '↓', 'senken'],
                  [0, '–', 'halten'],
                  [1, '↑', 'steigern'],
                ].map(([v, glyph, title]) => (
                  <button
                    key={String(v)}
                    type="button"
                    className={dir[k] === v ? 'on' : ''}
                    title={String(title)}
                    onClick={() => setDir((s) => ({ ...s, [k]: v as number }))}
                  >
                    {glyph}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={() => void save()}>{existing ? 'Sichern' : 'Klient anlegen'}</Button>
      </Scroll>
    </Screen>
  )
}
