import { registerAdventuresModule } from './adventures/index'
import { registerDreamModule } from './dream/index'
import { registerInnerModule } from './inner/index'
import { registerMindSparkModule } from './mindspark/index'
import { registerObeModule } from './obe/index'
import { registerProjectModule } from './project/index'
import { registerTrainingModule } from './training/index'

/**
 * Hier melden sich alle Module an. Das ist die einzige Stelle, die von einem
 * neuen Modul berührt wird — der Kern selbst bleibt unverändert.
 * Die Reihenfolge spielt keine Rolle; die Anzeige richtet sich nach `order`.
 */
export function registerAllModules(): void {
  registerDreamModule()
  registerObeModule()
  registerAdventuresModule()
  registerInnerModule()
  registerMindSparkModule()
  registerTrainingModule()
  registerProjectModule()
}
