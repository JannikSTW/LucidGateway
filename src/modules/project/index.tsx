import { registerModule } from '../../core/modules/registry'
import { todayIso } from '../../core/util/date'
import { ProjectExtra } from './components/ProjectExtra'
import { termine } from './db'
import { IconProject } from './icons'
import { ClientFormScreen } from './screens/ClientFormScreen'
import { ClientScreen } from './screens/ClientScreen'
import { ClientSessionScreen } from './screens/ClientSessionScreen'
import { ClientsScreen } from './screens/ClientsScreen'
import { ProtocolScreen } from './screens/ProtocolScreen'
import { TermineScreen, TerminFormScreen } from './screens/TermineScreen'
import { UmfeldFormScreen } from './screens/UmfeldFormScreen'
import { UmfeldItemScreen } from './screens/UmfeldItemScreen'
import { UmfeldLinkScreen } from './screens/UmfeldLinkScreen'
import { UmfeldListScreen } from './screens/UmfeldListScreen'
import { UmfeldScreen } from './screens/UmfeldScreen'

/** Mixed Martial Mindset — Umfeld, Termine, Klienten. */
export function registerProjectModule(): void {
  registerModule({
    id: 'project',
    name: 'Mixed Martial Mindset',
    tables: {
      netz: '++id, kind',
      netzLinks: '++id',
      termine: '++id, date, cid, nid',
      clients: '++id',
      clientSessions: '++id, cid, iso',
    },
    routes: [
      { path: 'projekt/umfeld', element: <UmfeldScreen /> },
      { path: 'projekt/umfeld/alle', element: <UmfeldListScreen /> },
      { path: 'projekt/umfeld/neu', element: <UmfeldFormScreen /> },
      { path: 'projekt/umfeld/:id', element: <UmfeldItemScreen /> },
      { path: 'projekt/umfeld/:id/bearbeiten', element: <UmfeldFormScreen /> },
      { path: 'projekt/umfeld/:id/verknuepfen', element: <UmfeldLinkScreen /> },
      { path: 'projekt/termine', element: <TermineScreen /> },
      { path: 'projekt/termine/neu', element: <TerminFormScreen /> },
      { path: 'projekt/klienten', element: <ClientsScreen /> },
      { path: 'projekt/klienten/neu', element: <ClientFormScreen /> },
      { path: 'projekt/klienten/:id', element: <ClientScreen /> },
      { path: 'projekt/klienten/:id/bearbeiten', element: <ClientFormScreen /> },
      { path: 'projekt/klienten/:id/sitzung', element: <ClientSessionScreen /> },
      { path: 'projekt/protokoll/:id', element: <ProtocolScreen /> },
    ],
    dayMarkers: async () => {
      const all = await termine().filter((t) => !!t.date).toArray()
      const today = todayIso()
      return all.map((t) => ({
        iso: t.date,
        cat: 'mmm',
        // Erledigte Termine sind geschehen, künftige sind geplant.
        planned: !t.done && t.date >= today,
        label: t.done ? `Termin: ${t.title}` : `geplant: ${t.title}`,
      }))
    },
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
