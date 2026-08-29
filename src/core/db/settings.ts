import { useLiveQuery } from 'dexie-react-hooks'
import { table } from './db'
import type { SettingRow } from '../types'

const settings = () => table<SettingRow, string>('settings')

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await settings().get(key)
  return row === undefined ? fallback : (row.value as T)
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  await settings().put({ key, value })
}

/** Reaktiver Zugriff auf eine Einstellung. */
export function useSetting<T>(key: string, fallback: T): [T, (v: T) => Promise<void>] {
  const value = useLiveQuery(async () => getSetting<T>(key, fallback), [key], fallback)
  return [value ?? fallback, (v: T) => setSetting(key, v)]
}
