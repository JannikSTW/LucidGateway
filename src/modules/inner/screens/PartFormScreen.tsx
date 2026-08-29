import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Notice, Text } from '../../../core/ui/basics'
import { Chip, Field, NumberPair, RangeRow, TextArea, TextInput } from '../../../core/ui/inputs'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { ROLE_SUGGEST, distLabel, parts, roleColor, roleOrder, useInnerWorld } from '../db'
import type { PartProfile } from '../types'

const EMPTY: PartProfile = { role: '', dist: 5, does: '', protects: '', trigger: '', body: '', age: '' }

export function PartFormScreen() {
  const { name = '' } = useParams()
  const world = useInnerWorld()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()
  const [p, setP] = useState<PartProfile>(EMPTY)
  const [extraRoles, setExtraRoles] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  const part = world?.parts.find((x) => x.name === name)

  useEffect(() => {
    if (part && !loaded) {
      setP(part.profile ?? EMPTY)
      setLoaded(true)
    }
  }, [part, loaded])

  if (!world || !part) return <Screen zone="ai" />

  const back = `/innenwelt/anteil/${encodeURIComponent(name)}`
  const roles = [...new Set([...roleOrder(world.parts), ...extraRoles])]
  const suggestion = ROLE_SUGGEST.find(([r]) => r === p.role)?.[1]
  // Verletzte Anteile gehören in einen geschützten Rahmen — Hinweis auf die
  // Grenze zwischen Coaching und Therapie.
  const warn = /verletzt|jung|exil/i.test(p.role)

  const addRole = async () => {
    const r = await dialog.text({ title: 'Eigene Rolle', placeholder: 'z. B. Die Wächterin' })
    if (!r) return
    setExtraRoles((s) => [...s, r])
    setP((s) => ({ ...s, role: r }))
  }

  const save = async () => {
    await parts().update(part.id!, { profile: p })
    toast('Profil gesichert')
    navigate(back)
  }

  return (
    <Screen zone="ai">
      <ScreenHeader eyebrow={name} title="Anteil profilieren" back={back} />
      <Scroll tight>
        <Field label="Rolle">
          <div>
            {roles.map((r) => (
              <Chip
                key={r}
                on={p.role === r}
                tone={p.role === r ? roleColor(r, world.parts) : undefined}
                onClick={() => setP((s) => ({ ...s, role: s.role === r ? '' : r }))}
              >
                {r}
              </Chip>
            ))}
            <Chip onClick={() => void addRole()}>+ Eigene</Chip>
          </div>
          <Text small style={{ marginTop: 'var(--sp-2)' }}>
            {suggestion ?? 'Frei wählbar — die Vorschläge stammen aus IFS, du kannst eigene ergänzen.'}
          </Text>
        </Field>

        <Field label="Abstand zum Selbst" hint={distLabel(p.dist)}>
          <RangeRow
            value={p.dist}
            onChange={(v) => setP((s) => ({ ...s, dist: v }))}
            left="vermischt"
            right="verschlossen"
          />
        </Field>

        <Field label="Was tut er?">
          <TextArea
            value={p.does}
            onChange={(v) => setP((s) => ({ ...s, does: v }))}
            rows={3}
            placeholder="Wie zeigt er sich? Was übernimmt er?"
          />
        </Field>

        <Field
          label={
            <>
              Wovor schützt er? <span className="soft">— positive Absicht</span>
            </>
          }
        >
          <TextArea
            value={p.protects}
            onChange={(v) => setP((s) => ({ ...s, protects: v }))}
            rows={3}
            placeholder="Auch harte Anteile meinen es gut. Was ist die Absicht dahinter?"
          />
        </Field>

        <Field label="Auslöser">
          <TextInput
            value={p.trigger}
            onChange={(v) => setP((s) => ({ ...s, trigger: v }))}
            placeholder="Wann tritt er auf den Plan?"
          />
        </Field>

        <Field label="Körperempfinden & gefühltes Alter">
          <NumberPair>
            <TextInput value={p.body} onChange={(v) => setP((s) => ({ ...s, body: v }))} placeholder="Wo im Körper?" />
            <TextInput value={p.age} onChange={(v) => setP((s) => ({ ...s, age: v }))} placeholder="Wie alt fühlt er sich?" />
          </NumberPair>
        </Field>

        {warn && (
          <Notice tone="var(--rose)" toneFg="var(--rose-fg)">
            Verletzte Anteile gehören in geschützten Rahmen. Für dich selbst in Ordnung — in der Klientenarbeit
            endet hier das Coaching und beginnt Therapie.
          </Notice>
        )}

        <Button onClick={() => void save()}>Profil sichern</Button>
      </Scroll>
    </Screen>
  )
}
