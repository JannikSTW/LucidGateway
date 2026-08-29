import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Empty, Text } from '../ui/basics'
import { Chip, Field, Fold, ModeSwitch, Segmented, TextArea, TextInput } from '../ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../ui/layout'
import { ScanPicker } from '../ui/Scans'
import { useToast } from '../ui/toast'
import { createEntry, emptyEntry, updateEntry, useEntry, type EntryDraft } from '../db/entries'
import { category } from '../modules/registry'
import type { Entry } from '../types'

/**
 * Das gemeinsame Journalformular. Es kennt keine Kategorie im Detail —
 * Beschriftungen, Skala, Marker und Zusatzabschnitte kommen aus der
 * Kategoriedefinition des Moduls (ein Eingabeort, viele Ansichten).
 */
export function JournalScreen() {
  const { key = '', id } = useParams()
  const editing = id ? Number(id) : undefined
  const existing = useEntry(editing)
  const navigate = useNavigate()
  const toast = useToast()
  const cat = category(key)

  const [draft, setDraft] = useState<EntryDraft>(() => emptyEntry(key))
  const [mode, setMode] = useState<'typed' | 'paper'>('typed')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (editing === undefined) {
      setDraft(emptyEntry(key))
      setMode('typed')
      setLoaded(true)
      return
    }
    if (existing) {
      setDraft(existing)
      setMode(existing.paper ? 'paper' : 'typed')
      setLoaded(true)
    }
  }, [editing, existing, key])

  const patch = useMemo(
    () => (p: Partial<Entry>) => setDraft((d) => ({ ...d, ...p })),
    [],
  )

  if (!cat?.journal) {
    return (
      <Screen>
        <ScreenHeader title="Kein Journal" back="/" />
        <Scroll>
          <Empty>Diese Kategorie führt kein Journal.</Empty>
        </Scroll>
      </Screen>
    )
  }
  if (!loaded) return <Screen zone={cat.zone} />

  const j = cat.journal
  const paperMode = mode === 'paper'

  const save = async () => {
    const row: Partial<Entry> = {
      ...draft,
      cat: key,
      title: draft.title.trim(),
      b1: paperMode ? draft.b1 : draft.b1.trim(),
      b2: paperMode ? draft.b2 : draft.b2.trim(),
      paper: paperMode,
    }
    if (editing !== undefined) {
      await updateEntry(editing, row)
      toast('Aktualisiert')
      navigate(`/eintrag/${editing}`, { replace: true })
    } else {
      const newId = await createEntry(row as EntryDraft)
      toast('Eintrag gesichert')
      navigate(`/eintrag/${newId}`, { replace: true })
    }
  }

  return (
    <Screen zone={cat.zone}>
      <ScreenHeader
        eyebrow={cat.name}
        title={editing !== undefined ? 'Bearbeiten' : 'Journal'}
        icon={cat.icon}
        tint={cat.tint}
        fg={cat.fg}
      />
      <Scroll tight>
        <Field label="Titel">
          <TextInput value={draft.title} onChange={(v) => patch({ title: v })} placeholder="Kurze Überschrift" />
        </Field>

        {j.paper && (
          <ModeSwitch
            options={[
              { key: 'typed', label: 'Tippen' },
              { key: 'paper', label: 'Tagebuch scannen' },
            ]}
            value={mode}
            onChange={setMode}
          />
        )}

        {paperMode ? (
          <>
            <Field>
              <ScanPicker ids={draft.scans} onChange={(ids) => patch({ scans: ids })} />
            </Field>
            <Field label="Stichworte zum Wiederfinden">
              <TextInput
                value={draft.keywords ?? ''}
                onChange={(v) => patch({ keywords: v })}
                placeholder="Optional"
              />
            </Field>
          </>
        ) : (
          <>
            <Field label={j.b1.label}>
              <TextArea value={draft.b1} onChange={(v) => patch({ b1: v })} placeholder={j.b1.ph} rows={7} />
            </Field>
            <Field label={j.b2.label}>
              <TextArea value={draft.b2} onChange={(v) => patch({ b2: v })} placeholder={j.b2.ph} rows={7} />
            </Field>
          </>
        )}

        {j.showScale !== false && (
          <Field label={j.scale.label}>
            <Segmented count={6} value={draft.scale} onChange={(v) => patch({ scale: v })} hints={j.scale.hints} />
          </Field>
        )}

        {j.extras?.map((extra) => (
          <Fold key={extra.id} summary={extra.label}>
            <extra.Component
              value={draft[extra.field]}
              onChange={(v) => patch({ [extra.field]: v } as Partial<Entry>)}
            />
          </Fold>
        ))}

        {j.showTags !== false && j.tags.length > 0 && (
          <Field label="Marker">
            <div>
              {j.tags.map((t) => (
                <Chip
                  key={t}
                  on={draft.tags.includes(t)}
                  onClick={() =>
                    patch({ tags: draft.tags.includes(t) ? draft.tags.filter((x) => x !== t) : [...draft.tags, t] })
                  }
                >
                  {t}
                </Chip>
              ))}
            </div>
          </Field>
        )}

        <Button onClick={() => void save()}>{editing !== undefined ? 'Änderungen sichern' : 'Eintrag sichern'}</Button>
        {paperMode && (
          <Text small style={{ textAlign: 'center', marginTop: 'var(--sp-5)' }}>
            Der Scan ersetzt den Fließtext. Alles andere trägst du wie gewohnt ein.
          </Text>
        )}
      </Scroll>
    </Screen>
  )
}
