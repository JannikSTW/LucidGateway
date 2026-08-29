import { registerModule } from '../../core/modules/registry'
import { ProjectExtra } from './components/ProjectExtra'
import { IconProject } from './icons'

/** Mixed Martial Mindset — Umfeld, Termine, Klienten. */
export function registerProjectModule(): void {
  registerModule({
    id: 'project',
    name: 'Mixed Martial Mindset',
    categories: [
      {
        key: 'mmm',
        name: 'Mixed Martial Mindset',
        short: 'Projekt',
        color: 'var(--cat-mmm)',
        tint: 'var(--cat-mmm-tint)',
        fg: 'var(--cat-mmm-fg)',
        zone: 'mmm',
        icon: <IconProject />,
        order: 4,
        Extra: ProjectExtra,
        journal: {
          b1: { label: 'Notiz', ph: 'Was ist passiert?\nWas ist mir aufgefallen?\nIdee fürs Projekt' },
          b2: { label: 'Nächster Schritt', ph: 'Was folgt daraus?\nWen muss ich ansprechen?' },
          scale: { label: 'Priorität', hints: ['—', 'Nebenbei', 'Bald', 'Wichtig', 'Dringend', 'Jetzt'] },
          tags: ['Idee', 'Organisation', 'Jugendhaus', 'Kooperation', 'Material', 'Offen'],
        },
      },
    ],
  })
}
