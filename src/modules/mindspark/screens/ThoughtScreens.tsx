import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Empty, Text } from '../../../core/ui/basics'
import { Chip, Field, TextArea } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { createEntry, emptyEntry } from '../../../core/db/entries'
import { category } from '../../../core/modules/registry'
import { dayLabel, isoOf } from '../../../core/util/date'
import { firstLine } from '../../../core/util/text'
import { thoughts, useThoughts } from '../db'
import type { Thought } from '../types'

/** Ein Feld, ein Tap. Kein Titel, keine Kategorie — sortieren später. */
export function QuickThoughtScreen() {
  const [text, setText] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  const save = async () => {
    if (!text.trim()) {
      toast('Nichts zu sichern')
      return
    }
    const now = new Date()
    await thoughts().add({
      text: text.trim(),
      date: dayLabel(now),
      iso: isoOf(now),
      createdAt: now.getTime(),
    })
    toast('Gedanke gesichert')
    navigate('/gedankenspeicher')
  }

  return (
    <Screen zone="ms">
      <ScreenHeader eyebrow="Gedankenspeicher" title="Gedanke festhalten" back="/neu" />
      <Scroll tight>
        <Field>
          <TextArea
            value={text}
            onChange={setText}
            rows={8}
            placeholder="Einfach lostippen. Kein Titel, keine Kategorie."
          />
        </Field>
        <Button onClick={() => void save()}>Sichern</Button>
        <Text small style={{ textAlign: 'center', marginTop: 'var(--sp-5)' }}>
          Landet im Gedankenspeicher unter MindSpark. Von dort kannst du ihn später weiterverwenden.
        </Text>
      </Scroll>
    </Screen>
  )
}

export function InboxScreen() {
  const list = useThoughts() ?? []
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  /** Ein Gedanke wird zum vollwertigen Eintrag — der Speicher bleibt leer. */
  const promote = async (t: Thought, cat: string) => {
    await createEntry({
      ...emptyEntry(cat),
      title: firstLine(t.text),
      b1: t.text,
      date: t.date,
      iso: t.iso,
    })
    await thoughts().delete(t.id!)
    toast(`In ${category(cat)?.short ?? cat} übernommen`)
    navigate(`/kategorie/${cat}`)
  }

  const remove = async (t: Thought) => {
    const ok = await dialog.confirm({ title: 'Gedanke löschen?', text: firstLine(t.text, 60) })
    if (!ok) return
    await thoughts().delete(t.id!)
    toast('Gelöscht')
  }

  return (
    <Screen zone="ms">
      <ScreenHeader eyebrow="MindSpark" title="Gedankenspeicher" back="/kategorie/ms" />
      <Scroll tight>
        <Button onClick={() => navigate('/gedanke')} style={{ marginBottom: 'var(--sp-8)' }}>
          + Gedanke festhalten
        </Button>

        {list.length ? (
          list.map((t) => (
            <Card key={t.id}>
              <Text strong pre>
                {t.text}
              </Text>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'var(--sp-5)',
                  gap: 'var(--sp-3)',
                  flexWrap: 'wrap',
                }}
              >
                <span className="sub small">{t.date}</span>
                <span>
                  <Chip onClick={() => void promote(t, 'ms')}>→ Journal</Chip>
                  <Chip onClick={() => void promote(t, 'mmm')}>→ Projekt</Chip>
                  <Chip onClick={() => void remove(t)}>✕</Chip>
                </span>
              </div>
            </Card>
          ))
        ) : (
          <Empty>
            Noch nichts hier.
            <br />
            Alles, was dir durch den Kopf geht, kann hier landen.
          </Empty>
        )}
      </Scroll>
    </Screen>
  )
}
