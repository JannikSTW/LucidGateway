import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Empty } from '../../../core/ui/basics'
import { Chip, Field } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row } from '../../../core/ui/rows'
import { useToast } from '../../../core/ui/toast'
import { NETZ_LINK_TYPES, netzLinks, nkind, useNetzwerk } from '../db'
import { NetzBadge } from '../components/NetzGlyph'
import type { NetzLinkType } from '../types'

export function UmfeldLinkScreen() {
  const { id } = useParams()
  const itemId = Number(id)
  const net = useNetzwerk()
  const navigate = useNavigate()
  const toast = useToast()
  const [type, setType] = useState<NetzLinkType>('gehoert')

  const item = net?.items.find((n) => n.id === itemId)
  const others = (net?.items ?? []).filter((n) => n.id !== itemId)
  const back = `/projekt/umfeld/${itemId}`

  const connect = async (targetId: number) => {
    const exists = (net?.links ?? []).some((l) => l.a === itemId && l.b === targetId && l.type === type)
    if (exists) {
      toast('Gibt es schon')
      return
    }
    await netzLinks().add({ a: itemId, b: targetId, type })
    toast('Verknüpft')
    navigate(back)
  }

  return (
    <Screen zone="mmm">
      <ScreenHeader eyebrow={item?.name ?? 'Umfeld'} title="Verknüpfen" back={back} />
      <Scroll tight>
        <Field label="Art der Verbindung">
          <div>
            {NETZ_LINK_TYPES.map(([key, label]) => (
              <Chip key={key} on={type === key} onClick={() => setType(key as NetzLinkType)}>
                {label}
              </Chip>
            ))}
          </div>
        </Field>

        <Eyebrow>Womit?</Eyebrow>
        <Card rows>
          {others.length ? (
            others.map((o) => (
              <Row
                key={o.id}
                icon={<NetzBadge kind={o.kind} />}
                bareIcon
                title={o.name}
                sub={nkind(o.kind).label}
                right={<span className="chev">+</span>}
                onClick={() => void connect(o.id!)}
              />
            ))
          ) : (
            <Empty compact>Keine anderen Elemente.</Empty>
          )}
        </Card>
      </Scroll>
    </Screen>
  )
}
