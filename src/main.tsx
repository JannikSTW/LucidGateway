import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './core/theme/tokens.css'
import './core/theme/base.css'
import './core/theme/components.css'
import { App } from './App'
import { initDb } from './core/db/db'
import { moduleTables, seedModules } from './core/modules/registry'
import { registerAllModules } from './modules'

async function bootstrap() {
  registerAllModules()
  await initDb(moduleTables())
  await seedModules()

  const root = document.getElementById('root')
  if (!root) throw new Error('Wurzelelement fehlt')
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

bootstrap().catch((err) => {
  console.error(err)
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML =
      '<div style="padding:32px;font-family:system-ui;color:#EDEEF3;line-height:1.5">' +
      '<h1 style="font-family:Georgia,serif;font-size:20px;margin-bottom:8px">Start fehlgeschlagen</h1>' +
      '<p style="color:#8B93A7;font-size:14px">Die lokale Datenbank ließ sich nicht öffnen. ' +
      'Im privaten Modus mancher Browser ist IndexedDB gesperrt.</p></div>'
  }
})
