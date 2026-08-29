import { useLocation, useNavigate } from 'react-router-dom'
import { IconArchive, IconGrid, IconHome, IconPlus, IconSliders } from '../ui/icons'

type Slot = 'home' | 'archive' | 'capture' | 'cats' | 'app'

/** Welcher Platz leuchtet? Unbekannte Modulwege zählen als „Kategorien“. */
function slotFor(path: string): Slot {
  if (path === '/') return 'home'
  if (path.startsWith('/archiv') || path.startsWith('/eintrag')) return 'archive'
  if (path.startsWith('/neu') || path.startsWith('/journal') || path.startsWith('/gedanke')) return 'capture'
  if (path.startsWith('/felder')) return 'cats'
  if (path.startsWith('/einstellungen') || path.startsWith('/reality-checks')) return 'app'
  return 'cats'
}

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const active = slotFor(pathname)

  return (
    <nav className="nav">
      <button className={active === 'home' ? 'on' : ''} onClick={() => navigate('/')} title="Heute" aria-label="Heute">
        <IconHome />
      </button>
      <button
        className={active === 'archive' ? 'on' : ''}
        onClick={() => navigate('/archiv')}
        title="Archiv"
        aria-label="Archiv"
      >
        <IconArchive />
      </button>
      <button className="fab" onClick={() => navigate('/neu')} title="Neuer Eintrag" aria-label="Neuer Eintrag">
        <IconPlus />
      </button>
      <button
        className={active === 'cats' ? 'on' : ''}
        onClick={() => navigate('/felder')}
        title="Felder"
        aria-label="Felder"
      >
        <IconGrid />
      </button>
      <button
        className={active === 'app' ? 'on' : ''}
        onClick={() => navigate('/einstellungen')}
        title="App"
        aria-label="App"
      >
        <IconSliders />
      </button>
    </nav>
  )
}
