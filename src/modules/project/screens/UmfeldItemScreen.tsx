import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Empty, Text, Toolbar } from '../../../core/ui/basics'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, DeleteRowButton } from '../../../core/ui/rows'
import { SettingRowUI } from '../../../core/ui/inputs'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { fmtDate } from '../../../core/util/date'
import { netzLinkLabel, netzLinks, ngroup, nkind, removeNetzItem, useNetzwerk } from '../db'
import { NetzBadge } from '../components/NetzGlyph'

export function UmfeldItemScreen() {
  const { id } = useParams()
  const itemId = Number(id)
  const net = useNetzwerk()
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  const item = net?.items.find((n) => n.id === itemId)
  if (!net) return <Screen zone="mmm" />
  if (!item) {
    return (
      <Screen zone="mmm">
        <ScreenHeader title="Nicht gefunden" back="/projekt/umfeld" />
        <Scroll>
          <Empty>Dieses Element gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const k = nkind(item.kind)
  const meta = k.fields.filter(([key]) => item.d?.[key])
  const links = net.links.filter((l) => l.a === itemId || l.b === itemId)
  const dates = net.termine.filter((t) => t.nid === itemId && !t.done)

  const remove = async () => {
    const ok = await dialog.confirm({ title: 'Element löschen?', text: item.name })
    if (!ok) return
    await removeNetzItem(itemId)
    toast('Gelöscht')
    navigate('/projekt/umfeld')
  }

  const dropLink = async (linkId: number) => {
    const ok = await dialog.confirm({ title: 'Verknüpfung lösen?', okLabel: 'Lösen' })
    if (!ok) return
    await netzLinks().delete(linkId)
    toast('Gelöst')
  }

  return (
    <Screen zone="mmm">
      <ScreenHeader
        eyebrow={`${k.label} · ${ngroup(item.kind).label}`}
        title={item.name}
        icon={<NetzBadge kind={item.kind} size={26} />}
        tint={`color-mix(in srgb, ${k.color} 13%, transparent)`}
        fg={k.color}
        back="/projekt/umfeld"
      />
      <Scroll tight>
        {meta.length > 0 && (
          <Card>
            {meta.map(([key, label]) => (
              <SettingRowUI key={key} title={label} sub={item.d[key]} />
            ))}
          </Card>
        )}

        {item.next && (
          <Card style={{ borderColor: 'color-mix(in srgb, var(--red) 40%, transparent)' }}>
            <Eyebrow>Nächster Schritt</Eyebrow>
            <Text strong>{item.next}</Text>
          </Card>
        )}

        {dates.length > 0 && (
          <Card>
            <Eyebrow>Termine</Eyebrow>
            {dates.map((t) => (
              <Text key={t.id} strong>
                {fmtDate(t.date)}
                {t.time ? ` · ${t.time} Uhr` : ''} — {t.title}
              </Text>
            ))}
          </Card>
        )}

        {item.note && (
          <Card>
            <Eyebrow>Notizen</Eyebrow>
            <Text strong pre>
              {item.note}
            </Text>
          </Card>
        )}

        <Eyebrow>Verknüpfungen</Eyebrow>
        <Card rows>
          {links.length ? (
            links.map((l) => {
              const other = net.items.find((x) => x.id === (l.a === itemId ? l.b : l.a))
              if (!other) return null
              return (
                <Row
                  key={l.id}
                  icon={<NetzBadge kind={other.kind} />}
                  bareIcon
                  title={other.name}
                  sub={l.a === itemId ? `${netzLinkLabel(l.type)} →` : `← ${netzLinkLabel(l.type)}`}
                  onClick={() => navigate(`/projekt/umfeld/${other.id}`)}
                  right={<DeleteRowButton onClick={() => void dropLink(l.id!)} />}
                />
              )
            })
          ) : (
            <Empty compact>Noch nichts verknüpft.</Empty>
          )}
        </Card>
        <Button ghost onClick={() => navigate(`/projekt/umfeld/${itemId}/verknuepfen`)} style={{ marginBottom: 'var(--sp-8)' }}>
          + Verknüpfung
        </Button>

        <Toolbar>
          <button type="button" onClick={() => navigate(`/projekt/umfeld/${itemId}/bearbeiten`)}>
            Bearbeiten
          </button>
          <button type="button" className="del" onClick={() => void remove()}>
            Löschen
          </button>
        </Toolbar>
      </Scroll>
    </Screen>
  )
}
