import { registerModule } from '../../core/modules/registry'
import { MindSparkExtra } from './components/MindSparkExtra'
import { IconMindSpark } from './icons'

/** MindSpark — die Wachwelt: Gedanken, Journal, Training, Ziele. */
export function registerMindSparkModule(): void {
  registerModule({
    id: 'mindspark',
    name: 'MindSpark',
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
