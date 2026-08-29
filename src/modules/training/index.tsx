import { registerModule } from '../../core/modules/registry'
import { seedTemplates, trainings } from './db'
import { DiscScreen } from './screens/DiscScreen'
import { KraftPickScreen } from './screens/KraftPickScreen'
import { TemplateEditScreen, TemplatesScreen } from './screens/TemplateScreens'
import { TrainFormScreen } from './screens/TrainFormScreen'
import { TrainScreen } from './screens/TrainScreen'
import { TrainingEntryScreen } from './screens/TrainingEntryScreen'
import { WorkoutScreen } from './screens/WorkoutScreen'

/**
 * Trainingslog — nur eigenes Training. Coaching-Einheiten gehören ins Projekt.
 * Der Log zahlt auf die Wachwelt (MindSpark) ein, bleibt aber ein eigenes Modul.
 */
export function registerTrainingModule(): void {
  registerModule({
    id: 'training',
    name: 'Trainingslog',
    tables: { trainings: '++id, disc, iso', templates: '++id, key' },
    seed: seedTemplates,
    routes: [
      { path: 'training', element: <TrainScreen /> },
      { path: 'training/vorlagen', element: <TemplatesScreen /> },
      { path: 'training/vorlagen/:key', element: <TemplateEditScreen /> },
      { path: 'training/kraft/start', element: <KraftPickScreen /> },
      { path: 'training/kraft/einheit/:key', element: <WorkoutScreen /> },
      { path: 'training/einheit/:id', element: <TrainingEntryScreen /> },
      { path: 'training/:disc', element: <DiscScreen /> },
      { path: 'training/:disc/neu', element: <TrainFormScreen /> },
    ],
    dayMarkers: async () => {
      const all = await trainings().toArray()
      return all.map((t) => ({ iso: t.iso, cat: 'ms', label: 'Training' }))
    },
  })
}
