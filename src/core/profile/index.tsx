import { Bar, Radar } from '../ui/data'
import { Card } from '../ui/basics'
import { Eyebrow } from '../ui/layout'
import { SliderRow } from '../ui/inputs'
import type { Entry, StateProfile } from '../types'

/**
 * Das Zustandsprofil (KONZEPT §4). Fünf Dimensionen, bewusst nur bei Traum-
 * und OBE-Einträgen erfasst — dadurch lassen sich beide Zustände vergleichen.
 */
export const PROFILE: [keyof StateProfile, string, string][] = [
  ['kl', 'Klarheit', 'Wie wach war das Denken?'],
  ['ze', 'Zeitwahrnehmung', 'Wie verzerrt war die Zeit?'],
  ['ko', 'Körpergefühl', 'Wie präsent war der Körper?'],
  ['em', 'Emotionale Färbung', 'Wie stark aufgeladen?'],
  ['ic', 'Ich-Grenzen', 'Wie fest war das Ich-Gefühl?'],
]

export const PROFILE_KEYS = PROFILE.map(([k]) => k)

export const emptyProfile = (): StateProfile => ({ kl: 5, ze: 5, ko: 5, em: 5, ic: 5 })

export function ProfileSliders({
  value,
  onChange,
}: {
  value: StateProfile | null
  onChange: (v: StateProfile) => void
}) {
  const v = value ?? emptyProfile()
  return (
    <>
      {PROFILE.map(([k, label, hint]) => (
        <SliderRow
          key={k}
          label={label}
          title={hint}
          value={v[k]}
          onChange={(n) => onChange({ ...v, [k]: n })}
        />
      ))}
    </>
  )
}

/** Als Abschnitt im Journalformular. */
export function ProfileExtra({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  return <ProfileSliders value={(value as StateProfile) ?? null} onChange={(v) => onChange(v)} />
}

export function ProfileCard({ profile, color = 'var(--violet)', fill = 'var(--violet-soft)' }: { profile: StateProfile; color?: string; fill?: string }) {
  return (
    <Card>
      <Eyebrow>Zustandsprofil</Eyebrow>
      <div style={{ display: 'flex', gap: 'var(--sp-7)', alignItems: 'center', marginTop: 'var(--sp-2)' }}>
        <Radar dims={PROFILE_KEYS} shapes={[{ values: profile as unknown as Record<string, number>, color, fill }]} size={86} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {PROFILE.map(([k, label]) => (
            <Bar key={k} label={label} value={profile[k] ?? 0} color={color} />
          ))}
        </div>
      </div>
    </Card>
  )
}

/** Mittelwert über alle Einträge mit Profil. */
export function averageProfile(entries: Entry[]): StateProfile | null {
  const withProfile = entries.filter((e) => e.prof)
  if (!withProfile.length) return null
  const out = {} as StateProfile
  for (const [k] of PROFILE) {
    const sum = withProfile.reduce((s, e) => s + (e.prof?.[k] ?? 0), 0)
    out[k] = Math.round((sum / withProfile.length) * 10) / 10
  }
  return out
}

/** Zeigt das Profil in der Eintragsansicht. */
export function ProfileEntryView({ entry }: { entry: Entry }) {
  if (!entry.prof) return null
  return <ProfileCard profile={entry.prof} />
}
