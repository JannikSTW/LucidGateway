import { RouterProvider, createHashRouter, type RouteObject } from 'react-router-dom'
import { Shell } from './core/app/Shell'
import { ArchiveScreen } from './core/screens/ArchiveScreen'
import { CategoryScreen } from './core/screens/CategoryScreen'
import { DashboardScreen } from './core/screens/DashboardScreen'
import { EntryScreen } from './core/screens/EntryScreen'
import { JournalScreen } from './core/screens/JournalScreen'
import { PickScreen } from './core/screens/PickScreen'
import { SettingsScreen } from './core/screens/SettingsScreen'
import { SessionScreen } from './core/session/SessionScreen'
import { allRoutes } from './core/modules/registry'

/**
 * Hash-Routing, damit die App auch als Unterverzeichnis auf GitHub Pages und
 * vom Startbildschirm aus ohne Server-Umschreibungen funktioniert.
 */
export function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Shell />,
      children: [
        { index: true, element: <DashboardScreen /> },
        { path: 'neu', element: <PickScreen mode="capture" /> },
        { path: 'felder', element: <PickScreen mode="browse" /> },
        { path: 'archiv', element: <ArchiveScreen /> },
        { path: 'kategorie/:key', element: <CategoryScreen /> },
        { path: 'journal/:key', element: <JournalScreen /> },
        { path: 'journal/:key/:id', element: <JournalScreen /> },
        { path: 'eintrag/:id', element: <EntryScreen /> },
        { path: 'sitzung/:method', element: <SessionScreen /> },
        { path: 'einstellungen', element: <SettingsScreen /> },
        ...allRoutes(),
        { path: '*', element: <DashboardScreen /> },
      ],
    },
  ]
  return <RouterProvider router={createHashRouter(routes)} />
}
