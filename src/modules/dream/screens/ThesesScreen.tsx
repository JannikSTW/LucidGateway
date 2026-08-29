import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Empty, Text } from '../../../core/ui/basics'
import { Chip, Field, TextArea } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { DeleteRowButton } from '../../../core/ui/rows'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { regItems, verbindungen } from '../db'
import type { Confidence, Verbindung } from '../types'

const CONFIDENCE: Confidence[] = ['Vermutet', 'Mehrfach gesehen', 'Ziemlich sicher']

/** Thesen über Zusammenhänge. Sie dürfen falsch sein — das ist der Punkt. */
export function ThesesScreen() {
  const list = useLiveQuery(async () => (await verbindungen().toArray()).sort((a, b) => b.createdAt - a.createdAt), [])
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  const remove = async (v: Verbindung) => {
    const ok = await dialog.confirm({ title: 'These löschen?', text: v.text })
    if (!ok) return
    await verbindungen().delete(v.id!)
    toast('Gelöscht')
  }

  return (
    <Screen zone="ld">
      <ScreenHeader eyebrow="Auswertung" title="Unterbewusste Verbindungen" back="/traumwelt" />
      <Scroll tight>
        <Text style={{ marginBottom: 'var(--sp-8)' }}>
          Thesen über Zusammenhänge — zwischen Traumelementen, deinem Alltag und deinen Zuständen. Sie dürfen
          falsch sein; das ist der Punkt.
        </Text>
        <Button onClick={() => navigate('/traumwelt/verbindungen/neu')} style={{ marginBottom: 'var(--sp-8)' }}>
          + Verbindung formulieren
        </Button>

        {list?.length ? (
          list.map((v) => (
            <Card key={v.id}>
              <p className="quote">„{v.text}“</p>
              <div
                style={{
                  marginTop: 'var(--sp-5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  flexWrap: 'wrap',
                }}
              >
                {v.refs.map((r) => (
                  <Chip key={r} on style={{ margin: 0 }}>
                    {r}
                  </Chip>
                ))}
                <span className="pill">{v.conf}</span>
                <span style={{ marginLeft: 'auto' }}>
                  <DeleteRowButton onClick={() => void remove(v)} />
                </span>
              </div>
            </Card>
          ))
        ) : (
          <Empty>Noch keine These formuliert.</Empty>
        )}
      </Scroll>
    </Screen>
  )
}

export function ThesisFormScreen() {
  const navigate = useNavigate()
  const toast = useToast()
  const items = useLiveQuery(() => regItems().toArray(), [])
  const [text, setText] = useState('')
  const [refs, setRefs] = useState<string[]>([])
  const [conf, setConf] = useState<Confidence>('Vermutet')

  const save = async () => {
    if (!text.trim()) {
      toast('Text fehlt')
      return
    }
    await verbindungen().add({ text: text.trim(), refs, conf, createdAt: Date.now() })
    toast('These gesichert')
    navigate('/traumwelt/verbindungen')
  }

  return (
    <Screen zone="ld">
      <ScreenHeader eyebrow="Verbindungen" title="Neue These" back="/traumwelt/verbindungen" />
      <Scroll tight>
        <Field label="Die These">
          <TextArea
            value={text}
            onChange={setText}
            rows={4}
            placeholder="z. B. „Die alte Schule taucht auf, wenn ich beruflich unter Druck stehe.“"
          />
        </Field>
        <Field label="Bezieht sich auf">
          {items?.length ? (
            <div>
              {items.map((i) => (
                <Chip
                  key={i.id}
                  on={refs.includes(i.name)}
                  onClick={() =>
                    setRefs(refs.includes(i.name) ? refs.filter((x) => x !== i.name) : [...refs, i.name])
                  }
                >
                  {i.name}
                </Chip>
              ))}
            </div>
          ) : (
            <Text small>Noch keine Elemente vorhanden.</Text>
          )}
        </Field>
        <Field label="Sicherheit">
          <div>
            {CONFIDENCE.map((c) => (
              <Chip key={c} on={conf === c} onClick={() => setConf(c)}>
                {c}
              </Chip>
            ))}
          </div>
        </Field>
        <Button onClick={() => void save()}>These sichern</Button>
      </Scroll>
    </Screen>
  )
}
