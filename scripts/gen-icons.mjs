/**
 * Erzeugt die PWA-Icons ohne externe Abhängigkeiten.
 * Motiv: Mondsichel mit Sternen — dasselbe Zeichen wie die Kategorie „Luzides Träumen“.
 * Aufruf: npm run icons
 */
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons')

const INK = [0x0c, 0x10, 0x18]
const VIOLET = [0x8b, 0x7c, 0xf6]
const PAPER = [0xed, 0xee, 0xf3]

const SS = 4 // Supersampling für weiche Kanten

function mix(bg, fg, a) {
  return [0, 1, 2].map((i) => Math.round(bg[i] * (1 - a) + fg[i] * a))
}

function crc32(buf) {
  let c
  const table = crc32.table || (crc32.table = Array.from({ length: 256 }, (_, n) => {
    c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    return c >>> 0
  }))
  let crc = 0xffffffff
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function png(width, height, rgb) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // truecolour
  const raw = Buffer.alloc(height * (width * 3 + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0 // filter: none
    for (let x = 0; x < width; x++) {
      const s = (y * width + x) * 3
      const d = y * (width * 3 + 1) + 1 + x * 3
      raw[d] = rgb[s]
      raw[d + 1] = rgb[s + 1]
      raw[d + 2] = rgb[s + 2]
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** Zeichnet das Motiv in normalisierten Koordinaten (0..1). */
function coverage(u, v, inset) {
  // Motiv sitzt in einem Quadrat mit `inset` Rand (für maskable größer).
  const s = 1 - 2 * inset
  const x = (u - inset) / s
  const y = (v - inset) / s
  if (x < 0 || x > 1 || y < 0 || y > 1) return null

  const d = (cx, cy) => Math.hypot(x - cx, y - cy)
  // Mondsichel: großer Kreis minus versetzter Kreis
  const moon = d(0.56, 0.5) <= 0.335 && d(0.4, 0.4) > 0.29
  if (moon) return 'moon'
  // Sterne
  const stars = [
    [0.2, 0.22, 0.036],
    [0.13, 0.47, 0.028],
    [0.26, 0.72, 0.03],
    [0.36, 0.9, 0.022],
  ]
  for (const [cx, cy, r] of stars) if (d(cx, cy) <= r) return 'star'
  return null
}

function render(size, { inset = 0.14, radius = 0.1875 } = {}) {
  const rgb = Buffer.alloc(size * size * 3)
  const r = radius * size
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let moon = 0
      let star = 0
      let inside = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS
          const py = y + (sy + 0.5) / SS
          // abgerundetes Quadrat
          const dx = Math.max(r - px, px - (size - r), 0)
          const dy = Math.max(r - py, py - (size - r), 0)
          if (Math.hypot(dx, dy) > r) continue
          inside++
          const hit = coverage(px / size, py / size, inset)
          if (hit === 'moon') moon++
          else if (hit === 'star') star++
        }
      }
      const n = SS * SS
      let color = mix([7, 9, 14], INK, inside / n)
      if (moon) color = mix(color, VIOLET, moon / n)
      if (star) color = mix(color, PAPER, star / n)
      const o = (y * size + x) * 3
      rgb[o] = color[0]
      rgb[o + 1] = color[1]
      rgb[o + 2] = color[2]
    }
  }
  return png(size, size, rgb)
}

mkdirSync(OUT, { recursive: true })
writeFileSync(`${OUT}/icon-512.png`, render(512))
writeFileSync(`${OUT}/icon-192.png`, render(192))
writeFileSync(`${OUT}/apple-touch-icon.png`, render(180, { radius: 0 }))
// maskable: Motiv in der sicheren Zone (80 %), Hintergrund randlos
writeFileSync(`${OUT}/maskable-512.png`, render(512, { inset: 0.26, radius: 0 }))

writeFileSync(
  `${OUT}/favicon.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0C1018"/>
  <g fill="none" stroke="#8B7CF6" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 6a9.5 9.5 0 1 1-9.9 15.4A11.5 11.5 0 0 0 22 6Z"/>
  </g>
  <g fill="#EDEEF3">
    <circle cx="8.5" cy="8" r="0.9"/><circle cx="6" cy="14" r="0.8"/><circle cx="11" cy="4" r="0.7"/>
  </g>
</svg>
`,
)

console.log('Icons geschrieben nach', OUT)
