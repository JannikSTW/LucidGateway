import { useLiveQuery } from 'dexie-react-hooks'
import { table } from '../../core/db/db'

export interface ChallengeState {
  key: string
  done: boolean
}

export const advChallenges = () => table<ChallengeState, string>('advChallenges')

export function useChallengeState(): Record<string, boolean> {
  const rows = useLiveQuery(() => advChallenges().toArray(), [], [] as ChallengeState[])
  const map: Record<string, boolean> = {}
  for (const r of rows ?? []) map[r.key] = r.done
  return map
}

export async function toggleChallenge(key: string, done: boolean): Promise<void> {
  await advChallenges().put({ key, done: !done })
}
