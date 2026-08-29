import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Empty } from '../../../core/ui/basics'
import { Chip, Field } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row } from '../../../core/ui/rows'
import { useToast } from '../../../core/ui/toast'
import { GlyphBadge } from '../components/glyphs'
import { LINK_TYPES } from '../components/DreamMap'
import { REGISTERS, countOf, dreamLinks, useDreamWorld } from '../db'
import type { DreamLinkType, RegisterKey } from '../types'

/** Fünf Arten, jede mit eigener Farbe — auf der Karte durchgezogen gezeichnet. */
export function LinkScreen() {
  const { reg = 'zeichen', name = '' } = useParams<{ reg: RegisterKey; name: string }>()
  const key = reg as RegisterKey
  const world = useDreamWorld()
  const navigate = useNavigate()
  const toast = useToast()
  const [type, setType] = useState<DreamLinkType>('begleitet')

  const back = `/traumwelt/register/${key}/${encodeURIComponent(name)}`
  const others = (world?.items ?? []).filter((i) => i.name !== name)

  const connect = async (targetReg: RegisterKey, targetName: string) => {
    const exists = (world?.links ?? []).some(
      (l) => l.a.name === name && l.b.name === targetName && l.type === type,
    )
    if (exists) {
      toast('Gibt es schon')
      return
    }
    await dreamLinks().add({ a: { reg: key, name }, b: { reg: targetReg, name: targetName }, type })
    toast('Verknüpft')
    navigate(back)
  }

  return (
    <Screen zone="ld">
      <ScreenHeader eyebrow={name} title="Verknüpfen" back={back} />
      <Scroll tight>
        <Field label="Art der Verbindung">
          <div>
            {LINK_TYPES.map((t) => (
              <Chip key={t.key} on={type === t.key} tone={t.color} onClick={() => setType(t.key as DreamLinkType)}>
                {t.label}
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
                icon={<GlyphBadge kind={o.register} color={REGISTERS[o.register].color} />}
                bareIcon
                title={o.name}
                sub={`${REGISTERS[o.register].label} · ${countOf(world?.entries ?? [], o.register, o.name)}×`}
                right={<span className="chev">+</span>}
                onClick={() => void connect(o.register, o.name)}
              />
            ))
          ) : (
            <Empty compact>Noch keine anderen Elemente vorhanden.</Empty>
          )}
        </Card>
      </Scroll>
    </Screen>
  )
}
