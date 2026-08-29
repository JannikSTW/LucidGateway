import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Empty } from '../../../core/ui/basics'
import { Chip, Field } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row } from '../../../core/ui/rows'
import { useToast } from '../../../core/ui/toast'
import { PART_LINK_TYPES, partLinkType, partLinks, roleColor, useInnerWorld } from '../db'
import type { PartLinkType } from '../types'

export function PartLinkScreen() {
  const { name = '' } = useParams()
  const world = useInnerWorld()
  const navigate = useNavigate()
  const toast = useToast()
  const [type, setType] = useState<PartLinkType>('schuetzt')

  const back = `/innenwelt/anteil/${encodeURIComponent(name)}`
  const others = (world?.parts ?? []).filter((p) => p.name !== name)
  const t = partLinkType(type)

  const connect = async (other: string) => {
    const exists = (world?.links ?? []).some(
      (l) => ((l.a === name && l.b === other) || (l.a === other && l.b === name)) && l.type === type,
    )
    if (exists) {
      toast('Gibt es schon')
      return
    }
    await partLinks().add({ a: name, b: other, type })
    toast('Verbunden')
    navigate(back)
  }

  return (
    <Screen zone="ai">
      <ScreenHeader eyebrow={name} title="Beziehung" back={back} />
      <Scroll tight>
        <Field label="Art der Beziehung" hint={`${t.hint}${t.directed ? ' — Richtung zählt' : ' — gilt in beide Richtungen'}`}>
          <div>
            {PART_LINK_TYPES.map((x) => (
              <Chip key={x.key} on={type === x.key} tone={x.color} onClick={() => setType(x.key)}>
                {x.label}
              </Chip>
            ))}
          </div>
        </Field>

        <Eyebrow>Mit wem?</Eyebrow>
        <Card rows>
          {others.length ? (
            others.map((o) => {
              const c = roleColor(o.profile?.role, world?.parts ?? [])
              return (
                <Row
                  key={o.id}
                  icon="◍"
                  tint={`color-mix(in srgb, ${c} 13%, transparent)`}
                  fg={c}
                  title={o.name}
                  sub={o.profile?.role || 'ohne Rolle'}
                  right={<span className="chev">+</span>}
                  onClick={() => void connect(o.name)}
                />
              )
            })
          ) : (
            <Empty compact>Es gibt noch keine anderen Anteile.</Empty>
          )}
        </Card>
      </Scroll>
    </Screen>
  )
}
