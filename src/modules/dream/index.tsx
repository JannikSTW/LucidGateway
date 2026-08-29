import { registerModule } from '../../core/modules/registry'
import { ProfileExtra } from '../../core/profile'
import { DreamExtra } from './components/DreamExtra'
import { ElementsExtra } from './components/ElementsExtra'
import { IconDream } from './icons'

/**
 * Luzides Träumen — Traumjournal, Register, Traumwelt-Karte, Reality Checks.
 * Die Unterkategorie OBE bringt das eigene Modul `obe` mit.
 */
export function registerDreamModule(): void {
  registerModule({
    id: 'dream',
    name: 'Luzides Träumen',
    tables: {
      regItems: '++id, register, name',
      dreamLinks: '++id',
      verbindungen: '++id',
      rcChecks: '++id',
    },
    categories: [
      {
        key: 'ld',
        name: 'Luzides Träumen',
        short: 'Traum',
        color: 'var(--cat-ld)',
        tint: 'var(--cat-ld-tint)',
        fg: 'var(--cat-ld-fg)',
        zone: 'ld',
        icon: <IconDream />,
        order: 1,
        Extra: DreamExtra,
        journal: {
          b1: {
            label: 'Traumbericht',
            ph: 'Handlung\nPersonen\nDialoge\nOrte\nEmotionen',
          },
          b2: {
            label: 'Zusatznotizen',
            ph: 'Selbstwahrnehmung und Identität\nTraumthemen und Symbole\nIntentionen und vorab gesetzte Fragen\nTraumdauer und Zeitwahrnehmung\nStruktur und Fraktale\nGrad der Klarheit',
          },
          scale: {
            label: 'Luzidität',
            hints: [
              'Nicht luzide',
              'Kurzes Aha, gleich verloren',
              'Luzide, aber passiv',
              'Luzide mit Handlung',
              'Stabil luzide, klare Absicht',
              'Volle Klarheit',
            ],
          },
          // Im Traumjournal bewusst keine Marker — die Register erfüllen die Aufgabe.
          tags: [],
          showTags: false,
          paper: true,
          extras: [
            { id: 'els', label: 'Orte, Gestalten & Traumzeichen', field: 'els', Component: ElementsExtra },
            { id: 'prof', label: 'Zustandsprofil', field: 'prof', Component: ProfileExtra },
          ],
        },
      },
    ],
  })
}
