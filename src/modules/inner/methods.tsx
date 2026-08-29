import type { SessionMethod } from '../../core/session/registry'
import type { FieldSpec } from '../../core/ui/form/schema'
import { PartsExtra } from './components/PartsExtra'
import { IconBreath, IconImagination, IconMeditation } from './icons'

const partsField: FieldSpec = {
  k: 'parts',
  t: 'custom',
  label: 'Wer hat sich gezeigt?',
  render: (value, set) => <PartsExtra value={value} onChange={set} />,
}

/** Die drei Praktiken der Innenwelt. Jede mit Timer und eigenem Formular. */
export const INNER_METHODS: SessionMethod[] = [
  {
    key: 'imag',
    name: 'Aktive Imagination / Visualisierung',
    sub: 'Dialog mit inneren Bildern',
    cat: 'ai',
    zone: 'ai',
    icon: <IconImagination />,
    color: 'var(--cat-ai-fg)',
    tint: 'var(--cat-ai-tint)',
    presets: [10, 15, 20, 30],
    back: '/kategorie/ai',
    fields: [
      {
        k: 'modus',
        t: 'single',
        label: 'Modus',
        opts: ['Aktive Imagination (folgen)', 'Visualisierung (gestalten)'],
      },
      { k: 'start', t: 'text', label: 'Ausgangsbild oder Intention', ph: 'Womit beginnst du?' },
      {
        k: 'verlauf',
        t: 'area',
        label: 'Verlauf & Dialog',
        rows: 7,
        ph: 'Was tauchte auf?\nWas wurde gesagt oder gezeigt?\nProtokolliere wie ein Beobachter.',
      },
      partsField,
      {
        k: 'leben',
        t: 'scale',
        label: 'Lebendigkeit der Bilder',
        hints: ['Kaum', 'Schemenhaft', 'Erkennbar', 'Lebendig', 'Sehr lebendig', 'Wie real'],
      },
      { k: 'eigen', t: 'range', label: 'Geführt ← → Eigendynamik', left: 'ich lenke', right: 'es passiert' },
      { k: 'integration', t: 'area', label: 'Integration', rows: 3, ph: 'Was nehme ich mit in den Alltag? Ein Satz reicht.' },
    ],
    toEntry: (v) => ({
      title: (v.start as string) || 'Aktive Imagination',
      b1: (v.verlauf as string) ?? '',
      b2: (v.integration as string) ?? '',
      scale: (v.leben as number) ?? 0,
      parts: (v.parts as string[]) ?? [],
    }),
  },
  {
    key: 'breath',
    name: 'Breathwork',
    sub: 'Atemarbeit & Regulation',
    cat: 'ai',
    zone: 'ai',
    icon: <IconBreath />,
    color: 'var(--sky-fg)',
    tint: 'rgba(111, 168, 245, 0.14)',
    presets: [5, 10, 15, 20],
    back: '/kategorie/ai',
    safety:
      'Bei intensiven Techniken mit Hyperventilation: nie im oder am Wasser, nie im Stehen, nicht bei Herz-Kreislauf-Problemen oder in der Schwangerschaft. Bei Schwindel oder Kribbeln zurück in ruhige Nasenatmung.',
    fields: [
      {
        k: 'technik',
        t: 'single',
        label: 'Technik',
        opts: ['Kohärenzatmung', 'Box Breathing', '4-7-8', 'Wechselatmung', 'Intensiv / verbunden'],
      },
      { k: 'rhythmus', t: 'text', label: 'Rhythmus', ph: 'z. B. 4-4-4-4 oder 5,5 / 5,5' },
      { k: 'runden', t: 'text', label: 'Runden / Zyklen', ph: 'z. B. 3 Runden à 30 Atemzüge' },
      { k: 'ba', t: 'ba', label: 'Zustand vorher → nachher' },
      {
        k: 'koerper',
        t: 'multi',
        label: 'Körperliche Reaktionen',
        opts: ['Kribbeln', 'Wärme', 'Kälte', 'Schwindel', 'Enge', 'Tiefe Ruhe', 'Emotionen'],
      },
      { k: 'notiz', t: 'area', label: 'Notiz', rows: 5, ph: 'Wie war es? Was ist aufgefallen?' },
      partsField,
    ],
    toEntry: (v) => ({
      title: (v.technik as string) || 'Breathwork',
      b1: (v.notiz as string) ?? '',
      b2: '',
      scale: 0,
      parts: (v.parts as string[]) ?? [],
    }),
  },
  {
    key: 'free',
    name: 'Freie Meditation',
    sub: 'Stille, Anker, Präsenz',
    cat: 'ai',
    zone: 'ai',
    icon: <IconMeditation />,
    color: 'var(--teal-fg)',
    tint: 'var(--cat-obe-tint)',
    presets: [10, 15, 20, 30, 45],
    back: '/kategorie/ai',
    fields: [
      { k: 'haltung', t: 'single', label: 'Haltung', opts: ['Sitzen', 'Liegen', 'Gehen'] },
      {
        k: 'anker',
        t: 'single',
        label: 'Ankerpunkt',
        opts: ['Atem', 'Körper', 'Geräusche', 'Offenes Gewahrsein', 'Metta'],
      },
      { k: 'verlauf', t: 'area', label: 'Verlauf', rows: 6, ph: 'Wo ist der Geist hingegangen?\nWie war das Zurückkommen?' },
      {
        k: 'tiefe',
        t: 'scale',
        label: 'Tiefe',
        hints: ['Kaum angekommen', 'Unruhig', 'Zeitweise ruhig', 'Ruhig & präsent', 'Tief', 'Sehr tief'],
      },
      {
        k: 'stoer',
        t: 'multi',
        label: 'Was hat gestört?',
        opts: ['Gedankenkarussell', 'Müdigkeit', 'Unruhe', 'Schmerz', 'Außengeräusche', 'Nichts'],
      },
      { k: 'nach', t: 'area', label: 'Nachklang', rows: 3, ph: 'Wie fühlt es sich jetzt an?' },
      partsField,
    ],
    toEntry: (v) => ({
      title: (v.anker as string) || 'Freie Meditation',
      b1: (v.verlauf as string) ?? '',
      b2: (v.nach as string) ?? '',
      scale: (v.tiefe as number) ?? 0,
      parts: (v.parts as string[]) ?? [],
    }),
  },
]
