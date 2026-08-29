import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty } from '../../../core/ui/basics'
import { Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, Chevron } from '../../../core/ui/rows'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { GlyphBadge } from '../components/glyphs'
import { REGISTERS, addRegItem, countOf, useDreamWorld } from '../db'
import type { RegisterKey } from '../types'

export function RegisterScreen() {
  const { reg = 'zeichen' } = useParams<{ reg: RegisterKey }>()
  const key = reg as RegisterKey
  const world = useDreamWorld()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()
  const meta = REGISTERS[key]

  const add = async () => {
    const name = await dialog.text({ title: `Neu in ${meta.label}`, placeholder: 'Name' })
    if (!name) return
    if (!(await addRegItem(key, name))) toast('Gibt es schon')
  }

  const items = (world?.items ?? [])
    .filter((i) => i.register === key)
    .map((i) => ({ ...i, count: countOf(world?.entries ?? [], key, i.name) }))
    .sort((a, b) => b.count - a.count)

  return (
    <Screen zone="ld">
      <ScreenHeader
        eyebrow="Auswertung"
        title={meta.label}
        icon={<GlyphBadge kind={key} color={meta.color} size={24} />}
        tint="var(--cat-ld-tint)"
        back="/traumwelt"
      />
      <Scroll tight>
        {items.length ? (
          <Card rows>
            {items.map((item) => (
              <Row
                key={item.id}
                icon={<GlyphBadge kind={key} color={meta.color} />}
                bareIcon
                title={`${item.name}${world?.anchor?.name === item.name ? ' ⌂' : ''}`}
                sub={item.note ? item.note.split('\n')[0].slice(0, 42) : undefined}
                right={
                  <>
                    <span className="sub" style={{ fontSize: '12.5px' }}>
                      {item.count}×
                    </span>
                    <Chevron />
                  </>
                }
                onClick={() => navigate(`/traumwelt/register/${key}/${encodeURIComponent(item.name)}`)}
              />
            ))}
          </Card>
        ) : (
          <Empty>
            Noch nichts erfasst.
            <br />
            Taucht automatisch auf, sobald du es beim Traumeintrag antippst.
          </Empty>
        )}
        <Button ghost onClick={() => void add()}>
          + Manuell ergänzen
        </Button>
      </Scroll>
    </Screen>
  )
}
