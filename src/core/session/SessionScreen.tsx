import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Empty, Notice } from '../ui/basics'
import { Screen, ScreenHeader, Scroll } from '../ui/layout'
import { Timer, useTimer } from '../ui/Timer'
import { SchemaForm } from '../ui/form/SchemaForm'
import { useToast } from '../ui/toast'
import { createEntry, emptyEntry } from '../db/entries'
import { sessionMethod } from './registry'
import type { FieldValues } from '../ui/form/schema'

/** Ein Bildschirm für alle Sitzungsarten. */
export function SessionScreen() {
  const { method = '' } = useParams()
  const def = sessionMethod(method)
  const navigate = useNavigate()
  const toast = useToast()
  const timer = useTimer()
  const [vals, setVals] = useState<FieldValues>({})

  if (!def) {
    return (
      <Screen>
        <ScreenHeader title="Unbekannte Sitzung" back="/" />
        <Scroll>
          <Empty>Diese Sitzungsart gibt es nicht.</Empty>
        </Scroll>
      </Screen>
    )
  }

  const save = async () => {
    timer.stop()
    const minutes = timer.minutes
    const id = await createEntry({
      ...emptyEntry(def.cat),
      ...def.toEntry(vals),
      med: { method: def.key, dur: minutes, vals },
    })
    toast(timer.seconds ? `Sitzung gesichert — ${minutes} Min` : 'Sitzung gesichert')
    navigate(`/eintrag/${id}`, { replace: true })
  }

  return (
    <Screen zone={def.zone}>
      <ScreenHeader
        eyebrow={def.name}
        title="Sitzung"
        icon={def.icon}
        tint={def.tint}
        fg={def.color}
        back={() => {
          timer.stop()
          navigate(def.back)
        }}
      />
      <Scroll tight>
        <Timer timer={timer} presets={def.presets} />
        {def.safety && <Notice>{def.safety}</Notice>}
        <SchemaForm fields={def.fields} values={vals} onChange={(k, v) => setVals((s) => ({ ...s, [k]: v }))} />
        <Button onClick={() => void save()}>Sitzung sichern</Button>
      </Scroll>
    </Screen>
  )
}
