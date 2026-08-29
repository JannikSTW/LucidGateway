import { getDb } from './db'
import { isoOf } from '../util/date'

/**
 * Vollständige Sicherung: alle Tabellen inklusive Bilder. Ohne Konto und ohne
 * Cloud ist die JSON-Datei das einzige Backup — deshalb ist sie Pflicht.
 */

const MAGIC = 'lucid-gateway'
const FORMAT = 1

interface BlobRef {
  __blob: true
  type: string
  data: string
}

export interface BackupFile {
  app: string
  format: number
  exportedAt: string
  tables: Record<string, unknown[]>
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function base64ToBlob(data: string, type: string): Blob {
  const bin = atob(data)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type })
}

async function encode(value: unknown): Promise<unknown> {
  if (value instanceof Blob) {
    return { __blob: true, type: value.type || 'application/octet-stream', data: await blobToBase64(value) } as BlobRef
  }
  if (Array.isArray(value)) return Promise.all(value.map(encode))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = await encode(v)
    return out
  }
  return value
}

function decode(value: unknown): unknown {
  if (value && typeof value === 'object') {
    const ref = value as Partial<BlobRef>
    if (ref.__blob && typeof ref.data === 'string') return base64ToBlob(ref.data, ref.type ?? '')
    if (Array.isArray(value)) return value.map(decode)
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = decode(v)
    return out
  }
  return value
}

export async function exportAll(): Promise<BackupFile> {
  const db = getDb()
  const tables: Record<string, unknown[]> = {}
  for (const t of db.tables) {
    const rows = await t.toArray()
    tables[t.name] = (await encode(rows)) as unknown[]
  }
  return { app: MAGIC, format: FORMAT, exportedAt: new Date().toISOString(), tables }
}

export async function downloadBackup(): Promise<string> {
  const data = await exportAll()
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const name = `lucid-gateway-${isoOf(new Date())}.json`
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
  return name
}

export interface ImportReport {
  tables: number
  rows: number
  skipped: string[]
}

/** Ersetzt den Inhalt der Datenbank durch die Sicherung. */
export async function importBackup(file: File): Promise<ImportReport> {
  const parsed = JSON.parse(await file.text()) as BackupFile
  if (parsed.app !== MAGIC) throw new Error('Das ist keine Lucid-Gateway-Sicherung.')
  if (parsed.format > FORMAT) throw new Error('Die Sicherung stammt aus einer neueren Version der App.')

  const db = getDb()
  const known = new Set(db.tables.map((t) => t.name))
  const skipped = Object.keys(parsed.tables).filter((name) => !known.has(name))
  const usable = db.tables.filter((t) => parsed.tables[t.name])

  let rows = 0
  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) await t.clear()
    for (const t of usable) {
      const data = (decode(parsed.tables[t.name]) as unknown[]) ?? []
      if (data.length) await t.bulkAdd(data as never[])
      rows += data.length
    }
  })
  return { tables: usable.length, rows, skipped }
}
