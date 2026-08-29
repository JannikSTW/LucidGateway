import { useNavigate } from 'react-router-dom'
import { Button, Card, Empty, Text } from '../../../core/ui/basics'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, Chevron } from '../../../core/ui/rows'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { IfsMap } from '../components/IfsMap'
import { addPart, distLabel, partCount, partDist, partLinkType, roleColor, useInnerWorld } from '../db'
import { plural } from '../../../core/util/text'
import type { Part } from '../types'

export function InnerMapScreen() {
  const world = useInnerWorld()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  const open = (name: string) => navigate(`/innenwelt/anteil/${encodeURIComponent(name)}`)

  const create = async () => {
    const name = await dialog.text({
      title: 'Neuer Anteil',
      text: 'Wer meldet sich immer wieder? Ein Name reicht fürs Erste.',
      placeholder: 'z. B. Der Kritiker',
    })
    if (!name) return
    if (await addPart(name)) open(name)
    else toast('Gibt es schon')
  }

  const conflicts = (world?.links ?? []).filter((l) => l.type === 'konflikt').length
  const profiled = (world?.parts ?? []).filter((p) => p.profile)
  const open2 = (world?.parts ?? []).filter((p) => !p.profile)

  const group = (title: string, list: Part[], hint?: string) =>
    list.length > 0 && (
      <>
        <Eyebrow style={{ marginTop: 'var(--sp-9)' }}>{title}</Eyebrow>
        {hint && (
          <Text small style={{ marginBottom: 'var(--sp-4)' }}>
            {hint}
          </Text>
        )}
        <Card rows>
          {list.map((p) => {
            const color = roleColor(p.profile?.role, world?.parts ?? [])
            return (
              <Row
                key={p.id}
                icon="◍"
                tint={`color-mix(in srgb, ${color} 13%, transparent)`}
                fg={color}
                title={p.name}
                sub={`${p.profile?.role ? `${p.profile.role} · ` : ''}${distLabel(partDist(p)).split(' —')[0]} · ${partCount(world?.entries ?? [], p.name)}× aufgetaucht`}
                right={<Chevron />}
                onClick={() => open(p.name)}
              />
            )
          })}
        </Card>
      </>
    )

  return (
    <Screen zone="ai">
      <ScreenHeader eyebrow="Innenwelt" title="Landkarte" back="/kategorie/ai" />
      <Scroll tight>
        <Text style={{ marginBottom: 'var(--sp-7)' }}>
          Wer in dir da ist und wie nah du herankommst. Die Anteile stehen getrennt vom Traumregister — es ist
          eine eigene Datenbasis.
        </Text>

        <Card className="mapcard">{world && <IfsMap world={world} onOpen={open} />}</Card>

        {world && world.links.length > 0 && (
          <>
            <Eyebrow style={{ marginTop: 'var(--sp-8)' }}>Beziehungen</Eyebrow>
            <Card rows>
              {world.links.map((l) => {
                const t = partLinkType(l.type)
                return (
                  <Row
                    key={l.id}
                    icon={t.directed ? '→' : '↔'}
                    tint={`color-mix(in srgb, ${t.color} 13%, transparent)`}
                    fg={t.color}
                    title={`${l.a} ${t.directed ? '→' : '↔'} ${l.b}`}
                    sub={t.label}
                    subStyle={{ color: t.color }}
                    onClick={() => open(l.a)}
                  />
                )
              })}
              {conflicts > 0 && (
                <Text small style={{ padding: 'var(--sp-3) 0 var(--sp-1)' }}>
                  {plural(conflicts, 'Konflikt', 'Konflikte')} — meist der Grund für innere Zerrissenheit.
                </Text>
              )}
            </Card>
          </>
        )}

        {group('Profilierte Anteile', profiled)}
        {group('Noch offen', open2, 'Öffne einen Anteil, um ihn zu profilieren.')}
        {world && world.parts.length === 0 && <Empty>Noch kein Anteil erfasst.</Empty>}

        <Button ghost onClick={() => void create()} style={{ marginTop: 'var(--sp-7)' }}>
          + Anteil anlegen
        </Button>
      </Scroll>
    </Screen>
  )
}
