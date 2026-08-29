import { registerModule } from '../../core/modules/registry'
import { AdventuresScreen } from './screens/AdventuresScreen'
import { NodeScreen } from './screens/NodeScreen'

/**
 * Dream Adventures — Hommage an den handschriftlichen Skill-Tree von 2024.
 * Bewusst abgekapselt: eigene Optik, eigener Ton, und der einzige Ort der
 * App mit Abhak-Logik.
 */
export function registerAdventuresModule(): void {
  registerModule({
    id: 'adventures',
    name: 'Dream Adventures',
    tables: { advChallenges: 'key' },
    routes: [
      { path: 'adventures', element: <AdventuresScreen /> },
      { path: 'adventures/:key', element: <NodeScreen /> },
    ],
  })
}
