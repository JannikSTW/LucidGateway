import { useCallback, useEffect, useRef, useState } from 'react'
import { fmtClock } from '../util/date'

export interface TimerState {
  seconds: number
  running: boolean
  target: number
  toggle: () => void
  reset: () => void
  setTarget: (m: number) => void
  stop: () => void
  minutes: number | null
}

/** Große Uhr, Zielvorgaben zum Antippen, wird grün bei Zielerreichung. */
export function useTimer(): TimerState {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [target, setTargetState] = useState(0)
  const iv = useRef<number>()

  useEffect(() => {
    if (running) {
      iv.current = window.setInterval(() => setSeconds((s) => s + 1), 1000)
      return () => window.clearInterval(iv.current)
    }
    return undefined
  }, [running])

  useEffect(() => () => window.clearInterval(iv.current), [])

  const toggle = useCallback(() => setRunning((r) => !r), [])
  const reset = useCallback(() => {
    setRunning(false)
    setSeconds(0)
  }, [])
  const stop = useCallback(() => setRunning(false), [])
  const setTarget = useCallback((m: number) => setTargetState((t) => (t === m ? 0 : m)), [])

  // Die gelaufene Zeit wandert automatisch in den Eintrag.
  const minutes = seconds > 0 ? Math.max(1, Math.round(seconds / 60)) : target || null

  return { seconds, running, target, toggle, reset, setTarget, stop, minutes }
}

export function Timer({ timer, presets }: { timer: TimerState; presets: number[] }) {
  const left = timer.target ? timer.target * 60 - timer.seconds : 0
  const done = timer.target > 0 && left <= 0
  return (
    <div className={`timer${done ? ' done' : ''}`}>
      <div className="clock">{fmtClock(timer.seconds)}</div>
      <div className="goal">
        {timer.target
          ? left > 0
            ? `noch ${fmtClock(left)} von ${timer.target} Min`
            : `Ziel erreicht — ${timer.target} Min`
          : timer.running
            ? 'läuft — frei'
            : 'frei, ohne Ziel'}
      </div>
      <div className="presets">
        {presets.map((p) => (
          <button key={p} type="button" className={timer.target === p ? 'on' : ''} onClick={() => timer.setTarget(p)}>
            {p} Min
          </button>
        ))}
      </div>
      <div className="ctrls">
        <button type="button" className="go" onClick={timer.toggle}>
          {timer.running ? 'Pause' : timer.seconds ? 'Weiter' : 'Start'}
        </button>
        <button type="button" className="sec" onClick={timer.reset}>
          Zurücksetzen
        </button>
      </div>
    </div>
  )
}
