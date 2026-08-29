import { useLiveQuery } from 'dexie-react-hooks'
import { getSetting, setSetting, useSetting } from '../../core/db/settings'
import { todayIso } from '../../core/util/date'
import { listEntries } from '../../core/db/entries'
import { rcChecks, regItems } from './db'
import type { RcCheck } from './types'

/**
 * Reality Checks ohne Server.
 *
 * Echtes Web Push braucht einen Absender im Netz — die App hat bewusst keinen.
 * Die Erinnerungen entstehen deshalb auf dem Gerät: Für jeden Tag wird ein
 * Plan mit zufälligen Zeitpunkten im gewählten Fenster gewürfelt. Unterstützt
 * der Browser Notification Triggers, werden sie im Voraus eingeplant und
 * kommen auch bei geschlossener App. Sonst zeigt die App sie, solange sie
 * (auch im Hintergrund) läuft.
 */

export interface RcConfig {
  on: boolean
  freq: number
  window: string
  random: boolean
  signs: boolean
}

export const RC_FREQ = [1, 2, 3, 5, 8]
export const RC_WINDOWS: Record<string, [number, number]> = {
  '7–23 Uhr': [7, 23],
  '9–21 Uhr': [9, 21],
  '12–20 Uhr': [12, 20],
  'Nur abends': [18, 23],
}

export const RC_CONFIG_KEY = 'rc.config'
const RC_PLAN_KEY = 'rc.plan'

export const DEFAULT_RC: RcConfig = { on: false, freq: 3, window: '9–21 Uhr', random: true, signs: true }

export const DEFAULT_CHECKS: Omit<RcCheck, 'id'>[] = [
  { text: 'Zähl deine Finger — sind es wirklich fünf?', on: true },
  { text: 'Wie bin ich hierhergekommen? Rekonstruiere die letzten 10 Minuten.', on: true },
  { text: 'Lies diesen Satz zweimal. Steht da noch dasselbe?', on: true },
  { text: 'Halte die Nase zu und versuche zu atmen.', on: false },
  { text: 'Schau auf deine Hände. Sieht alles normal aus?', on: true },
]

export async function seedChecks(): Promise<void> {
  if ((await rcChecks().count()) > 0) return
  await rcChecks().bulkAdd(DEFAULT_CHECKS as RcCheck[])
}

export function useRcConfig(): [RcConfig, (c: RcConfig) => Promise<void>] {
  return useSetting<RcConfig>(RC_CONFIG_KEY, DEFAULT_RC)
}

export function useRcChecks(): RcCheck[] | undefined {
  return useLiveQuery(() => rcChecks().toArray(), [])
}

export interface RcPlan {
  iso: string
  /** Erkennt, ob der Plan noch zur Einstellung passt */
  key: string
  /** Zeitstempel der geplanten Erinnerungen */
  times: number[]
  /** Der eine Extra-Check, der ein Traumzeichen beim Namen nennt */
  signTime: number | null
  fired: number[]
}

const planKey = (c: RcConfig) => `${c.freq}|${c.window}|${c.random}|${c.signs}`

function atMinute(day: Date, minutes: number): number {
  const d = new Date(day)
  d.setHours(0, Math.round(minutes), 0, 0)
  return d.getTime()
}

/** Verteilt die Erinnerungen zufällig, aber mit Abstand, über das Zeitfenster. */
export function planTimes(config: RcConfig, day = new Date()): number[] {
  if (!config.random) return []
  const [from, to] = RC_WINDOWS[config.window] ?? RC_WINDOWS['9–21 Uhr']
  const slotMinutes = ((to - from) * 60) / config.freq
  const times: number[] = []
  for (let i = 0; i < config.freq; i++) {
    const start = from * 60 + i * slotMinutes
    // innerhalb des Slots zufällig, aber nicht direkt am Rand
    times.push(atMinute(day, start + slotMinutes * (0.15 + Math.random() * 0.7)))
  }
  return times
}

/** Ein zusätzlicher Zeitpunkt für den Traumzeichen-Check. */
export function planSignTime(config: RcConfig, day = new Date()): number | null {
  if (!config.signs) return null
  const [from, to] = RC_WINDOWS[config.window] ?? RC_WINDOWS['9–21 Uhr']
  return atMinute(day, (from + Math.random() * (to - from)) * 60)
}

export async function ensurePlan(config: RcConfig): Promise<RcPlan> {
  const iso = todayIso()
  const key = planKey(config)
  const plan = await getSetting<RcPlan | null>(RC_PLAN_KEY, null)
  if (plan && plan.iso === iso && plan.key === key) return plan
  const fresh: RcPlan = {
    iso,
    key,
    times: planTimes(config),
    signTime: planSignTime(config),
    fired: [],
  }
  await setSetting(RC_PLAN_KEY, fresh)
  return fresh
}

/** Das häufigste Traumzeichen — der Check nennt es beim Namen. */
export async function topDreamSign(): Promise<string | null> {
  const [items, entries] = await Promise.all([regItems().toArray(), listEntries()])
  const signs = items.filter((i) => i.register === 'zeichen')
  if (!signs.length) return null
  const counted = signs
    .map((s) => ({
      name: s.name,
      n: entries.filter((e) => (e.els?.zeichen ?? []).includes(s.name)).length,
    }))
    .sort((a, b) => b.n - a.n)
  return counted[0].n > 0 ? counted[0].name : null
}

export function signQuestion(sign: string | null): string {
  return sign
    ? `Taucht gerade „${sign}“ auf? Schau genau hin — träumst du?`
    : 'Kommt dir gerade etwas bekannt vor? Prüfe, ob du wach bist.'
}

export async function clearPlan(): Promise<void> {
  await setSetting<RcPlan | null>(RC_PLAN_KEY, null)
}

export async function markFired(time: number): Promise<void> {
  const plan = await getSetting<RcPlan | null>(RC_PLAN_KEY, null)
  if (!plan) return
  await setSetting(RC_PLAN_KEY, { ...plan, fired: [...plan.fired, time] })
}

export async function activeChecks(): Promise<RcCheck[]> {
  return (await rcChecks().toArray()).filter((c) => c.on)
}

export function pickQuestion(list: RcCheck[]): string | null {
  if (!list.length) return null
  return list[Math.floor(Math.random() * list.length)].text
}

/** Kann der Browser Mitteilungen im Voraus einplanen? */
export function supportsTriggers(): boolean {
  return typeof Notification !== 'undefined' && 'showTrigger' in Notification.prototype
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null
  try {
    return await navigator.serviceWorker.ready
  } catch {
    return null
  }
}

export async function showCheck(text: string): Promise<void> {
  const reg = await registration()
  if (reg?.active) {
    reg.active.postMessage({ type: 'RC_SHOW', title: 'Lucid Gateway', body: text })
    return
  }
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification('Lucid Gateway', { body: text })
  }
}

/** Plant alle künftigen Zeitpunkte im Voraus ein — nur wo der Browser das kann.
 *  `questions[i]` gehört zu `times[i]`. */
export async function scheduleAhead(times: number[], questions: string[]): Promise<boolean> {
  if (!supportsTriggers()) return false
  const reg = await registration()
  if (!reg) return false
  const existing = await reg.getNotifications({ includeTriggered: true } as never)
  for (const n of existing) if (n.tag?.startsWith('rc-')) n.close()
  const now = Date.now()
  for (const [i, t] of times.entries()) {
    if (t <= now) continue
    const body = questions[i] || 'Bist du sicher, dass du wach bist?'
    await reg.showNotification('Lucid Gateway', {
      body,
      tag: `rc-${t}`,
      icon: 'icons/icon-192.png',
      data: { url: './#/reality-checks' },
      // @ts-expect-error Notification Triggers sind noch nicht in den Typen
      showTrigger: new TimestampTrigger(t),
    })
  }
  return true
}

export async function cancelScheduled(): Promise<void> {
  const reg = await registration()
  if (!reg) return
  const existing = await reg.getNotifications({ includeTriggered: true } as never)
  for (const n of existing) if (n.tag?.startsWith('rc-')) n.close()
}
