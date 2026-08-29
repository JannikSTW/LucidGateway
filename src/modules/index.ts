import { registerDreamModule } from './dream/index'
import { registerMindSparkModule } from './mindspark/index'
import { registerProjectModule } from './project/index'

/**
 * Hier melden sich alle Module an. Das ist die einzige Stelle, die von einem
 * neuen Modul berührt wird — der Kern selbst bleibt unverändert.
 * Die Reihenfolge spielt keine Rolle; die Anzeige richtet sich nach `order`.
 */
export function registerAllModules(): void {
  registerDreamModule()
  registerMindSparkModule()
  registerProjectModule()
}
