import { registerModule } from '../../core/modules/registry'
import { MindSparkExtra } from './components/MindSparkExtra'
import { IconMindSpark, IconPlusRound } from './icons'
import { thoughts } from './db'
import { InboxScreen, QuickThoughtScreen } from './screens/ThoughtScreens'
import { ZielFormScreen, ZielScreen, ZieleScreen } from './screens/ZieleScreens'

/** MindSpark — die Wachwelt: Gedanken, Journal, Training, Ziele. */
export function registerMindSparkModule(): void {
  registerModule({
    id: 'mindspark',
    name: 'MindSpark',
    tables: { thoughts: '++id, iso', ziele: '++id, hor, status' },
    routes: [
      { path: 'gedanke', element: <QuickThoughtScreen /> },
      { path: 'gedankenspeicher', element: <InboxScreen /> },
      { path: 'ziele', element: <ZieleScreen /> },
      { path: 'ziele/neu', element: <ZielFormScreen /> },
      { path: 'ziele/:id', element: <ZielScreen /> },
      { path: 'ziele/:id/bearbeiten', element: <ZielFormScreen /> },
    ],
    quickCapture: {
      label: 'Gedanke festhalten',
      hint: 'Ein Feld, ein Tap — sortieren später.',
      icon: <IconPlusRound />,
      to: '/gedanke',
    },
    dayMarkers: async () => {
      const all = await thoughts().toArray()
      return all.map((t) => ({ iso: t.iso, cat: 'ms', label: 'Gedanken' }))
    },
    categories: [
      {
        key: 'ms',
        name: 'MindSpark',
        short: 'MindSpark',
        color: 'var(--cat-ms)',
        tint: 'var(--cat-ms-tint)',
        fg: 'var(--cat-ms-fg)',
        zone: 'ms',
        icon: <IconMindSpark />,
        order: 2,
        Extra: MindSparkExtra,
        journal: {
          b1: {
            label: 'Gedanke & Beobachtung',
            ph: 'Was ist mir aufgefallen?\nIdee, Einfall, Frage\nWas ist heute passiert?',
          },
          b2: {
            label: 'Einordnung & nächster Schritt',
            ph: 'Was bedeutet das?\nWorauf zahlt es ein?\nWas wäre der nächste Schritt?',
          },
          // In der Wachwelt gibt es keine Skala — nur Marker.
          scale: { label: 'Wirkung', hints: ['—', 'Kaum spürbar', 'Leicht', 'Deutlich', 'Stark', 'Sehr stark'] },
          showScale: false,
          tags: ['Gut gelaufen', 'Zäh', 'Neues gelernt', 'Grenze gespürt', 'Wiederholen'],
        },
      },
    ],
  })
}
