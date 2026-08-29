/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<{ url: string; revision: string | null }> }

/**
 * Eigener Service Worker: Er hält die App offline verfügbar und kümmert sich
 * um die Erinnerungen für Reality Checks. Es gibt keinen Server — die
 * Mitteilungen entstehen auf dem Gerät.
 */
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

self.addEventListener('message', (event) => {
  const data = event.data as { type?: string; title?: string; body?: string; tag?: string } | undefined
  if (data?.type === 'SKIP_WAITING') {
    void self.skipWaiting()
    return
  }
  // Der Kern schickt die fällige Frage; der Worker zeigt sie an.
  if (data?.type === 'RC_SHOW' && data.body) {
    event.waitUntil(
      self.registration.showNotification(data.title ?? 'Lucid Gateway', {
        body: data.body,
        tag: data.tag ?? 'reality-check',
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        data: { url: './#/reality-checks' },
      }),
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data as { url?: string } | undefined)?.url ?? './'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (list) => {
      for (const client of list) {
        if ('focus' in client) return client.focus()
      }
      return self.clients.openWindow(target)
    }),
  )
})
