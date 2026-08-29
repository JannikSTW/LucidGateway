import { table } from './db'
import type { StoredImage } from '../types'

/**
 * Bilder liegen als komprimierte Blobs in der Datenbank — local-first,
 * nichts verlässt das Gerät. Längste Kante ~2000 px (KONZEPT §6).
 */
const MAX_EDGE = 2000
const QUALITY = 0.82

export const imagesTable = () => table<StoredImage>('images')

export async function compress(file: Blob): Promise<{ blob: Blob; w: number; h: number }> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas nicht verfügbar')
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY))
  if (!blob) throw new Error('Bild konnte nicht komprimiert werden')
  return { blob, w, h }
}

export async function storeImage(file: Blob): Promise<number> {
  const { blob, w, h } = await compress(file)
  return (await imagesTable().add({ blob, w, h, createdAt: Date.now() })) as number
}

export async function loadImage(id: number): Promise<StoredImage | undefined> {
  return imagesTable().get(id)
}

export async function deleteImage(id: number): Promise<void> {
  await imagesTable().delete(id)
}

/**
 * Räumt Bilder weg, auf die kein Eintrag mehr zeigt — etwa weil eine Seite
 * beim Erfassen wieder entfernt und der Eintrag nie gesichert wurde.
 * Läuft einmal beim Start.
 */
export async function cleanupOrphanImages(): Promise<number> {
  const entries = await table<{ scans?: number[] }>('entries').toArray()
  const used = new Set<number>()
  for (const e of entries) for (const id of e.scans ?? []) used.add(id)
  const all = await imagesTable().toArray()
  const orphans = all.filter((img) => img.id !== undefined && !used.has(img.id)).map((img) => img.id!)
  if (orphans.length) await imagesTable().bulkDelete(orphans)
  return orphans.length
}
