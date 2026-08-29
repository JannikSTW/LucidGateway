import { useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Text } from '../ui/basics'
import { ModeSwitch } from '../ui/inputs'
import { Eyebrow, PageTitle, Screen, Scroll } from '../ui/layout'
import { Row, Chevron } from '../ui/rows'
import { useDialog } from '../ui/dialog'
import { useToast } from '../ui/toast'
import { downloadBackup, importBackup } from '../db/backup'
import { allTools } from '../modules/registry'
import { useTheme, type ThemeName } from '../app/ThemeProvider'

/** Werkzeugzeile eines Moduls — der Hinweistext darf aus der Datenbank kommen. */
function ToolRow({ id }: { id: string }) {
  const tool = allTools().find((t) => t.id === id)
  const navigate = useNavigate()
  const hint = useLiveQuery(async () => (tool?.hint ? await tool.hint() : ''), [id], '')
  if (!tool) return null
  return (
    <Row
      icon={tool.icon}
      tint={tool.tint}
      fg={tool.fg}
      title={tool.label}
      sub={hint}
      right={<Chevron />}
      onClick={() => navigate(tool.to)}
    />
  )
}

export function SettingsScreen() {
  const [theme, setTheme] = useTheme()
  const toast = useToast()
  const dialog = useDialog()
  const fileInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const doExport = async () => {
    setBusy(true)
    try {
      const name = await downloadBackup()
      toast(`Gesichert als ${name}`)
    } catch {
      toast('Export fehlgeschlagen')
    } finally {
      setBusy(false)
    }
  }

  const doImport = async (file: File | undefined) => {
    if (!file) return
    const ok = await dialog.confirm({
      title: 'Sicherung einlesen?',
      text: 'Der aktuelle Inhalt dieses Geräts wird dabei vollständig ersetzt.',
      okLabel: 'Einlesen',
    })
    if (!ok) return
    setBusy(true)
    try {
      const report = await importBackup(file)
      toast(`${report.rows} Einträge aus ${report.tables} Tabellen eingelesen`)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Import fehlgeschlagen')
    } finally {
      setBusy(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  return (
    <Screen zone="ld">
      <Scroll>
        <PageTitle eyebrow="App" title="Einstellungen" />

        <Card>
          <Eyebrow>Darstellung</Eyebrow>
          <ModeSwitch
            options={[
              { key: 'dark', label: 'Dunkel' },
              { key: 'light', label: 'Hell' },
            ]}
            value={theme}
            onChange={(t) => void setTheme(t as ThemeName)}
            style={{ marginBottom: 0 }}
          />
          <Text small style={{ marginTop: 'var(--sp-4)' }}>
            Dream Adventures bleibt in beiden Modi eine Kreidetafel.
          </Text>
        </Card>

        {allTools().length > 0 && (
          <Card rows>
            {allTools().map((t) => (
              <ToolRow key={t.id} id={t.id} />
            ))}
          </Card>
        )}

        <Card>
          <Eyebrow>Daten</Eyebrow>
          <Text style={{ marginBottom: 'var(--sp-5)' }}>
            Alles liegt lokal auf diesem Gerät. Kein Konto, keine Cloud — die Sicherung ist deshalb dein
            einziges Netz.
          </Text>
          <Button ghost onClick={() => void doExport()} disabled={busy}>
            Als JSON exportieren
          </Button>
          <Button ghost onClick={() => fileInput.current?.click()} disabled={busy} style={{ marginTop: 'var(--sp-4)' }}>
            Sicherung einlesen
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => void doImport(e.target.files?.[0])}
          />
          <Text small style={{ marginTop: 'var(--sp-4)' }}>
            Die Datei enthält alle Einträge samt Bildern.
          </Text>
        </Card>

        <Card>
          <Eyebrow>Auf dem Startbildschirm</Eyebrow>
          <Text>
            In Safari oder Chrome „Zum Startbildschirm hinzufügen“ wählen. Erst dann läuft die App offline im
            Vollbild — und erst dann sind Erinnerungen für Reality Checks möglich.
          </Text>
        </Card>

        <Card>
          <Eyebrow>Über</Eyebrow>
          <b style={{ fontSize: 15 }}>Lucid Gateway</b>
          <Text style={{ marginTop: 'var(--sp-1)' }}>
            Persönliches Forschungs- und Projektjournal. Der Name stammt aus Project MindSpark, 2024.
          </Text>
        </Card>
      </Scroll>
    </Screen>
  )
}
