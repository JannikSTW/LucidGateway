import { useMemo, useState } from 'react'
import { Button, Card, Empty, Text } from '../../../core/ui/basics'
import { Chip, SettingRowUI, Toggle } from '../../../core/ui/inputs'
import { Eyebrow, Screen, ScreenHeader, Scroll } from '../../../core/ui/layout'
import { Row, DeleteRowButton } from '../../../core/ui/rows'
import { IconEye } from '../../../core/ui/icons'
import { useDialog } from '../../../core/ui/dialog'
import { useToast } from '../../../core/ui/toast'
import { plural } from '../../../core/util/text'
import { countOf, rcChecks, useDreamWorld } from '../db'
import {
  RC_FREQ,
  RC_WINDOWS,
  cancelScheduled,
  clearPlan,
  pickQuestion,
  requestPermission,
  supportsTriggers,
  useRcChecks,
  useRcConfig,
} from '../rc'

export function RealityCheckScreen() {
  const [config, setConfig] = useRcConfig()
  const checks = useRcChecks() ?? []
  const world = useDreamWorld()
  const dialog = useDialog()
  const toast = useToast()
  const [permission, setPermission] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  )

  const active = checks.filter((c) => c.on)
  // Die Vorschau würfelt einmal pro Aufbau — nicht bei jedem Tastendruck.
  const sample = useMemo(() => pickQuestion(active) ?? 'Noch keine aktive Frage', [checks.length, active.length])

  const topSign = (world?.items ?? [])
    .filter((i) => i.register === 'zeichen')
    .map((i) => ({ name: i.name, n: countOf(world?.entries ?? [], 'zeichen', i.name) }))
    .sort((a, b) => b.n - a.n)[0]

  const toggle = async (on: boolean) => {
    if (on) {
      const result = await requestPermission()
      setPermission(result)
      if (result !== 'granted') {
        toast('Ohne Erlaubnis keine Mitteilungen')
        return
      }
      await clearPlan()
    } else {
      await cancelScheduled()
      await clearPlan()
    }
    await setConfig({ ...config, on })
    toast(on ? 'Reality Checks aktiviert' : 'Pausiert')
  }

  const addCheck = async () => {
    const text = await dialog.text({
      title: 'Eigene Frage',
      text: 'Formuliere sie als echte Frage — mechanische Gesten wirken nicht.',
      placeholder: 'z. B. Zähl deine Finger',
    })
    if (!text) return
    await rcChecks().add({ text, on: true })
    toast('Frage hinzugefügt')
  }

  const editCheck = async (id: number, current: string) => {
    const text = await dialog.text({ title: 'Frage bearbeiten', value: current })
    if (!text) return
    await rcChecks().update(id, { text })
  }

  const delCheck = async (id: number, text: string) => {
    const ok = await dialog.confirm({ title: 'Frage löschen?', text })
    if (!ok) return
    await rcChecks().delete(id)
    toast('Gelöscht')
  }

  return (
    <Screen zone="ld">
      <ScreenHeader eyebrow="Awareness-Training" title="Reality Checks" back="/einstellungen" />
      <Scroll tight>
        <Card>
          <Eyebrow>So sieht eine Mitteilung aus</Eyebrow>
          <div
            style={{
              display: 'flex',
              gap: 'var(--sp-5)',
              alignItems: 'flex-start',
              marginTop: 'var(--sp-3)',
              padding: '13px 14px',
              borderRadius: 13,
              background: 'var(--panel2)',
              border: '1px solid var(--line)',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                flexShrink: 0,
                color: 'var(--cat-ld-fg)',
                background: 'var(--cat-ld-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconEye />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: 13, display: 'block', marginBottom: 2 }}>Lucid Gateway</b>
              <span className="sub strong" style={{ fontSize: '12.5px' }}>
                {sample}
              </span>
            </div>
          </div>
          <Text small style={{ marginTop: 'var(--sp-4)' }}>
            Antippen bestätigt den Check — „war kurz unsicher“ zählt als Treffer.
          </Text>
        </Card>

        <Card>
          <SettingRowUI
            title="Benachrichtigungen"
            sub={
              config.on
                ? `${config.random ? `${config.freq}× täglich` : 'nur an Traumzeichen'} · ${config.window} · ${plural(
                    active.length,
                    'Frage',
                    'Fragen',
                  )}`
                : 'Noch nicht aktiviert'
            }
            right={<Toggle checked={config.on} onChange={(v) => void toggle(v)} />}
          />
          <Text small style={{ marginTop: 'var(--sp-1)' }}>
            {permission === 'denied'
              ? 'Der Browser blockiert Mitteilungen. Das lässt sich nur in den Geräteeinstellungen ändern.'
              : supportsTriggers()
                ? 'Dieses Gerät kann Erinnerungen im Voraus einplanen — sie kommen auch bei geschlossener App.'
                : 'Die App hat keinen Server. Erinnerungen erscheinen deshalb, solange sie im Hintergrund läuft — am zuverlässigsten, wenn sie auf dem Startbildschirm liegt.'}
          </Text>
        </Card>

        <Eyebrow>Deine Fragen</Eyebrow>
        <Text small style={{ marginBottom: 'var(--sp-5)' }}>
          Die Frage zählt, nicht die Geste. Eine zufällige der aktiven Fragen erscheint als Mitteilung.
        </Text>
        <Card rows>
          {checks.length ? (
            checks.map((c) => (
              <Row
                key={c.id}
                icon={c.on ? '✓' : '○'}
                tint={c.on ? 'var(--cat-ld-tint)' : 'var(--panel2)'}
                fg={c.on ? 'var(--cat-ld-fg)' : 'var(--mist)'}
                title={c.text}
                wrapTitle
                sub={c.on ? 'aktiv' : 'pausiert'}
                onClick={() => void rcChecks().update(c.id!, { on: !c.on })}
                right={
                  <>
                    <DeleteRowButton glyph="✎" label="Bearbeiten" onClick={() => void editCheck(c.id!, c.text)} />
                    <DeleteRowButton onClick={() => void delCheck(c.id!, c.text)} />
                  </>
                }
              />
            ))
          ) : (
            <Empty compact>Noch keine Frage angelegt.</Empty>
          )}
        </Card>
        <Button ghost onClick={() => void addCheck()} style={{ marginBottom: 'var(--sp-9)' }}>
          + Eigene Frage
        </Button>

        <Eyebrow>Häufigkeit</Eyebrow>
        <Card>
          <div className="seg" style={{ ['--cols' as string]: 5 }}>
            {RC_FREQ.map((n) => (
              <button
                key={n}
                type="button"
                className={n === config.freq ? 'on' : ''}
                onClick={() => void clearPlan().then(() => setConfig({ ...config, freq: n }))}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="seg-hint">{config.freq}× täglich, zufällig verteilt im gewählten Zeitfenster.</div>
        </Card>

        <Eyebrow>Zeitfenster</Eyebrow>
        <Card>
          <div>
            {Object.keys(RC_WINDOWS).map((w) => (
              <Chip
                key={w}
                on={config.window === w}
                onClick={() => void clearPlan().then(() => setConfig({ ...config, window: w }))}
              >
                {w}
              </Chip>
            ))}
          </div>
          <Text small style={{ marginTop: 'var(--sp-3)' }}>
            Nachts keine Mitteilungen — Schlaf hat Vorrang.
          </Text>
        </Card>

        <Eyebrow>Auslöser</Eyebrow>
        <Card>
          <SettingRowUI
            title="Zufällig im Zeitfenster"
            sub="Unvorhersehbarkeit ist der Punkt"
            right={
              <Toggle
                checked={config.random}
                onChange={(v) => void clearPlan().then(() => setConfig({ ...config, random: v }))}
              />
            }
          />
          <SettingRowUI
            title="An Traumzeichen gekoppelt"
            sub={
              topSign && topSign.n
                ? `Ein Extra-Check am Tag nennt „${topSign.name}“ beim Namen`
                : 'Ein Extra-Check am Tag, sobald du Traumzeichen gesammelt hast'
            }
            right={
              <Toggle
                checked={config.signs}
                onChange={(v) => void clearPlan().then(() => setConfig({ ...config, signs: v }))}
              />
            }
          />
        </Card>
      </Scroll>
    </Screen>
  )
}
