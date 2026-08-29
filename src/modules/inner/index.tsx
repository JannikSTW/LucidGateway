import { registerModule } from '../../core/modules/registry'
import { registerSessionMethod } from '../../core/session/registry'
import { InnerExtra } from './components/InnerExtra'
import { IconInner } from './icons'
import { INNER_METHODS } from './methods'
import { InnerMapScreen } from './screens/InnerMapScreen'
import { PartScreen } from './screens/PartScreen'
import { PartFormScreen } from './screens/PartFormScreen'
import { PartLinkScreen } from './screens/PartLinkScreen'

/** Innenwelt — Meditation, Aktive Imagination, Breathwork, Arbeit mit Anteilen. */
export function registerInnerModule(): void {
  for (const m of INNER_METHODS) registerSessionMethod(m)

  registerModule({
    id: 'inner',
    name: 'Innenwelt',
    tables: { parts: '++id, name', partLinks: '++id' },
    routes: [
      { path: 'innenwelt', element: <InnerMapScreen /> },
      { path: 'innenwelt/anteil/:name', element: <PartScreen /> },
      { path: 'innenwelt/anteil/:name/profil', element: <PartFormScreen /> },
      { path: 'innenwelt/anteil/:name/beziehung', element: <PartLinkScreen /> },
    ],
    categories: [
      {
        key: 'ai',
        name: 'Innenwelt',
        short: 'Innenwelt',
        color: 'var(--cat-ai)',
        tint: 'var(--cat-ai-tint)',
        fg: 'var(--cat-ai-fg)',
        zone: 'ai',
        icon: <IconInner />,
        order: 3,
        Extra: InnerExtra,
        journal: {
          b1: {
            label: 'Verlauf & Beobachtungen',
            ph: 'Wie ist die Sitzung verlaufen?\nWas ist aufgetaucht?\nWo ist der Geist hingegangen?',
          },
          b2: {
            label: 'Nachklang & Erkenntnis',
            ph: 'Wie fühlt es sich danach an?\nWas bleibt?\nWas nehme ich mit in den Alltag?',
          },
          scale: {
            label: 'Tiefe',
            hints: ['Kaum angekommen', 'Unruhig', 'Zeitweise ruhig', 'Ruhig & präsent', 'Tief', 'Sehr tief'],
          },
          tags: ['Ruhig', 'Unruhig', 'Starke Bilder', 'Körperlich spürbar', 'Eingeschlafen', 'Integration offen'],
        },
      },
    ],
  })
}
