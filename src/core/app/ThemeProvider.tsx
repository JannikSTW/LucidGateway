import { useEffect, type ReactNode } from 'react'
import { useSetting } from '../db/settings'

export type ThemeName = 'dark' | 'light'

export function useTheme(): [ThemeName, (t: ThemeName) => Promise<void>] {
  return useSetting<ThemeName>('theme', 'dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useTheme()
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'light' ? '#FBFAF7' : '#0C1018')
  }, [theme])
  return <>{children}</>
}
