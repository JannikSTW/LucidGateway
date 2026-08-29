import { registerModule } from '../../core/modules/registry'
import { ProfileExtra } from '../../core/profile'
import { DreamExtra } from './components/DreamExtra'
import { ElementsExtra } from './components/ElementsExtra'
import { IconDream } from './icons'
import { DreamWorldScreen } from './screens/DreamWorldScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { RegItemScreen } from './screens/RegItemScreen'
import { LinkScreen } from './screens/LinkScreen'
import { ThesesScreen, ThesisFormScreen } from './screens/ThesesScreen'
import { RealityCheckScreen } from './screens/RealityCheckScreen'
import { RcRunner } from './components/RcRunner'
import { IconEye } from '../../core/ui/icons'
import { seedChecks } from './rc'
import { rcChecks } from './db'
import { plural } from '../../core/util/text'

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
    seed: seedChecks,
    background: [{ id: 'rc-runner', Component: RcRunner }],
    tools: [
      {
        id: 'reality-checks',
        label: 'Reality Checks',
        icon: <IconEye />,
        to: '/reality-checks',
        tint: 'var(--cat-ld-tint)',
        fg: 'var(--cat-ld-fg)',
        hint: async () => plural((await rcChecks().toArray()).filter((c) => c.on).length, 'aktive Frage', 'aktive Fragen'),
      },
    ],
    routes: [
      { path: 'reality-checks', element: <RealityCheckScreen /> },
      { path: 'traumwelt', element: <DreamWorldScreen /> },
      { path: 'traumwelt/verbindungen', element: <ThesesScreen /> },
      { path: 'traumwelt/verbindungen/neu', element: <ThesisFormScreen /> },
      { path: 'traumwelt/register/:reg', element: <RegisterScreen /> },
      { path: 'traumwelt/register/:reg/:name', element: <RegItemScreen /> },
      { path: 'traumwelt/register/:reg/:name/verknuepfen', element: <LinkScreen /> },
    ],
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
