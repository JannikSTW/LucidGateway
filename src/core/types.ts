import type { ComponentType, ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

/* ============================================================
   Kerntypen. Alles, was mehrere Module teilen.
   ============================================================ */

/** Zustandsprofil — fünf Dimensionen, erfasst bei Traum- und OBE-Einträgen. */
export interface StateProfile {
  kl: number
  ze: number
  ko: number
  em: number
  ic: number
}

/** Der eine Eintragstyp. Alle Kategorien teilen ihn sich (ein Eingabeort). */
export interface Entry {
  id?: number
  cat: string
  title: string
  /** Anzeigedatum, z. B. „3. Sep“ */
  date: string
  /** Sortier- und Vergleichsdatum, z. B. „2026-09-03“ */
  iso: string
  createdAt: number
  b1: string
  b2: string
  scale: number
  tags: string[]
  paper: boolean
  /** IDs in der Tabelle `images` */
  scans: number[]
  keywords?: string
  /** Registerelemente: { ort: [...], person: [...], zeichen: [...] } */
  els?: Record<string, string[]>
  prof?: StateProfile | null
  /** Innere Anteile, die sich gezeigt haben */
  parts?: string[]
  /** Sitzungsdaten aus einem Formular-Schema */
  med?: SessionData | null
}

export interface SessionData {
  method: string
  dur: number | null
  vals: Record<string, unknown>
}

export interface StoredImage {
  id?: number
  blob: Blob
  w: number
  h: number
  createdAt: number
}

export interface SettingRow<T = unknown> {
  key: string
  value: T
}

/* ---------- Kategorien ---------- */

/**
 * Abschnitt, den ein Modul zum gemeinsamen Journalformular beisteuert
 * (z. B. die Traumregister oder das Zustandsprofil). Der Kern kennt nur das
 * Feld im Eintrag, nicht dessen Inhalt.
 */
export interface JournalExtra {
  id: string
  /** Beschriftung des Aufklappers */
  label: string
  field: 'els' | 'prof' | 'parts'
  Component: ComponentType<{ value: unknown; onChange: (v: unknown) => void }>
}

export interface JournalConfig {
  b1: { label: string; ph: string }
  b2: { label: string; ph: string }
  scale: { label: string; hints: string[] }
  tags: string[]
  /** Papier-Modus anbieten (Tagebuchseiten fotografieren) */
  paper?: boolean
  showScale?: boolean
  showTags?: boolean
  extras?: JournalExtra[]
}

export interface CategoryDef {
  key: string
  name: string
  short: string
  /** CSS-Variablen, keine Literale */
  color: string
  tint: string
  fg: string
  /** Klassenname für den Bereichston, z. B. „zone-ld“ */
  zone: string
  icon: ReactNode
  order: number
  /** Unterkategorie: erscheint nicht auf dem Dashboard, zählt auf `parent` */
  sub?: boolean
  parent?: string
  /** Konfiguration des gemeinsamen Journalformulars; null = kein Journal */
  journal: JournalConfig | null
  /** Zusatzinhalt auf dem Kategorie-Bildschirm (Statistik + Kacheln) */
  Extra?: ComponentType
  /** Beschreibung für die Kachel auf dem Dashboard */
  tileHint?: (count: number) => string
}

/* ---------- Beiträge zum Dashboard ---------- */

export interface DayMarker {
  iso: string
  /** Kategorie-Schlüssel, auf den der Tag einzahlt */
  cat: string
  /** geplant statt geschehen (gestrichelter Umriss) */
  planned?: boolean
  label: string
}

export interface ToolTile {
  id: string
  label: string
  icon: ReactNode
  to: string
  hint?: () => Promise<string> | string
  tint?: string
  fg?: string
}

export interface EntryView {
  id: string
  slot: 'before' | 'after'
  Component: ComponentType<{ entry: Entry }>
}

/* ---------- Modul ---------- */

export interface ModuleDef {
  id: string
  name: string
  /** Dexie-Schema dieses Moduls: { tabelle: 'indexspec' } */
  tables?: Record<string, string>
  categories?: CategoryDef[]
  routes?: RouteObject[]
  /** Werkzeugkacheln auf dem Dashboard */
  tools?: ToolTile[]
  /** Zusatzabschnitte in der Eintragsansicht */
  entryViews?: EntryView[]
  /** Beiträge zur rollenden Wochenübersicht */
  dayMarkers?: () => Promise<DayMarker[]>
  /** Einmalige Erstbefüllung (Vorlagen, Vorschlagsfragen) */
  seed?: () => Promise<void>
  /** Aufräumen, wenn ein Eintrag gelöscht wird */
  onEntryDeleted?: (entry: Entry) => Promise<void>
  /** Schnelleintrag auf dem Erfassen-Bildschirm (ein Feld, ein Tap) */
  quickCapture?: { label: string; hint: string; icon: ReactNode; to: string }
}
