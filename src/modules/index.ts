import { registerTemplateModule } from './_template/index'

/**
 * Hier melden sich alle Module an. Das ist die einzige Stelle, die von einem
 * neuen Modul berührt wird — der Kern selbst bleibt unverändert.
 */
export function registerAllModules(): void {
  registerTemplateModule()
}
