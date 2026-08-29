export const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']
export const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

/** Lokales Datum als YYYY-MM-DD (nicht UTC — sonst kippt der Tag am Abend). */
export function isoOf(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10)
}

export function todayIso(): string {
  return isoOf(new Date())
}

/** Kurzes Anzeigedatum, z. B. „3. Sep“. */
export function dayLabel(d: Date): string {
  return `${d.getDate()}. ${MONTHS[d.getMonth()]}`
}

export function labelOfIso(iso: string): string {
  if (!iso) return ''
  return dayLabel(fromIso(iso))
}

export function fromIso(iso: string): Date {
  return new Date(`${iso}T00:00:00`)
}

/** Datum mit Wochentag, z. B. „Mi, 3. Sep“. */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return 'ohne Datum'
  return fromIso(iso).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null
  const a = fromIso(iso)
  const b = new Date()
  b.setHours(0, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function shiftIso(iso: string, days: number): string {
  const d = fromIso(iso)
  d.setDate(d.getDate() + days)
  return isoOf(d)
}

/** Sieben Tage: drei zurück, heute, drei voraus. */
export function rollingWeek(): { iso: string; date: Date; offset: number }[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const out = []
  for (let off = -3; off <= 3; off++) {
    const d = new Date(today)
    d.setDate(d.getDate() + off)
    out.push({ iso: isoOf(d), date: d, offset: off })
  }
  return out
}

export function minutesToHours(min: number): number {
  return Math.round((min / 60) * 10) / 10
}

export function fmtClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
