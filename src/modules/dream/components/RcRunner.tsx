import { useEffect } from 'react'
import {
  activeChecks,
  cancelScheduled,
  ensurePlan,
  markFired,
  pickQuestion,
  scheduleAhead,
  showCheck,
  supportsTriggers,
  useRcConfig,
} from '../rc'

const TICK = 30_000

/**
 * Hält die Erinnerungen am Laufen, solange die App geladen ist. Wo der Browser
 * Notification Triggers kann, werden sie zusätzlich im Voraus eingeplant.
 */
export function RcRunner() {
  const [config] = useRcConfig()

  useEffect(() => {
    if (!config.on) {
      void cancelScheduled()
      return undefined
    }

    let stopped = false

    const tick = async () => {
      if (stopped) return
      if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
      const checks = await activeChecks()
      if (!checks.length) return
      const plan = await ensurePlan(config)

      if (supportsTriggers()) {
        await scheduleAhead(
          plan.times.filter((t) => !plan.fired.includes(t)),
          checks.map((c) => c.text),
        )
        return
      }

      const now = Date.now()
      const due = plan.times.filter((t) => t <= now && !plan.fired.includes(t))
      // Nur die jüngste fällige Erinnerung zeigen — kein Nachholstapel.
      const latest = due.sort((a, b) => b - a)[0]
      if (latest === undefined) return
      for (const t of due) await markFired(t)
      if (now - latest > 45 * 60_000) return
      const question = pickQuestion(checks)
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
  }, [config])

  return null
}
