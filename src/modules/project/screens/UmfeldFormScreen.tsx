import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Text } from '../../../core/ui/basics'
import { Chip, Field, TextArea, TextInput } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useToast } from '../../../core/ui/toast'
import { NGROUPS, NKINDS, netz, nkind, useNetzwerk } from '../db'
import type { NetzGroup, NetzKind } from '../types'

/** Ein Formular für sechs Arten — die Felder kommen aus der Art. */
export function UmfeldFormScreen() {
  const { id } = useParams()
  const editing = id ? Number(id) : undefined
  const net = useNetzwerk()
  const navigate = useNavigate()
  const toast = useToast()

  const [kind, setKind] = useState<NetzKind>('person')
  const [name, setName] = useState('')
  const [d, setD] = useState<Record<string, string>>({})
  const [next, setNext] = useState('')
  const [note, setNote] = useState('')
  const [loaded, setLoaded] = useState(false)

  const existing = editing !== undefined ? net?.items.find((n) => n.id === editing) : undefined

  useEffect(() => {
    if (editing === undefined) {
      setLoaded(true)
      return
    }
    if (existing && !loaded) {
      setKind(existing.kind)
      setName(existing.name)
      setD(existing.d ?? {})
      setNext(existing.next)
      setNote(existing.note)
      setLoaded(true)
    }
  }, [existing, editing, loaded])

  if (!loaded) return <Screen zone="mmm" />

  const save = async () => {
    if (!name.trim()) {
      toast('Name fehlt')
      return
    }
    const fields = nkind(kind).fields
    const cleaned: Record<string, string> = {}
    for (const [key] of fields) cleaned[key] = (d[key] ?? '').trim()
    const row = { kind, name: name.trim(), d: cleaned, next: next.trim(), note: note.trim() }
    if (existing) {
      await netz().update(existing.id!, row)
      toast('Aktualisiert')
      navigate(`/projekt/umfeld/${existing.id}`)
    } else {
      const newId = await netz().add(row)
      toast('Angelegt')
      navigate(`/projekt/umfeld/${newId}`)
    }
  }

  return (
    <Screen zone="mmm">
      <ScreenHeader
        eyebrow={existing ? 'Bearbeiten' : 'Neues Element'}
        title="Umfeld"
        back={existing ? `/projekt/umfeld/${existing.id}` : '/projekt/umfeld'}
      />
      <Scroll tight>
        <Field label="Art">
          {(Object.keys(NGROUPS) as NetzGroup[]).map((g) => (
            <div key={g} style={{ marginBottom: 'var(--sp-3)' }}>
              <Text small style={{ marginBottom: 5 }}>
                {NGROUPS[g].label}
              </Text>
              {(Object.keys(NKINDS) as NetzKind[])
                .filter((k) => NKINDS[k].grp === g)
                .map((k) => (
                  <Chip key={k} on={kind === k} onClick={() => setKind(k)}>
                    {NKINDS[k].label}
                  </Chip>
                ))}
            </div>
          ))}
        </Field>

        <Field label="Name">
          <TextInput value={name} onChange={setName} placeholder="z. B. Jugendhaus Metzingen" />
        </Field>

        {nkind(kind).fields.map(([key, label, ph]) => (
          <Field key={key} label={label}>
            <TextInput value={d[key] ?? ''} onChange={(v) => setD((s) => ({ ...s, [key]: v }))} placeholder={ph} />
          </Field>
        ))}

        <Field label="Nächster Schritt">
          <TextInput value={next} onChange={setNext} placeholder="Was ist als Nächstes zu tun?" />
        </Field>
        <Field label="Notizen">
          <TextArea value={note} onChange={setNote} rows={4} placeholder="Alles, was du dir merken willst." />
        </Field>

        <Button onClick={() => void save()}>Sichern</Button>
      </Scroll>
    </Screen>
  )
}
