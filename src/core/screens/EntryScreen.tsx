import { useNavigate, useParams } from 'react-router-dom'
import { Card, Empty, Text, Toolbar } from '../ui/basics'
import { Chip } from '../ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../ui/layout'
import { ScanStrip } from '../ui/Scans'
import { useDialog } from '../ui/dialog'
import { useToast } from '../ui/toast'
import { deleteEntry, useEntry } from '../db/entries'
import { category, entryViews } from '../modules/registry'
import { ProfileCard } from '../profile'

export function EntryScreen() {
  const { id } = useParams()
  const entry = useEntry(id ? Number(id) : undefined)
  const navigate = useNavigate()
  const dialog = useDialog()
  const toast = useToast()

  if (entry === undefined) return <Screen />
  if (entry === null) {
    return (
      <Screen>
        <ScreenHeader title="Nicht gefunden" back="/archiv" />
        <Scroll>
          <Empty>Diesen Eintrag gibt es nicht mehr.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const cat = category(entry.cat)
  if (!cat) return <Screen />

  const remove = async () => {
    const ok = await dialog.confirm({ title: 'Eintrag löschen?', text: entry.title || 'Ohne Titel' })
    if (!ok) return
    await deleteEntry(entry.id!)
    toast('Gelöscht')
    navigate(-1)
  }

  return (
    <Screen zone={cat.zone}>
      <ScreenHeader
        eyebrow={`${cat.name} · ${entry.date}`}
        title={entry.title || 'Ohne Titel'}
        icon={cat.icon}
        tint={cat.tint}
        fg={cat.fg}
      />
      <Scroll tight>
        {entryViews('before').map(({ id: vid, Component }) => (
          <Component key={vid} entry={entry} />
        ))}

        {entry.paper && (
          <Card>
            <Eyebrow>Aus dem Tagebuch</Eyebrow>
            {entry.scans.length ? (
              <ScanStrip ids={entry.scans} big={entry.scans.length === 1} />
            ) : (
              <Text small>Keine Seiten hinterlegt.</Text>
            )}
            {entry.keywords && (
              <Text strong style={{ marginTop: 'var(--sp-4)' }}>
                {entry.keywords}
              </Text>
            )}
          </Card>
        )}

        {entry.b1 && (
          <Card>
            <Eyebrow>{cat.journal?.b1.label ?? 'Notiz'}</Eyebrow>
            <Text strong pre>
              {entry.b1}
            </Text>
          </Card>
        )}
        {entry.b2 && (
          <Card>
            <Eyebrow>{cat.journal?.b2.label ?? 'Ergänzung'}</Eyebrow>
            <Text strong pre>
              {entry.b2}
            </Text>
          </Card>
        )}

        {entry.prof && <ProfileCard profile={entry.prof} color={cat.color} fill={cat.tint} />}

        {cat.journal && cat.journal.showScale !== false ? (
          <Card>
            <Eyebrow>{cat.journal.scale.label}</Eyebrow>
            <b style={{ fontSize: 15 }}>
              {entry.scale} — {cat.journal.scale.hints[entry.scale]}
            </b>
            {entry.tags.length > 0 && (
              <div style={{ marginTop: 'var(--sp-5)' }}>
                {entry.tags.map((t) => (
                  <Chip key={t} on>
                    {t}
                  </Chip>
                ))}
              </div>
            )}
          </Card>
        ) : (
          entry.tags.length > 0 && (
            <Card>
              <Eyebrow>Marker</Eyebrow>
              <div style={{ marginTop: 'var(--sp-2)' }}>
                {entry.tags.map((t) => (
                  <Chip key={t} on>
                    {t}
                  </Chip>
                ))}
              </div>
            </Card>
          )
        )}

        {entryViews('after').map(({ id: vid, Component }) => (
          <Component key={vid} entry={entry} />
        ))}

        {cat.journal ? (
          <Toolbar>
            <button type="button" onClick={() => navigate(`/journal/${entry.cat}/${entry.id}`)}>
              Bearbeiten
            </button>
            <button type="button" className="del" onClick={() => void remove()}>
              Löschen
            </button>
          </Toolbar>
        ) : (
          <Toolbar one>
            <button type="button" className="del" onClick={() => void remove()}>
              Löschen
            </button>
          </Toolbar>
        )}
      </Scroll>
    </Screen>
  )
}
