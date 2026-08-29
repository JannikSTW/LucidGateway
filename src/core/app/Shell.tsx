import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { DialogProvider } from '../ui/dialog'
import { ToastProvider } from '../ui/toast'
import { ThemeProvider } from './ThemeProvider'
import { backgroundTasks } from '../modules/registry'

export function Shell() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DialogProvider>
          <div className="app">
            <Outlet />
            <BottomNav />
            {backgroundTasks().map(({ id, Component }) => (
              <Component key={id} />
            ))}
          </div>
        </DialogProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
