export type DisciplineKey = 'kraft' | 'mma' | 'mob' | 'aus'

/** Eigengewicht · mit Gewicht · auf Zeit — bestimmt die Eingabefelder. */
export type ExerciseKind = 'bw' | 'load' | 'time'

export interface TemplateExercise {
  n: string
  /** Sätze */
  s: number
  /** Ziel, z. B. „8–10“ */
  r: string
  t: ExerciseKind
}

export interface Template {
  id?: number
  key: string
  name: string
  ex: TemplateExercise[]
}

/** Kopie der Vorlage im Moment der Durchführung. */
export interface DoneExercise extends TemplateExercise {
  kg: string
  reps: string
  done: boolean
  skip: boolean
}

export interface Training {
  id?: number
  disc: DisciplineKey
  venue: string | null
  focus: string
  dur: number | null
  rpe: number | null
  detail: string
  feel: string
  ex?: DoneExercise[]
  template?: string | null
  iso: string
  date: string
  createdAt: number
}
