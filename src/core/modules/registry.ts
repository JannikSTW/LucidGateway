import type { CategoryDef, DayMarker, Entry, ModuleDef } from '../types'

/**
 * Module melden sich hier an. Der Kern kennt sie nur über dieses Verzeichnis —
 * ein neues Modul erfordert deshalb keine Änderung am Kern.
 */
const modules: ModuleDef[] = []

export function registerModule(def: ModuleDef): void {
  if (modules.some((m) => m.id === def.id)) {
    throw new Error(`Modul „${def.id}“ ist bereits angemeldet.`)
  }
  modules.push(def)
}

export function allModules(): readonly ModuleDef[] {
  return modules
}

export function moduleTables(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of modules) {
    for (const [name, spec] of Object.entries(m.tables ?? {})) {
      if (out[name]) throw new Error(`Tabelle „${name}“ wird von zwei Modulen beansprucht.`)
      out[name] = spec
    }
  }
  return out
}

export function allCategories(): CategoryDef[] {
  return modules
    .flatMap((m) => m.categories ?? [])
    .sort((a, b) => a.order - b.order)
}

export function mainCategories(): CategoryDef[] {
  return allCategories().filter((c) => !c.sub)
}

export function category(key: string): CategoryDef | undefined {
  return allCategories().find((c) => c.key === key)
}

/** Unterkategorien zählen auf ihre Hauptkategorie. */
export function rollUp(key: string): string {
  return category(key)?.parent ?? key
}

export function allRoutes() {
  return modules.flatMap((m) => m.routes ?? [])
}

export function allTools() {
  return modules.flatMap((m) => m.tools ?? [])
}

export function backgroundTasks() {
  return modules.flatMap((m) => m.background ?? [])
}

export function quickCaptures() {
  return modules.flatMap((m) => (m.quickCapture ? [m.quickCapture] : []))
}

export function entryViews(slot: 'before' | 'after') {
  return modules.flatMap((m) => m.entryViews ?? []).filter((v) => v.slot === slot)
}

export async function collectDayMarkers(): Promise<DayMarker[]> {
  const lists = await Promise.all(modules.map((m) => (m.dayMarkers ? m.dayMarkers() : [])))
  return lists.flat()
}

export async function seedModules(): Promise<void> {
  for (const m of modules) {
    if (m.seed) await m.seed()
  }
}

export async function notifyEntryDeleted(entry: Entry): Promise<void> {
  for (const m of modules) {
    if (m.onEntryDeleted) await m.onEntryDeleted(entry)
  }
}
