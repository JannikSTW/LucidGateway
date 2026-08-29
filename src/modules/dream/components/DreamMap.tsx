import { Empty } from '../../../core/ui/basics'
import { Legend, MapNote } from '../../../core/ui/data'
import { clip } from '../../../core/util/text'
import { REGISTERS, dreamEntries } from '../db'
import { Glyph, GlyphBadge } from './glyphs'
import type { DreamWorld } from '../db'
import type { RegisterKey } from '../types'

const W = 340
const H = 310
const CX = W / 2
const CY = H / 2
const RINGS = [62, 82, 102, 128]

interface Node {
  name: string
  reg: RegisterKey
  n: number
}

/** Ko-Vorkommen: zwei Elemente sind verbunden, wenn sie im selben Traum vorkamen. */
function network(world: DreamWorld) {
  const nodes = new Map<string, Node>()
  const edges = new Map<string, number>()

  for (const e of dreamEntries(world.entries)) {
    const flat: string[] = []
    for (const [reg, names] of Object.entries(e.els ?? {})) {
      for (const name of names) {
        flat.push(name)
        const node = nodes.get(name) ?? { name, reg: reg as RegisterKey, n: 0 }
        node.n += 1
        nodes.set(name, node)
      }
    }
    for (let i = 0; i < flat.length; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        const key = [flat[i], flat[j]].sort().join('||')
        edges.set(key, (edges.get(key) ?? 0) + 1)
      }
    }
  }

  // Verknüpfte und als Stützpunkt gesetzte Elemente gehören auch dann auf die
  // Karte, wenn sie noch in keinem Traum vorkamen.
  for (const l of world.links) {
    for (const side of [l.a, l.b]) {
      if (!nodes.has(side.name)) nodes.set(side.name, { name: side.name, reg: side.reg, n: 0 })
    }
  }
  if (world.anchor && !nodes.has(world.anchor.name)) {
    nodes.set(world.anchor.name, { name: world.anchor.name, reg: world.anchor.reg, n: 0 })
  }

  return { nodes: [...nodes.values()].sort((a, b) => b.n - a.n), edges }
}

/** Wie oft ein Element gemeinsam mit dem Stützpunkt geträumt wurde. */
function sharedWithAnchor(world: DreamWorld, name: string): number {
  if (!world.anchor) return 0
  return dreamEntries(world.entries).filter((e) => {
    const flat = Object.values(e.els ?? {}).flat()
    return flat.includes(world.anchor!.name) && flat.includes(name)
  }).length
}

export const LINK_TYPES: { key: string; label: string; color: string }[] = [
  { key: 'ist_teil', label: 'ist Teil von', color: 'var(--amber-fg)' },
  { key: 'fuehrt_zu', label: 'führt zu', color: 'var(--violet-fg)' },
  { key: 'begleitet', label: 'taucht auf mit', color: 'var(--teal-fg)' },
  { key: 'gegen', label: 'steht im Gegensatz zu', color: 'var(--red-fg)' },
  { key: 'verwandelt', label: 'verwandelt sich in', color: 'var(--rose-fg)' },
]

export const linkLabel = (k: string) => LINK_TYPES.find((t) => t.key === k)?.label ?? k
export const linkColor = (k: string) => LINK_TYPES.find((t) => t.key === k)?.color ?? 'var(--violet-fg)'

/**
 * Die Karte der Traumwelt. Eine Frage: Was gehört in meiner Traumwelt zusammen?
 * Entfernung = Häufigkeit gemeinsamen Auftretens, Größe = wie oft insgesamt.
 */
export function DreamMap({ world, onOpen }: { world: DreamWorld; onOpen: (reg: RegisterKey, name: string) => void }) {
  const { nodes, edges } = network(world)
  if (!nodes.length) {
    return (
      <Empty>
        Die Karte wächst, sobald du beim Traumeintrag Orte, Gestalten oder Zeichen antippst — oder Elemente
        miteinander verknüpfst.
      </Empty>
    )
  }

  const anchorNode = world.anchor ? nodes.find((n) => n.name === world.anchor!.name) : undefined
  const ring = anchorNode ? nodes.filter((n) => n.name !== anchorNode.name).slice(0, 11) : nodes.slice(0, 12)

  const pos = new Map<string, { x: number; y: number }>()
  ring.forEach((node, i) => {
    const a = ((-90 + (i * 360) / Math.max(ring.length, 3)) * Math.PI) / 180
    let r: number
    if (anchorNode) {
      const shared = sharedWithAnchor(world, node.name)
      const linked = world.links.some(
        (l) =>
          (l.a.name === anchorNode.name && l.b.name === node.name) ||
          (l.b.name === anchorNode.name && l.a.name === node.name),
      )
      r = shared >= 3 ? RINGS[0] : shared === 2 ? RINGS[1] : shared === 1 ? RINGS[2] : linked ? 92 : RINGS[3]
    } else {
      r = 118 - Math.min(node.n, 5) * 9
    }
    pos.set(node.name, { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) })
  })
  if (anchorNode) pos.set(anchorNode.name, { x: CX, y: CY })

  const colorOf = (reg: RegisterKey) => REGISTERS[reg].color

  return (
    <>
      <svg viewBox={`-10 -14 ${W + 20} ${H + 40}`} className="mapsvg">
        {anchorNode &&
          RINGS.map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="var(--line)"
              strokeWidth=".6"
              strokeDasharray="2 6"
            />
          ))}

        {/* gemeinsam geträumt — gestrichelt, dicker bei häufigerem Auftreten */}
        {[...edges.entries()].map(([key, weight]) => {
          const [a, b] = key.split('||')
          const A = pos.get(a)
          const B = pos.get(b)
          if (!A || !B) return null
          const w = Math.min(weight, 4)
          return (
            <line
              key={key}
              x1={A.x.toFixed(1)}
              y1={A.y.toFixed(1)}
              x2={B.x.toFixed(1)}
              y2={B.y.toFixed(1)}
              stroke="var(--mist)"
              strokeOpacity={0.14 + w * 0.07}
              strokeWidth={w}
              strokeDasharray="3 3"
            />
          )
        })}

        {/* von Hand verknüpft — durchgezogen in der Farbe der Art */}
        {world.links.map((l) => {
          const A = pos.get(l.a.name)
          const B = pos.get(l.b.name)
          if (!A || !B) return null
          const c = linkColor(l.type)
          return (
            <g key={l.id}>
              <line
                x1={A.x.toFixed(1)}
                y1={A.y.toFixed(1)}
                x2={B.x.toFixed(1)}
                y2={B.y.toFixed(1)}
                stroke={c}
                strokeOpacity=".75"
                strokeWidth="1.8"
              />
              <circle cx={((A.x + B.x) / 2).toFixed(1)} cy={((A.y + B.y) / 2).toFixed(1)} r="2.6" fill={c} />
            </g>
          )
        })}

        {ring.map((node) => {
          const p = pos.get(node.name)!
          const size = 9 + Math.min(node.n, 6) * 2
          const c = colorOf(node.reg)
          return (
            <g key={node.name} style={{ cursor: 'pointer' }} onClick={() => onOpen(node.reg, node.name)}>
              <circle
                cx={p.x.toFixed(1)}
                cy={p.y.toFixed(1)}
                r={size}
                fill={`color-mix(in srgb, ${c} 15%, transparent)`}
                stroke={c}
                strokeWidth="1.4"
              />
              <Glyph kind={node.reg} x={p.x} y={p.y} scale={Math.min(size / 9.5, 1.35)} color={c} />
              <text
                x={p.x.toFixed(1)}
                y={(p.y + size + 11).toFixed(1)}
                textAnchor="middle"
                fontSize="9"
                fill="var(--mist)"
              >
                {clip(node.name, 14)}
              </text>
            </g>
          )
        })}

        {anchorNode && (
          <g style={{ cursor: 'pointer' }} onClick={() => onOpen(anchorNode.reg, anchorNode.name)}>
            <circle
              cx={CX}
              cy={CY}
              r="31"
              fill="none"
              stroke="var(--anchor)"
              strokeOpacity=".35"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle
              cx={CX}
              cy={CY}
              r="22"
              fill="color-mix(in srgb, var(--anchor) 18%, transparent)"
              stroke="var(--anchor)"
              strokeWidth="1.9"
            />
            <Glyph kind="anchor" x={CX} y={CY - 0.5} scale={1.5} color="var(--anchor)" />
            <text x={CX} y={CY + 40} textAnchor="middle" fontSize="9.5" fill="var(--anchor)">
              {clip(anchorNode.name, 18)}
            </text>
          </g>
        )}
      </svg>

      <Legend
        center
        items={[
          { label: 'Orte', glyph: <GlyphBadge kind="ort" color={REGISTERS.ort.color} size={16} /> },
          { label: 'Gestalten', glyph: <GlyphBadge kind="person" color={REGISTERS.person.color} size={16} /> },
          { label: 'Zeichen', glyph: <GlyphBadge kind="zeichen" color={REGISTERS.zeichen.color} size={16} /> },
          ...(anchorNode
            ? [{ label: 'Stützpunkt', glyph: <GlyphBadge kind="anchor" color="var(--anchor)" size={16} /> }]
            : []),
        ]}
      />

      <MapNote>
        {anchorNode ? (
          <>
            Nähe zum Stützpunkt = wie oft gemeinsam geträumt
            <br />
            gestrichelt: gemeinsam geträumt · durchgezogen: von dir verknüpft
          </>
        ) : (
          <>
            Gestrichelt: gemeinsam geträumt · Durchgezogen: von dir verknüpft
            <br />
            Einen Ort im Register öffnen, um ihn zum Stützpunkt zu machen
          </>
        )}
      </MapNote>

      {world.links.length > 0 && (
        <Legend
          center
          items={[...new Set(world.links.map((l) => l.type))].map((t) => ({
            label: linkLabel(t),
            color: linkColor(t),
            line: true,
          }))}
        />
      )}
    </>
  )
}
