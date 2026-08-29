import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { DialogProvider } from '../ui/dialog'
import { ToastProvider } from '../ui/toast'
import { ThemeProvider } from './ThemeProvider'

export function Shell() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DialogProvider>
          <div className="app">
            <Outlet />
            <BottomNav />
          </div>
        </DialogProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
