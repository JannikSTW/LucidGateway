import { Empty } from '../../../core/ui/basics'
import { Legend, MapNote } from '../../../core/ui/data'
import { clip } from '../../../core/util/text'
import { NGROUPS, degreeOf, nkind } from '../db'
import { NetzGlyph } from './NetzGlyph'
import type { Netzwerk } from '../db'
import type { NetzGroup } from '../types'

const W = 340
const H = 330
const CX = W / 2
const CY = H / 2

/**
 * Karte des Umfelds. Eine Frage: Was trägt mein Projekt?
 * Zentrum = M3, Sektor = Gruppe, Entfernung = Vernetzungsgrad.
 */
export function NetzMap({ net, onOpen }: { net: Netzwerk; onOpen: (id: number) => void }) {
  if (!net.items.length) return <Empty>Noch nichts angelegt.</Empty>

  const maxDeg = Math.max(1, ...net.items.map((n) => degreeOf(net.links, n.id!)))
  const pos = new Map<number, { x: number; y: number }>()

  for (const g of Object.keys(NGROUPS) as NetzGroup[]) {
    const group = net.items.filter((n) => nkind(n.kind).grp === g)
    const base = NGROUPS[g].deg
    const span = 78
    group.forEach((n, i) => {
      const step = group.length > 1 ? span / (group.length - 1) : 0
      const ang = ((base - span / 2 + (group.length > 1 ? i * step : span / 2)) * Math.PI) / 180
      const r = 136 - (degreeOf(net.links, n.id!) / maxDeg) * 70
      pos.set(n.id!, { x: CX + r * Math.cos(ang), y: CY + r * Math.sin(ang) })
    })
  }

  return (
    <>
      <svg viewBox={`-16 -20 ${W + 32} ${H + 38}`} className="mapsvg">
        {[66, 101, 136].map((r) => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="var(--line)" strokeWidth=".6" strokeDasharray="2 6" />
        ))}
        {(Object.keys(NGROUPS) as NetzGroup[]).map((g) => {
          const a = (NGROUPS[g].deg * Math.PI) / 180
          return (
            <text
              key={g}
              x={(CX + 166 * Math.cos(a)).toFixed(1)}
              y={(CY + 166 * Math.sin(a)).toFixed(1)}
              textAnchor="middle"
              fontSize="9"
              fill={NGROUPS[g].color}
              opacity=".85"
            >
              {NGROUPS[g].label.split(' & ')[0]}
            </text>
          )
        })}

        {net.links.map((l) => {
          const A = pos.get(l.a)
          const B = pos.get(l.b)
          if (!A || !B) return null
          return (
            <line
              key={l.id}
              x1={A.x.toFixed(1)}
              y1={A.y.toFixed(1)}
              x2={B.x.toFixed(1)}
              y2={B.y.toFixed(1)}
              stroke="var(--mist)"
              strokeOpacity=".35"
              strokeWidth="1.1"
            />
          )
        })}

        {net.items.map((n) => {
          const p = pos.get(n.id!)
          if (!p) return null
          const c = nkind(n.kind).color
          const size = 13
          return (
            <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => onOpen(n.id!)}>
              <circle
                cx={p.x.toFixed(1)}
                cy={p.y.toFixed(1)}
                r={size}
                fill={`color-mix(in srgb, ${c} 15%, transparent)`}
                stroke={c}
                strokeWidth="1.4"
              />
              <NetzGlyph kind={n.kind} x={p.x} y={p.y} scale={1.05} color={c} />
              {n.next && (
                <circle
                  cx={(p.x + size * 0.78).toFixed(1)}
                  cy={(p.y - size * 0.78).toFixed(1)}
                  r="3.2"
                  fill="var(--red)"
                />
              )}
              <text
                x={p.x.toFixed(1)}
                y={(p.y + size + 11).toFixed(1)}
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--mist)"
              >
                {clip(n.name, 15)}
              </text>
            </g>
          )
        })}

        <circle cx={CX} cy={CY} r="23" fill="var(--cat-mmm-tint)" stroke="var(--red)" strokeWidth="1.9" />
        <text x={CX} y={CY + 6} textAnchor="middle" fontSize="17" fill="var(--red-fg)" fontFamily="Georgia, serif">
          M3
        </text>
      </svg>

      <Legend
        center
        items={[
          ...Object.values(NGROUPS).map((g) => ({
            label: g.label.split(' & ')[0],
            glyph: <i style={{ background: g.color, borderRadius: '50%', width: 9, height: 9 }} />,
          })),
          {
            label: 'offener Schritt',
            glyph: <i style={{ background: 'var(--red)', borderRadius: '50%', width: 9, height: 9 }} />,
          },
        ]}
      />
      <MapNote>Sektor = Art · innen = stark verknüpft · Linien = Verbindungen</MapNote>
    </>
  )
}
