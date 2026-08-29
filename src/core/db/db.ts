import Dexie, { type Table } from 'dexie'

/**
 * Der Kern kennt nur seine eigenen Tabellen. Alles Weitere melden die Module
 * über die Registry an (siehe core/modules/registry.ts) — deshalb muss hier
 * nichts angefasst werden, wenn ein Modul dazukommt.
 *
 * Die Schema-Version wird nicht von Hand gepflegt: Beim Start vergleichen wir
 * das gewünschte Schema mit dem, was tatsächlich im Browser liegt, und zählen
 * die Version nur hoch, wenn sich etwas geändert hat.
 */

export const DB_NAME = 'lucid-gateway'

export const CORE_TABLES: Record<string, string> = {
  entries: '++id, cat, iso, date',
  images: '++id',
  settings: 'key',
}

let db: Dexie | null = null

export function getDb(): Dexie {
  if (!db) throw new Error('Datenbank ist noch nicht geöffnet — initDb() zuerst aufrufen.')
  return db
}

export function table<T, K = number>(name: string): Table<T, K> {
  return getDb().table(name) as Table<T, K>
}

/** Index-Angaben vergleichbar machen ('++id, cat' und '++id,cat' sind gleich). */
function normalize(spec: string): string {
  return spec
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',')
}

function schemaOf(instance: Dexie): Record<string, string> {
  const out: Record<string, string> = {}
  for (const t of instance.tables) {
    const parts = [t.schema.primKey.src, ...t.schema.indexes.map((i) => i.src)]
    out[t.name] = normalize(parts.join(','))
  }
  return out
}

export async function initDb(moduleTables: Record<string, string>): Promise<Dexie> {
  const wanted: Record<string, string> = {}
  for (const [name, spec] of Object.entries({ ...CORE_TABLES, ...moduleTables })) {
    wanted[name] = normalize(spec)
  }

  let verno = 0
  let existing: Record<string, string> = {}

  if (await Dexie.exists(DB_NAME)) {
    // Ohne Schema geöffnet liest Dexie das vorhandene Schema aus der Datenbank.
    const probe = new Dexie(DB_NAME)
    await probe.open()
    verno = probe.verno
    existing = schemaOf(probe)
    probe.close()
  }

  // Tabellen, die es gibt, die aber kein Modul mehr anmeldet, bleiben unangetastet.
  const stores: Record<string, string> = { ...existing, ...wanted }
  const changed =
    Object.keys(stores).length !== Object.keys(existing).length ||
    Object.entries(wanted).some(([name, spec]) => existing[name] !== spec)

  const next = new Dexie(DB_NAME)
  next.version(changed ? verno + 1 : verno || 1).stores(stores)
  await next.open()
  db = next
  return next
}

/** Nur für Import/Export und Tests: alle Tabellennamen der offenen Datenbank. */
export function tableNames(): string[] {
  return getDb().tables.map((t) => t.name)
}
