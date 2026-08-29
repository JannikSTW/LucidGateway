import { useEffect, useRef } from 'react'
import {
  activeChecks,
  cancelScheduled,
  ensurePlan,
  markFired,
  pickQuestion,
  scheduleAhead,
  showCheck,
  signQuestion,
  supportsTriggers,
  topDreamSign,
  useRcConfig,
} from '../rc'

const TICK = 30_000

/**
 * Hält die Erinnerungen am Laufen, solange die App geladen ist. Wo der Browser
 * Notification Triggers kann, werden sie zusätzlich im Voraus eingeplant.
 */
export function RcRunner() {
  const [config] = useRcConfig()
  // Der Wecker soll nur bei echten Änderungen neu starten, nicht bei jedem
  // Schreibvorgang in den Einstellungen.
  const key = `${config.on}|${config.freq}|${config.window}|${config.random}|${config.signs}`
  const latest = useRef(config)
  latest.current = config

  useEffect(() => {
    const config = latest.current
    if (!config.on) {
      void cancelScheduled()
      return undefined
    }

    let stopped = false

    const tick = async () => {
      if (stopped) return
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
      const checks = await activeChecks()
      const plan = await ensurePlan(config)
      const all = [...plan.times, ...(plan.signTime !== null ? [plan.signTime] : [])]
      if (!all.length) return
      if (!checks.length && plan.signTime === null) return

      const sign = plan.signTime !== null ? await topDreamSign() : null
      const questionFor = (time: number) =>
        time === plan.signTime ? signQuestion(sign) : pickQuestion(checks)

      if (supportsTriggers()) {
        const open = all.filter((t) => !plan.fired.includes(t))
        await scheduleAhead(open, open.map((t) => questionFor(t) ?? ''))
        return
      }

      const now = Date.now()
      const due = all.filter((t) => t <= now && !plan.fired.includes(t))
      // Nur die jüngste fällige Erinnerung zeigen — kein Nachholstapel.
      const latest = due.sort((a, b) => b - a)[0]
      if (latest === undefined) return
      for (const t of due) await markFired(t)
      if (now - latest > 45 * 60_000) return
      const question = questionFor(latest)
      if (question) await showCheck(question)
    }

    void tick()
    const id = window.setInterval(() => void tick(), TICK)
    const onVisible = () => {
      if (document.visibilityState === 'visible') void tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return null
}
